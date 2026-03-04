import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Agency } from "@/lib/models/Agency";
import { Subscription } from "@/lib/models/Subscription";
import { PLAN_FEATURES } from "@/lib/models/Subscription";
import { createToken, generateSlug, isSlugReserved } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, password, phone, userType, leadScoreData, agencyName, agencyProvince } = body;

    // Validación básica
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Nombre, email y contraseña son requeridos" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 });
    }

    // Verificar email único
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Ya existe una cuenta con este email" }, { status: 409 });
    }

    // Generar slug único para el perfil
    let slug = generateSlug(name);
    let slugAttempts = 0;
    while ((await User.findOne({ fichaDigitalSlug: slug })) || isSlugReserved(slug)) {
      slug = generateSlug(name);
      slugAttempts++;
      if (slugAttempts > 10) {
        slug = generateSlug(name + Date.now().toString(36));
        break;
      }
    }

    // Hashear contraseña
    const passwordHash = await bcrypt.hash(password, 12);

    // Determinar rol
    const role = userType === "agencia" ? "lider_agencia" : "agente_independiente";

    // Crear suscripción free
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 100); // "gratis para siempre"

    const subscription = await Subscription.create({
      plan: "free",
      status: "active",
      priceUSD: 0,
      billingCycle: "monthly",
      startDate: new Date(),
      endDate,
      features: PLAN_FEATURES.free,
    });

    // Crear usuario (subscriptionId se asigna después por compatibilidad de tipos Mongoose v8)
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      phone: phone || null,
      role,
      fichaDigitalSlug: slug,
      publicProfile: {
        displayName: name,
        bio: "",
        avatarUrl: "",
        whatsappNumber: phone?.replace(/\D/g, "") || "",
        whatsappMessage: "Hola, vi tu perfil en Listo.cr y me interesa una propiedad.",
        showPropertyCount: true,
        totalViews: 0,
        totalClicks: 0,
        socialLinks: {},
      },
      leadScore: {
        experienceYears: leadScoreData?.experienceYears || 0,
        monthlyDeals: leadScoreData?.monthlyDeals || 0,
        hasPortfolio: false,
        currentTool: leadScoreData?.currentTool || "",
        biggestChallenge: leadScoreData?.biggestChallenge || "",
        score: 0,
      },
    });

    // Vincular subscriptionId en el usuario y userId en la suscripción
    await Promise.all([
      User.findByIdAndUpdate(user._id, { subscriptionId: subscription._id }),
      Subscription.findByIdAndUpdate(subscription._id, { userId: user._id }),
    ]);

    // Si es agencia, crear Agency (usar strings para compatibilidad de tipos Mongoose v8)
    if (userType === "agencia" && agencyName) {
      const agencySlug = generateSlug(agencyName);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const agencyData: any = {
        name: agencyName,
        slug: agencySlug,
        ownerId: user._id,
        agentIds: [user._id],
        contactEmail: email.toLowerCase(),
        province: agencyProvince || "San Jose",
        subscriptionId: subscription._id,
      };
      const agency = await Agency.create(agencyData);
      await User.findByIdAndUpdate(user._id, { agencyId: agency._id });
    }

    // Generar JWT
    const token = await createToken({
      userId: String(user._id),
      role: user.role,
      slug: user.fichaDigitalSlug,
      email: user.email,
    });

    // Responder con cookie segura
    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
          fichaDigitalSlug: user.fichaDigitalSlug,
        },
        fichaSlug: slug,
      },
    });

    response.cookies.set("listo-auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

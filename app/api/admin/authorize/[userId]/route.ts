import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { getAuthUser } from "@/lib/auth";
import nodemailer from "nodemailer";

async function sendApprovalEmail(to: string, name: string) {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT ?? "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM ?? "Listo.cr <noreply@listo.cr>";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://listo.cr";

  // Si no hay config SMTP, solo logear
  if (!host || !user || !pass) {
    console.log(`[EMAIL] Cuenta aprobada para ${to} — configura SMTP para enviar emails.`);
    return;
  }

  const transporter = nodemailer.createTransport({ host, port, auth: { user, pass } });

  await transporter.sendMail({
    from,
    to,
    subject: "¡Tu cuenta en Listo.cr fue aprobada!",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px">
        <h1 style="color:#111827;font-size:24px;margin-bottom:8px">¡Bienvenido, ${name}!</h1>
        <p style="color:#6b7280;margin-bottom:24px">
          Tu cuenta en Listo.cr ha sido <strong style="color:#10b981">aprobada</strong>.
          Ya puedes ingresar y completar tu Identidad Digital.
        </p>
        <a href="${appUrl}/login"
           style="display:inline-block;background:#10b981;color:#fff;text-decoration:none;
                  padding:12px 28px;border-radius:12px;font-weight:600;font-size:15px">
          Ingresar a mi cuenta →
        </a>
        <p style="color:#9ca3af;font-size:13px;margin-top:32px">
          Listo.cr · Profesionaliza tu negocio inmobiliario en Costa Rica
        </p>
      </div>
    `,
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const auth = await getAuthUser();
    if (!auth || auth.role !== "super_admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await connectDB();
    const { userId } = await params;
    const body = await req.json();
    const action: "approve" | "reject" = body.action;
    const reason: string | undefined = body.reason;

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    if (action === "approve") {
      user.isAuthorized = true;
      user.approvalStatus = "approved";
      await user.save();
      // Enviar email fire-and-forget
      sendApprovalEmail(user.email, user.name).catch(console.error);
    } else {
      user.isAuthorized = false;
      user.approvalStatus = "rejected";
      if (reason) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (user as any).rejectionReason = reason;
      }
      await user.save();
    }

    return NextResponse.json({
      success: true,
      data: {
        userId: String(user._id),
        approvalStatus: user.approvalStatus,
        isAuthorized: user.isAuthorized,
      },
    });
  } catch (error) {
    console.error("Error al autorizar usuario:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

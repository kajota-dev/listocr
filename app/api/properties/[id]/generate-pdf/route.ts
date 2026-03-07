import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { connectDB } from "@/lib/mongodb";
import { Property } from "@/lib/models/Property";
import { User } from "@/lib/models/User";
import { getAuthUser } from "@/lib/auth";
import PropertyBrochurePDF from "@/components/dashboard/property/PropertyBrochurePDF";
import type { IProperty, IUser } from "@/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    const property = await Property.findById(id).lean();
    if (!property) {
      return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
    }

    const agent = await User.findById(property.ownerId)
      .select("-passwordHash")
      .lean();

    const pdfBuffer = await renderToBuffer(
      // @ts-expect-error: react-pdf renderToBuffer expects DocumentProps element type but runtime accepts any React element
      createElement(PropertyBrochurePDF, {
        property: property as unknown as IProperty,
        agent: (agent ?? {}) as Partial<IUser>,
      })
    );

    const safeName = (property.title as string)
      .replace(/[^a-z0-9\s]/gi, "")
      .replace(/\s+/g, "-")
      .toLowerCase()
      .slice(0, 60);

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="reporte-${safeName}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error al generar PDF:", error);
    return NextResponse.json({ error: "Error al generar el PDF" }, { status: 500 });
  }
}

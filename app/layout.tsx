import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Listo.cr — Tu Ficha Digital Profesional",
    template: "%s | Listo.cr",
  },
  description:
    "La plataforma para agentes inmobiliarios de Costa Rica. Crea tu ficha digital, comparte tus propiedades con QR y cierra más negocios.",
  keywords: ["inmobiliaria", "costa rica", "agente inmobiliario", "propiedades", "QR", "ficha digital"],
  authors: [{ name: "Listo.cr" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://listo.cr"),
  openGraph: {
    type: "website",
    locale: "es_CR",
    url: "https://listo.cr",
    siteName: "Listo.cr",
    title: "Listo.cr — Tu Ficha Digital Profesional",
    description: "Vende más, gestiona menos. La plataforma de identidad digital para agentes inmobiliarios de Costa Rica.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

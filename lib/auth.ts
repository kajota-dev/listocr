import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

export interface JWTPayload {
  userId: string;
  role: string;
  slug: string;
  email: string;
}

// Codificar JWT manualmente (sin dependencia extra)
function base64url(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export async function createToken(payload: JWTPayload): Promise<string> {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64url(
    JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 })
  );

  const { createHmac } = await import("crypto");
  const signature = createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return `${header}.${body}.${signature}`;
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const [header, body, signature] = token.split(".");
    const { createHmac } = await import("crypto");
    const expectedSig = createHmac("sha256", JWT_SECRET)
      .update(`${header}.${body}`)
      .digest("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    if (signature !== expectedSig) return null;

    const payload = JSON.parse(Buffer.from(body, "base64").toString());
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload as JWTPayload;
  } catch {
    return null;
  }
}

export async function getAuthUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("listo-auth-token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// Genera slug único a partir del nombre
export function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 30);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

// Verifica si un slug está disponible (no es una ruta del sistema)
export const RESERVED_SLUGS = [
  "registro", "login", "logout", "dashboard", "api", "admin",
  "u", "_next", "favicon", "public", "about", "pricing", "help",
];

export function isSlugReserved(slug: string): boolean {
  return RESERVED_SLUGS.includes(slug);
}

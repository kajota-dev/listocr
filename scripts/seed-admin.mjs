/**
 * Script para crear el usuario super_admin en MongoDB.
 * Ejecutar con: node scripts/seed-admin.mjs
 *
 * Requiere que MONGODB_URI esté en .env.local o seteado en el entorno.
 */

import { createRequire } from "module";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Leer .env.local manualmente
try {
  const envPath = resolve(__dirname, "../.env.local");
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) {
      process.env[key.trim()] = rest.join("=").trim();
    }
  }
} catch {
  // .env.local no existe, continuar con variables de entorno del sistema
}

const require = createRequire(import.meta.url);
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌  Falta MONGODB_URI en .env.local");
  process.exit(1);
}

// Config del admin
const ADMIN_EMAIL    = "admin@listo.cr";
const ADMIN_PASSWORD = "Admin1234!";  // Cámbialo después de ingresar
const ADMIN_NAME     = "Super Admin";
const ADMIN_SLUG     = "super-admin";

await mongoose.connect(MONGODB_URI, { bufferCommands: false });
console.log("✅  Conectado a MongoDB");

// Schema mínimo (solo lo necesario para el insert)
const UserSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User ?? mongoose.model("User", UserSchema);

// Verificar si ya existe
const existing = await User.findOne({ email: ADMIN_EMAIL });
if (existing) {
  console.log(`⚠️   Ya existe un usuario con email ${ADMIN_EMAIL}`);
  console.log(`     Role actual: ${existing.role}`);
  console.log(`     Slug: ${existing.fichaDigitalSlug}`);
  await mongoose.disconnect();
  process.exit(0);
}

const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

await User.create({
  name: ADMIN_NAME,
  email: ADMIN_EMAIL,
  passwordHash,
  role: "super_admin",
  fichaDigitalSlug: ADMIN_SLUG,
  isActive: true,
  publicProfile: {
    displayName: ADMIN_NAME,
    bio: "",
    avatarUrl: "",
    whatsappNumber: "",
    showPropertyCount: false,
    totalViews: 0,
    totalClicks: 0,
    socialLinks: {},
  },
  leadScore: {
    experienceYears: 0,
    monthlyDeals: 0,
    hasPortfolio: false,
    currentTool: "",
    biggestChallenge: "",
    score: 0,
  },
});

console.log("✅  Usuario super_admin creado:");
console.log(`     Email:    ${ADMIN_EMAIL}`);
console.log(`     Password: ${ADMIN_PASSWORD}`);
console.log(`     Slug:     ${ADMIN_SLUG}`);
console.log("");
console.log("→  Inicia el servidor y ve a /login para entrar.");
console.log("→  Después de ingresar, cambia la contraseña.");

await mongoose.disconnect();

// =============================================
// TIPOS GLOBALES - LISTO.CR
// =============================================

// --- Enums y Literales ---

export type UserRole =
  | "agente_independiente"
  | "lider_agencia"
  | "agente_empresa"
  | "super_admin";

export type SubscriptionPlan = "free" | "pro" | "business";

export type PropertyType =
  | "casa"
  | "apartamento"
  | "terreno"
  | "local_comercial"
  | "bodega"
  | "oficina";

export type PropertyStatus =
  | "disponible"
  | "reservado"
  | "vendido"
  | "alquilado"
  | "inactivo";

export type PropertyOperation = "venta" | "alquiler" | "ambos";

export type CostaRicaProvince =
  | "San Jose"
  | "Alajuela"
  | "Cartago"
  | "Heredia"
  | "Guanacaste"
  | "Puntarenas"
  | "Limon";

// --- Identidad Digital Viva ---

export interface IPublicProfile {
  displayName: string;
  bio: string;
  avatarUrl: string;
  coverImageUrl?: string;
  whatsappNumber: string;
  whatsappMessage?: string;
  email?: string;
  phone?: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    tiktok?: string;
    website?: string;
  };
  metaTitle?: string;
  metaDescription?: string;
  showPropertyCount: boolean;
  accentColor?: string;
  totalViews: number;
  totalClicks: number;
  lastViewedAt?: Date;
}

// --- Entidades Principales ---

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  agencyId?: string;
  subscriptionId?: string;
  fichaDigitalSlug: string;
  properties: string[];
  publicProfile: IPublicProfile;
  leadScore?: LeadScore;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAgency {
  _id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  ownerId: string;
  agentIds: string[];
  subscriptionId?: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  address?: string;
  province: CostaRicaProvince;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProperty {
  _id: string;
  title: string;
  description: string;
  type: PropertyType;
  operation: PropertyOperation;
  price: number;
  currency: "CRC" | "USD";
  province: CostaRicaProvince;
  canton: string;
  district?: string;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpots?: number;
  areaM2?: number;
  lotM2?: number;
  amenities: string[];
  images: string[];
  videoUrl?: string;
  status: PropertyStatus;
  ownerId: string;
  agencyId?: string;
  featured: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscription {
  _id: string;
  userId?: string;
  agencyId?: string;
  plan: SubscriptionPlan;
  status: "active" | "canceled" | "expired" | "trialing";
  priceUSD: number;
  billingCycle: "monthly" | "annual";
  startDate: Date;
  endDate: Date;
  features: PlanFeatures;
  createdAt: Date;
  updatedAt: Date;
}

// --- Tipos Auxiliares ---

export interface LeadScore {
  experienceYears: number;
  monthlyDeals: number;
  hasPortfolio: boolean;
  currentTool: string;
  biggestChallenge: string;
  score: number;
}

export interface PlanFeatures {
  maxProperties: number;
  maxAgents: number;
  fichaDigital: boolean;
  qrCodes: boolean;
  analytics: boolean;
  whatsappIntegration: boolean;
  prioritySupport: boolean;
  customBranding: boolean;
}

// --- Formulario de Registro Multi-paso ---

export interface RegisterFormState {
  step: 1 | 2 | 3 | 4;
  userType: "independiente" | "agencia" | null;
  leadScoreData: Partial<LeadScore> & {
    agentCount?: string;
    activeProperties?: string;
    currentSystem?: string;
    growthBlocker?: string;
  };
  email: string;
  password: string;
  name: string;
  phone: string;
  fichaSlug?: string;
}

// --- Pricing ---

export interface PricingTier {
  id: SubscriptionPlan;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  highlight: boolean;
  ctaLabel: string;
  features: string[];
  features_excluded: string[];
}

// --- Componentes Compartidos ---

export interface MetricCardProps {
  title: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  icon: React.ReactNode;
  suffix?: string;
}

export interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  active?: boolean;
}

// --- Respuestas de API ---

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface RegisterApiResponse {
  user: Omit<IUser, "publicProfile"> & { publicProfile: Omit<IPublicProfile, "totalViews" | "totalClicks"> };
  fichaSlug: string;
}

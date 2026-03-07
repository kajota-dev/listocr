import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { IProperty, IUser } from "@/types";

// Colores de marca
const BRAND = {
  emerald: "#10b981",
  dark:    "#111827",
  muted:   "#6b7280",
  border:  "#e5e7eb",
  surface: "#f9fafb",
  white:   "#ffffff",
};

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", backgroundColor: BRAND.white },

  // Página 1
  coverImage: { width: "100%", height: 380, objectFit: "cover" },
  coverOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 32,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  coverBadge: {
    alignSelf: "flex-start",
    backgroundColor: BRAND.emerald,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  coverBadgeText: { color: BRAND.white, fontSize: 10, fontWeight: "bold" },
  coverTitle: { color: BRAND.white, fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  coverPrice: { color: BRAND.emerald, fontSize: 20, fontWeight: "bold" },
  coverLocation: { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 4 },

  // Sección inferior página 1
  page1Bottom: { padding: 32, flexDirection: "row", gap: 16 },
  infoBlock: { flex: 1, backgroundColor: BRAND.surface, borderRadius: 12, padding: 16 },
  infoLabel: { fontSize: 9, color: BRAND.muted, textTransform: "uppercase", letterSpacing: 0.5 },
  infoValue: { fontSize: 14, fontWeight: "bold", color: BRAND.dark, marginTop: 4 },

  // Agente pie de página 1
  agentRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: "16 32",
    borderTopWidth: 1,
    borderTopColor: BRAND.border,
    gap: 12,
  },
  agentAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: BRAND.emerald },
  agentAvatarText: { color: BRAND.white, fontSize: 16, fontWeight: "bold", textAlign: "center", marginTop: 11 },
  agentName: { fontSize: 13, fontWeight: "bold", color: BRAND.dark },
  agentRole: { fontSize: 10, color: BRAND.muted },
  logoText: { marginLeft: "auto", fontSize: 16, fontWeight: "bold", color: BRAND.emerald },

  // Página 2
  page2: { padding: 32 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: BRAND.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 16,
  },
  detailsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  detailChip: {
    backgroundColor: BRAND.surface,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: "row",
    gap: 4,
  },
  detailKey: { fontSize: 9, color: BRAND.muted },
  detailVal: { fontSize: 10, fontWeight: "bold", color: BRAND.dark },
  description: { fontSize: 11, color: BRAND.muted, lineHeight: 1.6 },

  coverImageFallback: { width: "100%", height: 380, backgroundColor: "#10b981" },
  legalRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  legalDot: { width: 8, height: 8, borderRadius: 4 },
  legalDotPending: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#e5e7eb" },
  legalText: { fontSize: 10, color: BRAND.dark },

  footer: {
    position: "absolute",
    bottom: 24,
    left: 32,
    right: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: BRAND.border,
    paddingTop: 12,
  },
  footerText: { fontSize: 9, color: BRAND.muted },
  footerLogo: { fontSize: 11, fontWeight: "bold", color: BRAND.emerald },
});

interface PropertyBrochurePDFProps {
  property: IProperty;
  agent: Partial<IUser & { displayName?: string; whatsappNumber?: string }>;
}

function DetailChip({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.detailChip}>
      <Text style={styles.detailKey}>{label}: </Text>
      <Text style={styles.detailVal}>{value}</Text>
    </View>
  );
}

export default function PropertyBrochurePDF({ property, agent }: PropertyBrochurePDFProps) {
  const displayName = agent.publicProfile?.displayName ?? agent.name ?? "Agente";
  const initial = displayName.charAt(0).toUpperCase();

  const details: { label: string; value: string | number }[] = [
    ...(property.bedrooms  != null ? [{ label: "Habitaciones", value: property.bedrooms  }] : []),
    ...(property.bathrooms != null ? [{ label: "Baños",        value: property.bathrooms }] : []),
    ...(property.areaM2    != null ? [{ label: "Área",         value: `${property.areaM2} m²`}] : []),
    ...(property.lotM2     != null ? [{ label: "Lote",         value: `${property.lotM2} m²` }] : []),
    ...(property.parkingSpots != null ? [{ label: "Parqueos",  value: property.parkingSpots  }] : []),
    { label: "Tipo",       value: property.type      },
    { label: "Operación",  value: property.operation },
    { label: "Provincia",  value: property.province  },
    { label: "Cantón",     value: property.canton    },
  ];

  return (
    <Document>
      {/* PÁGINA 1 — Portada */}
      <Page size="A4" style={styles.page}>
        {/* Imagen principal */}
        {property.images?.[0] ? (
          <Image src={property.images[0]} style={styles.coverImage} />
        ) : (
          <View style={styles.coverImageFallback} />
        )}

        {/* Overlay con info */}
        <View style={styles.coverOverlay}>
          <View style={styles.coverBadge}>
            <Text style={styles.coverBadgeText}>
              {property.operation.toUpperCase()} · {property.type.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.coverTitle}>{property.title}</Text>
          <Text style={styles.coverPrice}>
            {property.currency} {property.price.toLocaleString()}
          </Text>
          <Text style={styles.coverLocation}>
            {property.province}, {property.canton}
            {property.district ? `, ${property.district}` : ""}
          </Text>
        </View>

        {/* Métricas clave */}
        <View style={styles.page1Bottom}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Precio</Text>
            <Text style={styles.infoValue}>{property.currency} {property.price.toLocaleString()}</Text>
          </View>
          {property.areaM2 != null && (
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Área total</Text>
              <Text style={styles.infoValue}>{property.areaM2} m²</Text>
            </View>
          )}
          {property.bedrooms != null && (
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Habitaciones</Text>
              <Text style={styles.infoValue}>{property.bedrooms}</Text>
            </View>
          )}
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Estado</Text>
            <Text style={styles.infoValue}>{property.status}</Text>
          </View>
        </View>

        {/* Agente */}
        <View style={styles.agentRow}>
          <View style={styles.agentAvatar}>
            <Text style={styles.agentAvatarText}>{initial}</Text>
          </View>
          <View>
            <Text style={styles.agentName}>{displayName}</Text>
            <Text style={styles.agentRole}>Agente Inmobiliario · Listo.cr</Text>
          </View>
          <Text style={styles.logoText}>Listo.cr</Text>
        </View>
      </Page>

      {/* PÁGINA 2 — Detalles */}
      <Page size="A4" style={styles.page}>
        <View style={styles.page2}>
          <Text style={{ ...styles.sectionTitle, marginTop: 0 }}>Características</Text>
          <View style={styles.detailsGrid}>
            {details.map((d, i) => (
              <DetailChip key={i} label={d.label} value={d.value} />
            ))}
          </View>

          {property.description ? (
            <>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <Text style={styles.description}>{property.description}</Text>
            </>
          ) : null}

          <Text style={styles.sectionTitle}>Estado Legal</Text>
          {[
            "Documentos al día",
            "Plano catastro actualizado",
            "Estudio notarial disponible",
          ].map((item, i) => (
            <View key={i} style={styles.legalRow}>
              <View style={styles.legalDotPending} />
              <Text style={styles.legalText}>{item}</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Contacto del Agente</Text>
          <Text style={{ fontSize: 12, color: BRAND.dark, fontWeight: "bold" }}>{displayName}</Text>
          {agent.publicProfile?.whatsappNumber && (
            <Text style={{ fontSize: 11, color: BRAND.muted, marginTop: 4 }}>
              WhatsApp: +{agent.publicProfile.whatsappNumber}
            </Text>
          )}
          {agent.email && (
            <Text style={{ fontSize: 11, color: BRAND.muted }}>
              Email: {agent.email}
            </Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Generado por Listo.cr · {new Date().toLocaleDateString("es-CR")}
          </Text>
          <Text style={styles.footerLogo}>Listo.cr</Text>
        </View>
      </Page>
    </Document>
  );
}

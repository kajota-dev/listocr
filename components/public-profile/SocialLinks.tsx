import { Instagram, Facebook, Linkedin, Globe, Music2 } from "lucide-react";

interface SocialLinksProps {
  links: {
    instagram?: string | null;
    facebook?: string | null;
    linkedin?: string | null;
    tiktok?: string | null;
    website?: string | null;
  };
}

const SOCIAL_CONFIG = [
  {
    key: "instagram" as const,
    Icon: Instagram,
    label: "Instagram",
    color: "text-pink-500",
    bg: "hover:bg-pink-50",
  },
  {
    key: "facebook" as const,
    Icon: Facebook,
    label: "Facebook",
    color: "text-blue-600",
    bg: "hover:bg-blue-50",
  },
  {
    key: "linkedin" as const,
    Icon: Linkedin,
    label: "LinkedIn",
    color: "text-blue-700",
    bg: "hover:bg-blue-50",
  },
  {
    key: "tiktok" as const,
    Icon: Music2,
    label: "TikTok",
    color: "text-brand-dark",
    bg: "hover:bg-gray-100",
  },
  {
    key: "website" as const,
    Icon: Globe,
    label: "Sitio web",
    color: "text-emerald-brand",
    bg: "hover:bg-emerald-muted",
  },
];

export default function SocialLinks({ links }: SocialLinksProps) {
  const activeLinks = SOCIAL_CONFIG.filter((s) => links[s.key]);

  if (activeLinks.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {activeLinks.map(({ key, Icon, label, color, bg }) => (
        <a
          key={key}
          href={links[key]!}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={`flex h-10 w-10 items-center justify-center rounded-full border border-brand-border transition-all ${color} ${bg}`}
        >
          <Icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
}

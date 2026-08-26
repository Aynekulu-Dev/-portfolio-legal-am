import { Linkedin, Send, Mail, Phone } from "lucide-react";
import type { Profile } from "@/lib/data";

const ICONS: Record<string, typeof Linkedin> = {
  linkedin: Linkedin,
  telegram: Send,
  email: Mail,
  phone: Phone
};

export function Footer({ profile }: { profile: Profile }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-content flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-muted">
          © {year} {profile.full_name} — መብቱ በህግ የተጠበቀ ነው
        </p>
        <div className="flex items-center gap-4">
          {Object.entries(profile.socials).map(([key, url]) => {
            const Icon = ICONS[key];
            if (!Icon || !url) return null;
            const isExternal = key !== "email" && key !== "phone";
            return (
              <a
                key={key}
                href={url as string}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer noopener" : undefined}
                aria-label={key}
                className="text-muted transition-colors hover:text-maroon"
              >
                <Icon size={16} />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}

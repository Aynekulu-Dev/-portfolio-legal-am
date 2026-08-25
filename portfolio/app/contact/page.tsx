import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { getProfile } from "@/lib/data";

export const metadata: Metadata = { title: "አግኙኝ" };

export default function ContactPage() {
  const profile = getProfile();

  return (
    <div className="mx-auto max-w-content px-6 py-20">
      <p className="font-mono text-xs text-maroon">አግኙኝ</p>
      <h1 className="mt-3 font-display text-4xl text-fg">እናውራ</h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
        ጥያቄ ወይም አስተያየት ካለዎት መልእክት ይላኩ — በጥቂት ቀናት ውስጥ ምላሽ እሰጣለሁ።
      </p>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <MapPin size={17} className="mt-0.5 text-maroon" />
            <div>
              <p className="font-mono text-xs text-muted">አድራሻ</p>
              <p className="mt-0.5 text-sm text-fg">{profile.location}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail size={17} className="mt-0.5 text-maroon" />
            <div>
              <p className="font-mono text-xs text-muted">የምላሽ ጊዜ</p>
              <p className="mt-0.5 text-sm text-fg">በአብዛኛው በ2 የስራ ቀናት ውስጥ</p>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { ServiceCard } from "@/components/ServiceCard";
import { getServices } from "@/lib/data";

export const metadata: Metadata = { title: "አገልግሎቶች" };

export default function ServicesPage() {
  const services = getServices();

  return (
    <div className="mx-auto max-w-content px-6 py-20">
      <p className="font-mono text-xs text-maroon">አገልግሎቶች</p>
      <h1 className="mt-3 font-display text-4xl text-fg">የስራ መስኮች</h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
        በተደጋጋሚ የምሠራባቸው ዘርፎች ዝርዝር — ከክስ አመራር እስከ ጥናትና ማማከር ድረስ።
      </p>

      <div className="mt-14 grid gap-4 sm:grid-cols-2">
        {services.map((s) => (
          <ServiceCard key={s.id} service={s} />
        ))}
      </div>
    </div>
  );
}

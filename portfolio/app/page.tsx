import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { SectionLabel } from "@/components/SectionLabel";
import { ServiceCard } from "@/components/ServiceCard";
import { CaseCard } from "@/components/CaseCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { getProfile, getServices, getCases, getTestimonials } from "@/lib/data";

export default async function HomePage() {
  const profile = await getProfile();
  const services = (await getServices()).slice(0, 4);
  const featuredCases = (await getCases()).slice(0, 3);
  const testimonials = await getTestimonials();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="ledger-fade absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-content px-6 py-24 sm:py-32">
          <p className="font-mono text-xs text-brass">የሙያ ማህደር</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.2] text-fg sm:text-6xl">
            {profile.full_name}
          </h1>
          <p className="mt-4 max-w-2xl font-mono text-sm text-maroon sm:text-base">
            {profile.headline}
          </p>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">{profile.bio}</p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href={profile.resume_url}
              download
              className="flex items-center gap-2 rounded-sm bg-maroon px-5 py-2.5 font-mono text-sm text-ink transition-opacity hover:opacity-90"
            >
              <Download size={15} /> ሲቪ ያውርዱ
            </a>
            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-sm border border-border px-5 py-2.5 font-mono text-sm text-fg transition-colors hover:border-maroon hover:text-maroon"
            >
              አግኙኝ <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs text-muted">
            <span>{profile.location}</span>
            <span aria-hidden="true">·</span>
            <span>{profile.years_experience}+ ዓመታት ልምድ</span>
            <span aria-hidden="true">·</span>
            <span>{profile.focus_areas.join(" / ")}</span>
          </div>
        </div>
      </section>

      {/* Services teaser */}
      <section className="mx-auto max-w-content px-6 py-20">
        <SectionLabel article="፩" name="አገልግሎቶች" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </section>

      {/* Featured cases */}
      <section className="border-t border-border bg-surface-2/40">
        <div className="mx-auto max-w-content px-6 py-20">
          <SectionLabel article="፪" name="የተያዙ መዝገቦች" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCases.map((item) => (
              <CaseCard key={item.id} item={item} />
            ))}
          </div>
          <Link
            href="/projects"
            className="mt-8 inline-flex items-center gap-2 font-mono text-sm text-maroon hover:underline"
          >
            ሁሉንም መዝገቦች ይመልከቱ <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-content px-6 py-20">
          <SectionLabel article="፫" name="ምስክርነቶች" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} item={t} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

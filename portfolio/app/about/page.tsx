import type { Metadata } from "next";
import { SectionLabel } from "@/components/SectionLabel";
import { getProfile } from "@/lib/data";

export const metadata: Metadata = { title: "ስለ እኔ" };

const TIMELINE = [
  {
    date: "2023 — አሁን",
    role: "ዐቃቤ ሕግ",
    org: "የፌዴራል ጠቅላይ ዐቃቤ ሕግ",
    detail: "ውስብስብ የወንጀል ጉዳዮችን በመምራት እና ወጣት ዐቃብያነ ሕግ ላይ ድጋፍ በመስጠት ላይ።"
  },
  {
    date: "2019 — 2023",
    role: "ረዳት ዐቃቤ ሕግ",
    org: "የአዲስ አበባ ከተማ አስተዳደር ዐቃቤ ሕግ መሥሪያ ቤት",
    detail: "የወንጀል ምርመራ ውጤቶችን በመገምገም እና የክስ ማመልከቻ በማዘጋጀት ላይ ሠርቷል።"
  },
  {
    date: "2017 — 2019",
    role: "የሕግ ረዳት",
    org: "የፍትሕ ሚኒስቴር",
    detail: "የፍርድ ቤት መዝገቦችን በማደራጀት እና ጥናቶችን በማገዝ ላይ ተሳትፏል።"
  }
];

const CREDENTIALS: { group: string; items: string[] }[] = [
  { group: "ትምህርት", items: ["LL.B በሕግ", "ኤልኤልኤም በወንጀል ሕግ (የቀጠለ)"] },
  { group: "የተካኑባቸው ዘርፎች", items: ["የወንጀል ሥነ ሥርዓት ሕግ", "የማስረጃ ሕግ", "የሙስና ወንጀል"] },
  { group: "ቋንቋዎች", items: ["አማርኛ", "እንግሊዝኛ", "አፋን ኦሮሞ"] },
  { group: "የምስክርነት ወረቀት", items: ["የጠበቆች ማህበር አባል", "የፍትሕ ሥልጠና ተመራቂ"] }
];

export default function AboutPage() {
  const profile = getProfile();

  return (
    <div className="mx-auto max-w-content px-6 py-20">
      <p className="font-mono text-xs text-maroon">ስለ እኔ</p>
      <h1 className="mt-3 font-display text-4xl text-fg">ማንነት</h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">{profile.bio}</p>

      <div className="mt-16">
        <SectionLabel article="፫" name="የሥራ ልምድ" />
        <ol className="space-y-8 border-l border-border pl-6">
          {TIMELINE.map((item) => (
            <li key={item.role} className="relative">
              <span
                className="absolute -left-[29px] top-1.5 h-2 w-2 rounded-full bg-maroon"
                aria-hidden="true"
              />
              <p className="font-mono text-xs text-brass">{item.date}</p>
              <h3 className="mt-1 font-display text-lg text-fg">
                {item.role} <span className="text-muted">· {item.org}</span>
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{item.detail}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-16">
        <SectionLabel article="፬" name="ብቃት እና ትምህርት" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CREDENTIALS.map((group) => (
            <div key={group.group}>
              <p className="font-mono text-xs uppercase tracking-wide text-muted">
                {group.group}
              </p>
              <ul className="mt-3 space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="text-sm text-fg">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

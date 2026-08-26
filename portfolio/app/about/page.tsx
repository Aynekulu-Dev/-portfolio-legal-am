import type { Metadata } from "next";
import { SectionLabel } from "@/components/SectionLabel";
import { getProfile } from "@/lib/data";

export const metadata: Metadata = { title: "ስለ እኔ" };

export default async function AboutPage() {
  const profile = await getProfile();
  const timeline = profile.timeline ?? [];
  const credentials = profile.credentials ?? [];

  return (
    <div className="mx-auto max-w-content px-6 py-20">
      <div className="flex flex-col-reverse items-start gap-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs text-maroon">ስለ እኔ</p>
          <h1 className="mt-3 font-display text-4xl text-fg">ማንነት</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">{profile.bio}</p>
        </div>

        {profile.avatar_url && (
          <div className="shrink-0">
            <div className="h-40 w-40 overflow-hidden rounded-sm border border-border sm:h-48 sm:w-48 lg:h-64 lg:w-64">
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-16">
        <SectionLabel article="፫" name="የሥራ ልምድ" />
        {timeline.length === 0 ? (
          <p className="text-sm text-muted">ገና የሥራ ልምድ አልተመዘገበም።</p>
        ) : (
          <ol className="space-y-8 border-l border-border pl-6">
            {timeline.map((item, i) => (
              <li key={`${item.role}-${i}`} className="relative">
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
        )}
      </div>

      <div className="mt-16">
        <SectionLabel article="፬" name="ብቃት እና ትምህርት" />
        {credentials.length === 0 ? (
          <p className="text-sm text-muted">ገና ብቃት/ትምህርት አልተመዘገበም።</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {credentials.map((group, i) => (
              <div key={`${group.group}-${i}`}>
                <p className="font-mono text-xs uppercase tracking-wide text-muted">
                  {group.group}
                </p>
                <ul className="mt-3 space-y-2">
                  {group.items.map((item, j) => (
                    <li key={`${item}-${j}`} className="text-sm text-fg">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

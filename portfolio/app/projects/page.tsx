import type { Metadata } from "next";
import { CasesGrid } from "./CasesGrid";
import { getCases } from "@/lib/data";

export const metadata: Metadata = { title: "መዝገቦች" };

export default async function ProjectsPage() {
  const items = await getCases();

  return (
    <div className="mx-auto max-w-content px-6 py-20">
      <p className="font-mono text-xs text-maroon">መዝገቦች</p>
      <h1 className="mt-3 font-display text-4xl text-fg">የተያዙ መዝገቦችና ጥናቶች</h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
        የተያዙ የወንጀል መዝገቦች እና የተዘጋጁ ጥናቶች ማጠቃለያ።
      </p>

      <div className="mt-14">
        <CasesGrid items={items} />
      </div>
    </div>
  );
}

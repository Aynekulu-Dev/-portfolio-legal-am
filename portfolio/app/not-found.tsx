import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-content flex-col items-start px-6 py-32">
      <p className="font-mono text-xs text-maroon">መዝገብ አልተገኘም</p>
      <h1 className="mt-3 font-display text-3xl text-fg">ይህ ገፅ አልተገኘም</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        የፈለጉት ገፅ የለም ወይም ቦታውን ቀይሯል። ከላይ ካለው ዝርዝር ውስጥ ይምረጡ ወይም ወደ መነሻ ገፅ ይመለሱ።
      </p>
      <Link
        href="/"
        className="mt-6 rounded-sm border border-border px-4 py-2 font-mono text-sm text-fg hover:border-maroon hover:text-maroon"
      >
        ወደ መነሻ ገፅ
      </Link>
    </div>
  );
}

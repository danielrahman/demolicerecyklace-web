import type { FaqItem } from "@/lib/faq-content";
import { cx } from "@/lib/ui";

type FaqSectionProps = {
  title: string;
  description?: string;
  items: FaqItem[];
  className?: string;
  columns?: 1 | 2;
  id?: string;
};

export function FaqSection(props: FaqSectionProps) {
  return (
    <section
      id={props.id}
      className={cx("rounded-3xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6", props.className)}
    >
      <div className="space-y-3">
        <span className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-950 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-300">
          FAQ
        </span>
        <h2 className="text-3xl font-bold">{props.title}</h2>
        {props.description ? <p className="max-w-4xl text-zinc-300">{props.description}</p> : null}
      </div>

      <div className={cx("mt-5 grid gap-3", props.columns === 1 ? "" : "md:grid-cols-2")}>
        {props.items.map((faq) => (
          <article key={faq.question} className="rounded-2xl border border-zinc-700 bg-zinc-950/80 p-4 sm:p-5">
            <h3 className="text-lg font-bold text-zinc-100">{faq.question}</h3>
            <p className="mt-2 text-zinc-300">{faq.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

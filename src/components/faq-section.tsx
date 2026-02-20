import type { FaqItem } from "@/lib/faq-content";
import { cx, ui } from "@/lib/ui";

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
    <section id={props.id} className={cx(ui.faqSection, props.className)}>
      <div className="space-y-3">
        <span className={ui.faqBadge}>FAQ</span>
        <h2 className="text-3xl font-bold">{props.title}</h2>
        {props.description ? <p className="max-w-4xl text-zinc-300">{props.description}</p> : null}
      </div>

      <div className={cx("mt-5 grid gap-3", props.columns === 1 ? "" : "md:grid-cols-2")}>
        {props.items.map((faq) => (
          <article key={faq.question} className={ui.faqCard}>
            <h3 className="text-lg font-bold text-zinc-100">{faq.question}</h3>
            <p className="mt-2 text-zinc-300">{faq.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

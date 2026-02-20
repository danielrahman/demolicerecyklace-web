import type { ReactNode } from "react";

export function Section(props: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-zinc-800 pt-6">
      <h2 className="font-heading text-2xl font-bold text-zinc-100">{props.title}</h2>
      {props.description ? <p className="mt-2 text-zinc-300">{props.description}</p> : null}
      <div className="mt-4">{props.children}</div>
    </section>
  );
}

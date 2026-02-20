import Image from "next/image";

export default function RecyklacePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Recyklace</h1>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <article className="space-y-3">
          <p className="max-w-3xl text-zinc-300">
            V recyklačním středisku zajišťujeme příjem a zpracování inertních materiálů, prodej recyklátů a návazné
            logistické služby.
          </p>
          <ul className="space-y-2 text-zinc-300">
            <li>- Ukládka inertních materiálů dle ceníku</li>
            <li>- Prodej tříděných materiálů a recyklátů</li>
            <li>- Cejchovaná váha a provozní režim Po-Pá + So</li>
          </ul>
        </article>
        <div className="overflow-hidden rounded-xl border border-zinc-800">
          <Image
            src="/photos/homepage/service-recyklace.jpg"
            alt="Recyklační středisko"
            width={1280}
            height={720}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

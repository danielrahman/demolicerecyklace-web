export default function FaqPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">FAQ</h1>
      <div className="space-y-4">
        <article className="border-t border-zinc-800 pt-4">
          <h2 className="text-xl font-bold">Jaká velikost kontejneru je aktuálně dostupná?</h2>
          <p className="mt-2 text-zinc-300">Aktuálně objednáte online kontejner 3 m3. Další velikosti připravujeme.</p>
        </article>
        <article className="border-t border-zinc-800 pt-4">
          <h2 className="text-xl font-bold">Je termín po odeslání objednávky závazný?</h2>
          <p className="mt-2 text-zinc-300">Ne. Každý termín vždy potvrzuje operátor ručně.</p>
        </article>
        <article className="border-t border-zinc-800 pt-4">
          <h2 className="text-xl font-bold">Kde službu poskytujete?</h2>
          <p className="mt-2 text-zinc-300">Online objednávka je pro Prahu a vybraná PSČ Středočeského kraje.</p>
        </article>
      </div>
    </div>
  );
}

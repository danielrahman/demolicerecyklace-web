export const CONTAINER_HOW_IT_WORKS = [
  {
    title: "Zadáte adresu a PSČ",
    description: "Hned ověříme, zda obsluhujeme danou lokalitu v Praze nebo Středočeském kraji.",
  },
  {
    title: "Vyberete typ odpadu",
    description: "Dostanete jasné upozornění, co do kontejneru patří a co nepatří.",
  },
  {
    title: "Zadáte požadovaný termín",
    description: "Vyberete datum, časové okno a umístění kontejneru.",
  },
  {
    title: "Doplníte kontakt a odešlete",
    description: "Objednávku přijmeme e-mailem a operátor termín potvrdí ručně.",
  },
] as const;

export const CONTAINER_FAQ = [
  {
    question: "Mohu objednat kontejner online i mimo Prahu?",
    answer:
      "Ano, online objednávka je dostupná pro Prahu a vybraná PSČ Středočeského kraje. Podporu ověřujeme přímo během objednávky podle PSČ.",
  },
  {
    question: "Jakou velikost kontejneru mohu aktuálně objednat?",
    answer:
      "V MVP je online dostupný kontejner 3 m3. Další velikosti postupně přidáme bez změny objednávkového formuláře.",
  },
  {
    question: "Je termín po odeslání objednávky automaticky potvrzený?",
    answer:
      "Ne. Objednávku přijmeme ihned, ale finální termín vždy potvrzuje operátor podle kapacity a trasy.",
  },
  {
    question: "Co když mám odpad, který si nejsem jistý kam zařadit?",
    answer:
      "Použijte stránku Co patří a nepatří. Pokud je materiál hraniční, napište poznámku do objednávky nebo zavolejte dispečink.",
  },
  {
    question: "Mohu dát kontejner na veřejnou komunikaci?",
    answer:
      "Ano, ale obvykle je nutné povolení záboru. Ve formuláři proto ověřujeme, že povolení máte zajištěné.",
  },
  {
    question: "Jaká je maximální hmotnost obsahu kontejneru 3 m3?",
    answer:
      "Orientační limit je 4 t. Při překročení nebo neodpovídajícím složení odpadu může vzniknout doplatek.",
  },
] as const;

export const CONTAINER_TRUST_POINTS = [
  "Ruční potvrzení každého termínu operátorem",
  "Jasná pravidla odpadu přímo na webu, ne jen v PDF",
  "Transparentní ceník v HTML včetně poznámek a limitů",
  "Kontaktní údaje, provozní doba a dokumenty veřejně dostupné",
] as const;

export const CONTAINER_RULE_WARNINGS = [
  "Do kontejneru nepatří nebezpečný odpad, chemikálie, barvy ani azbest.",
  "Materiál nepřeplňujte nad horní hranu kontejneru.",
  "Směsný odpad a příměsi mohou změnit výslednou cenu.",
  "Při umístění na veřejnou komunikaci je nutné mít příslušné povolení.",
] as const;

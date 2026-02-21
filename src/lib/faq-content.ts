export type FaqItem = {
  question: string;
  answer: string;
};

export const CONTAINER_FAQ: FaqItem[] = [
  {
    question: "Mohu objednat kontejner přes web i mimo Prahu?",
    answer:
      "Ano. Objednávka přes web je dostupná pro Prahu a vybraná PSČ Středočeského kraje. Dostupnost ověříme hned podle PSČ.",
  },
  {
    question: "Jakou velikost kontejneru mohu přes web objednat právě teď?",
    answer:
      "Aktuálně lze přes web objednat kontejner 3 m³. Další velikosti postupně doplňujeme.",
  },
  {
    question: "Je termín po odeslání objednávky hned potvrzený?",
    answer:
      "Ne. Objednávku přijmeme hned, ale přesný termín vždy potvrzuje operátor podle kapacity a trasy.",
  },
  {
    question: "Co když si nejsem jistý, jaký typ odpadu mám vybrat?",
    answer:
      "Napište poznámku do objednávky nebo zavolejte dispečink. Pomůžeme vám vybrat správný typ odpadu ještě před přistavením.",
  },
  {
    question: "Mohu umístit kontejner na veřejnou komunikaci?",
    answer:
      "Ano, ale obvykle je potřeba povolení záboru. Ve formuláři proto potvrzujete, že je povolení zajištěné.",
  },
  {
    question: "Jaká je maximální hmotnost odpadu v kontejneru 3 m³?",
    answer:
      "Orientační limit je 4 t. Pokud je hmotnost vyšší nebo je odpad jiný, než byl objednán, může vzniknout doplatek.",
  },
];

export const DEMOLITION_FAQ: FaqItem[] = [
  {
    question: "Jak rychle reagujete na poptávku demolice?",
    answer:
      "Na běžnou poptávku reagujeme nejpozději do 1 pracovního dne. U urgentních případů doporučujeme volat dispečink.",
  },
  {
    question: "Řešíte i odvoz a třídění odpadu po demolici?",
    answer:
      "Ano. Demolici plánujeme včetně odvozu a třídění materiálu, aby práce navazovala bez zbytečných prostojů.",
  },
  {
    question: "Potřebuji před poptávkou hotová povolení?",
    answer:
      "Pro první konzultaci ne. Před zahájením prací ale musí být formální náležitosti vyřešené podle typu objektu a lokality.",
  },
  {
    question: "Děláte i částečné demolice nebo jen kompletní bourání?",
    answer:
      "Zajišťujeme obě varianty. Postup navrhneme podle rozsahu prací, přístupu na stavbu a dalšího využití materiálu.",
  },
];

export const RECYCLING_FAQ: FaqItem[] = [
  {
    question: "Můžu přivézt materiál do recyklačního střediska bez ohlášení?",
    answer:
      "Doporučujeme zavolat předem a ověřit typ materiálu. Vyhnete se zdržení při přejímce a možnému odmítnutí nevhodné směsi.",
  },
  {
    question: "Jaké materiály do recyklace nepřijímáte?",
    answer:
      "Nepřijímáme nebezpečný odpad, silně kontaminované směsi ani materiál s nejasným původem bez potřebných dokladů.",
  },
  {
    question: "Jak se určuje výsledná cena při příjmu?",
    answer:
      "Cena vychází z typu materiálu, skutečného množství po zvážení a výsledku vstupní kontroly při převzetí.",
  },
  {
    question: "Prodáváte recyklát a další materiály i s dopravou?",
    answer:
      "Ano. U vybraných položek zajišťujeme dodání i osobní odběr. Dostupnost a termín vždy potvrdíme podle kapacity.",
  },
];

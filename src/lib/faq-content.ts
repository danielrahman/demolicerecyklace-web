export type FaqItem = {
  question: string;
  answer: string;
};

export const CONTAINER_FAQ: FaqItem[] = [
  {
    question: "Mohu objednat kontejner online i mimo Prahu?",
    answer:
      "Ano, online objednávka je dostupná pro Prahu a vybraná PSČ Středočeského kraje. Podporu ověřujeme přímo během objednávky podle PSČ.",
  },
  {
    question: "Jakou velikost kontejneru mohu aktuálně objednat?",
    answer:
      "V MVP je online dostupný kontejner 3m³. Další velikosti postupně přidáme bez změny objednávkového formuláře.",
  },
  {
    question: "Je termín po odeslání objednávky automaticky potvrzený?",
    answer:
      "Ne. Objednávku přijmeme ihned, ale finální termín vždy potvrzuje operátor podle kapacity a trasy.",
  },
  {
    question: "Co když mám odpad, který si nejsem jistý kam zařadit?",
    answer:
      "Pokud je materiál hraniční, napište poznámku do objednávky nebo zavolejte dispečink. Pomůžeme s přesným zařazením ještě před přistavením.",
  },
  {
    question: "Mohu dát kontejner na veřejnou komunikaci?",
    answer:
      "Ano, ale obvykle je nutné povolení záboru. Ve formuláři proto ověřujeme, že povolení máte zajištěné.",
  },
  {
    question: "Jaká je maximální hmotnost obsahu kontejneru 3m³?",
    answer:
      "Orientační limit je 4 t. Při překročení nebo neodpovídajícím složení odpadu může vzniknout doplatek.",
  },
];

export const DEMOLITION_FAQ: FaqItem[] = [
  {
    question: "Jak rychle reagujete na poptávku demolice?",
    answer:
      "Na standardní poptávky reagujeme nejpozději do 1 pracovního dne. Pokud jde o urgentní případ, doporučujeme zavolat přímo dispečink.",
  },
  {
    question: "Řešíte i odvoz a třídění odpadu po demolici?",
    answer:
      "Ano, demolici plánujeme včetně návazného odvozu a třídění materiálu, aby byl proces plynulý a bez zbytečných prostojů.",
  },
  {
    question: "Potřebuji před poptávkou hotová povolení?",
    answer:
      "Pro úvodní konzultaci ne, ale před realizací je nutné mít formální náležitosti vyřešené podle typu objektu a místa stavby.",
  },
  {
    question: "Děláte i částečné demolice nebo jen kompletní bourání?",
    answer:
      "Řešíme obě varianty. Postup navrhujeme podle rozsahu, přístupu na stavbu a požadavků na návazné využití materiálu.",
  },
];

export const RECYCLING_FAQ: FaqItem[] = [
  {
    question: "Můžu přivézt materiál do recyklačního střediska bez ohlášení?",
    answer:
      "Doporučujeme předem zavolat a ověřit typ materiálu. Vyhnete se zdržení při přejímce a případnému odmítnutí nevhodné směsi.",
  },
  {
    question: "Jaké materiály do recyklace nepřijímáte?",
    answer:
      "Nepřijímáme nebezpečné odpady, silně kontaminované směsi ani materiál s nejasným původem bez potřebných dokladů.",
  },
  {
    question: "Jak se určuje výsledná cena při příjmu?",
    answer:
      "Cena vychází z typu materiálu, skutečného množství po zvážení a výsledku vstupní kontroly při převzetí.",
  },
  {
    question: "Prodáváte recyklát a další materiály i s dopravou?",
    answer:
      "Ano, u vybraných položek umíme zajistit dodání i osobní odběr. Konkrétní dostupnost a termín potvrzujeme podle kapacity.",
  },
];

export type PricingRow = {
  item: string;
  code?: string;
  price: string;
  note?: string;
};

export type MachineRentalRow = {
  machine: string;
  specification: string;
  price: string;
  image: string;
  note?: string;
};

export const INERT_MATERIALS_PRICING: PricingRow[] = [
  { item: "Výkopová zemina bez příměsí", code: "17 05 04", price: "370 Kč/t" },
  { item: "Směsi betonu, cihel, tašek a keramických výrobků", code: "17 01 07", price: "395 Kč/t" },
  {
    item: "Směsi betonu, cihel a tašek s více jak 50% porobetonu, sádrokartonu",
    code: "17 01 07",
    price: "490 Kč/t",
  },
  {
    item: "Směsi betonu, cihel a tašek s více jak 80% porobetonu, sádrokartonu",
    code: "17 01 07",
    price: "700 Kč/t",
  },
  { item: "Prosté betony", code: "17 01 01", price: "180 Kč/t" },
  { item: "Armované betony v kusovitosti do 50 cm", code: "17 01 01", price: "270 Kč/t" },
  { item: "Panely, armované betony nad 50 cm", code: "17 01 01", price: "350 Kč/t" },
  { item: "Prosté betony s příměsí zeminy", code: "17 01 01", price: "270 Kč/t" },
  { item: "Asfalt bez dehtu", code: "17 03 02", price: "480 Kč/t" },
  { item: "Frézovaná živice bez dehtu", code: "17 03 02", price: "380 Kč/t" },
  { item: "Dřevo", code: "17 02 01", price: "1 000 Kč/t" },
  { item: "Dřevo s nežádoucí příměsí", code: "17 02 01", price: "2 000 Kč/t" },
  { item: "Štěrk ze železničního svršku", code: "17 05 08", price: "99 Kč/t" },
  { item: "Stavební suť s nežádoucí příměsí", code: "17 01 07", price: "2 900 Kč/t" },
];

export const MATERIAL_SALES_PRICING: PricingRow[] = [
  { item: "Písek zásypový tříděný 0/4", price: "299 Kč/t" },
  { item: "Písek maltový 0/4 PTK", price: "379 Kč/t" },
  { item: "Písek praný (betonářský) 0/4 PTK", price: "439 Kč/t" },
  { item: "Písek bílý Kaznějov 0-4", price: "699 Kč/t" },
  { item: "Lomový kámen 0-4 mm", price: "469 Kč/t" },
  { item: "Lomový kámen 0-32 mm", price: "490 Kč/t" },
  { item: "Lomový kámen 0-63 mm", price: "480 Kč/t" },
  { item: "Lomový kámen 4-8 mm", price: "810 Kč/t" },
  { item: "Lomový kámen 8-16 mm", price: "610 Kč/t" },
  { item: "Lomový kámen 16-32 mm", price: "590 Kč/t" },
  { item: "Lomový kámen 32-63 mm", price: "585 Kč/t" },
  { item: "Štěrkodrť 8-32 mm / 32-63 mm", price: "469 Kč/t" },
  { item: "Kačírek 8-16 mm PRANÝ / 16-32 mm PRANÝ", price: "770 Kč/t" },
  { item: "Kačírek 16-32 mm NEPRANÝ", price: "499 Kč/t" },
  { item: "Tříděná zemina A 0/8", price: "199 Kč/t" },
  { item: "Tříděná zemina B 0/8", price: "110 Kč/t" },
  { item: "Zásypový materiál odhliněný 0/32 mm", price: "50 Kč/t" },
  { item: "Směsný recyklát 0-8 mm", price: "50 Kč/t" },
  { item: "Směsný recyklát 8-32 mm / 32-90 mm", price: "60 Kč/t" },
  { item: "Betonový recyklát 0-63 mm", price: "180 Kč/t" },
  { item: "Betonový recyklát 0-8 mm", price: "110 Kč/t" },
  { item: "Betonový recyklát 8-32 mm / 32-90 mm", price: "180 Kč/t" },
  { item: "Živičný recyklát 0-16 mm / 8-32 mm / 32-63 mm", price: "130 Kč/t" },
];

export const CONTAINER_3M3_PRICING: PricingRow[] = [
  { item: "Asfalt", code: "170302", price: "4 500 Kč" },
  { item: "Beton prostý", code: "170101", price: "3 200 Kč" },
  { item: "Železobeton", code: "170101", price: "4 300 Kč" },
  { item: "Směsi nebo oddělené frakce betonu, cihel...", code: "170107", price: "4 400 Kč" },
  {
    item: "Směsi nebo oddělené frakce betonu, cihel... s příměsí pórobetonu (Ytong)",
    code: "170107",
    price: "4 900 Kč",
  },
  { item: "Pórobeton (Ytong)", code: "170107", price: "5 500 Kč" },
  { item: "Cihly", code: "170102", price: "4 400 Kč" },
  { item: "Tašky a keramické výrobky", code: "170103", price: "4 400 Kč" },
  { item: "Štěrk ze železničního svršku", code: "170508", price: "3 000 Kč" },
  { item: "Zemina a kamení", code: "170504", price: "5 000 Kč" },
];

export const MOBILE_RECYCLING_PRICING: PricingRow[] = [
  { item: "Drcení mobilní", price: "75 Kč/t" },
];

export const MACHINE_RENTAL_PRICING: MachineRentalRow[] = [
  {
    machine: "Caterpillar 924 G",
    specification: "Čelní nakladač, lopata 1,5 m3",
    price: "7 500 Kč/den",
    image: "/photos/stroje/wheel-loader.jpg",
  },
  {
    machine: "Komatsu 430",
    specification: "Čelní nakladač, lopata 4 m3",
    price: "8 900 Kč/den",
    image: "/photos/stroje/wheel-loader.jpg",
  },
  {
    machine: "Kubota U55",
    specification: "Pásové rypadlo 5,5 t",
    price: "6 300 Kč/den",
    image: "/photos/stroje/excavator.jpg",
  },
  {
    machine: "JCB 240 LC",
    specification: "Pásové rypadlo 26 t",
    price: "10 500 Kč/den",
    image: "/photos/stroje/excavator.jpg",
  },
  {
    machine: "JCB 240 LC s kladivem",
    specification: "Pásové rypadlo 26 t s kladivem",
    price: "12 500 Kč/den",
    image: "/photos/stroje/construction-machine.jpg",
  },
  {
    machine: "Komatsu 240 LC",
    specification: "Pásové rypadlo 26 t",
    price: "11 700 Kč/den",
    image: "/photos/stroje/excavator.jpg",
  },
  {
    machine: "Komatsu 240 LC s nůžkami",
    specification: "Pásové rypadlo 26 t s nůžkami",
    price: "13 700 Kč/den",
    image: "/photos/stroje/construction-machine.jpg",
  },
  {
    machine: "Dumper Benford 6 t",
    specification: "Dumper",
    price: "4 400 Kč/den",
    image: "/photos/stroje/bulldozer.jpg",
  },
  {
    machine: "Atlas Copco 5515",
    specification: "Mobilní drtič",
    price: "35 Kč/t",
    image: "/photos/stroje/construction-machine.jpg",
    note: "Bez nakládky a manipulace materiálu",
  },
  {
    machine: "Atlas Copco 1055",
    specification: "Mobilní drtič",
    price: "65 Kč/t",
    image: "/photos/stroje/construction-machine.jpg",
    note: "Bez nakládky a manipulace materiálu",
  },
];

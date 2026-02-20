import { containersPage } from "./documents/containersPage";
import { faqCategory } from "./documents/faqCategory";
import { homePage } from "./documents/homePage";
import { marketingPage } from "./documents/marketingPage";
import { pricingPage } from "./documents/pricingPage";
import { siteSettings } from "./documents/siteSettings";
import { contactHour } from "./objects/contactHour";
import { faqItem } from "./objects/faqItem";
import { marketingSection } from "./objects/marketingSection";
import { navLink } from "./objects/navLink";
import { pricingRow } from "./objects/pricingRow";

export const schemaTypes = [
  homePage,
  containersPage,
  pricingPage,
  siteSettings,
  marketingPage,
  faqCategory,
  pricingRow,
  faqItem,
  navLink,
  contactHour,
  marketingSection,
];

import { defineQuery } from "next-sanity";

export const HOME_PAGE_QUERY = defineQuery(`
*[_type == "homePage" && _id == "homePage"][0]{
  heroEyebrow,
  heroTitle,
  heroDescription,
  quickFacts,
  serviceCards[]{
    title,
    subtitle,
    description,
    points,
    href,
    cta,
    imageAlt,
    "imageUrl": image.asset->url
  },
  processSteps[]{
    title,
    text
  },
  trustSignals
}
`);

export const CONTAINERS_PAGE_QUERY = defineQuery(`
*[_type == "containersPage" && _id == "containersPage"][0]{
  heroTitle,
  heroDescription,
  heroImageAlt,
  "heroImageUrl": heroImage.asset->url,
  howItWorks[]{
    title,
    description
  },
  trustPoints,
  ruleWarnings
}
`);

export const PRICING_PAGE_QUERY = defineQuery(`
*[_type == "pricingPage" && _id == "pricingPage"][0]{
  introTitle,
  introDescription,
  sourcePdfUrl,
  containerSectionTitle,
  containerSectionDescription,
  containerLimitNote,
  containerPricing[]{
    item,
    code,
    price,
    note,
    tag,
    imageAlt,
    "imageUrl": image.asset->url
  },
  inertMaterialsTitle,
  inertMaterialsSubtitle,
  inertMaterialsPricing[]{
    item,
    code,
    price,
    note,
    tag,
    imageAlt,
    "imageUrl": image.asset->url
  },
  materialSalesTitle,
  materialSalesPricing[]{
    item,
    code,
    price,
    note,
    tag,
    imageAlt,
    "imageUrl": image.asset->url
  },
  mobileRecyclingTitle,
  mobileRecyclingPricing[]{
    item,
    code,
    price,
    note,
    tag,
    imageAlt,
    "imageUrl": image.asset->url
  },
  machineSectionTitle,
  machineSectionSubtitle,
  machinePricing[]{
    machine,
    specification,
    price,
    note,
    imageAlt,
    "image": image.asset->url
  },
  footerNote
}
`);

export const FAQ_CATEGORIES_QUERY = defineQuery(`
*[_type == "faqCategory"] | order(order asc){
  key,
  title,
  description,
  order,
  items[]{
    question,
    answer
  }
}
`);

export const SITE_SETTINGS_QUERY = defineQuery(`
*[_type == "siteSettings" && _id == "siteSettings"][0]{
  brandName,
  companyName,
  metaTitle,
  metaDescription,
  regionsLabel,
  phone,
  email,
  operatorAddressLine,
  operationAddressLine,
  icz,
  mapUrl,
  hours[]{
    label,
    value
  },
  headerLinks[]{
    label,
    href
  },
  footerServiceLinks[]{
    label,
    href
  },
  footerInfoLinks[]{
    label,
    href
  }
}
`);

export const MARKETING_PAGE_QUERY = defineQuery(`
*[_type == "marketingPage" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  eyebrow,
  heroTitle,
  heroDescription,
  heroImageAlt,
  "heroImageUrl": heroImage.asset->url,
  seoTitle,
  seoDescription,
  sections[]{
    heading,
    body,
    items
  },
  referenceProjectsTitle,
  referenceProjects[]{
    title,
    service,
    location,
    description,
    output,
    imageAlt,
    "imageUrl": image.asset->url
  },
  processTitle,
  processSteps
}
`);

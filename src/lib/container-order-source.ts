import { getPricingPageContent } from "@/lib/cms/getters";
import {
  buildContainerOrderWasteTypes,
  FALLBACK_CONTAINER_ORDER_WASTE_TYPES,
  type ContainerOrderWasteType,
} from "@/lib/container-order-catalog";

export async function getContainerOrderWasteTypes(): Promise<ContainerOrderWasteType[]> {
  try {
    const pricing = await getPricingPageContent();
    const fromPricing = buildContainerOrderWasteTypes(pricing.containerPricing);
    if (fromPricing.length > 0) return fromPricing;
  } catch (error) {
    console.error("Failed to resolve container order waste types from pricing content", error);
  }

  return FALLBACK_CONTAINER_ORDER_WASTE_TYPES;
}

export async function getContainerOrderWasteTypeById(id: string) {
  const options = await getContainerOrderWasteTypes();
  return options.find((option) => option.id === id) ?? null;
}

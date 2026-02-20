type AresAddress = {
  textovaAdresa?: string;
  psc?: string | number;
  nazevObce?: string;
  nazevUlice?: string;
  cisloDomovni?: number;
  cisloOrientacni?: number;
  cisloOrientacniPismeno?: string;
};

type AresCompany = {
  ico?: string;
  icoId?: string;
  obchodniJmeno?: string;
  dic?: string;
  sidlo?: AresAddress;
};

type AresCompanySearchResponse = {
  ekonomickeSubjekty?: AresCompany[];
};

type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

export type CompanyLookupMatch = {
  ico: string;
  companyName: string;
  dic?: string;
  addressText?: string;
  postalCode?: string;
  city?: string;
  street?: string;
  houseNumber?: string;
};

const ARES_BASE_URL =
  process.env.ARES_API_BASE_URL?.trim() || "https://ares.gov.cz/ekonomicke-subjekty-v-be/rest";
const CACHE_TTL_MS = Number(process.env.COMPANY_LOOKUP_CACHE_TTL_MS ?? 20 * 60 * 1000);

const globalStore = globalThis as unknown as {
  companyLookupIcoCache?: Map<string, CacheEntry<CompanyLookupMatch | null>>;
  companyLookupNameCache?: Map<string, CacheEntry<CompanyLookupMatch[]>>;
};

const icoCache = globalStore.companyLookupIcoCache ?? new Map<string, CacheEntry<CompanyLookupMatch | null>>();
const nameCache = globalStore.companyLookupNameCache ?? new Map<string, CacheEntry<CompanyLookupMatch[]>>();
globalStore.companyLookupIcoCache = icoCache;
globalStore.companyLookupNameCache = nameCache;

function readCache<T>(cache: Map<string, CacheEntry<T>>, key: string) {
  const cached = cache.get(key);
  if (!cached) return undefined;

  if (Date.now() >= cached.expiresAt) {
    cache.delete(key);
    return undefined;
  }

  return cached.value;
}

function writeCache<T>(cache: Map<string, CacheEntry<T>>, key: string, value: T) {
  const ttl = Number.isFinite(CACHE_TTL_MS) && CACHE_TTL_MS > 0 ? CACHE_TTL_MS : 20 * 60 * 1000;
  cache.set(key, { expiresAt: Date.now() + ttl, value });
}

function normalizeIco(ico: string) {
  return ico.replace(/\D/g, "").slice(0, 8);
}

function normalizeDic(value?: string) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function normalizePostalCode(value: string | number | undefined) {
  if (typeof value === "number") {
    return String(value).padStart(5, "0");
  }

  if (typeof value === "string") {
    const digits = value.replace(/\D/g, "").slice(0, 5);
    if (!digits) return undefined;
    return digits.padStart(5, "0");
  }

  return undefined;
}

function formatHouseNumber(address?: AresAddress) {
  if (!address) return undefined;

  const base = typeof address.cisloDomovni === "number" ? String(address.cisloDomovni) : "";
  const orientacni = typeof address.cisloOrientacni === "number" ? String(address.cisloOrientacni) : "";
  const orientacniSuffix = address.cisloOrientacniPismeno?.trim() ?? "";

  if (!base && !orientacni && !orientacniSuffix) return undefined;
  if (!orientacni) return base || undefined;
  return `${base}/${orientacni}${orientacniSuffix}`;
}

function formatAddressText(address?: AresAddress) {
  if (!address) return undefined;
  if (address.textovaAdresa?.trim()) {
    return address.textovaAdresa.trim();
  }

  const parts = [
    [address.nazevUlice, formatHouseNumber(address)].filter(Boolean).join(" ").trim(),
    [normalizePostalCode(address.psc), address.nazevObce].filter(Boolean).join(" ").trim(),
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : undefined;
}

function normalizeCompany(company?: AresCompany | null): CompanyLookupMatch | null {
  if (!company) return null;

  const icoCandidate = company.ico || company.icoId || "";
  const ico = normalizeIco(icoCandidate);
  const companyName = company.obchodniJmeno?.trim() ?? "";
  if (!ico || !companyName) {
    return null;
  }

  return {
    ico,
    companyName,
    dic: normalizeDic(company.dic),
    addressText: formatAddressText(company.sidlo),
    postalCode: normalizePostalCode(company.sidlo?.psc),
    city: company.sidlo?.nazevObce?.trim() || undefined,
    street: company.sidlo?.nazevUlice?.trim() || undefined,
    houseNumber: formatHouseNumber(company.sidlo),
  };
}

async function fetchAresJson<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`ARES request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getByIco(ico: string) {
  const normalizedIco = normalizeIco(ico);
  if (normalizedIco.length !== 8) return null;

  const cached = readCache(icoCache, normalizedIco);
  if (cached !== undefined) {
    return cached;
  }

  try {
    const response = await fetchAresJson<AresCompany>(`${ARES_BASE_URL}/ekonomicke-subjekty/${normalizedIco}`);
    const normalized = normalizeCompany(response);
    writeCache(icoCache, normalizedIco, normalized);
    return normalized;
  } catch {
    return null;
  }
}

export async function searchByName(query: string) {
  const normalizedQuery = query.trim();
  if (normalizedQuery.length < 2) return [];

  const cacheKey = normalizedQuery.toLocaleLowerCase("cs-CZ");
  const cached = readCache(nameCache, cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  try {
    const response = await fetchAresJson<AresCompanySearchResponse>(
      `${ARES_BASE_URL}/ekonomicke-subjekty/vyhledat`,
      {
        method: "POST",
        body: JSON.stringify({
          obchodniJmeno: normalizedQuery,
          start: 0,
          pocet: 8,
        }),
      },
    );

    const deduped = new Map<string, CompanyLookupMatch>();
    for (const company of response?.ekonomickeSubjekty ?? []) {
      const normalized = normalizeCompany(company);
      if (!normalized || deduped.has(normalized.ico)) continue;
      deduped.set(normalized.ico, normalized);
      if (deduped.size >= 8) break;
    }

    const suggestions = Array.from(deduped.values());
    writeCache(nameCache, cacheKey, suggestions);
    return suggestions;
  } catch {
    return [];
  }
}

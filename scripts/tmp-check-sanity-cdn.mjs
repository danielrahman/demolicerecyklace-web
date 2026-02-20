import nextEnv from '@next/env';
import { createClient } from 'next-sanity';

nextEnv.loadEnvConfig(process.cwd());
const projectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '').trim();
const dataset = (process.env.NEXT_PUBLIC_SANITY_DATASET || 'production').trim();
const apiVersion = (process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-02-20').trim();

const noCdnClient = createClient({projectId, dataset, apiVersion, useCdn: false, perspective: 'published'});
const cdnClient = createClient({projectId, dataset, apiVersion, useCdn: true, perspective: 'published'});

const q = `*[_type == "pricingPage" && _id == "pricingPage"][0]{containerPricing[]{item,"imageUrl": image.asset->url}}`;
const a = await noCdnClient.fetch(q);
const b = await cdnClient.fetch(q);

const aAsfalt = (a?.containerPricing || []).find((x) => x?.item === 'Asfalt');
const bAsfalt = (b?.containerPricing || []).find((x) => x?.item === 'Asfalt');

console.log('noCdn', aAsfalt);
console.log('cdn', bAsfalt);

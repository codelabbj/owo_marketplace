import { z } from "zod";

/** Même origine que `erp_crm_frontend` (`VITE_DEV_API_PROXY_TARGET` / prod). */
const ERP_API_BASE_URL = "https://api.erp.codelab.bj";
const DEFAULT_SITE_URL = "https://owo.bj";

const blankToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const EnvSchema = z.object({
  NEXT_PUBLIC_MARKETPLACE_API_BASE_URL: z.preprocess(
    blankToUndefined,
    z.string().url().default(ERP_API_BASE_URL),
  ),
  NEXT_PUBLIC_SITE_URL: z.preprocess(
    blankToUndefined,
    z.string().url().default(DEFAULT_SITE_URL),
  ),
  NEXT_PUBLIC_USE_MOCKS: z
    .union([z.string(), z.undefined()])
    .transform((v) => v?.trim().toLowerCase() === "true"),
});

const parsed = EnvSchema.safeParse({
  NEXT_PUBLIC_MARKETPLACE_API_BASE_URL:
    process.env.NEXT_PUBLIC_MARKETPLACE_API_BASE_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_USE_MOCKS: process.env.NEXT_PUBLIC_USE_MOCKS,
});

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.warn("[env] invalid env vars, falling back to defaults", parsed.error.flatten());
}

const safe = parsed.success
  ? parsed.data
  : {
      NEXT_PUBLIC_MARKETPLACE_API_BASE_URL: ERP_API_BASE_URL,
      NEXT_PUBLIC_SITE_URL: DEFAULT_SITE_URL,
      NEXT_PUBLIC_USE_MOCKS: false,
    };

export const env = {
  apiBaseUrl: safe.NEXT_PUBLIC_MARKETPLACE_API_BASE_URL,
  siteUrl: safe.NEXT_PUBLIC_SITE_URL,
  useMocks: safe.NEXT_PUBLIC_USE_MOCKS,
} as const;

export type AppEnv = typeof env;

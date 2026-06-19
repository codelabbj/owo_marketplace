import { z } from "zod";

const EnvSchema = z.object({
  NEXT_PUBLIC_MARKETPLACE_API_BASE_URL: z
    .string()
    .url()
    .default("https://api.erp.codelab.bj"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://owo.bj"),
  NEXT_PUBLIC_USE_MOCKS: z
    .union([z.string(), z.undefined()])
    .transform((v) => {
      if (v === undefined) return false;
      return v.trim().toLowerCase() === "true";
    }),
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
      NEXT_PUBLIC_MARKETPLACE_API_BASE_URL: "https://api.erp.codelab.bj",
      NEXT_PUBLIC_SITE_URL: "https://owo.bj",
      NEXT_PUBLIC_USE_MOCKS: false,
    };

export const env = {
  apiBaseUrl: safe.NEXT_PUBLIC_MARKETPLACE_API_BASE_URL,
  siteUrl: safe.NEXT_PUBLIC_SITE_URL,
  useMocks: safe.NEXT_PUBLIC_USE_MOCKS,
} as const;

export type AppEnv = typeof env;

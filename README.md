# Owo Marketplace — Frontend MVP

Marketplace publique séparée de l'ERP. Les visiteurs parcourent les boutiques
et commandent directement via WhatsApp — sans création de compte ni panier.

> Stack : **Next.js 15 (App Router) + TypeScript + Tailwind + React Query + Zod
> + React Hook Form + lucide-react + Vitest + Testing Library**.

## Prérequis

- Node.js **20 LTS** ou supérieur (testé sur 22)
- npm 10+

## Installation

```bash
npm install
```

Copie `.env.example` vers `.env.local` si tu veux surcharger le backend (même API que `erp_crm_frontend`) :

```bash
NEXT_PUBLIC_MARKETPLACE_API_BASE_URL=https://api.erp.codelab.bj
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_USE_MOCKS=false
```

> Par défaut (`.env.development` / `.env.production`) la marketplace appelle déjà `https://api.erp.codelab.bj`. Pour un Django local : `http://127.0.0.1:8000`.

## Scripts

```bash
npm run dev       # serveur de développement (http://localhost:3000)
npm run build     # build production
npm run start     # démarrage production
npm run lint      # ESLint (config Next + Prettier)
npm run test      # vitest run (CI)
npm run test:watch
npm run format    # Prettier
```

## Routes implémentées

- `/` — accueil (hero, recherche globale, vedettes, tendances, catégories)
- `/shops` — listing boutiques (filtres, tri, recherche)
- `/[shopSlug]` — page boutique publique (header + catalogue)
- `/[shopSlug]/products/[productSlug]` — fiche produit (galerie, variantes,
  quantité, CTA WhatsApp)
- `/about`, `/help`, `/terms`, `/privacy`
- `/robots.txt`, `/sitemap.xml`

## Architecture

```
src/
  app/
    (public)/              # group public avec MarketplaceLayout
      page.tsx             # /
      shops/page.tsx       # /shops + ShopsBrowser (client)
      [shopSlug]/page.tsx
      [shopSlug]/products/[productSlug]/
    about/ help/ terms/ privacy/
    robots.ts
    sitemap.ts
    layout.tsx
    providers.tsx          # React Query
    error.tsx
    not-found.tsx
  components/
    layout/                # Topbar, Footer, MarketplaceLayout, Hero, Section, SearchBar
    shops/                 # ShopCard, ShopHeader
    products/              # ProductCard, ProductGallery, VariantSelector, QuantityStepper
    whatsapp/              # WhatsAppButton, WhatsAppIcon, ContactFallbackModal
    states/                # EmptyState, ErrorState, SkeletonGrid
    home/                  # GlobalSearch
  hooks/                   # useShops, useShop, useProduct, useDebouncedValue
  lib/
    api/                   # client.ts, shops.ts, products.ts, mocks.ts, mappers.ts
    whatsapp/              # buildWhatsAppMessage.ts, buildWhatsAppUrl.ts
    utils/                 # cn, currency, formatters
    config/env.ts          # env validé via zod
  schemas/                 # shop.schema.ts, product.schema.ts (zod)
  types/domain.ts
docs/
  IMPLEMENTATION_NOTES.md
```

## Module WhatsApp

Le cœur du MVP. Le bouton ouvre `https://wa.me/{phone}?text={msg}` avec un
template choisi automatiquement :

1. `promoPrice` → template promo
2. `variantLabel` → template variante
3. `stockLabel` "stock limité" → template stock limité
4. sinon → template simple

Si le numéro est absent : CTA disabled + message "Contact WhatsApp indisponible".
Si l'ouverture échoue : modal fallback (numéro copiable + bouton réessayer),
notification `aria-live`.

## Backend / mocks

- La marketplace consomme l’API publique ERP : `GET/POST /api/marketplace/*`
  sur `https://api.erp.codelab.bj` (identique au frontend `erp_crm_frontend`).
- `NEXT_PUBLIC_USE_MOCKS=true` sert uniquement de secours local via
  `src/lib/api/mocks.ts`. Laisse-le à `false` en usage normal.
- Les payloads passent toujours par les schémas Zod (`src/schemas/`) avant
  consommation UI.
- En cas de 5xx côté backend réel, l'app dégrade gracieusement vers les mocks
  pour préserver l'expérience.

> **Pour l'équipe backend** : le contrat exact (endpoints, schémas JSON,
> codes HTTP, CORS, cache, WhatsApp E164…) est documenté dans
> [`docs/BACKEND_API_CONTRACT.md`](docs/BACKEND_API_CONTRACT.md).

## Tests

```bash
npm test
```

Tests vitest sur les modules critiques :

- `buildWhatsAppMessage` (sélection template, contenu, normalisation qty)
- `buildWhatsAppUrl` (encodage, normalisation E164, fallback URL)
- Schémas Zod (parsing, validation, rejets)

## Qualité

- ESLint (config Next + Prettier compat)
- Prettier (+ tailwindcss plugin)
- TypeScript strict (`noUncheckedIndexedAccess`)
- Accessibilité : focus-visible global, `aria-live`, labels, contraste AA

## Limites MVP

- Pas de panier, pas de checkout, pas de compte client.
- Pas de paiement en ligne.
- Pas d'authentification vendeur (hors périmètre).
- I18n : français uniquement pour l'instant (structure prête).

## Prochaines étapes possibles

- Brancher le vrai backend (désactiver les mocks)
- Pagination/infinite scroll côté `/shops`
- i18n via `next-intl`
- Analytics CTA WhatsApp pour mesurer la conversion
- Tests E2E Playwright sur le flow boutique → fiche → WhatsApp

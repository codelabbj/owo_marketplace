# Implementation notes — Owo Marketplace MVP

Ce document récapitule les **décisions** prises pendant l'implémentation, les
**hypothèses** posées (en l'absence d'accès au backend ERP) et les **points
d'attention** à lever avant la mise en production.

---

## 1. Stack & versions

- **Next.js 15** (App Router), React 19, TypeScript strict.
- **Tailwind v3** (et non v4) — choix volontaire pour rester compatible avec la
  toolchain de la spec et les patterns courants en production.
- **@tanstack/react-query 5** pour les interactions client (recherche debounced,
  tri/filtre instantanés).
- **Zod** pour la validation runtime de tout payload entrant.
- **lucide-react** pour les icônes.
- **vitest + @testing-library/react** pour les tests UI critiques.
- ESLint (config Next + Prettier) + Prettier + plugin tailwindcss.

## 2. Variables d'environnement

Conformes à la spec :

- `NEXT_PUBLIC_MARKETPLACE_API_BASE_URL`
- `NEXT_PUBLIC_SITE_URL`

Ajout d'une troisième variable utile : `NEXT_PUBLIC_USE_MOCKS` (par défaut
`true`). Elle permet de basculer entre **mocks réalistes** et **API réelle**
sans changer une ligne de code applicatif.

L'objet `env` (`src/lib/config/env.ts`) parse les variables via Zod et
retombe sur des défauts raisonnables si la validation échoue.

## 3. Architecture des routes

Choix : exposer `/[shopSlug]` à la racine comme **route vitrine courte**
(option SEO recommandée par la spec). Si une migration vers `/shops/[slug]` est
souhaitée plus tard, prévoir une redirection `next.config.ts` pour préserver
les URLs courtes existantes.

Pages SEO critiques (`/`, `/shops`, `/[shopSlug]`, fiche produit) sont
**rendues côté serveur** avec `revalidate = 60`. Les pages produit/boutique
rendent du **JSON-LD** structuré (`Organization`, `Product`).

## 4. Données & couche API

### 4.1 Schémas Zod

`shop.schema.ts` et `product.schema.ts` collent au contrat de la spec
(`shop.id/slug/name/logo_url/cover_url/short_description/products_count`,
`product.price/promo_price/currency/in_stock/variants[]`, etc.). Tous les
champs jugés non garantis (description, contact_phone, address,
whatsapp_*, stock_label) sont rendus optionnels/nullable pour absorber les
variations backend.

### 4.2 Mappers DTO → Domaine

Les composants n'utilisent jamais directement les DTO (snake_case), mais des
types domaine en camelCase (`src/types/domain.ts`), produits via
`src/lib/api/mappers.ts`. Cela isole les éventuels changements d'API.

### 4.3 Stratégie mocks

`src/lib/api/mocks.ts` fournit 6 boutiques (mode, bijoux, tech, déco, beauté,
alimentaire), avec :

- une boutique **sans WhatsApp** (`kola-deco`) pour tester le CTA disabled
- des produits avec **variantes** (sneakers, smartphone, tshirt, karité)
- des produits en **promo** (casquette, collier, smartphone)
- des produits en **rupture** (tote bag, taille L sneakers) et en **stock
  limité** (casquette).

Le client API (`shops.ts`, `products.ts`) bascule automatiquement sur les
mocks si `NEXT_PUBLIC_USE_MOCKS=true`. En cas d'erreur 5xx du backend réel,
il dégrade gracieusement vers les mocks (utile pour la résilience pendant le
déploiement).

### 4.4 Hooks React Query

- `useShops({query, category, page})` — listing avec filtres
- `useShop(slug)` — page boutique (utilisée notamment dans la recherche
  globale pour les suggestions)
- `useProduct(shopSlug, productSlug)` — utilisable pour des composants client
- `useDebouncedValue` — debounce générique utilisé par la barre de recherche

## 5. Module WhatsApp (cœur du MVP)

`src/lib/whatsapp/` est volontairement **pur** (aucune dépendance UI), pour
une testabilité maximale.

### 5.1 `buildWhatsAppMessage`

Implémente strictement les 4 templates de la spec :

1. **promo** → si `promoPrice` est fourni
2. **variant** → sinon si `variantLabel` est fourni
3. **limited** → sinon si `stockLabel` matche `stock limité` / `limited stock` /
   `low stock` (insensible à la casse)
4. **simple** → cas par défaut

Le template **compact** (n°5 dans la spec) n'a pas été câblé par défaut sur
les cards : la spec V2 préconise plutôt de garder des messages cohérents et
explicites, et le template simple reste lisible et court. Le template compact
peut être ajouté en option si l'équipe veut le réintroduire.

`qty` est normalisé (≥ 1, entier).

### 5.2 `buildWhatsAppUrl`

- normalise le numéro vers E164 sans `+` (regex stricte 6–15 chiffres),
- supporte deux entrées : `phoneE164` **ou** `whatsappUrl` direct (option B
  de la spec). En cas de `whatsappUrl` malformé, retombe sur `phoneE164`.
- encode le texte avec `encodeURIComponent` (via `URL.searchParams.set` ou
  l'encodage manuel).

### 5.3 `WhatsAppButton`

Composant client unique (utilisé sur les cards et la fiche produit) qui :

- compose son message via `buildWhatsAppMessage` à partir d'un payload typé
- ouvre `window.open(url, "_blank")` puis fallback vers `location.href` si la
  popup est bloquée
- passe en état `loading` (~600 ms) avec spinner et libellé `Ouverture
  WhatsApp…`
- propose 3 tailles (`sm`/`md`/`lg`) — lg = 52 px mobile / 48 px desktop
  comme spécifié pour la fiche produit
- gère l'état **disabled** explicitement (pas de numéro, ou rupture, ou
  variante manquante) avec helper text et `aria-live`
- déclenche un `ContactFallbackModal` si l'ouverture est impossible (numéro
  copiable + bouton réessayer)

## 6. Design system

Tokens définis dans `src/app/globals.css` (CSS variables) **et** dans
`tailwind.config.ts` (couleurs, fontSize, radius, transitions). La couleur
accent retenue est l'**orange Owo** (`#f97316`/brand-500). Le bouton
WhatsApp utilise sa couleur dédiée (`#25D366`) pour rester reconnaissable
universellement.

Le composant `Topbar` est sticky avec backdrop-blur, hauteur 72 px, conforme
spec. Les cards utilisent `radius-lg` (16 px) et `padding 16` comme demandé.

## 7. États obligatoires

Chaque vue de données présente :

- **Loading** — `SkeletonGrid` (composant générique 8 items par défaut), plus
  un `loading.tsx` au niveau du group `(public)` pour la transition.
- **Empty** — composant `EmptyState` avec CTA contextuel (effacer filtres /
  retour accueil / découvrir d'autres boutiques).
- **Error** — composant `ErrorState` avec bouton **Réessayer** branché sur
  `query.refetch()`.
- **Success** — rendu nominal.

## 8. Accessibilité

- `:focus-visible` global avec ring 2px brand-500 (CSS).
- Skip link `Aller au contenu principal`.
- `aria-live` sur l'erreur d'ouverture WhatsApp.
- Sélecteur de variante en `radiogroup` avec `aria-checked`/`aria-disabled`.
- Galerie produit : `aria-pressed` sur les vignettes.
- Quantité : `aria-label="Quantité"`.

Le contraste AA a été visé sur les couleurs principales (texte ink/600 sur
fond blanc, ink-muted/500 sur fond clair).

## 9. SEO

- `metadata` par page (titre + description + canonical + OpenGraph + Twitter).
- `robots.ts` autorise tout sauf `/api/`.
- `sitemap.ts` enrichi dynamiquement avec les slugs boutique.
- JSON-LD (`Organization` + `Product`).

## 10. Hypothèses (à confirmer)

| # | Hypothèse | Justification | Action si différent |
|---|-----------|---------------|---------------------|
| H1 | `whatsapp_phone_e164` peut être absent → CTA disabled | Spec : "si numéro absent, CTA disabled" | RAS |
| H2 | Le backend renvoie soit `whatsapp_phone_e164` soit `whatsapp_url` (option A ou B) | Spec section "Contact WhatsApp" | Le builder gère les deux |
| H3 | Les slugs boutique sont uniques globalement (pas de collision avec `/shops`, `/about`, etc.) | Routing `/[shopSlug]` à la racine | Si ambigu, prévoir une redirection vers `/shops/[slug]` |
| H4 | `products_count` peut être manquant ou à 0 | DTO `default(0)` | RAS |
| H5 | `currency` par défaut = `XOF` (Bénin) | Marché cible | Configurable via la réponse API |
| H6 | Les images peuvent venir de domaines hétérogènes | Hosts utilisateurs | `next.config.ts` autorise tous les hosts HTTPS (à restreindre en prod) |
| H7 | Une variante en stock = 0 doit être visible mais désactivée | Spec QA | Implémenté |
| H8 | Le visiteur est sur mobile en majorité | Spec mobile-first | CTA WhatsApp sticky bottom sur fiche produit mobile |

## 11. Points d'attention / TODO avant prod

- **Domaines images** : restreindre `images.remotePatterns` aux CDN
  réellement autorisés (sécurité + perf).
- **Sitemap** : actuellement seules les boutiques de la page 1 sont
  référencées. À itérer sur toutes les pages quand le backend renvoie
  `count` réel.
- **i18n** : structure prête (locale `fr_FR`), mais aucun loader `next-intl`
  branché dans le MVP. À ajouter pour `EN`.
- **Analytics CTA WhatsApp** : prévoir un hook `onWhatsAppClick` pour piper
  vers l'analytics (Plausible / GA4) — utile pour mesurer la conversion.
- **Tests E2E** : non couverts dans ce MVP. Recommandé : Playwright sur le
  parcours `home → /[shopSlug] → /[shopSlug]/products/[productSlug] →
  click CTA → WhatsApp URL bien formée`.
- **Sécurité** : la description produit est rendue en texte simple (pas de
  HTML). Si on veut autoriser du markdown plus tard, prévoir un
  sanitizer (DOMPurify).
- **Performance** : Next/Image utilisé partout. Lazy-load par défaut, sauf
  hero produit (priority).
- **404 boutique vs 404 catch-all** : `/[shopSlug]` appelle `notFound()` sur
  ApiError 404. Si un slug coïncide avec une route Next existante (e.g.
  `about`), Next privilégiera la route déclarée.

## 12. Déploiement Vercel

Un fichier `vercel.json` est fourni à la racine. Il définit :

- `framework: "nextjs"` — détection explicite (Vercel le ferait
  automatiquement, mais c'est plus lisible).
- `regions: ["cdg1"]` — Paris, la région la plus proche du Bénin (latence
  optimale pour le marché cible). À ajuster si la cible géographique change.
- `cleanUrls: true`, `trailingSlash: false` — URLs propres, canoniques.
- **Redirections 301** vers la forme courte canonique :
  - `/shops/:shopSlug` → `/:shopSlug`
  - `/shops/:shopSlug/products/:productSlug` →
    `/:shopSlug/products/:productSlug`
  > Ne capture pas `/shops` (listing, 1 segment). À surveiller si on ajoute
  > des sous-routes type `/shops/featured` plus tard : il faudra une règle
  > plus spécifique au-dessus.
- **Headers de sécurité** sur toutes les routes : `X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS 2 ans
  preload.
- **Cache** spécifique pour `sitemap.xml` (revalidation 1h) et `robots.txt`
  (24h).

Aucune variable d'environnement n'est embarquée dans `vercel.json` (les
`NEXT_PUBLIC_*` sont à configurer via le dashboard Vercel ou la CLI :
`vercel env add NEXT_PUBLIC_MARKETPLACE_API_BASE_URL`).

## 13. Thème (light / dark / system)

Implémenté via une stratégie **CSS variables sémantiques** plutôt qu'une foule
de classes `dark:*` sur chaque composant. C'est ce qui rend le thème
maintenable.

- `tailwind.config.ts` : `darkMode: "class"`. Les couleurs `surface`, `ink`,
  `border` sont définies via `rgb(var(--color-...) / <alpha-value>)` pour
  garder le support des opacités Tailwind (`bg-surface/80`, etc.).
- `src/app/globals.css` : deux jeux de tokens (`:root` et `html.dark`). Le
  composant layer (`.card`, `.input`, `.btn-*`, `.badge-*`) utilise des
  tokens sémantiques et bascule automatiquement.
- Brand orange et vert WhatsApp restent constants entre les modes (identité).
- **Avant FOUC** : un `<script>` inline dans `<head>` (`layout.tsx`) lit
  `localStorage["owo-theme"]` et applique la classe `dark` sur `<html>` avant
  l'hydration React.
- `ThemeProvider` (`src/components/theme/ThemeProvider.tsx`) gère trois
  modes : `light` / `dark` / `system`. Persistance localStorage. Écoute
  `matchMedia("(prefers-color-scheme: dark)")` pour suivre l'OS quand
  `system`.
- `ThemeToggle` est dans la `Topbar`, présente Sun/Moon/Monitor en menu
  radio (`aria-checked`).
- `viewport.themeColor` réagit au mode système (couleur de la barre
  navigateur mobile).

> Pour changer l'aspect dark, ajuster uniquement les valeurs RGB dans
> `:root.dark`. Aucun composant à toucher.

## 14. Critères d'acceptation — vérification

- [x] Un visiteur peut ouvrir `/didier-shop` et voir les produits.
- [x] Depuis la fiche produit, un clic CTA ouvre WhatsApp avec message
  pré-rempli correct (testé via mocks + tests unitaires sur les builders).
- [x] Aucun flow de création de compte / panier / checkout.
- [x] États loading / empty / error / success gérés.
- [x] UI responsive mobile-first (grilles 2/3/4 colonnes selon BP, CTA
  sticky bottom mobile sur fiche produit).
- [x] Build production OK, tests vitest verts (24/24).

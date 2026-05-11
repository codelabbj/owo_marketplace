# Owo Marketplace — Contrat API backend

> Document de référence à destination de l'équipe **backend**.
> Définit **exactement** ce que le frontend marketplace consomme : endpoints,
> schémas JSON, contraintes, codes HTTP, comportements attendus.

**Source de vérité côté frontend** : les schémas Zod
[`src/schemas/shop.schema.ts`](../src/schemas/shop.schema.ts),
[`src/schemas/product.schema.ts`](../src/schemas/product.schema.ts) et
[`src/schemas/contact-intent.schema.ts`](../src/schemas/contact-intent.schema.ts)
(corps du `POST` trace contact / WhatsApp).
Le frontend **valide chaque réponse** avec ces schémas avant de l'utiliser.
Si un champ requis manque ou a un mauvais type, la requête est rejetée côté
client.

---

## 1. Sommaire

1. [Vue d'ensemble](#2-vue-densemble)
2. [Conventions générales](#3-conventions-générales)
3. [Endpoint 1 — Liste des boutiques](#4-endpoint-1--get-apimarketplaceshops)
4. [Endpoint 2 — Détail boutique + catalogue](#5-endpoint-2--get-apimarketplaceshopsslug)
5. [Endpoint 3 — Détail produit](#6-endpoint-3--get-apimarketplaceshopsshopslugproductsproductslug)
6. [Endpoint 4 — Intention de contact WhatsApp](#66-post-apimarketplacecontact-intents)
7. [Schémas de référence](#7-schémas-de-référence)
8. [Contrat WhatsApp](#8-contrat-whatsapp)
9. [Pagination](#9-pagination)
10. [Codes HTTP & erreurs](#10-codes-http--erreurs)
11. [Cache HTTP recommandé](#11-cache-http-recommandé)
12. [Sécurité](#12-sécurité)
13. [Champs critiques — explications métier](#13-champs-critiques--explications-métier)
14. [Activation côté frontend](#14-activation-côté-frontend)
15. [Endpoints optionnels (V2)](#15-endpoints-optionnels-v2)
16. [Checklist de mise en production](#16-checklist-de-mise-en-production)

---

## 2. Vue d'ensemble

Le frontend Next.js a besoin de **trois endpoints publics en lecture** (sans auth)
et d'**un endpoint public en écriture** (trace contact) pour la marketplace en
production :

| # | Méthode | Endpoint | Utilisé par |
|---|---------|----------|-------------|
| 1 | `GET` | `/api/marketplace/shops` | Page d'accueil (vedettes, suggestions search), page `/shops` (listing) |
| 2 | `GET` | `/api/marketplace/shops/{slug}` | Page boutique `/{shopSlug}` (header + catalogue) |
| 3 | `GET` | `/api/marketplace/shops/{shopSlug}/products/{productSlug}` | Fiche produit `/{shopSlug}/products/{productSlug}` |
| 4 | `POST` | `/api/marketplace/contact-intents` | CTA **Commander sur WhatsApp** (carte produit, fiche produit) : enregistrement trace **avant** ouverture WhatsApp |

Pas d'authentification visiteur, pas de panier, pas de checkout. Le `POST`
n°4 ne crée pas de compte : il enregistre une intention liée au contexte
produit + message prérempli + coordonnées acheteur (cf. §6.6).

---

## 3. Conventions générales

- **Base URL** : configurable côté frontend via
  `NEXT_PUBLIC_MARKETPLACE_API_BASE_URL` (par défaut `https://api.owo.bj`).
- **Format** : JSON UTF-8. `Content-Type: application/json`.
- **Casing JSON** : `snake_case` pour toutes les clés (le frontend les mappe
  en interne en `camelCase`).
- **Dates** : ISO 8601 UTC (`2026-05-09T10:30:00Z`) si jamais utilisées
  (pas requises dans le MVP).
- **Identifiants** : `id` est une string opaque (UUID, ID technique, etc. —
  peu importe). `slug` est une string lisible URL-safe (regex recommandée :
  `^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$`).
- **Champs nullable vs absents** : le frontend tolère **les deux** pour les
  champs optionnels (ex : `logo_url`, `whatsapp_phone_e164`). Convention
  recommandée : retourner explicitement `null` plutôt qu'omettre la clé.
- **Devise** : `currency` est un code ISO 4217 (`XOF`, `EUR`, `USD`, etc.).
  Par défaut `XOF` (Bénin).
- **Devise & format prix** : le **prix est un nombre** (entier ou float),
  jamais une string formatée. Le frontend formate via `Intl.NumberFormat`.

---

## 4. Endpoint 1 — `GET /api/marketplace/shops`

Liste paginée des boutiques. Utilisé pour le listing `/shops`, les sections
"vedettes" de l'accueil, et la recherche globale.

> **Catégories (erratum)** : le champ `category` **n'existe plus** sur une boutique
> (réponse liste et détail). Une boutique peut vendre des produits de catégories
> différentes. La catégorie canonique s'applique aux **produits** uniquement
> (`GET /api/marketplace/categories/`). Voir
> [`FRONTEND_MARKETPLACE_CATEGORY_CHANGES.md`](./FRONTEND_MARKETPLACE_CATEGORY_CHANGES.md).

### 4.1 Query parameters

| Param | Type | Obligatoire | Défaut | Notes |
|-------|------|-------------|--------|-------|
| `query` | string | non | — | Recherche full-text sur `name` + `short_description`. Min 1 char. |
| `page` | int ≥ 1 | non | `1` | Pagination. |
| `page_size` | int 1..50 | non | `12` | Optionnel — la valeur par défaut serveur fait foi. Frontend par défaut : 12. |

### 4.2 Réponse `200 OK`

```json
{
  "count": 128,
  "next": "https://api.owo.bj/api/marketplace/shops?page=2",
  "previous": null,
  "results": [
    {
      "id": "shop_01HZ7K3M9X8YQ1A2B3C4D5E6F7",
      "slug": "didier-shop",
      "name": "Didier Shop",
      "logo_url": "https://cdn.owo.bj/shops/didier/logo.png",
      "cover_url": "https://cdn.owo.bj/shops/didier/cover.jpg",
      "short_description": "Mode urbaine, accessoires & sneakers à Cotonou.",
      "products_count": 14,
      "city": "Cotonou"
    }
  ]
}
```

### 4.3 Schéma de chaque item (`ShopSummary`)

| Champ | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | **oui** | Identifiant opaque stable. |
| `slug` | string | **oui** | Lisible, URL-safe, **stable**, **unique** sur toute la marketplace. |
| `name` | string | **oui** | Nom commercial. |
| `logo_url` | string\|null | non | URL HTTPS absolue d'une image carrée recommandée ≥ 256×256. |
| `cover_url` | string\|null | non | URL HTTPS absolue d'une image bannière recommandée ≥ 1200×400. |
| `short_description` | string\|null | non | Max ~160 caractères recommandé (clamp 2 lignes UI). |
| `products_count` | int ≥ 0 | non (défaut 0) | Nombre total de produits **publiés** (filtre `published=true` côté backend). |
| `city` | string\|null | non | Ville de la boutique (affichée en meta UI). |

### 4.4 Comportement attendu

- **Ne lister QUE les boutiques actives** (visibles publiquement). Les
  boutiques désactivées / supprimées doivent être absentes.
- **Tri par défaut** : pertinence (popularité). Le frontend gère un tri local
  supplémentaire (`alpha`, `newest`) côté UI ; aucun param `sort` n'est requis
  côté backend MVP.
- **Recherche** : le param `query` est appliqué côté serveur (insensible à
  la casse, sur `name` + `short_description`). Si non fourni, retourner
  toutes les boutiques.

---

## 5. Endpoint 2 — `GET /api/marketplace/shops/{slug}`

Détail d'une boutique **+ son catalogue**. Page boutique publique.

### 5.1 Path parameter

- `slug` : slug lisible de la boutique (ex : `didier-shop`).

### 5.2 Réponse `200 OK`

```json
{
  "shop": {
    "id": "shop_01HZ7K3M9X8YQ1A2B3C4D5E6F7",
    "slug": "didier-shop",
    "name": "Didier Shop",
    "logo_url": "https://cdn.owo.bj/shops/didier/logo.png",
    "cover_url": "https://cdn.owo.bj/shops/didier/cover.jpg",
    "description": "Bienvenue chez Didier Shop. Sélection pointue streetwear, sneakers et accessoires.",
    "short_description": "Mode urbaine, accessoires & sneakers à Cotonou.",
    "contact_phone": "+229 60 00 00 00",
    "address": "Cotonou, Bénin",
    "whatsapp_phone_e164": "22960000000",
    "whatsapp_url": null,
    "products_count": 14
  },
  "products": {
    "count": 14,
    "results": [
      {
        "id": "prod_01HZ7K9KX6QYR8WA1B2C3D4E5F",
        "slug": "t-shirt-noir",
        "name": "T-shirt premium noir",
        "image_url": "https://cdn.owo.bj/products/tshirt-noir-1.jpg",
        "price": 7500,
        "promo_price": null,
        "currency": "XOF",
        "in_stock": true,
        "stock_label": null
      },
      {
        "id": "prod_01HZ7KAA00000000000000",
        "slug": "casquette-classique",
        "name": "Casquette classique brodée",
        "image_url": "https://cdn.owo.bj/products/casquette-1.jpg",
        "price": 5000,
        "promo_price": 3990,
        "currency": "XOF",
        "in_stock": true,
        "stock_label": "Stock limité"
      }
    ]
  }
}
```

### 5.3 Schéma `shop` (objet boutique enrichi)

| Champ | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | **oui** | |
| `slug` | string | **oui** | Doit matcher le slug demandé. |
| `name` | string | **oui** | |
| `logo_url` | string\|null | non | |
| `cover_url` | string\|null | non | |
| `description` | string\|null | non | Description longue. Markdown **non supporté** côté frontend MVP — texte brut uniquement. |
| `short_description` | string\|null | non | |
| `contact_phone` | string\|null | non | Format libre, **affiché tel quel** (ex : `+229 60 00 00 00`). N'est PAS utilisé pour WhatsApp (cf. §8). |
| `address` | string\|null | non | Adresse texte simple. |
| `whatsapp_phone_e164` | string\|null | **conditionnel** | Cf. §8. **Indispensable** si la boutique veut recevoir des commandes. |
| `whatsapp_url` | string\|null | non | Cf. §8 (option B). |
| `products_count` | int ≥ 0 | non (défaut 0) | Total de produits publiés. |

### 5.4 Schéma de chaque `products.results[]` (`ProductSummary`)

| Champ | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | **oui** | |
| `slug` | string | **oui** | URL-safe, **unique au sein de la boutique**. |
| `name` | string | **oui** | |
| `image_url` | string\|null | non | URL HTTPS absolue de l'image principale (carrée, ≥ 600×600 recommandé). |
| `price` | number ≥ 0 | **oui** | Prix de référence (sans promo). Entier conseillé pour XOF. |
| `promo_price` | number\|null | non | Si présent et > 0, le frontend affiche la promo et utilise le **template message promo**. Doit être ≤ `price`. |
| `currency` | string | non (défaut `"XOF"`) | Code ISO 4217. |
| `in_stock` | boolean | non (défaut `true`) | `false` → CTA WhatsApp désactivé sur la card, badge "Rupture". |
| `stock_label` | string\|null | non | Libellé court affiché en badge. **Si la string contient `stock limité` / `limited stock` / `low stock`** (insensible à la casse), le frontend utilise le **template message "stock limité"**. |

### 5.5 Comportement attendu

- Si `slug` introuvable → `404 Not Found` (cf. §10).
- Si la boutique est désactivée → `404 Not Found` (ne pas exposer 410/403 :
  on ne veut pas signaler son existence).
- **Ne lister QUE les produits publiés** dans `products.results`.
- Le frontend ne pagine pas le catalogue boutique pour le MVP : retourne
  jusqu'à **~50 produits** dans `results`. Ajouter une pagination plus tard
  si nécessaire (cf. §15).

---

## 6. Endpoint 3 — `GET /api/marketplace/shops/{shopSlug}/products/{productSlug}`

Fiche produit complète.

### 6.1 Path parameters

- `shopSlug` : slug de la boutique.
- `productSlug` : slug du produit (unique au sein de la boutique).

### 6.2 Réponse `200 OK`

```json
{
  "id": "prod_01HZ7K9KX6QYR8WA1B2C3D4E5F",
  "slug": "t-shirt-noir",
  "name": "T-shirt premium noir",
  "description": "T-shirt en coton bio 220 g/m². Coupe droite, col rond.",
  "images": [
    "https://cdn.owo.bj/products/tshirt-noir-1.jpg",
    "https://cdn.owo.bj/products/tshirt-noir-2.jpg",
    "https://cdn.owo.bj/products/tshirt-noir-3.jpg"
  ],
  "price": 7500,
  "promo_price": null,
  "currency": "XOF",
  "stock": 18,
  "variants": [
    { "id": "var_s",  "label": "S",  "price": 7500, "stock": 4 },
    { "id": "var_m",  "label": "M",  "price": 7500, "stock": 6 },
    { "id": "var_l",  "label": "L",  "price": 7500, "stock": 0 },
    { "id": "var_xl", "label": "XL", "price": 8000, "stock": 8 }
  ],
  "shop": {
    "id": "shop_01HZ7K3M9X8YQ1A2B3C4D5E6F7",
    "slug": "didier-shop",
    "name": "Didier Shop",
    "whatsapp_phone_e164": "22960000000",
    "whatsapp_url": null
  }
}
```

### 6.3 Schéma `ProductDetail`

| Champ | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | **oui** | |
| `slug` | string | **oui** | |
| `name` | string | **oui** | |
| `description` | string | non (défaut `""`) | Texte brut, multi-lignes accepté. |
| `images` | array\<string\> | non (défaut `[]`) | URLs HTTPS absolues. La 1re est l'image principale (cover, OG). Recommandé : 1 à 6 images. |
| `price` | number ≥ 0 | **oui** | Prix de référence du produit. |
| `promo_price` | number\|null | non | Prix promo. Si présent, doit être ≤ `price`. |
| `currency` | string | non (défaut `"XOF"`) | |
| `stock` | int ≥ 0 | non (défaut 0) | Stock global (cf. §13.3). |
| `variants` | array\<`ProductVariant`\> | non (défaut `[]`) | Cf. §6.4. |
| `shop.id` | string | **oui** | |
| `shop.slug` | string | **oui** | |
| `shop.name` | string | **oui** | |
| `shop.whatsapp_phone_e164` | string\|null | conditionnel | Cf. §8. |
| `shop.whatsapp_url` | string\|null | non | Cf. §8. |

### 6.4 Schéma `ProductVariant`

| Champ | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | **oui** | Unique au sein du produit. |
| `label` | string | **oui** | Libellé court (`S`, `M`, `Rouge`, `64 Go`…). |
| `price` | number ≥ 0 | **oui** | Peut différer du `price` du produit. |
| `stock` | int ≥ 0 | non (défaut 0) | `0` → variante affichée mais désactivée ("Indisponible"). |

### 6.5 Comportement attendu

- Si la boutique ou le produit est inconnu / désactivé / non publié →
  `404 Not Found`.
- **Variantes** : si `variants.length > 0`, le frontend **oblige la sélection
  d'une variante** avant d'activer le CTA WhatsApp. Les variantes avec
  `stock = 0` sont affichées mais grisées.
- **Stock global vs variantes** : si `variants.length > 0`, le `stock` racine
  peut être ignoré côté UI (la disponibilité dépend de la variante choisie).
  Recommandation : remplir quand même le `stock` racine = somme des stocks
  des variantes (utile pour le SEO `availability`).

---

## 6.6 `POST /api/marketplace/contact-intents`

Lorsqu'un visiteur sans compte clique sur **Commander sur WhatsApp**, le
frontend envoie d'abord ce `POST`, puis ouvre WhatsApp (nouvel onglet) avec le
même texte que `prefilled_message`. Les coordonnées acheteur (prénom, nom,
téléphone) sont saisies une fois puis conservées dans le **navigateur**
(`localStorage`) ; elles ne sont envoyées au backend qu'à cette étape.

**Auth** : aucune. **CORS** : l'API doit accepter `POST` + en-têtes JSON depuis
l'origine du site marketplace.

### 6.6.1 Corps JSON (`Content-Type: application/json`)

| Champ | Type | Obligatoire | Notes |
|-------|------|-------------|--------|
| `first_name` | string (1–80) | **oui** | |
| `last_name` | string (1–80) | **oui** | |
| `phone_e164` | string | **oui** | **Chiffres uniquement**, longueur 6–15 (indicatif pays inclus, sans préfixe `+`). Aligné sur `whatsapp_phone_e164` boutique. |
| `shop_slug` | string | **oui** | |
| `product_slug` | string | **oui** | |
| `prefilled_message` | string | **oui** | Corps du message WhatsApp (UTF-8), identique à celui encodé dans l'URL `text`. |
| `product_url` | string (URL absolue) | **oui** | Lien public vers la fiche produit sur la marketplace. |

### 6.6.2 Réponses attendues

- **`200 OK`** ou **`201 Created`** ou **`204 No Content`** : succès. Corps
  JSON optionnel (ex. `{ "id": "…" }` si vous exposez un identifiant de trace).
- **`400 Bad Request`** : corps de validation (format libre côté serveur).
- **`429 Too Many Requests`** : limitation ; le frontend affiche une erreur
  générique et l'utilisateur peut réessayer.

En cas d'erreur **5xx** ou réseau, le frontend **n'ouvre pas** WhatsApp et
affiche un message invitant à réessayer.

---

## 7. Schémas de référence

> Ces schémas sont la traduction directe des Zod schemas frontend. Chacun est
> validé strictement côté client.

### 7.1 `ShopSummary` (listing)

```jsonc
{
  "id": "string",
  "slug": "string",
  "name": "string",
  "logo_url": "string|null",
  "cover_url": "string|null",
  "short_description": "string|null",
  "products_count": "integer >= 0",
  "city": "string|null"
}
```

### 7.2 `ShopDetail` (page boutique, dans le bundle)

```jsonc
{
  "id": "string",
  "slug": "string",
  "name": "string",
  "logo_url": "string|null",
  "cover_url": "string|null",
  "description": "string|null",
  "short_description": "string|null",
  "contact_phone": "string|null",
  "address": "string|null",
  "whatsapp_phone_e164": "string|null",
  "whatsapp_url": "string|null",
  "products_count": "integer >= 0"
}
```

### 7.3 `ProductSummary` (catalogue boutique, cards)

```jsonc
{
  "id": "string",
  "slug": "string",
  "name": "string",
  "image_url": "string|null",
  "price": "number >= 0",
  "promo_price": "number|null",
  "currency": "string",
  "in_stock": "boolean",
  "stock_label": "string|null"
}
```

### 7.4 `ProductDetail` (fiche produit)

```jsonc
{
  "id": "string",
  "slug": "string",
  "name": "string",
  "description": "string",
  "images": ["string"],
  "price": "number >= 0",
  "promo_price": "number|null",
  "currency": "string",
  "stock": "integer >= 0",
  "variants": [
    {
      "id": "string",
      "label": "string",
      "price": "number >= 0",
      "stock": "integer >= 0"
    }
  ],
  "shop": {
    "id": "string",
    "slug": "string",
    "name": "string",
    "whatsapp_phone_e164": "string|null",
    "whatsapp_url": "string|null"
  }
}
```

---

## 8. Contrat WhatsApp

C'est le **cœur du MVP**. Le visiteur clique → ouvre WhatsApp avec un message
pré-rempli vers le vendeur. Deux options possibles :

### 8.1 Option A (recommandée) — `whatsapp_phone_e164`

Le backend renvoie le **numéro normalisé E164 sans `+` ni espaces** :

```json
"whatsapp_phone_e164": "22960000000"
```

Format strict :
- chiffres uniquement (0-9), longueur 6 à 15
- code pays inclus, **sans** le `+` initial
- pas d'espaces, parenthèses, tirets

Exemples :

| Saisie utilisateur | À renvoyer dans l'API |
|--------------------|-----------------------|
| `+229 60 00 00 00` | `"22960000000"` |
| `+33 6 12 34 56 78` | `"33612345678"` |
| `0033 6 12 34 56 78` | `"33612345678"` (le `00` initial est retiré) |

Le frontend construit alors `https://wa.me/{phone}?text={encodeURIComponent(message)}`.

### 8.2 Option B (alternative) — `whatsapp_url`

Le backend renvoie l'URL prête à l'emploi :

```json
"whatsapp_url": "https://wa.me/22960000000"
```

Le frontend remplace le param `text` par le message pré-rempli côté client.
Cette option est utile si le backend gère lui-même la normalisation/validation
ou veut tracker les liens.

### 8.3 Ordre de priorité

Si **les deux** sont fournis, le frontend privilégie `whatsapp_url` mais
retombe sur `whatsapp_phone_e164` en cas d'URL malformée.

### 8.4 Si aucun n'est fourni

Le bouton WhatsApp est **désactivé** avec le message
`Contact WhatsApp indisponible`. La fiche produit reste accessible mais le CTA
principal est inutilisable. **À éviter** pour les boutiques qui veulent
recevoir des commandes.

### 8.5 Validation backend recommandée

À la création/édition d'une boutique côté back-office :

```regex
^\d{6,15}$
```

(après normalisation : suppression de `+`, espaces, parenthèses, tirets, `00`
international préfixe).

---

## 9. Pagination

Format **uniforme** sur tous les endpoints qui paginent (actuellement seul
`/api/marketplace/shops`) :

```json
{
  "count": 128,
  "next": "https://api.owo.bj/api/marketplace/shops?page=2",
  "previous": null,
  "results": []
}
```

| Champ | Type | Description |
|-------|------|-------------|
| `count` | int | Nombre **total** d'éléments tous filtres confondus. |
| `next` | string\|null | URL absolue vers la page suivante, ou `null` si dernière page. |
| `previous` | string\|null | URL absolue vers la page précédente, ou `null` si première page. |
| `results` | array | Éléments de la page courante. |

> Format compatible **Django REST Framework** par défaut. Pratique si vous
> utilisez DRF en backend.

---

## 10. Codes HTTP & erreurs

### 10.1 Codes attendus

| Code | Quand |
|------|-------|
| `200` | Succès. |
| `404` | Boutique ou produit inconnu / désactivé / non publié. |
| `400` | Param invalide (ex : `page=abc`). |
| `429` | Rate limit (à mettre en place côté backend si besoin). |
| `500` | Erreur serveur. **Le frontend dégrade gracieusement** vers les mocks (mode dev) ou affiche un état d'erreur (`Réessayer`). |

### 10.2 Format de réponse d'erreur

Pas strictement requis pour le MVP (le frontend ne lit pas le body en cas
d'erreur 4xx/5xx), mais format recommandé pour cohérence :

```json
{
  "error": {
    "code": "shop_not_found",
    "message": "Shop didier-shop not found"
  }
}
```

Le frontend affiche un message générique ("Une erreur est survenue") + un
bouton **Réessayer**.

---

## 11. Cache HTTP recommandé

Le frontend Next.js utilise `revalidate: 60` côté serveur (ISR) sur les pages
SEO critiques. Pour optimiser :

| Endpoint | Cache-Control recommandé |
|----------|--------------------------|
| `/api/marketplace/shops` (listing) | `public, max-age=0, s-maxage=60, stale-while-revalidate=300` |
| `/api/marketplace/shops/{slug}` | `public, max-age=0, s-maxage=60, stale-while-revalidate=300` |
| `/api/marketplace/shops/{shopSlug}/products/{productSlug}` | `public, max-age=0, s-maxage=60, stale-while-revalidate=300` |

`s-maxage` permet aux CDN/proxy intermédiaires de cacher 60s. `max-age=0`
empêche le cache navigateur agressif. `stale-while-revalidate` autorise à
servir une réponse "périmée" pendant qu'une nouvelle est récupérée.

### Invalidation
Quand un vendeur publie/modifie un produit, **invalider** le cache de :
- `/api/marketplace/shops/{slug}` du shop concerné
- `/api/marketplace/shops/{slug}/products/{productSlug}`
- éventuellement `/api/marketplace/shops` si le `products_count` change

Méthode recommandée : tag-based (Vercel Data Cache via `revalidateTag` côté
front) ou simplement laisser tourner le TTL de 60s (acceptable pour MVP).

---

## 12. Sécurité

- **Pas d'authentification** côté visiteur. Les endpoints sont publics
  (lecture seule, GET uniquement).
- **Rate-limiting** : recommandé (ex : 60 req/min par IP) pour éviter le
  scraping. À placer côté API gateway / reverse-proxy.
- **Pas de PII** dans les réponses publiques (numéros vendeurs OK car
  c'est l'objet du service ; données clients **jamais**).
- **CORS** : à définir conjointement une fois le domaine de production
  connu. Le frontend transmettra à ce moment-là la liste des origines à
  autoriser (domaine prod + previews Vercel). En attendant, on peut tester
  via curl ou un proxy local.

---

## 13. Champs critiques — explications métier

### 13.1 `slug` (boutique et produit)

- **Stable** : ne doit jamais changer une fois publié (URLs SEO).
- **URL-safe** : `^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$`.
- **Unique** :
  - boutique : unique sur **toute la marketplace**
  - produit : unique au sein d'**une boutique** (deux boutiques peuvent avoir
    chacune un produit `t-shirt-noir`)
- **Réservés (interdits pour `shopSlug`)** : valeurs qui collisionnent avec les
  routes Next.js publiques :
  - `shops`, `about`, `help`, `terms`, `privacy`
  - `api`, `_next`, `static`, `sitemap.xml`, `robots.txt`, `favicon.ico`,
    `icon.png`, `apple-icon.png`
  - À enrichir si on ajoute d'autres routes statiques.

### 13.2 `image_url` / `images` / `logo_url` / `cover_url`

- **URLs HTTPS absolues** uniquement.
- Recommandé : servies par un CDN (cache long, formats modernes).
- Tailles minimales conseillées :
  - `logo_url` : 256×256 (idéalement carré)
  - `cover_url` : 1200×400 ou 1920×640
  - `images[*]` produit : 800×800 minimum, idéal carré (ratio 1:1)
- Le frontend utilise `next/image` (auto-resize/optimization). Les domaines
  doivent être **whitelistés** dans `next.config.ts` (`images.remotePatterns`).
  → Communiquer la liste des hosts CDN au frontend.

### 13.3 `in_stock` (listing) vs `stock` (détail)

- **`in_stock`** (boolean, listing/cards) : true s'il y a **au moins une**
  unité disponible (produit ou variante). False → CTA disabled, badge
  "Rupture".
- **`stock`** (int, fiche produit) : stock total. Utilisé pour le SEO
  (`schema.org/Product` `availability: InStock | OutOfStock`).
- **`variants[].stock`** : par variante. Une variante avec `stock = 0` est
  affichée mais désactivée (libellé "Indisponible").
- Cohérence attendue :
  - `in_stock = true` ⇔ `stock > 0` OU `variants.some(v => v.stock > 0)`

### 13.4 `stock_label`

Champ optionnel **purement UI**. Trois usages :
- `null` ou absent → pas de badge.
- `"Stock limité"` (ou variante avec "limited stock", "low stock") → badge
  ambre + **template WhatsApp "stock limité"** activé.
- toute autre string → affichée telle quelle en badge informatif (ex :
  `"Dernières pièces"`, `"Bientôt épuisé"`).

### 13.5 `promo_price`

- Si présent et ≠ null → `promo_price` doit être **strictement inférieur** à
  `price`.
- Le frontend affiche `promo_price` en accent et `price` barré.
- Active le **template WhatsApp "promo"** (priorité la plus haute).
- Aucune date d'expiration côté MVP — la promo reste tant que le champ est
  rempli.

### 13.6 `currency`

- Code ISO 4217. Le frontend formate via `Intl.NumberFormat("fr-FR", {
  style: "currency", currency })`.
- Pour `XOF`, le frontend force `maximumFractionDigits: 0` (les FCFA n'ont
  pas de décimales).

---

## 14. Activation côté frontend

Une fois les 3 endpoints livrés et accessibles, **2 variables d'environnement**
suffisent à basculer le frontend du mode "mocks" au mode "API réelle" :

```bash
# .env.local (ou variables Vercel)
NEXT_PUBLIC_MARKETPLACE_API_BASE_URL=https://api.owo.bj
NEXT_PUBLIC_USE_MOCKS=false
```

Le frontend appellera alors les endpoints sur `NEXT_PUBLIC_MARKETPLACE_API_BASE_URL`.

> **Mode dégradé** : si `NEXT_PUBLIC_USE_MOCKS=false` et qu'un endpoint
> retourne `5xx`, le frontend retombe automatiquement sur les mocks de dev
> pour préserver l'UX. Pour les `4xx`, il affiche l'état d'erreur.

---

## 15. Endpoints optionnels (V2)

Pas requis pour le MVP, mais recommandés à terme :

### 15.1 Catégories (produits uniquement)

`GET /api/marketplace/categories/` (sans auth). Retourne typiquement un **tableau**
`[{ "slug": "...", "label": "..." }, ...]` (format exact selon spec backend).

- Les slugs valident le champ **`category` des produits** (création / édition vendeur, payload public produit si exposé).
- **Aucun** champ `category` sur la boutique (`GET /shops/`, `GET /shops/{slug}/`).

> Les tuiles « catégories » sur l'accueil du frontend peuvent rediriger vers une
> recherche texte (`/shops?query=…`) en attendant le branchement dynamique sur
> cet endpoint.

### 15.2 Recherche globale (produits + boutiques)

`GET /api/marketplace/search?q=&type=`

Permet une recherche unifiée sur produits + boutiques.

### 15.3 Catalogue boutique paginé

`GET /api/marketplace/shops/{slug}/products?page=&sort=`

(Si le backend supporte un filtre catalogue par catégorie produit, il peut
exposer `category=` comme **slug canonique produit**, pas une catégorie boutique.)

Si une boutique a >50 produits, retourner le catalogue paginé séparément du
détail boutique.

### 15.4 Produits tendances

`GET /api/marketplace/products/trending?limit=`

Retourne les produits "tendance" (les plus consultés, les plus récents, etc.).
Format : array de `ProductSummary` enrichi de `shop_slug` + `shop_name`.

### 15.5 Boutiques en vedette

`GET /api/marketplace/shops/featured?limit=`

Les boutiques en vedette pour l'accueil.

### 15.6 Sitemap dynamique

Pas un endpoint, mais : exposer un endpoint `GET /api/marketplace/shops/all` (ou
similaire) qui liste **tous** les slugs de boutiques publiées (sans pagination,
ou avec une pagination spéciale). Permet au frontend de générer un
`sitemap.xml` complet (actuellement limité à la page 1 du listing — cf.
`docs/IMPLEMENTATION_NOTES.md` §11).

---

## 16. Checklist de mise en production

Côté backend :

- [ ] 3 endpoints publics implémentés et accessibles
- [ ] Format JSON conforme aux schémas §7
- [ ] Validation des slugs (pattern + unicité + liste de slugs réservés §13.1)
- [ ] Validation des numéros WhatsApp (E164 §8.5)
- [ ] Cache-Control sur les endpoints lecture (§11)
- [ ] Codes HTTP corrects (404 pour boutique/produit inconnu)
- [ ] Filtrage automatique des boutiques désactivées
- [ ] Filtrage automatique des produits non publiés
- [ ] Liste des **hosts d'images CDN** communiquée au frontend (à ajouter
  dans `next.config.ts`)
- [ ] Endpoint de healthcheck (ex : `GET /healthz`) pour monitoring

Côté frontend (à exécuter par l'équipe front quand le back est prêt) :

- [ ] Renseigner `NEXT_PUBLIC_MARKETPLACE_API_BASE_URL` sur Vercel
- [ ] Passer `NEXT_PUBLIC_USE_MOCKS=false`
- [ ] Mettre à jour `next.config.ts` `images.remotePatterns` avec les hosts
  CDN réels
- [ ] Tester le parcours complet : `/` → `/shops` → `/{shopSlug}` →
  fiche produit → CTA WhatsApp
- [ ] Vérifier le sitemap (`/sitemap.xml`) après bascule

---

**Contact frontend** : pour toute question sur les contrats, ce document est
la référence. En cas d'évolution, ouvrir une PR sur ce fichier (ou notifier
l'équipe frontend pour qu'on mette à jour `src/schemas/*.ts`).

# Reste à faire — API backend marketplace

Ce document résume **ce que le frontend marketplace attend du backend** : URLs exactes, méthodes, corps et réponses JSON, codes HTTP. L’objectif est de limiter les allers-retours d’intégration.

Pour le détail métier (comportements, cache, SEO, edge cases), voir aussi  
[`BACKEND_API_CONTRACT.md`](./BACKEND_API_CONTRACT.md).

---

## 1. Contexte

| Élément | Valeur |
|--------|--------|
| **Base URL** | Configurée côté frontend via `NEXT_PUBLIC_MARKETPLACE_API_BASE_URL` (défaut `https://api.owo.bj`). Toutes les routes ci-dessous sont **relatives à cette base**. |
| **Format** | JSON, UTF-8, `Content-Type: application/json` pour le `POST`. |
| **Clés JSON** | **`snake_case`** (aligné sur les schémas Zod du repo). |
| **Auth visiteur** | **Aucune** sur ces endpoints. |
| **Origine des appels** | Navigateur (Next.js) + éventuellement préchargement côté serveur pour les `GET`. Le **`POST`** doit être autorisé en **CORS** depuis l’origine du site marketplace (`NEXT_PUBLIC_SITE_URL`, ex. `https://owo.bj`). |

Le frontend valide les réponses `GET` avec les schémas dans :

- `src/schemas/shop.schema.ts`
- `src/schemas/product.schema.ts`

Le corps du `POST` trace contact est validé avec `src/schemas/contact-intent.schema.ts`.

---

## 2. Synthèse des endpoints

| # | Méthode | Chemin exact (tel qu’appelé par le frontend) | Rôle |
|---|---------|-----------------------------------------------|------|
| 1 | `GET` | `/api/marketplace/shops` | Liste paginée des boutiques (+ recherche). |
| 2 | `GET` | `/api/marketplace/shops/{slug}` | Détail boutique + catalogue produits. |
| 3 | `GET` | `/api/marketplace/shops/{shopSlug}/products/{productSlug}` | Fiche produit. |
| 4 | `POST` | `/api/marketplace/contact-intents` | Trace « intention WhatsApp » **avant** redirection `wa.me` / URL WhatsApp. |

**Slash final :** le frontend appelle ces URLs **sans** slash final (ex. `.../contact-intents`, pas `.../contact-intents/`). Si le framework backend redirige `POST` vers une URL avec slash, vérifier que la redirection préserve le corps (sinon exposer la même route sans redirection).

---

## 3. `GET /api/marketplace/shops`

### 3.1 Paramètres de requête (query)

| Paramètre | Type | Obligatoire | Description |
|-----------|------|-------------|----------------|
| `query` | string | non | Recherche (ex. nom + description courte). |
| `page` | entier ≥ 1 | non | Pagination (défaut côté serveur, ex. `1`). |

Le frontend peut aussi envoyer d’autres paramètres selon évolutions ; les ignorer silencieusement si non supportés.

### 3.2 Réponse `200 OK` — structure obligatoire

Le JSON **doit** pouvoir être parsé avec le schéma `PaginatedShopsSchema` :

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
      "short_description": "Mode urbaine à Cotonou.",
      "products_count": 14,
      "city": "Cotonou"
    }
  ]
}
```

### 3.3 Champs d’un élément de `results` (`ShopSummary`)

| Champ | Type | Requis côté Zod | Notes |
|-------|------|-----------------|--------|
| `id` | string | **oui** | Identifiant stable. |
| `slug` | string | **oui** | URL-safe, unique marketplace. |
| `name` | string | **oui** | |
| `logo_url` | string (URL) \| null | non | Peut être absent ; si présent doit être URL valide ou `null`. |
| `cover_url` | string (URL) \| null | non | Idem. |
| `short_description` | string \| null | non | |
| `products_count` | entier ≥ 0 | non (défaut `0`) | |
| `city` | string \| null | non | |

### 3.4 Erreurs

- `404` / liste vide : à trancher avec le contrat global ; en général liste vide avec `count: 0` et `results: []` est acceptable pour une recherche sans résultat.

---

## 4. `GET /api/marketplace/shops/{slug}`

`{slug}` = slug boutique (identique au segment d’URL sur le site).

### 4.1 Réponse `200 OK` — structure obligatoire

Doit matcher `ShopWithProductsSchema` :

```json
{
  "shop": {
    "id": "shop_01HZ7K3M9X8YQ1A2B3C4D5E6F7",
    "slug": "didier-shop",
    "name": "Didier Shop",
    "logo_url": "https://cdn.owo.bj/shops/didier/logo.png",
    "cover_url": "https://cdn.owo.bj/shops/didier/cover.jpg",
    "description": "Texte long…",
    "short_description": "Accroche courte.",
    "contact_phone": "+229…",
    "address": "Cotonou",
    "whatsapp_phone_e164": "22960000000",
    "whatsapp_url": null,
    "products_count": 14
  },
  "products": {
    "count": 14,
    "results": [
      {
        "id": "prod_01",
        "slug": "t-shirt-noir",
        "name": "T-shirt premium noir",
        "image_url": "https://cdn.owo.bj/products/tshirt.jpg",
        "price": 7500,
        "promo_price": null,
        "currency": "XOF",
        "in_stock": true,
        "stock_label": null
      }
    ]
  }
}
```

### 4.2 Objet `shop`

| Champ | Type | Requis Zod | Notes |
|-------|------|------------|--------|
| `id`, `slug`, `name` | string | **oui** | |
| `logo_url`, `cover_url` | URL \| null | non | |
| `description`, `short_description`, `contact_phone`, `address` | string \| null | non | |
| `whatsapp_phone_e164` | string \| null | non | **Chiffres uniquement**, longueur 6–15 (indicatif inclus, **sans** `+`), cohérent avec `wa.me`. |
| `whatsapp_url` | URL \| null | non | Lien WhatsApp pré-configuré ; si invalide, le frontend retombe sur le numéro. |
| `products_count` | entier ≥ 0 | non (défaut `0`) | |

### 4.3 Objet `products`

| Champ | Type | Requis | Notes |
|-------|------|--------|--------|
| `count` | entier ≥ 0 | **oui** | |
| `results` | array | **oui** | Chaque élément = `ProductSummary` (voir §5.3). |

### 4.4 Erreurs

- Boutique inconnue ou non publiée : **`404 Not Found`**.

---

## 5. `GET /api/marketplace/shops/{shopSlug}/products/{productSlug}`

### 5.1 Réponse `200 OK` — structure obligatoire

Doit matcher `ProductDetailSchema` :

```json
{
  "id": "prod_01HZ7K9KX6QYR8WA1B2C3D4E5F",
  "slug": "t-shirt-noir",
  "name": "T-shirt premium noir",
  "description": "Coton bio…",
  "images": [
    "https://cdn.owo.bj/products/tshirt-noir-1.jpg"
  ],
  "price": 7500,
  "promo_price": null,
  "currency": "XOF",
  "stock": 18,
  "variants": [
    { "id": "var_s", "label": "S", "price": 7500, "stock": 4 }
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

### 5.2 Racine produit

| Champ | Type | Requis | Notes |
|-------|------|--------|--------|
| `id`, `slug`, `name` | string | **oui** | |
| `description` | string | non (défaut `""`) | |
| `images` | array d’URLs | non (défaut `[]`) | |
| `price` | number ≥ 0 | **oui** | |
| `promo_price` | number ≥ 0 \| null | non | Si présent, ≤ `price`. |
| `currency` | string | non (défaut `XOF`) | |
| `stock` | entier ≥ 0 | non (défaut `0`) | |
| `variants` | array | non (défaut `[]`) | Voir ci-dessous. |

### 5.3 `ProductSummary` (carte catalogue) et champs catalogue

| Champ | Type | Requis | Notes |
|-------|------|--------|--------|
| `id`, `slug`, `name` | string | **oui** | |
| `image_url` | URL \| null | non | |
| `price` | number ≥ 0 | **oui** | |
| `promo_price` | number ≥ 0 \| null | non | |
| `currency` | string | non (défaut `XOF`) | |
| `in_stock` | boolean | non (défaut `true`) | `false` → CTA WhatsApp désactivé sur la carte. |
| `stock_label` | string \| null | non | Affichage badge ; certains mots-clés changent le template du message WhatsApp. |

### 5.4 Variante (`variants[]`)

| Champ | Type | Requis | Notes |
|-------|------|--------|--------|
| `id` | string | **oui** | |
| `label` | string | **oui** | |
| `price` | number ≥ 0 | **oui** | |
| `stock` | entier ≥ 0 | non (défaut `0`) | `0` → variante indisponible à la sélection. |

### 5.5 Erreurs

- **`404 Not Found`** si boutique ou produit inconnu, non publié, ou désactivé.

---

## 6. `POST /api/marketplace/contact-intents` *(priorité intégration récente)*

Appelé **depuis le navigateur** au moment où l’utilisateur clique sur **Commander sur WhatsApp**, **après** collecte éventuelle du prénom, nom et téléphone (stockés en local dans le navigateur). Si ce `POST` échoue, **WhatsApp n’est pas ouvert**.

### 6.1 En-têtes

- `Content-Type: application/json`
- `Accept: application/json` (envoyé par le client)

### 6.2 Corps JSON — champs et contraintes

Aligné sur `ContactIntentRequestSchema` :

| Champ | Type | Obligatoire | Contraintes |
|-------|------|-------------|-------------|
| `first_name` | string | **oui** | Longueur 1–80. |
| `last_name` | string | **oui** | Longueur 1–80. |
| `phone_e164` | string | **oui** | **Uniquement des chiffres**, longueur **6 à 15** (indicatif pays inclus, **sans** `+`). Ex. Bénin : `22960123456`. |
| `shop_slug` | string | **oui** | Non vide. |
| `product_slug` | string | **oui** | Non vide. |
| `prefilled_message` | string | **oui** | Texte UTF-8 du message ; identique à celui qui sera passé en query `text` sur l’URL WhatsApp. |
| `product_url` | string | **oui** | **URL absolue** valide (ex. `https://owo.bj/didier-shop/products/t-shirt-noir`). |

### 6.3 Exemple de corps

```json
{
  "first_name": "Kofi",
  "last_name": "Adebayo",
  "phone_e164": "22960123456",
  "shop_slug": "didier-shop",
  "product_slug": "t-shirt-noir",
  "prefilled_message": "Bonjour 👋\nJe vous contacte depuis owo.bj.\n\nJe souhaite commander ce produit :\n- Boutique : Didier Shop\n…",
  "product_url": "https://owo.bj/didier-shop/products/t-shirt-noir"
}
```

### 6.4 Réponses attendues (succès)

Le frontend considère le `POST` réussi si la réponse est **`2xx`** avec un corps JSON optionnel (ou vide). Exemples acceptables :

- `200 OK` + corps optionnel ;
- `201 Created` + éventuellement `{ "id": "trace_uuid_…" }` ;
- `204 No Content`.

Un corps `{ "id": "…" }` est utile pour le support mais **non requis** pour que le flux UI continue.

### 6.5 Erreurs

| Code | Comportement frontend |
|------|------------------------|
| `400` | Message d’erreur générique ; pas d’ouverture WhatsApp. |
| `429` | Idem ; l’utilisateur peut réessayer. |
| `5xx` / réseau | Idem ; pas d’ouverture WhatsApp. |

Idéalement, `400` renvoie un JSON d’erreur lisible (champ / code) pour faciliter le debug ; le MVP n’affiche pas les détails serveur à l’utilisateur.

### 6.6 CORS

Autoriser au minimum :

- **Méthode** : `POST`, `OPTIONS`
- **Origine** : celle du site marketplace (prod + préprod + `http://localhost:3000` en dev si applicable)
- **En-têtes** : `Content-Type`, `Accept`

### 6.7 Persistance métier (recommandations backend)

À définir côté produit / légal : stocker au minimum horodatage, `shop_slug`, `product_slug`, `phone_e164`, `first_name`, `last_name`, `product_url`, copie ou hash de `prefilled_message`, IP / user-agent si autorisé. Rate limiting par IP + par `phone_e164` recommandé.

---

## 7. Checklist rapide pour le backend

- [ ] Les trois `GET` exposent des JSON **strictement compatibles** avec les schémas Zod (`shop.schema.ts`, `product.schema.ts`).
- [ ] `whatsapp_phone_e164` et `phone_e164` du POST : **chiffres uniquement**, 6–15 caractères.
- [ ] `POST /api/marketplace/contact-intents` implémenté, **CORS** OK depuis l’origine du frontend.
- [ ] Réponses succès en **2xx** ; erreurs métier en **4xx** avec corps JSON si possible.
- [ ] Pas de redirection `POST` qui casse le corps (slash final, HTTPS, etc.).

---

## 8. Références dans le dépôt

| Sujet | Fichier |
|--------|---------|
| Contrat détaillé + SEO, cache, pagination | [`docs/BACKEND_API_CONTRACT.md`](./BACKEND_API_CONTRACT.md) |
| Client HTTP (base URL, `POST` JSON) | `src/lib/api/client.ts` |
| Appels boutiques | `src/lib/api/shops.ts` |
| Appel produit | `src/lib/api/products.ts` |
| Appel trace WhatsApp | `src/lib/api/contactIntent.ts` |
| Variables d’environnement | `src/lib/config/env.ts` |

En cas de divergence entre ce fichier et le code, **le code et les schémas Zod font foi** jusqu’à mise à jour explicite de la documentation.

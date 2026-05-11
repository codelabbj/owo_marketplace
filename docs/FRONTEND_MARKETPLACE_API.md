# Frontend Guide — Owo Marketplace

> Module marketplace multi-vendeurs. Deux types d'endpoints : **vendeur** (JWT requis) pour gérer sa boutique, et **publics** (sans auth) pour afficher la marketplace aux visiteurs.

---

## Vue d'ensemble

```
Base URL : /api/marketplace/

── Endpoints vendeur (JWT) ──────────────────────────────────────
POST/GET/PUT/PATCH  /my-shop/
GET/POST            /my-shop/products/
GET/PUT/PATCH/DELETE /my-shop/products/{productId}/
POST                /my-shop/products/{productId}/variants/
PUT/PATCH/DELETE    /my-shop/products/{productId}/variants/{variantId}/

── Endpoints publics (sans auth) ────────────────────────────────
GET  /shops/
GET  /shops/{slug}/
GET  /shops/{shopSlug}/products/{productSlug}/
```

---

## Authentification

Les endpoints vendeur nécessitent un token JWT dans le header :

```
Authorization: Bearer {token}
```

Les endpoints publics n'ont **aucune authentification requise**.

---

## 1. Gestion de la boutique (vendeur)

### Créer sa boutique

```
POST /api/marketplace/my-shop/
Authorization: Bearer {token}
```

**Corps :**
```json
{
  "name": "Ma Boutique",
  "description": "Description complète (max 2000 caractères)",
  "short_description": "Courte description",
  "logo_url": "https://cdn.example.com/logo.png",
  "cover_url": "https://cdn.example.com/cover.jpg",
  "city": "Cotonou",
  "address": "123 Rue Principale",
  "category": "vetements",
  "whatsapp_number": "22960000000"
}
```

| Champ | Requis | Contraintes |
|-------|--------|-------------|
| `name` | ✅ | 1–255 caractères |
| `description` | ❌ | max 2000 caractères |
| `short_description` | ❌ | max 255 caractères |
| `logo_url` | ❌ | URL HTTPS absolue |
| `cover_url` | ❌ | URL HTTPS absolue |
| `city` | ❌ | max 100 caractères |
| `address` | ❌ | max 500 caractères |
| `category` | ❌ | string libre (slug recommandé) |
| `whatsapp_number` | ❌ | Chiffres uniquement, 6–15 digits, sans `+` (ex: `22960000000`) |

**Réponse `201` :**
```json
{
  "id": "uuid",
  "org": "uuid-organisation",
  "name": "Ma Boutique",
  "slug": "ma-boutique",
  "description": "Description complète",
  "short_description": "Courte description",
  "logo_url": "https://cdn.example.com/logo.png",
  "cover_url": "https://cdn.example.com/cover.jpg",
  "city": "Cotonou",
  "address": "123 Rue Principale",
  "category": "vetements",
  "whatsapp_number": "22960000000",
  "whatsapp_url": "https://wa.me/22960000000",
  "is_active": true,
  "products_count": 0,
  "created_at": "2026-05-11T10:00:00Z",
  "updated_at": "2026-05-11T10:00:00Z"
}
```

> Le `slug` est généré automatiquement à partir du `name`. Il ne change jamais après la création, même si le nom est modifié.

**Erreur si boutique déjà existante (`400`) :**
```json
{
  "error_code": "SHOP_ALREADY_EXISTS",
  "detail": "Votre organisation possède déjà une boutique."
}
```

---

### Lire / Mettre à jour sa boutique

```
GET    /api/marketplace/my-shop/          → 200 avec la boutique, ou 404
PUT    /api/marketplace/my-shop/          → Remplacement complet (200)
PATCH  /api/marketplace/my-shop/          → Mise à jour partielle (200)
```

Le corps de PUT/PATCH accepte les mêmes champs que la création (sauf `name` qui reste modifiable mais le `slug` ne change pas).

---

## 2. Gestion des produits (vendeur)

### Lister les produits

```
GET /api/marketplace/my-shop/products/
Authorization: Bearer {token}
```

Retourne **tous** les produits (publiés et brouillons), paginés.

**Paramètres :**
| Paramètre | Défaut | Description |
|-----------|--------|-------------|
| `page` | 1 | Numéro de page |
| `page_size` | 20 | Résultats par page (max 100) |

**Réponse `200` :**
```json
{
  "count": 42,
  "next": "https://api.example.com/api/marketplace/my-shop/products/?page=2",
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "shop": "uuid-boutique",
      "name": "T-Shirt Coton",
      "slug": "t-shirt-coton",
      "description": "...",
      "price": "5000.00",
      "promo_price": "4500.00",
      "currency": "XOF",
      "stock": 100,
      "in_stock": true,
      "image_url": "https://cdn.example.com/tshirt.jpg",
      "stock_label": "En stock",
      "images": ["https://cdn.example.com/tshirt.jpg"],
      "category": "vetements",
      "is_published": true,
      "variants": [],
      "created_at": "2026-05-11T10:00:00Z",
      "updated_at": "2026-05-11T10:00:00Z"
    }
  ]
}
```

---

### Créer un produit

```
POST /api/marketplace/my-shop/products/
Authorization: Bearer {token}
```

**Corps :**
```json
{
  "name": "T-Shirt Coton",
  "description": "T-shirt en coton bio (max 5000 caractères)",
  "price": "5000.00",
  "promo_price": "4500.00",
  "stock": 100,
  "images": [
    "https://cdn.example.com/tshirt-1.jpg",
    "https://cdn.example.com/tshirt-2.jpg"
  ],
  "category": "vetements",
  "is_published": true
}
```

| Champ | Requis | Contraintes |
|-------|--------|-------------|
| `name` | ✅ | 1–255 caractères |
| `description` | ❌ | max 5000 caractères |
| `price` | ❌ | Décimal ≥ 0.01 |
| `promo_price` | ❌ | Décimal ≥ 0.01, **strictement < `price`** |
| `stock` | ❌ | Entier ≥ 0, défaut `0` |
| `images` | ❌ | Liste d'URLs HTTPS, max 20 éléments |
| `category` | ❌ | string libre |
| `is_published` | ❌ | boolean, défaut `false` |
| `currency` | ❌ | Code ISO 4217, défaut `XOF` |

**Réponse `201` :** objet produit complet (voir structure ci-dessus).

> Le `slug` est auto-généré à partir du `name`. Les collisions sont gérées automatiquement (`t-shirt-coton`, `t-shirt-coton-2`, etc.).

---

### Lire / Modifier / Supprimer un produit

```
GET    /api/marketplace/my-shop/products/{productId}/   → 200
PUT    /api/marketplace/my-shop/products/{productId}/   → 200
PATCH  /api/marketplace/my-shop/products/{productId}/   → 200
DELETE /api/marketplace/my-shop/products/{productId}/   → 204
```

- `{productId}` est un UUID.
- DELETE supprime le produit **et toutes ses variantes** en cascade.
- 404 si le produit n'appartient pas à la boutique du vendeur.

---

## 3. Gestion des variantes (vendeur)

### Créer une variante

```
POST /api/marketplace/my-shop/products/{productId}/variants/
Authorization: Bearer {token}
```

**Corps :**
```json
{
  "label": "XL",
  "attributes": {"taille": "XL", "couleur": "bleu"},
  "price": "5500.00",
  "stock": 20
}
```

| Champ | Requis | Contraintes |
|-------|--------|-------------|
| `label` | ✅ | 1–100 caractères (ex: `"XL"`, `"Rouge"`) |
| `attributes` | ❌ | Objet JSON clé-valeur libre |
| `price` | ❌ | Décimal ≥ 0.01 (prix spécifique à la variante) |
| `stock` | ❌ | Entier ≥ 0, défaut `0` |

**Réponse `201` :**
```json
{
  "id": "uuid",
  "label": "XL",
  "attributes": {"taille": "XL", "couleur": "bleu"},
  "price": "5500.00",
  "stock": 20
}
```

> Créer une variante avec `stock > 0` met automatiquement `in_stock = true` sur le produit parent.

---

### Modifier / Supprimer une variante

```
PUT    /api/marketplace/my-shop/products/{productId}/variants/{variantId}/   → 200
PATCH  /api/marketplace/my-shop/products/{productId}/variants/{variantId}/   → 200
DELETE /api/marketplace/my-shop/products/{productId}/variants/{variantId}/   → 204
```

- DELETE recalcule automatiquement `in_stock` du produit parent.
- 403 si le produit appartient à une autre organisation.
- 404 si la variante n'appartient pas au produit.

---

## 4. Endpoints publics — Liste des boutiques

```
GET /api/marketplace/shops/
```

Pas d'authentification requise. Retourne uniquement les boutiques actives (`is_active = true`), triées alphabétiquement par nom.

**Paramètres :**
| Paramètre | Défaut | Contraintes |
|-----------|--------|-------------|
| `page` | 1 | — |
| `page_size` | 12 | 1–100 |

**Réponse `200` :**
```json
{
  "count": 45,
  "next": "https://api.example.com/api/marketplace/shops/?page=2",
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "slug": "ma-boutique",
      "name": "Ma Boutique",
      "short_description": "Courte description",
      "logo_url": "https://cdn.example.com/logo.png",
      "cover_url": "https://cdn.example.com/cover.jpg",
      "city": "Cotonou",
      "category": "vetements",
      "products_count": 25
    }
  ]
}
```

**Headers de réponse :**
```
Cache-Control: public, max-age=0, s-maxage=60, stale-while-revalidate=300
```

**Erreurs :**
| Code | Cause |
|------|-------|
| `400` | `page_size` invalide (non entier, < 1 ou > 100) |
| `404` | Numéro de page hors limites |

---

## 5. Endpoints publics — Détail d'une boutique

```
GET /api/marketplace/shops/{slug}/
```

Retourne la boutique avec son catalogue de produits **publiés uniquement**.

**Paramètres :**
| Paramètre | Défaut | Description |
|-----------|--------|-------------|
| `page` | 1 | Page des produits |
| `page_size` | 20 | Produits par page (max 100) |

**Réponse `200` :**
```json
{
  "id": "uuid",
  "slug": "ma-boutique",
  "name": "Ma Boutique",
  "description": "Description complète...",
  "short_description": "Courte description",
  "logo_url": "https://cdn.example.com/logo.png",
  "cover_url": "https://cdn.example.com/cover.jpg",
  "city": "Cotonou",
  "address": "123 Rue Principale",
  "whatsapp_phone_e164": "22960000000",
  "whatsapp_url": "https://wa.me/22960000000",
  "products_count": 25,
  "products": {
    "count": 25,
    "next": "https://api.example.com/api/marketplace/shops/ma-boutique/?page=2",
    "previous": null,
    "results": [
      {
        "id": "uuid",
        "slug": "t-shirt-coton",
        "name": "T-Shirt Coton",
        "image_url": "https://cdn.example.com/tshirt.jpg",
        "price": "5000.00",
        "promo_price": "4500.00",
        "currency": "XOF",
        "in_stock": true,
        "stock_label": "En stock"
      }
    ]
  }
}
```

> `whatsapp_phone_e164` et `whatsapp_url` sont `null` si le vendeur n'a pas renseigné son numéro.

**Erreurs :**
| Code | Cause |
|------|-------|
| `404` | Boutique inexistante ou inactive |

---

## 6. Endpoints publics — Fiche produit complète

```
GET /api/marketplace/shops/{shopSlug}/products/{productSlug}/
```

**Réponse `200` :**
```json
{
  "id": "uuid",
  "slug": "t-shirt-coton",
  "name": "T-Shirt Coton",
  "description": "T-shirt en coton bio de haute qualité",
  "images": [
    "https://cdn.example.com/tshirt-1.jpg",
    "https://cdn.example.com/tshirt-2.jpg"
  ],
  "price": "5000.00",
  "promo_price": "4500.00",
  "currency": "XOF",
  "in_stock": true,
  "stock": 100,
  "variants": [
    {
      "id": "uuid",
      "label": "S",
      "price": null,
      "stock": 30
    },
    {
      "id": "uuid",
      "label": "XL",
      "price": "5500.00",
      "stock": 20
    }
  ],
  "shop": {
    "id": "uuid",
    "slug": "ma-boutique",
    "name": "Ma Boutique",
    "whatsapp_phone_e164": "22960000000",
    "whatsapp_url": "https://wa.me/22960000000"
  }
}
```

**Erreurs :**
| Code | Cause |
|------|-------|
| `404` | Boutique inexistante ou inactive |
| `404` | Produit inexistant ou non publié (`is_published = false`) |

---

## Champs calculés automatiquement

| Champ | Calcul |
|-------|--------|
| `slug` | Généré depuis `name` à la création, jamais modifié ensuite |
| `in_stock` | `true` si `product.stock > 0` OU si au moins une variante a `stock > 0` |
| `image_url` | Première URL de la liste `images`, ou `null` |
| `stock_label` | `"Rupture de stock"` / `"En stock"` / `"Plus que N en stock"` |
| `whatsapp_url` | `"https://wa.me/{whatsapp_number}"` ou `null` |
| `products_count` | Nombre de produits avec `is_published = true` |

---

## Format des erreurs

**Erreur de validation `400` :**
```json
{
  "errors": {
    "whatsapp_number": ["Le numéro doit contenir entre 6 et 15 chiffres (format E164 sans +)."],
    "promo_price": ["Le prix promotionnel doit être strictement inférieur au prix de référence."]
  }
}
```

**Erreur d'authentification `401` :**
```json
{
  "detail": "Les informations d'authentification n'ont pas été fournies."
}
```

**Erreur de permission `403` :**
```json
{
  "detail": "Vous n'avez pas la permission d'effectuer cette action."
}
```

**Ressource introuvable `404` :**
```json
{
  "detail": "Boutique introuvable."
}
```

**Throttling `429` :**
```json
{
  "detail": "Nombre de requêtes autorisé dépassé. Veuillez réessayer plus tard.",
  "retry_after": 60
}
```

> Les endpoints publics sont limités à **40 requêtes/minute** par IP.

---

## 7. Catégories — liste canonique

```
GET /api/marketplace/categories/
```

Pas d'authentification. Retourne la liste complète des catégories valides. À appeler une fois au chargement de l'app et mettre en cache côté front (la liste ne change pas à chaud).

**Réponse `200` :**
```json
[
  { "slug": "vetements-femme",     "label": "Vêtements femme" },
  { "slug": "vetements-homme",     "label": "Vêtements homme" },
  { "slug": "chaussures-femme",    "label": "Chaussures femme" },
  { "slug": "sacs-maroquinerie",   "label": "Sacs & Maroquinerie" },
  { "slug": "bijoux-montres",      "label": "Bijoux & Montres" },
  { "slug": "maquillage",          "label": "Maquillage" },
  { "slug": "soins-visage",        "label": "Soins visage" },
  { "slug": "alimentation-bebe",   "label": "Alimentation bébé" },
  { "slug": "electronique",        "label": "Électronique" },
  "..."
]
```

**Header de réponse :**
```
Cache-Control: public, max-age=86400, s-maxage=86400
```

Le champ `category` des boutiques et des produits **doit obligatoirement** être un `slug` présent dans cette liste, ou une chaîne vide `""`. Toute autre valeur retourne `400`.

**Erreur si catégorie invalide :**
```json
{
  "errors": {
    "category": ["Catégorie invalide : 'mode'. Utilisez GET /api/marketplace/categories/ pour obtenir la liste des catégories valides."]
  }
}
```

**Groupes de catégories disponibles :**

| Groupe | Exemples de slugs |
|--------|-------------------|
| Mode & Accessoires | `vetements-femme`, `vetements-homme`, `chaussures-femme`, `sacs-maroquinerie`, `bijoux-montres`, `tissus-pagnes`, `perruques-extensions` |
| Beauté & Bien-être | `soins-visage`, `soins-corps`, `soins-cheveux`, `maquillage`, `parfums-deodorants`, `ongles-nail-art` |
| Alimentation & Boissons | `epicerie-seche`, `produits-frais`, `viandes-poissons`, `fruits-legumes`, `boissons-non-alcoolisees`, `produits-locaux`, `plats-prepares` |
| Maison & Décoration | `meubles`, `decoration-interieure`, `electromenager`, `cuisine-arts-de-table`, `jardinage-plantes` |
| Électronique & Informatique | `smartphones-tablettes`, `ordinateurs-peripheriques`, `tv-audio-video`, `consoles-jeux-video` |
| Santé & Pharmacie | `medicaments-parapharmacie`, `materiel-medical`, `complements-alimentaires`, `optique` |
| Sport & Loisirs | `equipement-sportif`, `fitness-musculation`, `jeux-jouets`, `livres-bd-mangas`, `musique-instruments` |
| Automobile & Moto | `pieces-auto`, `accessoires-auto`, `pieces-moto`, `pneus-jantes` |
| Bébé & Enfant | `puericulture`, `jouets-enfant`, `alimentation-bebe`, `vetements-bebe` |
| Agriculture & Élevage | `semences-plants`, `materiel-agricole`, `elevage-animaux` |
| Construction & BTP | `materiaux-construction`, `quincaillerie`, `sanitaire-plomberie` |
| Énergie | `panneaux-solaires`, `groupes-electrogenes`, `batteries-stockage` |
| Services | `services-informatiques`, `services-formation`, `services-evenementiel`, `services-transport` |
| Art & Artisanat | `art-peinture-sculpture`, `artisanat-local`, `mode-createurs` |
| Divers | `cadeaux-occasions`, `produits-occasion`, `autres` |

> La liste complète (120+ catégories) est disponible via l'endpoint. Utiliser toujours l'API comme source de vérité, pas ce tableau.

---



| Méthode | URL | Auth | Description |
|---------|-----|------|-------------|
| `GET` | `/api/marketplace/categories/` | ❌ Public | Liste des catégories valides |
| `POST` | `/api/marketplace/my-shop/` | ✅ JWT | Créer sa boutique |
| `GET` | `/api/marketplace/my-shop/` | ✅ JWT | Lire sa boutique |
| `PUT` | `/api/marketplace/my-shop/` | ✅ JWT | Remplacer sa boutique |
| `PATCH` | `/api/marketplace/my-shop/` | ✅ JWT | Mettre à jour partiellement |
| `GET` | `/api/marketplace/my-shop/products/` | ✅ JWT | Lister ses produits (tous statuts) |
| `POST` | `/api/marketplace/my-shop/products/` | ✅ JWT | Créer un produit |
| `GET` | `/api/marketplace/my-shop/products/{id}/` | ✅ JWT | Détail d'un produit |
| `PUT` | `/api/marketplace/my-shop/products/{id}/` | ✅ JWT | Remplacer un produit |
| `PATCH` | `/api/marketplace/my-shop/products/{id}/` | ✅ JWT | Mettre à jour un produit |
| `DELETE` | `/api/marketplace/my-shop/products/{id}/` | ✅ JWT | Supprimer un produit + variantes |
| `POST` | `/api/marketplace/my-shop/products/{id}/variants/` | ✅ JWT | Créer une variante |
| `PUT` | `/api/marketplace/my-shop/products/{id}/variants/{vid}/` | ✅ JWT | Remplacer une variante |
| `PATCH` | `/api/marketplace/my-shop/products/{id}/variants/{vid}/` | ✅ JWT | Mettre à jour une variante |
| `DELETE` | `/api/marketplace/my-shop/products/{id}/variants/{vid}/` | ✅ JWT | Supprimer une variante |
| `GET` | `/api/marketplace/shops/` | ❌ Public | Liste des boutiques actives |
| `GET` | `/api/marketplace/shops/{slug}/` | ❌ Public | Détail boutique + catalogue |
| `GET` | `/api/marketplace/shops/{shopSlug}/products/{productSlug}/` | ❌ Public | Fiche produit complète |

---

## Exemples d'intégration Next.js

### Page marketplace publique

```ts
// Charger les catégories une fois (à mettre en cache)
const categories = await fetch('/api/marketplace/categories/').then(r => r.json())
// [{ slug: 'vetements-femme', label: 'Vêtements femme' }, ...]

// Lister les boutiques actives
const res = await fetch('/api/marketplace/shops/?page=1&page_size=12')
const { count, results } = await res.json()
// results[i].slug → lien vers la boutique
// results[i].products_count → badge "N produits"
```

### Page boutique publique

```ts
// Détail boutique + produits publiés
const res = await fetch(`/api/marketplace/shops/${shopSlug}/`)
const shop = await res.json()
// shop.whatsapp_url → bouton "Contacter sur WhatsApp"
// shop.products.results → grille de produits
```

### Page produit publique

```ts
// Fiche produit complète
const res = await fetch(`/api/marketplace/shops/${shopSlug}/products/${productSlug}/`)
const product = await res.json()
// product.variants → sélecteur de taille/couleur
// product.shop.whatsapp_url → bouton "Commander via WhatsApp"
// product.promo_price → afficher le prix barré si non null
```

### Dashboard vendeur — créer sa boutique

```ts
const res = await fetch('/api/marketplace/my-shop/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    name: 'Ma Boutique',
    whatsapp_number: '22960000000',
    city: 'Cotonou',
  }),
})

if (res.status === 400) {
  const { error_code, errors } = await res.json()
  if (error_code === 'SHOP_ALREADY_EXISTS') {
    // Rediriger vers la page de gestion de la boutique existante
  }
}
```

### Dashboard vendeur — publier un produit

```ts
// Créer le produit en brouillon
const product = await fetch('/api/marketplace/my-shop/products/', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'T-Shirt', price: '5000.00', is_published: false }),
}).then(r => r.json())

// Ajouter des variantes
await fetch(`/api/marketplace/my-shop/products/${product.id}/variants/`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ label: 'S', stock: 10 }),
})

// Publier
await fetch(`/api/marketplace/my-shop/products/${product.id}/`, {
  method: 'PATCH',
  headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ is_published: true }),
})
```

---

## Notes importantes

- **`category` doit être un slug de la liste canonique** — récupérer via `GET /api/marketplace/categories/`. Toute valeur hors liste retourne `400`. La chaîne vide `""` est acceptée (pas de catégorie).
- **Un seul shop par organisation** — une deuxième tentative de création retourne `SHOP_ALREADY_EXISTS`.
- **Le slug ne change jamais** — même si le `name` est modifié via PUT/PATCH.
- **`in_stock` est recalculé automatiquement** à chaque modification de stock ou de variante.
- **`promo_price` doit être strictement inférieur à `price`** — sinon `400`.
- **`whatsapp_number` sans le `+`** — format E164 pur, ex: `22960000000` et non `+22960000000`.
- **Images HTTPS uniquement** — les URLs HTTP sont rejetées avec `400`.
- **Produits non publiés invisibles publiquement** — `is_published: false` → 404 sur les endpoints publics.
- **Cache CDN** — les endpoints publics retournent `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`. Prévoir une invalidation si nécessaire après une mise à jour vendeur.

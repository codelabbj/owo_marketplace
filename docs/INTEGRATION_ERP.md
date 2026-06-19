# Connexion marketplace ↔ ERP (`erp_crm_backend`)

Le frontend consomme l’API publique **`/api/marketplace/*`** du module Django `apps.marketplace`.

## Démarrage local

### Backend ERP

```bash
cd erp_crm_backend
python manage.py migrate
python manage.py runserver
# → http://127.0.0.1:8000
```

Données de démo (boutiques + produits marketplace) : suivre la doc du repo ERP (`seed_*` / fixtures marketplace).

### Frontend

```bash
cd owo_marketplace
copy .env.example .env.local
npm run dev
# → http://localhost:3000
```

`.env.local` — **production** :

```env
NEXT_PUBLIC_MARKETPLACE_API_BASE_URL=https://api.erp.codelab.bj
NEXT_PUBLIC_SITE_URL=https://owo.bj
NEXT_PUBLIC_USE_MOCKS=false
```

En local, remplace la base URL par `http://127.0.0.1:8000` et `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.

## Endpoints utilisés par le site public

| Usage | Méthode | Chemin ERP |
|--------|---------|------------|
| Liste boutiques | `GET` | `/api/marketplace/shops/` |
| Détail boutique + catalogue | `GET` | `/api/marketplace/shops/{slug}/` |
| Fiche produit | `GET` | `/api/marketplace/shops/{shopSlug}/products/{productSlug}/` |
| Trace WhatsApp | `POST` | `/api/marketplace/contact-intents` (sans slash final) |

Référence complète vendeur + catégories : `erp_crm_backend/docs/` (ex. `FRONTEND_MARKETPLACE_API.md`).

## Adaptation côté Next.js

- Les **GET** utilisent le **slash final** (convention Django).
- Le détail boutique ERP renvoie un objet **plat** (`id`, `name`, … + `products`). Le frontend le normalise via `PublicShopDetailApiSchema` dans `src/schemas/product.schema.ts`.
- Prix / stock : `z.coerce.number()` pour accepter les décimaux sérialisés en string par DRF.
- CORS : `localhost:3000` est autorisé dans `config/settings/base.py` de l’ERP.

## Vérification rapide

```bash
# Dans erp_crm_backend
python manage.py shell -c "from django.test import Client; c=Client(); r=c.get('/api/marketplace/shops/'); print(r.status_code, r.json().get('count'))"
```

Réponse attendue : `200` et un `count` ≥ 0 si des boutiques actives existent.

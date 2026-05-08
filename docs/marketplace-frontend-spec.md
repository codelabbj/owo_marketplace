# Spécification Frontend Autonome - Marketplace Owo

## Objectif

Concevoir les interfaces frontend d'une marketplace **séparée de l'ERP** (ex: `owo.bj`) qui :

- regroupe les boutiques de tous les utilisateurs ERP
- expose une page boutique publique par vendeur (ex: `owo.bj/didier-shop`)
- permet aux clients finaux de parcourir les produits et contacter directement le fournisseur via WhatsApp
- conserve l'identité visuelle Owo (couleurs, accents, ton UI) cohérente avec l'ERP

## Contexte pour une IA externe (important)

Ce document est rédigé pour une IA ou une équipe qui **n'a aucun accès** :

- au code source ERP
- aux routes internes ERP
- aux composants UI ERP existants
- à la base de données ERP

Considérer la marketplace comme un **projet frontend standalone**.

Le seul lien avec l'ERP est conceptuel :

- les vendeurs viennent de l'ERP
- les produits publiés viennent d'un système source (ERP/back-office)

Pour implémenter le frontend, se baser uniquement sur ce document, les routes publiques marketplace et les contrats API ci-dessous.

---

## Vision produit (MVP)

### Acteurs

1. **Vendeur (utilisateur du système source/back-office)**
   - crée sa boutique depuis le système source
   - publie ses produits vers la marketplace
   - reçoit les commandes des clients

2. **Acheteur (visiteur marketplace)**
   - découvre les boutiques et produits
   - consulte une page boutique dédiée
   - clique sur un produit puis contacte le vendeur sur WhatsApp

### Promesse UX

- Une marketplace centrale (`owo.bj`)
- Une vitrine dédiée par boutique (`/slug-boutique`)
- Un parcours de contact simple, mobile-first, orienté WhatsApp

---

## Périmètre frontend

Ce document couvre uniquement la **couche interface** de la marketplace publique :

- structure des pages
- composants UI
- navigation
- états de chargement/erreur/vide
- comportements attendus
- contrats API attendus (côté consommation frontend)

Hors périmètre de ce document :

- détails d'implémentation backend
- logiques internes du système source (ERP/back-office)
- paiements finaux (intégration PSP détaillée)

---

## Architecture des routes (projet marketplace)

## Routes publiques

- `/` : page d'accueil marketplace
- `/shops` : listing des boutiques
- `/shops?category=...` : listing filtré
- `/:shopSlug` : page boutique publique
- `/:shopSlug/products/:productSlug` : fiche produit

## Routes légales/information

- `/about`
- `/help`
- `/terms`
- `/privacy`

## Option SEO (recommandée)

- conserver `/:shopSlug` comme route vitrine courte
- accepter redirection technique vers `/shops/:shopSlug` si nécessaire

---

## Expérience utilisateur par écran

## 1) Accueil marketplace (`/`)

### Sections

- Hero (message de valeur + CTA)
- Barre de recherche globale (produits / boutiques)
- Boutiques en vedette
- Produits tendances
- Catégories principales
- Footer

### Comportements

- recherche avec debounce (300-400ms)
- cartes cliquables vers boutique ou produit
- fallback si aucune donnée: message + CTA "Voir toutes les boutiques"

---

## 2) Listing boutiques (`/shops`)

### UI attendue

- grille de cards boutique
- filtres (catégorie, ville/région, note si disponible)
- tri (popularité, nouveautés, alphabetique)
- pagination ou infinite scroll

### Card boutique (minimum)

- logo
- nom boutique
- slug/URL lisible
- courte description
- nombre de produits (si disponible)
- bouton `Voir la boutique`

---

## 3) Page boutique (`/:shopSlug`)

### Header boutique

- bannière ou couleur de couverture
- logo
- nom boutique
- description courte
- infos utiles (localisation, contact, horaires si disponible)

### Catalogue boutique

- onglets ou filtres (catégories, prix, disponibilité)
- tri (prix asc/desc, nouveautés)
- grille produits
- pagination/infinite scroll

### Carte produit (minimum)

- image principale
- nom produit
- prix actuel
- badge promo/stock faible (optionnel)
- bouton `Commander sur WhatsApp`
- clic carte -> fiche produit

---

## 4) Fiche produit (`/:shopSlug/products/:productSlug`)

### Contenu

- galerie images
- titre
- prix
- description
- variantes (taille/couleur...)
- stock/disponibilité
- quantité
- CTA `Commander sur WhatsApp`

### Recommandations UX

- afficher clairement la boutique vendeuse
- lien retour vers la boutique
- section "Autres produits de cette boutique"

---

## 5) Flux "Commander sur WhatsApp"

### Principe produit

- Aucun compte client n'est requis sur la marketplace
- Aucun panier/checkout interne dans le MVP
- L'intention d'achat est transférée au vendeur via WhatsApp

### Déclencheurs CTA

- depuis une carte produit: bouton `Commander sur WhatsApp`
- depuis la fiche produit: bouton principal `Commander sur WhatsApp`

### Comportement attendu au clic

1. Construire un message pré-rempli avec les informations produit
2. Ouvrir WhatsApp (app mobile si disponible, sinon web)
3. Démarrer la conversation avec le numéro WhatsApp du vendeur

### Format de message pré-rempli (MVP)

```text
Bonjour, je vous contacte depuis owo.bj.
Je suis intéressé(e) par ce produit :
- Boutique : {shopName}
- Produit : {productName}
- Variante : {variantLabel|N/A}
- Quantité : {qty}
- Prix affiché : {formattedPrice}
- Lien produit : {productUrl}
```

### Templates WhatsApp prêts à implémenter

Objectif: fournir des messages cohérents et utiles, sans demander de création de compte.

#### Variables disponibles

- `{shopName}`
- `{productName}`
- `{variantLabel}` (optionnel)
- `{qty}` (par défaut `1`)
- `{formattedPrice}` (ex: `7 500 FCFA`)
- `{productUrl}`
- `{promoPrice}` (optionnel)
- `{stockLabel}` (optionnel: ex `Stock limité`)

#### 1) Produit simple (sans variante, sans promo)

```text
Bonjour 👋
Je vous contacte depuis owo.bj.

Je souhaite commander ce produit :
- Boutique : {shopName}
- Produit : {productName}
- Quantité : {qty}
- Prix affiché : {formattedPrice}
- Lien : {productUrl}

Merci de me confirmer la disponibilité.
```

#### 2) Produit avec variante

```text
Bonjour 👋
Je vous contacte depuis owo.bj.

Je souhaite commander ce produit :
- Boutique : {shopName}
- Produit : {productName}
- Variante : {variantLabel}
- Quantité : {qty}
- Prix affiché : {formattedPrice}
- Lien : {productUrl}

Merci de me confirmer la disponibilité de cette variante.
```

#### 3) Produit en promotion

```text
Bonjour 👋
Je vous contacte depuis owo.bj.

Je suis intéressé(e) par votre offre :
- Boutique : {shopName}
- Produit : {productName}
- Prix promo affiché : {promoPrice}
- Quantité : {qty}
- Lien : {productUrl}

Pouvez-vous confirmer le prix final et la disponibilité ?
```

#### 4) Produit avec stock limité

```text
Bonjour 👋
Je vous contacte depuis owo.bj.

Je veux commander :
- Boutique : {shopName}
- Produit : {productName}
- Quantité : {qty}
- Prix affiché : {formattedPrice}
- Info stock : {stockLabel}
- Lien : {productUrl}

Merci de me confirmer rapidement la disponibilité.
```

#### 5) Template compact (pour clic rapide depuis card)

```text
Bonjour, je vous contacte depuis owo.bj.
Produit: {productName}
Variante: {variantLabel|N/A}
Quantité: {qty}
Prix: {formattedPrice}
Lien: {productUrl}
```

#### Règles de sélection du template

1. Si `promoPrice` existe -> utiliser template "Produit en promotion"
2. Sinon si `variantLabel` existe -> utiliser template "Produit avec variante"
3. Sinon si `stockLabel` signale un stock limité -> utiliser template "Produit avec stock limité"
4. Sinon -> template "Produit simple"
5. Depuis une card produit, l'équipe peut utiliser le template compact pour réduire le temps de clic

#### Encodage du message

- toujours encoder le message avec `encodeURIComponent` avant de construire l'URL WhatsApp
- normaliser les sauts de ligne avec `\n`
- éviter les caractères spéciaux non encodés dans l'URL finale

### Règles UX importantes

- si le numéro WhatsApp vendeur est absent: désactiver le CTA + afficher "Contact indisponible"
- si WhatsApp ne peut pas s'ouvrir: afficher un fallback avec numéro copiable
- afficher un retour visuel court sur clic (loading 300-600ms max)

---

## Design system (aligné ERP)

## Principes

- reprendre les couleurs d'accentuation de la marque Owo
- conserver le même ton visuel: moderne, propre, contrasté
- prioriser lisibilité, espaces, et composants arrondis cohérents

## Tokens recommandés (à aligner avec ERP)

- `--brand-500` : couleur accent principale
- `--brand-600` : hover/action active
- `--bg-surface`, `--bg-subtle`
- `--text-primary`, `--text-muted`
- `--border-default`, `--border-subtle`
- `--radius-md`, `--radius-lg`, `--radius-full`

## Composants de base à livrer

- boutons (`primary`, `secondary`, `outline`, `ghost`)
- champs (`input`, `select`, `textarea`)
- badges (`promo`, `rupture`, `nouveau`)
- cards (`shop-card`, `product-card`)
- skeleton loaders
- toasts

---

## États frontend obligatoires

Pour chaque vue de données:

1. **Loading**
   - skeletons adaptés au layout

2. **Empty**
   - message clair + CTA utile

3. **Error**
   - message lisible
   - bouton `Réessayer`

4. **Success**
   - rendu principal

---

## SEO et partage

## SEO minimum

- balises `title` et `meta description` dynamiques par page
- slug lisible pour boutique et produit
- OpenGraph/Twitter tags
- sitemap + robots

## Données structurées (recommandé)

- `Organization` pour boutique
- `Product` pour fiche produit

---

## Contrats API attendus (consommation frontend)

> Les endpoints exacts peuvent évoluer. Le frontend doit se baser sur ces formes de payload.

## 1) Listing boutiques

`GET /api/marketplace/shops?query=&category=&page=`

```json
{
  "count": 128,
  "next": "https://owo.bj/api/marketplace/shops?page=2",
  "previous": null,
  "results": [
    {
      "id": "shop_123",
      "slug": "didier-shop",
      "name": "Didier Shop",
      "logo_url": "https://...",
      "cover_url": "https://...",
      "short_description": "Mode, accessoires et plus",
      "products_count": 245
    }
  ]
}
```

## 2) Détail boutique + produits

`GET /api/marketplace/shops/{slug}`

```json
{
  "shop": {
    "id": "shop_123",
    "slug": "didier-shop",
    "name": "Didier Shop",
    "logo_url": "https://...",
    "cover_url": "https://...",
    "description": "Description longue",
    "contact_phone": "+229...",
    "address": "Cotonou"
  },
  "products": {
    "count": 245,
    "results": [
      {
        "id": "prod_1",
        "slug": "t-shirt-noir",
        "name": "T-shirt noir",
        "image_url": "https://...",
        "price": 7500,
        "currency": "XOF",
        "in_stock": true
      }
    ]
  }
}
```

## 3) Détail produit

`GET /api/marketplace/shops/{shopSlug}/products/{productSlug}`

```json
{
  "id": "prod_1",
  "slug": "t-shirt-noir",
  "name": "T-shirt noir",
  "description": "Coton premium",
  "images": ["https://..."],
  "price": 7500,
  "currency": "XOF",
  "stock": 18,
  "variants": [
    { "id": "var_1", "label": "M", "price": 7500, "stock": 5 }
  ],
  "shop": {
    "id": "shop_123",
    "slug": "didier-shop",
    "name": "Didier Shop"
  }
}
```

## 4) Contact WhatsApp vendeur

Le frontend doit disposer des données nécessaires pour construire un lien WhatsApp.

Option A (recommandée): fournir le numéro normalisé dans la ressource boutique/produit.

Exemple champ attendu:

```json
{
  "shop": {
    "id": "shop_123",
    "name": "Didier Shop",
    "whatsapp_phone_e164": "229XXXXXXXX"
  }
}
```

Construction du lien côté frontend:

`https://wa.me/{whatsapp_phone_e164}?text={urlEncodedPrefilledMessage}`

Option B (alternative): le backend fournit directement une URL prête à ouvrir:

```json
{
  "shop": {
    "whatsapp_url": "https://wa.me/229XXXXXXXX?text=..."
  }
}
```

---

## Règles d'alimentation catalogue (système source)

Même si le backend gère la logique, le frontend marketplace doit supposer :

- seuls les produits marqués "publiés marketplace" apparaissent
- un produit indisponible ne doit pas être commandable
- une boutique désactivée ne doit plus être indexée publiquement

Ne pas dépendre d'une logique ERP côté client. Toute règle métier doit être confirmée via les réponses API marketplace.

---

## Internationalisation

Langues MVP recommandées :

- Français (par défaut)
- Anglais (optionnel selon priorité business)

Prévoir :

- i18n dès la structure des composants
- format prix/locales corrects (`XOF`, `fr-FR`)

---

## Performance et accessibilité

## Performance

- lazy-load images et pages lourdes
- cache des requêtes (React Query recommandé)
- prefetch des pages produits depuis listing
- éviter toute étape inutile entre "voir produit" et "ouvrir WhatsApp"

## Accessibilité

- contraste AA
- focus visible clavier
- labels sur formulaires
- `aria-live` pour feedback d'ouverture WhatsApp / erreurs de contact

---

## Sécurité frontend (minimum)

- ne jamais exposer de secrets dans le client
- valider les entrées côté UI (sans remplacer backend)
- protéger contre injections dans contenus rendus (description produit)

---

## Plan de livraison frontend (proposé)

## Phase 1 - Fondations UI

- setup projet marketplace
- layout global + thème ERP-like
- composants de base (boutons, cards, forms, skeletons)

## Phase 2 - Parcours découverte

- accueil marketplace
- listing boutiques
- page boutique + catalogue
- fiche produit

## Phase 3 - Parcours achat

- intégration CTA WhatsApp sur cards et fiches produit
- génération message pré-rempli
- fallback UX si contact WhatsApp indisponible

## Phase 4 - Qualité

- responsive complet
- SEO meta + OpenGraph
- tests UI essentiels

---

## Critères d'acceptation (frontend)

1. Un visiteur peut ouvrir `owo.bj/didier-shop` et voir uniquement les produits de cette boutique.
2. Depuis la page boutique, il peut ouvrir une fiche produit puis cliquer sur `Commander sur WhatsApp`.
3. Le clic ouvre WhatsApp avec un message pré-rempli contenant les infos produit/boutique.
4. Le thème visuel reste cohérent avec l'ERP (couleurs d'accentuation et composants).
5. Les pages gèrent proprement les états loading/empty/error.

---

## Notes produit

- Le `shopSlug` peut être un slug lisible ou un identifiant technique, mais il doit rester stable pour les URLs.
- La marketplace est un produit indépendant ; l'expérience visuelle doit rester dans la famille Owo.
- Cette spécification est orientée MVP et pourra être enrichie (paiement en ligne plus tard, avis, favoris, analytics vendeurs).
- Le MVP actuel ne prévoit ni création de compte client, ni tunnel de commande interne.

## Directive d'exécution pour IA implémenteuse

Si ce document est transmis à une IA de génération de code :

1. Ne pas supposer l'existence de composants partagés ERP.
2. Créer les composants UI nécessaires dans le projet marketplace.
3. Implémenter des mocks API si le backend marketplace n'est pas prêt.
4. Respecter strictement les routes, états UI, et critères d'acceptation définis ici.
5. Signaler explicitement toute ambiguïté au lieu d'inventer des dépendances ERP.

---

## V2 - Spécification UI détaillée (prête à implémenter)

Cette section complète les parties précédentes avec des règles visuelles et interactives précises, pour éviter les interprétations.

## Breakpoints, grille et spacing

### Breakpoints

- `mobile`: `0-767px`
- `tablet`: `768-1023px`
- `desktop`: `>=1024px`
- `wide`: `>=1440px`

### Container

- `mobile`: padding horizontal `16px`
- `tablet`: padding horizontal `24px`
- `desktop`: max-width `1200px`, padding horizontal `24px`, centré
- `wide`: max-width `1320px`

### Échelle d'espacement

- `4`, `8`, `12`, `16`, `20`, `24`, `32`, `40`, `48`, `64`
- ne pas utiliser de valeurs arbitraires hors exceptions justifiées

## Typographie (valeurs cibles)

- `display-xl`: `40/48`, `700`
- `h1`: `32/40`, `700`
- `h2`: `24/32`, `700`
- `h3`: `20/28`, `600`
- `body-lg`: `18/28`, `400`
- `body`: `16/24`, `400`
- `body-sm`: `14/20`, `400`
- `caption`: `12/16`, `500`
- `button`: `14/20`, `600`

## Comportement global des interactions

- durée transition standard: `160ms`
- easing: `ease-out`
- `hover`: légère élévation ou contraste
- `active`: réduction légère (`scale(0.98)` max)
- `focus-visible`: anneau de focus 2px basé sur `--brand-500`
- composants désactivés: opacité `0.5`, curseur `not-allowed`

## Spécification par écran

## 1) Accueil (`/`)

### Structure exacte desktop

1. Topbar
2. Hero
3. Recherche principale
4. Boutiques en vedette
5. Produits tendances
6. Catégories
7. Footer

### Topbar

- hauteur: `72px`
- contenu: logo à gauche, lien `Boutiques`, lien `Aide`
- CTA principal à droite: `Explorer les boutiques`

### Hero

- marge top: `24px` desktop, `16px` mobile
- bloc principal:
  - titre max-width `680px`
  - sous-texte max-width `720px`
  - CTA primaire + secondaire alignés horizontalement (stack en mobile)

### Recherche principale

- champ hauteur `48px`
- icône recherche à gauche
- placeholder: `Rechercher une boutique ou un produit`
- debounce: `350ms`

### Responsive mobile

- sections en pile unique
- boutons hero en colonne, largeur 100%
- cards produits en carrousel horizontal ou grille 2 colonnes

## 2) Listing boutiques (`/shops`)

### Layout

- zone filtres en haut
- grille boutiques:
  - `mobile`: 1 colonne
  - `tablet`: 2 colonnes
  - `desktop`: 3 colonnes
  - `wide`: 4 colonnes

### Barre filtres

- hauteur min contrôles: `40px`
- champs: catégorie, ville, tri
- bouton `Réinitialiser` visible si un filtre actif

### Shop card (exact)

- radius: `16px`
- border: `1px solid var(--border-default)`
- padding interne: `16px`
- image/logo: `64x64`
- titre: `h3`, clamp à 2 lignes
- description: `body-sm`, clamp à 2 lignes
- footer card:
  - compteur produits à gauche
  - bouton `Voir la boutique` à droite

### États

- loading: 8 skeleton cards
- empty: message + CTA `Effacer les filtres`
- error: alerte inline + bouton `Réessayer`

## 3) Page boutique (`/:shopSlug`)

### En-tête boutique

- cover:
  - hauteur `220px` desktop, `160px` mobile
  - fallback dégradé marque si image absente
- bloc identité superposé en bas:
  - logo `88x88` desktop, `64x64` mobile
  - nom boutique
  - meta: ville, téléphone, délais si dispo

### Catalogue

- barre tri + filtres sticky après scroll (desktop)
- grille produits:
  - `mobile`: 2 colonnes
  - `tablet`: 3 colonnes
  - `desktop`: 4 colonnes

### Product card (exact)

- image ratio `1:1`
- nom clamp 2 lignes
- prix principal visible
- badges (optionnels): `Promo`, `Stock limité`, `Nouveau`
- CTA principal: `Commander sur WhatsApp`
- CTA secondaire (optionnel): `Voir détails`

### CTA WhatsApp sur card

- hauteur bouton: `40px`
- radius: `9999px`
- icône WhatsApp à gauche
- texte centré verticalement

## 4) Fiche produit (`/:shopSlug/products/:productSlug`)

### Layout desktop

- colonne gauche: galerie (`60%`)
- colonne droite: infos + CTA (`40%`)
- gap colonnes: `32px`

### Layout mobile

- galerie en haut
- infos ensuite
- bouton WhatsApp sticky bottom (safe-area respectée)

### Bloc infos produit

- titre produit
- prix courant
- prix barré si promo
- stock/disponibilité
- sélecteur variante (si applicable)
- stepper quantité (`-` / valeur / `+`)
- CTA principal WhatsApp

### Règles variantes

- si variantes existent, sélection obligatoire avant CTA
- sinon CTA actif immédiatement
- variante indisponible: état disabled + libellé `Indisponible`

### Bouton WhatsApp (exact)

- libellé: `Commander sur WhatsApp`
- style: bouton primary marque
- hauteur:
  - `mobile`: `52px`
  - `desktop`: `48px`
- largeur:
  - `mobile`: 100%
  - `desktop`: auto (min-width `260px`)

## États et feedback micro-interactions

### Pendant l'ouverture WhatsApp

- au clic:
  - bouton passe en état loading (`Ouverture WhatsApp...`)
  - spinner à gauche du libellé
  - désactivation temporaire du bouton
- timeout UX recommandé: `1.5s` max avant fallback erreur

### Si échec d'ouverture

- toast erreur: `Impossible d'ouvrir WhatsApp`
- afficher modal légère:
  - numéro vendeur
  - bouton `Copier le numéro`
  - bouton `Réessayer`

### Si numéro absent

- bouton disabled
- helper text: `Contact WhatsApp indisponible pour cette boutique`

## Spécification QA visuelle (checklist)

## Général

- aucun débordement horizontal de `320px` à `1920px`
- focus clavier visible sur tous les éléments interactifs
- contraste texte/fond conforme AA

## Listing boutiques

- la grille change bien de colonnes selon breakpoint
- les cards gardent une hauteur visuelle homogène
- les titres longs sont tronqués proprement

## Page boutique

- header boutique reste lisible même sans cover image
- CTA WhatsApp visible sur chaque carte produit
- filtres et tri restent utilisables sur mobile

## Fiche produit

- sélection variante bloque le CTA tant qu'invalide
- le message WhatsApp contient bien les variables attendues
- le lien WhatsApp s'ouvre avec texte encodé

## États

- loading/empty/error/success présents sur chaque page de données
- fallback de contact s'affiche correctement en cas d'échec

## Mapping composants minimum (pour IA externe)

- `MarketplaceLayout`
- `Topbar`
- `HeroSection`
- `SearchBar`
- `ShopCard`
- `ProductCard`
- `ShopHeader`
- `ProductGallery`
- `VariantSelector`
- `QuantityStepper`
- `WhatsAppButton`
- `ContactFallbackModal`
- `EmptyState`
- `ErrorState`
- `SkeletonGrid`

## Règle finale d'implémentation

Si un point visuel n'est pas précisé:

1. choisir la variante la plus simple et cohérente avec cette spec
2. privilégier lisibilité et conversion vers CTA WhatsApp
3. documenter la décision dans un fichier `IMPLEMENTATION_NOTES.md`

---

## Starter technique recommandé - Next.js

Cette section définit le stack et l'architecture de base à utiliser pour implémenter la marketplace.

## Stack cible (MVP)

- Framework: `Next.js` (App Router) + `TypeScript`
- Styling: `Tailwind CSS`
- Data fetching/cache: `@tanstack/react-query`
- Validation runtime: `zod`
- Forms: `react-hook-form` + `@hookform/resolvers`
- I18n: `next-intl` (ou `react-i18next` si déjà standard interne)
- Icons: `lucide-react`
- Qualité: `eslint` + `prettier`
- Tests UI: `vitest` + `@testing-library/react` (ou Playwright pour E2E)
- Déploiement: `Vercel` (recommandé)

## Versions conseillées

- Node.js: `20 LTS` minimum
- Next.js: dernière version stable
- React: version compatible Next stable

## Variables d'environnement

Créer `.env.local`:

```bash
NEXT_PUBLIC_MARKETPLACE_API_BASE_URL=https://api.owo.bj
NEXT_PUBLIC_SITE_URL=https://owo.bj
```

Règle:

- seules les variables `NEXT_PUBLIC_*` sont accessibles au navigateur
- aucune clé secrète backend ne doit être exposée côté client

## Arborescence projet recommandée

```text
owo-marketplace/
  src/
    app/
      (public)/
        page.tsx                       # /
        shops/
          page.tsx                     # /shops
        [shopSlug]/
          page.tsx                     # /:shopSlug
          products/
            [productSlug]/
              page.tsx                 # /:shopSlug/products/:productSlug
      about/page.tsx
      help/page.tsx
      terms/page.tsx
      privacy/page.tsx
      layout.tsx
      globals.css

    components/
      layout/
        MarketplaceLayout.tsx
        Topbar.tsx
        Footer.tsx
      shops/
        ShopCard.tsx
        ShopHeader.tsx
      products/
        ProductCard.tsx
        ProductGallery.tsx
        VariantSelector.tsx
        QuantityStepper.tsx
      whatsapp/
        WhatsAppButton.tsx
        ContactFallbackModal.tsx
      states/
        EmptyState.tsx
        ErrorState.tsx
        SkeletonGrid.tsx

    features/
      home/
      shops/
      shop/
      product/

    lib/
      api/
        client.ts
        shops.ts
        products.ts
      whatsapp/
        buildWhatsAppMessage.ts
        buildWhatsAppUrl.ts
      utils/
        currency.ts
        formatters.ts
      config/
        env.ts

    hooks/
      useShops.ts
      useShop.ts
      useProduct.ts

    types/
      api.ts
      domain.ts

    schemas/
      shop.schema.ts
      product.schema.ts

  public/
    images/

  docs/
    marketplace-frontend-spec.md
    IMPLEMENTATION_NOTES.md
```

## Conventions de code

- Composants React: `PascalCase.tsx`
- Hooks: `useXxx.ts`
- utilitaires purs: `camelCase.ts`
- un composant = un fichier
- composants UI réutilisables sans dépendance métier dans `components/`
- logique métier par page dans `features/`

## Stratégie data fetching (Next.js)

- Pages SEO critiques (`/`, `/shops`, `/:shopSlug`, `/:shopSlug/products/:productSlug`):
  - privilégier rendu serveur (`fetch` côté server component) pour indexation
- Interactions dynamiques (filtres, tri instantané, états client):
  - utiliser `React Query` côté client
- Revalidation:
  - activer `revalidate` selon besoin business (ex: `60s` ou `300s`)

## Structure API client

- `lib/api/client.ts`: wrapper `fetch` commun
- `lib/api/shops.ts`: endpoints boutiques
- `lib/api/products.ts`: endpoints produits
- parser systématique des réponses via `zod` avant usage UI

## Intégration WhatsApp (module dédié)

Créer `lib/whatsapp/`:

- `buildWhatsAppMessage.ts`:
  - applique les templates définis dans cette spec
  - gère produit simple / variante / promo / stock limité
- `buildWhatsAppUrl.ts`:
  - construit `https://wa.me/{phone}?text={encodedMessage}`
  - encode avec `encodeURIComponent`

Interface minimale recommandée:

```ts
type WhatsAppPayload = {
  phoneE164: string;
  shopName: string;
  productName: string;
  productUrl: string;
  qty?: number;
  variantLabel?: string;
  formattedPrice?: string;
  promoPrice?: string;
  stockLabel?: string;
};
```

## SEO avec Next.js

- générer `metadata` par page (`title`, `description`, OpenGraph)
- inclure `canonical` URLs
- générer `robots.ts` et `sitemap.ts`
- utiliser slugs lisibles et stables

## Accessibilité minimale à respecter

- `focus-visible` sur tous les boutons/liens/champs
- labels explicites
- contrastes AA
- support clavier sur sélecteurs variantes et quantité

## Scripts NPM recommandés

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest"
  }
}
```

## Plan de démarrage (7 étapes)

1. Initialiser projet Next.js + TypeScript + Tailwind
2. Installer React Query, Zod, React Hook Form, Lucide
3. Créer layout global + tokens UI
4. Implémenter pages publiques vides selon routing
5. Brancher API shops/products avec parsing Zod
6. Implémenter CTA WhatsApp + templates + fallback
7. Ajouter SEO metadata + tests UI critiques

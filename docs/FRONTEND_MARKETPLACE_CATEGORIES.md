# Catégories Marketplace — Guide Frontend

> **Mise à jour** : le champ `category` a été **retiré des boutiques** ; il s’applique uniquement aux **produits**. Voir le détail dans [`FRONTEND_MARKETPLACE_CATEGORY_CHANGES.md`](./FRONTEND_MARKETPLACE_CATEGORY_CHANGES.md).

## L'endpoint

```
GET /api/marketplace/categories/
```

- Pas d'authentification requise
- Retourne un tableau JSON plat
- Réponse mise en cache 24h côté CDN (`Cache-Control: public, max-age=86400`)

---

## Format de réponse

```json
[
  { "slug": "vetements-femme", "label": "Vêtements femme" },
  { "slug": "vetements-homme", "label": "Vêtements homme" },
  { "slug": "maquillage",      "label": "Maquillage" },
  ...
]
```

- `slug` → valeur à envoyer dans le champ `category` des **produits** (création / édition)
- `label` → texte à afficher dans l'interface

---

## Règle importante

Le champ `category` des **produits** **doit être un slug de cette liste**, ou une chaîne vide `""`.

Envoyer une valeur hors liste retourne une erreur `400` :

```json
{
  "errors": {
    "category": [
      "Catégorie invalide : 'mode'. Utilisez GET /api/marketplace/categories/ pour obtenir la liste des catégories valides."
    ]
  }
}
```

Ne jamais laisser l'utilisateur saisir une catégorie en texte libre. Toujours utiliser un `<select>` ou une liste de choix alimentée par cet endpoint.

---

## Utilisation recommandée

Charger la liste **une seule fois** au démarrage de l'app et la stocker en mémoire ou dans un store global. Elle ne change pas à chaud.

```ts
// utils/marketplace.ts
let _categories: { slug: string; label: string }[] | null = null

export async function getMarketplaceCategories() {
  if (_categories) return _categories
  const res = await fetch('/api/marketplace/categories/')
  _categories = await res.json()
  return _categories
}
```

### Peupler un select

```tsx
const categories = await getMarketplaceCategories()

<select name="category">
  <option value="">— Aucune catégorie —</option>
  {categories.map(c => (
    <option key={c.slug} value={c.slug}>{c.label}</option>
  ))}
</select>
```

### Afficher le label depuis un slug

```ts
const categories = await getMarketplaceCategories()
const map = Object.fromEntries(categories.map(c => [c.slug, c.label]))

map['vetements-femme']  // → "Vêtements femme"
map['maquillage']       // → "Maquillage"
map['autres']           // → "Autres"
```

### Envoyer la catégorie à l'API (produits)

```ts
// Créer un produit avec une catégorie
await fetch('/api/marketplace/my-shop/products/', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Robe en wax',
    category: 'vetements-femme',  // ← slug, pas le label
    price: '15000.00',
  }),
})
```

> Ne plus envoyer `category` sur `POST/PATCH/PUT /api/marketplace/my-shop/` — le champ n'existe plus côté boutique.

---

## Liste complète des catégories

### Mode & Accessoires

| Slug | Label |
|------|-------|
| `vetements-femme` | Vêtements femme |
| `vetements-homme` | Vêtements homme |
| `vetements-enfant` | Vêtements enfant |
| `chaussures-femme` | Chaussures femme |
| `chaussures-homme` | Chaussures homme |
| `chaussures-enfant` | Chaussures enfant |
| `sacs-maroquinerie` | Sacs & Maroquinerie |
| `bijoux-montres` | Bijoux & Montres |
| `lunettes` | Lunettes |
| `casquettes-chapeaux` | Casquettes & Chapeaux |
| `ceintures-bretelles` | Ceintures & Bretelles |
| `lingerie-sous-vetements` | Lingerie & Sous-vêtements |
| `maillots-de-bain` | Maillots de bain |
| `vetements-sport` | Vêtements de sport |
| `uniformes-professionnels` | Uniformes & Tenues professionnelles |
| `tissus-pagnes` | Tissus & Pagnes |
| `perruques-extensions` | Perruques & Extensions capillaires |

### Beauté & Bien-être

| Slug | Label |
|------|-------|
| `soins-visage` | Soins visage |
| `soins-corps` | Soins corps |
| `soins-cheveux` | Soins cheveux |
| `maquillage` | Maquillage |
| `parfums-deodorants` | Parfums & Déodorants |
| `hygiene-sante` | Hygiène & Santé |
| `produits-naturels-bio` | Produits naturels & Bio |
| `materiel-coiffure` | Matériel de coiffure |
| `ongles-nail-art` | Ongles & Nail art |

### Alimentation & Boissons

| Slug | Label |
|------|-------|
| `epicerie-seche` | Épicerie sèche |
| `produits-frais` | Produits frais |
| `viandes-poissons` | Viandes & Poissons |
| `fruits-legumes` | Fruits & Légumes |
| `boissons-non-alcoolisees` | Boissons non alcoolisées |
| `boissons-alcoolisees` | Boissons alcoolisées |
| `snacks-confiseries` | Snacks & Confiseries |
| `produits-locaux` | Produits locaux & Terroir |
| `epices-condiments` | Épices & Condiments |
| `huiles-beurres` | Huiles & Beurres |
| `cereales-legumineuses` | Céréales & Légumineuses |
| `produits-laitiers-oeufs` | Produits laitiers & Œufs |
| `plats-prepares` | Plats préparés & Traiteur |
| `patisserie-boulangerie` | Pâtisserie & Boulangerie |

### Maison & Décoration

| Slug | Label |
|------|-------|
| `meubles` | Meubles |
| `decoration-interieure` | Décoration intérieure |
| `literie-linge-maison` | Literie & Linge de maison |
| `cuisine-arts-de-table` | Cuisine & Arts de la table |
| `luminaires` | Luminaires |
| `rangement-organisation` | Rangement & Organisation |
| `jardinage-plantes` | Jardinage & Plantes |
| `bricolage-outillage` | Bricolage & Outillage |
| `peinture-revetements` | Peinture & Revêtements |
| `electromenager` | Électroménager |
| `nettoyage-entretien` | Nettoyage & Entretien |

### Électronique & Informatique

| Slug | Label |
|------|-------|
| `smartphones-tablettes` | Smartphones & Tablettes |
| `ordinateurs-peripheriques` | Ordinateurs & Périphériques |
| `tv-audio-video` | TV, Audio & Vidéo |
| `appareils-photo-cameras` | Appareils photo & Caméras |
| `accessoires-electronique` | Accessoires électronique |
| `consoles-jeux-video` | Consoles & Jeux vidéo |
| `batteries-chargeurs` | Batteries & Chargeurs |
| `cables-adaptateurs` | Câbles & Adaptateurs |
| `domotique-securite` | Domotique & Sécurité |

### Téléphonie & Réseaux

| Slug | Label |
|------|-------|
| `credit-telephonique` | Crédit téléphonique & Recharges |
| `accessoires-telephone` | Accessoires téléphone |
| `internet-reseaux` | Internet & Réseaux |

### Santé & Pharmacie

| Slug | Label |
|------|-------|
| `medicaments-parapharmacie` | Médicaments & Parapharmacie |
| `materiel-medical` | Matériel médical |
| `complements-alimentaires` | Compléments alimentaires |
| `optique` | Optique |
| `bien-etre-relaxation` | Bien-être & Relaxation |

### Sport & Loisirs

| Slug | Label |
|------|-------|
| `equipement-sportif` | Équipement sportif |
| `fitness-musculation` | Fitness & Musculation |
| `sports-nautiques` | Sports nautiques |
| `sports-collectifs` | Sports collectifs |
| `arts-martiaux` | Arts martiaux |
| `camping-randonnee` | Camping & Randonnée |
| `jeux-jouets` | Jeux & Jouets |
| `livres-bd-mangas` | Livres, BD & Mangas |
| `musique-instruments` | Musique & Instruments |
| `loisirs-creatifs` | Loisirs créatifs |

### Automobile & Moto

| Slug | Label |
|------|-------|
| `pieces-auto` | Pièces auto |
| `accessoires-auto` | Accessoires auto |
| `pieces-moto` | Pièces moto |
| `accessoires-moto` | Accessoires moto |
| `entretien-vehicule` | Entretien véhicule |
| `pneus-jantes` | Pneus & Jantes |
| `huiles-lubrifiants` | Huiles & Lubrifiants |

### Bébé & Enfant

| Slug | Label |
|------|-------|
| `puericulture` | Puériculture |
| `jouets-enfant` | Jouets enfant |
| `alimentation-bebe` | Alimentation bébé |
| `hygiene-bebe` | Hygiène bébé |
| `mobilier-bebe` | Mobilier bébé |
| `vetements-bebe` | Vêtements bébé |

### Bureau & Fournitures

| Slug | Label |
|------|-------|
| `fournitures-scolaires` | Fournitures scolaires |
| `papeterie-bureau` | Papeterie & Bureau |
| `imprimerie-impression` | Imprimerie & Impression |
| `materiel-bureau` | Matériel de bureau |

### Agriculture & Élevage

| Slug | Label |
|------|-------|
| `semences-plants` | Semences & Plants |
| `engrais-pesticides` | Engrais & Pesticides |
| `materiel-agricole` | Matériel agricole |
| `elevage-animaux` | Élevage & Animaux |
| `produits-veterinaires` | Produits vétérinaires |

### Construction & BTP

| Slug | Label |
|------|-------|
| `materiaux-construction` | Matériaux de construction |
| `quincaillerie` | Quincaillerie |
| `sanitaire-plomberie` | Sanitaire & Plomberie |
| `electricite-batiment` | Électricité bâtiment |
| `menuiserie-bois` | Menuiserie & Bois |
| `carrelage-revetements` | Carrelage & Revêtements de sol |

### Énergie & Environnement

| Slug | Label |
|------|-------|
| `panneaux-solaires` | Panneaux solaires & Énergie solaire |
| `groupes-electrogenes` | Groupes électrogènes |
| `batteries-stockage` | Batteries & Stockage d'énergie |
| `eau-assainissement` | Eau & Assainissement |

### Services & Prestations

| Slug | Label |
|------|-------|
| `services-informatiques` | Services informatiques |
| `services-graphisme` | Graphisme & Design |
| `services-formation` | Formation & Cours |
| `services-evenementiel` | Événementiel & Traiteur |
| `services-transport` | Transport & Livraison |
| `services-reparation` | Réparation & Maintenance |
| `services-beaute` | Services beauté & Coiffure |
| `services-sante` | Services santé & Bien-être |
| `services-juridiques` | Services juridiques & Administratifs |
| `services-immobilier` | Immobilier |
| `services-financiers` | Services financiers |

### Art & Artisanat

| Slug | Label |
|------|-------|
| `art-peinture-sculpture` | Art, Peinture & Sculpture |
| `artisanat-local` | Artisanat local |
| `photographie` | Photographie |
| `mode-createurs` | Mode créateurs |

### Divers

| Slug | Label |
|------|-------|
| `cadeaux-occasions` | Cadeaux & Occasions spéciales |
| `produits-occasion` | Produits d'occasion |
| `autres` | Autres |

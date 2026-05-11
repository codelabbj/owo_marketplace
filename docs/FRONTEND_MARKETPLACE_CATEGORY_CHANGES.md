# Marketplace — Changements sur le champ `category`

## Ce qui a changé

### 1. La boutique n'a plus de `category`

Le champ `category` a été **supprimé de la boutique** (`Shop`). Une boutique peut vendre des produits de catégories différentes — forcer une catégorie unique sur la boutique n'avait pas de sens.

**Avant**, la réponse de `GET /api/marketplace/my-shop/` incluait :
```json
{
  "name": "Ma Boutique",
  "category": "vetements",
  ...
}
```

**Maintenant**, ce champ n'existe plus dans la réponse boutique. Si tu l'affichais quelque part dans l'interface, il faut le retirer.

Les endpoints concernés :
- `POST /api/marketplace/my-shop/` — ne plus envoyer `category`
- `GET /api/marketplace/my-shop/` — `category` absent de la réponse
- `PUT /api/marketplace/my-shop/` — ne plus envoyer `category`
- `PATCH /api/marketplace/my-shop/` — ne plus envoyer `category`
- `GET /api/marketplace/shops/` — `category` absent de chaque boutique dans `results`
- `GET /api/marketplace/shops/{slug}/` — `category` absent de la réponse boutique

---

### 2. Les produits ont toujours `category`, mais maintenant validé

Le champ `category` reste sur les **produits** (`MarketplaceProduct`). La différence : il n'est plus un champ texte libre. Il doit maintenant être un slug de la liste canonique, ou une chaîne vide `""`.

Envoyer une valeur inventée retourne `400` :
```json
{
  "errors": {
    "category": [
      "Catégorie invalide : 'mode'. Utilisez GET /api/marketplace/categories/ pour obtenir la liste des catégories valides."
    ]
  }
}
```

---

### 3. Un nouvel endpoint pour récupérer la liste des catégories valides

```
GET /api/marketplace/categories/
```

Pas d'auth. Retourne la liste complète des slugs acceptés :

```json
[
  { "slug": "vetements-femme",  "label": "Vêtements femme" },
  { "slug": "vetements-homme",  "label": "Vêtements homme" },
  { "slug": "maquillage",       "label": "Maquillage" },
  ...
]
```

---

## Ce que tu dois faire côté frontend

### Retirer `category` des formulaires boutique

Si tu as un champ `category` dans le formulaire de création ou d'édition de boutique, il faut le supprimer. L'API l'ignorera de toute façon, mais autant nettoyer.

### Retirer `category` des affichages boutique

Si tu affiches la catégorie d'une boutique dans la liste publique (`/shops/`) ou dans la page boutique (`/shops/{slug}/`), il faut retirer cet affichage — le champ n'est plus retourné.

### Charger les catégories depuis l'API pour les produits

Pour le formulaire de création/édition d'un produit, ne plus utiliser une liste codée en dur. Charger depuis l'API :

```ts
const res = await fetch('/api/marketplace/categories/')
const categories = await res.json()
// [{ slug: 'vetements-femme', label: 'Vêtements femme' }, ...]
```

Peupler le `<select>` avec ces données. Envoyer le `slug` (pas le `label`) dans le corps de la requête.

```ts
// Créer un produit
await fetch('/api/marketplace/my-shop/products/', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Robe en wax',
    category: 'vetements-femme',  // ← slug de la liste
    price: '15000.00',
  }),
})
```

La liste ne change pas à chaud — tu peux la charger une fois au démarrage et la mettre en cache.

---

## Résumé rapide

| Élément | Avant | Maintenant |
|---------|-------|------------|
| `category` sur la boutique | Champ texte libre optionnel | **Supprimé** |
| `category` sur le produit | Champ texte libre optionnel | Slug obligatoirement dans la liste canonique, ou `""` |
| Source des catégories valides | Aucune (texte libre) | `GET /api/marketplace/categories/` |

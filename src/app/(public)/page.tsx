import type { Metadata } from "next";

import Link from "next/link";

import { listShops } from "@/lib/api/shops";

import { listCategories } from "@/lib/api/categories";

import { listTrendingProducts } from "@/lib/api/trending";

import { toShopSummary } from "@/lib/api/mappers";

import { ShopCard } from "@/components/shops/ShopCard";

import { ProductCard } from "@/components/products/ProductCard";

import { Hero } from "@/components/layout/Hero";

import { Section } from "@/components/layout/Section";

import { GlobalSearch } from "@/components/home/GlobalSearch";

import { EmptyState } from "@/components/states/EmptyState";

import { env } from "@/lib/config/env";



export const revalidate = 60;



export const metadata: Metadata = {

  title: "Accueil",

  description:

    "Découvrez les boutiques de la marketplace Owo et commandez en un clic via WhatsApp.",

  alternates: {

    canonical: env.siteUrl,

  },

};



export default async function HomePage() {

  let shopsError: string | null = null;

  const shops = await listShops({ page: 1 }).catch((err: unknown) => {

    shopsError =

      err instanceof Error ? err.message : "Impossible de charger les boutiques.";

    return null;

  });

  const featured = (shops?.results ?? []).slice(0, 4).map(toShopSummary);



  const [trending, categories] = await Promise.all([

    listTrendingProducts(8).catch(() => [] as Awaited<ReturnType<typeof listTrendingProducts>>),

    listCategories().catch(() => [] as Awaited<ReturnType<typeof listCategories>>),

  ]);



  const categoryTiles = categories.slice(0, 6);



  return (

    <>

      <Hero />



      <section className="container -mt-4 pb-2 md:-mt-8">

        <GlobalSearch />

      </section>



      <Section

        title="Boutiques en vedette"

        description="Une sélection des boutiques actives ce mois-ci."

        href="/shops"

      >

        {featured.length === 0 ? (

          <EmptyState

            title={shopsError ? "Connexion API indisponible" : "Pas encore de boutiques"}

            description={

              shopsError

                ? `Vérifiez que l’API répond (${env.apiBaseUrl}) et redémarrez \`npm run dev\` après modification de .env.local. Détail : ${shopsError}`

                : "Aucune boutique active sur la marketplace pour le moment. Publiez une boutique depuis l’ERP (module marketplace)."

            }

            action={

              <Link href="/shops" className="btn-primary">

                Voir toutes les boutiques

              </Link>

            }

          />

        ) : (

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 wide:grid-cols-4">

            {featured.map((shop) => (

              <ShopCard key={shop.id} shop={shop} />

            ))}

          </div>

        )}

      </Section>



      <Section

        title="Produits tendances"

        description="Une sélection parmi les produits publiés sur la marketplace."

        href="/shops"

        cta="Explorer"

      >

        {trending.length === 0 ? (

          <EmptyState

            title="Aucun produit pour le moment"

            description="Les produits publiés dans les boutiques actives apparaîtront ici."

          />

        ) : (

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">

            {trending.map(({ shopSlug, shopName, whatsappPhoneE164, whatsappUrl, product }) => (

              <ProductCard

                key={`${shopSlug}-${product.id}`}

                shopSlug={shopSlug}

                shopName={shopName}

                whatsappPhoneE164={whatsappPhoneE164}

                whatsappUrl={whatsappUrl}

                product={product}

              />

            ))}

          </div>

        )}

      </Section>



      {categoryTiles.length > 0 ? (

        <Section

          title="Catégories principales"

          description="Trouvez ce que vous cherchez par univers."

        >

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">

            {categoryTiles.map((cat) => (

              <Link

                key={cat.slug}

                href={`/shops?query=${encodeURIComponent(cat.label)}`}

                className="card flex items-center justify-between gap-2 p-4 text-body font-medium text-ink hover:border-brand-500"

              >

                {cat.label}

                <span className="text-brand-600">→</span>

              </Link>

            ))}

          </div>

        </Section>

      ) : null}

    </>

  );

}



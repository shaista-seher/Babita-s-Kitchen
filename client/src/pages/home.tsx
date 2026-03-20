import { Info } from "lucide-react";
import { Layout } from "@/components/layout";

const products = [
  {
    id: 1,
    category: "PICKLES / ACHAAR",
    name: "Traditional Nimbu Achaar",
    seller: "wods",
    price: 125,
    isVeg: true,
    image: "https://source.unsplash.com/400x300/?pickle,jar",
    description: "",
  },
  {
    id: 2,
    category: "PAPAD",
    name: "90's MILL Aloo Chips",
    seller: "",
    price: null,
    isVeg: true,
    image: "https://source.unsplash.com/400x300/?papad,chips",
    description:
      "Crispy and delicious potato chips with authentic Indian flavors. Made from premium quality potatoes and...",
  },
] as const;

function BackgroundBlobs() {
  return (
    <>
      <div className="pointer-events-none absolute -top-16 -right-10 h-72 w-72 rounded-full bg-rose-300/30 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-12 h-80 w-80 rounded-full bg-pink-200/25 blur-[90px]" />
    </>
  );
}

function HeroBanner() {
  return (
    <section className="relative z-10">
      <div className="mx-auto max-w-4xl rounded-[28px] border border-black/10 bg-white/50 px-6 py-10 text-center shadow-[0_18px_45px_rgba(72,35,24,0.08)] backdrop-blur-[10px] md:px-12 md:py-12">
        <h1 className="font-serif text-4xl font-bold tracking-[-0.03em] text-[#3d2a23] md:text-5xl">
          Our Feminine Creations
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#85726b] md:text-base">
          Signature recipes crafted with the strength and creativity of women-led excellence
        </p>
      </div>
    </section>
  );
}

function ProductCard({
  product,
}: {
  product: (typeof products)[number];
}) {
  const buttonLabel = "+ ADD TO ORDER";
  const priceLabel = product.price ? `₹${product.price}` : "Coming Soon";

  return (
    <article className="overflow-hidden rounded-2xl bg-[#fffdfa] shadow-[0_16px_38px_rgba(85,51,44,0.08)] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="h-[200px] w-full object-cover"
          loading="lazy"
        />
        {product.isVeg ? (
          <span className="absolute left-4 top-4 rounded-full bg-[#2e7d32] px-3 py-1 text-xs font-semibold text-white">
            Veg
          </span>
        ) : null}
        <button
          type="button"
          aria-label={`More information about ${product.name}`}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-[#6e544d] backdrop-blur-sm"
        >
          <Info className="h-4 w-4" />
        </button>
        <span className="absolute bottom-3 right-3 rounded-full bg-[#8B1A1A] px-4 py-1.5 text-sm font-semibold text-white shadow-md">
          {priceLabel}
        </span>
      </div>

      <div className="space-y-4 px-5 py-5">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9c706d]">
            {product.category}
          </p>
          <h2 className="font-serif text-[1.35rem] font-bold leading-tight text-[#3b2721]">
            {product.name}
          </h2>
          {product.description ? (
            <p
              className="text-sm leading-6 text-[#9a8a84]"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {product.description}
            </p>
          ) : (
            <div className="h-12" />
          )}
          <p className="text-sm text-[#9e8b85]">{product.seller || "\u00A0"}</p>
        </div>

        <button
          type="button"
          className="w-full rounded-lg bg-[#8B1A1A] px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-colors duration-200 hover:bg-[#741515]"
        >
          {buttonLabel}
        </button>
      </div>
    </article>
  );
}

function ProductGrid() {
  return (
    <section className="relative z-10 mt-10">
      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function MenuPage() {
  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#f5f0ea] px-4 py-10 md:px-8 md:py-14">
      <BackgroundBlobs />
      <div className="relative mx-auto max-w-6xl">
        <HeroBanner />
        <ProductGrid />
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout>
      <MenuPage />
    </Layout>
  );
}

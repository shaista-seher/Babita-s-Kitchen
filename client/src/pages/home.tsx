import { useState } from "react";
import { Layout } from "@/components/layout";
import { ProductCard } from "@/components/product-card";
import { useProducts, useCategories } from "@/hooks/use-shop";
import { Search, Loader2, ChefHat, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | undefined>();
  const [filters, setFilters] = useState({
    isVeg: false,
    isGlutenFree: false,
    isHighProtein: false,
  });

  const { data: categories } = useCategories();
  
  const queryParams = {
    search: search || undefined,
    category: activeCategory,
    isVeg: filters.isVeg ? true : undefined,
    isGlutenFree: filters.isGlutenFree ? true : undefined,
    isHighProtein: filters.isHighProtein ? true : undefined,
  };

  const { data: products, isLoading } = useProducts(queryParams);

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40 z-10" />
          {/* landing page hero organic healthy food spread */}
          <img 
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1920&h=800&fit=crop" 
            alt="Healthy fresh food" 
            className="w-full h-full object-cover object-right"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 border border-primary/20 backdrop-blur-sm">
              ✨ Freshly prepared today
            </span>
            <h1 className="text-5xl lg:text-7xl font-display font-bold text-foreground mb-6 leading-[1.1]">
              Nourish your body, <br/>
              <span className="text-primary italic font-serif font-light">delight your soul.</span>
            </h1>
            <p className="text-lg text-secondary/80 mb-10 max-w-lg leading-relaxed">
              Experience the true taste of home with our organic, chef-crafted meals delivered straight to your door.
            </p>
            
            <div className="relative max-w-md glass rounded-2xl p-2 flex items-center shadow-lg">
              <Search className="w-5 h-5 text-muted-foreground ml-3" />
              <Input 
                type="text"
                placeholder="What are you craving?"
                className="border-0 bg-transparent focus-visible:ring-0 text-lg px-4"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button className="rounded-xl bg-secondary hover:bg-secondary/90 text-white px-6">
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Categories & Filters */}
        <div className="flex flex-col lg:flex-row gap-8 justify-between items-start mb-12">
          <div className="flex-1 overflow-x-auto pb-4 -mb-4 hide-scrollbar w-full">
            <div className="flex gap-3">
              <button
                onClick={() => setActiveCategory(undefined)}
                className={`whitespace-nowrap px-6 py-3 rounded-full font-medium transition-all ${
                  !activeCategory 
                    ? 'bg-foreground text-background shadow-md' 
                    : 'bg-white text-secondary hover:bg-secondary/5 border border-border/50'
                }`}
              >
                All Menu
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`whitespace-nowrap px-6 py-3 rounded-full font-medium transition-all ${
                    activeCategory === cat.slug 
                      ? 'bg-foreground text-background shadow-md' 
                      : 'bg-white text-secondary hover:bg-secondary/5 border border-border/50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0 bg-white p-2 rounded-2xl border border-border/50 shadow-sm">
            <div className="px-3 py-1 flex items-center gap-2 text-sm font-medium text-muted-foreground border-r border-border">
              <Filter className="w-4 h-4" /> Filters
            </div>
            <button 
              onClick={() => toggleFilter('isVeg')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filters.isVeg ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-secondary/5 text-secondary'}`}
            >
              Vegetarian
            </button>
            <button 
              onClick={() => toggleFilter('isGlutenFree')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filters.isGlutenFree ? 'bg-amber-100 text-amber-800' : 'hover:bg-secondary/5 text-secondary'}`}
            >
              Gluten-Free
            </button>
            <button 
              onClick={() => toggleFilter('isHighProtein')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filters.isHighProtein ? 'bg-rose-100 text-rose-800' : 'hover:bg-secondary/5 text-secondary'}`}
            >
              High Protein
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-primary">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="font-medium">Preparing the menu...</p>
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border border-border/50 shadow-sm max-w-2xl mx-auto mt-12">
            <div className="w-20 h-20 bg-secondary/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <ChefHat className="w-10 h-10 text-secondary/40" />
            </div>
            <h3 className="text-2xl font-display font-semibold text-foreground mb-3">No dishes found</h3>
            <p className="text-muted-foreground mb-8">We couldn't find anything matching your current filters. Try adjusting your search.</p>
            <Button 
              onClick={() => {
                setSearch("");
                setActiveCategory(undefined);
                setFilters({ isVeg: false, isGlutenFree: false, isHighProtein: false });
              }}
              variant="outline"
              className="rounded-full border-border/50"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </section>
    </Layout>
  );
}

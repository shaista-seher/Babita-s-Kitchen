import { useState } from "react";
import { Layout } from "@/components/layout";
import { ProductCard } from "@/components/product-card";
import { HeroSlider } from "@/components/hero";
import { useProducts, useCategories } from "@/hooks/use-supabase";
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
      {/* Hero Section - Premium Animated Slider */}
      <HeroSlider />

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Search Bar */}
        <div className="mb-10">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              type="text"
              placeholder="Search for papad, pickles, drinks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-14 rounded-2xl text-lg shadow-md border-border/50 focus:border-primary"
            />
          </div>
        </div>

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
              <button
                onClick={() => setActiveCategory('pickles-achaar')}
                className={`whitespace-nowrap px-6 py-3 rounded-full font-medium transition-all ${
                  activeCategory === 'pickles-achaar' 
                    ? 'bg-foreground text-background shadow-md' 
                    : 'bg-white text-secondary hover:bg-secondary/5 border border-border/50'
                }`}
              >
                Pickles/Achaar
              </button>
              <button
                onClick={() => setActiveCategory('chips')}
                className={`whitespace-nowrap px-6 py-3 rounded-full font-medium transition-all ${
                  activeCategory === 'chips' 
                    ? 'bg-foreground text-background shadow-md' 
                    : 'bg-white text-secondary hover:bg-secondary/5 border border-border/50'
                }`}
              >
                Chips
              </button>
              <button
                onClick={() => setActiveCategory('healthy-drinks')}
                className={`whitespace-nowrap px-6 py-3 rounded-full font-medium transition-all ${
                  activeCategory === 'healthy-drinks' 
                    ? 'bg-foreground text-background shadow-md' 
                    : 'bg-white text-secondary hover:bg-secondary/5 border border-border/50'
                }`}
              >
                Healthy Drinks
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

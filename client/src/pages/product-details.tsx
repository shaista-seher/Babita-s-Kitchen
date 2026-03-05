import { useParams, Link } from "wouter";
import { Layout } from "@/components/layout";
import { useProduct } from "@/hooks/use-shop";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Leaf, Flame, Clock, Info, WheatOff, Dumbbell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ProductDetails() {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(Number(id));
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">Product Not Found</h2>
          <Link href="/">
            <Button className="rounded-full bg-primary">Back to Menu</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    toast({
      title: "Added to Cart",
      description: `${quantity}x ${product.name} added to your bag.`,
    });
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to menu
        </Link>

        <div className="bg-white rounded-[2.5rem] p-4 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Image Section */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square sm:aspect-[4/3] lg:aspect-square rounded-[2rem] overflow-hidden bg-secondary/5"
            >
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted/50 text-muted-foreground/30 font-display text-4xl font-bold">
                  BK
                </div>
              )}
              
              <div className="absolute top-6 left-6 flex flex-col gap-3">
                {product.isOrganic && (
                  <span className="bg-white/90 backdrop-blur text-primary text-sm font-bold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm">
                    <Leaf className="w-4 h-4" /> 100% Organic
                  </span>
                )}
                {product.isSpecial && (
                  <span className="bg-accent/90 backdrop-blur text-white text-sm font-bold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm">
                    <Flame className="w-4 h-4" /> Chef's Special
                  </span>
                )}
              </div>
            </motion.div>

            {/* Info Section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                {product.isVeg && (
                  <span className="flex items-center gap-1 text-sm font-medium text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>
                    Vegetarian
                  </span>
                )}
                {product.isGlutenFree && (
                  <span className="flex items-center gap-1 text-sm font-medium text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                    <WheatOff className="w-4 h-4" /> Gluten-Free
                  </span>
                )}
              </div>

              <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4 leading-tight">
                {product.name}
              </h1>
              
              <p className="text-xl font-semibold text-primary mb-8">
                ${Number(product.price).toFixed(2)}
              </p>

              <p className="text-lg text-secondary/80 leading-relaxed mb-10">
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-6 mb-10">
                {product.prepTimeMinutes && (
                  <div className="flex flex-col gap-1 p-4 rounded-2xl bg-secondary/5">
                    <div className="flex items-center gap-2 text-secondary font-medium mb-1">
                      <Clock className="w-5 h-5" /> Prep Time
                    </div>
                    <span className="text-lg text-foreground font-semibold">{product.prepTimeMinutes} mins</span>
                  </div>
                )}
                {product.calories && (
                  <div className="flex flex-col gap-1 p-4 rounded-2xl bg-secondary/5">
                    <div className="flex items-center gap-2 text-secondary font-medium mb-1">
                      <Info className="w-5 h-5" /> Calories
                    </div>
                    <span className="text-lg text-foreground font-semibold">{product.calories} kcal</span>
                  </div>
                )}
              </div>

              {product.ingredients && product.ingredients.length > 0 && (
                <div className="mb-10 border-t border-border/50 pt-8">
                  <h3 className="font-display font-semibold text-lg mb-4 text-foreground">Key Ingredients</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ing, idx) => (
                      <span key={idx} className="px-4 py-2 bg-background border border-border/60 rounded-full text-sm font-medium text-secondary">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto flex items-center gap-4 pt-6 border-t border-border/50">
                <div className="flex items-center bg-background border border-border rounded-2xl p-1 h-14">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-full flex items-center justify-center text-secondary hover:bg-secondary/10 rounded-xl transition-colors font-medium text-xl"
                  >-</button>
                  <span className="w-12 text-center font-semibold text-lg text-foreground">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-full flex items-center justify-center text-secondary hover:bg-secondary/10 rounded-xl transition-colors font-medium text-xl"
                  >+</button>
                </div>

                <Button 
                  onClick={handleAdd}
                  disabled={!product.isAvailable}
                  className={`flex-1 h-14 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all ${added ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-primary hover:bg-primary/90'}`}
                >
                  {added ? (
                    <><Check className="w-6 h-6 mr-2" /> Added</>
                  ) : product.isAvailable ? (
                    `Add to Bag - $${(Number(product.price) * quantity).toFixed(2)}`
                  ) : (
                    "Currently Unavailable"
                  )}
                </Button>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </Layout>
  );
}

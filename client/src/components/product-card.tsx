import React from "react";
import { Link } from "wouter";
import type { Product } from "@shared/schema";
import { Leaf, Flame, WheatOff, Dumbbell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to detail page
    addItem(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} is in your bag.`,
      duration: 2000,
    });
  };

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="bg-card rounded-3xl overflow-hidden premium-shadow h-full flex flex-col border border-transparent hover:border-primary/10 transition-colors">
        <div className="relative aspect-square overflow-hidden bg-secondary/5">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
              <span className="font-display text-2xl font-bold">BK</span>
            </div>
          )}
          
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isOrganic && (
              <span className="bg-white/90 backdrop-blur text-primary text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                <Leaf className="w-3 h-3" /> Organic
              </span>
            )}
            {product.isSpecial && (
              <span className="bg-accent/90 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                <Flame className="w-3 h-3" /> Chef's Special
              </span>
            )}
          </div>
        </div>

        <div className="p-6 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-2 gap-4">
            <h3 className="font-display font-semibold text-lg text-foreground leading-tight">
              {product.name}
            </h3>
            <span className="font-semibold text-primary shrink-0">${Number(product.price).toFixed(2)}</span>
          </div>
          
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
            {product.description}
          </p>

          <div className="flex items-center gap-3 mb-6 flex-wrap">
            {product.isVeg && (
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>
                Veg
              </div>
            )}
            {product.isGlutenFree && (
              <div className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                <WheatOff className="w-3 h-3" /> GF
              </div>
            )}
            {product.isHighProtein && (
              <div className="flex items-center gap-1 text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded-md">
                <Dumbbell className="w-3 h-3" /> Protein
              </div>
            )}
            {product.calories && (
              <div className="text-xs text-muted-foreground font-medium bg-secondary/5 px-2 py-1 rounded-md">
                {product.calories} cal
              </div>
            )}
          </div>

          <Button 
            onClick={handleAdd}
            className="w-full rounded-xl bg-secondary/5 hover:bg-primary hover:text-primary-foreground text-secondary font-medium transition-all group-hover:shadow-md"
            variant="ghost"
          >
            <Plus className="w-4 h-4 mr-2" /> Add to Bag
          </Button>
        </div>
      </div>
    </Link>
  );
}

import React, { useState, useRef } from "react";
import { Link } from "wouter";
import type { Product } from "@shared/schema";
import { Leaf, Flame, WheatOff, Dumbbell, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to detail page
    
    if (!buttonRef.current) return;
    
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const flyingItem = document.createElement('div');
    flyingItem.className = 'fixed w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold z-50 pointer-events-none';
    flyingItem.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2l6 6-6 6"/></svg>';
    document.body.appendChild(flyingItem);
    
    // Set initial position at button
    flyingItem.style.left = buttonRect.left + buttonRect.width / 2 - 24 + 'px';
    flyingItem.style.top = buttonRect.top + buttonRect.height / 2 - 24 + 'px';
    
    setIsAnimating(true);
    
    // Animate to cart position
    requestAnimationFrame(() => {
      const cartIcon = document.querySelector('[data-cart-icon]');
      if (cartIcon) {
        const cartRect = cartIcon.getBoundingClientRect();
        
        flyingItem.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        flyingItem.style.left = cartRect.left + cartRect.width / 2 - 24 + 'px';
        flyingItem.style.top = cartRect.top + cartRect.height / 2 - 24 + 'px';
        
        setTimeout(() => {
          document.body.removeChild(flyingItem);
          setIsAnimating(false);
        }, 800);
      }
    });
    
    // Add to cart
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
        <div className="relative h-40 sm:h-48 overflow-hidden bg-secondary/5">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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

        <div className="p-3 sm:p-4 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-2 gap-4">
            <h3 className="font-display font-semibold text-lg text-foreground leading-tight">
              {product.name}
            </h3>
            <span className="font-semibold text-primary shrink-0">${Number(product.price).toFixed(2)}</span>
          </div>
          
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
            {product.description}
          </p>

          <div className="flex items-center gap-2 mb-3 flex-wrap">
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
            ref={buttonRef}
            onClick={handleAdd}
            disabled={isAnimating || !product.isAvailable}
            className="w-full rounded-xl bg-secondary/5 hover:bg-primary hover:text-primary-foreground text-secondary font-medium transition-all group-hover:shadow-md relative overflow-hidden"
            variant="ghost"
          >
            <AnimatePresence>
              {isAnimating ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="flex items-center justify-center"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" /> Adding...
                </motion.div>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" /> Add to Bag
                </>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>
    </Link>
  );
}

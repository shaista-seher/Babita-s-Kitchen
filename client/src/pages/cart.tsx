import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/hooks/use-auth";
import { useAddresses, useCreateOrder } from "@/hooks/use-shop";
import { Trash2, ShoppingBag, ArrowRight, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Cart() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { data: addresses } = useAddresses();
  const createOrder = useCreateOrder();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  const tax = totalPrice * 0.08;
  const deliveryFee = totalPrice > 50 ? 0 : 5.99;
  const finalTotal = totalPrice + tax + deliveryFee;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
    
    if (!deliveryAddress.trim()) {
      toast({ title: "Address Required", description: "Please provide a delivery address.", variant: "destructive" });
      return;
    }

    createOrder.mutate({
      address: deliveryAddress,
      timeSlot,
      items: items.map(item => ({ productId: item.product.id, quantity: item.quantity }))
    }, {
      onSuccess: () => {
        clearCart();
        toast({ title: "Order Placed!", description: "Your delicious food is on the way." });
        setLocation("/profile");
      }
    });
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center py-24 px-4 text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 text-primary">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">Your bag is empty</h2>
          <p className="text-muted-foreground mb-8 max-w-md">Looks like you haven't added any of our delicious organic meals to your bag yet.</p>
          <Link href="/">
            <Button className="rounded-full bg-secondary hover:bg-secondary/90 px-8 py-6 text-lg shadow-lg">
              Explore Menu
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-display font-bold text-foreground mb-10">Review Your Order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Cart Items List */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {items.map((item) => (
              <motion.div 
                key={item.product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-4 sm:p-6 border border-border/50 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6"
              >
                <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-secondary/5 shrink-0">
                  {item.product.imageUrl && (
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  )}
                </div>
                
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-display font-semibold text-lg text-foreground">{item.product.name}</h3>
                    <p className="font-semibold text-primary">${(Number(item.product.price) * item.quantity).toFixed(2)}</p>
                  </div>
                  <p className="text-muted-foreground text-sm mb-6 line-clamp-1">{item.product.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-background border border-border rounded-xl h-10 w-fit">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-10 h-full flex items-center justify-center text-secondary hover:bg-secondary/10 rounded-l-xl transition-colors font-medium"
                      >-</button>
                      <span className="w-10 text-center font-semibold text-sm text-foreground">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-10 h-full flex items-center justify-center text-secondary hover:bg-secondary/10 rounded-r-xl transition-colors font-medium"
                      >+</button>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeItem(item.product.id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Checkout Panel */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white rounded-[2.5rem] p-8 border border-border/50 shadow-xl sticky top-28">
              <h3 className="font-display font-semibold text-2xl text-foreground mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-8 text-secondary/80">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-medium text-foreground">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-foreground">
                    {deliveryFee === 0 ? <span className="text-primary">Free</span> : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="pt-4 mt-4 border-t border-border/50 flex justify-between items-center">
                  <span className="font-display font-semibold text-xl text-foreground">Total</span>
                  <span className="font-display font-bold text-2xl text-primary">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {isAuthenticated ? (
                <div className="space-y-6 mb-8 pt-6 border-t border-border/50">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                      <MapPin className="w-4 h-4 text-primary" /> Delivery Address
                    </label>
                    {addresses && addresses.length > 0 && (
                      <div className="mb-3 space-y-2">
                        {addresses.map(addr => (
                          <div 
                            key={addr.id}
                            onClick={() => setDeliveryAddress(addr.address)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all text-sm ${deliveryAddress === addr.address ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:border-primary/30'}`}
                          >
                            <div className="font-medium mb-1">{addr.label}</div>
                            <div className="text-muted-foreground">{addr.address}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    <Textarea 
                      placeholder="Or enter a new address..."
                      className="rounded-xl resize-none bg-background border-border/60"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                      <Clock className="w-4 h-4 text-primary" /> Preferred Time (Optional)
                    </label>
                    <Input 
                      placeholder="e.g., Today 7:00 PM"
                      className="rounded-xl bg-background border-border/60"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="mb-8 p-4 bg-secondary/5 rounded-2xl text-center">
                  <p className="text-secondary font-medium mb-4">Please log in to complete your order and choose delivery details.</p>
                </div>
              )}

              <Button 
                onClick={handleCheckout}
                disabled={createOrder.isPending}
                className="w-full h-14 rounded-2xl bg-secondary hover:bg-secondary/90 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                {createOrder.isPending ? (
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                ) : !isAuthenticated ? (
                  "Login to Checkout"
                ) : (
                  <>Place Order <ArrowRight className="w-5 h-5 ml-2" /></>
                )}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}

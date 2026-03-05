import React from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/context/cart-context";
import { ShoppingBag, User as UserIcon, LogOut, Menu, UtensilsCrossed } from "lucide-react";
import bkLogo from "@assets/BK_logo_1772721148069.jpeg";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 glass border-b-0 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
              <img src={bkLogo} alt="Babita's Kitchen" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-semibold text-xl tracking-tight text-secondary group-hover:text-primary transition-colors">
              Babita's Kitchen
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 font-medium text-secondary/80">
            <Link href="/" className={`hover:text-primary transition-colors ${location === '/' ? 'text-primary font-semibold' : ''}`}>Menu</Link>
            <Link href="/" className="hover:text-primary transition-colors">Specials</Link>
            <Link href="/" className="hover:text-primary transition-colors">Our Story</Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/cart" className="relative p-2 rounded-full hover:bg-secondary/5 transition-colors text-secondary">
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link href="/profile">
                  <Button variant="ghost" className="rounded-full gap-2 text-secondary hover:text-primary hover:bg-primary/10">
                    <UserIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Profile</span>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => logout()} 
                  className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <Button asChild className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <a href="/api/login">Sign In</a>
              </Button>
            )}
            
            <Button variant="ghost" size="icon" className="md:hidden text-secondary">
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="bg-white mt-20 pt-16 pb-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl overflow-hidden grayscale contrast-125">
                  <img src={bkLogo} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <span className="font-display font-semibold text-lg text-secondary">Babita's Kitchen</span>
              </div>
              <p className="text-muted-foreground max-w-sm leading-relaxed">
                True taste of home wherever you roam. We craft organic, wholesome, and delicious meals that nourish the soul.
              </p>
            </div>
            <div>
              <h4 className="font-display font-semibold text-foreground mb-6">Explore</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link href="/" className="hover:text-primary transition-colors">Today's Menu</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Meal Plans</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Gift Cards</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold text-foreground mb-6">Support</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link href="/" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">FAQ</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Delivery Info</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Babita's Kitchen. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/" className="hover:text-secondary">Privacy Policy</Link>
              <Link href="/" className="hover:text-secondary">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

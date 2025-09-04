
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Headphones, ChevronDown, ShoppingCart as CartIcon, LogIn, LogOut, User as UserIcon, LifeBuoy } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from '@/api/entities';

import { useCart } from '../cart/CartContext';
import ShoppingCart from '../beats/ShoppingCart';
import DealNotification from '../notifications/DealNotification';

const genres = [
  { name: "hip-hop", label: "Hip Hop" },
  { name: "trap", label: "Trap" },
  { name: "drill", label: "Drill" },
  { name: "rnb", label: "R&B" },
  { name: "pop", label: "Pop" },
  { name: "boom-bap", label: "Boom Bap" }
];

export default function MainLayout({ children, currentPageName }) {
  const location = useLocation();
  const { cartItems, removeFromCart, handleCheckout, cartTotal, discountAmount, finalTotal, cheapestItemIndex } = useCart();
  const [isDealNotificationVisible, setDealNotificationVisible] = useState(false);
  const notificationSoundRef = useRef(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    let title = "RoyaltyFreeBeats.io | High Quality Beats";
    
    // Updated Title Logic
    if (path === createPageUrl("Browse")) {
        title = "Free Beats & Royalty Free Instrumentals | Download Hip Hop, Trap, Rap Beats";
    } else if (path === createPageUrl("trap")) {
        title = "Trap Beats | RoyaltyFreeBeats.io";
    } else if (path === createPageUrl("hip-hop")) {
        title = "Hip Hop Beats | RoyaltyFreeBeats.io";
    } else if (path === createPageUrl("drill")) {
        title = "Drill Beats | RoyaltyFreeBeats.io";
    } else if (path === createPageUrl("rnb")) {
        title = "R&B Beats | RoyaltyFreeBeats.io";
    } else if (path === createPageUrl("pop")) {
        title = "Pop Beats | RoyaltyFreeBeats.io";
    } else if (path === createPageUrl("boom-bap")) {
        title = "Boom Bap Beats | RoyaltyFreeBeats.io";
    } else if (path === createPageUrl("Support")) {
        title = "Support Center | RoyaltyFreeBeats.io";
    } else if (path === createPageUrl("Profile")) {
        title = "My Profile | RoyaltyFreeBeats.io";
    } else if (path === createPageUrl("Success")) {
        title = "Purchase Successful | RoyaltyFreeBeats.io";
    } else if (path === createPageUrl("upload")) {
        title = "Upload Beats | RoyaltyFreeBeats.io";
    } else if (path === createPageUrl("blog")) {
        title = "Blog | RoyaltyFreeBeats.io - Articles on Music Production & Licensing";
    } else if (path.startsWith(createPageUrl("blog-post") + "/")) { // Check for individual blog posts
        // Placeholder for individual blog post title logic
        title = "Blog Post | RoyaltyFreeBeats.io"; 
    }
    
    document.title = title;

  }, [location]);

  useEffect(() => {
    // Only run this logic on the client
    if (typeof window !== 'undefined') {
      const hasBeenShown = sessionStorage.getItem('dealNotificationShown');
      
      if (!hasBeenShown) {
        const timer = setTimeout(() => {
          setDealNotificationVisible(true);
          notificationSoundRef.current?.play().catch(error => {
            // Autoplay was prevented by browser, this is expected behavior.
            console.log("Notification sound autoplay prevented.");
          });
          sessionStorage.setItem('dealNotificationShown', 'true');
        }, 5000); // 5 seconds

        return () => clearTimeout(timer);
      }
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      }
    };
    fetchUser();
  }, [location.pathname]); // Re-fetch user on navigation to update state

  const handleLogin = async () => {
    await User.login();
    const currentUser = await User.me();
    setUser(currentUser);
  };

  const handleLogout = async () => {
    await User.logout();
    setUser(null);
    // Optionally, redirect to home or refresh to clear state
    window.location.href = createPageUrl("Browse");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        :root {
          --background: #f7f7f7;
          --surface: #ffffff;
          --primary: #007aff;
          --primary-foreground: #ffffff;
          --border: #e5e5e5;
          --text-primary: #1d1d1f;
          --text-secondary: #86868b;
        }
        body {
            font-family: 'Inter', sans-serif;
            color: var(--text-primary);
        }
      `}</style>
      
   <header className="bg-surface/80 backdrop-blur-lg border-b border-[var(--border)] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to={createPageUrl("Browse")} className="flex items-center space-x-3 group">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/8aeaee512_flgang.png"
                alt="RoyaltyFreeBeats Logo"
                className="h-11 w-auto"
              />
            </Link>

            <div className="flex items-center space-x-2">
              <nav className="hidden md:flex items-center space-x-2">
                <Link
                  to={createPageUrl("Browse")}
                  className={`text-sm font-medium flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    location.pathname === createPageUrl("Browse")
                      ? "text-[var(--primary)] bg-blue-500/10"
                      : "text-[var(--text-primary)] hover:bg-gray-100"
                  }`}
                >
                  <Headphones className="w-4 h-4" />
                  <span>Browse</span>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-sm font-medium flex items-center space-x-2 px-3 py-2 text-[var(--text-primary)] hover:bg-gray-100 hover:text-[var(--text-primary)]">
                      <span>Genres</span>
                      <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[var(--surface)] border-[var(--border)] text-[var(--text-primary)]">
                    {genres.map(genre => (
                      <DropdownMenuItem key={genre.name} asChild className="hover:bg-gray-100 cursor-pointer">
                        <Link to={createPageUrl(genre.name)}>
                          {genre.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link
                  to={createPageUrl("blog")}
                  className={`text-sm font-medium flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    location.pathname === createPageUrl("blog") || location.pathname.startsWith(createPageUrl("blog-post"))
                      ? "text-[var(--primary)] bg-blue-500/10"
                      : "text-[var(--text-primary)] hover:bg-gray-100"
                  }`}
                >
                  <span>Blog</span>
                </Link>

                <Link
                  to={createPageUrl("Support")}
                  className={`text-sm font-medium flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    location.pathname === createPageUrl("Support")
                      ? "text-[var(--primary)] bg-blue-500/10"
                      : "text-[var(--text-primary)] hover:bg-gray-100"
                  }`}
                >
                  <LifeBuoy className="w-4 h-4" />
                  <span>Support</span>
                </Link>
              </nav>

              <ShoppingCart
                  items={cartItems}
                  onRemove={removeFromCart}
                  onCheckout={handleCheckout}
                  cartTotal={cartTotal}
                  discountAmount={discountAmount}
                  finalTotal={finalTotal}
                  cheapestItemIndex={cheapestItemIndex}
                  trigger={
                      <Button variant="ghost" className="relative text-[var(--text-primary)] hover:bg-gray-100 hover:text-[var(--text-primary)] ml-2">
                          <CartIcon className="w-5 h-5" />
                          {cartItems.length > 0 && <Badge className="absolute -top-1 -right-2 px-1.5 h-5 bg-[var(--primary)] text-[var(--primary-foreground)] font-bold shadow-md">{cartItems.length}</Badge>}
                      </Button>
                  }
              />
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full group">
                      <Avatar className="h-9 w-9 border-2 border-transparent group-hover:border-[var(--primary)] transition-colors">
                          <AvatarFallback className="bg-gray-200 text-[var(--text-primary)] font-semibold">
                              {user.full_name?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[var(--surface)] border-[var(--border)]">
                    <DropdownMenuItem disabled>
                        <div className="flex flex-col">
                            <span className="font-semibold text-sm text-[var(--text-primary)]">{user.full_name}</span>
                            <span className="text-xs text-[var(--text-secondary)]">{user.email}</span>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-100">
                        <Link to={createPageUrl("Profile")}>
                            <UserIcon className="mr-2 h-4 w-4" />
                            <span>My Profile</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-gray-100">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={handleLogin} variant="ghost" className="text-sm font-medium text-[var(--text-primary)] hover:bg-gray-100 hover:text-[var(--text-primary)]">
                    <LogIn className="w-4 h-4 mr-2" />
                    Log In
                </Button>
              )}

            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-[var(--surface)] border-t border-[var(--border)] mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-1 mb-4 md:mb-0">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">RoyaltyFreeBeats.io</h3>
                   <p className="text-[var(--text-secondary)] text-sm">
                    The next generation of music licensing. High-quality, no copyright beats for creators.
                  </p>
              </div>
              <div className="md:col-span-1">
                 <h4 className="font-semibold text-[var(--text-primary)] mb-3">Popular Genres</h4>
                 <ul className="space-y-2 text-sm">
                    <li><Link to={createPageUrl("trap")} className="text-[var(--text-secondary)] hover:text-[var(--primary)]">Trap Beats</Link></li>
                    <li><Link to={createPageUrl("hip-hop")} className="text-[var(--text-secondary)] hover:text-[var(--primary)]">Hip Hop Beats</Link></li>
                    <li><Link to={createPageUrl("drill")} className="text-[var(--text-secondary)] hover:text-[var(--primary)]">Drill Beats</Link></li>
                 </ul>
              </div>
              <div className="md:col-span-1">
                 <h4 className="font-semibold text-[var(--text-primary)] mb-3">Support</h4>
                 <ul className="space-y-2 text-sm">
                    <li><Link to={createPageUrl("Support")} className="text-[var(--text-secondary)] hover:text-[var(--primary)]">FAQ & Support</Link></li>
                    <li><a href="mailto:help@royaltyfreebeats.io" className="text-[var(--text-secondary)] hover:text-[var(--primary)]">Contact Us</a></li>
                 </ul>
              </div>
               <div className="md:col-span-1">
                 <h4 className="font-semibold text-[var(--text-primary)] mb-3">Need Help?</h4>
                 <p className="text-sm text-[var(--text-secondary)] mb-3">Questions about licensing or downloads?</p>
                 <a 
                    href="mailto:help@royaltyfreebeats.io"
                    className="inline-flex items-center px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    Contact Support
                  </a>
              </div>
           </div>
          <div className="text-center text-[var(--text-secondary)] text-sm mt-10 border-t border-[var(--border)] pt-6">
            © {new Date().getFullYear()} RoyaltyFreeBeats.io - All Rights Reserved.
          </div>
        </div>
      </footer>
      
      <audio
        ref={notificationSoundRef}
        src="https://cdn.freesound.org/previews/220/220170_4100837-lq.mp3"
        preload="auto"
        className="hidden"
      />

      <DealNotification
        isOpen={isDealNotificationVisible}
        onClose={() => setDealNotificationVisible(false)}
      />
    </div>
  );
}

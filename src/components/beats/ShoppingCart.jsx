import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ShoppingCart as CartIcon, X, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const formatPrice = (price) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

export default function ShoppingCart({ items, onRemove, onCheckout, cartTotal, discountAmount, finalTotal, cheapestItemIndex, trigger }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent className="bg-[var(--surface)] border-l-[var(--border)] text-[var(--text-primary)] w-full sm:max-w-md flex flex-col">
        <SheetHeader className="border-b border-[var(--border)]">
          <SheetTitle className="text-[var(--text-primary)] text-xl font-bold tracking-tight">Your Cart</SheetTitle>
        </SheetHeader>
        <div className="flex-grow overflow-y-auto py-6">
          {items.length === 0 ? (
            <div className="text-center text-[var(--text-secondary)] h-full flex flex-col justify-center items-center px-4">
                <CartIcon className="w-16 h-16 mb-4 text-gray-300"/>
                <p className="font-semibold text-lg text-[var(--text-primary)]">Your cart is empty</p>
                <p>Add some beats to get started.</p>
            </div>
          ) : (
            <ul className="space-y-4 px-1">
              {items.map((item, index) => {
                const isFree = index === cheapestItemIndex;
                return (
                  <li key={index} className="flex items-center gap-4">
                    <img src={item.coverArt || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop`} alt={item.title} className="w-16 h-16 rounded-md object-cover"/>
                    <div className="flex-grow">
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-[var(--text-secondary)]">{item.rights}</p>
                      {isFree ? (
                        <div>
                          <span className="line-through text-sm text-gray-400">{formatPrice(item.price)}</span>
                          <Badge variant="default" className="ml-2 bg-green-500 text-white hover:bg-green-600">DEAL APPLIED</Badge>
                        </div>
                      ) : (
                        <p className="text-[var(--primary)] font-medium">{formatPrice(item.price)}</p>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onRemove(index)} className="text-gray-400 hover:text-red-500">
                      <X className="w-4 h-4"/>
                    </Button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-[var(--border)] p-6 bg-[var(--surface)]">
            <div className="w-full space-y-4">
                {discountAmount > 0 && (
                  <div className="space-y-2 pb-2 border-b border-dashed border-[var(--border)]">
                    <div className="flex justify-between items-center text-md">
                        <span className="text-[var(--text-secondary)]">Subtotal</span>
                        <span className="text-[var(--text-secondary)]">{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-md">
                        <span className="text-green-600 font-medium">2-for-1 Discount</span>
                        <span className="text-green-600 font-medium">-{formatPrice(discountAmount)}</span>
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(finalTotal)}</span>
                </div>
                <Button onClick={onCheckout} className="w-full h-12 text-lg bg-[var(--primary)] hover:bg-blue-600 text-[var(--primary-foreground)]">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Secure Checkout
                </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
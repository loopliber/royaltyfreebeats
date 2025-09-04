
import React, { createContext, useState, useContext, useMemo } from 'react';
import { createCheckoutSession } from '@/api/functions';
import { User } from '@/api/entities';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems(prev => [...prev, item]);
  };

  const removeFromCart = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };
  
  const { cartTotal, discountAmount, finalTotal, cheapestItemIndex } = useMemo(() => {
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    if (cartItems.length < 2) {
      return { cartTotal: total, discountAmount: 0, finalTotal: total, cheapestItemIndex: -1 };
    }

    let cheapestPrice = Infinity;
    let cheapestIndex = -1;

    cartItems.forEach((item, index) => {
      if (item.price < cheapestPrice) {
        cheapestPrice = item.price;
        cheapestIndex = index;
      }
    });

    const discount = cheapestPrice;
    
    return {
      cartTotal: total,
      discountAmount: discount,
      finalTotal: total - discount,
      cheapestItemIndex: cheapestIndex,
    };
  }, [cartItems]);

  const handleCheckout = async () => {
    try {
      // First, check if the user is logged in.
      await User.me();
    } catch (authError) {
      // If User.me() throws an error, the user is not logged in.
      alert('Please log in to complete your purchase.');
      await User.login(); // This will trigger the login flow.
      return; // Stop the checkout process here. User can click checkout again after logging in.
    }
    
    try {
      // User is authenticated, proceed with creating the checkout session.
      const lineItems = cartItems.map((item, index) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${item.title} - ${item.rights}`,
            description: `Beat by ${item.artist}`,
            images: item.coverArt ? [item.coverArt] : [],
          },
          unit_amount: index === cheapestItemIndex ? 0 : Math.round(item.price * 100), // Convert to cents, free if cheapest
        },
        quantity: 1,
      }));

      const { data } = await createCheckoutSession({
        line_items: lineItems,
        success_url: `${window.location.origin}${window.location.pathname.replace(/\/[^\/]*$/, '')}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: window.location.href,
      });

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Sorry, there was an error processing your payment. Please try again.');
    }
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    handleCheckout,
    cartTotal,
    discountAmount,
    finalTotal,
    cheapestItemIndex
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

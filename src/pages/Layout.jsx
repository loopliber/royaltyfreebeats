
import React from 'react';
import { CartProvider } from './components/cart/CartContext';
import MainLayout from './components/layout/MainLayout';

export default function Layout({ children, currentPageName }) {
  return (
    <CartProvider>
      <MainLayout currentPageName={currentPageName}>
        {children}
      </MainLayout>
    </CartProvider>
  );
}

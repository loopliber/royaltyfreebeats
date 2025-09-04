import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Gift } from 'lucide-react';

export default function DealNotification({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-5 right-5 z-50 w-full max-w-sm"
        >
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Gift className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800">Special Offer: 2-for-1 Deal!</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Add any 2 beats to your cart and the cheapest one is automatically FREE.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="w-7 h-7 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
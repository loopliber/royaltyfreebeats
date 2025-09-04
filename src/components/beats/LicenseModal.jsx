import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Check, ShoppingCart, Crown, Star, Lock } from "lucide-react";
import { motion } from "framer-motion";

const licenseData = {
  lease: {
    title: 'Lease License',
    priceField: 'lease_price',
    defaultPrice: 20,
    rights: 'Non-exclusive lease',
    icon: <Star className="w-6 h-6" />,
    color: 'blue',
    features: [
      'Up to 50,000 streams',
      'Non-exclusive usage',
      'Commercial use allowed',
      'Beat stays on platform'
    ],
    description: 'Perfect for artists looking to record and distribute their music commercially while keeping costs low.',
    popular: false
  },
  unlimited: {
    title: 'Unlimited License',
    priceField: 'unlimited_price',
    defaultPrice: 150,
    rights: 'Unlimited license',
    icon: <Check className="w-6 h-6" />,
    color: 'green',
    features: [
      'Everything in Lease',
      'Unlimited streams & sales',
      'Premium quality audio files',
      'Full commercial rights'
    ],
    description: 'For serious artists planning major releases without any limitations on distribution or sales.',
    popular: true
  },
  exclusive: {
    title: 'Exclusive Rights',
    priceField: 'exclusive_price',
    defaultPrice: 500,
    rights: '100% Exclusive Ownership',
    icon: <Crown className="w-6 h-6" />,
    color: 'purple',
    features: [
      'Everything in Unlimited',
      '🔥 Beat REMOVED from store forever',
      '👑 100% Exclusive ownership',
      '💎 All rights & stems included',
      '🚀 Full commercial exploitation'
    ],
    description: 'Own this beat FOREVER! Once you buy exclusive rights, this beat will never be sold to another artist again. Complete ownership, maximum impact.',
    popular: false,
    exclusive: true
  }
};

const colorClasses = {
  blue: {
    border: 'border-blue-200 hover:border-blue-400',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    button: 'bg-blue-600 hover:bg-blue-700'
  },
  green: {
    border: 'border-green-200 hover:border-green-400',
    bg: 'bg-green-50',
    text: 'text-green-600',
    button: 'bg-green-600 hover:bg-green-700'
  },
  purple: {
    border: 'border-purple-200 hover:border-purple-400',
    bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
    text: 'text-purple-600',
    button: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
  }
};

const formatPrice = (price) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

export default function LicenseModal({ isOpen, onClose, beat, onAddToCart }) {
  if (!beat) return null;

  const handleAddToCart = (licenseType) => {
    const details = licenseData[licenseType];
    const price = beat[details.priceField] || details.defaultPrice;
    
    onAddToCart({
      beatId: beat.id,
      title: beat.title,
      artist: beat.artist || 'RoyaltyFreeBeats',
      licenseType: licenseType,
      price: price,
      rights: details.rights,
      coverArt: beat.cover_art_url
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-0 text-gray-900 max-w-[95vw] max-h-[90vh] w-full sm:max-w-5xl p-0 m-2 overflow-hidden shadow-2xl">
        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Header */}
          <DialogHeader className="p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b flex-shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-2">
                <DialogTitle className="text-lg sm:text-2xl text-gray-900 leading-tight font-bold">
                  Choose Your License for "{beat.title}"
                </DialogTitle>
                <DialogDescription className="text-gray-600 text-sm sm:text-base mt-2">
                  Select the perfect license for your needs. Each option comes with different usage rights.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-gray-50">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {Object.entries(licenseData).map(([key, data]) => {
                const isExclusiveSold = key === 'exclusive' && beat.is_exclusive_sold;
                const colors = colorClasses[data.color];
                
                return (
                  <motion.div 
                    key={key} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Object.keys(licenseData).indexOf(key) * 0.1 }}
                    className={`relative flex flex-col p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 ${
                      isExclusiveSold 
                        ? 'bg-gray-100 border-gray-300' 
                        : `${colors.bg} ${colors.border} hover:scale-[1.02] ${data.exclusive ? 'ring-2 ring-purple-200' : ''}`
                    }`}
                  >
                    {/* Popular Badge */}
                    {data.popular && !isExclusiveSold && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          MOST POPULAR
                        </span>
                      </div>
                    )}

                    {/* Exclusive Badge */}
                    {data.exclusive && !isExclusiveSold && (
                      <div className="absolute -top-2 -right-2">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-full">
                          <Crown className="w-4 h-4" />
                        </div>
                      </div>
                    )}

                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${colors.bg} ${colors.text}`}>
                            {data.icon}
                          </div>
                          <h3 className={`text-base sm:text-lg font-bold ${colors.text}`}>
                            {data.title}
                          </h3>
                        </div>
                        {isExclusiveSold && <Lock className="w-5 h-5 text-gray-400" />}
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        <p className={`text-3xl sm:text-4xl font-bold ${isExclusiveSold ? 'text-gray-400' : 'text-gray-900'}`}>
                          {isExclusiveSold ? 'SOLD OUT' : formatPrice(beat[data.priceField] || data.defaultPrice)}
                        </p>
                        <p className={`text-sm font-semibold ${colors.text}`}>{data.rights}</p>
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 text-xs sm:text-sm mb-4 leading-relaxed">
                        {data.description}
                      </p>

                      {/* Features */}
                      <ul className="space-y-2 mb-6">
                        {data.features.map((feat, index) => (
                          <motion.li 
                            key={feat}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + (index * 0.1) }}
                            className="flex items-start text-xs sm:text-sm text-gray-700"
                          >
                            <Check className={`w-3 h-3 sm:w-4 sm:h-4 mr-2 mt-0.5 flex-shrink-0 ${colors.text}`} />
                            <span className="leading-relaxed">{feat}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Button */}
                    <Button
                      onClick={() => handleAddToCart(key)}
                      disabled={isExclusiveSold}
                      className={`w-full h-11 text-sm font-semibold transition-all duration-300 ${
                        isExclusiveSold 
                          ? 'bg-gray-300 hover:bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : `text-white ${colors.button} hover:scale-105`
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {isExclusiveSold ? 'Sold Out' : data.exclusive ? '👑 Claim Exclusive Rights' : 'Add to Cart'}
                    </Button>

                    {/* Exclusive Call-to-Action */}
                    {data.exclusive && !isExclusiveSold && (
                      <div className="mt-3 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200">
                        <p className="text-xs text-center font-semibold text-purple-800">
                          ⚡ Limited Time: Own this beat FOREVER
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom CTA for Exclusive */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white text-center"
            >
              <Crown className="w-8 h-8 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">Why Choose Exclusive Rights?</h3>
              <p className="text-sm opacity-90 max-w-2xl mx-auto">
                When you purchase exclusive rights, this beat becomes yours and yours alone. 
                We remove it from our store permanently, ensuring no other artist can ever use it. 
                Maximum impact, zero competition.
              </p>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
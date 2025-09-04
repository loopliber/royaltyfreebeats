
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Download, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

export default function BeatCard({ beat, isPlaying, onPlayPause, onDownload, onPurchase }) {
  const genreColors = {
    'hip-hop': 'bg-purple-100 text-purple-800 border-purple-200',
    'trap': 'bg-red-100 text-red-800 border-red-200',
    'drill': 'bg-gray-100 text-gray-800 border-gray-200',
    'rnb': 'bg-pink-100 text-pink-800 border-pink-200',
    'pop': 'bg-blue-100 text-blue-800 border-blue-200',
    'boom-bap': 'bg-orange-100 text-orange-800 border-orange-200',
    'ambient': 'bg-green-100 text-green-800 border-green-200',
    'rock': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'jazz': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'other': 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex"
    >
      <div className="bg-transparent w-full group">
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <img
            src={beat.cover_art_url || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop`}
            alt={`Cover art for ${beat.title} by ${beat.artist || 'RoyaltyFreeBeats'}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all duration-300" />
          
          {/* Genre Badge */}
          <div className="absolute top-2 left-2">
            <Badge className={`text-xs font-medium border ${genreColors[beat.genre] || genreColors.other}`}>
              {beat.genre ? beat.genre.toUpperCase() : 'BEAT'}
            </Badge>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={() => onPlayPause(beat)}
              size="lg"
              variant="ghost"
              className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white transform transition-all duration-300 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" fill="white" />
              ) : (
                <Play className="w-8 h-8 ml-1" fill="white" />
              )}
            </Button>
          </div>
          {isPlaying && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <Button
                      size="lg"
                      variant="ghost"
                      className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm text-white"
                 >
                     <Pause className="w-8 h-8" fill="white" />
                 </Button>
             </div>
          )}
        </div>

        <div className="pt-3">
          <h3 className="font-semibold text-md text-[var(--text-primary)] truncate">
            {beat.title.toUpperCase()}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] truncate">
            {beat.artist || 'RoyaltyFreeBeats'}
          </p>
          
          <div className="flex items-center justify-between mt-3">
            <p className="text-md font-semibold text-[var(--text-primary)]">
              ${beat.lease_price}
            </p>
          </div>
          
          <div className="flex gap-2 mt-3">
            <Button
              onClick={() => onDownload(beat)}
              size="sm"
              variant="outline"
              className="flex-1 border-[var(--border)] text-[var(--text-secondary)] hover:bg-gray-100 hover:text-[var(--text-primary)] h-8 text-xs"
            >
              <Download className="w-3 h-3 mr-1" />
              Free
            </Button>
            <Button
              onClick={() => onPurchase(beat)}
              size="sm"
              className="flex-1 bg-[var(--primary)] hover:bg-blue-600 text-[var(--primary-foreground)] h-7 text-xs"
            >
              <CreditCard className="w-3 h-3 mr-1" />
              License
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

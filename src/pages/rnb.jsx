import React, { useState, useEffect, useMemo } from "react";
import { Beat } from "@/api/entities";
import { motion } from "framer-motion";
import { Music } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import BeatCard from "../components/beats/BeatCard";
import GlobalAudioPlayer from "../components/beats/GlobalAudioPlayer";
import SearchFilters from "../components/beats/SearchFilters";
import YouTubeSubscribeModal from "../components/beats/YouTubeSubscribeModal";
import LicenseModal from "../components/beats/LicenseModal";
import { useCart } from "../components/cart/CartContext";

const GENRE = 'rnb';
const GENRE_TITLE = 'R&B';
const GENRE_BANNER = 'https://images.unsplash.com/photo-1571463839048-120efd670f1e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export default function RnBPage() {
  const [beats, setBeats] = useState([]);
  const [filteredBeats, setFilteredBeats] = useState([]);
  const [currentBeat, setCurrentBeat] = useState(null);
  const [currentBeatIndex, setCurrentBeatIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [beatForDownload, setBeatForDownload] = useState(null);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [beatForPurchase, setBeatForPurchase] = useState(null);

  // Cart integration
  const { addToCart } = useCart();
  
  // SEO optimized titles and descriptions
  const seoTitle = useMemo(() => `Royalty Free ${GENRE_TITLE} Beats`, []);
  const seoSubtitle = useMemo(() => {
    const year = new Date().getFullYear();
    return `Free ${GENRE} beats for commercial use ${year} - Download high-quality instrumentals`;
  }, []);
  
  useEffect(() => {
    document.title = `${GENRE_TITLE} Beats | RoyaltyFreeBeats.io`;
    loadBeats();
  }, []);
  
  useEffect(() => { filterBeats(); }, [beats, searchTerm]);

  const loadBeats = async () => {
    setLoading(true);
    try {
      const data = await Beat.filter({ genre: GENRE }, '-created_date');
      setBeats(data);
    } catch (error) { console.error('Error loading beats:', error); }
    setLoading(false);
  };

  const filterBeats = () => {
    let filtered = beats.filter(beat =>
      beat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (beat.artist || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (beat.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredBeats(filtered);
  };

  const handlePlayPause = (beat) => {
    if (currentBeat?.id === beat.id) {
      setCurrentBeat(null);
    } else {
      setCurrentBeat(beat);
      setCurrentBeatIndex(filteredBeats.findIndex(b => b.id === beat.id));
    }
  };

  const handleNext = () => {
    const newIndex = (currentBeatIndex + 1) % filteredBeats.length;
    setCurrentBeatIndex(newIndex);
    setCurrentBeat(filteredBeats[newIndex]);
  };

  const handlePrevious = () => {
    const newIndex = (currentBeatIndex - 1 + filteredBeats.length) % filteredBeats.length;
    setCurrentBeatIndex(newIndex);
    setCurrentBeat(filteredBeats[newIndex]);
  };

  const handleBeatEnd = () => handleNext();

  const handleDownloadClick = (beat) => {
    setBeatForDownload(beat);
    setIsYouTubeModalOpen(true);
  };

  const handlePurchaseClick = (beat) => {
    setBeatForPurchase(beat);
    setIsLicenseModalOpen(true);
  };
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
        <p className="text-[var(--text-secondary)]">Loading beats...</p>
      </div>
    </div>
  );

  return (
    <div className="bg-[var(--background)] pb-20">
      {/* Page Content Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative text-center py-16 sm:py-24 overflow-hidden rounded-2xl mt-8">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-2xl" style={{ backgroundImage: `url(${GENRE_BANNER})` }} />
          <div className="absolute inset-0 bg-black/40 rounded-2xl" />
          <div className="relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
                {seoTitle}
              </h1>
              <h2 className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-6 font-medium">
                {seoSubtitle}
              </h2>
              <Link to={createPageUrl("Browse")} className="text-sm text-white/80 hover:text-white transition-colors">
                ← Back to all beats
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Additional SEO Content */}
        <div className="text-center mt-12 mb-8 px-4">
          <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
            Premium {GENRE_TITLE} Instrumentals for Artists & Content Creators
          </h3>
          <p className="text-[var(--text-secondary)] max-w-4xl mx-auto leading-relaxed">
            Discover our collection of royalty-free {GENRE} beats perfect for recording, streaming, and commercial projects. 
            All instrumentals come with professional mixing and are cleared for YouTube, Spotify, and other platforms. 
            Download free beats or purchase premium licenses for commercial use.
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 my-10">
          <SearchFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>

        {filteredBeats.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[var(--text-secondary)]">No {GENRE_TITLE} beats found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
            {filteredBeats.map((beat) => (
              <BeatCard
                key={beat.id}
                beat={beat}
                isPlaying={currentBeat?.id === beat.id}
                onPlayPause={handlePlayPause}
                onDownload={handleDownloadClick}
                onPurchase={handlePurchaseClick}
              />
            ))}
          </div>
        )}

        {/* SEO Footer Content */}
        <div className="mt-16 bg-white rounded-xl p-8 border border-[var(--border)]">
          <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Why Choose Our {GENRE_TITLE} Beats?
          </h4>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-[var(--text-secondary)] leading-relaxed">
            <div>
              <h5 className="font-medium text-[var(--text-primary)] mb-2">Professional Quality</h5>
              <p>All beats are professionally mixed and mastered, ready for your vocals and commercial release.</p>
            </div>
            <div>
              <h5 className="font-medium text-[var(--text-primary)] mb-2">Commercial License</h5>
              <p>Our licenses allow unlimited streams, sales, and commercial use across all platforms.</p>
            </div>
            <div>
              <h5 className="font-medium text-[var(--text-primary)] mb-2">Instant Download</h5>
              <p>Get your beats immediately after purchase with high-quality WAV files.</p>
            </div>
            <div>
              <h5 className="font-medium text-[var(--text-primary)] mb-2">Exclusive Rights</h5>
              <p>Purchase exclusive rights to remove beats from our store and gain full ownership.</p>
            </div>
          </div>
        </div>
      </div>

      <GlobalAudioPlayer
        currentBeat={currentBeat}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onBeatEnd={handleBeatEnd}
        onDownload={handleDownloadClick}
        playlist={filteredBeats}
      />

      <YouTubeSubscribeModal 
        isOpen={isYouTubeModalOpen}
        onClose={() => setIsYouTubeModalOpen(false)}
        beat={beatForDownload}
        onDownloadSuccess={() => setIsYouTubeModalOpen(false)}
      />
      
      <LicenseModal
        isOpen={isLicenseModalOpen}
        onClose={() => setIsLicenseModalOpen(false)}
        beat={beatForPurchase}
        onAddToCart={addToCart}
      />
    </div>
  );
}
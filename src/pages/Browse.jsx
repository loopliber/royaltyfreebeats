import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Beat } from "@/api/entities";
import { motion } from "framer-motion";
import { Music, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";

import BeatCard from "../components/beats/BeatCard";
import GlobalAudioPlayer from "../components/beats/GlobalAudioPlayer";
import SearchFilters from "../components/beats/SearchFilters";
import YouTubeSubscribeModal from "../components/beats/YouTubeSubscribeModal";
import LicenseModal from "../components/beats/LicenseModal";
import { useCart } from "../components/cart/CartContext";
import WhyChooseUs from "../components/sections/WhyChooseUs";
import FaqSection from "../components/sections/FaqSection";

const genres = ["hip-hop", "trap", "drill", "rnb", "pop", "boom-bap"];

// Custom hook for debouncing a value
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: Cancel the timeout if value changes (or component unmounts)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-run if value or delay changes

  return debouncedValue;
}

export default function Browse() {
  const [initialBeats, setInitialBeats] = useState([]); // Stores the initially loaded beats
  const [filteredBeats, setFilteredBeats] = useState([]); // Stores beats after search/initial load
  const [currentBeat, setCurrentBeat] = useState(null);
  const [currentBeatIndex, setCurrentBeatIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // Manages loading state for initial load and search
  const [isSearching, setIsSearching] = useState(false); // Indicates if a search is active

  // YouTube Modal State
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [beatForDownload, setBeatForDownload] = useState(null);

  // License & Cart State
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [beatForPurchase, setBeatForPurchase] = useState(null);
  const { addToCart } = useCart();

  // Load initial set of beats (e.g., latest 20)
  const loadInitialBeats = async () => {
    setLoading(true);
    try {
      const data = await Beat.list('-created_date', 20); // Limit to 20 beats for initial display
      setInitialBeats(data);
      setFilteredBeats(data);
    } catch (error) {
      console.error('Error loading initial beats:', error);
      setInitialBeats([]);
      setFilteredBeats([]);
    }
    setLoading(false);
  };

  // Debounce the search term to reduce API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Effect for initial page load
  useEffect(() => { 
    document.title = "Royalty Free Beats & Instrumentals - Your Site Name";
    loadInitialBeats(); 
  }, []);

  // Effect for handling search based on debounced search term
  useEffect(() => {
    const searchBeats = async () => {
      if (debouncedSearchTerm) {
        setIsSearching(true);
        setLoading(true);
        try {
          // Fetch all beats for comprehensive search
          const allBeats = await Beat.list(); 
          const lowercasedTerm = debouncedSearchTerm.toLowerCase();
          const results = allBeats.filter(beat =>
            beat.title.toLowerCase().includes(lowercasedTerm) ||
            (beat.artist || '').toLowerCase().includes(lowercasedTerm) ||
            (beat.tags || []).some(tag => tag.toLowerCase().includes(lowercasedTerm))
          );
          setFilteredBeats(results);
        } catch (error) {
          console.error("Error searching beats:", error);
          setFilteredBeats([]);
        } finally {
          setLoading(false);
        }
      } else {
        // If search term is cleared, revert to initial beats
        setFilteredBeats(initialBeats);
        setIsSearching(false);
      }
    };

    searchBeats();
  }, [debouncedSearchTerm, initialBeats]); // Rerun when debouncedSearchTerm or initialBeats changes

  // Effect to stop current playback if the playing beat is filtered out or list becomes empty
  useEffect(() => {
    if (currentBeat && (!filteredBeats.length || !filteredBeats.some(b => b.id === currentBeat.id))) {
      setCurrentBeat(null);
      setCurrentBeatIndex(-1);
    }
  }, [filteredBeats, currentBeat]);

  const handlePlayPause = (beat) => {
    if (currentBeat?.id === beat.id) {
      setCurrentBeat(null); // Pause current beat
    } else {
      setCurrentBeat(beat);
      // Find the index in the current filtered list
      setCurrentBeatIndex(filteredBeats.findIndex(b => b.id === beat.id));
    }
  };
  
  const handleNext = () => {
    if (filteredBeats.length === 0) return;
    const newIndex = (currentBeatIndex + 1) % filteredBeats.length;
    setCurrentBeatIndex(newIndex);
    setCurrentBeat(filteredBeats[newIndex]);
  };

  const handlePrevious = () => {
    if (filteredBeats.length === 0) return;
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

  // Show initial loading spinner only when no beats are loaded and not currently searching
  if (loading && !isSearching && filteredBeats.length === 0) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
        <p className="text-[var(--text-secondary)]">Loading beats...</p>
      </div>
    </div>
  );

  return (
    <div className="bg-[var(--background)] pb-20">
      {/* Hero Section */}
      <div className="text-center py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--text-primary)] tracking-tight">
              Download Royalty-Free Beats & Instrumental Music 
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-3xl mx-auto mt-6 leading-relaxed">
              Download thousands of high-quality, copyright free instrumental music for your next hit song. Get instant access to free rap beats, hip hop beats, and no copyright music for YouTube, Spotify, and commercial projects. Trusted by over 10,000 artists and creators worldwide.
            </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4 mb-10">
            <SearchFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>

        <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Free Instrumental Beats by Genre</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {genres.map(g => (
              <Link to={createPageUrl(g)} key={g}>
                <Button variant="outline" size="sm" className="border-[var(--border)] text-[var(--text-secondary)] hover:bg-gray-100 hover:text-[var(--text-primary)] transition-colors duration-200 rounded-full px-4">
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </Button>
              </Link>
            ))}
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-[var(--text-primary)] text-center mb-4">
            {isSearching ? `Search Results for "${searchTerm}"` : 'Latest Free Instrumentals'}
        </h2>
        <p className="text-center text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
          {isSearching 
            ? `Found ${filteredBeats.length} beat(s). All beats are copyright free instrumental music ready for immediate download.`
            : 'Latest free instrumental download collection. All beats are copyright free instrumental music ready for immediate download.'
          }
        </p>
        
        {loading && isSearching ? ( // Show specific loading spinner for search
            <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
                <p className="text-[var(--text-secondary)]">Searching...</p>
            </div>
        ) : filteredBeats.length === 0 ? ( // Display "No beats found" if list is empty after load/search
          <div className="text-center py-20"><p className="text-[var(--text-secondary)]">No beats found.</p></div>
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
      </div>

      <WhyChooseUs />
      
      {/* Additional SEO Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white rounded-xl p-8 border border-[var(--border)]">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] text-center mb-6">
            Free Music Beats & Instrumental Music Download
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-[var(--text-secondary)] leading-relaxed">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Copyright Free Instrumental Music</h3>
              <p>All our beats are 100% copyright free instrumental music, perfect for content creators, artists, and producers. Download free instrumental beats instantly without any registration required.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Professional Quality MP3 Downloads</h3>
              <p>Every free beats download MP3 is professionally mixed and mastered. Get high-quality instrumental mp3 download files ready for your next project.</p>
            </div>
          </div>
        </div>
      </div>

      <FaqSection />

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
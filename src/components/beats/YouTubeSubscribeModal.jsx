import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Download, Youtube, ExternalLink, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function YouTubeSubscribeModal({ isOpen, onClose, beat, onDownloadSuccess }) {
  const [hasSubscribed, setHasSubscribed] = useState(false);

  const handleSubscribeClick = () => {
    // Open YouTube channel in new tab
    window.open("https://www.youtube.com/@RoyaltyFreeBeatsIO?sub_confirmation=1", "_blank");
  };

  const handleConfirmSubscription = () => {
    setHasSubscribed(true);
  };

  const handleDownload = () => {
    // Open the beat audio file for download
    if (beat?.audio_url) {
      window.open(beat.audio_url, '_blank');
    }
    
    onDownloadSuccess();
    onClose();
    setHasSubscribed(false); // Reset for next time
  };

  const handleOpenChange = (open) => {
    if (!open) {
      onClose();
      setHasSubscribed(false); // Reset state when modal closes
    }
  };

  if (!beat) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-[var(--surface)] border-[var(--border)] text-[var(--text-primary)] max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold tracking-tight">Get Your Free Beat</DialogTitle>
          <DialogDescription className="text-[var(--text-secondary)]">
            Subscribe to our YouTube channel to unlock "{beat.title}" for free.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {!hasSubscribed ? (
            <>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <Youtube className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-2">
                    Step 1: Subscribe to Our Channel
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">
                    Click the button below to visit our YouTube channel and hit the subscribe button.
                  </p>
                </div>
              </div>
              
              <Button
                onClick={handleSubscribeClick}
                className="w-full h-11 bg-red-600 hover:bg-red-700 text-white"
              >
                <Youtube className="w-4 h-4 mr-2" />
                Subscribe to YouTube Channel
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-[var(--text-secondary)] mb-3">
                  After subscribing, click the button below:
                </p>
                <Button
                  onClick={handleConfirmSubscription}
                  variant="outline"
                  className="w-full"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  I've Subscribed!
                </Button>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">
                  Thanks for Subscribing! 🎉
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Your free beat is ready for download.
                </p>
              </div>
              <Button
                onClick={handleDownload}
                className="w-full h-11 bg-[var(--primary)] hover:bg-blue-600 text-[var(--primary-foreground)]"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Free Beat
              </Button>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
import React, { useState } from "react";
import { Lead } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Download, Loader2 } from "lucide-react";

export default function EmailCollectorModal({ isOpen, onClose, beat, onDownloadSuccess }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await Lead.create({
        email: email,
        beat_id: beat.id,
        beat_title: beat.title
      });
      
      window.open(beat.audio_url, '_blank');
      
      onDownloadSuccess();
      onClose();

    } catch (err) {
      console.error("Failed to save lead:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open) => {
    if (!open) {
      onClose();
      setEmail("");
      setError("");
      setLoading(false);
    }
  };

  if (!beat) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-[var(--surface)] border-[var(--border)] text-[var(--text-primary)] max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold tracking-tight">Get Your Beat</DialogTitle>
          <DialogDescription className="text-[var(--text-secondary)]">
            Enter your email to get a free download of "{beat.title}".
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleDownload} className="space-y-4 py-4">
          <Input
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 bg-gray-100 border-[var(--border)]"
            disabled={loading}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[var(--primary)] hover:bg-blue-600 text-[var(--primary-foreground)]"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Download Free
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
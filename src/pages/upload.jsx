
import React, { useState } from "react";
import { Beat } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload as UploadIcon, CheckCircle, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { getRandomCoverArt } from "../components/utils/randomCoverArts"; // Changed import path

import BulkUploadZone from "../components/upload/BulkUploadZone";

const UPLOAD_PASSWORD = "SEMPER123";

export default function Upload() {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  
  // Password protection state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === UPLOAD_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password");
      setPasswordInput("");
    }
  };

  const handleFilesUpdate = (files) => {
    setSelectedFiles(files);
  };
  
  const uploadSingleBeat = async (fileData) => {
    // 1. Upload audio file
    const audioUpload = await UploadFile({ file: fileData.audioFile });
    
    // 2. Upload cover art if it exists, otherwise pick a random one
    let coverArtUrl = fileData.cover_art_url || null; // Use URL from input if present
    if (fileData.imageFile) {
      const imageUpload = await UploadFile({ file: fileData.imageFile });
      coverArtUrl = imageUpload.file_url;
    } else if (!coverArtUrl) {
      // If no image file and no URL is provided, pick a random one
      coverArtUrl = getRandomCoverArt();
    }

    // 3. Create Beat record in database
    await Beat.create({
      title: fileData.title,
      audio_url: audioUpload.file_url,
      cover_art_url: coverArtUrl,
      artist: fileData.artist,
      genre: fileData.genre,
      bpm: fileData.bpm,
      key: fileData.key,
      lease_price: fileData.lease_price,
      unlimited_price: fileData.unlimited_price,
      exclusive_price: fileData.exclusive_price,
      tags: fileData.tags
    });
  };

  const uploadAllBeats = async () => {
    setUploading(true);
    setUploadProgress(0);

    for (let i = 0; i < selectedFiles.length; i++) {
      try {
        await uploadSingleBeat(selectedFiles[i]);
        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      } catch (error) {
        console.error(`Error uploading beat ${selectedFiles[i].title}:`, error);
        // Optionally, add some error state handling for individual files
      }
    }

    setUploading(false);
    setUploadComplete(true);
    
    setTimeout(() => {
        navigate(createPageUrl("Browse"));
    }, 2500);
  };

  // Show password form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-700 w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Protected Area</CardTitle>
            <p className="text-gray-400">Enter password to access the upload page</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                autoFocus
              />
              {passwordError && (
                <p className="text-red-400 text-sm">{passwordError}</p>
              )}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Access Upload Page
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(createPageUrl("Browse"))}
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Back to Browse
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Browse"))}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Upload Beats</h1>
            <p className="text-gray-400">Add your beats to the marketplace</p>
          </div>
        </div>

        {/* Main Content */}
        {!uploading && !uploadComplete && (
          <BulkUploadZone onFilesUpdate={handleFilesUpdate} />
        )}

        {/* Action Buttons */}
        {selectedFiles.length > 0 && !uploading && !uploadComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between mt-8"
            >
                <Button
                    variant="outline"
                    onClick={() => setSelectedFiles([])}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                    Start Over
                </Button>
                <Button
                    onClick={uploadAllBeats}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    <UploadIcon className="w-4 h-4 mr-2" />
                    Upload {selectedFiles.length} {selectedFiles.length === 1 ? 'Beat' : 'Beats'}
                </Button>
            </motion.div>
        )}

        {/* Upload Progress */}
        <AnimatePresence>
          {uploading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="bg-gray-800 border-gray-700 mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <UploadIcon className="w-5 h-5 animate-pulse" />
                    Uploading Beats...
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress value={uploadProgress} className="h-3" />
                    <p className="text-center text-gray-400">
                      {Math.round(uploadProgress)}% complete
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {uploadComplete && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="bg-green-500/10 border-green-500/20 mt-8">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-white mb-2">
                    Upload Complete!
                  </h2>
                  <p className="text-gray-300 mb-4">
                    Your beats have been successfully added to the marketplace.
                  </p>
                  <Button
                    onClick={() => navigate(createPageUrl("Browse"))}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    View Your Beats
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

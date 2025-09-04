import React, { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon, Music, Image } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EditableBeatRow from './EditableBeatRow';

export default function BulkUploadZone({ onFilesUpdate, maxFiles = 20 }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, [selectedFiles]);

  const processFiles = (fileList) => {
    const audioFiles = Array.from(fileList).filter(file => file.type.startsWith('audio/'));
    const imageFiles = Array.from(fileList).filter(file => file.type.startsWith('image/'));
    
    const newFiles = audioFiles.map(audioFile => {
      const baseName = audioFile.name.replace(/\.[^/.]+$/, "");
      const matchingImage = imageFiles.find(img => 
        img.name.toLowerCase().includes(baseName.toLowerCase()) ||
        baseName.toLowerCase().includes(img.name.replace(/\.[^/.]+$/, "").toLowerCase())
      );

      return {
        id: Date.now() + Math.random(),
        audioFile,
        imageFile: matchingImage || null,
        title: baseName,
        artist: 'RoyaltyFreeBeats',
        genre: 'hip-hop',
        bpm: 120,
        key: '',
        lease_price: 20,
        unlimited_price: 150,
        exclusive_price: 500,
        tags: [],
        cover_art_url: ''
      };
    });

    const combinedFiles = [...selectedFiles, ...newFiles].slice(0, maxFiles);
    setSelectedFiles(combinedFiles);
    onFilesUpdate(combinedFiles);
  };

  const handleFileSelect = (e) => {
    processFiles(e.target.files);
    e.target.value = null; // Reset input to allow re-selecting same files
  };
  
  const updateFileData = (fileId, updatedData) => {
    const updatedFiles = selectedFiles.map(file => 
      file.id === fileId ? { ...file, ...updatedData } : file
    );
    setSelectedFiles(updatedFiles);
    onFilesUpdate(updatedFiles);
  };
  
  const addCoverArt = (e, fileId) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
        updateFileData(fileId, { imageFile });
    }
    e.target.value = null; // Reset
  };

  const removeFile = (fileId) => {
    const updatedFiles = selectedFiles.filter(f => f.id !== fileId);
    setSelectedFiles(updatedFiles);
    onFilesUpdate(updatedFiles);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <UploadIcon className="w-5 h-5" />
              <span>Select Your Beats</span>
            </div>
            <span className="text-sm font-normal text-gray-400">
              {selectedFiles.length} / {maxFiles} files
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              dragActive 
                ? "border-blue-400 bg-blue-500/10" 
                : "border-gray-600 hover:border-gray-500"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="audio/*,image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
              <Music className="w-8 h-8 text-blue-400" />
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-2">
              Drop your beats & covers here
            </h3>
            <p className="text-gray-400 mb-4">
              Or click to browse your files
            </p>
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={selectedFiles.length >= maxFiles}
            >
              <Music className="w-4 h-4 mr-2" />
              Select Files
            </Button>
            
            <p className="text-xs text-gray-500 mt-4">
              Matching audio and image files by name will be auto-paired.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Selected Files Editor */}
      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {selectedFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                layout
              >
                <EditableBeatRow
                  file={file}
                  onUpdate={updateFileData}
                  onRemove={removeFile}
                  onAddCover={addCoverArt}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
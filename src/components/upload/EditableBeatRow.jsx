
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Music, Image, X, CheckCircle } from "lucide-react";

export default function EditableBeatRow({ file, onUpdate, onRemove, onAddCover }) {
  const genres = ["hip-hop", "trap", "drill", "rnb", "pop", "ambient", "rock", "jazz", "boom-bap", "other"];

  const handleFieldChange = (field, value) => {
    onUpdate(file.id, { [field]: value });
  };
  
  const handlePriceChange = (field, value) => {
    const price = parseFloat(value);
    onUpdate(file.id, { [field]: isNaN(price) ? 0 : price });
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
      <div className="flex items-start gap-4">
        {/* Cover & Title */}
        <div className="flex items-center gap-3 flex-1">
          {file.imageFile ? (
            <img
              src={URL.createObjectURL(file.imageFile)}
              alt="Cover"
              className="w-16 h-16 rounded object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-600 rounded flex items-center justify-center">
              <Music className="w-6 h-6 text-gray-400" />
            </div>
          )}
          <div className="flex-1 space-y-1">
            <Input
              type="text"
              value={file.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="bg-gray-800 text-white font-medium border-gray-600 focus:border-blue-400 outline-none text-base"
              placeholder="Beat Title"
            />
            <p className="text-xs text-gray-400 pl-1">{file.audioFile.name}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
           <input
              type="file"
              accept="image/*"
              onChange={(e) => onAddCover(e, file.id)}
              className="hidden"
              id={`image-${file.id}`}
            />
            <label htmlFor={`image-${file.id}`} className="w-full">
              <Button size="sm" variant="outline" asChild className="cursor-pointer border-gray-500 text-gray-300 w-full">
                <span>
                  <Image className="w-4 h-4 mr-2"/>
                  {file.imageFile ? 'Change' : 'Add'} Cover
                </span>
              </Button>
            </label>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onRemove(file.id)}
            className="bg-red-500/20 text-red-400 hover:bg-red-500/40"
          >
            <X className="w-4 h-4 mr-2" />
            Remove
          </Button>
        </div>
      </div>

      {/* Editable Fields */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* Genre */}
        <div className="space-y-1">
            <label className="text-xs text-gray-400 pl-1">Genre</label>
            <Select 
                value={file.genre || 'hip-hop'} 
                onValueChange={(value) => handleFieldChange('genre', value)}
            >
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white text-xs">
                    <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                    {genres.map((g) => (
                    <SelectItem key={g} value={g} className="text-white hover:bg-gray-600 text-xs">
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        {/* BPM */}
        <div className="space-y-1">
            <label className="text-xs text-gray-400 pl-1">BPM</label>
            <Input
                type="number"
                value={file.bpm}
                onChange={(e) => handleFieldChange('bpm', parseInt(e.target.value))}
                className="bg-gray-800 border-gray-600 text-white text-xs"
                placeholder="120"
            />
        </div>

        {/* Key */}
        <div className="space-y-1">
            <label className="text-xs text-gray-400 pl-1">Key</label>
            <Input
                type="text"
                value={file.key}
                onChange={(e) => handleFieldChange('key', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white text-xs"
                placeholder="C Major"
            />
        </div>
        
        {/* Lease Price */}
        <div className="space-y-1">
            <label className="text-xs text-gray-400 pl-1">Lease ($)</label>
            <Input
                type="number"
                value={file.lease_price}
                onChange={(e) => handlePriceChange('lease_price', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white text-xs"
            />
        </div>
        
        {/* Unlimited Price */}
        <div className="space-y-1">
            <label className="text-xs text-gray-400 pl-1">Unlimited ($)</label>
            <Input
                type="number"
                value={file.unlimited_price}
                onChange={(e) => handlePriceChange('unlimited_price', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white text-xs"
            />
        </div>
        
        {/* Exclusive Price */}
        <div className="space-y-1">
            <label className="text-xs text-gray-400 pl-1">Exclusive ($)</label>
            <Input
                type="number"
                value={file.exclusive_price}
                onChange={(e) => handlePriceChange('exclusive_price', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white text-xs"
            />
        </div>

      </div>
    </div>
  );
}

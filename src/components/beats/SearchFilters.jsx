import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchFilters({ searchTerm, onSearchChange }) {
  return (
    <div className="w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] w-5 h-5" />
        <Input
          placeholder="Search for beats..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 pr-4 py-3 h-12 bg-[var(--surface)] border-2 border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-0 w-full rounded-full text-base"
        />
      </div>
    </div>
  );
}
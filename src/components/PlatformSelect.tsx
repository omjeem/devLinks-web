"use client";

import { useState } from "react";
import { ChevronDown, Github, Youtube, Linkedin } from "lucide-react";
import { PLATEFORMS } from "@/lib/utils";

interface PlatformSelectProps {
  value: string;
  onChange: (value: string) => void;
}



export default function PlatformSelect({
  value,
  onChange,
}: PlatformSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedPlatform = PLATEFORMS.find((p) => p.value === value);
  const SelectedIcon = selectedPlatform?.icon;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white text-sm"
      >
        <div className="flex items-center gap-3">
          {SelectedIcon && <SelectedIcon className="w-4 h-4 text-gray-600" />}
          <span className="text-gray-900">{selectedPlatform?.label}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {PLATEFORMS.map((platform) => {
            const Icon = platform.icon;
            return (
              <button
                key={platform.value}
                type="button"
                onClick={() => {
                  onChange(platform.value);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 text-left text-sm border-b border-gray-100 last:border-b-0"
              >
                <Icon className="w-4 h-4 text-gray-600" />
                <span className="text-gray-900">{platform.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

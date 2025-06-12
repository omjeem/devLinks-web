"use client";

import { GripVertical, Link as LinkIcon } from "lucide-react";
import PlatformSelect from "./PlatformSelect";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link, platformExampleUrlMap } from "@/lib/utils";
import toast from "react-hot-toast";

interface LinkItemProps {
  link: Link;
  index: number;
  onRemove: () => void;
  onUpdate: (field: "field" | "value", value: string) => void;
}

export default function LinkItem({
  link,
  index,
  onRemove,
  onUpdate,
}: LinkItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gray-50 rounded-xl p-5 ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-gray-500">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing hover:text-gray-700 transition-colors"
          >
            <GripVertical className="w-4 h-4" />
          </div>
          <span className="font-bold text-base">Link #{index + 1}</span>
        </div>
        <button
          onClick={onRemove}
          className="text-gray-500 hover:text-red-600 transition-colors text-sm"
        >
          Remove
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-900 mb-1">
            Platform
          </label>
          <PlatformSelect
            value={link.field}
            onChange={(value) => onUpdate("field", value)}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-900 mb-1">
            Link
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="url"
              value={link.value}
              onChange={(e) => {
                if (link.id.startsWith("random"))
                  onUpdate("value", e.target.value)
                else toast.error("Cannot edit the saved links")
              }}
              placeholder={platformExampleUrlMap[link.field]}
              className={`w-full pl-10 pr-3 py-3 border ${link.error ? "border-red-300" : "border-purple-300"}  rounded-lg focus:outline-none focus:ring-2 
               ${link.error ? "focus:ring-red-600" : "focus:ring-purple-600"} focus:border-transparent text-sm`}
            />
          </div>
          {
            link.error ? <span className="ms-10 text-xs text-red-500">{link.error}</span> : null
          }
        </div>
      </div>
    </div>
  );
}

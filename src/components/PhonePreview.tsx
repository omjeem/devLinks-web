"use client"
import { Link, platformConfig } from "@/lib/utils";
import { Github, Youtube, Linkedin, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";



interface PhonePreviewProps {
  links: Link[];
}

export default function PhonePreview({ links = [] }: PhonePreviewProps) {
  return (
    <div className="flex justify-center">
      <div className="relative">
        {/* Outer Phone Frame */}
        <div className="w-[307px] h-[631px] rounded-[45px] border-[2px] border-gray-400 bg-white relative">
          {/* Inner Screen Frame with Notch */}
          <div
            style={{
              clipPath:
                "polygon(33.24% 1.66%, 66.57% 1.51%, 67.6% 0px, 100% 0px, 100% 100%, 0px 100%, 0px 0px, 32.55% 0px)",
              // clipPath:
              //   "polygon(0% 0%, 38% 0%, 38% 4%, 40% 7%, 60% 7%, 62% 4%, 62% 0%, 100% 0%, 100% 100%, 0% 100%)",
            }}
            className="absolute bg-gray-50 top-[12px] left-[12px] right-[12px] bottom-[12px] rounded-[33px] border-[1.5px] border-gray-400  overflow-hidden"
          >
            {/* Notch - carved out of the inner frame */}
            <div className="absolute top-[-1.5px] left-1/2 transform -translate-x-1/2 w-[100px] h-[20px] bg-white border-[1.5px] border-gray-400 border-t-0 rounded-b-[12px]"></div>

            {/* Screen Content */}
            <div className="pt-[45px] pb-6 px-5 h-full flex flex-col">
              {/* Profile Section */}
              <div className="flex flex-col items-center mb-[50px]">
                <div className="w-[80px] h-[80px] bg-gray-300 rounded-full mb-5"></div>
                <div className="w-[160px] h-[12px] bg-gray-300 rounded-full mb-2"></div>
                <div className="w-[80px] h-[10px] bg-gray-300 rounded-full"></div>
              </div>

              {/* Links Section */}
              <div className="space-y-3 overflow-y-auto max-h-70 hide-scrollbar">
                {links.map((link) => {
                  const config =
                    platformConfig[
                    link.field as keyof typeof platformConfig
                    ];
                  const Icon = config?.icon;
                  return (
                    <div
                      key={link.id}
                      onClick={() => {
                        try {
                          const url = new URL(link.value);
                          window.open(url.toString(), '_blank');
                        } catch (e) {
                          toast.error("Invalid Url")
                          console.error('Invalid URL:', link.value);
                        }
                      }}
                      className={`w-full h-[44px] rounded-[8px] flex items-center justify-between px-4 ${config?.bgColor || "bg-gray-300"} ${config?.textColor || "text-gray-700"}`}
                    >
                      <div className="flex items-center gap-2">
                        {Icon && <Icon className="w-4 h-4" />}
                        <span className="text-sm font-medium">
                          {link.field}
                        </span>
                      </div>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  );
                })}

                {/* Empty placeholders */}
                {Array.from({ length: Math.max(0, 5 - links.length) }).map(
                  (_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="w-full h-[44px] bg-gray-300 rounded-[8px]"
                    />
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

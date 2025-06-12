"use client";

import { use, useEffect, useState } from "react";
import { Link2, User, Eye, Copy } from "lucide-react";
import { envConfig } from "@/lib/utils";
import toast from "react-hot-toast";

export default function Header({ isPreview, setIsPreview }: { isPreview: boolean, setIsPreview: any }) {
  const [activeTab, setActiveTab] = useState("links");
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [username, setUsername] = useState("")
  const [hovered, setHovered] = useState(false);
  const [link, setLink] = useState("")

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };
  useEffect(() => {
    const user = JSON.parse(String(localStorage.getItem("user")))
    console.log("User dta a>>> ", user)
    if (!user) {
      setIsLoggedIn(false)
    } else {
      setUsername(user.userName)
    }
  }, [])

  useEffect(() => {
    console.log("User name is ", username)
    setLink(`${envConfig.frontendUrl}/link/${username}`)
  }, [username])

  console.log("Link is ", username)
  console.log("link is >>>>>>>>> ", link)

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {
          isLoggedIn ? (
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">devlinks</span>
              </div>

              {/* Navigation */}

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab("links")}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "links"
                    ? "bg-purple-50 text-purple-600"
                    : "text-gray-500 hover:text-purple-600"
                    }`}
                >
                  <Link2 className="w-4 h-4" />
                  Links
                </button>
                {/* <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "profile"
                    ? "bg-purple-50 text-purple-600"
                    : "text-gray-500 hover:text-purple-600"
                    }`}
                >
                  <User className="w-4 h-4" />
                  Profile Details
                </button> */}
                <button
                  onClick={handleCopy}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  className="flex items-center gap-2 px-4 py-2.5 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors relative"
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
                  {hovered && (
                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-xs bg-gray-100 text-gray-700 border border-gray-300 px-2 py-1 rounded shadow">
                      {link}
                    </span>
                  )}
                </button>
              </div>

              <a
                onClick={() => setIsPreview(!isPreview)}
                className="flex cursor-pointer items-center gap-2 px-4 py-2.5 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                {isPreview ? "Edit" : "Preview"}
              </a>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">devlinks</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="#sign-in"
                  className="flex items-center gap-2 px-4 py-2.5 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  Sign In
                </a>
                <a
                  href="#sign-up"
                  className="flex items-center gap-2 px-4 py-2.5 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  Sign Up
                </a>
              </div>
            </div>
          )
        }

      </div>
    </header>
  );
}

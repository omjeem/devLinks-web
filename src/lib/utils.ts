import { clsx, type ClassValue } from "clsx"
import { Facebook, Github, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const envConfig = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL,
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    redirectUrl: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL
  }
}

export interface Link {
  id: string;
  field: MEDIA_PLATEFORM;
  value: string;
  error: string
}

export enum PageType {
  SIGNIN = "SIGNIN",
  SIGNUP = "SIGNUP",
  LINKS = "LINKS"
}

export enum MEDIA_PLATEFORM {
  Github = "Github",
  Youtube = "Youtube",
  Linkedin = "Linkedin",
  Facebook = "Facebook",
  Twitter = "Twitter",
  Instagram = "Instagram",
}
export const PLATEFORMS = [
  { value: MEDIA_PLATEFORM.Github, label: MEDIA_PLATEFORM.Github, icon: Github },
  { value: MEDIA_PLATEFORM.Youtube, label: MEDIA_PLATEFORM.Youtube, icon: Youtube },
  { value: MEDIA_PLATEFORM.Linkedin, label: MEDIA_PLATEFORM.Linkedin, icon: Linkedin },
  { value: MEDIA_PLATEFORM.Facebook, label: MEDIA_PLATEFORM.Facebook, icon: Facebook },
  { value: MEDIA_PLATEFORM.Twitter, label: MEDIA_PLATEFORM.Twitter, icon: Twitter },
  { value: MEDIA_PLATEFORM.Instagram, label: MEDIA_PLATEFORM.Instagram, icon: Instagram },
];

export const platformRegexMap: Record<string, RegExp> = {
  [MEDIA_PLATEFORM.Github]: /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/,
  [MEDIA_PLATEFORM.Youtube]: /^https:\/\/(www\.)?youtube\.com\/(channel|c|user)\/[A-Za-z0-9_-]+\/?$/,
  [MEDIA_PLATEFORM.Linkedin]: /^https:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?$/,
  [MEDIA_PLATEFORM.Facebook]: /^https:\/\/(www\.)?facebook\.com\/[A-Za-z0-9_.-]+\/?$/,
  [MEDIA_PLATEFORM.Twitter]: /^https:\/\/(www\.)?twitter\.com\/[A-Za-z0-9_]+\/?$/,
  [MEDIA_PLATEFORM.Instagram]: /^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.]+\/?$/,
};

export const platformExampleUrlMap: Record<MEDIA_PLATEFORM, string> = {
  [MEDIA_PLATEFORM.Github]: "https://github.com/username",
  [MEDIA_PLATEFORM.Youtube]: "https://youtube.com/channel/UC1234567",
  [MEDIA_PLATEFORM.Linkedin]: "https://www.linkedin.com/in/username",
  [MEDIA_PLATEFORM.Facebook]: "https://www.facebook.com/username",
  [MEDIA_PLATEFORM.Twitter]: "https://twitter.com/username",
  [MEDIA_PLATEFORM.Instagram]: "https://instagram.com/username",
};

export const platformConfig = {
  [MEDIA_PLATEFORM.Github]: {
    icon: Github,
    bgColor: "bg-gray-900",
    textColor: "text-white",
  },
  [MEDIA_PLATEFORM.Youtube]: {
    icon: Youtube,
    bgColor: "bg-red-500",
    textColor: "text-white",
  },
  [MEDIA_PLATEFORM.Linkedin]: {
    icon: Linkedin,
    bgColor: "bg-blue-600",
    textColor: "text-white",
  },
  [MEDIA_PLATEFORM.Facebook]: {
    icon: Facebook,
    bgColor: "bg-blue-700",
    textColor: "text-white",
  },
  [MEDIA_PLATEFORM.Twitter]: {
    icon: Twitter,
    bgColor: "bg-blue-400",
    textColor: "text-white",
  },
  [MEDIA_PLATEFORM.Instagram]: {
    icon: Instagram,
    bgColor: "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600",
    textColor: "text-white",
  },
};

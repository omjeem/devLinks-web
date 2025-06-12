"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Link, envConfig } from "@/lib/utils";
import toast from "react-hot-toast";
import axios from "axios";
import PhonePreview from "@/components/PhonePreview";

export default function PreviewPage() {
    const { username } = useParams() as { username: string };
    const [links, setLinks] = useState<Link[]>([]);

    const fetchUserLinks = async () => {
        try {
            const response = await axios.get(`${envConfig.backendUrl}/link/${username}`);
            setLinks(response.data.data.links);
        } catch (error: any) {
            const message = error?.response?.data?.error || "Error while fetching links";
            toast.error(message);
        }
    };

    useEffect(() => {
        if (username) fetchUserLinks();
    }, [username]);

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            <div className="flex-1 w-full flex max-sm:flex-col-reverse gap-6 p-6 max-w-[98vw] sm:max-w-[80vw] mx-auto scroll-smooth">
                <div className="w-full bg-white grid place-items-center">
                    <div className="sticky top-6" id="phone-preview">
                        <PhonePreview links={links} />
                    </div>
                </div>
            </div>
        </div>
    );
}

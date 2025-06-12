"use client"
import { envConfig } from "@/lib/utils";
import axios from "axios";
import { useState, useEffect } from "react";

export default function GoogleCallback() {
    const [status, setStatus] = useState("loading"); // "loading", "success", "error"
    const [message, setMessage] = useState("");

    useEffect(()=>{
        if(status === "success"){
            setTimeout(()=>{
                window.location.href = "/"
            }, 2000 )
        }
    }, [status])

    useEffect(() => {
        const handleGoogleCallback = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const code = urlParams.get('code');
                const error = urlParams.get('error');

                if (error) {
                    setStatus("error");
                    setMessage("Google authentication was cancelled or failed.");
                    return;
                }

                if (!code) {
                    setStatus("error");
                    setMessage("No authorization code received from Google.");
                    return;
                }

                const response = await axios.get(`${envConfig.backendUrl}/auth/google?code=${code}`);

                const responseData = response.data

                setStatus("success");
                setMessage("Authentication successful! Redirecting...");
                localStorage.setItem("user", JSON.stringify(responseData.data))
            } catch (error: any) {
                console.error('Google callback error:', error);
                const message = error?.response?.data?.error || "Network error occurred. Please try again."
                setStatus("error");
                setMessage(message);
            }
        };

        handleGoogleCallback();
    }, []);

    const handleRetry = () => {
        window.location.href = '/auth'; // Redirect back to auth page
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                {status === "loading" && (
                    <>
                        <div className="mb-6">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Authenticating...
                        </h2>
                        <p className="text-gray-600">
                            Please wait while we complete your Google sign-in.
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="mb-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Authentication Successful!
                        </h2>
                        <p className="text-gray-600 mb-4">
                            {message}
                        </p>
                        <div className="inline-block animate-pulse">
                            <div className="flex items-center text-purple-600">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                                Redirecting to your dashboard...
                            </div>
                        </div>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="mb-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Authentication Failed
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {message}
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={handleRetry}
                                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                Go to Homepage
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
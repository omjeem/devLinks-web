import { envConfig } from "@/lib/utils";
import axios from "axios";
import { useState } from "react";

// Define PageType enum
export enum PageType {
    SIGNIN = "SIGNIN",
    SIGNUP = "SIGNUP",
    LINKS = "LINKS"
}

export default function AuthPage({
    pageType,
    setPageType,
    isLoggedIn,
    setIsLoggedIn
}:
    {
        pageType: PageType,
        setPageType: (type: PageType) => void,
        isLoggedIn: boolean,
        setIsLoggedIn: any
    }
) {
    const [form, setForm] = useState({
        name: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [otpStep, setOtpStep] = useState(false);
    const [otp, setOtp] = useState("");
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [loginMethod, setLoginMethod] = useState("email");

    const handleInputChange = (field: string, value: string) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }));
        setError("");
    };

    const validateForm = () => {
        if (pageType === PageType.SIGNUP) {
            if (!form.name.trim()) {
                setError("Name is required");
                return false;
            }
            if (!form.userName.trim()) {
                setError("Username is required");
                return false;
            }
            if (!form.email.trim()) {
                setError("Email is required");
                return false;
            }
            if (!form.password) {
                setError("Password is required");
                return false;
            }
            if (form.password !== form.confirmPassword) {
                setError("Passwords do not match");
                return false;
            }
        } else {
            if (loginMethod === "email" && !form.email.trim()) {
                setError("Email is required");
                return false;
            }
            if (loginMethod === "email" && !form.password) {
                setError("Password is required");
                return false;
            }
            if (loginMethod === "otp" && !form.email.trim()) {
                setError("Email is required for OTP login");
                return false;
            }
        }
        return true;
    };

    const handleSignUp = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            console.log("Env config >> ", envConfig, process.env.NEXT_PUBLIC_BACKEND_URL)
            // Mock API call for signup
            const response = await axios.post(`${envConfig.backendUrl}/auth/register`, form, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = response.data
            console.log("Response data os ?>> ", data)

            if (response.status) {
                // Store token from response.data.data
                setToken(data.data);
                setOtpStep(true);
                setError("");
            }
        } catch (err: any) {
            console.log("Error is >>>", err.response)
            const message = err?.response?.data?.error || "There is some error"
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            let endpoint = '/auth/login';
            let body = {};

            if (loginMethod === "email") {
                body = {
                    email: form.email,
                    password: form.password
                };
            } else if (loginMethod === "otp") {
                endpoint = `/auth/get-otp`;
                body = {
                    email: form.email
                };
            }

            const response = await axios.post(`${envConfig.backendUrl}${endpoint}`, body, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const responseData = response.data

            if (loginMethod === "otp") {
                setToken(responseData.data);
                setOtpStep(true);
            } else {
                console.log("Responsedata is ", responseData)
                localStorage.setItem('user', JSON.stringify(responseData.data));
                setPageType(PageType.LINKS);
                setIsLoggedIn(true)
            }
            setError("");
        } catch (err: any) {
            const message = err?.response?.data?.error || "Network error occurred"
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            // Mock Google OAuth flow
            window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${envConfig.google.redirectUrl}&client_id=${envConfig.google.clientId}&access_type=offline&response_type=code&prompt=consent&scope=https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/userinfo.email`;
        } catch (err) {
            setError("Google login failed");
            setLoading(false);
        }
    };

    const handleOtpVerification = async () => {
        if (!otp.trim()) {
            setError("Please enter OTP");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${envConfig.backendUrl}/auth/verify-otp`, {
                otp, token
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data
            console.log("Data from otp validation", data)

            localStorage.setItem('user', JSON.stringify(data.data));
            setPageType(PageType.LINKS);
            setIsLoggedIn(true)
            setError("");

        } catch (err: any) {
            console.log("Error in otp  >>>", err.response)
            const message = err?.response?.data?.error || "There is some error"
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        setError("")
        console.log("otp setp , ", otpStep, "Login method >>> ", loginMethod)
        if (otpStep) {
            handleOtpVerification();
        } else if (pageType === PageType.SIGNUP) {
            handleSignUp();
        } else {
            if (loginMethod === "google") {
                handleGoogleLogin();
            } else {
                console.log("Inseide >>>>>>>>>>>>>>>")
                handleSignIn();
            }
        }
    };

    if (otpStep) {
        return (
            <div className="bg-white rounded-xl p-10 flex-1 flex flex-col">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Verify Your Email
                    </h1>
                    <div className="text-sm text-gray-700">
                        We've sent a verification code to <strong>{form.email}</strong>. Please enter it below. If you don't see it, please check your spam or junk folder.
                    </div>

                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block font-medium text-gray-900 mb-1">
                            Enter OTP
                        </label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter 6-digit code"
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                            maxLength={6}
                        />
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6 mt-auto">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                    <button
                        onClick={() => {
                            setOtpStep(false);
                            setOtp("");
                            setToken("");
                        }}
                        className="w-full py-2 mt-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        Back to {pageType === PageType.SIGNUP ? "Sign Up" : "Sign In"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-10 flex-1 flex flex-col">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {pageType === PageType.SIGNIN
                        ? 'Sign in to your account'
                        : 'Create your account'
                    }
                </h1>
                <p className="text-gray-500">
                    {pageType === PageType.SIGNIN
                        ? 'Welcome back! Please sign in to access your links.'
                        : 'Join us today and start creating amazing link collections!'
                    }
                </p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {pageType === PageType.SIGNIN && (
                <div className="mb-6">
                    <div className="flex rounded-lg border border-gray-300 p-1">
                        <button
                            onClick={() => setLoginMethod("email")}
                            className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${loginMethod === "email"
                                ? "bg-purple-600 text-white"
                                : "text-gray-600 hover:text-gray-800"
                                }`}
                        >
                            Email & Password
                        </button>
                        <button
                            onClick={() => setLoginMethod("otp")}
                            className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${loginMethod === "otp"
                                ? "bg-purple-600 text-white"
                                : "text-gray-600 hover:text-gray-800"
                                }`}
                        >
                            Email & OTP
                        </button>
                        <button
                            onClick={() => setLoginMethod("google")}
                            className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${loginMethod === "google"
                                ? "bg-purple-600 text-white"
                                : "text-gray-600 hover:text-gray-800"
                                }`}
                        >
                            Google
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {pageType === PageType.SIGNUP && (
                    <>
                        <div>
                            <label className="block font-medium text-gray-900 mb-1">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                placeholder="Enter your full name"
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-gray-900 mb-1">
                                Username *
                            </label>
                            <input
                                type="text"
                                value={form.userName}
                                onChange={(e) =>
                                    handleInputChange("userName", e.target.value.replace(/\s+/g, '-'))
                                }
                                placeholder="Choose a unique username"
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                            />
                        </div>

                    </>
                )}

                {loginMethod !== "google" && (
                    <div>
                        <label className="block font-medium text-gray-900 mb-1">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="Enter your email address"
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                        />
                    </div>
                )}

                {(pageType === PageType.SIGNUP || loginMethod === "email") && (
                    <div>
                        <label className="block font-medium text-gray-900 mb-1">
                            Password *
                        </label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            placeholder="Enter your password"
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                        />
                    </div>
                )}

                {pageType === PageType.SIGNUP && (
                    <div>
                        <label className="block font-medium text-gray-900 mb-1">
                            Confirm Password *
                        </label>
                        <input
                            type="password"
                            value={form.confirmPassword}
                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                            placeholder="Confirm your password"
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                        />
                    </div>
                )}
            </div>

            <div className="border-t border-gray-200 pt-6 mt-auto space-y-4">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
                >
                    {loading
                        ? (pageType === PageType.SIGNUP ? "Creating Account..." : "Signing In...")
                        : (pageType === PageType.SIGNUP ? "Create Account" :
                            loginMethod === "google" ? "Continue with Google" :
                                loginMethod === "otp" ? "Send OTP" : "Sign In")
                    }
                </button>

                <div className="text-center">
                    <span className="text-gray-600">
                        {pageType === PageType.SIGNUP ? "Already have an account? " : "Don't have an account? "}
                    </span>
                    <button
                        onClick={() => setPageType(pageType === PageType.SIGNUP ? PageType.SIGNIN : PageType.SIGNUP)}
                        className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                        {pageType === PageType.SIGNUP ? "Sign In" : "Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    );
}
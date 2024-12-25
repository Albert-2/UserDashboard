"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { signUp } from "../../firebase/authFunctions";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Signin: React.FC = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const router = useRouter();
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                const username = currentUser.email?.split("@")[0];
                if (username) {
                    router.replace(`/dashboard/${username}`);
                }
            }
        });
        return () => unsubscribe();
    }, [router]);
    const handleRedirect = () => {
        router.push("/login");
    };
    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSignUp = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await signUp(email, password);
            const username = email.split("@")[0];
            router.push(`/dashboard/${username}`);
        } catch (err: any) {
            if (err.code === "auth/email-already-in-use") {
                setError("This email is already in use. Please use a different one.");
            } else if (err.code === "auth/weak-password") {
                setError("Password should be at least 6 characters.");
            } else if (err.code === "auth/invalid-email") {
                setError("Please enter a valid email address.");
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="h-[85vh] flex items-center">
            <div className="bg-white sm:w-96 w-[80%] mx-auto rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div className="p-4 sm:p-7">
                    <div className="text-center">
                        <h1 className="block text-2xl font-bold text-gray-800">Sign in</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Do you have an account?
                            <span

                                onClick={handleRedirect}
                                className="text-blue-600 decoration-2 font-medium cursor-pointer "
                            >
                                Log in here
                            </span>
                        </p>
                    </div>
                    <div className="mt-5">
                        <button
                            type="button"
                            className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-800"
                        >
                            <svg
                                className="w-4 h-auto"
                                width="46"
                                height="47"
                                viewBox="0 0 46 47"
                                fill="none"
                            >
                                <svg
                                    className="w-4 h-auto"
                                    width="46"
                                    height="47"
                                    viewBox="0 0 46 47"
                                    fill="none"
                                >
                                    <path
                                        d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
                                        fill="#EB4335"
                                    />
                                </svg>
                            </svg>
                            Continue with Google
                        </button>

                        <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-[1_1_0%] before:border-t before:border-gray-200 before:me-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ms-6 dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600">
                            Or
                        </div>

                        <form onSubmit={handleSignUp}>
                            <div className="grid gap-y-4">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm mb-2 dark:text-white font-bold"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        id="email"
                                        name="email"
                                        className="py-3 px-4 block w-full border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm mb-2 dark:text-white font-bold"
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            placeholder="Password"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            className="py-3 px-4 block w-full border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute inset-y-0 right-3 flex items-center"
                                        >
                                            <FontAwesomeIcon
                                                icon={showPassword ? faEyeSlash : faEye}
                                                className="w-5 h-5 text-gray-400 dark:text-gray-600"
                                            />
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="text-sm text-red-500 font-medium">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="p-3 inline-flex justify-center items-center gap-x-2 font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    Sign in
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signin;

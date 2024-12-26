"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { login } from "../../firebase/authFunctions";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setError, setLoading } from "../redux/authSlice";
import { RootState } from "../redux/store";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const router = useRouter();
    const dispatch = useDispatch();
    const { user, error, loading } = useSelector((state: RootState) => state.auth);
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


    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleLogIn = async (e: FormEvent) => {
        e.preventDefault();
        dispatch(setLoading(true));

        try {
            await login(email, password);
            const username = email.split("@")[0];
            dispatch(setUser({ email, username }));
            router.push(`/dashboard/${username}`);
        } catch (err: any) {
            dispatch(setError("Failed to log in. Please try again."));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleRedirectToSignup = () => {
        router.push("/signin");
    };

    if (user) {
        return null; 
    }

    return (
        <div className="h-[85vh] flex items-center">
            <div className="bg-white sm:w-96 w-[80%] mx-auto rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div className="p-4 sm:p-7">
                    <div className="text-center">
                        <h1 className="block text-2xl font-bold text-gray-800">Log in</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account yet?{" "}
                            <span
                                onClick={handleRedirectToSignup}
                                className="text-blue-600 decoration-2 font-medium cursor-pointer"
                            >
                                Sign up here
                            </span>
                        </p>
                    </div>
                    <div className="mt-5">
                        <button
                            type="button"
                            className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-800 font-semibold"
                        ><svg
                            className="w-4 h-auto"
                            width="46"
                            height="47"
                            viewBox="0 0 46 47"
                            fill="none"
                        >

                            </svg>
                            Continue with Google
                        </button>

                        <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-[1_1_0%] before:border-t before:border-gray-200 before:me-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ms-6 dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600">
                            Or
                        </div>

                        <form onSubmit={handleLogIn}>
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
                                    <div className="flex justify-between items-center">
                                        <label
                                            htmlFor="password"
                                            className="block text-sm mb-2 dark:text-white font-bold"
                                        >
                                            Password
                                        </label>
                                    </div>
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
                                            onClick={togglePasswordVisibility}
                                            type="button"
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
                                    disabled={loading}
                                >
                                    {loading ? "Logging in..." : "Log in"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

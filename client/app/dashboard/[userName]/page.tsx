"use client";

import { useParams, useRouter } from "next/navigation";
import { logout } from "../../../firebase/authFunctions";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "../../redux/authSlice";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const UserDashboard = () => {
    const { userName } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {

                router.push("/login");
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        try {
            await logout();
            dispatch(logoutAction());
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };


    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-lg">Loading...</div> 
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold">Welcome, {userName}!</h1>
            <p className="mt-4 text-xl">This is your personalized dashboard.</p>
            <button
                onClick={handleLogout}
                className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
            >
                Logout
            </button>
        </div>
    );
};

export default UserDashboard;

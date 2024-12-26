"use client";

import { useParams, useRouter } from "next/navigation";
import { logout } from "../../../firebase/authFunctions";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../../redux/authSlice";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const UserDashboard = () => {
    const { userName } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(true);
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [idToken, setIdToken] = useState<string>("");

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                router.push("/login");
            } else {
                const email = currentUser.email || "";
                setEmail(email);
                const defaultUsername = email.split("@")[0];
                setUsername(defaultUsername);
                const token = await currentUser.getIdToken();
                setIdToken(token);
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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        setFile(selectedFile);
    };

    const handleFileUpload = async () => {
        if (!file) {
            setUploadStatus("Please select a file to upload.");
            return;
        }

        try {
            console.log("Uploading file:", file.name);
            setTimeout(() => {
                setUploadStatus(`File "${file.name}" uploaded successfully!`);
                setFile(null);
            }, 2000);
        } catch (error) {
            setUploadStatus("Failed to upload file.");
            console.error("Upload error:", error);
        }
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
        const newUsername = event.target.value.split("@")[0];
        setUsername(newUsername);
    };

    const handleProfileUpdate = async () => {
        try {
            const response = await fetch("http://localhost:5000/auth/update-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    idToken,
                    updateData: {
                        email,
                        username,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            const data = await response.json();
            console.log(data.message);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
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
        <div className="h-screen p-6 flex flex-col items-center">
            <h1 className="text-3xl font-bold">Welcome, {userName}!</h1>
            <p className="mt-4 text-xl">This is your personalized dashboard.</p>

            <div className="mt-8 w-full max-w-md">
                <label className="block mb-2 text-lg font-medium">Email</label>
                <div className="flex gap-2 border-2 rounded-md">
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        className="block w-full border rounded px-3 py-2 border-none"
                    />
                    <button
                        onClick={handleProfileUpdate}
                        className="mx-2"
                    >
                        <FontAwesomeIcon icon={faEdit} size="lg" />
                    </button>
                </div>
            </div>

            <div className="mt-8 w-full max-w-md">
                <label className="block mb-2 text-lg font-medium">Username</label>
                <input
                    type="text"
                    value={username}
                    readOnly
                    className="block w-full border rounded px-3 py-2 bg-gray-200"
                />
                <p className="mt-2 text-sm text-gray-600">
                    The username is automatically derived from the email address.
                </p>
            </div>

            <div className="mt-8 w-full max-w-md">
                <label className="block mb-2 text-lg font-medium">Upload a File</label>
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="block w-full border rounded px-3 py-2"
                />
                <button
                    onClick={handleFileUpload}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                    Upload File
                </button>
                {uploadStatus && (
                    <p className="mt-2 text-sm text-gray-600">{uploadStatus}</p>
                )}
            </div>

            <button
                onClick={handleLogout}
                className="mt-10 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
            >
                Logout
            </button>
        </div>
    );
};

export default UserDashboard;

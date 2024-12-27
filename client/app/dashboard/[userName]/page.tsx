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
    // const [file, setFile] = useState<File | null>(null);
    // const [uploadStatus, setUploadStatus] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [idToken, setIdToken] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("John");
    const [lastName, setLastName] = useState<string>("Doe");
    const [about, setAbout] = useState<string>("This is your bio. You can tell others about yourself here.");
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                router.push("/login");
            } else {
                const email = currentUser.email || "";
                const defaultUsername = email.split("@")[0];
                if (userName !== defaultUsername) {
                    router.push(`/dashboard/${defaultUsername}`);
                    return;
                }
                setEmail(email);
                setUsername(defaultUsername);

                try {
                    const token = await currentUser.getIdToken();
                    setIdToken(token);
                    fetchUserDetails(email, token);
                } catch (error) {
                    console.error("Error fetching ID token: ", error);
                }
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);


    // Fetch user details from the backend
    const fetchUserDetails = async (email: string, token: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }, body: JSON.stringify({ idToken: token })
            });

            if (!response.ok) {
                throw new Error("Failed to fetch user details");
            }

            const data = await response.json();
            setFirstName(data.firstname);
            setLastName(data.lastname);
            setAbout(data.about);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            dispatch(logoutAction());
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const selectedFile = event.target.files ? event.target.files[0] : null;
    //     setFile(selectedFile);
    // };

    // const handleFileUpload = async () => {
    //     if (!file) {
    //         setUploadStatus("Please select a file to upload.");
    //         return;
    //     }

    //     try {
    //         setTimeout(() => {
    //             setUploadStatus(`File "${file.name}" uploaded successfully!`);
    //             setFile(null);
    //         }, 2000);
    //     } catch (error) {
    //         setUploadStatus("Failed to upload file.");
    //         console.error("Upload error:", error);
    //     }
    // };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
        const newUsername = event.target.value.split("@")[0];
        setUsername(newUsername);
    };

    const handleProfileUpdate = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/update-profile`, {
                method: "PUT",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    idToken,
                    updateData: {
                        email,
                        username,
                        firstname: firstName,
                        lastname: lastName,
                        about,
                    }
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            await response.json();
            alert("Profile updated successfully!");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        }
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-sm">Loading...</div>
            </div>
        );
    }

    return (
        <div className="h-screen p-6 flex flex-col items-center">
            <h1 className="text-3xl font-bold">Welcome, {userName}!</h1>
            <p className="mt-4 text-xl">This is your personalized dashboard.</p>

            <div className="mt-4 w-full max-w-md">
                <label className="block mb-2 text-sm font-medium">Email</label>
                <div className="flex gap-2 border-2 rounded-md">
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        className="block w-full border rounded px-3 py-2 border-none"
                        disabled={!isEditing}
                    />
                    <button
                        onClick={toggleEdit}
                        className="mx-2"
                    >
                        <FontAwesomeIcon icon={faEdit} size="lg" />
                    </button>
                </div>
            </div>

            <div className="mt-4 w-full max-w-md">
                <label className="block mb-2 text-sm font-medium">Username</label>
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

            <div className="mt-4 w-full max-w-md">
                <label className="block mb-2 text-sm font-medium">First Name</label>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="block w-full border rounded px-3 py-2"
                    disabled={!isEditing}
                />
            </div>

            <div className="mt-4 w-full max-w-md">
                <label className="block mb-2 text-sm font-medium">Last Name</label>
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="block w-full border rounded px-3 py-2"
                    disabled={!isEditing}
                />
            </div>

            <div className="mt-4 w-full max-w-md">
                <label className="block mb-2 text-sm font-medium">About</label>
                <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="block w-full border rounded px-3 py-2"
                    disabled={!isEditing}
                />
            </div>
            {/* <div className="mt-4 w-full max-w-md">
                <label className="block mb-2 text-sm font-medium">Upload a File</label>
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
            </div> */}

            <div className="mt-8 flex gap-4">
                {isEditing && (
                    <button
                        onClick={handleProfileUpdate}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                    >
                        Save Changes
                    </button>
                )}

                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default UserDashboard;

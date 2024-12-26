"use client";

import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to the User Dashboard</h1>
        <p
          className="cursor-pointer text-blue-600 hover:underline"
          onClick={handleRedirect}
        >
          Not logged in? Click here to log in.
        </p>
      </div>
    </div>
  );
}

import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

export default function Login() {
  const login = () => {
    signInWithPopup(auth, provider).catch((err) => alert(err.message));
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <button
        onClick={login}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg"
      >
        Sign in with Google
      </button>
    </div>
  );
}

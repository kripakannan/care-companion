import React from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
        const result = await signInWithPopup(auth, provider);
        console.log('✅ Logged in user:', result.user);

        navigate('/home');
        } catch (error) {
        console.error('❌ Login failed:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-6">Welcome to Care Companion</h1>
        <button
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
            onClick={handleLogin}
        >
            Sign in with Google
        </button>
        </div>
    );
}
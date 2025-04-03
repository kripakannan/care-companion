import React from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import './LoginPage.css';

export default function LoginPage() {
    const navigate = useNavigate();

    const ensureUserAccount = async (user) => {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
      
        if (!userSnap.exists()) {
          navigate("/choose-role");
        } else {
          navigate("/home");
        }
    };      

    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            await ensureUserAccount(result.user);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <img 
                    // src="/images/logo192.png" 
                    src="/logo192.png"
                    alt="Care Companion Logo" 
                    className="login-logo"
                />
                <h1 className="login-title">Welcome to Care Companion</h1>
                <p className="login-subtitle">Your personal healthcare assistant</p>

                <button
                    onClick={handleLogin}
                    className="google-button"
                >
                    <svg className="google-icon" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
                        />
                    </svg>
                    Sign in with Google
                </button>

                <div className="divider">
                    <span>or</span>
                </div>

                <div className="security-badge">
                    <svg className="security-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/>
                    </svg>
                    Protected by Google Authentication
                </div>

                <p className="terms">
                    By signing in, you agree to our{' '}
                    <a href="#" className="terms-link">Terms of Service</a>{' '}
                    and{' '}
                    <a href="#" className="terms-link">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
}
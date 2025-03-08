"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Correct import for Next.js 13+

export default function Home() {
  const [quote, setQuote] = useState("Stay motivated!");
  const [showQuote, setShowQuote] = useState(true);
  const router = useRouter(); // Initialize router for navigation

  const quotes = [
    "Believe in yourself!",
    "Keep pushing forward!",
    "Success is a journey, not a destination.",
    "Hard work beats talent when talent doesn’t work hard.",
    "Stay focused and never give up!",
  ];

  useEffect(() => {
    // Show a random motivational quote for 5 seconds
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    const timer = setTimeout(() => setShowQuote(false), 5000);

    return () => clearTimeout(timer);
  }, []);

  // Function to handle navigation to login and signup
  const goToLogin = () => router.push("/login");  // Adjusted path
  const goToSignup = () => router.push("/signup");  // Adjusted path

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {showQuote ? (
        <h1>{quote}</h1>
      ) : (
        <div>
          <h1>Welcome to Focus Room</h1>
          {/* Add buttons to navigate to login and signup */}
          <div style={{ marginTop: "20px" }}>
            <button 
              onClick={goToLogin} 
              style={{
                padding: "10px 20px", 
                fontSize: "16px", 
                backgroundColor: "#3498db", 
                color: "white", 
                border: "none", 
                borderRadius: "5px", 
                marginRight: "10px", 
                cursor: "pointer"
              }}
            >
              Login
            </button>
            <button 
              onClick={goToSignup} 
              style={{
                padding: "10px 20px", 
                fontSize: "16px", 
                backgroundColor: "#2ecc71", 
                color: "white", 
                border: "none", 
                borderRadius: "5px", 
                cursor: "pointer"
              }}
            >
              Signup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClickSpeedGame() {
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [highScore, setHighScore] = useState(
    typeof window !== "undefined" ? localStorage.getItem("clickSpeedHighScore") || 0 : 0
  );
  const router = useRouter();

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (clicks > highScore) {
        setHighScore(clicks);
        localStorage.setItem("clickSpeedHighScore", clicks);
      }
    }
  }, [isRunning, timeLeft]);

  const startGame = () => {
    setClicks(0);
    setTimeLeft(10);
    setIsRunning(true);
  };

  // Styles
  const styles = {
    container: {
      fontFamily: "'Inter', sans-serif",
      backgroundColor: "#121212", // Dark background
      color: "#ffffff", // White text
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      textAlign: "center",
    },
    heading: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      marginBottom: "10px",
      background: "linear-gradient(90deg, #bb86fc, #03dac6)", // Gradient for heading
      WebkitBackgroundClip: "text",
      color: "transparent",
    },
    subheading: {
      fontSize: "1.2rem",
      marginBottom: "20px",
      color: "#aaaaaa",
    },
    timer: {
      fontSize: "2rem",
      fontWeight: "bold",
      marginBottom: "10px",
      color: "#ffffff",
    },
    clicks: {
      fontSize: "1.5rem",
      marginBottom: "10px",
      color: "#ffffff",
    },
    highScore: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "20px",
      color: "#03dac6", // Teal for high score
    },
    progressBar: {
      width: "100%",
      maxWidth: "300px",
      height: "10px",
      backgroundColor: "#333",
      borderRadius: "5px",
      marginBottom: "20px",
      overflow: "hidden",
    },
    progress: {
      height: "100%",
      width: `${(timeLeft / 10) * 100}%`,
      backgroundColor: "#03dac6", // Teal for progress
      transition: "width 0.5s ease",
    },
    clickButton: {
      padding: "15px 30px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontSize: "1.2rem",
      fontWeight: "bold",
      backgroundColor: isRunning ? "#03dac6" : "#bb86fc", // Teal or purple
      color: "#121212", // Dark text
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      marginBottom: "20px", // Added space below the button
      ":hover": {
        transform: "scale(1.05)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      },
    },
    startButton: {
      padding: "10px 20px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "bold",
      backgroundColor: "#bb86fc", // Purple
      color: "#121212", // Dark text
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      ":hover": {
        transform: "scale(1.05)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      },
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Click Speed Game</h1>
      <p style={styles.subheading}>Click as fast as you can in 10 seconds!</p>

      <p style={styles.timer}>Time Left: {timeLeft}s</p>
      <p style={styles.clicks}>Clicks: {clicks}</p>
      <p style={styles.highScore}>High Score: {highScore}</p>

      {/* Progress Bar */}
      <div style={styles.progressBar}>
        <div style={styles.progress}></div>
      </div>

      <button
        disabled={!isRunning}
        onClick={() => setClicks(clicks + 1)}
        style={{
          ...styles.clickButton,
          cursor: isRunning ? "pointer" : "not-allowed",
          opacity: isRunning ? 1 : 0.7,
        }}
      >
        Click Me!
      </button>

      {!isRunning && (
        <button onClick={startGame} style={styles.startButton}>
          Start Game
        </button>
      )}
    </div>
  );
}
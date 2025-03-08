"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaPlay, FaPause, FaRedo, FaHome } from "react-icons/fa";

export default function Pomodoro() {
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 1) {
            setIsTimeUp(true); // Mark time as up
          }
          return prevTime > 0 ? prevTime - 1 : 0;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  // Blinking popup effect when time is up
  useEffect(() => {
    let popupInterval;
    if (isTimeUp) {
      popupInterval = setInterval(() => {
        setShowPopup((prev) => !prev); // Toggle popup visibility every 0.5s
      }, 500);
    } else {
      clearInterval(popupInterval);
    }
    return () => clearInterval(popupInterval);
  }, [isTimeUp]);

  const resetTimer = () => {
    setIsRunning(false);
    setTime(25 * 60);
    setIsTimeUp(false);
    setShowPopup(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Dark-themed styles
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
      transition: "background-color 0.3s ease, color 0.3s ease",
    },
    heading: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      marginBottom: "20px",
      background: "linear-gradient(90deg, #bb86fc, #03dac6)", // Gradient for heading
      WebkitBackgroundClip: "text",
      color: "transparent",
    },
    timer: {
      fontSize: "6rem", // Bigger timer
      fontFamily: "'Roboto Mono', monospace",
      fontWeight: "bold",
      marginBottom: "20px",
      color: "#ffffff", // White timer
      textShadow: "0 4px 6px rgba(255, 255, 255, 0.1)", // Subtle shadow
    },
    buttonGroup: {
      display: "flex",
      gap: "10px",
      marginBottom: "20px",
    },
    button: {
      padding: "10px 20px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "1rem",
      fontWeight: "bold",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
    },
    startButton: {
      backgroundColor: "#03dac6", // Teal for start/pause
      color: "#121212", // Dark text
    },
    resetButton: {
      backgroundColor: "#cf6679", // Coral for reset
      color: "#121212", // Dark text
    },
    backButton: {
      backgroundColor: "#bb86fc", // Purple for go back
      color: "#121212", // Dark text
    },
    popup: {
      padding: "10px 20px",
      borderRadius: "8px",
      backgroundColor: "#cf6679", // Coral for popup
      color: "#ffffff", // White text
      fontSize: "1.2rem",
      fontWeight: "bold",
      textAlign: "center",
      opacity: showPopup ? 1 : 0,
      transition: "opacity 0.5s ease",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Pomodoro Timer</h1>
      <p style={styles.timer}>{formatTime(time)}</p>

      {/* Buttons */}
      <div style={styles.buttonGroup}>
        <button
          onClick={() => setIsRunning((prev) => !prev)}
          style={{ ...styles.button, ...styles.startButton }}
        >
          {isRunning ? <FaPause /> : <FaPlay />} {isRunning ? "Pause" : "Start"}
        </button>
        <button onClick={resetTimer} style={{ ...styles.button, ...styles.resetButton }}>
          <FaRedo /> Reset
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          style={{ ...styles.button, ...styles.backButton }}
        >
          <FaHome /> Go Back
        </button>
      </div>

      {/* Blinking Popup */}
      <div style={styles.popup}>
        ⏳ Time's Up! Take a Break! 🎉
      </div>
    </div>
  );
}
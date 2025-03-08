"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ClickSpeedGame from "./ClickSpeedGame";
import MemoryGame from "./MemoryGame";
import BubblePopGame from "./BubblePopGame";
import SnakeGame from "./SnakeGame";
import TargetShooterGame from "./TargetShooterGame";

export default function Games() {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState(null);

  // Styles
  const styles = {
    container: {
      fontFamily: "'Inter', sans-serif",
      backgroundColor: "#ffffff", // Light background
      color: "#333333", // Dark text
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
      marginBottom: "20px",
      background: "linear-gradient(90deg, #007bff, #00bfff)", // Gradient for heading
      WebkitBackgroundClip: "text",
      color: "transparent",
    },
    gameButtons: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    gameButton: {
      padding: "15px 30px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontSize: "1.2rem",
      fontWeight: "bold",
      background: "linear-gradient(90deg, #007bff, #00bfff)", // Gradient for buttons
      color: "#ffffff", // White text
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      ":hover": {
        transform: "scale(1.05)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      },
    },
    backButton: {
      padding: "10px 20px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "bold",
      backgroundColor: "#007bff", // Blue
      color: "#ffffff", // White text
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      marginTop: "20px",
      ":hover": {
        transform: "scale(1.05)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      },
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🎮 Stress Relief Games</h1>

      {/* Show selected game */}
      {selectedGame ? (
        <>
          {selectedGame === "click" && <ClickSpeedGame />}
          {selectedGame === "memory" && <MemoryGame />}
          {selectedGame === "bubble" && <BubblePopGame />}
          {selectedGame === "snake" && <SnakeGame />}
          {selectedGame === "target" && <TargetShooterGame />}
          <button
            onClick={() => setSelectedGame(null)}
            style={styles.backButton}
          >
            Back to Game Selection
          </button>
        </>
      ) : (
        <div style={styles.gameButtons}>
          <button
            onClick={() => setSelectedGame("click")}
            style={styles.gameButton}
          >
            Click Speed Game
          </button>
          <button
            onClick={() => setSelectedGame("memory")}
            style={styles.gameButton}
          >
            Memory Flip Game
          </button>
          <button
            onClick={() => setSelectedGame("bubble")}
            style={styles.gameButton}
          >
            Bubble Pop Game
          </button>
          <button
            onClick={() => setSelectedGame("snake")}
            style={styles.gameButton}
          >
            Snake Game
          </button>
          <button
            onClick={() => setSelectedGame("target")}
            style={styles.gameButton}
          >
            Target Shooter Game
          </button>
        </div>
      )}

      {/* Go Back to Dashboard Button */}
      <button
        onClick={() => router.push("/dashboard")}
        style={styles.backButton}
      >
        Go Back to Dashboard
      </button>
    </div>
  );
}

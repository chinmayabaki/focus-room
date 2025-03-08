"use client";
import { useState, useEffect } from "react";

export default function BubblePopGame() {
  const [score, setScore] = useState(0);
  const [bubbles, setBubbles] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(true);
  const [highScore, setHighScore] = useState(
    typeof window !== "undefined" ? parseInt(localStorage.getItem("bubblePopHighScore")) || 0 : 0
  );

  // Dynamic bubble speed
  const [bubbleSpeed, setBubbleSpeed] = useState(1000); // Initial spawn interval

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && isRunning) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsRunning(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("bubblePopHighScore", score.toString());
      }
    }
  }, [timeLeft, score, highScore, isRunning]);

  // Bubble spawn logic
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setBubbles((prev) => [
          ...prev,
          {
            id: Date.now(),
            x: Math.random() * 90, // Random horizontal position
            y: Math.random() * 90, // Random vertical position
            size: Math.random() > 0.8 ? 20 : 40, // 20% chance of small bubble
            type: Math.random() > 0.9 ? "golden" : "black", // 10% chance of golden bubble, 90% black
          },
        ]);
      }, bubbleSpeed);

      return () => clearInterval(interval);
    }
  }, [isRunning, bubbleSpeed]);

  // Pop bubble logic
  const popBubble = (id, type) => {
    setBubbles((prevBubbles) => prevBubbles.filter((bubble) => bubble.id !== id));
    if (type === "golden") {
      setScore((prev) => prev + 5); // Golden bubbles give +5 points
    } else if (type === "black") {
      setScore((prev) => Math.max(prev - 2, 0)); // Black bubbles deduct 2 points (minimum score is 0)
    }
  };

  // Restart game
  const restartGame = () => {
    setScore(0);
    setTimeLeft(60);
    setIsRunning(true);
    setBubbles([]);
    setBubbleSpeed(1000); // Reset bubble speed
  };

  return (
    <div className="bubble-pop-game relative flex items-center justify-center overflow-hidden min-h-screen bg-gray-100">
      {/* Floating Animation CSS */}
      <style>
        {`
          @keyframes float {
            0% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
            100% {
              transform: translateY(0);
            }
          }

          .bubble {
            animation: float 3s infinite ease-in-out;
            position: absolute;
            cursor: pointer;
            transition: transform 0.3s;
            border-radius: 50%;
          }
        `}
      </style>

      {/* Game Info */}
      <h2 className="absolute top-2 text-xl font-bold text-gray-800">Time: {timeLeft}s</h2>
      <h2 className="absolute top-8 text-xl font-bold text-gray-800">Score: {score}</h2>
      <p className="absolute top-14 text-green-600 font-bold">Best: {highScore}</p>

      {/* Bubbles */}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          onClick={() => popBubble(bubble.id, bubble.type)}
          className={`bubble ${
            bubble.type === "golden" ? "bg-yellow-400" : "bg-black"
          }`}
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
          }}
        />
      ))}

      {/* Game Over Screen */}
      {!isRunning && (
        <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold text-gray-800">Game Over!</h2>
          <p className="text-xl text-gray-600 mt-2">Your Score: {score}</p>
          <p className="text-xl text-green-600">Best Score: {highScore}</p>
          <button
            onClick={restartGame}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
}
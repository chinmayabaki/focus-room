"use client";
import { useState, useEffect } from "react";

export default function TargetShooterGame() {
  const [score, setScore] = useState(0);
  const [targets, setTargets] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(true);
  const [highScore, setHighScore] = useState(
    typeof window !== "undefined" ? parseInt(localStorage.getItem("targetShooterHighScore")) || 0 : 0
  );

  useEffect(() => {
    if (timeLeft > 0 && isRunning) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsRunning(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("targetShooterHighScore", score.toString());
      }
    }
  }, [timeLeft, score, highScore, isRunning]);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setTargets((prev) => [
          ...prev,
          {
            id: Date.now(),
            x: Math.random() * 90,
            y: Math.random() * 90,
            size: 50,
          },
        ]);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const hitTarget = (id) => {
    setTargets((prev) => prev.filter((target) => target.id !== id));
    setScore((prev) => prev + 1);
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(60);
    setIsRunning(true);
    setTargets([]);
  };

  return (
    <div className="target-shooter-game relative flex items-center justify-center overflow-hidden min-h-screen bg-gray-100">
      <style>
        {`
          .target {
            position: absolute;
            cursor: pointer;
            transition: all 0.5s;
            background-color: red;
            border-radius: 50%;
          }
        `}
      </style>

      <h2 className="absolute top-2 text-xl font-bold text-gray-800">Time: {timeLeft}s</h2>
      <h2 className="absolute top-8 text-xl font-bold text-gray-800">Score: {score}</h2>
      <p className="absolute top-14 text-green-600 font-bold">Best: {highScore}</p>

      {targets.map((target) => (
        <div
          key={target.id}
          onClick={() => hitTarget(target.id)}
          className="target"
          style={{
            left: `${target.x}%`,
            top: `${target.y}%`,
            width: `${target.size}px`,
            height: `${target.size}px`,
          }}
        />
      ))}

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

"use client";

import { useState, useEffect, useRef } from "react";

const GRID_SIZE = 20;
const SPEED = 150; // Milliseconds per move

const getRandomPosition = () => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

export default function SnakeGame() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState({ x: 0, y: -1 }); // Moving up initially
  const [food, setFood] = useState(getRandomPosition());
  const [isGameOver, setIsGameOver] = useState(false);
  const gameBoardRef = useRef(null);

  useEffect(() => {
    if (isGameOver) return;
    const handleKeyPress = (e) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [direction, isGameOver]);

  useEffect(() => {
    if (isGameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newHead = {
          x: prevSnake[0].x + direction.x,
          y: prevSnake[0].y + direction.y,
        };

        // Check collisions
        if (
          newHead.x < 0 ||
          newHead.y < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y >= GRID_SIZE ||
          prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(getRandomPosition());
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, SPEED);
    return () => clearInterval(interval);
  }, [direction, food, isGameOver]);

  return (
    <div
      ref={gameBoardRef}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
        gridTemplateRows: `repeat(${GRID_SIZE}, 20px)`,
        gap: "1px",
        backgroundColor: "#000",
        padding: "10px",
      }}
    >
      {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
        const x = index % GRID_SIZE;
        const y = Math.floor(index / GRID_SIZE);
        const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
        const isFood = food.x === x && food.y === y;

        return (
          <div
            key={index}
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: isSnake ? "limegreen" : isFood ? "red" : "black",
              borderRadius: isFood ? "50%" : "0",
            }}
          />
        );
      })}
      {isGameOver && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0, 0, 0, 0.8)",
            color: "#fff",
            padding: "20px",
            fontSize: "1.5rem",
            borderRadius: "10px",
          }}
        >
          Game Over! Press any key to restart.
        </div>
      )}
    </div>
  );
}

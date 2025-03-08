"use client";
import { useState, useEffect } from "react";

const cardEmojis = [
  "🐶", "🐱", "🐵", "🦊", 
  "🐸", "🐯", "🐰", "🐺"
];

const generateCards = () => {
  const cards = [...cardEmojis, ...cardEmojis]; // Duplicate the emojis for pairs
  return cards.sort(() => Math.random() - 0.5); // Shuffle the cards
};

export default function MemoryFlipGame() {
  const [cards, setCards] = useState(generateCards());
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIndices, setMatchedIndices] = useState([]);
  const [moves, setMoves] = useState(0);
  const [highScore, setHighScore] = useState(
    typeof window !== "undefined" ? localStorage.getItem("memoryFlipHighScore") || Infinity : Infinity
  );

  useEffect(() => {
    if (matchedIndices.length === cards.length) {
      if (moves < highScore) {
        setHighScore(moves);
        localStorage.setItem("memoryFlipHighScore", moves);
      }
    }
  }, [matchedIndices, moves, highScore, cards.length]);

  const handleCardClick = (index) => {
    if (flippedIndices.length === 2 || matchedIndices.includes(index) || flippedIndices.includes(index)) return;

    setFlippedIndices((prev) => [...prev, index]);

    if (flippedIndices.length === 1) {
      setMoves((prev) => prev + 1);
      const firstCardIndex = flippedIndices[0];
      if (cards[firstCardIndex] === cards[index]) {
        setMatchedIndices((prev) => [...prev, firstCardIndex, index]);
        setFlippedIndices([]);
      } else {
        setTimeout(() => setFlippedIndices([]), 1000);
      }
    }
  };

  const resetGame = () => {
    setCards(generateCards());
    setFlippedIndices([]);
    setMatchedIndices([]);
    setMoves(0);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold">Memory Flip Game</h2>
      <p className="mb-2">Moves: {moves}</p>
      <p className="text-lg font-bold text-green-600">Best Score: {highScore === Infinity ? "N/A" : highScore} moves</p>
      <div className="grid grid-cols-4 gap-4 mt-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`p-6 bg-gray-200 text-3xl text-center cursor-pointer rounded transition-transform duration-300 ${flippedIndices.includes(index) || matchedIndices.includes(index) ? "transform scale-100" : "transform scale-90"}`}
            onClick={() => handleCardClick(index)}
          >
            {flippedIndices.includes(index) || matchedIndices.includes(index) ? card : "❓"}
          </div>
        ))}
      </div>
      <button onClick={resetGame} className="mt-4 p-2 bg-blue-500 text-white rounded">
        Reset Game
      </button>
    </div>
  );
}
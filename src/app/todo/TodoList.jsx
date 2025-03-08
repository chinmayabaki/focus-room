"use client";
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  FaUser,
  FaBriefcase,
  FaHome,
  FaTasks,
  FaStar,
  FaExclamationTriangle,
  FaBolt,
  FaCheckSquare,
} from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const getOrderedWeekDates = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return {
      date,
      label: date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }),
      isoDate: date.toISOString().split("T")[0],
    };
  });
};

const categories = [
  { name: "Personal", icon: <FaUser /> },
  { name: "Work", icon: <FaBriefcase /> },
  { name: "Home", icon: <FaHome /> },
  { name: "Other", icon: <FaTasks /> },
];

const priorities = [
  { name: "Easy", icon: <FaStar /> },
  { name: "Medium", icon: <FaExclamationTriangle /> },
  { name: "Hard", icon: <FaBolt /> },
];

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedCategory, setSelectedCategory] = useState("Personal");
  const [selectedPriority, setSelectedPriority] = useState("Medium");
  const [customCategory, setCustomCategory] = useState("");
  const [user] = useAuthState(auth);
  const weekDates = getOrderedWeekDates();

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(
        query(collection(db, "users", user.uid, "todos"), orderBy("createdAt", "asc")),
        (snapshot) => {
          setTodos(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate() || new Date(),
            }))
          );
        }
      );
      return () => unsubscribe();
    }
  }, [user]);

  const addTodo = async () => {
    if (newTodo.trim() === "" || !user) return;
    await addDoc(collection(db, "users", user.uid, "todos"), {
      title: newTodo,
      completed: false,
      category: selectedCategory === "Other" ? customCategory : selectedCategory,
      priority: selectedPriority,
      createdAt: serverTimestamp(),
      taskDate: selectedDate,
    });
    setNewTodo("");
  };

  const toggleCompletion = async (id, completed) => {
    await deleteDoc(doc(db, "users", user.uid, "todos", id));
  };

  return (
    <div className="max-w-5xl mx-auto mt-5 p-5 bg-gray-100 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">To-Do List (Weekly View)</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="p-2 border rounded w-full"
        />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border rounded"
        />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="p-2 border rounded">
          {categories.map(({ name, icon }) => (
            <option key={name} value={name}>{icon} {name}</option>
          ))}
        </select>
        <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)} className="p-2 border rounded">
          {priorities.map(({ name, icon }) => (
            <option key={name} value={name}>{icon} {name}</option>
          ))}
        </select>
        <button onClick={addTodo} className="p-2 bg-blue-500 text-white rounded">Add</button>
      </div>
      <div className="flex gap-2 mb-4">
        {weekDates.map(({ date, label, isoDate }) => (
          <div
            key={isoDate}
            className="p-2 border rounded cursor-pointer hover:bg-blue-200 transition-transform transform hover:scale-105"
          >
            {label}
            <div>
              {todos.filter((todo) => todo.taskDate === isoDate).map((todo) => (
                <div key={todo.id} className="p-2 border rounded bg-gray-200 mb-1 flex items-center hover:bg-gray-300">
                  <input type="checkbox" checked={todo.completed} onChange={() => toggleCompletion(todo.id, todo.completed)} className="mr-2" />
                  {todo.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;

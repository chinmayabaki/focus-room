"use client";

import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useDrag, useDrop } from "react-dnd";

const ItemType = "TODO";

const TodoItem = ({ todo, index, moveItem, updateTodo, deleteTodo }) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} className="p-2 border rounded flex justify-between items-center bg-gray-100 mb-2">
      <input
        type="text"
        value={todo.text}
        onChange={(e) => updateTodo(todo.id, e.target.value)}
        className="flex-1 bg-transparent border-none outline-none px-2"
      />
      <button onClick={() => deleteTodo(todo.id)} className="text-red-500">❌</button>
    </div>
  );
};

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "todos"), (snapshot) => {
      setTodos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const addTodo = async () => {
    if (newTodo.trim()) {
      await addDoc(collection(db, "todos"), { text: newTodo });
      setNewTodo("");
    }
  };

  const updateTodo = async (id, text) => {
    await updateDoc(doc(db, "todos", id), { text });
  };

  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };

  const moveItem = (fromIndex, toIndex) => {
    const updatedTodos = [...todos];
    const [movedItem] = updatedTodos.splice(fromIndex, 1);
    updatedTodos.splice(toIndex, 0, movedItem);
    setTodos(updatedTodos);
  };

  return (
    <div className="p-4 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">To-Do List</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button onClick={addTodo} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">Add</button>
      </div>
      {todos.map((todo, index) => (
        <TodoItem key={todo.id} todo={todo} index={index} moveItem={moveItem} updateTodo={updateTodo} deleteTodo={deleteTodo} />
      ))}
    </div>
  );
};

export default TodoList;

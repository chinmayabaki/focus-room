"use client";

import { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FaCheck, FaPlus, FaFire, FaBolt, FaHome, FaBook, FaBriefcase, FaSignOutAlt, FaSun, FaMoon } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    task: "",
    difficulty: "easy",
    type: "study",
    date: "",
  });
  const [theme, setTheme] = useState("light"); // Default theme is light
  const router = useRouter();

  // Toggle between dark and light mode
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchTasks(user.uid);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchTasks = async (userId) => {
    const tasksData = [
      { id: 1, task: "CSE Assignment", difficulty: "hard", type: "study", date: "2025-03-09", completed: false, studyTime: 120 },
      { id: 2, task: "Work on Project", difficulty: "medium", type: "work", date: "2025-03-07", completed: true, studyTime: 90 },
      { id: 3, task: "Read a Book", difficulty: "easy", type: "study", date: "2025-03-08", completed: true, studyTime: 60 },
    ];
    setTasks(tasksData);
  };

  const handleTaskToggle = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleAddTask = () => {
    if (!newTask.task || !newTask.date) return;
    const newTaskId = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
    const newTaskWithId = { ...newTask, id: newTaskId, completed: false, studyTime: 0 };
    setTasks([...tasks, newTaskWithId]);
    setNewTask({ task: "", difficulty: "easy", type: "study", date: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const getWeekDays = () => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() + i);
      return {
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        dateStr: date.toISOString().split("T")[0],
        displayDate: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      };
    });
  };

  const getUnfinishedTasks = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    return tasks.filter(
      (task) => !task.completed && task.date <= yesterdayStr
    );
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;

    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(source.index, 1);
    updatedTasks.splice(destination.index, 0, movedTask);

    setTasks(updatedTasks);
  };

  // Prepare data for the Study Time Graph
  const getStudyTimeData = () => {
    const studyData = tasks
      .filter((task) => task.type === "study")
      .reduce((acc, task) => {
        const date = task.date;
        if (!acc[date]) acc[date] = 0;
        acc[date] += task.studyTime || 0;
        return acc;
      }, {});

    const labels = Object.keys(studyData).sort();
    const data = labels.map((date) => studyData[date]);

    return {
      labels,
      datasets: [
        {
          label: "Study Time (minutes)",
          data,
          borderColor: theme === "light" ? "#36a2eb" : "#bb86fc",
          backgroundColor: theme === "light" ? "#36a2eb" : "#bb86fc",
        },
      ],
    };
  };

  // Prepare data for the Task Completion Graph
  const getTaskCompletionData = () => {
    const completionData = tasks.reduce((acc, task) => {
      const date = task.date;
      if (!acc[date]) acc[date] = { completed: 0, total: 0 };
      if (task.completed) acc[date].completed++;
      acc[date].total++;
      return acc;
    }, {});

    const labels = Object.keys(completionData).sort();
    const completed = labels.map((date) => completionData[date].completed);
    const total = labels.map((date) => completionData[date].total);

    return {
      labels,
      datasets: [
        {
          label: "Completed Tasks",
          data: completed,
          backgroundColor: theme === "light" ? "#4caf50" : "#03dac6",
        },
        {
          label: "Total Tasks",
          data: total,
          backgroundColor: theme === "light" ? "#ff6384" : "#cf6679",
        },
      ],
    };
  };

  // Theme-based styles
  const styles = {
    container: {
      fontFamily: "'Inter', sans-serif",
      backgroundColor: theme === "light" ? "#f8f9fa" : "#121212",
      color: theme === "light" ? "#333" : "#ffffff",
      padding: "20px",
      minHeight: "100vh",
      transition: "background-color 0.3s ease, color 0.3s ease",
    },
    welcomeMessage: {
      textAlign: "center",
      fontSize: "2rem",
      marginBottom: "20px",
      color: theme === "light" ? "#333" : "#ffffff",
    },
    navButtons: {
      display: "flex",
      justifyContent: "center",
      gap: "10px",
      marginBottom: "20px",
      flexWrap: "wrap",
    },
    navButton: {
      padding: "10px 20px",
      borderRadius: "8px",
      backgroundColor: theme === "light" ? "#007bff" : "#bb86fc",
      color: "white",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "background-color 0.3s ease",
    },
    taskForm: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: theme === "light" ? "#ffffff" : "#1e1e1e",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      transition: "background-color 0.3s ease",
    },
    sectionTitle: {
      textAlign: "center",
      marginBottom: "20px",
      fontSize: "1.5rem",
      color: theme === "light" ? "#333" : "#ffffff",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    input: {
      padding: "10px",
      borderRadius: "8px",
      border: `1px solid ${theme === "light" ? "#ddd" : "#333"}`,
      backgroundColor: theme === "light" ? "#ffffff" : "#2c2c2c",
      color: theme === "light" ? "#333" : "#ffffff",
      fontSize: "1rem",
      transition: "background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease",
    },
    select: {
      padding: "10px",
      borderRadius: "8px",
      border: `1px solid ${theme === "light" ? "#ddd" : "#333"}`,
      backgroundColor: theme === "light" ? "#ffffff" : "#2c2c2c",
      color: theme === "light" ? "#333" : "#ffffff",
      fontSize: "1rem",
      transition: "background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease",
    },
    addButton: {
      backgroundColor: theme === "light" ? "#28a745" : "#03dac6",
      padding: "12px",
      borderRadius: "8px",
      color: "white",
      fontSize: "1.1rem",
      fontWeight: "bold",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      transition: "background-color 0.3s ease",
    },
    analyticsSection: {
      marginTop: "40px",
      maxWidth: "800px",
      margin: "0 auto",
      backgroundColor: theme === "light" ? "#ffffff" : "#1e1e1e",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      transition: "background-color 0.3s ease",
    },
    graphContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "20px",
    },
    graph: {
      backgroundColor: theme === "light" ? "#f9f9f9" : "#2c2c2c",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      transition: "background-color 0.3s ease",
    },
    graphTitle: {
      textAlign: "center",
      marginBottom: "20px",
      fontSize: "1.2rem",
      color: theme === "light" ? "#333" : "#ffffff",
    },
    todoList: {
      marginTop: "40px",
      maxWidth: "800px",
      margin: "0 auto",
      backgroundColor: theme === "light" ? "#ffffff" : "#1e1e1e",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      transition: "background-color 0.3s ease",
    },
    taskGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: "20px",
      padding: "20px",
    },
    dayBlock: {
      border: `1px solid ${theme === "light" ? "#ddd" : "#333"}`,
      borderRadius: "12px",
      padding: "15px",
      backgroundColor: theme === "light" ? "#f9f9f9" : "#2c2c2c",
      transition: "background-color 0.3s ease, border-color 0.3s ease",
    },
    dayTitle: {
      textAlign: "center",
      marginBottom: "5px",
      fontSize: "1.2rem",
      color: theme === "light" ? "#333" : "#ffffff",
    },
    dayDate: {
      textAlign: "center",
      fontSize: "0.9rem",
      color: theme === "light" ? "#777" : "#aaaaaa",
    },
    taskItems: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    taskItem: {
      padding: "10px",
      backgroundColor: theme === "light" ? "#e7e7e7" : "#3c3c3c",
      borderRadius: "8px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease",
      cursor: "grab",
      ":hover": {
        transform: "scale(1.02)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      },
    },
    checkbox: {
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          padding: "10px",
          borderRadius: "50%",
          backgroundColor: theme === "light" ? "#007bff" : "#bb86fc",
          color: "white",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 0.3s ease",
        }}
      >
        {theme === "light" ? <FaMoon /> : <FaSun />}
      </button>

      <h1 style={styles.welcomeMessage}>Welcome, {user?.email} 🎉</h1>

      {/* Navigation Buttons */}
      <div style={styles.navButtons}>
        <button style={styles.navButton} onClick={() => router.push("/pomodoro")}>
          <FaBook /> Pomodoro Timer
        </button>
        <button style={styles.navButton} onClick={() => router.push("/games")}>
          <FaHome /> Stress Relief Games
        </button>
        <button style={styles.navButton} onClick={() => router.push("/study-room")}>
          <FaBriefcase /> Study Room
        </button>
        <button style={styles.navButton} onClick={() => signOut(auth)}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Task Assigning Box */}
      <div style={styles.taskForm}>
        <h2 style={styles.sectionTitle}>Assign New Task</h2>
        <div style={styles.formGroup}>
          <input type="text" name="task" value={newTask.task} onChange={handleChange} placeholder="Task Name" style={styles.input} />
          <select name="difficulty" value={newTask.difficulty} onChange={handleChange} style={styles.select}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <select name="type" value={newTask.type} onChange={handleChange} style={styles.select}>
            <option value="study">Study</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="other">Other</option>
          </select>
          <input type="date" name="date" value={newTask.date} onChange={handleChange} style={styles.input} />
          <button onClick={handleAddTask} style={styles.addButton}>
            <FaPlus /> Add Task
          </button>
        </div>
      </div>

      {/* Analytics Section */}
      <div style={styles.analyticsSection}>
        <h2 style={styles.sectionTitle}>Analytics</h2>
        <div style={styles.graphContainer}>
          <div style={styles.graph}>
            <h3 style={styles.graphTitle}>Study Time</h3>
            <Line data={getStudyTimeData()} options={{ responsive: true }} />
          </div>
          <div style={styles.graph}>
            <h3 style={styles.graphTitle}>Task Completion</h3>
            <Bar data={getTaskCompletionData()} options={{ responsive: true }} />
          </div>
        </div>
      </div>

      {/* To-Do List Section */}
      <div style={styles.todoList}>
        <h2 style={styles.sectionTitle}>Your To-Do List</h2>
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={styles.taskGrid}>
            {/* Unfinished Tasks Block */}
            <div style={styles.dayBlock}>
              <h3 style={{ ...styles.dayTitle, color: "#ff4d4d" }}>Unfinished Tasks</h3>
              <Droppable droppableId="unfinished">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} style={styles.taskItems}>
                    {getUnfinishedTasks().map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...styles.taskItem,
                              ...provided.draggableProps.style,
                              backgroundColor: theme === "light" ? "#ffcccc" : "#ff4d4d",
                            }}
                          >
                            <div>
                              {task.task} {task.difficulty === "hard" ? <FaFire /> : task.difficulty === "medium" ? <FaBolt /> : "🟢"}{" "}
                              {task.type === "study" ? "📚" : task.type === "work" ? "💼" : "🏠"}
                            </div>
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => handleTaskToggle(task.id)}
                              style={styles.checkbox}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {/* Regular Day Blocks */}
            {getWeekDays().map(({ dayName, dateStr, displayDate }) => (
              <div key={dateStr} style={styles.dayBlock}>
                <h3 style={styles.dayTitle}>{dayName}</h3>
                <p style={styles.dayDate}>{displayDate}</p>
                <Droppable droppableId={dateStr}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} style={styles.taskItems}>
                      {tasks
                        .filter((task) => task.date === dateStr && !task.completed)
                        .map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...styles.taskItem,
                                  ...provided.draggableProps.style,
                                }}
                              >
                                <div>
                                  {task.task} {task.difficulty === "hard" ? <FaFire /> : task.difficulty === "medium" ? <FaBolt /> : "🟢"}{" "}
                                  {task.type === "study" ? "📚" : task.type === "work" ? "💼" : "🏠"}
                                </div>
                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onChange={() => handleTaskToggle(task.id)}
                                  style={styles.checkbox}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
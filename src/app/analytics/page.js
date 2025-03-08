"use client";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Line } from "react-chartjs-2"; // Import Chart.js
import Chart from "chart.js/auto"; // Import the Chart.js library

const Analytics = ({ userId }) => {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const userRef = doc(db, "user_analytics", userId);
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        setAnalyticsData(docSnap.data());
      } else {
        console.log("No analytics data found!");
      }
    };

    if (userId) {
      fetchAnalytics();
    }
  }, [userId]);

  if (!analyticsData) {
    return <div>Loading...</div>;
  }

  // Preparing data for the graph
  const chartData = {
    labels: ["Study Time (min)", "Completed Tasks", "Total Tasks"], // categories
    datasets: [
      {
        label: "Analytics",
        data: [
          analyticsData.studyTime, // Study time in minutes
          analyticsData.completedTasks, // Completed tasks
          analyticsData.totalTasks, // Total tasks
        ],
        fill: false,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="analytics-container">
      <h2>User Analytics</h2>
      <div className="chart-container">
        <Line data={chartData} />
      </div>
      <div className="metrics">
        <h3>Study Time: {analyticsData.studyTime} minutes</h3>
        <h3>Completed Tasks: {analyticsData.completedTasks}</h3>
        <h3>Total Tasks: {analyticsData.totalTasks}</h3>
        <h3>Accuracy: {((analyticsData.completedTasks / analyticsData.totalTasks) * 100).toFixed(2)}%</h3>
      </div>
    </div>
  );
};

export default Analytics;

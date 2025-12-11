import React, { useEffect, useState } from "react";
import axios from "axios";

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:5000/api/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(response.data.history);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div>
      <h2>Your History</h2>
      <ul>
        {history.map((activity, index) => (
          <li key={index}>{activity}</li>
        ))}
      </ul>
    </div>
  );
};

export default History;
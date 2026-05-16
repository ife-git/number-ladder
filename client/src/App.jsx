import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import LeaderBoard from "./pages/leaderBoard";
import NumberGame from "./pages/numberGame";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route index element={<Home />} />

        <Route path="/home" element={<Home />} />
        <Route path="/leaderBoard" element={<LeaderBoard />} />
        <Route path="/numberGame" element={<NumberGame />} />
      </Routes>
    </Router>
  );
}

export default App;

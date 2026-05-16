import { Link } from "react-router-dom";
import React, { useContext } from "react";
import { ThemeContext } from "../context/themeContext";

export default function Home() {
  const { theme, changeTheme } = useContext(ThemeContext);

  const handleThemeChange = (e) => {
    changeTheme(e.target.value);
  };

  return (
    <div className="main">
      <h1 className="title">Number Ladder 🪜🎮</h1>
      <p className="instructions">Welcome To The Number Ladder 🪜🎮</p>

      <div className="theme-selector">
        <label htmlFor="theme">Choose Theme: </label>
        <select
          id="theme"
          name="theme"
          value={theme}
          onChange={handleThemeChange}
        >
          <option value="light">Light ☀️</option>
          <option value="dark">Dark 🌙</option>
          <option value="candy">Candy 🍬</option>
          <option value="monochrome">Monochrome ⚫</option>
          <option value="ocean">Ocean 🌊</option>
          <option value="forest">Forest 🌲</option>
          <option value="crimson">Crimson 🔴</option>
          <option value="sunshine">Sunshine ☀️</option>
        </select>
      </div>

      <div className="button-container">
        <Link to="/numberGame" className="home-buttons">
          Number Ladder
        </Link>
        <Link to="/leaderBoard" className="home-buttons">
          Leader Board
        </Link>
      </div>
    </div>
  );
}

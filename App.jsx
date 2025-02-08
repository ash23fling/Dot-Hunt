import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [timer, setTimer] = useState(""); // String for validation
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark Mode state

  useEffect(() => {
    let timerInterval;
    if (isRunning && timeLeft > 0) {
      timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timerInterval);
  }, [isRunning, timeLeft]);

  const onChangeTimer = (event) => {
    const value = event.target.value;
    setTimer(value);
    setErrorMessage(""); // Clear error message when user changes input
  };

  const startGame = () => {
    const parsedTimer = parseInt(timer, 10);
    if (parsedTimer > 0) {
      setTimeLeft(parsedTimer);
      setIsRunning(true);
      setClicks(0);
      setReactionTimes([]);
      setStartTime(Date.now());
    } else {
      setErrorMessage("Please enter a valid time greater than 0.");
    }
  };

  const onClickDot = () => {
    if (!isRunning) return;

    const currentTime = Date.now();
    const reactionTime = (currentTime - startTime) / 1000;
    const formattedReactionTime = parseFloat(reactionTime.toFixed(2));

    setClicks((prevClicks) => prevClicks + 1);
    setReactionTimes((prevTimes) => [
      ...prevTimes,
      { click: clicks + 1, time: formattedReactionTime },
    ]);

    var dot = document.getElementById("dot");

    const screen = document.querySelector('.Screen');
    const screenWidth = screen.clientWidth;
    const screenHeight = screen.clientHeight;

    var newTop = Math.floor(Math.random() * (screenHeight - 30));
    var newLeft = Math.floor(Math.random() * (screenWidth - 30));

    dot.style.top = newTop + "px";
    dot.style.left = newLeft + "px";

    setStartTime(currentTime);
  };

  const resetGame = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setTimer("");
    setClicks(0);
    setReactionTimes([]);
    setErrorMessage(""); // Clear error message on reset
  };

  const pauseGame = () => {
    setIsRunning(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const isStartDisabled = isNaN(timer) || timer <= 0 || timer === "";

  return (
    <div className={`App ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <div className="Header-Title">
        <div className="dark-mode-toggle">
          <button className="toggle-mode" onClick={toggleDarkMode}>
            Toggle {isDarkMode ? "Light" : "Dark"} Mode
          </button>
        </div>
        <strong> THE DOT HUNT </strong>
        <p>
          The rules are simple: click or tap the dot as soon as possible. Your
          reaction time will be displayed in the table below. Enter the time in
          the input box (in seconds), then hit Start. Tap the red dot and check
          your reaction time!
        </p>
      </div>
      <div className="Header">
        <input
          value={timer}
          onChange={onChangeTimer}
          placeholder="Enter time in seconds"
          type="number"
          disabled={isRunning} // Disable input when game is running
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button onClick={startGame} disabled={isStartDisabled || isRunning}>
          Start
        </button>
        <button onClick={pauseGame} disabled={!isRunning}>
          Pause
        </button>
        <button onClick={resetGame}>Reset</button>
      </div>
      <div className={`Screen ${isRunning ? "game-running" : ""}`} style={{ backgroundColor: `rgba(0, 0, 0, ${1 - timeLeft / timer})` }}>
        {isRunning && timeLeft > 0 ? (
          <div id="dot" onClick={onClickDot}></div>
        ) : null}
      </div>
      <div className="ScoreTable">
        <table>
          <thead>
            <tr>
              <th>Clicks</th>
              <th>Reaction Time (s)</th>
            </tr>
          </thead>
          <tbody>
            {reactionTimes.map((entry, index) => (
              <tr key={index}>
                <td>{entry.click}</td>
                <td>{entry.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

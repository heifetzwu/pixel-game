import React, { useState, useEffect } from 'react';
import { fetchQuestions, submitResult } from './api';
import './App.css';

const GAME_STATES = {
  START: 'START',
  PLAYING: 'PLAYING',
  SUBMITTING: 'SUBMITTING',
  FINISHED: 'FINISHED'
};

function App() {
  const [gameState, setGameState] = useState(GAME_STATES.START);
  const [userId, setUserId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]); // Track user choices
  const [score, setScore] = useState(0);
  const [avatars, setAvatars] = useState([]);

  // Preload avatars
  useEffect(() => {
    const seeds = Array.from({ length: 100 }, () => Math.random().toString(36).substring(7));
    const urls = seeds.map(seed => `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`);
    setAvatars(urls);
  }, []);

  const handleStart = async () => {
    if (!userId.trim()) return alert('請輸入 ID');
    setGameState(GAME_STATES.PLAYING);
    const data = await fetchQuestions();
    setQuestions(data);
    setUserAnswers([]);
  };

  const handleAnswer = (choice) => {
    const currentQuestion = questions[currentIndex];
    const newUserAnswers = [...userAnswers, { id: currentQuestion.id, choice }];
    setUserAnswers(newUserAnswers);

    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
    } else {
      finishGame(newUserAnswers);
    }
  };

  const finishGame = async (finalAnswers) => {
    setGameState(GAME_STATES.SUBMITTING);
    // Send answers to GAS for scoring and recording
    await submitResult(userId, finalAnswers);
    setGameState(GAME_STATES.FINISHED);
    // Note: Since we use no-cors, we can't get the score back easily.
    // The score in the sheet will be correct. 
    // For UI, we show a completion message.
  };

  return (
    <div className="game-container">
      {gameState === GAME_STATES.START && (
        <div className="pixel-border start-screen">
          <h1>PIXEL QUEST</h1>
          <input
            type="text"
            placeholder="ENTER YOUR ID 22"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="pixel-input"
          />
          <button onClick={handleStart} className="pixel-button">START GAME</button>
        </div>
      )}

      {gameState === GAME_STATES.PLAYING && questions.length > 0 && (
        <div className="pixel-border game-screen">
          <div className="boss-area">
            <img src={avatars[currentIndex % avatars.length]} alt="Boss" className="boss-avatar" />
            <div className="boss-speech pixel-border">
              {questions[currentIndex].text}
            </div>
          </div>
          <div className="options-area">
            {Object.entries(questions[currentIndex].options).map(([key, value]) => (
              <button key={key} onClick={() => handleAnswer(key)} className="pixel-button option-btn">
                {key}: {value}
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === GAME_STATES.SUBMITTING && (
        <div className="pixel-border loading-screen">
          <p>SUBMITTING SCORES...</p>
        </div>
      )}

      {gameState === GAME_STATES.FINISHED && (
        <div className="pixel-border result-screen">
          <h2>MISSION COMPLETE</h2>
          <p>ID: {userId}</p>
          <p>您的作答已傳送至伺服器進行計分。</p>
          <p>請檢查 Google Sheets 確認您的成績！</p>
          <button onClick={() => window.location.reload()} className="pixel-button">PLAY AGAIN</button>
        </div>
      )}
    </div>
  );
}

export default App;

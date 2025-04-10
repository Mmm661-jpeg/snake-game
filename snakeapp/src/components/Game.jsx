import { useState } from "react";
import GameBoard from "./GameBoard.Jsx";
import "../styles/gameStyle.css";

function Game() {

    let prevHighscore = Number(localStorage.getItem("highScore")) || 0;

    const [gameOver, setGameOver] = useState(false);
    const [gameStarted,setStartGame] = useState(false);

    const [score,setScore] = useState(0)
    const[highscore,setHighScore] = useState(prevHighscore)
    const[mode,setMode] = useState(150)
    //Easy:150, Medium:100, Hard: 70

    const backToMainMenu = () =>
    {
        setGameOver(false);
        setStartGame(false);
        setMode(150);
        setScore(0);
    }

    return (
        <>
            {
                !gameStarted &&
                (
                    <div className="start-screen">
                        <h1>Welcome to</h1>
                        <h1 className="start-screen-snake-title-bottom">Snake</h1>
                        
                        <button className="start-screen-btn start" onClick={()=>setStartGame(true)}>Start Game</button>

                        <button className={`start-screen-btn ${mode===150 ? 'selected':''}`} onClick={()=>setMode(150)}>Easy</button>
                        <button className={`start-screen-btn ${mode===100 ? 'selected':''}`} onClick={()=>setMode(100)}>Medium</button>
                        <button className={`start-screen-btn ${mode===70 ? 'selected':''}`} onClick={()=>setMode(70)}>Hard</button>

           

                   
                      
                    </div>
                )
            }

            {
                gameStarted &&
                (
                    <div className="game-con">
                    {gameOver ? (
                        <div className="game-obj">
                            <h1 className="game-obj-snake-title">Snake</h1>
                            <h2>Game Over!</h2>
                            <p>High-score: {highscore} </p>
                            <p>Score: {score}</p>

                            <button className="gameobj-btn" onClick={() => setGameOver(false)}>Replay</button>
                            <button className="gameobj-btn" onClick={()=>backToMainMenu()}>Main Menu</button>
                        </div>
                        
                        
                    ) : (
                        <GameBoard setGameOver={setGameOver} setScore={setScore} setHighScore={setHighScore} mode={mode}/>
                    )}
                    </div>

                    
                )
            }
        </>
    );
}

export default Game;


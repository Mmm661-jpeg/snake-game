
import { useState,useRef,useEffect } from "react"


function GameBoard({setGameOver,setScore,setHighScore,mode})
{
    let Localhighscore = localStorage.getItem("highScore");
    let unitsize = 25;
    let canvasWidth = 400;
    let canvasHeight = 400;

    const [localScore,setLocalScore] = useState(0);
    const [snake,setSnake] = useState([{x:4 * unitsize,y:0},{x:3 * unitsize,y:0},{x:2 * unitsize,y:0}])
    const [foodXY,setFoodXY] = useState({x:250,y:250})
    const [direction,setDirection] = useState({xVel:unitsize,yVel:0});
    const [localGameOver,setLocalGameOver] = useState(false);

    const Canv = useRef(null)
    const context = useRef(null);
  

    const drawCanvas = () =>
    {
        if (!context.current) return;

        context.current.clearRect(0, 0, canvasWidth, canvasHeight);
        context.current.fillStyle = "purple";
        context.current.fillRect(0, 0, canvasWidth, canvasHeight);

        context.current.strokeStyle = "red";
        context.current.strokeRect(0, 0, canvasWidth, canvasHeight)
    }


    const drawSnake = (color) =>
    {
        context.current.fillStyle = color;
        //context.current.strokeStyle = "black"

        snake.forEach((element) =>
        {
            context.current.fillRect(element.x,element.y,unitsize,unitsize)
            //context.current.strokeRect(element.x,element.y,unitsize,unitsize)
        })
    }

    const drawFood = () =>
    {
        context.current.fillStyle = "red";
        context.current.fillRect(foodXY.x,foodXY.y,unitsize,unitsize);
    }

    useEffect(() =>
    {
        if(Canv.current)
        {
            context.current = Canv.current.getContext("2d");
            drawCanvas();
        }
    },[])

    const makeFood = () =>
    {
        function randomFood(min,max)
        {
            const randnum = Math.round((Math.random() * (max - min) + min) / unitsize) * unitsize;
            return randnum
        }

        let x = randomFood(0,canvasWidth - unitsize);
        let y = randomFood(0,canvasHeight - unitsize);

        //Old problem: Food land on snake:

        //let x = Math.floor(Math.random() * (canvasWidth / unitsize)) * unitsize;
        //let y = Math.floor(Math.random() * (canvasHeight / unitsize)) * unitsize;

        setFoodXY({x,y});
    }

    const moveSnake = () =>
    {
        const newSnake = [...snake]
        let newHead = {x:newSnake[0].x + direction.xVel,y:newSnake[0].y + direction.yVel}

        newSnake.unshift(newHead);

        if(newHead.x === foodXY.x && newHead.y === foodXY.y)
        {
            setLocalScore(prev => prev + 1)
            makeFood();
        }
        else
        {
            newSnake.pop();
        }

        setSnake(newSnake);
    }

    const changeDirection = (event) =>
    {
        const keyPressed = event.key;
        const keypress2 = event.keyCode
        console.log(keyPressed)

        const up = 87;
        const down = 83;
        const right = 68;
        const left = 65;

        //BOOLS:
        const goingUp = (direction.yVel === -unitsize);
        const goingDown = (direction.yVel === unitsize);
        const goingRight = (direction.xVel === unitsize);
        const goingLeft = (direction.xVel === -unitsize);

        switch(true)
        {
            case(!goingDown && keyPressed === "w"):
            setDirection({xVel:0,yVel:-unitsize})
            break;

            case(!goingUp &&  keyPressed === "s"):
            setDirection({xVel:0,yVel:unitsize})
            break;

            case(!goingLeft &&  keyPressed === "d"):
            setDirection({xVel:unitsize,yVel:0})
            break;

            case(!goingRight && keyPressed === "a"):
            setDirection({xVel:-unitsize,yVel:0})
            break;
        }
    }

    const checkEndGame = () =>
    {
        let head = snake[0];
        let result = eatTail();

        switch(true)
        {
            case(head.x < 0):
            setLocalGameOver(true);
            break;

            case(head.x >= canvasWidth):
            setLocalGameOver(true);
            break;

            case(head.y < 0):
            setLocalGameOver(true);
            break;

            case(head.y >= canvasHeight):
            setLocalGameOver(true);
            break;

            case(result === true):
            setLocalGameOver(true);
            break;

            
        }
    }

    const eatTail = () =>
    {
        const head = snake[0];

       const hasEatenTail = snake.slice(1).some(part => part.x === head.x && part.y === head.y);
       return hasEatenTail;
    }

    useEffect(() =>
    {
        const handleKeyDown = (event) => changeDirection(event);
        window.addEventListener("keydown",handleKeyDown)

        return () => window.removeEventListener("keydown",handleKeyDown)
    },[direction])


    useEffect(()=> //game on
    {
        if(localGameOver === true) return;

        const gameLoop = setInterval(() => 
        {
            drawCanvas();
            moveSnake();
            drawFood();
            drawSnake("green");
            checkEndGame();

            
        }, mode); //Mode sent in as prop
        
        return () => clearInterval(gameLoop);
    },[snake,localGameOver,direction])

    useEffect(()=>
    {
        if (!localGameOver) return;

        setDirection({xVel:0,yVel:0});
        drawCanvas()
        drawSnake("red")
        drawFood()

        const endScreen = setTimeout(() => {
            endGame();
            
        }, 2000);

        return () => clearTimeout(endScreen);
    },[localGameOver])

    const endGame = () =>
    {
        //setDirection({xVel:0,yVel:0});

        //drawCanvas()
        //drawFood()
        //drawSnake("red")
        setScore(localScore)

        if(Number(Localhighscore) < localScore)
        {
            localStorage.setItem("highScore",localScore);
            setHighScore(localScore);
        }

        setGameOver(true);

    }


    //Hard,Medium,Easy

    return(
        <>
        <div className="game-obj">
            <h1>Snake</h1>
            <p>Highscore: {Localhighscore} </p>
            <p>Score : {localScore} </p>
        </div>

        <canvas ref={Canv} width={canvasWidth} height={canvasHeight}></canvas>

        </>
            
    )

}

export default GameBoard
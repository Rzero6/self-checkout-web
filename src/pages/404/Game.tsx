import { useState, useEffect, useRef } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const GRAVITY = 0.5;
const JUMP = -8;
const OBSTACLE_SPEED = 4;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_GAP_VERTICAL = 150;
const OBSTACLE_GAP_HORIZONTAL = 450;
const GAME_HEIGHT = 320;
const MIN_SCORE_TO_UNLOCK = 1000;
const BIRD_WIDTH = 20;
const BIRD_HEIGHT = 20;

export const FlappyTriangle = () => {
    const navigate = useNavigate();
    const { width, height } = useWindowSize();
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const [bestScore, setBestScore] = useState(() => {
        return parseInt(sessionStorage.getItem("bestScore") || "0");
    });

    const [birdY, setBirdY] = useState(150);
    const [velocity, setVelocity] = useState(0);
    const [obstacles, setObstacles] = useState<{ x: number; height: number }[]>([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const jump = () => {
        if (!gameOver) setVelocity(JUMP);
        else resetGame();
    };

    const resetGame = () => {
        setBirdY(150);
        setVelocity(0);
        setObstacles([]);
        setScore(0);
        setGameOver(false);
    };

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.code === "Space") jump();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [gameOver]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (gameOver) return;

            //calculate obstacle speed
            const speedMultiplayer = score >= MIN_SCORE_TO_UNLOCK ? score / MIN_SCORE_TO_UNLOCK : 1;
            const obstacleSpeed = OBSTACLE_SPEED * speedMultiplayer;
            setVelocity((v) => v + GRAVITY);
            setBirdY((y) => y + velocity);
            //Update obstacles
            setObstacles((obs) => {
                const newObs = obs.map((o) => ({ ...o, x: o.x - obstacleSpeed })).filter((o) => o.x + OBSTACLE_WIDTH > 0);

                if (newObs.length === 0 || newObs[newObs.length - 1].x < 300) {
                    const height = Math.random() * GAME_HEIGHT / 2 * 3 / 4 + (GAME_HEIGHT / 2 * 1 / 4);
                    newObs.push({ x: OBSTACLE_GAP_HORIZONTAL, height });
                }

                return newObs;
            });

            // Collision detection
            const hit = obstacles.some((o) => {
                const birdLeft = 50;
                const birdRight = birdLeft + BIRD_WIDTH;
                const birdTop = birdY;
                const birdBottom = birdY + BIRD_HEIGHT;

                const horizontalOverlap = birdRight > o.x && birdLeft < o.x + OBSTACLE_WIDTH;
                const verticalOverlapTop = birdTop < o.height;
                const verticalOverlapBottom = birdBottom > o.height + OBSTACLE_GAP_VERTICAL;

                return horizontalOverlap && (verticalOverlapTop || verticalOverlapBottom);
            });

            if (birdY > GAME_HEIGHT || birdY < 0 || hit) setGameOver(true);

            setScore((s) => {
                const newScore = s + 1;
                setBestScore((prevBest) => {
                    const updatedBest = Math.max(prevBest, newScore);
                    sessionStorage.setItem("bestScore", updatedBest.toString());
                    return updatedBest;
                });
                return newScore;
            });

        }, 30);

        return () => clearInterval(interval);
    }, [birdY, velocity, obstacles, gameOver]);

    return (
        <div className="flex flex-col items-center">
            {score > MIN_SCORE_TO_UNLOCK && <Confetti width={width} height={height} />}
            <div
                ref={gameAreaRef}
                className="relative w-80 h-80 bg-secondary backdrop-blur-md rounded-lg overflow-hidden mb-4 cursor-pointer border border-accent/40"
                onClick={jump}
            >
                <TriangleAlert
                    className="absolute text-red-500"
                    style={{ width: 30, height: 30, top: birdY, left: 50, transition: "top 0.03s" }}
                />
                {obstacles.map((o, i) => (
                    <div key={i}>
                        <div className="absolute bg-accent" style={{ height: o.height, width: OBSTACLE_WIDTH, left: o.x, top: 0 }} />
                        <div
                            className="absolute bg-accent"
                            style={{ height: GAME_HEIGHT - o.height - OBSTACLE_GAP_VERTICAL, width: OBSTACLE_WIDTH, left: o.x, top: o.height + OBSTACLE_GAP_VERTICAL }}
                        />
                    </div>
                ))}
            </div>
            <div className="flex w-full items-center justify-between px-5 mx-5">
                <p className="text-lg font-semibold text-secondary-foreground mb-4">Score: {score}</p>
                {bestScore > 0 && (
                    <p className="text-lg font-semibold text-secondary-foreground mb-4">Best Score: {bestScore}</p>
                )}
            </div>
            <Button
                onClick={() => navigate("/")}
                disabled={bestScore < MIN_SCORE_TO_UNLOCK}
            >
                Return Home
            </Button>
            <p className="text-md font-semibold text-secondary-foreground mt-4">Score {`>`} {MIN_SCORE_TO_UNLOCK} to unlock Return Home button</p>
            {gameOver ? (<p className="text-destructive font-bold mt-2">Game Over! Click or press Space to restart</p>)
                : (<p className="text-accent-foreground font-bold mt-2">You can do it!</p>)}
        </div>
    );
};

import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { FlappyTriangle } from "./Game";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const [gameState, setGameState] = useState(false);


  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary-foreground px-6">
      {!gameState ? (
        <>
          <TriangleAlert className="h-16 w-16 text-destructive animate-bounce mb-6" />
          <h1 className="text-6xl font-extrabold text-accent-secondary mb-4 drop-shadow-lg">
            404
          </h1>
          <p className="text-xl text-secondary-foreground mb-8">
            Oops! The page <span className="font-mono text-destructive">{location.pathname}</span> does not exist.
          </p>
          <Button
            variant={"destructive"}
            onClick={() => setGameState(true)}
          >
            Return Home
          </Button>
          <p className="mt-10 text-secondary-foreground text-sm text-center max-w-xs">
            If you think this is a mistake, well it's your mistake. Not my problem 😶‍🌫️.
          </p>
        </>
      ) : <FlappyTriangle />}
    </div>
  );
};

export default NotFound;

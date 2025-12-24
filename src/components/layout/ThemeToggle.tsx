import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "../ui/button"

const ThemeToggle = () => {
    const { resolvedTheme, setTheme } = useTheme()

    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
        >
            {resolvedTheme === "dark" ? (
                <SunIcon className="h-4 w-4" />
            ) : (
                <MoonIcon className="h-4 w-4" />
            )}
        </Button>
    )
}

export default ThemeToggle

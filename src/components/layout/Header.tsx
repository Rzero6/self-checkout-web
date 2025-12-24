import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Store, Barcode, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import ThemeToggle from "./ThemeToggle";

export const Header = () => {
    const location = useLocation();
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60">
            <div className="mx-auto max-w-7xl px-4 flex h-16 items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <Store className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="hidden sm:block">
                        <h1 className="text-lg font-bold leading-none">Self Checkout</h1>
                        <p className="text-xs text-muted-foreground">Cashier</p>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <nav className="hidden md:flex items-center gap-2">
                    <Button
                        variant={location.pathname === "/" ? "default" : "ghost"}
                        size="sm"
                        asChild
                    >
                        <Link to="/">
                            <Store className="h-4 w-4 mr-2" />
                            Cashier
                        </Link>
                    </Button>

                    <Button
                        variant={location.pathname === "/barcode-generator" ? "default" : "ghost"}
                        size="sm"
                        asChild
                    >
                        <Link to="/barcode-generator">
                            <Barcode className="h-4 w-4 mr-2" />
                            Generator Barcode
                        </Link>
                    </Button>

                    <ThemeToggle />
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <ThemeToggle />
                    <button
                        onClick={() => setOpen(!open)}
                        className="ml-2 p-2 rounded-md hover:bg-muted/20"
                    >
                        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="md:hidden px-4 pb-4 flex flex-col gap-2">
                    <Button
                        variant={location.pathname === "/" ? "default" : "ghost"}
                        size="sm"
                        asChild
                    >
                        <Link to="/" onClick={() => setOpen(false)}>
                            <Store className="h-4 w-4 mr-2" />
                            Cashier
                        </Link>
                    </Button>

                    <Button
                        variant={location.pathname === "/barcode-generator" ? "default" : "ghost"}
                        size="sm"
                        asChild
                    >
                        <Link to="/barcode-generator" onClick={() => setOpen(false)}>
                            <Barcode className="h-4 w-4 mr-2" />
                            Generator Barcode
                        </Link>
                    </Button>
                </div>
            )}
        </header>
    );
};

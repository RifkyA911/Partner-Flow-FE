"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
	theme: Theme;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState<Theme>("dark");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const savedTheme = localStorage.getItem("theme") as Theme | null;
		if (savedTheme) {
			setTheme(savedTheme);
		} else {
			// Apply initial theme immediately
			document.documentElement.classList.add("dark");
			document.body.classList.add("bg-slate-950", "text-white");
		}
	}, []);

	useEffect(() => {
		if (mounted) {
			document.documentElement.classList.toggle("dark", theme === "dark");
			// Apply theme classes to body
			const body = document.body;
			if (theme === "dark") {
				body.classList.remove("bg-gray-50", "text-gray-900");
				body.classList.add("bg-slate-950", "text-white");
			} else {
				body.classList.remove("bg-slate-950", "text-white");
				body.classList.add("bg-gray-50", "text-gray-900");
			}
			localStorage.setItem("theme", theme);
		}
	}, [theme, mounted]);

	const toggleTheme = () => {
		setTheme((prev) => (prev === "dark" ? "light" : "dark"));
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}

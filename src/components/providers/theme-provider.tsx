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
		}
	}, []);

	useEffect(() => {
		if (mounted) {
			document.documentElement.classList.toggle("dark", theme === "dark");
			document.body.className = document.body.className.replace(/bg-\w+-\d+/g, theme === "dark" ? "bg-slate-950" : "bg-gray-50");
			document.body.className = document.body.className.replace(/text-\w+-\d+/g, theme === "dark" ? "text-white" : "text-gray-900");
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

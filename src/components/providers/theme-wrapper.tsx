"use client";

import { ReactNode } from "react";
import { useTheme } from "./theme-provider";

export function ThemeWrapper({ children }: { children: ReactNode }) {
	const { theme } = useTheme();

	return <>{children}</>;
}

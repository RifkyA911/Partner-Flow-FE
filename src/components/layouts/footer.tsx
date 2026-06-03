"use client";

import { useState, useEffect } from "react";
import { Github, Zap, Heart } from "lucide-react";

export function Footer() {
	const [isDark, setIsDark] = useState(true);

	useEffect(() => {
		const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
		checkTheme();

		const observer = new MutationObserver(checkTheme);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

		return () => observer.disconnect();
	}, []);

	return (
		<footer className={`w-full border-t ${isDark ? "bg-slate-950 border-white/10" : "bg-white border-gray-200"}`}>
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="flex flex-col md:flex-row items-center justify-between gap-4">
					{/* Logo and Beta Badge */}
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2">
							<div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
								<Zap className="w-3.5 h-3.5 text-white" />
							</div>
							<span className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
								Partner Flow
							</span>
						</div>
						<div className={`px-2 py-0.5 rounded-full text-xs font-medium ${isDark ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" : "bg-yellow-100 text-yellow-700 border border-yellow-300"}`}>
							Beta
						</div>
					</div>

					{/* Credits */}
					<div className={`flex items-center gap-2 text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
						<span>Built with</span>
						<Heart className="w-3 h-3 text-red-500 fill-red-500" />
						<span>by</span>
						<a
							href="https://github.com/RifkyA911"
							target="_blank"
							rel="noopener noreferrer"
							className={`flex items-center gap-1 hover:text-blue-400 transition-colors ${isDark ? "text-gray-300" : "text-gray-700"}`}
						>
							<Github className="w-3.5 h-3.5" />
							<span>RifkyA911</span>
						</a>
					</div>

					{/* Portfolio Note */}
					<div className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
						Portfolio Showcase Only
					</div>
				</div>
			</div>
		</footer>
	);
}

"use client";

import Lottie from "lottie-react";
import { useEffect, useState } from "react";

interface LoadingAnimationProps {
	type?: "loading" | "sending" | "rendering" | "success" | "error";
	size?: number;
	className?: string;
}

const animations = {
	loading: "https://lottie.host/your-loading-animation.json",
	sending: "https://lottie.host/your-sending-animation.json",
	rendering: "https://lottie.host/your-rendering-animation.json",
	success: "https://lottie.host/your-success-animation.json",
	error: "https://lottie.host/your-error-animation.json",
};

export function LoadingAnimation({ type = "loading", size = 200, className = "" }: LoadingAnimationProps) {
	const [animationData, setAnimationData] = useState<any>(null);

	useEffect(() => {
		// For now, use a simple CSS animation as fallback
		// In production, you would fetch the actual Lottie JSON
		setAnimationData(null);
	}, [type]);

	if (animationData) {
		return (
			<div className={className} style={{ width: size, height: size }}>
				<Lottie animationData={animationData} />
			</div>
		);
	}

	// Fallback CSS animation
	return (
		<div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
			<div className="relative">
				<div className="absolute inset-0 rounded-full border-4 border-blue-500/20 animate-ping" />
				<div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
				<div className="absolute inset-2 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" style={{ animationDuration: "1.5s" }} />
			</div>
		</div>
	);
}

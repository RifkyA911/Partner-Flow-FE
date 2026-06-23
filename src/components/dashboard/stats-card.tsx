"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { FaUsers, FaCheckCircle, FaClock, FaDollarSign } from "react-icons/fa";

interface StatsCardProps {
	icon: React.ReactNode;
	title: string;
	value: string | number;
	subtitle: string;
	isDark: boolean;
}

export function StatsCard({ icon, title, value, subtitle, isDark }: StatsCardProps) {
	return (
		<Card className={`${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"} transition-all duration-300 hover:shadow-lg hover:scale-105`}>
			<CardContent className="p-4 sm:p-6">
				<div className={`w-6 h-6 mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
					{icon}
				</div>
				<CardTitle className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
					{title}
				</CardTitle>
				<div className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
					{typeof value === "number" ? value.toLocaleString('id-ID') : value}
				</div>
				<p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
					{subtitle}
				</p>
			</CardContent>
		</Card>
	);
}

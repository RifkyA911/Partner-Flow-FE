"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { FaCog, FaUser, FaBell, FaShieldAlt, FaPalette, FaSave, FaKey, FaEnvelope, FaPhone } from "react-icons/fa";

export default function SettingsPage() {
	const { data: session, update } = useSession();
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [isDark, setIsDark] = useState(true);

	const [formData, setFormData] = useState({
		name: session?.user?.name || "",
		email: session?.user?.email || "",
		phone: "",
		company: "",
		notifications: {
			email: true,
			sms: false,
			push: true,
		},
		security: {
			twoFactor: false,
			loginAlerts: true,
		},
		preferences: {
			theme: "dark",
			language: "en",
		},
	});

	useEffect(() => {
		const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
		checkTheme();
		const observer = new MutationObserver(checkTheme);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
		return () => observer.disconnect();
	}, []);

	const handleSave = async (section: string) => {
		setLoading(true);
		setMessage("");
		try {
			// TODO: Replace with actual API call
			// const res = await fetch(`${baseUrl}/api/settings`, {
			// 	method: "PUT",
			// 	headers: { "Content-Type": "application/json" },
			// 	body: JSON.stringify({ section, data: formData }),
			// });
			// const data = await res.json();
			// if (data.success) {
			// 	setMessage("Settings saved successfully");
			// 	await update();
			// } else {
			// 	setMessage("Failed to save settings");
			// }

			setMessage("Settings saved successfully");
		} catch {
			setMessage("Failed to save settings");
		} finally {
			setLoading(false);
		}
	};

	const toggleTheme = () => {
		const newTheme = isDark ? "light" : "dark";
		document.documentElement.classList.toggle("dark");
		setIsDark(!isDark);
		setFormData({
			...formData,
			preferences: { ...formData.preferences, theme: newTheme },
		});
	};

	if (session?.user?.role !== "partner") {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-gray-500">Access denied. Partners only.</p>
			</div>
		);
	}

	return (
		<DashboardLayout>
			<div className="space-y-6">
				{/* Header */}
				<Card className={`${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
					<CardHeader className="p-4 sm:p-6">
						<div className="flex items-center gap-3">
							<div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-gradient-to-br from-purple-500 to-pink-500" : "bg-gradient-to-br from-purple-600 to-pink-600"}`}>
								<FaCog className="w-5 h-5 text-white" />
							</div>
							<div>
								<CardTitle className={`text-lg sm:text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
									Account Settings
								</CardTitle>
								<CardDescription className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
									Manage your account preferences and security
								</CardDescription>
							</div>
						</div>
					</CardHeader>
				</Card>

				{message && (
					<div className={`p-4 rounded-lg text-sm ${message.includes("success") ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
						{message}
					</div>
				)}

				{/* Profile Settings */}
				<Card className={`${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
					<CardHeader className="p-4 sm:p-6">
						<div className="flex items-center gap-3">
							<FaUser className={`w-5 h-5 ${isDark ? "text-gray-300" : "text-gray-700"}`} />
							<CardTitle className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
								Profile Information
							</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="p-4 sm:p-6 space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
									Full Name
								</label>
								<Input
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									className={isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}
								/>
							</div>
							<div>
								<label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
									Email Address
								</label>
								<div className="relative">
									<Input
										value={formData.email}
										onChange={(e) => setFormData({ ...formData, email: e.target.value })}
										className={`pl-10 ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}`}
									/>
									<FaEnvelope className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
								</div>
							</div>
							<div>
								<label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
									Phone Number
								</label>
								<div className="relative">
									<Input
										value={formData.phone}
										onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
										placeholder="+62 812 3456 7890"
										className={`pl-10 ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}`}
									/>
									<FaPhone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
								</div>
							</div>
							<div>
								<label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
									Company Name
								</label>
								<Input
									value={formData.company}
									onChange={(e) => setFormData({ ...formData, company: e.target.value })}
									className={isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}
								/>
							</div>
						</div>
						<Button onClick={() => handleSave("profile")} disabled={loading} className="gap-2">
							<FaSave className="w-4 h-4" />
							{loading ? "Saving..." : "Save Profile"}
						</Button>
					</CardContent>
				</Card>

				{/* Security Settings */}
				<Card className={`${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
					<CardHeader className="p-4 sm:p-6">
						<div className="flex items-center gap-3">
							<FaShieldAlt className={`w-5 h-5 ${isDark ? "text-gray-300" : "text-gray-700"}`} />
							<CardTitle className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
								Security
							</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="p-4 sm:p-6 space-y-6">
						<div className="flex items-center justify-between">
							<div>
								<h4 className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Two-Factor Authentication</h4>
								<p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
									Add an extra layer of security to your account
								</p>
							</div>
							<Switch
								checked={formData.security.twoFactor}
								onCheckedChange={(checked: boolean) =>
									setFormData({
										...formData,
										security: { ...formData.security, twoFactor: checked },
									})
								}
							/>
						</div>
						<div className="flex items-center justify-between">
							<div>
								<h4 className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Login Alerts</h4>
								<p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
									Receive notifications when someone logs into your account
								</p>
							</div>
							<Switch
								checked={formData.security.loginAlerts}
								onCheckedChange={(checked: boolean) =>
									setFormData({
										...formData,
										security: { ...formData.security, loginAlerts: checked },
									})
								}
							/>
						</div>
						<div className="pt-4 border-t border-white/10">
							<Button variant="outline" className="gap-2">
								<FaKey className="w-4 h-4" />
								Change Password
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Notification Settings */}
				<Card className={`${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
					<CardHeader className="p-4 sm:p-6">
						<div className="flex items-center gap-3">
							<FaBell className={`w-5 h-5 ${isDark ? "text-gray-300" : "text-gray-700"}`} />
							<CardTitle className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
								Notifications
							</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="p-4 sm:p-6 space-y-6">
						<div className="flex items-center justify-between">
							<div>
								<h4 className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Email Notifications</h4>
								<p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
									Receive updates via email
								</p>
							</div>
							<Switch
								checked={formData.notifications.email}
								onCheckedChange={(checked: boolean) =>
									setFormData({
										...formData,
										notifications: { ...formData.notifications, email: checked },
									})
								}
							/>
						</div>
						<div className="flex items-center justify-between">
							<div>
								<h4 className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>SMS Notifications</h4>
								<p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
									Receive updates via SMS
								</p>
							</div>
							<Switch
								checked={formData.notifications.sms}
								onCheckedChange={(checked: boolean) =>
									setFormData({
										...formData,
										notifications: { ...formData.notifications, sms: checked },
									})
								}
							/>
						</div>
						<div className="flex items-center justify-between">
							<div>
								<h4 className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Push Notifications</h4>
								<p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
									Receive browser push notifications
								</p>
							</div>
							<Switch
								checked={formData.notifications.push}
								onCheckedChange={(checked: boolean) =>
									setFormData({
										...formData,
										notifications: { ...formData.notifications, push: checked },
									})
								}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Appearance Settings */}
				<Card className={`${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
					<CardHeader className="p-4 sm:p-6">
						<div className="flex items-center gap-3">
							<FaPalette className={`w-5 h-5 ${isDark ? "text-gray-300" : "text-gray-700"}`} />
							<CardTitle className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
								Appearance
							</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="p-4 sm:p-6 space-y-6">
						<div className="flex items-center justify-between">
							<div>
								<h4 className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Dark Mode</h4>
								<p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
									Toggle dark/light theme
								</p>
							</div>
							<Switch checked={isDark} onCheckedChange={toggleTheme} />
						</div>
					</CardContent>
				</Card>
			</div>
		</DashboardLayout>
	);
}

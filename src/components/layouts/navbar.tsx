"use client";
import { usePathname } from "next/navigation";
import { ArrowRight, LogIn, Menu, X, Zap, Sun, Moon, User, Settings, LogOut as LogoutIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/components/providers/theme-provider";
import { signOut } from "next-auth/react";

export function NavbarMenu() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
	const pathname = usePathname();
	const { theme, toggleTheme } = useTheme();

	const isHomePage = pathname === "/";
	const isDashboardPage = pathname === "/dashboard";
	const isDark = theme === "dark";

	const handleLogout = async () => {
		await signOut({ callbackUrl: "/" });
	};

	// Show navbar on register page with back button
	if (pathname === "/auth/register") {
		return (
			<header className={`w-full backdrop-blur-lg border-b sticky top-0 z-50 ${isDark ? "bg-slate-950/80 border-white/10" : "bg-white/90 border-gray-200"}`}>
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-14">
						{/* Back button */}
						<Link href="/" className="flex items-center gap-2 group">
							<Button variant="ghost" size="sm" className={`${isDark ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}>
								<ArrowRight className="w-4 h-4 rotate-180" />
							</Button>
							<div className="flex items-center gap-2">
								<div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
									<Zap className="w-5 h-5 text-white" />
								</div>
								<h1 className={`text-lg font-bold bg-gradient-to-r ${isDark ? "from-white to-gray-300" : "from-gray-900 to-gray-700"} bg-clip-text text-transparent`}>
									Partner Flow
								</h1>
							</div>
						</Link>

						{/* Theme toggle */}
						<Button
							variant="ghost"
							size="sm"
							onClick={toggleTheme}
							className={`${isDark ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"} transition-all`}
						>
							{isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
						</Button>
					</div>
				</div>
			</header>
		);
	}

	// Show navbar on dashboard page with account dropdown
	if (isDashboardPage) {
		return (
			<header className={`w-full backdrop-blur-lg border-b sticky top-0 z-50 ${isDark ? "bg-slate-950/80 border-white/10" : "bg-white/90 border-gray-200"}`}>
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-14">
						{/* Logo */}
						<Link href="/" className="flex items-center gap-2">
							<div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
								<Zap className="w-5 h-5 text-white" />
							</div>
							<h1 className={`text-lg font-bold bg-gradient-to-r ${isDark ? "from-white to-gray-300" : "from-gray-900 to-gray-700"} bg-clip-text text-transparent`}>
								Partner Flow
							</h1>
						</Link>

						<div className="flex items-center gap-2">
							{/* Theme toggle */}
							<Button
								variant="ghost"
								size="sm"
								onClick={toggleTheme}
								className={`${isDark ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"} transition-all`}
							>
								{isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
							</Button>
							{/* Account dropdown */}
							<div className="relative">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
									className={`${isDark ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"} transition-all text-xs gap-2`}
								>
									<User className="w-4 h-4" />
									Account
								</Button>
								{isAccountDropdownOpen && (
									<div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border ${isDark ? "bg-slate-900 border-white/10" : "bg-white border-gray-200"}`}>
										<div className="py-1">
											<Link href="/dashboard/profile">
												<div className={`flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${isDark ? "text-gray-300 hover:bg-white/10" : "text-gray-700 hover:bg-gray-100"}`}>
													<User className="w-4 h-4" />
													Profile
												</div>
											</Link>
											<Link href="/dashboard/settings">
												<div className={`flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${isDark ? "text-gray-300 hover:bg-white/10" : "text-gray-700 hover:bg-gray-100"}`}>
													<Settings className="w-4 h-4" />
													Settings
												</div>
											</Link>
											<div className={`border-t my-1 ${isDark ? "border-white/10" : "border-gray-200"}`}></div>
											<button
												onClick={handleLogout}
												className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${isDark ? "text-gray-300 hover:bg-white/10" : "text-gray-700 hover:bg-gray-100"}`}
											>
												<LogoutIcon className="w-4 h-4" />
												Log out
											</button>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</header>
		);
	}

	return (
		<header className={`w-full backdrop-blur-lg border-b sticky top-0 z-50 ${isDark ? "bg-slate-950/80 border-white/10" : "bg-white/90 border-gray-200"}`}>
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-14">
					{/* Logo and Title */}
					<Link href="/" className="flex items-center gap-2 group">
						<div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
							<Zap className="w-5 h-5 text-white" />
						</div>
						<div>
							<h1 className={`text-lg font-bold bg-gradient-to-r ${isDark ? "from-white to-gray-300" : "from-gray-900 to-gray-700"} bg-clip-text text-transparent`}>
								Partner Flow
							</h1>
							<p className={`text-xs hidden sm:block ${isDark ? "text-gray-400" : "text-gray-600"}`}>Referral Platform</p>
						</div>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center gap-4">
						{isHomePage && (
							<nav className="flex items-center gap-4">
								<a href="#features" className={`${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors text-xs font-medium`}>
									Features
								</a>
								<a href="#how-it-works" className={`${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors text-xs font-medium`}>
									How It Works
								</a>
								<a href="#benefits" className={`${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors text-xs font-medium`}>
									Benefits
								</a>
							</nav>
						)}

						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={toggleTheme}
								className={`${isDark ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"} transition-all`}
							>
								{isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
							</Button>
							<Link href="/auth/login">
								<Button
									variant="ghost"
									size="sm"
									className={`${isDark ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"} transition-all text-xs`}
								>
									<LogIn className="w-3 h-3 mr-1" />
									Login
								</Button>
							</Link>
							<Link href="/auth/register">
								<Button
									size="sm"
									className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-xs"
								>
									Get Started
									<ArrowRight className="w-3 h-3 ml-1" />
								</Button>
							</Link>
						</div>
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<Button
							variant="ghost"
							size="sm"
							onClick={() =>
								setIsMobileMenuOpen(!isMobileMenuOpen)
							}
							className={`${isDark ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
						>
							{isMobileMenuOpen ? (
								<X className="w-4 h-4" />
							) : (
								<Menu className="w-4 h-4" />
							)}
						</Button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isMobileMenuOpen && (
					<div className={`md:hidden py-4 border-t animate-in slide-in-from-top-2 ${isDark ? "border-white/10" : "border-gray-200"}`}>
						<div className="flex flex-col gap-2">
							{isHomePage && (
								<>
									<a
										href="#features"
										className={`${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors text-sm font-medium py-2`}
										onClick={() => setIsMobileMenuOpen(false)}
									>
										Features
									</a>
									<a
										href="#how-it-works"
										className={`${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors text-sm font-medium py-2`}
										onClick={() => setIsMobileMenuOpen(false)}
									>
										How It Works
									</a>
									<a
										href="#benefits"
										className={`${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors text-sm font-medium py-2`}
										onClick={() => setIsMobileMenuOpen(false)}
									>
										Benefits
									</a>
								</>
							)}
							<div className="flex items-center gap-2 pt-2">
								<Button
									variant="ghost"
									size="sm"
									onClick={toggleTheme}
									className={`${isDark ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"} transition-all`}
								>
									{isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
								</Button>
							</div>
							<div className="flex flex-col gap-2 pt-2">
								<Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
									<Button
										variant="outline"
										size="sm"
										className={`w-full justify-start ${isDark ? "border-white/20 text-gray-300 hover:text-white hover:bg-white/10" : "border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
									>
										<LogIn className="w-4 h-4 mr-2" />
										Login
									</Button>
								</Link>
								<Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
									<Button
										size="sm"
										className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
									>
										Get Started
										<ArrowRight className="w-4 h-4 ml-2" />
									</Button>
								</Link>
							</div>
						</div>
					</div>
				)}
			</div>
		</header>
	);
}

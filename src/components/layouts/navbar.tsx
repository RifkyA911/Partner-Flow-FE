"use client";
import { usePathname } from "next/navigation";
import { Network, Plus, Download, Eye, LogOut, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

export function NavbarMenu() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const pathname = usePathname();

	if (pathname === "/auth/register") return null;

	return (
		<header className="w-full bg-white border-b-2 border-gray-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo and Title */}
					<div className="flex items-center gap-3">
						<Network className="w-6 h-6 text-blue-600" />
						<h1 className="text-lg sm:text-xl font-semibold text-gray-900">
							Partner Referral Hub - Admin
						</h1>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center gap-2 lg:gap-3">
						<Button
							variant="outline"
							size="sm"
							className="gap-2 bg-transparent text-xs lg:text-sm"
						>
							<Plus className="w-4 h-4" />
							<span className="hidden lg:inline">
								Import Partners
							</span>
							<span className="lg:hidden">Import</span>
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="gap-2 bg-transparent text-xs lg:text-sm"
						>
							<Download className="w-4 h-4" />
							<span className="hidden lg:inline">
								Download Reports
							</span>
							<span className="lg:hidden">Download</span>
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="gap-2 bg-transparent text-xs lg:text-sm"
						>
							<Eye className="w-4 h-4" />
							<span className="hidden lg:inline">
								Customer View
							</span>
							<span className="lg:hidden">View</span>
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="gap-2 bg-transparent text-xs lg:text-sm"
						>
							<LogOut className="w-4 h-4" />
							<span className="hidden lg:inline">Logout</span>
							<span className="lg:hidden">Logout</span>
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="bg-transparent"
						>
							Admin
						</Button>
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<Button
							variant="outline"
							size="sm"
							onClick={() =>
								setIsMobileMenuOpen(!isMobileMenuOpen)
							}
							className="gap-2 bg-transparent"
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
					<div className="md:hidden py-4 border-t border-gray-200">
						<div className="flex flex-col gap-2">
							<Button
								variant="outline"
								size="sm"
								className="gap-2 bg-transparent justify-start"
							>
								<Plus className="w-4 h-4" />
								Import Partners
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="gap-2 bg-transparent justify-start"
							>
								<Download className="w-4 h-4" />
								Download Reports
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="gap-2 bg-transparent justify-start"
							>
								<Eye className="w-4 h-4" />
								Customer View
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="gap-2 bg-transparent justify-start"
							>
								<LogOut className="w-4 h-4" />
								Logout
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="bg-transparent"
							>
								Admin
							</Button>
						</div>
					</div>
				)}
			</div>
		</header>
	);
}

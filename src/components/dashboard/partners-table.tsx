"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HiOutlineEye, HiOutlineEyeOff, HiOutlineClipboardCopy, HiOutlineMail, HiOutlinePhone, HiOutlineTrash, HiOutlinePencil } from "react-icons/hi";
import { FaUsers, FaDownload } from "react-icons/fa";

interface Partner {
	id: string;
	partner_code: string;
	company_name: string;
	contact_person: string;
	email: string;
	phone: string;
	status: string;
	created_at: string;
}

interface PartnersTableProps {
	partners: Partner[];
	isDark: boolean;
	showPasswords: boolean;
	onTogglePasswords: () => void;
}

export function PartnersTable({ partners, isDark, showPasswords, onTogglePasswords }: PartnersTableProps) {
	const [copiedCode, setCopiedCode] = useState<string | null>(null);

	const handleCopyCode = (code: string) => {
		navigator.clipboard.writeText(code);
		setCopiedCode(code);
		setTimeout(() => setCopiedCode(null), 2000);
	};

	return (
		<Card className={`${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"} transition-all duration-300 hover:shadow-lg`}>
			<CardHeader className="p-4 sm:p-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-gradient-to-br from-blue-500 to-purple-600" : "bg-gradient-to-br from-blue-600 to-purple-700"}`}>
							<FaUsers className="w-5 h-5 text-white" />
						</div>
						<div>
							<CardTitle className={`text-lg sm:text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
								Partners Management
							</CardTitle>
							<p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
								{partners.length} partners registered
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							className={`gap-2 bg-transparent ${isDark ? "border-white/20 text-gray-300 hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
							onClick={onTogglePasswords}
						>
							{showPasswords ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
							<span className="hidden sm:inline">Show Passwords</span>
						</Button>
						<Button
							size="sm"
							className={`gap-2 text-xs sm:text-sm transition-all duration-300 ${isDark ? "bg-white/10 text-gray-300 hover:bg-white/20 hover:scale-105" : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105"}`}
						>
							<FaDownload className="w-4 h-4" />
							<span className="hidden sm:inline">Export</span>
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-0 sm:p-6">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className={`border-b ${isDark ? "border-white/10" : "border-gray-200"}`}>
								<th className={`text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
									Company
								</th>
								<th className={`text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm hidden sm:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>
									Contact
								</th>
								<th className={`text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
									Referral Code
								</th>
								<th className={`text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm hidden lg:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>
									Password
								</th>
								<th className={`text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm hidden md:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>
									Status
								</th>
								<th className={`text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm hidden lg:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>
									Created
								</th>
								<th className={`text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{partners.map((partner, index) => (
								<tr key={index} className={`border-b transition-all duration-200 ${isDark ? "border-white/5 hover:bg-white/5" : "border-gray-100 hover:bg-gray-50"}`}>
									<td className="py-3 sm:py-4 px-2 sm:px-4">
										<div className="flex items-center gap-3">
											<div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${isDark ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white" : "bg-gradient-to-br from-blue-600 to-purple-700 text-white"}`}>
												{partner.company_name.charAt(0).toUpperCase()}
											</div>
											<div>
												<div className={`font-medium text-xs sm:text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
													{partner.company_name}
												</div>
												<div className={`text-xs hidden sm:block ${isDark ? "text-gray-400" : "text-gray-600"}`}>
													{partner.email}
												</div>
											</div>
										</div>
									</td>
									<td className="py-3 sm:py-4 px-2 sm:px-4 hidden sm:table-cell">
										<div>
											<div className={`font-medium text-xs sm:text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
												{partner.contact_person}
											</div>
											<div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
												{partner.phone}
											</div>
										</div>
									</td>
									<td className="py-3 sm:py-4 px-2 sm:px-4">
										<div className="flex items-center gap-2">
											<span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"}`}>
												{partner.partner_code}
											</span>
											<button
												onClick={() => handleCopyCode(partner.partner_code)}
												className={`p-1.5 rounded-lg transition-colors ${isDark ? "text-gray-400 hover:text-white hover:bg-white/10" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
												title="Copy referral code"
											>
												{copiedCode === partner.partner_code ? (
													<HiOutlineClipboardCopy className="w-4 h-4 text-green-500" />
												) : (
													<HiOutlineClipboardCopy className="w-4 h-4" />
												)}
											</button>
										</div>
									</td>
									<td className="py-3 sm:py-4 px-2 sm:px-4 hidden lg:table-cell">
										<div className="flex items-center gap-2">
											<span className={`text-xs sm:text-sm font-mono ${isDark ? "text-gray-400" : "text-gray-500"}`}>
												{showPasswords ? "••••••••" : "••••••••"}
											</span>
										</div>
									</td>
									<td className="py-3 sm:py-4 px-2 sm:px-4 hidden md:table-cell">
										<span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${partner.status === 'active' ? "bg-green-500/20 text-green-400" : partner.status === 'inactive' ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"}`}>
											{partner.status}
										</span>
									</td>
									<td className="py-3 sm:py-4 px-2 sm:px-4 hidden lg:table-cell">
										<span className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
											{new Date(partner.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
										</span>
									</td>
									<td className="py-3 sm:py-4 px-2 sm:px-4">
										<div className="flex items-center gap-1">
											<button
												className={`p-1.5 rounded-lg transition-colors ${isDark ? "text-gray-400 hover:text-blue-400 hover:bg-white/10" : "text-gray-400 hover:text-blue-600 hover:bg-gray-100"}`}
												title="Send email"
											>
												<HiOutlineMail className="w-4 h-4" />
											</button>
											<button
												className={`p-1.5 rounded-lg transition-colors ${isDark ? "text-gray-400 hover:text-green-400 hover:bg-white/10" : "text-gray-400 hover:text-green-600 hover:bg-gray-100"}`}
												title="Call"
											>
												<HiOutlinePhone className="w-4 h-4" />
											</button>
											<button
												className={`p-1.5 rounded-lg transition-colors ${isDark ? "text-gray-400 hover:text-yellow-400 hover:bg-white/10" : "text-gray-400 hover:text-yellow-600 hover:bg-gray-100"}`}
												title="Edit"
											>
												<HiOutlinePencil className="w-4 h-4" />
											</button>
											<button
												className={`p-1.5 rounded-lg transition-colors ${isDark ? "text-gray-400 hover:text-red-400 hover:bg-white/10" : "text-gray-400 hover:text-red-600 hover:bg-gray-100"}`}
												title="Delete"
											>
												<HiOutlineTrash className="w-4 h-4" />
											</button>
										</div>
									</td>
								</tr>
							))}
							{partners.length === 0 && (
								<tr>
									<td colSpan={7} className={`py-8 text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}>
										No partners yet
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</CardContent>
		</Card>
	);
}

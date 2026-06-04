"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HiOutlineEye, HiOutlineEyeOff, HiOutlineClipboardCopy } from "react-icons/hi";

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
	return (
		<Card className={isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}>
			<CardHeader className="p-4 sm:p-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<CardTitle className={`text-lg sm:text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
							Partners Management
						</CardTitle>
						<p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
							View all partners and their login credentials
						</p>
					</div>
					<Button
						variant="outline"
						size="sm"
						className={`gap-2 bg-transparent w-fit ${isDark ? "border-white/20 text-gray-300 hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
						onClick={onTogglePasswords}
					>
						{showPasswords ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
						Show Passwords
					</Button>
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
							</tr>
						</thead>
						<tbody>
							{partners.map((partner, index) => (
								<tr key={index} className={`border-b ${isDark ? "border-white/5 hover:bg-white/5" : "border-gray-100 hover:bg-gray-50"}`}>
									<td className="py-3 sm:py-4 px-2 sm:px-4">
										<div>
											<div className={`font-medium text-xs sm:text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
												{partner.company_name}
											</div>
											<div className={`text-xs hidden sm:block ${isDark ? "text-gray-400" : "text-gray-600"}`}>
												{partner.email}
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
											<span className="bg-green-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
												{partner.partner_code}
											</span>
											<button className={`${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}`}>
												<HiOutlineClipboardCopy className="w-4 h-4" />
											</button>
										</div>
									</td>
									<td className="py-3 sm:py-4 px-2 sm:px-4 hidden lg:table-cell">
										<div className="flex items-center gap-2">
											<span className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
												••••••••
											</span>
										</div>
									</td>
									<td className="py-3 sm:py-4 px-2 sm:px-4 hidden md:table-cell">
										<span className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
											{partner.status}
										</span>
									</td>
									<td className="py-3 sm:py-4 px-2 sm:px-4 hidden lg:table-cell">
										<span className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
											{new Date(partner.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
										</span>
									</td>
								</tr>
							))}
							{partners.length === 0 && (
								<tr>
									<td colSpan={6} className={`py-8 text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}>
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

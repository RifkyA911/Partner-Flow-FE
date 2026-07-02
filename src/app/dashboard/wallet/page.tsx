"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { FaWallet, FaArrowDown, FaArrowUp, FaHistory, FaUniversity, FaCreditCard, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";

interface Transaction {
	id: string;
	type: "credit" | "debit";
	amount: number;
	description: string;
	status: "completed" | "pending" | "failed";
	created_at: string;
	method?: string;
}

interface BankAccount {
	id: string;
	bank_name: string;
	account_number: string;
	account_holder: string;
	is_default: boolean;
}

export default function WalletPage() {
	const { data: session } = useSession();
	const [loading, setLoading] = useState(false);
	const [balance, setBalance] = useState(0);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
	const [isDark, setIsDark] = useState(true);
	const [withdrawAmount, setWithdrawAmount] = useState("");
	const [selectedBank, setSelectedBank] = useState("");
	const [showAddBank, setShowAddBank] = useState(false);
	const [newBank, setNewBank] = useState({
		bank_name: "",
		account_number: "",
		account_holder: "",
	});

	useEffect(() => {
		const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
		checkTheme();
		const observer = new MutationObserver(checkTheme);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
		return () => observer.disconnect();
	}, []);

	const fetchWalletData = useCallback(async () => {
		setLoading(true);
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wallet?user_id=${session?.user?.id}`);
			const data = await res.json();
			if (data.success) {
				setBalance(data.data.balance);
				setBankAccounts(data.data.bank_accounts || []);
			} else {
				console.error('Failed to load wallet data');
			}
		} catch {
			console.error('Failed to load wallet data');
		} finally {
			setLoading(false);
		}
	}, [session?.user?.id]);

	const fetchTransactions = useCallback(async () => {
		setLoading(true);
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wallet/transactions?user_id=${session?.user?.id}`);
			const data = await res.json();
			if (data.success) {
				setTransactions(data.data || []);
			} else {
				console.error('Failed to load transactions');
			}
		} catch {
			console.error('Failed to load transactions');
		} finally {
			setLoading(false);
		}
	}, [session?.user?.id]);

	useEffect(() => {
		fetchWalletData();
		fetchTransactions();
	}, [fetchWalletData, fetchTransactions]);

	const handleWithdraw = async () => {
		if (!withdrawAmount || !selectedBank) return;

		setLoading(true);
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wallet/withdraw`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					user_id: session?.user?.id,
					amount: parseInt(withdrawAmount),
					bank_account_id: selectedBank,
				}),
			});
			const data = await res.json();
			if (data.success) {
				alert('Withdrawal request submitted successfully');
				setWithdrawAmount('');
				fetchWalletData();
				fetchTransactions();
			} else {
				alert('Failed to submit withdrawal request');
			}
		} catch {
			alert('Failed to submit withdrawal request');
		} finally {
			setLoading(false);
		}
	};

	const handleAddBank = async () => {
		if (!newBank.bank_name || !newBank.account_number || !newBank.account_holder) return;

		setLoading(true);
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wallet/bank-accounts`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					user_id: session?.user?.id,
					bank_code: newBank.bank_name,
					account_number: newBank.account_number,
					account_holder: newBank.account_holder,
				}),
			});
			const data = await res.json();
			if (data.success) {
				alert('Bank account updated successfully');
				setNewBank({ bank_name: '', account_number: '', account_holder: '' });
				setShowAddBank(false);
				fetchWalletData();
			} else {
				alert('Failed to update bank account');
			}
		} catch {
			alert('Failed to update bank account');
		} finally {
			setLoading(false);
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "completed":
				return <FaCheckCircle className="w-4 h-4 text-green-500" />;
			case "pending":
				return <FaClock className="w-4 h-4 text-yellow-500" />;
			case "failed":
				return <FaTimesCircle className="w-4 h-4 text-red-500" />;
			default:
				return null;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-500/20 text-green-400";
			case "pending":
				return "bg-yellow-500/20 text-yellow-400";
			case "failed":
				return "bg-red-500/20 text-red-400";
			default:
				return "bg-gray-500/20 text-gray-400";
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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
							<div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-gradient-to-br from-green-500 to-emerald-500" : "bg-gradient-to-br from-green-600 to-emerald-600"}`}>
								<FaWallet className="w-5 h-5 text-white" />
							</div>
							<div>
								<CardTitle className={`text-lg sm:text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
									My Wallet
								</CardTitle>
								<CardDescription className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
									Manage your earnings and request withdrawals
								</CardDescription>
							</div>
						</div>
					</CardHeader>
				</Card>

				{/* Balance Card */}
				<Card className={`${isDark ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30" : "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"}`}>
					<CardContent className="p-6 sm:p-8">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
							<div>
								<p className={`text-sm sm:text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}>
									Available Balance
								</p>
								<p className={`text-3xl sm:text-4xl font-bold mt-2 ${isDark ? "text-white" : "text-gray-900"}`}>
									Rp {balance.toLocaleString("id-ID")}
								</p>
							</div>
							<div className="flex items-center gap-3">
								<Button
									onClick={() => setShowAddBank(true)}
									variant="outline"
									className={`gap-2 ${isDark ? "border-white/20 text-gray-300 hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
								>
									<FaUniversity className="w-4 h-4" />
									Add Bank
								</Button>
								<Button className="gap-2 bg-green-600 hover:bg-green-700 text-white">
									<FaArrowUp className="w-4 h-4" />
									Withdraw
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Withdrawal Form */}
				<Card className={`${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
					<CardHeader className="p-4 sm:p-6">
						<div className="flex items-center gap-3">
							<FaArrowUp className={`w-5 h-5 ${isDark ? "text-gray-300" : "text-gray-700"}`} />
							<CardTitle className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
								Request Withdrawal
							</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="p-4 sm:p-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
									Amount (Rp)
								</label>
								<Input
									type="number"
									value={withdrawAmount}
									onChange={(e) => setWithdrawAmount(e.target.value)}
									placeholder="Enter amount"
									className={isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}
								/>
								<p className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
									Minimum withdrawal: Rp 50,000
								</p>
							</div>
							<div>
								<label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
									Bank Account
								</label>
								<Select value={selectedBank} onValueChange={setSelectedBank}>
									<SelectTrigger className={isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}>
										<SelectValue placeholder="Select bank account" />
									</SelectTrigger>
									<SelectContent>
										{bankAccounts.map((bank) => (
											<SelectItem key={bank.id} value={bank.id}>
												{bank.bank_name} - {bank.account_number} ({bank.account_holder})
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<Button
							onClick={handleWithdraw}
							disabled={loading || !withdrawAmount || !selectedBank}
							className="mt-4 gap-2 bg-green-600 hover:bg-green-700 text-white"
						>
							{loading ? "Processing..." : "Submit Withdrawal"}
						</Button>
					</CardContent>
				</Card>

				{/* Add Bank Account Form */}
				{showAddBank && (
					<Card className={`${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
						<CardHeader className="p-4 sm:p-6">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<FaUniversity className={`w-5 h-5 ${isDark ? "text-gray-300" : "text-gray-700"}`} />
									<CardTitle className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
										Add Bank Account
									</CardTitle>
								</div>
								<Button
									onClick={() => setShowAddBank(false)}
									variant="ghost"
									className={isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}
								>
									Close
								</Button>
							</div>
						</CardHeader>
						<CardContent className="p-4 sm:p-6">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
										Bank Name
									</label>
									<Select value={newBank.bank_name} onValueChange={(value) => setNewBank({ ...newBank, bank_name: value })}>
										<SelectTrigger className={isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}>
											<SelectValue placeholder="Select bank" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="BCA">BCA</SelectItem>
											<SelectItem value="Mandiri">Mandiri</SelectItem>
											<SelectItem value="BNI">BNI</SelectItem>
											<SelectItem value="BRI">BRI</SelectItem>
											<SelectItem value="Jago">Jago</SelectItem>
											<SelectItem value="Jenius">Jenius</SelectItem>
											<SelectItem value="DANA">DANA</SelectItem>
											<SelectItem value="OVO">OVO</SelectItem>
											<SelectItem value="GoPay">GoPay</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div>
									<label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
										Account Number
									</label>
									<Input
										value={newBank.account_number}
										onChange={(e) => setNewBank({ ...newBank, account_number: e.target.value })}
										placeholder="Enter account number"
										className={isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}
									/>
								</div>
								<div>
									<label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
										Account Holder Name
									</label>
									<Input
										value={newBank.account_holder}
										onChange={(e) => setNewBank({ ...newBank, account_holder: e.target.value })}
										placeholder="Enter account holder name"
										className={isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}
									/>
								</div>
							</div>
							<Button
								onClick={handleAddBank}
								disabled={loading || !newBank.bank_name || !newBank.account_number || !newBank.account_holder}
								className="mt-4 gap-2"
							>
								{loading ? "Adding..." : "Add Bank Account"}
							</Button>
						</CardContent>
					</Card>
				)}

				{/* Transaction History */}
				<Card className={`${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
					<CardHeader className="p-4 sm:p-6">
						<div className="flex items-center gap-3">
							<FaHistory className={`w-5 h-5 ${isDark ? "text-gray-300" : "text-gray-700"}`} />
							<CardTitle className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
								Transaction History
							</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="p-0">
						<div className="divide-y divide-white/10">
							{transactions.map((transaction) => (
								<div
									key={transaction.id}
									className={`p-4 sm:p-6 transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
								>
									<div className="flex items-start justify-between gap-4">
										<div className="flex items-start gap-4">
											<div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${transaction.type === "credit"
												? "bg-gradient-to-br from-green-500 to-emerald-500"
												: "bg-gradient-to-br from-red-500 to-orange-500"
												}`}>
												{transaction.type === "credit" ? (
													<FaArrowDown className="w-5 h-5 text-white" />
												) : (
													<FaArrowUp className="w-5 h-5 text-white" />
												)}
											</div>
											<div>
												<h3 className={`font-semibold text-base ${isDark ? "text-white" : "text-gray-900"}`}>
													{transaction.description}
												</h3>
												<div className="flex items-center gap-2 mt-1">
													<span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
														{formatDate(transaction.created_at)}
													</span>
													{transaction.method && (
														<span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
															• {transaction.method}
														</span>
													)}
												</div>
											</div>
										</div>
										<div className="text-right">
											<p className={`font-bold text-lg ${transaction.type === "credit" ? "text-green-500" : "text-red-500"}`}>
												{transaction.type === "credit" ? "+" : "-"}Rp {transaction.amount.toLocaleString("id-ID")}
											</p>
											<div className="flex items-center gap-1 mt-1 justify-end">
												{getStatusIcon(transaction.status)}
												<span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
													{transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
												</span>
											</div>
										</div>
									</div>
								</div>
							))}
							{transactions.length === 0 && (
								<div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
									<FaHistory className="w-12 h-12 mx-auto mb-4 opacity-50" />
									<p>No transactions yet</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</DashboardLayout>
	);
}

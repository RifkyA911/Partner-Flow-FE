"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Mail, Lock, Building2, User, Phone, MapPin, Briefcase, ArrowRight, Gift, TrendingUp, Users } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { savePendingReferral } from "@/lib/referral-storage";

export default function RegisterPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { data: session, status } = useSession();
	const [isDark, setIsDark] = useState(true);
	const [form, setForm] = useState({
		company_name: "",
		industry: "",
		contact_person: "",
		email: "",
		phone: "",
		monthly_volume: "",
		address: "",
		password: "",
		confirmPassword: "",
		agree: false,
		marketing_consent: false,
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [validatingRef, setValidatingRef] = useState(false);
	const referralCode = searchParams.get("ref");
	const [activeReferralCode, setActiveReferralCode] = useState<string | null>(
		referralCode,
	);
	const [referralValidation, setReferralValidation] = useState<{
		valid: boolean;
		message?: string;
		referrer_name?: string;
	} | null>(null);

	useEffect(() => {
		const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
		checkTheme();

		const observer = new MutationObserver(checkTheme);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (status === "authenticated" && session?.user) {
			router.push("/dashboard");
		}
	}, [status, session, router]);

	useEffect(() => {
		if (referralCode) {
			savePendingReferral(referralCode);
		}
		if (!referralCode) {
			setActiveReferralCode(null);
			setReferralValidation(null);
			return;
		}

		setValidatingRef(true);
		fetch(`/api/referrals/validate?code=${encodeURIComponent(referralCode)}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.success && data.data) {
					setReferralValidation(data.data);
					if (data.data.valid) {
						setActiveReferralCode(referralCode);
						savePendingReferral(referralCode);
					} else {
						setActiveReferralCode(null);
					}
				} else {
					setReferralValidation({
						valid: false,
						message: "Could not verify referral link",
					});
					setActiveReferralCode(null);
				}
			})
			.catch(() => {
				setReferralValidation({
					valid: false,
					message: "Could not verify referral link — you can still register",
				});
				setActiveReferralCode(null);
			})
			.finally(() => setValidatingRef(false));
	}, [referralCode]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		const target = e.target;
		const { name, type, value } = target;

		let newValue: unknown;

		if (type === "checkbox" && "checked" in target) {
			newValue = (target as HTMLInputElement).checked;
		} else {
			newValue = value;
		}

		setForm((prev) => ({
			...prev,
			[name]: newValue,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		if (!form.agree) {
			setError("You must agree to the terms and conditions");
			setLoading(false);
			return;
		}

		if (form.password !== form.confirmPassword) {
			setError("Passwords do not match");
			setLoading(false);
			return;
		}

		if (form.password.length < 8) {
			setError("Password must be at least 8 characters");
			setLoading(false);
			return;
		}

		try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					company_name: form.company_name,
					industry: form.industry,
					contact_person: form.contact_person,
					email: form.email,
					phone: form.phone,
					monthly_volume: form.monthly_volume,
					address: form.address,
					password: form.password,
					referral_code: activeReferralCode || undefined,
					agree_terms: form.agree,
					marketing_consent: form.marketing_consent,
				}),
			});

			const data = await res.json();

			if (data.success) {
				const signInResult = await signIn("credentials", {
					email: form.email,
					password: form.password,
					redirect: false,
				});

				if (!signInResult?.error) {
					router.push("/dashboard");
					return;
				}

				router.push("/auth/login?registered=true");
			} else {
				const errMsg =
					typeof data.error === "string"
						? data.error
						: data.error?.message ?? "Registration failed";
				setError(errMsg);
			}
		} catch (err) {
			setError("An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		setLoading(true);
		try {
			if (activeReferralCode) {
				savePendingReferral(activeReferralCode);
			} else if (referralCode) {
				savePendingReferral(referralCode);
			}
			const result = await signIn("google", { callbackUrl: "/auth/onboarding" });
			if ((result as any)?.error) {
				setError("Google sign in failed");
			}
		} catch (err) {
			setError("An error occurred with Google sign in");
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className={`min-h-screen flex items-center py-16 justify-center px-4 ${isDark ? "bg-slate-950 text-white" : "bg-gray-50 text-gray-900"}`}>
			<div className="w-full max-w-2xl">
				{/* Logo */}
				<div className="flex items-center justify-center gap-2 mb-6">
					<div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
						<Zap className="w-5 h-5 text-white" />
					</div>
					<h1 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Partner Flow</h1>
				</div>

				{/* Referral Banner */}
				{referralCode && (
					<Card
						className={`backdrop-blur-xl rounded-xl mb-6 ${validatingRef
							? isDark
								? "bg-white/5 border-white/10"
								: "bg-gray-50 border-gray-200"
							: referralValidation?.valid
								? isDark
									? "bg-gradient-to-r from-green-600/20 to-blue-600/20 border-green-500/30"
									: "bg-gradient-to-r from-green-50 to-blue-50 border-green-200"
								: isDark
									? "bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-500/30"
									: "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200"
							}`}
					>
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<div
									className={`w-10 h-10 rounded-full flex items-center justify-center ${referralValidation?.valid
										? isDark
											? "bg-green-500/20"
											: "bg-green-100"
										: isDark
											? "bg-amber-500/20"
											: "bg-amber-100"
										}`}
								>
									<Gift
										className={`w-5 h-5 ${referralValidation?.valid
											? isDark
												? "text-green-400"
												: "text-green-600"
											: isDark
												? "text-amber-400"
												: "text-amber-600"
											}`}
									/>
								</div>
								<div className="flex-1">
									{validatingRef ? (
										<p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
											Verifying referral link…
										</p>
									) : referralValidation?.valid ? (
										<>
											<p className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
												Invited by {referralValidation.referrer_name}
											</p>
											<p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
												They earn commission when you complete registration (pending admin approval)
											</p>
										</>
									) : (
										<>
											<p className={`text-sm font-medium ${isDark ? "text-amber-200" : "text-amber-800"}`}>
												Invalid or expired referral link
											</p>
											<p className={`text-xs ${isDark ? "text-amber-300/80" : "text-amber-700"}`}>
												{referralValidation?.message ?? "You can still register without a referrer"}
											</p>
										</>
									)}
								</div>
								<div
									className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-700"
										}`}
								>
									{referralCode}
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Benefits */}
				<div className="grid grid-cols-3 gap-3 mb-6">
					<div className={`p-3 rounded-lg text-center ${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
						<TrendingUp className={`w-5 h-5 mx-auto mb-1 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
						<p className={`text-xs font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Earn Commissions</p>
					</div>
					<div className={`p-3 rounded-lg text-center ${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
						<Users className={`w-5 h-5 mx-auto mb-1 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
						<p className={`text-xs font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Build Network</p>
					</div>
					<div className={`p-3 rounded-lg text-center ${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
						<Gift className={`w-5 h-5 mx-auto mb-1 ${isDark ? "text-green-400" : "text-green-600"}`} />
						<p className={`text-xs font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Unlimited Growth</p>
					</div>
				</div>

				{/* Registration Form */}
				<Card className={`${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"} backdrop-blur-xl rounded-xl`}>
					<CardContent className="p-6">
						<div className="text-center mb-6">
							<h2 className={`text-xl font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>Create Partner Account</h2>
							<p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>Start earning commissions today</p>
						</div>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className={`text-xs font-medium mb-1 block ${isDark ? "text-gray-300" : "text-gray-700"}`}>
										Company Name
									</label>
									<div className="relative">
										<Building2 className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
										<input
											name="company_name"
											value={form.company_name}
											onChange={handleChange}
											required
											className={`w-full border rounded-lg px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-gray-300 text-gray-900"}`}
											placeholder="Your Company"
										/>
									</div>
								</div>
								<div>
									<label className={`text-xs font-medium mb-1 block ${isDark ? "text-gray-300" : "text-gray-700"}`}>
										Industry
									</label>
									<div className="relative">
										<Briefcase className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
										<select
											name="industry"
											value={form.industry}
											onChange={handleChange}
											required
											className={`w-full border rounded-lg px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none ${isDark ? "bg-slate-900 border-white/10 text-white" : "bg-white border-gray-300 text-gray-900"}`}
										>
											<option value="">Select</option>
											<option value="retail">Retail</option>
											<option value="wholesale">Wholesale</option>
											<option value="fmcg">FMCG</option>
											<option value="other">Other</option>
										</select>
									</div>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className={`text-xs font-medium mb-1 block ${isDark ? "text-gray-300" : "text-gray-700"}`}>
										Contact Person
									</label>
									<div className="relative">
										<User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
										<input
											name="contact_person"
											value={form.contact_person}
											onChange={handleChange}
											required
											className={`w-full border rounded-lg px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-gray-300 text-gray-900"}`}
											placeholder="John Doe"
										/>
									</div>
								</div>
								<div>
									<label className={`text-xs font-medium mb-1 block ${isDark ? "text-gray-300" : "text-gray-700"}`}>
										Email
									</label>
									<div className="relative">
										<Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
										<input
											name="email"
											type="email"
											value={form.email}
											onChange={handleChange}
											required
											className={`w-full border rounded-lg px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-gray-300 text-gray-900"}`}
											placeholder="email@example.com"
										/>
									</div>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className={`text-xs font-medium mb-1 block ${isDark ? "text-gray-300" : "text-gray-700"}`}>
										Phone
									</label>
									<div className="relative">
										<Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
										<input
											name="phone"
											value={form.phone}
											onChange={handleChange}
											required
											className={`w-full border rounded-lg px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-gray-300 text-gray-900"}`}
											placeholder="+62 812 3456 7890"
										/>
									</div>
								</div>
								<div>
									<label className={`text-xs font-medium mb-1 block ${isDark ? "text-gray-300" : "text-gray-700"}`}>
										Monthly Volume
									</label>
									<div className="relative">
										<TrendingUp className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
										<select
											name="monthly_volume"
											value={form.monthly_volume}
											onChange={handleChange}
											className={`w-full border rounded-lg px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none ${isDark ? "bg-slate-900 border-white/10 text-white" : "bg-white border-gray-300 text-gray-900"}`}
										>
											<option value="">Select</option>
											<option value="100-500">100-500 units</option>
											<option value="500-1000">500-1000 units</option>
											<option value="1000-5000">1000-5000 units</option>
											<option value="5000+">5000+ units</option>
										</select>
									</div>
								</div>
							</div>

							<div>
								<label className={`text-xs font-medium mb-1 block ${isDark ? "text-gray-300" : "text-gray-700"}`}>
									Address
								</label>
								<div className="relative">
									<MapPin className={`absolute left-3 top-3 w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
									<textarea
										name="address"
										value={form.address}
										onChange={handleChange}
										required
										className={`w-full border rounded-lg px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[60px] ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-gray-300 text-gray-900"}`}
										placeholder="Street address, City, State, ZIP"
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className={`text-xs font-medium mb-1 block ${isDark ? "text-gray-300" : "text-gray-700"}`}>
										Password
									</label>
									<div className="relative">
										<Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
										<input
											name="password"
											type="password"
											value={form.password}
											onChange={handleChange}
											required
											className={`w-full border rounded-lg px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-gray-300 text-gray-900"}`}
											placeholder="••••••••"
										/>
									</div>
								</div>
								<div>
									<label className={`text-xs font-medium mb-1 block ${isDark ? "text-gray-300" : "text-gray-700"}`}>
										Confirm Password
									</label>
									<div className="relative">
										<Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
										<input
											name="confirmPassword"
											type="password"
											value={form.confirmPassword}
											onChange={handleChange}
											required
											className={`w-full border rounded-lg px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-gray-300 text-gray-900"}`}
											placeholder="••••••••"
										/>
									</div>
								</div>
							</div>

							<div className="flex flex-col gap-2">
								<label className="inline-flex items-start gap-2 text-xs">
									<input
										type="checkbox"
										name="agree"
										checked={form.agree}
										onChange={handleChange}
										required
										className={`mt-0.5 accent-blue-600 ${isDark ? "bg-white/10 border-white/20" : "bg-gray-200 border-gray-300"}`}
									/>
									<span className={isDark ? "text-gray-300" : "text-gray-600"}>
										I agree to the{" "}
										<a href="#" className="text-blue-400 hover:text-blue-300">
											Terms of Service
										</a>{" "}
										and{" "}
										<a href="#" className="text-blue-400 hover:text-blue-300">
											Privacy Policy
										</a>
									</span>
								</label>
								<label className="inline-flex items-start gap-2 text-xs">
									<input
										type="checkbox"
										name="marketing_consent"
										checked={form.marketing_consent}
										onChange={handleChange}
										className={`mt-0.5 accent-blue-600 ${isDark ? "bg-white/10 border-white/20" : "bg-gray-200 border-gray-300"}`}
									/>
									<span className={isDark ? "text-gray-300" : "text-gray-600"}>
										I would like to receive marketing communications
									</span>
								</label>
							</div>

							{error && (
								<div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded-lg text-xs">
									{error}
								</div>
							)}

							<Button
								type="submit"
								disabled={loading}
								className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-2.5 rounded-lg text-sm transition-all"
							>
								{loading ? "Creating Account..." : "Create Account"}
								<ArrowRight className="w-4 h-4 ml-2" />
							</Button>

							<div className={`text-center text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
								Or continue with
							</div>

							<Button
								type="button"
								onClick={handleGoogleSignIn}
								disabled={loading}
								variant="outline"
								className={`w-full gap-2 text-sm ${isDark ? "border-white/20 text-gray-300 hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
							>
								<FcGoogle className="w-5 h-5" />
								Sign up with Google
							</Button>

							<div className={`text-center text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
								Already have an account?{" "}
								<a href="/auth/login" className="text-blue-400 hover:text-blue-300">
									Sign In
								</a>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}

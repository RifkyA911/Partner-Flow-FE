"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Building2, User, Phone, MapPin, Briefcase, ArrowRight, Check } from "lucide-react";
import { useSession } from "next-auth/react";

const steps = [
	{
		id: 1,
		title: "Company Information",
		icon: Building2,
		fields: ["company_name", "industry"],
	},
	{
		id: 2,
		title: "Contact Details",
		icon: User,
		fields: ["contact_person", "phone"],
	},
	{
		id: 3,
		title: "Business Details",
		icon: Briefcase,
		fields: ["monthly_volume"],
	},
	{
		id: 4,
		title: "Address",
		icon: MapPin,
		fields: ["address"],
	},
];

export default function OnboardingPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { data: session, status, update } = useSession();
	const [isDark, setIsDark] = useState(true);
	const [currentStep, setCurrentStep] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [form, setForm] = useState({
		company_name: "",
		industry: "",
		contact_person: "",
		phone: "",
		monthly_volume: "",
		address: "",
	});

	useEffect(() => {
		const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
		checkTheme();

		const observer = new MutationObserver(checkTheme);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		// Redirect if not authenticated
		if (status === "unauthenticated") {
			router.push("/auth/login");
			return;
		}

		// Pre-fill contact person name from session if available
		if (session?.user?.name) {
			setForm((prev) => ({ ...prev, contact_person: session.user.name || "" }));
		}

		// Check if user already has a partner_code (means they've completed onboarding)
		if (session?.user?.partner_code) {
			router.push("/dashboard");
		}
	}, [session, status, router]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		const target = e.target;
		const { name, value } = target;

		setForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleNext = () => {
		const currentStepData = steps[currentStep - 1];
		const isStepValid = currentStepData.fields.every((field) => form[field as keyof typeof form].trim() !== "");

		if (!isStepValid) {
			setError("Please fill in all required fields");
			return;
		}

		setError("");
		if (currentStep < steps.length) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handleBack = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleSubmit = async () => {
		setLoading(true);
		setError("");

		try {
			const res = await fetch("/api/auth/onboarding", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(form),
			});

			const data = await res.json();

			if (data.success) {
				await update({
					partner_code: data.data.user?.partner_code ?? data.data.partner_code,
					id: data.data.user?.id ?? data.data.id,
					role: data.data.user?.role ?? "partner",
				});
				router.push("/dashboard");
			} else {
				setError(data.error || "Onboarding failed");
			}
		} catch (err) {
			setError("An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const renderStep = () => {
		const currentStepData = steps[currentStep - 1];
		const Icon = currentStepData.icon;

		switch (currentStep) {
			case 1:
				return (
					<div className="space-y-4">
						<div>
							<label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
								Company Name
							</label>
							<div className="relative">
								<Building2 className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
								<input
									name="company_name"
									value={form.company_name}
									onChange={handleChange}
									className={`w-full border rounded-lg px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isDark ? "bg-white/5 border-white/10 text-white placeholder-gray-500" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`}
									placeholder="Your Company"
									required
								/>
							</div>
						</div>
						<div>
							<label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
								Industry
							</label>
							<div className="relative">
								<Briefcase className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
								<select
									name="industry"
									value={form.industry}
									onChange={handleChange}
									className={`w-full border rounded-lg px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none ${isDark ? "bg-slate-900 border-white/10 text-white" : "bg-white border-gray-300 text-gray-900"}`}
									required
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
				);

			case 2:
				return (
					<div className="space-y-4">
						<div>
							<label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
								Contact Person
							</label>
							<div className="relative">
								<User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
								<input
									name="contact_person"
									value={form.contact_person}
									onChange={handleChange}
									className={`w-full border rounded-lg px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isDark ? "bg-white/5 border-white/10 text-white placeholder-gray-500" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`}
									placeholder="John Doe"
									required
								/>
							</div>
						</div>
						<div>
							<label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
								Phone
							</label>
							<div className="relative">
								<Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
								<input
									name="phone"
									value={form.phone}
									onChange={handleChange}
									className={`w-full border rounded-lg px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isDark ? "bg-white/5 border-white/10 text-white placeholder-gray-500" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`}
									placeholder="+62 812 3456 7890"
									required
								/>
							</div>
						</div>
					</div>
				);

			case 3:
				return (
					<div className="space-y-4">
						<div>
							<label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
								Monthly Volume
							</label>
							<div className="relative">
								<Briefcase className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
								<select
									name="monthly_volume"
									value={form.monthly_volume}
									onChange={handleChange}
									className={`w-full border rounded-lg px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none ${isDark ? "bg-slate-900 border-white/10 text-white" : "bg-white border-gray-300 text-gray-900"}`}
									required
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
				);

			case 4:
				return (
					<div className="space-y-4">
						<div>
							<label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
								Address
							</label>
							<div className="relative">
								<MapPin className={`absolute left-3 top-3 w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
								<textarea
									name="address"
									value={form.address}
									onChange={handleChange}
									className={`w-full border rounded-lg px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[100px] resize-none ${isDark ? "bg-white/5 border-white/10 text-white placeholder-gray-500" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`}
									placeholder="Street address, City, State, ZIP"
									required
								/>
							</div>
						</div>
					</div>
				);

			default:
				return null;
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

				{/* Progress Steps */}
				<div className="flex items-center justify-center mb-8">
					{steps.map((step, index) => {
						const StepIcon = step.icon;
						const isCompleted = step.id < currentStep;
						const isCurrent = step.id === currentStep;

						return (
							<div key={step.id} className="flex items-center">
								<div className="flex flex-col items-center">
									<div
										className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isCompleted
												? "bg-green-500 text-white"
												: isCurrent
													? "bg-blue-500 text-white"
													: isDark
														? "bg-white/10 text-gray-400"
														: "bg-gray-200 text-gray-600"
											}`}
									>
										{isCompleted ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
									</div>
									<span className={`text-xs mt-2 ${isCurrent ? "font-medium" : ""} ${isDark ? "text-gray-400" : "text-gray-600"}`}>
										{step.title}
									</span>
								</div>
								{index < steps.length - 1 && (
									<div className={`w-16 h-0.5 mx-2 ${isCompleted ? "bg-green-500" : isDark ? "bg-white/10" : "bg-gray-200"}`} />
								)}
							</div>
						);
					})}
				</div>

				{/* Onboarding Card */}
				<Card className={`${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"} backdrop-blur-xl rounded-xl`}>
					<CardContent className="p-6">
						<div className="text-center mb-6">
							<h2 className={`text-xl font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
								{steps[currentStep - 1].title}
							</h2>
							<p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
								Step {currentStep} of {steps.length}
							</p>
						</div>

						{renderStep()}

						{error && (
							<div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded-lg text-xs mt-4">
								{error}
							</div>
						)}

						<div className="flex gap-3 mt-6">
							{currentStep > 1 && (
								<Button
									type="button"
									onClick={handleBack}
									variant="outline"
									className={`flex-1 ${isDark ? "border-white/20 text-gray-300 hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
								>
									Back
								</Button>
							)}
							{currentStep < steps.length ? (
								<Button
									type="button"
									onClick={handleNext}
									className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
								>
									Next
									<ArrowRight className="w-4 h-4 ml-2" />
								</Button>
							) : (
								<Button
									type="button"
									onClick={handleSubmit}
									disabled={loading}
									className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
								>
									{loading ? "Completing..." : "Complete Setup"}
									<Check className="w-4 h-4 ml-2" />
								</Button>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}

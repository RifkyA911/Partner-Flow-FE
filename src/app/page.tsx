"use client"

import { Gift, TrendingUp, Network, Users, Zap, Shield, ArrowRight, CheckCircle, Star, BarChart3, Clock, Globe, Smartphone, MessageSquare, Award, Target, Rocket, Heart, Sparkles, Sparkle, ChevronRight, Play, Layers, Zap as ZapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
	const [isDark, setIsDark] = useState(true);

	useEffect(() => {
		const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
		checkTheme();

		const observer = new MutationObserver(checkTheme);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

		return () => observer.disconnect();
	}, []);

	return (
		<div className={`min-h-screen overflow-hidden ${isDark ? "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white" : "bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-900"}`}>
			{/* Animated background elements */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700" />
				<div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
			</div>

			{/* Hero Section */}
			<section className="relative pt-16 pb-12 px-4">
				<div className="relative max-w-6xl mx-auto">
					<div className="text-center max-w-4xl mx-auto">
						{/* Badge */}
						<div className={`inline-flex items-center gap-2 backdrop-blur-lg border px-4 py-2 rounded-full text-xs font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 transition-all cursor-pointer ${isDark ? "bg-white/10 border-white/20 text-white hover:bg-white/20" : "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"}`}>
							<Sparkle className={`w-3 h-3 ${isDark ? "text-cyan-400" : "text-blue-500"}`} />
							<span>Trusted by 10,000+ partners</span>
							<ChevronRight className="w-3 h-3" />
						</div>

						{/* Heading */}
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
							<span className={`bg-gradient-to-r bg-clip-text text-transparent ${isDark ? "from-white via-blue-200 to-purple-200" : "from-gray-900 via-blue-600 to-purple-600"}`}>
								Turn Connections
							</span>
							<br />
							<span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
								Into Revenue
							</span>
						</h1>

						{/* Subheading */}
						<p className={`text-lg mb-8 max-w-2xl mx-auto leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>
							The modern referral platform. <span className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Earn commissions.</span> Build unlimited networks.
						</p>

						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10">
							<Link href="/auth/register">
								<Button
									size="lg"
									className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-base px-8 py-5 rounded-xl shadow-xl shadow-blue-500/25 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
								>
									Start Free Trial
									<ArrowRight className="w-4 h-4 ml-2" />
								</Button>
							</Link>
							<Link href="/auth/login">
								<Button
									size="lg"
									variant="outline"
									className={`text-base px-8 py-5 rounded-xl border-2 backdrop-blur-lg transition-all duration-300 hover:scale-105 ${isDark ? "border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10" : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"}`}
								>
									View Demo
									<Play className="w-4 h-4 ml-2" />
								</Button>
							</Link>
						</div>

						{/* Trust badges */}
						<div className={`flex flex-wrap justify-center gap-4 text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
							<div className={`flex items-center gap-2 backdrop-blur-sm px-3 py-1.5 rounded-full border ${isDark ? "bg-white/5 border-white/10" : "bg-gray-100 border-gray-200"}`}>
								<CheckCircle className="w-3 h-3 text-green-500" />
								<span>No credit card required</span>
							</div>
							<div className={`flex items-center gap-2 backdrop-blur-sm px-3 py-1.5 rounded-full border ${isDark ? "bg-white/5 border-white/10" : "bg-gray-100 border-gray-200"}`}>
								<ZapIcon className="w-3 h-3 text-yellow-500" />
								<span>Instant payouts</span>
							</div>
							<div className={`flex items-center gap-2 backdrop-blur-sm px-3 py-1.5 rounded-full border ${isDark ? "bg-white/5 border-white/10" : "bg-gray-100 border-gray-200"}`}>
								<Shield className="w-3 h-3 text-blue-500" />
								<span>Bank-level security</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section - Glass Cards */}
			<section className="py-10 px-4">
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{[
							{ value: "10K+", label: "Active Partners", color: "from-blue-400 to-cyan-400" },
							{ value: "$500K+", label: "Commissions Paid", color: "from-purple-400 to-pink-400" },
							{ value: "98%", label: "Satisfaction Rate", color: "from-green-400 to-emerald-400" },
							{ value: "50K+", label: "Referrals Made", color: "from-orange-400 to-yellow-400" },
						].map((stat, index) => (
							<div
								key={index}
								className={`backdrop-blur-lg border rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 ${isDark ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20" : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}
							>
								<div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
									{stat.value}
								</div>
								<p className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>{stat.label}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Features Section - Bento Grid Style */}
			<section id="features" className="py-16 px-4">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
							<span className={`bg-gradient-to-r bg-clip-text text-transparent ${isDark ? "from-white to-gray-400" : "from-gray-900 to-gray-600"}`}>
								Built for Growth
							</span>
						</h2>
						<p className={`text-base max-w-xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}>
							Everything you need to build, manage, and scale your referral network
						</p>
					</div>

					{/* Bento Grid */}
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
						{/* Large Feature Card */}
						<div className={`md:col-span-2 lg:col-span-2 backdrop-blur-lg border rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${isDark ? "bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-white/10 hover:border-white/20" : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
							<div className="flex items-start gap-4">
								<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
									<ZapIcon className="w-6 h-6 text-white" />
								</div>
								<div>
									<h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Viral Growth Engine</h3>
									<p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
										Your referrals become partners too, creating exponential growth. Watch your network multiply automatically.
									</p>
								</div>
							</div>
						</div>

						{/* Tall Feature Card */}
						<div className={`backdrop-blur-lg border rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${isDark ? "bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-white/10 hover:border-white/20" : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
							<div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-3">
								<Gift className="w-5 h-5 text-white" />
							</div>
							<h3 className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Generous Commissions</h3>
							<p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
								Earn up to Rp50,000 per successful referral. No caps, no limits.
							</p>
						</div>

						{/* Feature Card */}
						<div className={`backdrop-blur-lg border rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${isDark ? "bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-white/10 hover:border-white/20" : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
							<div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mb-3">
								<BarChart3 className="w-5 h-5 text-white" />
							</div>
							<h3 className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Real-Time Analytics</h3>
							<p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
								Track everything with detailed dashboards.
							</p>
						</div>

						{/* Feature Card */}
						<div className={`backdrop-blur-lg border rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${isDark ? "bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-white/10 hover:border-white/20" : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
							<div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-3">
								<Smartphone className="w-5 h-5 text-white" />
							</div>
							<h3 className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Mobile First</h3>
							<p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
								Manage on the go, anywhere.
							</p>
						</div>

						{/* Feature Card */}
						<div className={`backdrop-blur-lg border rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${isDark ? "bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-white/10 hover:border-white/20" : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
							<div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-3">
								<Shield className="w-5 h-5 text-white" />
							</div>
							<h3 className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Enterprise Security</h3>
							<p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
								Bank-level protection for your data.
							</p>
						</div>

						{/* Feature Card */}
						<div className={`backdrop-blur-lg border rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${isDark ? "bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-white/10 hover:border-white/20" : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
							<div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center mb-3">
								<Network className="w-5 h-5 text-white" />
							</div>
							<h3 className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Unlimited Network</h3>
							<p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
								Build levels without boundaries.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section id="how-it-works" className="py-14 px-4">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-10">
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
							<span className={`bg-gradient-to-r bg-clip-text text-transparent ${isDark ? "from-white to-gray-400" : "from-gray-900 to-gray-600"}`}>
								How It Works
							</span>
						</h2>
						<p className={`text-base max-w-xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}>
							Start earning in 4 simple steps
						</p>
					</div>

					<div className="grid md:grid-cols-4 gap-4">
						{[
							{ step: 1, title: "Get Your Code", desc: "Sign up and receive your unique referral code instantly", color: "from-blue-500 to-cyan-500", bg: "from-blue-500/10 to-cyan-500/10" },
							{ step: 2, title: "Share & Promote", desc: "Share your link via social media, email, or messaging", color: "from-purple-500 to-pink-500", bg: "from-purple-500/10 to-pink-500/10" },
							{ step: 3, title: "They Join", desc: "Your referrals sign up and become active partners", color: "from-green-500 to-emerald-500", bg: "from-green-500/10 to-emerald-500/10" },
							{ step: 4, title: "Get Paid", desc: "Receive instant commission payments upon approval", color: "from-orange-500 to-yellow-500", bg: "from-orange-500/10 to-yellow-500/10" },
						].map((item, index) => (
							<div key={index} className="relative group">
								<div className={`backdrop-blur-lg border rounded-2xl p-5 h-full transition-all duration-300 group-hover:scale-105 ${isDark ? `bg-gradient-to-br ${item.bg} border-white/10 hover:border-white/20` : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
									<div className={`w-12 h-12 bg-gradient-to-br ${item.color} text-white rounded-xl flex items-center justify-center mx-auto mb-4 text-lg font-bold shadow-lg group-hover:scale-110 transition-transform`}>
										{item.step}
									</div>
									<h3 className={`text-base font-bold mb-2 text-center ${isDark ? "text-white" : "text-gray-900"}`}>{item.title}</h3>
									<p className={`text-xs text-center leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>{item.desc}</p>
								</div>
								{index < 3 && (
									<div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
										<ArrowRight className={`w-5 h-5 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`} />
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Benefits Section - Glass Cards */}
			<section id="benefits" className="py-14 px-4">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-10">
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
							<span className={`bg-gradient-to-r bg-clip-text text-transparent ${isDark ? "from-white to-gray-400" : "from-gray-900 to-gray-600"}`}>
								Why Partner Flow?
							</span>
						</h2>
						<p className={`text-base max-w-xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}>
							Benefits that set us apart
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
						{[
							{ icon: Clock, title: "Fast Payouts", desc: "24-48 hour commission processing", color: "from-blue-500 to-cyan-500" },
							{ icon: Users, title: "Community", desc: "Join 10,000+ active partners", color: "from-purple-500 to-pink-500" },
							{ icon: Globe, title: "Global Reach", desc: "No geographical restrictions", color: "from-green-500 to-emerald-500" },
							{ icon: ZapIcon, title: "Easy to Use", desc: "No technical skills needed", color: "from-orange-500 to-yellow-500" },
							{ icon: Award, title: "Bonus Rewards", desc: "Milestone bonuses & perks", color: "from-pink-500 to-rose-500" },
							{ icon: MessageSquare, title: "24/7 Support", desc: "Dedicated help whenever needed", color: "from-cyan-500 to-blue-500" },
						].map((item, index) => (
							<div key={index} className={`backdrop-blur-lg border rounded-2xl p-4 transition-all duration-300 hover:scale-105 group ${isDark ? "bg-gradient-to-br from-white/5 to-white/10 border-white/10 hover:border-white/20" : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
								<div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
									<item.icon className="w-5 h-5 text-white" />
								</div>
								<h3 className={`text-sm font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>{item.title}</h3>
								<p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>{item.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section - Glass Card */}
			<section className="py-14 px-4">
				<div className="max-w-5xl mx-auto">
					<div className={`backdrop-blur-xl border rounded-2xl p-8 md:p-10 text-center relative overflow-hidden ${isDark ? "bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 border-white/20" : "bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 border-gray-200"}`}>
						{/* Animated background elements */}
						<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
							<div className={`absolute top-10 left-10 w-32 h-32 rounded-full blur-3xl animate-pulse ${isDark ? "bg-blue-400/20" : "bg-blue-300/30"}`} />
							<div className={`absolute bottom-10 right-10 w-32 h-32 rounded-full blur-3xl animate-pulse delay-500 ${isDark ? "bg-purple-400/20" : "bg-purple-300/30"}`} />
						</div>

						<div className="relative z-10">
							<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
								<span className={`bg-gradient-to-r bg-clip-text text-transparent ${isDark ? "from-white to-blue-200" : "from-gray-900 to-blue-600"}`}>
									Ready to Start Earning?
								</span>
							</h2>
							<p className={`text-base mb-6 max-w-xl mx-auto ${isDark ? "text-gray-300" : "text-gray-600"}`}>
								Join thousands of partners building their referral networks. Get your first referral code instantly.
							</p>
							<div className="flex flex-col sm:flex-row gap-3 justify-center">
								<Link href="/auth/register">
									<Button
										size="lg"
										className="bg-white text-blue-600 hover:bg-gray-100 text-base px-8 py-4 rounded-xl shadow-xl hover:scale-105 transition-all"
									>
										Get Started Free
										<Rocket className="w-4 h-4 ml-2" />
									</Button>
								</Link>
								<Link href="/auth/login">
									<Button
										size="lg"
										variant="outline"
										className={`border-2 text-base px-8 py-4 rounded-xl hover:scale-105 transition-all ${isDark ? "border-white/30 text-white hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
									>
										Login to Dashboard
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Testimonials Section - Glass Cards */}
			<section className="py-14 px-4">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-10">
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
							<span className={`bg-gradient-to-r bg-clip-text text-transparent ${isDark ? "from-white to-gray-400" : "from-gray-900 to-gray-600"}`}>
								Loved by Partners
							</span>
						</h2>
						<p className={`text-base max-w-xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}>
							Real stories from real partners
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-4">
						{[
							{ name: "Budi Santoso", role: "Top Partner", initial: "B", color: "from-blue-500 to-cyan-500", quote: "Partner Flow transformed my side income into a full-time business. The viral growth feature is incredible!" },
							{ name: "Siti Rahayu", role: "Premium Partner", initial: "S", color: "from-purple-500 to-pink-500", quote: "The fastest payouts I've ever experienced. I get my commissions within 24 hours every time." },
							{ name: "Ahmad Wijaya", role: "Rising Star", initial: "A", color: "from-green-500 to-emerald-500", quote: "The dashboard is so easy to use. I can track everything in real-time. Highly recommended!" },
						].map((item, index) => (
							<div key={index} className={`backdrop-blur-lg border rounded-2xl p-5 transition-all duration-300 hover:scale-105 ${isDark ? "bg-gradient-to-br from-white/5 to-white/10 border-white/10 hover:border-white/20" : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
								<div className="flex items-center gap-1 mb-3">
									{[1, 2, 3, 4, 5].map((star) => (
										<Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
									))}
								</div>
								<p className={`text-sm leading-relaxed mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>"{item.quote}"</p>
								<div className="flex items-center gap-3">
									<div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
										{item.initial}
									</div>
									<div>
										<p className={`font-bold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>{item.name}</p>
										<p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>{item.role}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Footer CTA */}
			<section className="py-14 px-4">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
						<span className={`bg-gradient-to-r bg-clip-text text-transparent ${isDark ? "from-white to-gray-400" : "from-gray-900 to-gray-600"}`}>
							Join the Revolution
						</span>
					</h2>
					<p className={`text-base mb-6 max-w-xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}>
						Start building your referral network today. Your first commission is just one referral away.
					</p>
					<Link href="/auth/register">
						<Button
							size="lg"
							className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white text-base px-10 py-4 rounded-xl shadow-xl shadow-purple-500/25 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
						>
							Join Now - It's Free
							<Heart className="w-4 h-4 ml-2" />
						</Button>
					</Link>
				</div>
			</section>
		</div>
	);
}

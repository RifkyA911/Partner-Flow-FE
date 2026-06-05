"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { HiOutlineXCircle } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { PartnerDashboard } from "@/components/dashboard/partner-dashboard";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { baseUrl } from "@/config";

export default function Dashboard() {
	interface Referral {
		id: string;
		referred_name: string;
		referred_phone: string;
		commission: number;
		status: string;
		created_at: string;
		referral_code?: string;
		partner?: {
			company_name: string;
		};
	}

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

	interface ActivityItem {
		type: string;
		icon: any;
		title: string;
		description: string;
		timestamp: string;
		color: string;
	}

	const router = useRouter();
	const { data: session, status } = useSession();
	const [isDark, setIsDark] = useState(true);
	const [showPasswords, setShowPasswords] = useState(false);
	const [referralLink, setReferralLink] = useState("");
	const [referrals, setReferrals] = useState<Referral[]>([]);
	const [partners, setPartners] = useState<Partner[]>([]);
	const [stats, setStats] = useState({
		total_referrals: 0,
		successful_conversions: 0,
		pending_reviews: 0,
		this_month: 0,
		total_partners: 0,
		active_referrals: 0,
		total_conversions: 0,
		total_payouts: 0,
		recent_activities: [] as ActivityItem[],
	});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
		checkTheme();

		const observer = new MutationObserver(checkTheme);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		console.log('status', status);
		console.log('session', session);
		if (status === "unauthenticated") {
			router.push("/auth/login");
			return;
		}

		if (session?.user) {
			// Check if user needs onboarding (no partner_code)
			const needsOnboarding =
				(session.user as { needsOnboarding?: boolean }).needsOnboarding ||
				(!session.user.partner_code && session.user.role === "partner");
			if (needsOnboarding) {
				router.push("/auth/onboarding");
				return;
			}

			const userRole = session.user.role;

			if (userRole === "partner") {
				// Partner-specific logic
				const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
				const link = `${appUrl}/auth/register?ref=${session.user.partner_code}`;
				setReferralLink(link);
				fetchPartnerReferrals(session.user.id);
			} else if (session?.user?.role === "admin") {
				// Admin-specific logic
				fetchAdminData();
			}
		}
		setIsLoading(false);
	}, [session, status, router]);

	const fetchPartnerReferrals = async (partnerId: string) => {
		try {
			const backendUrl = baseUrl;
			const res = await fetch(`${backendUrl}/api/referrals?partner_id=${partnerId}`);
			const data = await res.json();
			if (data.success) {
				setReferrals(data.data.referrals);
				setStats(prev => ({
					...prev,
					total_referrals: data.data.referrals.length,
					successful_conversions: data.data.referrals.filter((r: Referral) => r.status === 'converted').length,
					pending_reviews: data.data.referrals.filter((r: Referral) => r.status === 'pending').length,
					this_month: data.data.referrals.filter((r: Referral) => r.status === 'converted').length * 50000,
				}));
			} else {
				setError("Failed to load referrals data");
			}
		} catch (error) {
			console.error("Failed to fetch referrals:", error);
			setError("Failed to load referrals data");
		}
	};

	const fetchAdminData = async () => {
		try {
			const backendUrl = baseUrl;
			// Fetch partners
			const partnersRes = await fetch(`${backendUrl}/api/partners`);
			const partnersData = await partnersRes.json();
			if (partnersData.success) {
				setPartners(partnersData.data.partners);
			} else {
				setError("Failed to load partners data");
			}

			// Fetch referrals
			const referralsRes = await fetch(`${backendUrl}/api/referrals`);
			const referralsData = await referralsRes.json();
			if (referralsData.success) {
				setReferrals(referralsData.data.referrals);
			} else {
				setError("Failed to load referrals data");
			}

			// Set stats
			setStats(prev => ({
				...prev,
				total_partners: partnersData.data?.partners?.length || 0,
				active_referrals: referralsData.data?.referrals?.length || 0,
				total_conversions: referralsData.data?.referrals?.filter((r: Referral) => r.status === 'converted').length || 0,
				total_payouts: referralsData.data?.referrals?.filter((r: Referral) => r.status === 'converted').length * 50000 || 0,
			}));
		} catch (error) {
			console.error("Failed to fetch admin data:", error);
			setError("Failed to load admin data");
		}
	};

	const shareOnSocialMedia = (platform: string) => {
		const text = "Check out this amazing partner referral program!";
		const url = referralLink;

		let shareUrl = "";

		switch (platform) {
			case "facebook":
				shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
				break;
			case "twitter":
				shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
				break;
			case "linkedin":
				shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
				break;
			case "whatsapp":
				shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`;
				break;
			case "email":
				shareUrl = `mailto:?subject=${encodeURIComponent("Partner Referral Program")}&body=${encodeURIComponent(`${text}\n\n${url}`)}`;
				break;
		}

		if (shareUrl) {
			window.open(shareUrl, "_blank");
		}
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
	};

	// const session?.user?.role = session?.user?.role;

	// Loading state with skeleton
	if (isLoading || status === "loading") {
		return (
			<main className={`px-4 sm:px-6 lg:px-8 rounded-md lg:py-8 my-8 sm:py-6 w-full max-w-7xl mx-auto ${isDark ? "bg-slate-950 text-white" : "bg-gray-50 text-gray-900"}`}>
				<div className="space-y-6">
					{/* Skeleton Welcome Banner */}
					<div className={`h-32 rounded-lg animate-pulse ${isDark ? "bg-white/10" : "bg-gray-200"}`} />

					{/* Skeleton Stats Cards */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{[1, 2, 3, 4].map((i) => (
							<div key={i} className={`h-32 rounded-lg animate-pulse ${isDark ? "bg-white/10" : "bg-gray-200"}`} />
						))}
					</div>

					{/* Skeleton Referral Tools */}
					<div className={`h-64 rounded-lg animate-pulse ${isDark ? "bg-white/10" : "bg-gray-200"}`} />

					{/* Skeleton Recent Referrals */}
					<div className={`h-96 rounded-lg animate-pulse ${isDark ? "bg-white/10" : "bg-gray-200"}`} />
				</div>
			</main>
		);
	}

	// Error state
	if (error) {
		return (
			<main className={`px-4 sm:px-6 lg:px-8 rounded-md lg:py-8 my-8 sm:py-6 w-full max-w-7xl mx-auto ${isDark ? "bg-slate-950 text-white" : "bg-gray-50 text-gray-900"}`}>
				<div className="flex items-center justify-center py-20">
					<div className={`text-center ${isDark ? "text-white" : "text-gray-900"}`}>
						<div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDark ? "bg-red-500/20" : "bg-red-100"}`}>
							<HiOutlineXCircle className={`w-8 h-8 ${isDark ? "text-red-400" : "text-red-600"}`} />
						</div>
						<p className="text-lg mb-2">Error Loading Data</p>
						<p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>{error}</p>
						<Button
							onClick={() => window.location.reload()}
							className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
						>
							Retry
						</Button>
					</div>
				</div>
			</main>
		);
	}

	return (
		<>
			{/* Main Content */}
			<main className={`px-4 sm:px-6 lg:px-8 rounded-md lg:py-8 my-8 sm:py-6 w-full max-w-7xl mx-auto ${isDark ? "bg-slate-950 text-white" : "bg-gray-50 text-gray-900"}`}>
				{session?.user?.role === "partner" ? (
					<PartnerDashboard
						session={session}
						stats={stats}
						referralLink={referralLink}
						referrals={referrals}
						isDark={isDark}
						onCopy={copyToClipboard}
						onShare={shareOnSocialMedia}
					/>
				) : session?.user?.role === "admin" ? (
					<AdminDashboard
						stats={stats}
						partners={partners}
						referrals={referrals}
						isDark={isDark}
						showPasswords={showPasswords}
						onTogglePasswords={() => setShowPasswords(!showPasswords)}
					/>
				) : (
					<div className="flex items-center justify-center py-20">
						<div className={`text-center ${isDark ? "text-white" : "text-gray-900"}`}>
							<p className="text-lg mb-4">Unable to determine user role</p>
							<p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Please contact support or try logging in again</p>
						</div>
					</div>
				)}
			</main>
		</>
	);
}

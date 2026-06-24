"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaRegTimesCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { PartnerDashboardV2 } from "@/components/dashboard/partner-dashboard-v2";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { Sidebar } from "@/components/layouts/sidebar";
import { baseUrl } from "@/config";

export default function Dashboard() {
	const router = useRouter();
	const { data: session, status } = useSession();
	const [isDark, setIsDark] = useState(true);
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [referralLink, setReferralLink] = useState("");
	const [referrals, setReferrals] = useState<any[]>([]);
	const [stats, setStats] = useState({
		total_referrals: 0,
		successful_conversions: 0,
		pending_reviews: 0,
		this_month: 0,
		commission_paid: 0,
		commission_pending: 0,
		commission_awaiting_approval: 0,
		commission_available: 0,
		commission_locked: 0,
		in_pipeline: 0,
		referred_partners: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const checkTheme = () =>
			setIsDark(document.documentElement.classList.contains("dark"));
		checkTheme();
		const observer = new MutationObserver(checkTheme);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (status === "loading") return;

		if (status === "unauthenticated") {
			router.push("/auth/login");
			return;
		}

		if (!session?.user) return;

		const hasPartnerCode = Boolean(session.user.partner_code);
		const needsOnboarding =
			(session.user as { needsOnboarding?: boolean }).needsOnboarding &&
			!hasPartnerCode;

		if (needsOnboarding) {
			router.push("/auth/onboarding");
			return;
		}

		const userRole =
			session.user.role || (hasPartnerCode ? "partner" : undefined);

		if (userRole === "partner" && hasPartnerCode) {
			const appUrl =
				process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
			setReferralLink(
				`${appUrl}/auth/register?ref=${session.user.partner_code}`,
			);
			fetchPartnerReferrals(session.user.id);
		} else if (userRole === "admin") {
			setIsLoading(false);
		} else {
			setIsLoading(false);
		}
	}, [session, status, router]);

	const fetchPartnerReferrals = async (partnerId: string) => {
		try {
			const [statsRes, referralsRes] = await Promise.all([
				fetch(`${baseUrl}/api/referrals/stats?partner_id=${partnerId}`, {
					cache: "no-store",
				}),
				fetch(`${baseUrl}/api/referrals?partner_id=${partnerId}`, {
					cache: "no-store",
				}),
			]);

			const statsData = await statsRes.json();
			const referralsData = await referralsRes.json();

			if (statsData.success && referralsData.success) {
				const s = statsData.data;
				setReferrals(referralsData.data.referrals);
				setStats({
					total_referrals: s.total ?? 0,
					successful_conversions: s.successful_conversions ?? s.converted ?? 0,
					pending_reviews: s.pending ?? 0,
					this_month: s.commission_paid ?? 0,
					commission_paid: s.commission_paid ?? 0,
					commission_pending: s.commission_pending ?? 0,
					commission_awaiting_approval:
						s.commission_awaiting_generation ??
						s.commission_awaiting_approval ??
						0,
					commission_available: s.commission_available ?? 0,
					commission_locked: s.commission_locked ?? 0,
					in_pipeline: s.in_pipeline ?? 0,
					referred_partners: s.referred_partners ?? 0,
				});
			} else {
				setError("Failed to load dashboard data");
			}
		} catch {
			setError("Failed to load dashboard data");
		} finally {
			setIsLoading(false);
		}
	};

	const shareOnSocialMedia = (platform: string) => {
		const text = "Check out this amazing partner referral program!";
		const url = referralLink;
		const urls: Record<string, string> = {
			facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
			twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
			linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
			whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`,
			email: `mailto:?subject=${encodeURIComponent("Partner Referral Program")}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
		};
		if (urls[platform]) window.open(urls[platform], "_blank");
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
	};

	if (isLoading || status === "loading") {
		return (
			<main
				className={`px-4 sm:px-6 lg:px-8 rounded-md lg:py-8 my-8 sm:py-6 w-full max-w-7xl mx-auto ${isDark ? "bg-slate-950 text-white" : "bg-gray-50 text-gray-900"} transition-opacity duration-300`}
			>
				<div className="space-y-6">
					{/* Header skeleton */}
					<div className="space-y-4">
						<div className={`h-8 w-1/3 rounded-lg animate-pulse ${isDark ? "bg-white/10" : "bg-gray-200"}`} />
						<div className={`h-4 w-1/2 rounded-lg animate-pulse ${isDark ? "bg-white/10" : "bg-gray-200"}`} />
					</div>

					{/* Stats cards skeleton */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{[1, 2, 3, 4].map((i) => (
							<div
								key={i}
								className="space-y-3 p-6 rounded-lg border"
							>
								<div className={`h-4 w-1/2 rounded animate-pulse ${isDark ? "bg-white/10" : "bg-gray-200"}`} />
								<div className={`h-8 w-3/4 rounded animate-pulse ${isDark ? "bg-white/10" : "bg-gray-200"}`} />
							</div>
						))}
					</div>

					{/* Referral link skeleton */}
					<div className="space-y-3 p-6 rounded-lg border">
						<div className={`h-4 w-1/4 rounded animate-pulse ${isDark ? "bg-white/10" : "bg-gray-200"}`} />
						<div className={`h-12 w-full rounded animate-pulse ${isDark ? "bg-white/10" : "bg-gray-200"}`} />
					</div>

					{/* Referrals table skeleton */}
					<div className="space-y-4">
						<div className={`h-6 w-1/4 rounded animate-pulse ${isDark ? "bg-white/10" : "bg-gray-200"}`} />
						<div className="space-y-3">
							{[1, 2, 3, 4, 5].map((i) => (
								<div key={i} className="space-y-2 p-4 rounded-lg border">
									<div className={`h-4 w-1/3 rounded animate-pulse ${isDark ? "bg-white/10" : "bg-gray-200"}`} />
									<div className={`h-3 w-1/4 rounded animate-pulse ${isDark ? "bg-white/10" : "bg-gray-200"}`} />
								</div>
							))}
						</div>
					</div>
				</div>
			</main>
		);
	}

	if (error) {
		return (
			<main
				className={`px-4 sm:px-6 lg:px-8 rounded-md lg:py-8 my-8 sm:py-6 w-full max-w-7xl mx-auto ${isDark ? "bg-slate-950 text-white" : "bg-gray-50 text-gray-900"} transition-opacity duration-300`}
			>
				<div className="flex items-center justify-center py-20 text-center">
					<div>
						<FaRegTimesCircle className="w-8 h-8 mx-auto mb-4 text-red-400" />
						<p className="text-lg mb-2">Error Loading Data</p>
						<p className="text-sm text-gray-500">{error}</p>
						<Button
							onClick={() => window.location.reload()}
							className="mt-4"
						>
							Retry
						</Button>
					</div>
				</div>
			</main>
		);
	}

	return (
		<div className="flex min-h-screen">
			<Sidebar isDark={isDark} isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
			<main
				className={`flex-1 px-4 sm:px-6 lg:px-8 py-8 ${isDark ? "bg-slate-950 text-white" : "bg-gray-50 text-gray-900"}`}
				style={{ marginLeft: isSidebarCollapsed ? '5rem' : '16rem' }}
			>
				{session?.user?.role === "partner" ? (
					<PartnerDashboardV2
						session={session}
						stats={stats}
						referralLink={referralLink}
						referrals={referrals}
						isDark={isDark}
						onCopy={copyToClipboard}
						onShare={shareOnSocialMedia}
					/>
				) : session?.user?.role === "admin" && session ? (
					<AdminDashboard session={session} isDark={isDark} />
				) : (
					<div className="flex items-center justify-center py-20 text-center">
						<p className="text-lg mb-2">Unable to determine user role</p>
						<p className="text-sm text-gray-500">
							Please contact support or try logging in again
						</p>
					</div>
				)}
			</main>
		</div>
	);
}

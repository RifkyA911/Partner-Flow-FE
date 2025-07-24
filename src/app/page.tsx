import { Gift, TrendingUp, Network, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
	return (
		<div className="min-h-screen bg-white">
			{/* Header */}
			<header className="text-center py-8 px-4">
				<h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
					AICE Tangerang Referral Dashboard
				</h1>

				<p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
					Bergabung dalam komunitas distribusi AICE Tangerang.
					Rekomendasikan untuk menjadi bagian dari mitra AICE
					Tangerang, dapatkan komisi, dan berkembang bersama program
					viral dari AICE Tangerang
				</p>
			</header>

			{/* Features Section */}
			<section className="py-12 px-4">
				<div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
					{/* Dapatkan Komisi */}
					<div className="text-center">
						<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<Gift className="w-8 h-8 text-blue-600" />
						</div>
						<h3 className="text-xl font-semibold text-gray-800 mb-3">
							Dapatkan Komisi
						</h3>
						<p className="text-gray-600 text-sm leading-relaxed">
							Dapat Rp50.000 untuk setiap rekomendasi yang
							disetujui oleh Perusahaan dan bergabung dalam rantai
							distribusi kami
						</p>
					</div>

					{/* Pertumbuhan Viral */}
					<div className="text-center">
						<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<TrendingUp className="w-8 h-8 text-green-600" />
						</div>
						<h3 className="text-xl font-semibold text-gray-800 mb-3">
							Pertumbuhan Viral
						</h3>
						<p className="text-gray-600 text-sm leading-relaxed">
							Rekomendasi kalian apabila disetujui maka akan
							otomatis langsung bersama kami dan akan mendapatkan
							unique link sendiri
						</p>
					</div>

					{/* Efek Jaringan */}
					<div className="text-center">
						<div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<Network className="w-8 h-8 text-yellow-600" />
						</div>
						<h3 className="text-xl font-semibold text-gray-800 mb-3">
							Efek Jaringan
						</h3>
						<p className="text-gray-600 text-sm leading-relaxed">
							Bangun level referensi tanpa batas dan tingkatkan
							penghasilan Anda
						</p>
					</div>
				</div>
			</section>

			{/* Login Cards Section */}
			<section className="py-12 px-4">
				<div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
					{/* Partner Login Card */}
					<Card className="bg-white shadow-lg border-0">
						<CardHeader className="text-center pb-4">
							<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<User className="w-8 h-8 text-blue-600" />
							</div>
							<CardTitle className="text-2xl font-bold text-gray-800">
								Partner Login
							</CardTitle>
							<CardDescription className="text-gray-600 mt-2">
								Access your partner dashboard to view referrals,
								track earnings, and get your unique referral
								links.
							</CardDescription>
						</CardHeader>
						<CardContent className="text-center">
							<Link href="/partners">
								<Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium mb-3">
									Login as Partner
								</Button>
							</Link>
							<p className="text-sm text-gray-500">
								Use your referral code to access your dashboard
							</p>
						</CardContent>
					</Card>

					{/* Admin Access Card */}
					<Card className="bg-red-50 shadow-lg border-red-100">
						<CardHeader className="text-center pb-4">
							<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<Shield className="w-8 h-8 text-red-600" />
							</div>
							<CardTitle className="text-2xl font-bold text-gray-800">
								Admin Access
							</CardTitle>
							<CardDescription className="text-gray-600 mt-2">
								Manage the referral system, approve conversions,
								import partners, and monitor system performance.
							</CardDescription>
						</CardHeader>
						<CardContent className="text-center">
							<Link href="/auth/register">
								<Button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-medium mb-3">
									Admin Dashboard
								</Button>
							</Link>
							<p className="text-sm text-red-600">
								Administrative access required
							</p>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* How It Works Section */}
			<section className="py-16 px-4 bg-white">
				<div className="max-w-6xl mx-auto">
					<h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
						Bagaimana Cara Kerjanya?
					</h2>

					<div className="grid md:grid-cols-4 gap-8">
						{/* Step 1 */}
						<div className="text-center">
							<div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
								1
							</div>
							<h3 className="text-lg font-semibold text-gray-800 mb-3">
								Dapatkan Kode Anda
							</h3>
							<p className="text-gray-600 text-sm">
								Dapatkan kode unik dan link anda
							</p>
						</div>

						{/* Step 2 */}
						<div className="text-center">
							<div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
								2
							</div>
							<h3 className="text-lg font-semibold text-gray-800 mb-3">
								Bagikan & Promosikan
							</h3>
							<p className="text-gray-600 text-sm">
								Bagikan kode unik link anda ke referensi anda
								atau melalui jaringan sosial anda
							</p>
						</div>

						{/* Step 3 */}
						<div className="text-center">
							<div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
								3
							</div>
							<h3 className="text-lg font-semibold text-gray-800 mb-3">
								Konversi Otomatis
							</h3>
							<p className="text-gray-600 text-sm">
								Referensi yang disetujui menjadi mitra baru
							</p>
						</div>

						{/* Step 4 */}
						<div className="text-center">
							<div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
								4
							</div>
							<h3 className="text-lg font-semibold text-gray-800 mb-3">
								Dapatkan Penghasilan Tambahan
							</h3>
							<p className="text-gray-600 text-sm">
								Dapatkan penghasilan tambahan apabila referensi
								anda disetujui oleh Perusahaan
							</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

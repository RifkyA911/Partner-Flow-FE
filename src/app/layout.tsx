import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavbarMenu } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/providers/theme-provider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Partner Flow - Transform Your Network Into Revenue",
	description: "Join the ultimate referral platform. Recommend partners, earn commissions, and build an unlimited network of growth opportunities with Partner Flow.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ThemeProvider>
					<SessionProvider>
						<NavbarMenu />
						<div className="min-h-screen">
							{children}
						</div>
						<Footer />
					</SessionProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}

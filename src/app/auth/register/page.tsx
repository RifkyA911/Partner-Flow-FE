"use client";

import { useState } from "react";
import { FaShippingFast, FaHeadset } from "react-icons/fa";
import { FaRegMoneyBillAlt } from "react-icons/fa";

export default function RegisterPartner() {
	const [form, setForm] = useState({
		company: "",
		industry: "",
		contact: "",
		email: "",
		phone: "",
		volume: "",
		address: "",
		agree: false,
		marketing: false,
	});

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const target = e.target;
		const { name, type, value } = target;

		let newValue: unknown;

		if (type === "checkbox" && "checked" in target) {
			newValue = (target as HTMLInputElement).checked;
		} else if (type === "file" && "files" in target) {
			newValue = (target as HTMLInputElement).files?.[0] ?? null;
		} else if (type === "number") {
			newValue = Number(value);
		} else {
			newValue = value;
		}

		setForm((prev) => ({
			...prev,
			[name]: newValue,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: handle registration logic
		alert("Registration submitted!");
	};

	return (
		<main className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-2 sm:px-6 lg:px-8 sm:py-6 w-full max-w-7xl mx-auto">
			{/* Referral Banner */}
			<div className="w-full max-w-xl bg-green-600 rounded-lg p-6 mb-8 flex flex-col items-center text-white text-center">
				<div className="text-4xl mb-2">🎁</div>
				<h2 className="text-xl font-semibold mb-1">
					Welcome! You've been referred by a trusted partner
				</h2>
				<p className="mb-3">
					Join our distribution network and get exclusive benefits
				</p>
				<div className="bg-green-700 rounded-md px-4 py-1 text-sm font-medium inline-block">
					Referred by:{" "}
					<span className="font-bold">TK. IWAN - CIPUTAT (D)</span>
				</div>
			</div>

			{/* Features */}
			<div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
				<div className="flex flex-col items-center text-center">
					<FaShippingFast className="text-blue-500 text-2xl mb-2" />
					<div className="font-semibold">Fast Delivery</div>
					<div className="text-sm text-gray-600">
						Quick and reliable distribution network across the
						region
					</div>
				</div>
				<div className="flex flex-col items-center text-center">
					<FaRegMoneyBillAlt className="text-green-600 text-2xl mb-2" />
					<div className="font-semibold">Competitive Pricing</div>
					<div className="text-sm text-gray-600">
						Best rates in the market with volume discounts
					</div>
				</div>
				<div className="flex flex-col items-center text-center">
					<FaHeadset className="text-orange-500 text-2xl mb-2" />
					<div className="font-semibold">24/7 Support</div>
					<div className="text-sm text-gray-600">
						Round-the-clock customer service and technical support
					</div>
				</div>
			</div>

			{/* Registration Form */}
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-xl bg-white rounded-lg shadow p-6 flex flex-col gap-4"
			>
				<h3 className="text-xl font-bold text-center mb-2">
					Create Your Account
				</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium mb-1">
							Company Name *
						</label>
						<input
							name="company"
							value={form.company}
							onChange={handleChange}
							required
							className="w-full border rounded px-3 py-2 text-sm"
							placeholder="Your Company Ltd."
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">
							Industry *
						</label>
						<select
							name="industry"
							value={form.industry}
							onChange={handleChange}
							required
							className="w-full border rounded px-3 py-2 text-sm bg-white"
						>
							<option value="">Select Industry</option>
							<option value="retail">Retail</option>
							<option value="wholesale">Wholesale</option>
							<option value="food">Food & Beverage</option>
							<option value="other">Other</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">
							Contact Person *
						</label>
						<input
							name="contact"
							value={form.contact}
							onChange={handleChange}
							required
							className="w-full border rounded px-3 py-2 text-sm"
							placeholder="John Doe"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">
							Email Address *
						</label>
						<input
							name="email"
							type="email"
							value={form.email}
							onChange={handleChange}
							required
							className="w-full border rounded px-3 py-2 text-sm"
							placeholder="john@company.com"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">
							Phone Number *
						</label>
						<input
							name="phone"
							value={form.phone}
							onChange={handleChange}
							required
							className="w-full border rounded px-3 py-2 text-sm"
							placeholder="+1 (555) 123-4567"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">
							Expected Monthly Volume
						</label>
						<select
							name="volume"
							value={form.volume}
							onChange={handleChange}
							className="w-full border rounded px-3 py-2 text-sm bg-white"
						>
							<option value="">Select Volume</option>
							<option value="100-500">100-500</option>
							<option value="500-1000">500-1000</option>
							<option value="1000-5000">1000-5000</option>
							<option value=">5000">5000+</option>
						</select>
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium mb-1">
						Business Address *
					</label>
					<textarea
						name="address"
						value={form.address}
						onChange={handleChange}
						required
						className="w-full border rounded px-3 py-2 text-sm min-h-[48px]"
						placeholder="Street address, City, State, ZIP"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label className="inline-flex items-center gap-2 text-sm">
						<input
							type="checkbox"
							name="agree"
							checked={form.agree}
							onChange={handleChange}
							required
							className="accent-blue-600"
						/>
						I agree to the{" "}
						<a href="#" className="text-blue-600 underline">
							Terms of Service
						</a>{" "}
						and{" "}
						<a href="#" className="text-blue-600 underline">
							Privacy Policy
						</a>
					</label>
					<label className="inline-flex items-center gap-2 text-sm">
						<input
							type="checkbox"
							name="marketing"
							checked={form.marketing}
							onChange={handleChange}
							className="accent-blue-600"
						/>
						I would like to receive marketing communications and
						updates
					</label>
				</div>
				<button
					type="submit"
					className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded py-2 mt-2 transition"
				>
					Join Partner Network
				</button>
			</form>
		</main>
	);
}

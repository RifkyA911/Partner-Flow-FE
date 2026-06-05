import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { baseUrl } from "@/config";

export async function POST(request: NextRequest) {
	try {
		const session = await auth();

		if (!session?.user) {
			return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { company_name, industry, contact_person, phone, monthly_volume, address } = body;

		// Validate required fields
		if (!company_name || !industry || !contact_person || !phone || !monthly_volume || !address) {
			return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
		}

		// Call backend API to complete onboarding
		const res = await fetch(`${baseUrl}/api/partners/onboarding`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user_id: session.user.id,
				email: session.user.email,
				name: session.user.name,
				company_name,
				industry,
				contact_person,
				phone,
				monthly_volume,
				address,
			}),
		});

		const data = await res.json();

		if (data.success) {
			return NextResponse.json({
				success: true,
				data: {
					...data.data,
					user: {
						id: data.data.id,
						partner_code: data.data.partner_code,
						role: data.data.role ?? "partner",
						name: data.data.company_name,
					},
				},
			});
		} else {
			const errMsg =
				typeof data.error === "string"
					? data.error
					: data.error?.message ?? "Onboarding failed";
			return NextResponse.json({ success: false, error: errMsg }, { status: 400 });
		}
	} catch (error) {
		console.error("Onboarding error:", error);
		return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
	}
}

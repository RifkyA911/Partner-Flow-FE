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
			return NextResponse.json({ success: true, data: data.data });
		} else {
			return NextResponse.json({ success: false, error: data.error || "Onboarding failed" }, { status: 400 });
		}
	} catch (error) {
		console.error("Onboarding error:", error);
		return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
	}
}

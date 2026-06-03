import { NextRequest, NextResponse } from 'next/server';

interface Partner {
  id: string;
  partner_code: string;
  company_name: string;
  industry: string;
  contact_person: string;
  email: string;
  phone: string;
  monthly_volume: string;
  address: string;
  password_hash: string;
  status: string;
  referred_by: string | null;
  has_marketing_consent: boolean;
  created_at: string;
  updated_at: string;
}

// Dummy data storage
const partners: Partner[] = [
  {
    id: '1',
    partner_code: 'PRT-2025-594589',
    company_name: 'TK. IWAN - CIPUTAT',
    industry: 'wholesale',
    contact_person: 'Iwan',
    email: 'iwan@example.com',
    phone: '08123456789',
    monthly_volume: '1000-5000',
    address: 'Jl. Ciputat No. 123',
    password_hash: 'hashed_password',
    status: 'active',
    referred_by: null,
    has_marketing_consent: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      company_name,
      industry,
      contact_person,
      email,
      phone,
      monthly_volume,
      address,
      password,
      agree_terms,
      marketing_consent,
      referral_code,
    } = body;

    // Validation
    if (!company_name || !contact_person || !email || !phone || !password) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required fields',
          },
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingPartner = partners.find((p) => p.email === email);
    if (existingPartner) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'CONFLICT',
            message: 'Email already registered',
          },
        },
        { status: 409 }
      );
    }

    // Generate partner code
    const year = new Date().getFullYear();
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const partner_code = `PRT-${year}-${randomNum}`;

    // Find referrer if referral code provided
    let referred_by = null;
    if (referral_code) {
      const referrer = partners.find((p) => p.partner_code === referral_code);
      if (referrer) {
        referred_by = referrer.id;
      }
    }

    // Create new partner
    const newPartner = {
      id: String(partners.length + 1),
      partner_code,
      company_name,
      industry,
      contact_person,
      email,
      phone,
      monthly_volume,
      address,
      password_hash: `hashed_${password}`, // In real app, use bcrypt
      status: 'active',
      referred_by,
      has_marketing_consent: marketing_consent || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    partners.push(newPartner);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: newPartner.id,
          partner_code: newPartner.partner_code,
          company_name: newPartner.company_name,
          email: newPartner.email,
          referred_by,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Server error',
        },
      },
      { status: 500 }
    );
  }
}

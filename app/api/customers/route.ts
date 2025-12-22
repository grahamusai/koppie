import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';

export async function POST(request: NextRequest) {
    try {
        // Get token from Authorization header
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Verify user with the token
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            console.error('Auth error:', authError);
            return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
        }

        // Get the form data from the request
        const body = await request.json();

        // Prepare the data to insert (matches your form and database schema)
        const newCustomer = {
            customerType: body.customerType,
            firstName: body.firstName,
            lastName: body.lastName,
            businessName: body.businessName,
            email: body.email,
            phone: body.phone,
            addressLine1: body.addressLine1,
            addressLine2: body.addressLine2,
            city: body.city,
            province: body.province,
            postalCode: body.postalCode,
            country: body.country,
            idNumber: body.idNumber,
            registrationNumber: body.registrationNumber,
            vatNumber: body.vatNumber,
            taxNumber: body.taxNumber,
            status: body.status,
            notes: body.notes,
            createdBy: user.id,  // Link to the logged-in user
        };

        // Insert into the database and return the new customer
        const result = await db.insert(customers).values(newCustomer).returning();
        return NextResponse.json({ customer: result[0] }, { status: 201 });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
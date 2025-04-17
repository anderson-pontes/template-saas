import stripe from '@/app/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { testeId } = await req.json();

    const price = process.env.STRIPE_SUBSCRIPTION_PRICE_ID;

    if (!price) {
        return NextResponse.json({ error: 'Price ID not found' }, { status: 500 });
    }
    const metadata = {
        testeId,
    }

    try{
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [
                {
                    price,
                    quantity: 1,
                },
            ],
            payment_method_types: ['card'],
            success_url: `${req.headers.get('origin')}/success`,
            cancel_url: `${req.headers.get('origin')}/`,
            metadata,
            
        });

    }catch (error) {
        console.error(error);
        return NextResponse.error();
    }

}
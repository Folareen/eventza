import stripe from "../config/stripe";

export const onboardAccount = async ({ email, name }: { email: string, name: string }) => {
    try {
        const account = await stripe.v2.core.accounts.create({
            display_name: name,
            contact_email: email,
            dashboard: "express",
            defaults: {
                responsibilities: {
                    fees_collector: "application",
                    losses_collector: "application",
                },
            },
            identity: {
                country: 'US',
                business_details: {
                    registered_name: name
                }
            },
            configuration: {
                recipient: {
                    capabilities: {
                        stripe_balance: {
                            stripe_transfers: {
                                requested: true,
                            },
                        },
                    },
                },
            },
        });

        return account;
    } catch (error) {
        console.error("Error creating Stripe Connect account:", error);
        throw error;
    }
}

// export const createStripeProduct = async ({ name, description, price, accountId }: { name: string, desc }) => {
//     const productName = ticketName,
//     const productDescription = req.body.productDescription;
//     const productPrice = req.body.productPrice;
//     const accountId = req.body.accountId; // Get the connected account ID

//     try {
//         // Create the product on the platform
//         const product = await stripe.products.create(
//             {
//                 name: productName,
//                 description: productDescription,
//                 metadata: { stripeAccount: accountId }
//             }
//         );

//         // Create a price for the product on the platform
//         const price = await stripe.prices.create(
//             {
//                 product: product.id,
//                 unit_amount: productPrice,
//                 currency: "usd",
//                 metadata: { stripeAccount: accountId }
//             },
//         );

//         res.json({
//             productName: productName,
//             productDescription: productDescription,
//             productPrice: productPrice,
//             priceId: price.id,
//         });
//     } catch (err) {
//     }
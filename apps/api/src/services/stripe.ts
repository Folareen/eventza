import stripe from "../config/stripe";

export const onboardAccount = async ({ email, name }: { email: string, name: string }) => {
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
                registered_name: name,
            },
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
};

export const createAccountLink = async (accountId: string, returnUrl: string, refreshUrl: string) => {
    const link = await stripe.accountLinks.create({
        account: accountId,
        type: 'account_onboarding',
        return_url: returnUrl,
        refresh_url: refreshUrl,
    });
    return link;
};

export const createLoginLink = async (accountId: string) => {
    const link = await stripe.accounts.createLoginLink(accountId);
    return link;
};

export const createPaymentIntent = async ({
    amount,
    currency,
    applicationFeeAmount,
    destinationAccountId,
    metadata,
}: {
    amount: number;
    currency: string;
    applicationFeeAmount: number;
    destinationAccountId: string;
    metadata: Record<string, string>;
}) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        application_fee_amount: applicationFeeAmount,
        transfer_data: {
            destination: destinationAccountId,
        },
        metadata,
    });
    return paymentIntent;
};

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
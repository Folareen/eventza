export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    emailVerified: boolean;
    stripeAccountId: string | null;
    createdAt: string;
    updatedAt: string;
}

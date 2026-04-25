export type OrderStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Order {
    id: number;
    ticketId: number;
    name: string;
    email: string;
    amount: number;
    code: string;
    status: OrderStatus;
    checkedIn: boolean;
    createdAt: string;
    updatedAt: string;
}

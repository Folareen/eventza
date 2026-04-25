export interface Ticket {
    id: number;
    eventId: number;
    name: string;
    description: string | null;
    price: number;
    quantityAvailable: number;
    quantitySold: number;
    createdAt: string;
    updatedAt: string;
}

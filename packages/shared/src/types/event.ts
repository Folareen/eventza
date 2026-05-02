import type { Ticket } from './ticket';

export interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    venue: string;
    state: string;
    country: string;
    category: string;
    capacity: number;
    bannerImage: string;
    organizerId: number;
    createdAt: string;
    updatedAt: string;
    tickets?: Ticket[];
}

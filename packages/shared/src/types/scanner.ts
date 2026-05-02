export interface Scanner {
    id: number;
    username: string;
    userId: number;
    events?: { id: number; title: string }[];
    createdAt: string;
    updatedAt: string;
}

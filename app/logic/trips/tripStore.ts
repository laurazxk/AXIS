import { tripDraft, type TripDraft } from "./tripDraft";

export type Expense = {
    id: string;
    name: string;
    value: number;
    color: string;
    people: number;
    perPerson: number;
    currency: string;
};

export type SavedTrip = TripDraft & {
    id: string;
    expenses: Expense[];
};

export const savedTrips: SavedTrip[] = [];

export function saveTrip() {
    const trip: SavedTrip = {
        ...tripDraft,
        interests: [...tripDraft.interests],
        id: Date.now().toString(),
        expenses: [],
    };

    savedTrips.push(trip);

    return trip;
}
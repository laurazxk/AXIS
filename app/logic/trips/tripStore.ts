import { tripDraft, type TripDraft } from "./tripDraft";

export type SavedTrip = TripDraft & {
    id: string;
};

export const savedTrips: SavedTrip[] = [];

export function saveTrip() {
    const trip: SavedTrip = {
        ...tripDraft,
        interests: [...tripDraft.interests],
        id: Date.now().toString(),
    };

    savedTrips.push(trip);

    return trip;
}
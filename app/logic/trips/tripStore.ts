import { tripDraft, type TripDraft } from "./tripDraft";
import { createTripInvitation, type TripInvitation } from "../../../utils/tripInvitation";

export type Expense = {
  id: string;
  name: string;
  value: number;
  color: string;
  people: number;
  perPerson: number;
  currency: string;
};

export type TripActivity = {
  id: number;
  day: number;
  time: string;
  title: string;
  completed: boolean;
};

export type SavedTrip = TripDraft & {
  id: string;
  expenses: Expense[];
  activities: TripActivity[];
  invitation: TripInvitation;
};

export const savedTrips: SavedTrip[] = [];
const listeners = new Set<() => void>();

export function subscribeToTrips(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function notifyTripsChanged() {
  listeners.forEach(listener => listener());
}

export function getSavedTrips(): SavedTrip[] {
  return [...savedTrips];
}

export function saveTrip(activities: TripActivity[] = []): SavedTrip {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const draft: TripDraft = {
    ...tripDraft,
    interests: [...tripDraft.interests],
  };
  const invitation = createTripInvitation({
    tripId: id,
    destination: draft.destination || "Destino a definir",
    startDate: draft.dateMode === "dates" ? draft.startDate : "",
    endDate: draft.dateMode === "dates" ? draft.endDate : "",
  });
  const trip: SavedTrip = {
    ...draft,
    id,
    expenses: [],
    activities: activities.map(item => ({ ...item })),
    invitation,
  };
  savedTrips.push(trip);
  notifyTripsChanged();
  return trip;
}

export function updateTripActivities(tripId: string, activities: TripActivity[]): void {
  const trip = savedTrips.find(item => item.id === tripId);
  if (!trip) return;
  trip.activities = activities.map(item => ({ ...item }));
  notifyTripsChanged();
}

export function deleteTrip(tripId: string): boolean {
  const index = savedTrips.findIndex(item => item.id === tripId);
  if (index === -1) return false;
  savedTrips.splice(index, 1);
  notifyTripsChanged();
  return true;
}
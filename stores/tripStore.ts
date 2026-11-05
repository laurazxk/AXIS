
import { createTripInvitation, type TripInvitation } from "../utils/tripInvitation";
import { tripDraft, type TripDraft } from "./tripDraft";


export type Expense = {
  id: string;
  name: string;

  // Valor e moeda originais informados pelo usuário
  value: number;
  currency: string;

  // Conversão para a moeda de referência do Axis (BRL)
  exchangeRate: number;
  valueBRL: number;

  color: string;
  people: number;

  // Valores individuais
  perPerson: number;
  perPersonBRL: number;
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

  return () => {
    listeners.delete(listener);
  };
}

function notifyTripsChanged() {
  listeners.forEach((listener) => listener());
}

export function getSavedTrips(): SavedTrip[] {
  return [...savedTrips];
}

export function addTripExpense(
  tripId: string,
  expense: Expense
): boolean {
  const trip = savedTrips.find((item) => item.id === tripId);

  if (!trip) return false;

  trip.expenses.push(expense);
  notifyTripsChanged();

  return true;
}

export function saveTrip(
  activities: TripActivity[] = []
): SavedTrip {
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
    activities: activities.map((item) => ({ ...item })),
    invitation,
  };

  savedTrips.push(trip);
  notifyTripsChanged();

  return trip;
}

export function updateTripActivities(
  tripId: string,
  activities: TripActivity[]
): void {
  const trip = savedTrips.find((item) => item.id === tripId);

  if (!trip) return;

  trip.activities = activities.map((item) => ({ ...item }));
  notifyTripsChanged();
}

export function deleteTrip(tripId: string): boolean {
  const index = savedTrips.findIndex((item) => item.id === tripId);

  if (index === -1) return false;

  savedTrips.splice(index, 1);
  notifyTripsChanged();

  return true;
}

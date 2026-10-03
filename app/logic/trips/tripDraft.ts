
export type TripDateMode = "duration" | "dates";

export type TripDraft = {
    destination: string;
    country: string;
    countryCode: string;
    localCurrency: string;
    dateMode: TripDateMode;
    duration: number;
    startDate: string;
    endDate: string;
    interests: string[];
    budgetCurrency: string;
    budget: string;
};

export const tripDraft: TripDraft = {
    destination: "",
    country: "",
    countryCode: "",
    localCurrency: "EUR",
    dateMode: "duration",
    duration: 3,
    startDate: "",
    endDate: "",
    interests: [],
    budgetCurrency: "BRL",
    budget: "",
};

export function resetTripDraft() {
    tripDraft.destination = "";
    tripDraft.country = "";
    tripDraft.countryCode = "";
    tripDraft.localCurrency = "EUR";
    tripDraft.dateMode = "duration";
    tripDraft.duration = 3;
    tripDraft.startDate = "";
    tripDraft.endDate = "";
    tripDraft.interests = [];
    tripDraft.budgetCurrency = "BRL";
    tripDraft.budget = "";
}
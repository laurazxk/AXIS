export type TripInvitation = {
    tripId: string;
    destination: string;
    startDate: string;
    endDate: string;
    code: string;
  };
  
  const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  
  function randomCharacters(length: number): string {
    let result = "";
  
    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * ALPHABET.length);
      result += ALPHABET[index];
    }
  
    return result;
  }
  
  export function generateInvitationCode(): string {
    return `AXIS-${randomCharacters(4)}-${randomCharacters(4)}`;
  }
  
  export function createTripInvitation(
    trip: Omit<TripInvitation, "code">,
  ): TripInvitation {
    return {
      ...trip,
      code: generateInvitationCode(),
    };
  }
  
  export function normalizeInvitationCode(code: string): string {
    return code.trim().toUpperCase().replace(/\s+/g, "");
  }
  
  export function formatTripDate(date: string): string {
    if (!date) return "A definir";
  
    const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  
    if (match) {
      return `${match[3]}/${match[2]}/${match[1]}`;
    }
  
    return date;
  }
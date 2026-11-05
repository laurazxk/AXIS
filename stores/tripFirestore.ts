import {
  addDoc,
    arrayUnion,
    collection,
    doc,
    deleteDoc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    runTransaction,
    serverTimestamp,
    where,
    writeBatch,
  } from "firebase/firestore";
  
  import { auth,db } from "../lib/firebase";
  import {
    createTripInvitation,
    normalizeInvitationCode,
    type TripInvitation,
    
  } from "../utils/tripInvitation";
  
  import { tripDraft, type TripDraft } from "./tripDraft";
  
  import type { SavedTrip, Expense } from "./tripStore";
  
  export type TripActivityData = {
    id: string | number;
    day: number;
    time: string;
    title: string;
    completed: boolean;
  };
  
  type CreateTripResult = {
    tripId: string;
    invitation: TripInvitation;
  };
  
  export async function deleteActivityFromFirestore(
    tripId: string,
    activityId: string
  ): Promise<void> {
    if (!tripId || !activityId) {
      throw new Error("Não foi possível identificar a atividade.");
    }
  
    if (!auth.currentUser) {
      throw new Error("Você precisa estar autenticado.");
    }
  
    const activityRef = doc(
      db,
      "trips",
      tripId,
      "activities",
      activityId
    );
  
    await deleteDoc(activityRef);
  }
  
  export async function createTripInFirestore(
    ownerId: string,
    activities: TripActivityData[]
  ): Promise<CreateTripResult> {
    if (!ownerId) {
      throw new Error(
        "É necessário estar autenticado para criar uma viagem."
      );
    }
  
    const draft: TripDraft = {
      ...tripDraft,
      interests: [...tripDraft.interests],
    };
  
    const tripRef = doc(collection(db, "trips"));
  
    // Prepara os documentos das atividades.
    const activityDocuments = activities.map((activity) => ({
      ref: doc(collection(tripRef, "activities")),
      data: {
        day: activity.day,
        time: activity.time,
        title: activity.title,
        completed: activity.completed,
        createdAt: serverTimestamp(),
      },
    }));
  
    const maxAttempts = 10;
  
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const invitation = createTripInvitation({
        tripId: tripRef.id,
        destination: draft.destination || "Destino a definir",
        startDate: draft.dateMode === "dates" ? draft.startDate : "",
        endDate: draft.dateMode === "dates" ? draft.endDate : "",
      });
  
      const invitationRef = doc(
        db,
        "tripInvitations",
        invitation.code
      );
  
      const codeReserved = await runTransaction(
        db,
        async (transaction) => {
          const invitationSnapshot = await transaction.get(
            invitationRef
          );
  
          if (invitationSnapshot.exists()) {
            return false;
          }
  
          transaction.set(tripRef, {
            ...draft,
            ownerId,
            memberIds: [ownerId],
            invitationCode: invitation.code,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
  
          transaction.set(invitationRef, {
            tripId: tripRef.id,
            createdBy: ownerId,
            createdAt: serverTimestamp(),
          });
  
          // Salva cada atividade na subcoleção da viagem.
          for (const activity of activityDocuments) {
            transaction.set(activity.ref, activity.data);
          }
  
          return true;
        }
      );
  
      if (codeReserved) {
        return {
          tripId: tripRef.id,
          invitation,
        };
      }
    }
  
    throw new Error(
      "Não foi possível gerar um código de convite exclusivo. Tente novamente."
    );
  }
  
  export async function addActivitiesToExistingTrip(
    tripId: string,
    activities: TripActivityData[]
  ): Promise<void> {
    if (!tripId) {
      throw new Error("Não foi possível identificar a viagem.");
    }
  
    if (!auth.currentUser) {
      throw new Error("Você precisa estar autenticado.");
    }
  
    if (activities.length === 0) {
      return;
    }
  
    const batch = writeBatch(db);
  
    for (const activity of activities) {
      const activityRef = doc(
        db,
        "trips",
        tripId,
        "activities",
        String(activity.id)
      );
  
      // Verifica se a atividade já existe no Firestore.
      const activitySnapshot = await getDoc(activityRef);
  
      // Se já existe, preserva a data original de criação.
      const createdAt = activitySnapshot.exists()
        ? activitySnapshot.data().createdAt
        : serverTimestamp();
  
      batch.set(activityRef, {
        day: activity.day,
        time: activity.time,
        title: activity.title,
        completed: activity.completed,
        createdAt,
      });
    }
  
    await batch.commit();
  }
  
   export async function getTripDuration(
    tripId: string
  ): Promise<number> {
    if (!tripId) {
      throw new Error("Não foi possível identificar a viagem.");
    }
  
    if (!auth.currentUser) {
      throw new Error("Você precisa estar autenticado.");
    }
  
    const tripRef = doc(db, "trips", tripId);
    const tripSnapshot = await getDoc(tripRef);
  
    if (!tripSnapshot.exists()) {
      throw new Error("Viagem não encontrada.");
    }
  
    const data = tripSnapshot.data();
    const duration = Number(data.duration);
  
    return Number.isFinite(duration) && duration > 0
      ? Math.floor(duration)
      : 1;
  }
  export async function deleteTripFromFirestore(
    tripId: string
  ): Promise<void> {
    if (!tripId) {
      throw new Error("Não foi possível identificar a viagem.");
    }
  
    const currentUser = auth.currentUser;
  
    if (!currentUser) {
      throw new Error("Você precisa estar autenticado.");
    }
  
    const tripRef = doc(db, "trips", tripId);
    const tripSnapshot = await getDoc(tripRef);
  
    if (!tripSnapshot.exists()) {
      throw new Error("Viagem não encontrada.");
    }
  
    const tripData = tripSnapshot.data();
  
    if (tripData.ownerId !== currentUser.uid) {
      throw new Error(
        "Somente o autor da viagem pode excluí-la."
      );
    }
  
    const batch = writeBatch(db);
  
    // Busca e exclui as atividades.
    const activitiesRef = collection(
      db,
      "trips",
      tripId,
      "activities"
    );
  
    const activitiesSnapshot = await getDocs(activitiesRef);
  
    activitiesSnapshot.docs.forEach((activityDocument) => {
      batch.delete(activityDocument.ref);
    });
  
    // Exclui o código de convite.
    if (tripData.invitationCode) {
      const invitationRef = doc(
        db,
        "tripInvitations",
        tripData.invitationCode
      );
  
      batch.delete(invitationRef);
    }
  
    // Exclui a viagem por último.
    batch.delete(tripRef);
  
    await batch.commit();
  }
  export async function getTripActivities(
    tripId: string
  ): Promise<TripActivityData[]> {
    if (!tripId) {
      throw new Error("Não foi possível identificar a viagem.");
    }
  
    if (!auth.currentUser) {
      throw new Error("Você precisa estar autenticado.");
    }
  
    const activitiesRef = collection(
      db,
      "trips",
      tripId,
      "activities"
    );
  
    const snapshot = await getDocs(activitiesRef);
  
    return snapshot.docs.map((activityDocument, index) => {
      const data = activityDocument.data();
  
      return {
        id: activityDocument.id,
        day: data.day,
        time: data.time,
        title: data.title,
        completed: data.completed,
      };
    });
  }
  export function subscribeToUserTrips(
    userId: string,
    onTripsChanged: (trips: SavedTrip[]) => void,
    onError?: (error: Error) => void
  ) {
    if (!userId) {
      onError?.(new Error("Usuário não autenticado."));
      return () => {};
    }
    console.log("UID recebido pela consulta:", userId);
  console.log("UID autenticado no Firebase:", auth.currentUser?.uid);
  console.log("Projeto Firebase:", db.app.options.projectId);
  console.log("TESTE: subscribeToUserTrips FOI EXECUTADA");
  const currentUser = auth.currentUser;
  
  console.log("USUÁRIO AUTENTICADO:", !!currentUser);
  console.log("UID DA AUTENTICAÇÃO:", currentUser?.uid);
  
  currentUser
    ?.getIdToken()
    .then((token) => {
      console.log("TOKEN FIREBASE VÁLIDO:", !!token);
    })
    .catch((error) => {
      console.error("ERRO AO OBTER TOKEN:", error);
    });
  
  
    const tripsQuery = query(
      collection(db, "trips"),
      where("memberIds", "array-contains", userId)
    );
  
    return onSnapshot(
      tripsQuery,
      (snapshot) => { console.log(
    "VIAGENS ENCONTRADAS NA CONSULTA:",
    snapshot.docs.length
  );
  
  console.log(
    "IDS DAS VIAGENS:",
    snapshot.docs.map((doc) => doc.id)
  );
        const trips: SavedTrip[] = snapshot.docs.map((tripDocument) => {
         const data = tripDocument.data() as TripDraft & {
    ownerId: string;
    invitationCode: string;
  };
  
          return {
            ...data,
            id: tripDocument.id,
            expenses: [],
            activities: [],
            invitation: {
              tripId: tripDocument.id,
              destination: data.destination || "Destino a definir",
              startDate:
                data.dateMode === "dates" ? data.startDate : "",
              endDate:
                data.dateMode === "dates" ? data.endDate : "",
              code: data.invitationCode,
            },
          };
        });
  
        onTripsChanged(trips);
      },
      (error) => {
        console.error("Erro ao buscar viagens:", error);
        onError?.(error);
      }
    );
  }
  export async function joinTripByInvitationCode(
    rawCode: string
  ): Promise<string> {
    const currentUser = auth.currentUser;
  
    if (!currentUser) {
      throw new Error("Você precisa estar autenticado para entrar em uma viagem.");
    }
  
    const code = normalizeInvitationCode(rawCode);
  
    if (!/^AXIS-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) {
      throw new Error("Digite um código de convite válido.");
    }
  
    const invitationRef = doc(db, "tripInvitations", code);
    const invitationSnapshot = await getDoc(invitationRef);
  
    if (!invitationSnapshot.exists()) {
      throw new Error("Convite não encontrado. Confira o código digitado.");
    }
  
    const invitationData = invitationSnapshot.data();
    const tripId = invitationData.tripId;
  
    if (typeof tripId !== "string" || !tripId) {
      throw new Error("Este convite não está associado a uma viagem válida.");
    }
  
    // Verifica se o usuário já participa dessa viagem.
    const userTripsQuery = query(
      collection(db, "trips"),
      where("memberIds", "array-contains", currentUser.uid)
    );
  
    const userTripsSnapshot = await getDocs(userTripsQuery);
  
    const alreadyMember = userTripsSnapshot.docs.some(
      (tripDocument) => tripDocument.id === tripId
    );
  
    if (alreadyMember) {
      throw new Error("Você já participa desta viagem.");
    }
  
    const tripRef = doc(db, "trips", tripId);
  
    await runTransaction(db, async (transaction) => {
      // Confere novamente se o convite ainda existe.
      const latestInvitation = await transaction.get(invitationRef);
  
      if (!latestInvitation.exists()) {
        throw new Error("Este convite não está mais disponível.");
      }
  
      if (latestInvitation.data().tripId !== tripId) {
        throw new Error("O convite não corresponde à viagem.");
      }
  
      // Adiciona somente o usuário autenticado.
     transaction.update(tripRef, {
    memberIds: arrayUnion(currentUser.uid),
    updatedAt: serverTimestamp(),
    lastJoinedWithCode: code,
  });
    });
  
    return tripId;
  }
  
  
  // Despesas persistidas na subcoleção de cada viagem.
  export function subscribeToTripExpenses(
    tripId: string,
    onChanged: (expenses: Expense[]) => void,
    onError?: (error: Error) => void
  ): () => void {
    if (!tripId) {
      onChanged([]);
      return () => {};
    }
    return onSnapshot(
      collection(db, "trips", tripId, "expenses"),
      (snapshot) => onChanged(snapshot.docs.map((item) => ({
        ...item.data(), id: item.id,
      })) as Expense[]),
      (error) => onError?.(error)
    );
  }
  
  export async function addExpenseToFirestore(
    tripId: string, expense: Expense
  ): Promise<void> {
    if (!auth.currentUser) throw new Error("Você precisa estar autenticado.");
    if (!tripId) throw new Error("Viagem não identificada.");
    const { id: _localId, ...data } = expense;
    await addDoc(collection(db, "trips", tripId, "expenses"), data);
  }
  
  export function subscribeToTrip(
    tripId: string,
    onChanged: (trip: SavedTrip | null) => void,
    onError?: (error: Error) => void
  ): () => void {
    if (!tripId) {
      onChanged(null);
      return () => {};
    }
    return onSnapshot(doc(db, "trips", tripId), (snapshot) => {
      if (!snapshot.exists()) {
        onChanged(null);
        return;
      }
      const data = snapshot.data() as TripDraft & { ownerId?: string; invitationCode?: string };
      onChanged({
        ...data, id: snapshot.id, expenses: [], activities: [],
        invitation: {
          tripId: snapshot.id,
          destination: data.destination || "Destino a definir",
          startDate: data.dateMode === "dates" ? data.startDate : "",
          endDate: data.dateMode === "dates" ? data.endDate : "",
          code: data.invitationCode || "",
        },
      });
    }, (error) => onError?.(error));
  }
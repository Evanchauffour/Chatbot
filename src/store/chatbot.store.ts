import { create } from "zustand";
import {
  ChatMessage,
  MessageType,
  OperationState,
  Vehicle,
  TimeSlot,
  AdditionalOperation,
  UserMessage,
} from "@/types/chatbot";
import dayjs from "dayjs";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface ChatbotStore {
  messages: ChatMessage[];
  userMessage: UserMessage[];
  operationState: OperationState;
  operationsList: AdditionalOperation[];
  setOperationsList: (ops: AdditionalOperation[]) => void;
  vehicles: Vehicle[];
  additionalOperation: AdditionalOperation[];
  timeSlots: TimeSlot[];
  selectedVehicle: Vehicle | null;
  operationSelected: AdditionalOperation[];
  additionalOperationSelected: AdditionalOperation[];
  isSearchDisabled: boolean;
  isVehicleLoading: boolean;
  isAdditionalOperationLoading: boolean;
  userAddress: string;
  userCoordinates: Coordinates | null;
  addMessage: (content: string, type: MessageType) => void;
  addUserMessage: (content: string) => void;
  clearMessages: () => void;
  setOperationStep: (step: OperationState["step"]) => void;
  selectVehicle: (vehicleId: string) => void;
  selectTimeSlot: (timeSlotId: string) => void;
  selectOperation: (operation: AdditionalOperation) => void;
  selectAdditionalOperation: (operation: AdditionalOperation) => void;
  fetchVehicles: () => Promise<void>;
  fetchAdditionalOperation: (
    vehicle: Vehicle,
    operation: string
  ) => Promise<void>;
  fetchTimeSlots: () => Promise<void>;
  disableSearch: () => void;
  setUserAddress: (address: string) => void;
  setUserCoordinates: (coordinates: Coordinates) => void;
  resetStore: () => void;
}

export const useChatbotStore = create<ChatbotStore>((set) => ({
  messages: [],
  userMessage: [],
  operationState: {
    step: "start",
  },
  userAddress: "",
  userCoordinates: null,
  operationsList: [],
  setOperationsList: (ops) => set({ operationsList: ops }),
  vehicles: [],
  additionalOperation: [],
  timeSlots: [],
  selectedVehicle: null,
  operationSelected: [],
  additionalOperationSelected: [],
  isSearchDisabled: false,
  isVehicleLoading: false,
  isAdditionalOperationLoading: false,
  addMessage: (content: string, type: MessageType) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: crypto.randomUUID(),
          content,
          type,
          timestamp: new Date(),
        },
      ],
    })),

  addUserMessage: (content: string) =>
    set((state) => ({
      userMessage: [
        ...state.userMessage,
        {
          id: crypto.randomUUID(),
          position: state.userMessage.length,
          content,
          timestamp: new Date(),
        },
      ],
    })),

  clearMessages: () => set({ messages: [] }),

  setOperationStep: (step) => {
    set((state) => ({
      operationState: {
        ...state.operationState,
        step,
      },
    }));
  },

  selectVehicle: (vehicleId) =>
    set((state) => ({
      vehicles: state.vehicles.map((vehicle) => ({
        ...vehicle,
        selected: vehicle.id === vehicleId,
      })),
      operationState: {
        ...state.operationState,
        selectedVehicle: state.vehicles.find((v) => v.id === vehicleId),
      },
      selectedVehicle: state.vehicles.find((v) => v.id === vehicleId),
    })),

  selectOperation: (operation) =>
    set((state) => ({
      operationSelected: state.operationSelected.some(op => op.id === operation.id)
        ? state.operationSelected.filter((o) => o.id !== operation.id)
        : [...state.operationSelected, operation],
    })),

  selectAdditionalOperation: (operation) =>
    set((state) => ({
      additionalOperationSelected: state.additionalOperationSelected.some(op => op.id === operation.id)
        ? state.additionalOperationSelected.filter((o) => o.id !== operation.id)
        : [...state.additionalOperationSelected, operation],
    })),

  selectTimeSlot: (timeSlotId) =>
    set((state) => ({
      operationState: {
        ...state.operationState,
        selectedTimeSlot: state.timeSlots.find((ts) => ts.id === timeSlotId),
      },
    })),

  fetchVehicles: async () => {
    set({ isVehicleLoading: true });
    try {
      const response = await fetch("http://localhost:8000/api/user/vehicles", {
        credentials: "include",
      });
      const data = await response.json();
      set({ vehicles: data });
    } catch (error) {
      console.error("Erreur lors de la récupération des véhicules:", error);
    } finally {
      set({ isVehicleLoading: false });
    }
  },

  fetchAdditionalOperation: async (
    vehicle: Vehicle,
    operation: string = "Vidange"
  ) => {
    try {
      set({ isAdditionalOperationLoading: true });
      const response = await fetch(`http://localhost:8000/api/suggest-addons`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/ld+json",
        },
        body: JSON.stringify({
          vehicule: {
            make: vehicle.brand,
            model: vehicle.model,
            year: Number(dayjs(vehicle.firstRegistrationDate).format("YYYY")),
            mileage: Number(vehicle.mileage),
          },
          operation: operation,
        }),
      });
      const data = await response.json();
      set({ additionalOperation: data.ai_suggestions });
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations du véhicule:",
        error
      );
    } finally {
      set({ isAdditionalOperationLoading: false });
    }
  },

  fetchTimeSlots: async () => {
    // TODO: Implement API call
    const mockTimeSlots: TimeSlot[] = [
      { id: "1", date: new Date("2024-03-20T09:00:00"), available: true },
      { id: "2", date: new Date("2024-03-20T10:00:00"), available: true },
      { id: "3", date: new Date("2024-03-20T11:00:00"), available: false },
    ];
    set({ timeSlots: mockTimeSlots });
  },
  setUserAddress: (address: string) => set({ userAddress: address }),
  setUserCoordinates: (coordinates: Coordinates) => set({ userCoordinates: coordinates }),
  disableSearch: () => set({ isSearchDisabled: true }),
  resetStore: () =>
    set({
      messages: [
        {
          id: crypto.randomUUID(),
          content:
            "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?",
          type: "general",
          timestamp: new Date(),
        },
      ],
      userMessage: [],
      operationState: {
        step: "vehicle_selection",
      },
      vehicles: [],
      additionalOperation: [],
      timeSlots: [],
      selectedVehicle: null,
      operationSelected: [],
      isSearchDisabled: false,
      userCoordinates: null,
    }),
}));

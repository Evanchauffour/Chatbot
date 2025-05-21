import { create } from 'zustand'
import { ChatMessage, MessageType, OperationState, Vehicle, TimeSlot, AdditionalOperation } from '@/types/chatbot'

interface ChatbotStore {
  messages: ChatMessage[]
  operationState: OperationState
  vehicles: Vehicle[]
  additionalOperation: AdditionalOperation[]
  timeSlots: TimeSlot[]
  addMessage: (content: string, type: MessageType) => void
  clearMessages: () => void
  setOperationStep: (step: OperationState['step']) => void
  selectVehicle: (vehicleId: string) => void
  selectTimeSlot: (timeSlotId: string) => void
  fetchVehicles: () => Promise<void>
  fetchAdditionalOperation: (vehicle: Vehicle, operation: string) => Promise<void>
  fetchTimeSlots: () => Promise<void>
}

export const useChatbotStore = create<ChatbotStore>((set) => ({
  messages: [],
  operationState: {
    step: 'vehicle_selection',
    selectedServices: [],
  },
  vehicles: [],
  additionalOperation: [],
  timeSlots: [],

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

  clearMessages: () => set({ messages: [] }),

  setOperationStep: (step) => 
    set((state) => ({
      operationState: {
        ...state.operationState,
        step,
      },
    })),

  selectVehicle: (vehicleId) => 
    set((state) => ({
      vehicles: state.vehicles.map(vehicle => ({
        ...vehicle,
        selected: vehicle.id === vehicleId
      })),
      operationState: {
        ...state.operationState,
        selectedVehicle: state.vehicles.find(v => v.id === vehicleId),
      },
    })),

  selectTimeSlot: (timeSlotId) =>
    set((state) => ({
      operationState: {
        ...state.operationState,
        selectedTimeSlot: state.timeSlots.find(ts => ts.id === timeSlotId),
      },
    })),

  fetchVehicles: async () => {
    try {
      const response = await fetch("http://localhost:8000/api/user/vehicles", {
        credentials: 'include',
      })
      const data = await response.json()
      set({ vehicles: data })
    } catch (error) {
      console.error("Erreur lors de la récupération des véhicules:", error)
    }
  },

  fetchAdditionalOperation: async (vehicle: Vehicle, operation: string = "Vidange") => {
    try {
      const response = await fetch(`http://localhost:8000/api/suggest-addons`, {
        credentials: 'include',
        method: "POST",
        headers: {
          'Content-Type': 'application/ld+json',
        },
        body: JSON.stringify({
          "vehicule": {
            "make": vehicle.brand,
            "model": vehicle.model,
            "year": Number(vehicle.firstRegistrationDate),
            "mileage": Number(vehicle.mileage)
          },
          "operation": operation
        }),
      })
      const data = await response.json()  
      set({ additionalOperation: data })
    } catch (error) {
      console.error("Erreur lors de la récupération des informations du véhicule:", error)
    }
  },

  fetchTimeSlots: async () => {
    // TODO: Implement API call
    const mockTimeSlots: TimeSlot[] = [
      { id: '1', date: new Date('2024-03-20T09:00:00'), available: true },
      { id: '2', date: new Date('2024-03-20T10:00:00'), available: true },
      { id: '3', date: new Date('2024-03-20T11:00:00'), available: false },
    ]
    set({ timeSlots: mockTimeSlots })
  },
})) 
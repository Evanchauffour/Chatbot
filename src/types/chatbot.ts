export type MessageType = 'general' | 'service'

export interface ChatMessage {
  id: string
  type: MessageType
  content: string
  timestamp: Date
}

export interface Vehicle {
  id: string
  name: string
  model: string
  year: number
  selected?: boolean
  firstRegistrationDate: Date
  mileage: number,
  brand: string
}

export interface TimeSlot {
  id: string
  date: Date
  available: boolean
}

export type OperationStep = 'vehicle_selection' | 'additional_operation_selection' | 'appointment_scheduling'

export interface OperationState {
  step: OperationStep
  selectedVehicle?: Vehicle
  selectedTimeSlot?: TimeSlot
} 

export interface AdditionalOperation {
  id: string
  name: string
  description: string
}

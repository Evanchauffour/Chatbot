// types/chatbot.ts
export type MessageType = "general" | "service";

export interface ChatMessage {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
}

export interface UserMessage {
  id: string;
  position: number;
  content: string;
  timestamp: Date;
}

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  year: number;
  selected?: boolean;
  firstRegistrationDate: Date;
  mileage: number;
  brand: string;
}

export interface TimeSlot {
  id: string;
  date: Date;
  available: boolean;
}

export type OperationStep =
  | "start"
  | "operations_selection"
  | "vehicle_selection"
  | "additional_add_vehicle"
  | "additional_operation_selection"
  | "address_validation"
  | "appointment_scheduling";

export interface OperationState {
  step: OperationStep;
  selectedVehicle?: Vehicle;
  selectedTimeSlot?: TimeSlot;
}

export interface AdditionalOperation {
  id: string;
  name: string;
  description: string;
  operation: string;
  category: string;
  additionnal_help?: string;
  additionnal_comment?: string | null;
  time_unit: string;
  price: string;
  reason: string;
}

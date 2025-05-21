import { Card } from "@/components/ui/card"
import { Wrench, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useChatbotStore } from '@/store/chatbot.store'
import { useEffect } from 'react'
import { MessageCard } from "./MessageCard"
import dayjs from "dayjs"

interface OperationMessageCardProps {
  message: string
}

export function OperationMessageCard({ message }: OperationMessageCardProps) {
  
  const { 
    operationState, 
    vehicles, 
    timeSlots,
    fetchVehicles, 
    fetchTimeSlots,
    selectVehicle,
    setOperationStep,
    selectTimeSlot,
    fetchAdditionalOperation
  } = useChatbotStore()

  useEffect(() => {
    if (operationState.step === 'vehicle_selection') {
      fetchVehicles()
    } else if (operationState.step === 'appointment_scheduling') {
      fetchTimeSlots()
    } else if (operationState.step === 'additional_operation_selection') {
      fetchAdditionalOperation(vehicles[0], "Vidange")
    }
  }, [operationState.step])

  const steps = [
    {
      id: 'vehicle_selection',
      render: () => (
        <div className="space-y-4 w-full">
          <div className="flex justify-between items-center w-full">
            <h3 className="font-medium">Sélectionnez votre véhicule</h3>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un véhicule
            </Button>
          </div>
          <div className="space-y-2">
            {vehicles.map((vehicle) => (
              <Card 
                key={vehicle.id}
                className={`p-4 cursor-pointer transition-colors ${
                  vehicle.selected ? 'border-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => {
                  selectVehicle(vehicle.id)
                  setOperationStep('additional_operation_selection')
                }}
              >
                <div className="flex items-center gap-2">
                  <Checkbox checked={vehicle.selected} />
                  <div>
                    <p className="font-medium">{vehicle.brand} {vehicle.model}</p>
                    <p className="text-sm text-gray-500">
                      {dayjs(vehicle.firstRegistrationDate).format('DD/MM/YYYY')} - {vehicle.mileage} km
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'additional_operation_selection',
      render: () => (
        <div className="space-y-4">
          <h3 className="font-medium">Sélectionnez les services supplémentaires</h3>
        </div>
      )
    },
    {
      id: 'appointment_scheduling',
      render: () => (
        <div className="space-y-4">
          <h3 className="font-medium">Choisissez un créneau</h3>
          <div className="space-y-2">
            {timeSlots.map((slot) => (
              <Card 
                key={slot.id}
                className={`p-4 cursor-pointer ${
                  !slot.available ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => slot.available && selectTimeSlot(slot.id)}
              >
                <div className="flex items-center justify-between">
                  <p>{new Date(slot.date).toLocaleString()}</p>
                  {!slot.available && <span className="text-sm text-red-500">Indisponible</span>}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )
    }
  ]

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === operationState.step)
  }

  return (
    <div className="space-y-4">
      <MessageCard message={message} />
      {steps.slice(0, getCurrentStepIndex() + 1).map((step) => (
        <Card key={step.id} className="p-4 max-w-[80%] bg-blue-50 border-blue-200">
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <Wrench className="h-4 w-4 text-blue-500 mt-1" />
              {step.render()}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
} 
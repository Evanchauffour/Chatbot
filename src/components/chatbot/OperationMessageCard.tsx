/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import { MessageCard } from "./MessageCard";
import VehicleSelectionStep from "./steps/VehicleSelectionStep";
import AddVehicleForm from "./steps/AddVehicleForm";
import { createVehicle } from "@/actions/vehicle";
import { useChatbotStore } from "@/store/chatbot.store";
import type { AdditionalOperation, OperationStep } from "@/types/chatbot";
import { Checkbox } from "../ui/checkbox";
import OperationsSelection from "./steps/OperationsSelection";
import ModalReasonSuggest from "./modal/ModalReasonSuggest";
import { FaInfoCircle } from "react-icons/fa";
import { HelpCircle } from "lucide-react";

interface OperationMessageCardProps {
  message: string;
  operationsList: AdditionalOperation[];
}

export function OperationMessageCard({
  message,
  operationsList,
}: OperationMessageCardProps) {
  const {
    operationState,
    vehicles,
    timeSlots,
    fetchVehicles,
    fetchTimeSlots,
    selectVehicle: storeSelectVehicle,
    setOperationStep,
    selectTimeSlot,
    fetchAdditionalOperation,
    additionalOperation,
    selectOperation,
    operationSelected,
  } = useChatbotStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentReason, setCurrentReason] = useState<string>("");

  useEffect(() => {
    switch (operationState.step) {
      case "vehicle_selection":
        fetchVehicles();
        break;
      case "appointment_scheduling":
        fetchTimeSlots();
        break;
      case "additional_operation_selection":
        if (vehicles.length > 0) {
          fetchAdditionalOperation(vehicles[0], "Vidange");
        }
        break;
    }
  }, [
    operationState.step,
    fetchVehicles,
    fetchTimeSlots,
    fetchAdditionalOperation,
  ]);

  const OPTIONAL_STEP: OperationStep = "additional_add_vehicle";

  const allSteps = [
    {
      id: "operations_selection" as OperationStep,
      render: () => (
        <OperationsSelection
          operations={operationsList}
          selectedOperationId={operationSelected[0]?.id ?? null}
          onSelect={(op) => {
            // si on est encore à operations_selection, on toggle et reste
            if (operationState.step === "operations_selection") {
              selectOperation(op);
            }
          }}
          onNext={() => setOperationStep("vehicle_selection")}
          readOnly={operationState.step !== "operations_selection"} // <— lecture seule après
        />
      ),
    },
    {
      id: "vehicle_selection" as OperationStep,
      render: () => (
        <VehicleSelectionStep
          vehicles={vehicles}
          selectVehicle={(id) => {
            storeSelectVehicle(id);
            setOperationStep("additional_operation_selection");
          }}
          onAddVehicle={() => setOperationStep(OPTIONAL_STEP)}
        />
      ),
    },
    {
      id: OPTIONAL_STEP as OperationStep,
      render: () => (
        <AddVehicleForm
          onSubmit={async (data) => {
            const created = await createVehicle(data);
            await fetchVehicles();
            setOperationStep("vehicle_selection");
            storeSelectVehicle(created.id);
          }}
          onCancel={() => setOperationStep("vehicle_selection")}
        />
      ),
    },
    {
      id: "additional_operation_selection" as OperationStep,
      render: () => (
        <div className="space-y-4 w-full">
          <h3 className="font-medium">
            Sélectionnez les services supplémentaires
          </h3>
          <div className="grid grid-cols-3 gap-4 w-full">
            {additionalOperation.map((operation) => (
              <Card
                key={operation.operation}
                className={`p-4 cursor-pointer transition-colors ${
                  operationSelected.includes(operation)
                    ? "border-blue-500 bg-blue-50"
                    : ""
                }`}
                onClick={() => {
                  selectOperation(operation);
                  setOperationStep("additional_operation_selection");
                }}
              >
                <div className="flex items-center gap-4">
                  <Checkbox checked={operationSelected.includes(operation)} />
                  <div className="flex flex-col">
                    <p className="font-medium">{operation.operation}</p>
                    <p className="text-sm text-gray-500">{operation.price} €</p>
                  </div>

                  {/* Picto tout à droite */}
                  <div className="ml-auto">
                    <button
                      className="text-blue-600 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentReason(
                          operation.reason || "Pas de raison fournie"
                        );
                        setModalOpen(true);
                      }}
                    >
                      <FaInfoCircle size={20} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "appointment_scheduling" as OperationStep,
      render: () => (
        <div className="space-y-4">
          <h3 className="font-medium">Choisissez un créneau</h3>
          <div className="space-y-2">
            {timeSlots.map((slot) => (
              <Card
                key={slot.id}
                className={`p-4 cursor-pointer ${
                  !slot.available ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => slot.available && selectTimeSlot(slot.id)}
              >
                <div className="flex items-center justify-between">
                  <p>{new Date(slot.date).toLocaleString()}</p>
                  {!slot.available && (
                    <span className="text-sm text-red-500">Indisponible</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
  ];

  const stepsToRender =
    operationState.step === OPTIONAL_STEP
      ? allSteps.filter(
          (s) => s.id === "vehicle_selection" || s.id === OPTIONAL_STEP
        )
      : allSteps.filter((s) => s.id !== OPTIONAL_STEP);

  const currentIndex = stepsToRender.findIndex(
    (s) => s.id === operationState.step
  );

  return (
    <div className="space-y-4">
      <MessageCard message={message} />
      {stepsToRender.slice(0, currentIndex + 1).map((step) => (
        <Card key={step.id} className="p-4 w-full bg-blue-50 border-blue-200">
          <div className="flex items-start gap-2">
            <Wrench className="h-4 w-4 text-blue-500 mt-1" />
            {step.render()}
          </div>
        </Card>
      ))}
      <ModalReasonSuggest
        isOpen={modalOpen}
        reason={currentReason}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Wrench } from "lucide-react";
import { MessageCard } from "./MessageCard";
import VehicleSelectionStep from "./steps/VehicleSelectionStep";
import AddVehicleForm from "./steps/AddVehicleForm";
import { createVehicle } from "@/actions/vehicle";
import { useChatbotStore } from "@/store/chatbot.store";
import type { OperationStep } from "@/types/chatbot";
import { Checkbox } from "../ui/checkbox";
import AppointmentStep from "./steps/AppointmentStep";
import { Button } from "../ui/button";
import OperationsSelection from "./steps/OperationsSelection";
import ModalReasonSuggest from "./modal/ModalReasonSuggest";
import { FaInfoCircle } from "react-icons/fa";
import { Skeleton } from "../ui/skeleton";
import AddressValidation from "./steps/AddressValidation";

interface OperationMessageCardProps {
  message: string;
}

export function OperationMessageCard({
  message,
}: OperationMessageCardProps) {
  const {
    operationState,
    vehicles,
    fetchVehicles,
    fetchTimeSlots,
    selectVehicle: storeSelectVehicle,
    setOperationStep,
    fetchAdditionalOperation,
    operationsList,
    additionalOperation,
    selectAdditionalOperation,
    additionalOperationSelected,
    isAdditionalOperationLoading,
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
      case "operations_selection":
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
      render: () => {
        return (
          <OperationsSelection
            operations={operationsList}
            readOnly={operationState.step !== "operations_selection"}
          />
        );
      },
    },
    {
      id: "vehicle_selection" as OperationStep,
      render: () => (
        <VehicleSelectionStep
          vehicles={vehicles}
          selectVehicle={(id) => {
            storeSelectVehicle(id);
            setOperationStep("additional_operation_selection");
            setTimeout(() => {
              const container = document.querySelector('.chat-container');
              if (container) {
                container.scrollTo({
                  top: container.scrollHeight,
                  behavior: 'smooth'
                });
              }
            }, 100);
          }}
          onAddVehicle={() => {
            setOperationStep(OPTIONAL_STEP)
            setTimeout(() => {
              const container = document.querySelector('.chat-container');
              if (container) {
                container.scrollTo({
                  top: container.scrollHeight,
                  behavior: 'smooth'
                });
              }
            }, 100);
          }}
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
          onCancel={() => {
            setOperationStep("vehicle_selection")
            setTimeout(() => {
              const container = document.querySelector('.chat-container');
              if (container) {
                container.scrollTo({
                  top: container.scrollHeight,
                  behavior: 'smooth'
                });
              }
            }, 100);
          }}
        />
      ),
    },
    {
      id: "additional_operation_selection" as OperationStep,
      render: () => (
        <div className="w-full flex flex-col gap-2 md:gap-4">
          <h3 className="font-medium text-base md:text-lg">
            Sélectionnez les services supplémentaires
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 w-full">
            {isAdditionalOperationLoading ? (
              Array(3).fill(0).map((_, index) => (
                <Skeleton key={index} className="h-20 md:h-24 w-full" />
              ))
            ) : (
              additionalOperation.map((operation) => (
                <Card
                  key={operation.operation}
                  className={`p-2 md:p-4 cursor-pointer transition-colors ${
                    additionalOperationSelected.includes(operation)
                      ? "border-blue-500 bg-blue-50"
                      : ""
                  }`}
                  onClick={() => {
                    selectAdditionalOperation(operation);
                    setOperationStep("additional_operation_selection");
                  }}
                >
                  <div className="flex items-center gap-2 md:gap-4">
                    <Checkbox checked={additionalOperationSelected.includes(operation)} />
                    <div className="flex flex-col">
                      <p className="font-medium text-sm md:text-base">{operation.operation}</p>
                      <p className="text-xs md:text-sm text-gray-500">{operation.price} €</p>
                    </div>

                    <div className="ml-auto">
                      <button
                        className="text-blue-500 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentReason(
                            operation.reason || "Pas de raison fournie"
                          );
                          setModalOpen(true);
                        }}
                      >
                        <FaInfoCircle size={18} className="md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
          <Button
            onClick={() => {
              setOperationStep("address_validation")
              setTimeout(() => {
                const container = document.querySelector('.chat-container');
                if (container) {
                  container.scrollTo({
                    top: container.scrollHeight,
                    behavior: 'smooth'
                  });
                }
              }, 100);
            }}
            className="w-full md:w-fit ml-auto mt-2 md:mt-0"
          >
            <MapPin className="h-4 w-4 mr-2" />
            <p>Choisir un garage</p>
          </Button>
        </div>
      ),
    },
    {
      id: "address_validation" as OperationStep,
      render: () => <AddressValidation />,
    },
    {
      id: "appointment_scheduling" as OperationStep,
      render: () => <AppointmentStep />,
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
    <div className="space-y-2 md:space-y-4">
      <MessageCard message={message} />
      {stepsToRender.slice(0, currentIndex + 1).map((step) => (
        <Card key={step.id} className="p-2 md:p-4 w-full bg-blue-50 border-blue-200">
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

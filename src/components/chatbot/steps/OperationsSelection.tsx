import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { AdditionalOperation } from "@/types/chatbot";
import { useChatbotStore } from "@/store/chatbot.store";
import { useEffect } from "react";
// OperationsSelection.tsx
interface OperationsSelectionProps {
  operations: AdditionalOperation[];
  readOnly?: boolean;
}

export default function OperationsSelection({
  operations,
  readOnly = false,
}: OperationsSelectionProps) {
  const { selectOperation, operationSelected, setOperationStep } = useChatbotStore();
  const handleOperationToggle = (operation: AdditionalOperation) => {
    if (readOnly) return;
    selectOperation(operation);
  };

  useEffect(() => {
    const container = document.querySelector('.chat-container');
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);
  

  const handleNext = () => {
    setOperationStep("vehicle_selection");
    setTimeout(() => {
      const container = document.querySelector('.chat-container');
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sélectionner des opérations</CardTitle>
        <CardDescription className="text-sm md:text-base">
          Choisissez les services que vous souhaitez réaliser.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 md:space-y-3">
          {operations.map((op) => {
            const checkboxId = `op-${op.id}`;
            const isSelected = operationSelected.some(selected => selected.id === op.id);
            
            return (
              <div
                key={op.id}
                className={`flex items-center justify-between p-2 md:p-3 border rounded-lg 
                    ${readOnly ? "" : "cursor-pointer hover:bg-gray-50"} 
                    ${isSelected ? "border-blue-500 bg-blue-50" : ""}`}
                onClick={() => handleOperationToggle(op)}
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <Checkbox
                    id={checkboxId}
                    checked={isSelected}
                    disabled={readOnly}
                    onCheckedChange={() => handleOperationToggle(op)}
                  />
                  <label
                    htmlFor={checkboxId}
                    className={`cursor-pointer ${readOnly ? "cursor-default" : ""}`}
                  >
                    <p className="font-medium text-sm md:text-base">{op.operation}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">{op.name}</p>
                  </label>
                </div>
                <p className="text-xs md:text-sm font-semibold">{op.price} €</p>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end p-4 md:p-6">
        <Button 
          onClick={handleNext}
          disabled={readOnly || operationSelected.length === 0}
          className="w-full md:w-auto"
        >
          Suivant
        </Button>
      </CardFooter>
    </Card>
  );
}

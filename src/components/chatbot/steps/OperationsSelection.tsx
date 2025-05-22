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

  const handleNext = () => {
    setOperationStep("vehicle_selection");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sélectionner des opérations</CardTitle>
        <CardDescription>
          Choisissez les services que vous souhaitez réaliser.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {operations.map((op) => {
            const checkboxId = `op-${op.id}`;
            const isSelected = operationSelected.some(selected => selected.id === op.id);
            
            return (
              <div
                key={op.id}
                className={`flex items-center justify-between p-3 border rounded-lg 
                    ${readOnly ? "" : "cursor-pointer hover:bg-gray-50"} 
                    ${isSelected ? "border-blue-500 bg-blue-50" : ""}`}
                onClick={() => handleOperationToggle(op)}
              >
                <div className="flex items-center gap-3">
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
                    <p className="font-medium">{op.operation}</p>
                    <p className="text-sm text-muted-foreground">{op.name}</p>
                  </label>
                </div>
                <p className="text-sm font-semibold">{op.price} €</p>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleNext}
          disabled={readOnly || operationSelected.length === 0}
        >
          Suivant
        </Button>
      </CardFooter>
    </Card>
  );
}

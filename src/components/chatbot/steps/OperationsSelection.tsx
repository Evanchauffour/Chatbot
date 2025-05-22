import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { AdditionalOperation } from "@/types/chatbot";

// OperationsSelection.tsx
interface OperationsSelectionProps {
  operations: AdditionalOperation[];
  selectedOperationId: string | null;
  onSelect?: (operation: AdditionalOperation) => void;
  onNext?: () => void;
  readOnly?: boolean; // <— nouveau
}

export default function OperationsSelection({
  operations,
  selectedOperationId,
  onSelect = () => {},
  onNext = () => {},
  readOnly = false,
}: OperationsSelectionProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sélectionner une opération</CardTitle>
        <CardDescription>
          Choisissez le service que vous souhaitez réaliser.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedOperationId ?? undefined}
          onValueChange={
            readOnly
              ? undefined
              : (value) => {
                  const op = operations.find((o) => o.id === value);
                  if (op) onSelect(op);
                }
          }
          className="space-y-3"
        >
          {operations.map((op) => {
            const radioId = `op-${op.id}`;
            return (
              <div
                key={op.id}
                className={`flex items-center justify-between p-3 border rounded-lg 
                    ${readOnly ? "" : "cursor-pointer hover:bg-gray-50"} 
                    ${
                      selectedOperationId === op.id
                        ? "border-blue-500 bg-blue-50"
                        : ""
                    }`}
                onClick={!readOnly ? () => onSelect(op) : undefined}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    value={op.id}
                    id={radioId}
                    disabled={readOnly}
                  />
                  <label
                    htmlFor={radioId}
                    className={`cursor-pointer ${
                      readOnly ? "cursor-default" : ""
                    }`}
                  >
                    <p className="font-medium">{op.operation}</p>
                    <p className="text-sm text-muted-foreground">{op.name}</p>
                  </label>
                </div>
                <p className="text-sm font-semibold">{op.price} €</p>
              </div>
            );
          })}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onNext} disabled={readOnly || !selectedOperationId}>
          Suivant
        </Button>
      </CardFooter>
    </Card>
  );
}

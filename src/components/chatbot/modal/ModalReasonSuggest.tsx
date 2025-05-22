import * as Dialog from "@radix-ui/react-dialog";

type ModalReasonSuggestProps = {
  isOpen: boolean;
  onClose: () => void;
  reason: string;
};

export default function ModalReasonSuggest({
  isOpen,
  onClose,
  reason,
}: ModalReasonSuggestProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg space-y-4">
          <h2 className="text-lg font-semibold">
            Pourquoi cette suggestion&nbsp;?
          </h2>
          <p className="text-sm text-gray-700">{reason}</p>

          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 rounded-md bg-blue-600 text-white"
          >
            Fermer
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

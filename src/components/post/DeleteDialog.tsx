import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  onOpenChange,
  onDelete,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Supprimer cette note vocale ?
          </DialogTitle>
          <DialogDescription className="text-center">
            Cette action est irréversible. La note vocale sera définitivement
            supprimée.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-4 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Supprimer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;

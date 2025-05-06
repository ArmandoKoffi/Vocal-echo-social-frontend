import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface DeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  onOpenChange,
  onDelete,
  isDeleting
}) => {
  const handleDelete = async () => {
    await onDelete();
  };

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
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suppression...
              </>
            ) : (
              "Supprimer"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;

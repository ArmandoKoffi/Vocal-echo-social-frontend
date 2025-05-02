import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ReportForm from "../ReportForm";

interface ReportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
}

const ReportDialog: React.FC<ReportDialogProps> = ({
  isOpen,
  onOpenChange,
  postId,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Signaler ce contenu</DialogTitle>
          <DialogDescription>
            Veuillez indiquer la raison pour laquelle vous souhaitez signaler
            cette publication.
          </DialogDescription>
        </DialogHeader>

        <ReportForm postId={postId} />
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;

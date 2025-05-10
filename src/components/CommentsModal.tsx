import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Comment } from "@/types/Comment";
import CommentList from "./post/CommentList";

interface CommentsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  comments: Comment[];
}

const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  onOpenChange,
  comments,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tous les commentaires</DialogTitle>
        </DialogHeader>
        <CommentList comments={comments} />
      </DialogContent>
    </Dialog>
  );
};

export default CommentsModal;


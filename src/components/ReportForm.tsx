
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { createReport } from "@/api/reportsApi";

interface ReportFormProps {
  postId: string;
  onSuccess?: () => void;
}

const reportReasons = [
  { id: "Contenu inapproprié", label: "Contenu inapproprié" },
  { id: "Harcèlement", label: "Harcèlement" },
  { id: "Spam", label: "Spam" },
  { id: "Discours haineux", label: "Discours haineux" },
  { id: "Autre", label: "Autre raison" },
];

const ReportForm: React.FC<ReportFormProps> = ({ postId, onSuccess }) => {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner une raison pour le signalement.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createReport({
        postId,
        reason,
        details: details || undefined,
      });

      toast({
        title: "Signalement envoyé",
        description:
          "Merci d'avoir signalé ce contenu. Notre équipe va l'examiner rapidement.",
      });

      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du signalement.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-2">
        <RadioGroup value={reason} onValueChange={setReason}>
          <div className="space-y-2">
            {reportReasons.map((reportReason) => (
              <div
                key={reportReason.id}
                className="flex items-center space-x-2"
              >
                <RadioGroupItem value={reportReason.id} id={reportReason.id} />
                <Label htmlFor={reportReason.id}>{reportReason.label}</Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        <div className="space-y-2">
          <Label htmlFor="details">Détails (optionnel)</Label>
          <Textarea
            id="details"
            placeholder="Fournissez plus de détails sur le problème..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
      </div>

      <DialogFooter className="mt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Envoi en cours..." : "Envoyer le signalement"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ReportForm;

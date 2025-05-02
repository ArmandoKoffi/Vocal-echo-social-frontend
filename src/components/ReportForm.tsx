import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ReportFormProps {
  postId: string;
}

const reportReasons = [
  { id: "inappropriate", label: "Contenu inapproprié" },
  { id: "harassment", label: "Harcèlement" },
  { id: "violence", label: "Incitation à la violence" },
  { id: "hate", label: "Discours haineux" },
  { id: "spam", label: "Spam" },
  { id: "other", label: "Autre raison" },
];

const ReportForm: React.FC<ReportFormProps> = ({ postId }) => {
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

    // Simulate an API call
    setTimeout(() => {
      toast({
        title: "Signalement envoyé",
        description:
          "Merci d'avoir signalé ce contenu. Notre équipe va l'examiner rapidement.",
      });

      setIsSubmitting(false);

      // Close the dialog (in a real application, you would use a more elegant approach)
      document.body.click(); // This simulates clicking outside the dialog to close it
    }, 1000);
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

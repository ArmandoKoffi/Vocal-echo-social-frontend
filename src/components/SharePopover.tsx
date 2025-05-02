import React from "react";
import {
  Copy,
  Facebook,
  Link2,
  Mail,
  MessageCircle,
  Send,
  Share,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

interface SharePopoverProps {
  postId: string;
}

const SharePopover: React.FC<SharePopoverProps> = ({ postId }) => {
  const { toast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
    toast({
      title: "Lien copié",
      description: "Le lien a été copié dans votre presse-papiers",
    });
  };

  const handleShare = (platform: string) => {
    const url = `${window.location.origin}/post/${postId}`;
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(
          "Écoutez cette note vocale sur Voicify!"
        )}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          `Écoutez cette note vocale sur Voicify: ${url}`
        )}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(
          "Écoutez cette note vocale sur Voicify!"
        )}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(
          "Note vocale partagée depuis Voicify"
        )}&body=${encodeURIComponent(
          `Écoutez cette note vocale sur Voicify: ${url}`
        )}`;
        break;
      default:
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-gray-600 hover:text-voicify-blue transition-colors"
        >
          <Share size={18} />
          <span>Partager</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="center">
        <div className="p-3 border-b">
          <h4 className="font-medium text-center">
            Partager cette note vocale
          </h4>
        </div>

        <div className="grid grid-cols-4 gap-4 p-4">
          <button
            className="flex flex-col items-center justify-center gap-1 text-blue-600 hover:opacity-80 transition-opacity"
            onClick={() => handleShare("facebook")}
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Facebook size={18} />
            </div>
            <span className="text-xs text-gray-700">Facebook</span>
          </button>

          <button
            className="flex flex-col items-center justify-center gap-1 text-blue-400 hover:opacity-80 transition-opacity"
            onClick={() => handleShare("twitter")}
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Twitter size={18} />
            </div>
            <span className="text-xs text-gray-700">Twitter</span>
          </button>

          <button
            className="flex flex-col items-center justify-center gap-1 text-green-600 hover:opacity-80 transition-opacity"
            onClick={() => handleShare("whatsapp")}
          >
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <MessageCircle size={18} />
            </div>
            <span className="text-xs text-gray-700">WhatsApp</span>
          </button>

          <button
            className="flex flex-col items-center justify-center gap-1 text-sky-600 hover:opacity-80 transition-opacity"
            onClick={() => handleShare("telegram")}
          >
            <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center">
              <Send size={18} />
            </div>
            <span className="text-xs text-gray-700">Telegram</span>
          </button>
        </div>

        <div className="p-3 flex flex-col gap-2">
          <button
            className="flex items-center gap-2 p-2 w-full rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => handleShare("email")}
          >
            <Mail size={16} />
            <span className="text-sm">Envoyer par email</span>
          </button>

          <button
            className="flex items-center gap-2 p-2 w-full rounded-md hover:bg-gray-100 transition-colors"
            onClick={handleCopyLink}
          >
            <Link2 size={16} />
            <span className="text-sm">Copier le lien</span>
          </button>
        </div>

        <div className="p-3 pt-0">
          <div className="flex items-center gap-2 py-2 px-3 bg-gray-100 rounded-md">
            <input
              type="text"
              value={`${window.location.origin}/post/${postId}`}
              readOnly
              placeholder="Lien du post"
              className="flex-1 bg-transparent border-none text-xs focus:outline-none p-0"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleCopyLink}
            >
              <Copy size={12} />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SharePopover;

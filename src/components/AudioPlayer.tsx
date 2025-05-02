/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import PlayPauseButton from "./audio/PlayPauseButton";
import ProgressBar from "./audio/ProgressBar";
import VolumeControl from "./audio/VolumeControl";
import WaveformVisualizer from "./audio/WaveformVisualizer";

interface AudioPlayerProps {
  audioUrl: string;
  size?: "small" | "medium" | "large";
  showEqualizer?: boolean;
  mini?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  size = "medium",
  showEqualizer = false,
  mini = false,
}) => {
  const actualSize = mini ? "small" : size;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const waveformBars = 32;

  const handlePlayPause = async () => {
    if (!audioRef.current) return;

    setError(null);

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        return;
      }

      setIsLoading(true);

      // Vérifier si l'URL est déjà absolue
      let fixedAudioUrl;
      if (audioUrl.startsWith("http")) {
        fixedAudioUrl = audioUrl;
      } else if (audioUrl.startsWith("/")) {
        // S'assurer que nous avons l'URL du serveur backend
        // Si vous utilisez un serveur backend différent, modifiez cette URL
        const backendUrl = "https://vocal-echo-social-backend.onrender.com"; // À adapter selon votre configuration
        fixedAudioUrl = `${backendUrl}${audioUrl}?t=${Date.now()}`;
      } else {
        // Fallback au cas où
        fixedAudioUrl = `${window.location.origin}/${audioUrl}?t=${Date.now()}`;
      }

      console.log("Tentative de chargement audio avec URL:", fixedAudioUrl);

      // Création d'un nouvel élément audio
      const newAudio = new Audio(fixedAudioUrl);
      newAudio.preload = "auto";
      newAudio.volume = isMuted ? 0 : volume;

      // Remplacement de l'ancien élément
      if (audioRef.current) {
        // Sauvegarde des événements existants
        const events = {
          timeupdate: audioRef.current.ontimeupdate,
          loadedmetadata: audioRef.current.onloadedmetadata,
          ended: audioRef.current.onended,
          error: audioRef.current.onerror
        };

        audioRef.current.replaceWith(newAudio);
        audioRef.current = newAudio;

        // Réattachement des événements
        newAudio.ontimeupdate = events.timeupdate;
        newAudio.onloadedmetadata = events.loadedmetadata;
        newAudio.onended = events.ended;
        newAudio.onerror = (e) => {
          console.error("Erreur audio:", e);
          setError("Impossible de lire le fichier audio. Vérifiez le chemin du fichier.");
          setIsLoading(false);
          if (events.error) events.error(e);
        };
      }

      // Lecture
      await newAudio.play();
      setIsPlaying(true);
      setIsLoading(false);

    } catch (err) {
      console.error("Erreur:", err);
      setError(`Erreur: ${err instanceof Error ? err.message : "Problème de lecture"}`);
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  // Autres fonctions restent inchangées...
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(audio.duration);
  };

  const handleProgressChange = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = (value / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeToggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
    } else {
      audio.volume = 0;
    }
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = value[0] / 100;
    setVolume(newVolume);
    audio.volume = newVolume;

    if (newVolume=== 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);

    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const visualizeAudio = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateWaveform = () => {
      if (!isPlaying || !analyserRef.current) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        return;
      }

      analyserRef.current.getByteFrequencyData(dataArray);

      const sampleStep = Math.floor(bufferLength / waveformBars);
      const newWaveformData = Array.from({ length: waveformBars }, (_, i) => {
        const index = i * sampleStep;
        return 10 + (dataArray[index] / 255) * 90;
      });

      setWaveformData(newWaveformData);
      animationFrameRef.current = requestAnimationFrame(updateWaveform);
    };

    updateWaveform();
  };

  const generateStaticWaveform = () => {
    const staticData = Array.from(
      { length: waveformBars },
      () => Math.random() * 40 + 10
    );
    setWaveformData(staticData);
  };

  useEffect(() => {
    console.log("Audio URL:", audioUrl);
    generateStaticWaveform();

    // Initialiser l'AudioContext uniquement lorsque l'utilisateur interagit avec la page
    const initAudioContext = () => {
      if (!audioContextRef.current) {
        try {
          audioContextRef.current = new (window.AudioContext ||
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).webkitAudioContext)();
        } catch (error) {
          console.error("Web Audio API not supported", error);
        }
      }
    };

    // Écouter les événements de clic pour débloquer l'AudioContext
    document.addEventListener("click", initAudioContext, { once: true });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }

      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
      }

      document.removeEventListener("click", initAudioContext);
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      visualizeAudio();
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, [isPlaying]);

  const progressValue = duration ? (currentTime / duration) * 100 : 0;

  const getSizeClasses = () => {
    switch (actualSize) {
      case "small":
        return {
          container: "p-2",
          playButton: "h-8 w-8",
          iconSize: 16,
          showTime: false,
          progressHeight: "h-1",
          waveformHeight: "h-8",
        };
      case "large":
        return {
          container: "p-4",
          playButton: "h-12 w-12",
          iconSize: 24,
          showTime: true,
          progressHeight: "h-2.5",
          waveformHeight: "h-16",
        };
      default:
        return {
          container: "p-3",
          playButton: "h-10 w-10", iconSize: 20,
          showTime: true,
          progressHeight: "h-2",
          waveformHeight: "h-12",
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div
      className={`flex flex-col gap-2 rounded-lg bg-gray-50 dark:bg-gray-800 ${sizeClasses.container}`}
    >
      <audio
        ref={audioRef}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={(e) => {
          console.error("Erreur de lecture audio:", e);
          setError(
            "Impossible de charger l'audio. Vérifiez le format du fichier ou l'URL."
          );
        }}
      />

      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

      <div className="flex items-center gap-2">
        <PlayPauseButton
          isPlaying={isPlaying}
          onClick={handlePlayPause}
          size={sizeClasses.playButton}
          iconSize={sizeClasses.iconSize}
          isLoading={isLoading}
        />

        <div className="flex-grow">
          {showEqualizer && (
            <WaveformVisualizer
              waveformData={waveformData}
              height={sizeClasses.waveformHeight}
            />
          )}

          <ProgressBar
            value={progressValue}
            onChange={handleProgressChange}
            height={sizeClasses.progressHeight}
            showTime={sizeClasses.showTime}
            currentTime={currentTime}
            duration={duration}
            onProgressChange={function (percent: number): void {
              throw new Error("Function not implemented.");
            }}
            progressHeight={""}
            onClick={function (e: React.MouseEvent<HTMLDivElement>): void {
              throw new Error("Function not implemented.");
            }}
          />
        </div>

        <VolumeControl
          isMuted={isMuted}
          volume={volume}
          onToggleMute={handleVolumeToggle}
          onVolumeChange={handleVolumeChange}
          onVolumeToggle={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;

'use client';

import { FiVolume2, FiVolumeX } from 'react-icons/fi';
import { Button } from "@/components/ui/button";
import { useSound } from '@/lib/sound-context';

export default function MuteButton() {
  const { isMuted, toggleMute } = useSound();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleMute}
      className="fixed top-4 left-4 z-50 bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-200 rounded-full shadow-sm border border-white/10 hover:scale-105 hover:shadow-md"
      aria-label={isMuted ? 'Unmute' : 'Mute'}
    >
      {isMuted ? (
        <FiVolumeX className="h-5 w-5 text-white" />
      ) : (
        <FiVolume2 className="h-5 w-5 text-white" />
      )}
    </Button>
  );
}
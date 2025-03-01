import { Button } from '../ui/button';
import { FiShare2, FiCopy } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useAtom } from 'jotai';
import { usernameAtom } from '@/lib/username_atom';
import { getGameState } from '@/lib/game_storage';
import { highScoreAtom } from '@/lib/scoreatom';

interface ShareButtonProps {
  encryptedCity: string;
  questionCount: number;
  score: number;
}

export default function ShareButton({ encryptedCity, questionCount, score }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [username] = useAtom(usernameAtom);
  const [highScore] = useAtom(highScoreAtom);

  const handleShare = async () => {
    // Get stored game state
    const gameState = getGameState();
    
    // Create URL with game state parameters
    const params = new URLSearchParams({
      q: gameState?.encryptedCities.join(',') || encryptedCity,
      count: questionCount.toString(),
      score: highScore.toString(),
      username: username || ''
    });
    
    const url = `${window.location.origin}/game?${params.toString()}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = async () => {
    // Get stored game state
    const gameState = getGameState();
    
    const params = new URLSearchParams({
      q: gameState?.encryptedCities.join(',') || encryptedCity,
      count: questionCount.toString(),
      score: highScore.toString(),
      username: username || ''
    });

    // Fetch share metadata
    const shareMetadata = await fetch(`/api/share?${params.toString()}`).then(res => res.json());
    
    const text = `🎮 ${username ? username + ' has a high score of' : 'My high score is'} ${highScore}/5 in Gussr! Can you beat ${username ? 'their' : 'my'} score? 🌎\n\nPlay now at: ${window.location.origin}/game?${params.toString()}`;
    
    // Use WhatsApp's web share (WhatsApp will automatically pick up Open Graph meta tags)
    const waShareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waShareUrl, '_blank');
  };

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <FiShare2 className="w-4 h-4" />
            Share Game
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2">
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={handleShare}
            >
              <FiCopy className="w-4 h-4" />
              Copy Link
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-[#25D366] hover:text-[#25D366]/90"
              onClick={handleWhatsAppShare}
            >
              <FaWhatsapp className="w-4 h-4" />
              WhatsApp
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-sm"
          >
            Copied!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
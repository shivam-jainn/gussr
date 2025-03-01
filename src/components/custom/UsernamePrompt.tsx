"use client";
import { useState } from 'react';
import { Button } from "../ui/button";
import { useAtom } from 'jotai';
import { usernameAtom } from '@/lib/username_atom';
import { motion } from 'framer-motion';

interface UsernamePromptProps {
  challengerName?: string;
  targetScore?: number;
  onSubmit: () => void;
}

export default function UsernamePrompt({ challengerName, targetScore, onSubmit }: UsernamePromptProps) {
  const [username, setUsername] = useState("");
  const [, setGlobalUsername] = useAtom(usernameAtom);

  const handleSubmit = () => {
    if (username.trim()) {
      setGlobalUsername(username.trim());
      onSubmit();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {challengerName 
            ? `${challengerName} challenged you!`
            : 'Welcome to Gussr!'}
        </h2>
        {targetScore && challengerName && (
          <p className="text-gray-600 mb-6">
            Can you beat {challengerName}&apos;s high score of {targetScore}?
          </p>
        )}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button 
            onClick={handleSubmit}
            disabled={!username.trim()}
            className="w-full"
          >
            Start Game
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
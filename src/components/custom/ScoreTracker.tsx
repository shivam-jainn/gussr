"use client";
import { useAtomValue } from 'jotai';
import { scoreAtom } from '@/lib/scoreatom';
import { motion } from 'framer-motion';

export default function ScoreTracker() {
  const score = useAtomValue(scoreAtom);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-gray-200"
    >
      <p className="text-lg font-semibold text-gray-800">
        Score: <span className="text-blue-600">{score}</span>
      </p>
    </motion.div>
  );
}
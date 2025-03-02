import { Button } from '../ui/button';
import { FiShare2, FiCopy } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useAtom } from 'jotai';
import { usernameAtom } from '@/lib/username_atom';
import { highScoreAtom } from '@/lib/scoreatom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface ShareButtonProps {
  score: number;
}

export default function ShareButton({ score }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [username] = useAtom(usernameAtom);
  const [highScore] = useAtom(highScoreAtom);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [showFirstSegmentModal, setShowFirstSegmentModal] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const queryParam = new URLSearchParams(window.location.search).get('v') || '';
      setCurrentVoucher(queryParam);
    }
  }, []);

  useEffect(() => {
    if (score >= 1500 && !currentVoucher) {
      setShowFirstSegmentModal(true);
    }
  }, [score, currentVoucher]);

  useEffect(() => {
    if (currentVoucher.split('-').length === 3) {
      setVoucherCode(currentVoucher);
      setShowVoucherModal(true);
    }
  }, [currentVoucher]);

  const generateRandomVoucherSegment = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 3 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  };

  const generateVoucherPart = (existingVoucher: string): string => {
    if (!existingVoucher) {
      return generateRandomVoucherSegment();
    }
    const segments = existingVoucher.split('-');
    return segments.length < 3 ? `${existingVoucher}-${generateRandomVoucherSegment()}` : existingVoucher;
  };

  const handleShare = () => {
    const params = new URLSearchParams();
    if (username) params.set('u', encodeURIComponent(username));
    params.set('s', highScore.toString());
    
    if (score >= 1500) {
      const newVoucherPart = generateVoucherPart(currentVoucher);
      params.set('v', newVoucherPart);
    }

    const url = `${window.location.origin}/game?${params.toString()}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const params = new URLSearchParams();
    if (username) params.set('u', encodeURIComponent(username));
    params.set('s', highScore.toString());

    if (score >= 1500) {
      const newVoucherPart = generateVoucherPart(currentVoucher);
      params.set('v', newVoucherPart);
    }

    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/game?${params.toString()}`;

    const progressText = currentVoucher ? `${currentVoucher.split('-').length}/3 segments` : '1/3 segments';
    const message = `🎉 *Exciting news!* I've unlocked a voucher segment!\n\n` +
      `Help me complete it by playing and unlocking more segments.\n\n` +
      `- *Current Progress:* ${progressText}\n\n` +
      `🎯 Play now: ${shareUrl}`;

    const waShareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waShareUrl, '_blank');
  };

  return (
    <div className="relative flex items-center gap-4">
      {currentVoucher && (
        <div className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
          Voucher: {currentVoucher}-
        </div>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <FiShare2 className="w-4 h-4" />
            Share Game
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2">
          <div className="flex flex-col gap-2">
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleShare}>
              <FiCopy className="w-4 h-4" />
              Copy Link
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 text-[#25D366] hover:text-[#25D366]/90" onClick={handleWhatsAppShare}>
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

      <Dialog open={showVoucherModal} onOpenChange={setShowVoucherModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>🎉 Congratulations! You&apos;ve Won a Voucher!</DialogTitle>
          </DialogHeader>
          <div className="p-6 text-center space-y-4">
            <p className="text-lg text-gray-700">You&apos;ve successfully unlocked all three segments of the voucher code!</p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-blue-700">{voucherCode}</p>
            </div>
            <Button onClick={() => navigator.clipboard.writeText(voucherCode)} className="w-full">
              <FiCopy className="w-4 h-4 mr-2" />
              Copy Voucher Code
            </Button>
            <p className="text-sm text-gray-500">Share this code with your friends to claim your reward!</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showFirstSegmentModal} onOpenChange={setShowFirstSegmentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>🎫 First Voucher Segment Unlocked!</DialogTitle>
          </DialogHeader>
          <div className="p-6 text-center space-y-4">
            <p className="text-lg text-gray-700">Congratulations! You`&apos;`ve unlocked your first voucher segment by reaching 1500 points!</p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-xl text-blue-700">Team up with friends to unlock all three segments and claim an exciting reward!</p>
            </div>
            <div className="flex flex-col gap-3">
              <Button onClick={handleShare} className="w-full" variant="outline">
                <FiShare2 className="w-4 h-4 mr-2" />
                Copy & Share Link
              </Button>
              <Button onClick={handleWhatsAppShare} className="w-full bg-[#25D366] hover:bg-[#25D366]/90">
                <FaWhatsapp className="w-4 h-4 mr-2" />
                Share on WhatsApp
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

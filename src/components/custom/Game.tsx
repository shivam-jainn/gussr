"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { decryptCity } from '@/lib/utils';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { saveGameState } from '@/lib/game_storage';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Icon imports
import { FaWikipediaW, FaAirbnb } from 'react-icons/fa';
import { FiExternalLink, FiInfo } from 'react-icons/fi';
import LaughingCat from './LaughingCat';

// import { BiConfetti } from 'react-icons/bi';

import { useAtom } from 'jotai';
import { scoreAtom,highScoreAtom } from '@/lib/scoreatom';
import ScoreTracker from './ScoreTracker';
import { gameSessionAtom } from '@/lib/game_session_atom';
import ShareButton from './ShareButton';
import { nanoid } from 'nanoid';
import { usernameAtom } from '@/lib/username_atom';
import UsernamePrompt from './UsernamePrompt';

interface CityImage {
  id: number;
  city_id: number;
  url: string;
}

interface FunFact {
  id: number;
  city_id: number;
  fact: string;
}

interface AirbnbListing {
  id: number;
  city_id: number;
  url: string;
}

interface WikiHistory {
  id: number;
  city_id: number;
  url: string;
}

interface GameResponse {
  clues: { id: number; clue: string }[];
  options: { id: number; name: string; image_url: string }[];
  encryptedCity: string;
}

interface CityInfo {
  images: CityImage[];
  fun_facts: FunFact[];
  airbnb_listing: AirbnbListing[];
  wiki_history: WikiHistory[];
  headout_links: { id: number; city_id: number; url: string }[];
}

// Sortable Image component
const SortableImage = ({ id, url }: { id: string, url: string }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group cursor-move hover:scale-105 transition-transform"
    >
      <motion.div>
        <Image
          src={url}
          alt="City view"
          width={400}
          height={192}
          className="w-full h-48 object-cover rounded-lg shadow-md border border-white"
        />
      </motion.div>
    </div>
  );
};

export default function Game() {
  const [response, setResponse] = useState<GameResponse>({
    clues: [],
    options: [],
    encryptedCity: ""
  });
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [cityInfo, setCityInfo] = useState<CityInfo | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [imageIds, setImageIds] = useState<string[]>([]);
  const [, setCorrectCityId] = useState<number | null>(null);
  const [, setSelectedOptionId] = useState<number | null>(null);
  const [score, setScore] = useAtom(scoreAtom);
  const [highScore, setHighScore] = useAtom(highScoreAtom);
  const [showLaughingCat, setShowLaughingCat] = useState(false);
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(true);

  const [gameSession, setGameSession] = useAtom(gameSessionAtom);
  const [username] = useAtom(usernameAtom);
  
  // Get challenge parameters from URL
  const [challengerName, setChallengerName] = useState<string | null>(null);
  const [targetScore, setTargetScore] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlUsername = params.get('username');
    const urlScore = params.get('score');

    if (urlUsername && urlScore) {
      setChallengerName(urlUsername);
      setTargetScore(parseInt(urlScore));
    } else {
      setShowUsernamePrompt(false);
    }
  }, []);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const fetchData = async () => {
      try {

        if (!gameSession) {
            const newSession = nanoid(10);
            setGameSession(newSession);
        }
    
        const res = await fetch('/api/questions');
        if (!res.ok) throw new Error('Failed to fetch question');
        const data = await res.json();
        setResponse(data);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    fetchData();
  }, [gameSession, setGameSession]);

  useEffect(() => {
    if (cityInfo?.images) {
      setImageIds(cityInfo.images.map(img => img.id.toString()));
    }
  }, [cityInfo]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.1 }
    });
  };

  const handleAnswer = async (optionId: number, cityName: string) => {
    try {
      const decryptedCityId = decryptCity(response.encryptedCity);
      setSelectedOptionId(optionId);
      
      if (decryptedCityId === null) {
        console.error('Decryption failed');
        return;
      }
      
      setCorrectCityId(decryptedCityId);
      
      if (decryptedCityId === optionId) {
        // Correct answer - Balanced scoring with caps
        setResult('correct');
        setSelectedCity(cityName);
        const basePoints = 100;
        const maxMultiplier = 3; // Cap the multiplier at 3x
        const multiplier = Math.min(1 + (score * 0.1), maxMultiplier); // Gentle progression
        const pointsEarned = Math.min(Math.round(basePoints * multiplier), 500); // Cap at 500 points
        const newScore = score + pointsEarned;
        setScore(newScore);
        
        // Update high score if current score is higher
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('gussr_high_score', newScore.toString());

          // Check if player unlocked voucher segment
          if (newScore >= 1500) {
            const params = new URLSearchParams(window.location.search);
            const existingVoucher = params.get('v');
            if (existingVoucher) {
              const segments = existingVoucher.split('-');
              if (segments.length === 3) {
                // Show complete voucher celebration
                alert(`🎉 Congratulations! You've helped unlock the voucher: ${existingVoucher}\nShare this with your friends to claim your reward!`);
              } else {
                // Show progress celebration
                alert(`🎫 You've unlocked a voucher segment! Share with friends to complete the voucher.`);
              }
            } else {
              // First segment unlocked
              alert(`🎫 You've unlocked your first voucher segment! Share with friends to complete the voucher.`);
            }
          }
        }
        
        triggerConfetti();
        
        // Save game state to localStorage
        if (username) {
          saveGameState(response.encryptedCity, response, username, newScore);
        }
  
        // Fetch city info
        const res = await fetch('/api/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cityId: optionId })
        });
        const data = await res.json();
        setCityInfo(data);
      } else {
        // Wrong answer
        setResult('wrong');
        setShowLaughingCat(true);
        setTimeout(() => setShowLaughingCat(false), 4000);
  
        // Fetch correct city info
        const res = await fetch('/api/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cityId: decryptedCityId })
        });
        const data = await res.json();
        setCityInfo(data);
        
        // Set correct city name
        const correctCity = response.options.find(option => option.id === decryptedCityId);
        if (correctCity) {
          setSelectedCity(correctCity.name);
        }
      }
    } catch (error) {
      console.error('Error in answer handling:', error);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setImageIds((items) => {
        const oldIndex = items.indexOf(active.id.toString());
        const newIndex = items.indexOf(over.id.toString());
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const getImageById = (id: string) => {
    return cityInfo?.images.find(img => img.id.toString() === id);
  };

  return (
    
    <div className="flex flex-col items-center gap-6 p-4 max-w-7xl mx-auto">
    {showUsernamePrompt ? (
      <UsernamePrompt
        challengerName={challengerName || undefined}
        targetScore={targetScore || undefined}
        onSubmit={() => setShowUsernamePrompt(false)}
      />
    ) : null}
    <div className="w-full flex justify-between items-center">
      <ScoreTracker />
      {gameSession && (
        <ShareButton 
          score={score}
        />
      )}
    </div>
      <AnimatePresence>
        {!result && (

          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2 bg-white/90 p-6 rounded-xl shadow-sm"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Guess the City</h1>
            <div className="space-y-2">
              {response.clues.map((clueObj, index) => (
                <motion.h2 
                  key={clueObj.id || index} 
                  className="text-xl font-typewriter text-gray-700"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  • {clueObj.clue}
                </motion.h2>
              ))}
            </div>
          </motion.div>
        )}
              {showLaughingCat && <LaughingCat />}

      </AnimatePresence>

      <Card className="w-full max-w-6xl p-6 bg-white shadow-md rounded-xl">
        {!result ? (
          <div className="grid grid-cols-2 gap-4">
            {response.options.map((option) => (
              <div key={option.id} className="relative group">
                <Button 
                  variant="outline"
                  onClick={() => handleAnswer(option.id, option.name)}
                  disabled={result !== null}
                  className={cn(
                    "w-full h-16 text-lg font-medium border-[1px] text-gray-800 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all"
                  )}
                >
                  {option.name}
                </Button>
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 -top-32 left-1/2 -translate-x-1/2 z-10">
                  <Image 
                    src={option.image_url} 
                    alt={option.name}
                    width={192}
                    height={128}
                    className="w-48 h-32 object-cover rounded-lg shadow-lg border border-white"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center justify-between">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2"
              >
                {/* <BiConfetti className="text-2xl text-green-500" /> */}
                <h2 className="text-2xl font-bold text-gray-800">
                  {result === 'correct' ? (
                    `You correctly guessed ${selectedCity}!`
                  ) : (
                    `Sorry, the correct answer was ${selectedCity}.`
                  )}
                </h2>
              </motion.div>
            </div>

            <div className="flex flex-col h-full md:flex-row gap-8">
              {/* Draggable Image Gallery - Left Side */}
              <div className="md:w-1/2 ">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span>City Gallery</span>
                  <span className="text-sm font-normal text-gray-500">(drag to rearrange)</span>
                </h3>
                
                <DndContext 
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <div className="grid grid-cols-2 gap-4 h-96 overflow-y-auto pr-4 pb-4 h-full">
                    <SortableContext 
                      items={imageIds}
                      strategy={verticalListSortingStrategy}
                    >
                      {imageIds.map((id) => {
                        const image = getImageById(id);
                        if (!image) return null;
                        
                        return (
                          <SortableImage 
                            key={id} 
                            id={id} 
                            url={image.url} 
                          />
                        );
                      })}
                    </SortableContext>
                  </div>
                </DndContext>
              </div>

              {/* Links and Facts - Right Side */}
              <div className="md:w-1/2 space-y-6">
                {/* Fun Facts Section */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-50 rounded-xl p-4 shadow-sm"
                >
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <FiInfo className="text-blue-500" />
                    <span>Fun Facts</span>
                  </h3>
                  <div className="space-y-3">
                    {cityInfo?.fun_facts.map((fact, index) => (
                      <motion.p 
                        key={fact.id} 
                        className="text-sm leading-relaxed text-gray-700"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        • {fact.fact}
                      </motion.p>
                    ))}
                  </div>
                </motion.div>

                {/* Links Board */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-50 rounded-xl p-4 shadow-sm"
                >
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <FiExternalLink className="text-blue-500" />
                    <span>Explore {selectedCity}</span>
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {/* Wikipedia Link */}
                    {cityInfo?.wiki_history[0] && (
                      <a
                        href={cityInfo.wiki_history[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center p-4 bg-white rounded-xl hover:bg-gray-100 transition-colors shadow-sm border border-gray-100"
                      >
                        <FaWikipediaW className="text-2xl mb-2" />
                        <span className="text-sm font-medium">Wikipedia</span>
                      </a>
                    )}
                    
                    {/* Airbnb Listings */}
                    {cityInfo?.airbnb_listing.map((listing) => (
                      <a
                        key={listing.id}
                        href={listing.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center p-4 bg-white rounded-xl hover:bg-gray-100 transition-colors shadow-sm border border-gray-100"
                      >
                        <FaAirbnb className="text-2xl mb-2 text-[#FF5A5F]" />
                        <span className="text-sm font-medium">Airbnb</span>
                      </a>
                    ))}
                    
                    {/* Headout Links if available */}
                    {cityInfo?.headout_links && cityInfo.headout_links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="flex flex-col items-center justify-center p-4 bg-white rounded-xl hover:bg-gray-100 transition-colors shadow-sm border border-gray-100"
                      >
                        <svg className="text-2xl mb-2 w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
                        </svg>
                        <span className="text-sm font-medium">Activities</span>
                      </a>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
            
            <div className="flex gap-4 mt-4">
              <Button 
                onClick={() => {
                  setResult(null);
                  setCityInfo(null);
                  setSelectedOptionId(null);
                  setCorrectCityId(null);
                  // Fetch next question
                  const fetchData = async () => {
                    try {
                      const res = await fetch('/api/questions');
                      if (!res.ok) throw new Error('Failed to fetch question');
                      const data = await res.json();
                      setResponse(data);
                    } catch (error) {
                      console.error('Error:', error);
                    }
                  }
                  fetchData();
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Next Question
              </Button>
              <Button 
                onClick={() => {
                  setResult(null);
                  setCityInfo(null);
                  setSelectedOptionId(null);
                  setCorrectCityId(null);
                  setScore(0);
                  // Refresh the game
                  const fetchData = async () => {
                    try {
                      const res = await fetch('/api/questions');
                      if (!res.ok) throw new Error('Failed to fetch question');
                      const data = await res.json();
                      setResponse(data);
                    } catch (error) {
                      console.error('Error:', error);
                    }
                  }
                  fetchData();
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                Play Again
              </Button>
            </div>
          </motion.div>
        )}
      </Card>
    </div>
  );
}
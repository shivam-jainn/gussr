"use client";
import React, { useEffect, useState } from 'react'
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { decryptCity } from '@/lib/utils';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface Clue {
    id: number;
    city_id: number;
    clue: string;
}

interface Option {
    id: number;
    name: string;
    image_url: string;
}

interface GameResponse {
    clues: Clue[];
    options: Option[];
    encryptedCity: string;
}

export default function Game() {
    const [response, setResponse] = React.useState<GameResponse>({
      clues: [],
      options: [],
      encryptedCity: ""
    });
    const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
    const [cityInfo, setCityInfo] = useState(null);
  
    useEffect(() => {
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
    }, []);
  
    const triggerConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    };

    const handleAnswer = async (optionId: number) => {
      try {
        const correctCityId = decryptCity(response.encryptedCity);
        
        if (correctCityId === null) {
          console.error('Decryption failed. Possible reasons:', {
            timestamp: Date.now(),
            encryptedData: response.encryptedCity,
            parsedData: JSON.parse(atob(response.encryptedCity))
          });
          return;
        }
        
        if (correctCityId === optionId) {
          setResult('correct');
          triggerConfetti();
          const res = await fetch('/api/questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cityId: optionId })
          });
          const data = await res.json();
          setCityInfo(data);
        } else {
          setResult('wrong');
        }
      } catch (error) {
        console.error('Error in answer handling:', error);
      }
    };
  
    return (
      <div className="flex flex-col items-center gap-6 p-4">
        <div className="text-center space-y-2">
          {response.clues.map((clueObj, index) => (
            <h2 key={clueObj.id || index} className="text-2xl font-typewriter">
              • {clueObj.clue}
            </h2>
          ))}
        </div>

        <Card className="w-full max-w-md p-6 bg-transparent backdrop-blur-sm">
          <div className="grid grid-cols-2 gap-4">
            {response.options.map((option) => (
              <div key={option.id} className="relative group">
                <Button 
                  variant="outline"
                  onClick={() => handleAnswer(option.id)}
                  disabled={result !== null}
                  className={cn(
                    "w-full h-16 text-lg font-medium border-[1px] hover:bg-transparent hover:border-white/50",
                    result === 'correct' && option.id === decryptCity(response.encryptedCity) && "bg-green-500/20 border-green-500",
                    result === 'wrong' && option.id === decryptCity(response.encryptedCity) && "bg-green-500/20 border-green-500",
                    result === 'wrong' && option.id !== decryptCity(response.encryptedCity) && "opacity-50"
                  )}
                >
                  {option.name}
                </Button>
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 -top-32 left-1/2 -translate-x-1/2 z-10">
                  <img 
                    src={option.image_url} 
                    alt={option.name}
                    className="w-48 h-32 object-cover rounded-lg shadow-lg"
                  />
                </div>
              </div>
            ))}
          </div>

          {result && (
            <div className={cn(
              "mt-6 text-center p-4 rounded-lg",
              result === 'correct' ? "bg-green-500/20" : "bg-red-500/20"
            )}>
              <p className="text-lg font-medium mb-2">
                {result === 'correct' ? (
                  "Correct! 🎉 🎊"
                ) : (
                  <div className="space-y-4">
                    <p>Wrong answer! 😢</p>
                    <img 
                      src="https://tenor.com/en-GB/view/orange-cat-laughing-gif-4864481311946633472" 
                      alt="Laughing cat"
                      className="w-32 h-32 mx-auto rounded-lg"
                    />
                  </div>
                )}
              </p>
              {cityInfo && result === 'correct' && (
                <div className="mt-4 space-y-2">
                  {cityInfo.fun_facts?.map((fact: any, index: number) => (
                    <p key={index} className="text-sm">{fact.fact}</p>
                  ))}
                  {cityInfo.wiki_history?.[0]?.url && (
                    <a 
                      href={cityInfo.wiki_history[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 block mt-2"
                    >
                      Learn more about this city
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    );
}

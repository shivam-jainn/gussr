import React from 'react'
import Game from '@/components/custom/Game'
import ScoreTracker from '@/components/custom/ScoreTracker'
export default function page() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
              <ScoreTracker />

        <Game />
    </div>
  )
}

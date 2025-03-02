import React from 'react'

export default function LaughingCat() {
  return (
    <video
  autoPlay
  muted={false}
  className="w-[500px] rounded-xl"
  src="/laughingcat.mp4"
>
  Your browser does not support the video tag.
</video>
    )
}

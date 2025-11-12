"use client"

import DigitalSculpture from "../components/DigitalSculpture"

export default function DigitalSculptureView() {
  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
        Escultura 3D
      </h1>
      <DigitalSculpture />
    </div>
  )
}

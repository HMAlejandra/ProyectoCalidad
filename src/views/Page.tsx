"use client"

import { useState } from "react"
import Sidebar from "../components/sidebar"
import HomeView from "../components/home-view"
import Pintura3D from "../components/Pintura3D"
import SistemaSolar3D from "../components/SistemaSolar3D"
import DigitalSculpture from "../components/DigitalSculpture"

type ViewType = "home" | "pintura" | "sistema-solar" | "escultura"

export default function Page() {
  const [activeView, setActiveView] = useState<ViewType>("home")

  const renderView = () => {
    switch (activeView) {
      case "home":
        return <HomeView onSelectModule={(module) => setActiveView(module as ViewType)} />
      case "pintura":
        return <Pintura3D />
      case "sistema-solar":
        return <SistemaSolar3D />
      case "escultura":
        return <DigitalSculpture />
      default:
        return <HomeView onSelectModule={(module) => setActiveView(module as ViewType)} />
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar activeView={activeView} onViewChange={(view) => setActiveView(view as ViewType)} />
      <main className="flex-1 ml-20 lg:ml-64 transition-all duration-300">{renderView()}</main>
    </div>
  )
}

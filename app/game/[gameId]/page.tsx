"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SoloGameMode } from "@/components/game-modes/solo-game-mode"
import { ReviewGameMode } from "@/components/game-modes/review-game-mode"
import { HostGameMode } from "@/components/game-modes/host-game-mode"

interface Question {
  id: string
  question: string
  answers: string[]
  correctAnswer: number
  timeLimit: number
  points: number
}

interface GameData {
  id: string
  title: string
  description: string
  subject: string
  difficulty: string
  questions: Question[]
  createdBy: string
  createdAt: string
  isPublic: boolean
}

export default function GamePage({ params }: { params: { gameId: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "solo"
  const [game, setGame] = useState<GameData | null>(null)

  useEffect(() => {
    // Load game data from localStorage
    const allGames = JSON.parse(localStorage.getItem("eduGame_games") || "[]")
    const foundGame = allGames.find((g: GameData) => g.id === params.gameId)

    if (foundGame) {
      setGame(foundGame)
    } else {
      // Game not found, redirect to lobby
      router.push("/lobby")
    }
  }, [params.gameId])

  if (!game) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading game...</h2>
        </div>
      </div>
    )
  }

  // Render the appropriate game mode component
  switch (mode) {
    case "solo":
      return <SoloGameMode game={game} />
    case "review":
      return <ReviewGameMode game={game} />
    case "host":
      return <HostGameMode game={game} />
    default:
      return <SoloGameMode game={game} />
  }
}

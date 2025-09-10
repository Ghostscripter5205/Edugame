"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { ArrowLeft, Play, Users, BookOpen, Crown, Clock, Trophy } from "lucide-react"

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

export default function PlayGamePage({ params }: { params: { gameId: string } }) {
  const router = useRouter()
  const [game, setGame] = useState<GameData | null>(null)
  const [selectedMode, setSelectedMode] = useState<string | null>(null)

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

  const handleModeSelect = (mode: string) => {
    if (!game) return

    // Navigate to the specific game mode
    router.push(`/game/${game.id}?mode=${mode}`)
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading game...</h2>
        </div>
      </div>
    )
  }

  const totalPoints = game.questions.reduce((sum, q) => sum + q.points, 0)
  const averageTime = Math.round(game.questions.reduce((sum, q) => sum + q.timeLimit, 0) / game.questions.length)

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.push("/lobby")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lobby
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{game.title}</h1>
            <p className="text-muted-foreground">Choose how you want to play</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Game Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Subject</span>
                <Badge variant="outline" className="capitalize">
                  {game.subject}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Difficulty</span>
                <Badge variant="outline" className="capitalize">
                  {game.difficulty}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Questions</span>
                <span className="text-sm text-muted-foreground">{game.questions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Points</span>
                <span className="text-sm text-muted-foreground">{totalPoints}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Avg. Time</span>
                <span className="text-sm text-muted-foreground">{averageTime}s per question</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{game.description || "No description provided for this game."}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
            <CardContent className="p-6 text-center" onClick={() => handleModeSelect("solo")}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Solo Practice</h3>
              <p className="text-muted-foreground mb-4">
                Practice on your own at your own pace. Perfect for learning and improving your knowledge.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Timed questions</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="w-4 h-4" />
                  <span>Track your score</span>
                </div>
              </div>
              <Button className="w-full mt-4" onClick={() => handleModeSelect("solo")}>
                Start Solo Game
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
            <CardContent className="p-6 text-center" onClick={() => handleModeSelect("review")}>
              <div className="w-16 h-16 bg-chart-2/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-chart-2" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Review Mode</h3>
              <p className="text-muted-foreground mb-4">
                Study mode with immediate feedback. See correct answers and explanations right away.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>No time pressure</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="w-4 h-4" />
                  <span>Instant feedback</span>
                </div>
              </div>
              <Button className="w-full mt-4" onClick={() => handleModeSelect("review")}>
                Start Review
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
            <CardContent className="p-6 text-center" onClick={() => handleModeSelect("host")}>
              <div className="w-16 h-16 bg-chart-3/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-chart-3" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Host Game</h3>
              <p className="text-muted-foreground mb-4">
                Host a live multiplayer game. Share the game code with others to join and compete.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Multiplayer</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Crown className="w-4 h-4" />
                  <span>Real-time competition</span>
                </div>
              </div>
              <Button className="w-full mt-4" onClick={() => handleModeSelect("host")}>
                Host Game
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

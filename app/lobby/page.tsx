"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, Play, Plus, Hash, Trophy, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

interface GameData {
  id: string
  title: string
  description: string
  subject: string
  difficulty: string
  questions: any[]
  createdBy: string
  createdAt: string
  isPublic: boolean
}

export default function LobbyPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [gameCode, setGameCode] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [availableGames, setAvailableGames] = useState<GameData[]>([])
  const [gameSettings, setGameSettings] = useState({
    name: "",
    mode: "",
    subject: "",
    timeLimit: "30",
    maxPlayers: "30",
  })

  useEffect(() => {
    // Load available public games
    const allGames = JSON.parse(localStorage.getItem("eduGame_games") || "[]")
    const publicGames = allGames.filter((game: GameData) => game.isPublic).slice(0, 5)
    setAvailableGames(publicGames)
  }, [])

  const gameModesData = [
    {
      id: "quiz-race",
      name: "Quiz Race",
      description: "Fast-paced quiz competition",
      icon: Trophy,
      color: "bg-chart-1",
    },
    {
      id: "team-battle",
      name: "Team Battle",
      description: "Collaborative team challenges",
      icon: Users,
      color: "bg-chart-2",
    },
    {
      id: "survival",
      name: "Survival Mode",
      description: "Last player standing wins",
      icon: Play,
      color: "bg-chart-3",
    },
    {
      id: "study-mode",
      name: "Study Mode",
      description: "Learn at your own pace",
      icon: BookOpen,
      color: "bg-chart-4",
    },
  ]

  const handleJoinGame = () => {
    console.log("[v0] Attempting to join game with code:", gameCode) // Added debug logging
    if (gameCode.length === 6) {
      const gameSession = localStorage.getItem(`gameSession_${gameCode}`)
      console.log("[v0] Game session found:", gameSession) // Added debug logging

      if (gameSession) {
        // Valid game session found
        const session = JSON.parse(gameSession)
        console.log("[v0] Navigating to waiting room for session:", session) // Added debug logging
        router.push(`/lobby/waiting?gameId=${session.id}&code=${gameCode}`)
      } else {
        // Check if it's a saved game that can be played
        const allGames = JSON.parse(localStorage.getItem("eduGame_games") || "[]")
        const foundGame = allGames.find((game: GameData) => game.id.toUpperCase().includes(gameCode.toUpperCase()))
        console.log("[v0] Searching for game, found:", foundGame) // Added debug logging

        if (foundGame) {
          router.push(`/play/${foundGame.id}`)
        } else {
          alert("Game not found. Please check the code and try again.")
        }
      }
    } else {
      console.log("[v0] Game code length invalid:", gameCode.length) // Added debug logging
    }
  }

  const handleCreateGame = () => {
    if (gameSettings.name && gameSettings.mode && gameSettings.subject) {
      if (user) {
        // Navigate to game creation interface
        router.push("/create")
      } else {
        // Redirect to login if not authenticated
        router.push("/")
      }
      setIsCreating(false)
    }
  }

  const handleQuickPlay = (game: GameData) => {
    router.push(`/play/${game.id}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-primary">EduGame</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
                  My Games
                </Button>
                <Button size="sm" onClick={() => router.push("/create")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Game
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => router.push("/")}>
                Log In
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Game Lobby</h1>
            <p className="text-xl text-muted-foreground">
              Join an existing game or create your own educational adventure
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Join Game Card */}
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <Hash className="w-6 h-6 text-primary" />
                  Join a Game
                </CardTitle>
                <CardDescription>Enter a 6-digit game code to join an existing game</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="gameCode">Game Code</Label>
                  <Input
                    id="gameCode"
                    placeholder="Enter 6-digit code"
                    value={gameCode}
                    onChange={(e) => {
                      const newValue = e.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, "")
                        .slice(0, 6) // Added input validation and sanitization
                      console.log("[v0] Game code input changed:", newValue) // Added debug logging
                      setGameCode(newValue)
                    }}
                    maxLength={6}
                    className="text-center text-2xl font-mono tracking-widest"
                    autoComplete="off" // Added autocomplete off to prevent browser interference
                  />
                </div>
                <Button onClick={handleJoinGame} disabled={gameCode.length !== 6} className="w-full" size="lg">
                  <Play className="w-5 h-5 mr-2" />
                  Join Game ({gameCode.length}/6) {/* Added character counter for debugging */}
                </Button>
              </CardContent>
            </Card>

            {/* Create Game Card */}
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <Plus className="w-6 h-6 text-accent" />
                  Create a Game
                </CardTitle>
                <CardDescription>Set up a new game for your students or friends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {user ? (
                  <>
                    <Button onClick={() => router.push("/create")} className="w-full" size="lg">
                      <Plus className="w-5 h-5 mr-2" />
                      Create New Game
                    </Button>
                    <Button
                      onClick={() => router.push("/dashboard")}
                      variant="outline"
                      className="w-full bg-transparent"
                      size="lg"
                    >
                      <BookOpen className="w-5 h-5 mr-2" />
                      My Games
                    </Button>
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">You need to be logged in to create games</p>
                    <Button onClick={() => router.push("/")} className="w-full" size="lg">
                      Log In to Create
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Game Modes Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">Available Game Modes</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {gameModesData.map((mode) => (
                <Card key={mode.id} className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 ${mode.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <mode.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{mode.name}</h3>
                    <p className="text-sm text-muted-foreground">{mode.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Available Games */}
          {availableGames.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Quick Play - Available Games</h2>
              <div className="grid gap-4">
                {availableGames.map((game) => (
                  <Card key={game.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{game.title}</h3>
                          <p className="text-sm text-muted-foreground capitalize">
                            {game.subject} • {game.questions.length} questions
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="capitalize">
                          {game.difficulty}
                        </Badge>
                        <Badge variant="secondary">
                          <Trophy className="w-3 h-3 mr-1" />
                          {game.questions.reduce((sum, q) => sum + (q.points || 100), 0)} pts
                        </Badge>
                        <Button size="sm" onClick={() => handleQuickPlay(game)}>
                          <Play className="w-4 h-4 mr-2" />
                          Play
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
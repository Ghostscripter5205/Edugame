"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Crown, Users, Copy, Play, ArrowLeft, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"

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

interface Player {
  id: string
  name: string
  avatar: string
  isHost: boolean
  joinedAt: string
}

interface HostGameModeProps {
  game: GameData
}

export function HostGameMode({ game }: HostGameModeProps) {
  const router = useRouter()
  const [gameCode] = useState(() => Math.random().toString(36).substring(2, 8).toUpperCase())
  const [players, setPlayers] = useState<Player[]>([
    {
      id: "host",
      name: "You (Host)",
      avatar: "H",
      isHost: true,
      joinedAt: new Date().toISOString(),
    },
  ])
  const [gameStarted, setGameStarted] = useState(false)
  const [showCopied, setShowCopied] = useState(false)

  // Store this game session in localStorage so others can join
  useEffect(() => {
    const gameSession = {
      id: game.id,
      code: gameCode,
      host: "You (Host)",
      players: players,
      status: "waiting",
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem(`gameSession_${gameCode}`, JSON.stringify(gameSession))

    // Clean up on unmount
    return () => {
      localStorage.removeItem(`gameSession_${gameCode}`)
    }
  }, [gameCode, game.id, players])

  const copyGameCode = async () => {
    try {
      await navigator.clipboard.writeText(gameCode)
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy game code:", error)
    }
  }

  const startGame = () => {
    setGameStarted(true)
    // In a real implementation, this would start the multiplayer game
    router.push(`/game/${game.id}?mode=multiplayer&code=${gameCode}`)
  }

  const removePlayer = (playerId: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== playerId))
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.push(`/play/${game.id}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Crown className="w-8 h-8 text-yellow-500" />
              Hosting: {game.title}
            </h1>
            <p className="text-muted-foreground">Share the game code for others to join</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Game Code Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Game Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold font-mono bg-primary/10 p-6 rounded-lg mb-4">{gameCode}</div>
                <Button onClick={copyGameCode} className="w-full">
                  <Copy className="w-4 h-4 mr-2" />
                  {showCopied ? "Copied!" : "Copy Game Code"}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Share this code with players so they can join your game
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Game Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Game Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
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
                <span className="text-sm font-medium">Players</span>
                <span className="text-sm text-muted-foreground">{players.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Players List */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Players ({players.length})
              </span>
              <Badge variant="outline" className="flex items-center gap-1">
                <UserPlus className="w-3 h-3" />
                Waiting for players...
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center gap-3 p-4 rounded-lg border ${
                    player.isHost ? "bg-primary/10 border-primary/20" : "bg-card"
                  }`}
                >
                  <Avatar>
                    <AvatarFallback className={player.isHost ? "bg-primary text-primary-foreground" : "bg-muted"}>
                      {player.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium flex items-center gap-2">
                      {player.name}
                      {player.isHost && <Crown className="w-4 h-4 text-yellow-500" />}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Joined {new Date(player.joinedAt).toLocaleTimeString()}
                    </div>
                  </div>
                  {!player.isHost && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePlayer(player.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {players.length === 1 && (
              <div className="text-center py-8 text-muted-foreground">
                <UserPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Waiting for players to join...</p>
                <p className="text-sm">
                  Share the game code <strong>{gameCode}</strong> with your friends
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Start Game Button */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Ready to start?</h3>
                <p className="text-sm text-muted-foreground">You need at least 2 players to start the game</p>
              </div>
              <Button onClick={startGame} disabled={players.length < 2} size="lg" className="px-8">
                <Play className="w-4 h-4 mr-2" />
                Start Game
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

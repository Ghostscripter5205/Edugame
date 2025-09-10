"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Users, Play, Crown, Copy, Check } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

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

export default function WaitingRoomPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const gameId = searchParams.get("gameId")
  const code = searchParams.get("code")

  const [gameCode] = useState(code || "ABC123")
  const [copied, setCopied] = useState(false)
  const [game, setGame] = useState<GameData | null>(null)
  const [players, setPlayers] = useState([{ id: 1, name: "You", isHost: false, avatar: "Y" }])

  useEffect(() => {
    if (gameId && code) {
      const allGames = JSON.parse(localStorage.getItem("eduGame_games") || "[]")
      const foundGame = allGames.find((g: GameData) => g.id === gameId)
      if (foundGame) {
        setGame(foundGame)
      }

      const gameSession = localStorage.getItem(`gameSession_${code}`)
      if (gameSession) {
        const session = JSON.parse(gameSession)
        const currentUser = {
          id: `player_${Date.now()}`,
          name: `Player ${Math.floor(Math.random() * 1000)}`,
          isHost: false,
          avatar: `P${Math.floor(Math.random() * 9) + 1}`,
          joinedAt: new Date().toISOString(),
        }

        const updatedPlayers = [...session.players]

        // Check if this user already joined (prevent duplicates)
        const existingPlayerIndex = updatedPlayers.findIndex((p) => p.id.startsWith("player_") && !p.isHost)
        if (existingPlayerIndex === -1) {
          updatedPlayers.push(currentUser)

          const updatedSession = { ...session, players: updatedPlayers }
          localStorage.setItem(`gameSession_${code}`, JSON.stringify(updatedSession))
        }

        setPlayers(updatedPlayers)
      }
    }
  }, [gameId, code])

  useEffect(() => {
    if (!code) return

    const pollForUpdates = setInterval(() => {
      const gameSession = localStorage.getItem(`gameSession_${code}`)
      if (gameSession) {
        const session = JSON.parse(gameSession)
        if (session.players && session.players.length !== players.length) {
          setPlayers(session.players)
        }
      }
    }, 1000)

    return () => clearInterval(pollForUpdates)
  }, [code, players.length])

  const gameSettings = {
    name: game?.title || "Math Challenge",
    mode: "Quiz Race",
    subject: game?.subject || "Mathematics",
    timeLimit: "30 seconds",
    maxPlayers: 30,
  }

  const copyGameCode = async () => {
    try {
      await navigator.clipboard.writeText(gameCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy game code:", error)
    }
  }

  const startGame = () => {
    if (game) {
      router.push(`/game/${game.id}?mode=multiplayer&code=${gameCode}`)
    }
  }

  const leaveGame = () => {
    router.push("/lobby")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={leaveGame}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Leave Game
          </Button>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Game Code: {gameCode}
            </Badge>
            <Button variant="outline" size="sm" onClick={copyGameCode} className="gap-2 bg-transparent">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">{gameSettings.name}</h1>
            <div className="flex justify-center gap-4 flex-wrap">
              <Badge variant="outline" className="text-sm">
                {gameSettings.mode}
              </Badge>
              <Badge variant="outline" className="text-sm capitalize">
                {gameSettings.subject}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {gameSettings.timeLimit} per question
              </Badge>
              <Badge variant="outline" className="text-sm">
                Max {gameSettings.maxPlayers} players
              </Badge>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Players ({players.length}/{gameSettings.maxPlayers})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {players.map((player) => (
                      <div key={player.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card/50">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {player.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{player.name}</span>
                            {player.isHost && <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
                          </div>
                        </div>
                      </div>
                    ))}

                    {Array.from({ length: Math.min(6 - players.length, 6) }).map((_, index) => (
                      <div
                        key={`empty-${index}`}
                        className="flex items-center gap-3 p-3 rounded-lg border border-dashed bg-muted/30"
                      >
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <Users className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <span className="text-muted-foreground">Waiting...</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Game Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-muted-foreground">Waiting for the host to start the game...</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Players joined:</span>
                      <span>
                        {players.length}/{gameSettings.maxPlayers}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(players.length / gameSettings.maxPlayers) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  {players.find((p) => p.name === "You")?.isHost ? (
                    <Button onClick={startGame} className="w-full" size="lg" disabled={players.length < 2}>
                      <Play className="w-5 h-5 mr-2" />
                      Start Game
                    </Button>
                  ) : (
                    <Button className="w-full" size="lg" disabled>
                      <Users className="w-5 h-5 mr-2" />
                      Waiting for Host
                    </Button>
                  )}

                  <p className="text-xs text-center text-muted-foreground">
                    {players.length < 2 ? "Need at least 2 players to start" : "Ready to start the game!"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Share Game Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-3">
                    <div className="text-3xl font-mono font-bold tracking-widest text-primary">{gameCode}</div>
                    <p className="text-xs text-muted-foreground">Share this code with players to join</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

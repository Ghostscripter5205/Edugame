"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Users, Play, Crown, Copy, Check } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface Player {
  id: number
  name: string
  isHost: boolean
  avatar: string
}

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
  const [players, setPlayers] = useState<Player[]>([])

  const playerId = Date.now() // unique for this user
  const playerName = localStorage.getItem("eduGame_username") || `Player${Math.floor(Math.random() * 1000)}`
  const isHost = false // or determine based on the game creator

  // Join the game session
  const joinSession = () => {
    if (!code) return
    const sessionKey = `gameSession_${code}`
    const session = JSON.parse(localStorage.getItem(sessionKey) || "{}")
    if (!session.players) session.players = []

    // Add player if not already in session
    if (!session.players.find((p: Player) => p.id === playerId)) {
      session.players.push({ id: playerId, name: playerName, isHost, avatar: playerName[0] })
      localStorage.setItem(sessionKey, JSON.stringify(session))
    }
  }

  // Poll for session updates
  useEffect(() => {
    if (!code) return
    joinSession()
    const interval = setInterval(() => {
      const session = JSON.parse(localStorage.getItem(`gameSession_${code}`) || "{}")
      setPlayers(session.players || [])
    }, 1000)
    return () => clearInterval(interval)
  }, [code])

  const copyGameCode = async () => {
    try {
      await navigator.clipboard.writeText(gameCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const startGame = () => {
    if (game) router.push(`/game/${game.id}?mode=multiplayer&code=${gameCode}`)
  }
  const leaveGame = () => router.push("/lobby")

  return (
    <div className="min-h-screen bg-background">
      {/* header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={leaveGame}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Leave Game
          </Button>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">Game Code: {gameCode}</Badge>
            <Button variant="outline" size="sm" onClick={copyGameCode} className="gap-2 bg-transparent">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
      </header>

      {/* main content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{game?.title || "Math Challenge"}</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" /> Players ({players.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {players.map((player) => (
                      <div key={player.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card/50">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary text-primary-foreground">{player.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{player.name}</span>
                            {player.isHost && <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Game Status</CardTitle></CardHeader>
                <CardContent>
                  {players.find((p) => p.id === playerId && p.isHost) ? (
                    <Button onClick={startGame} className="w-full">Start Game</Button>
                  ) : (
                    <Button className="w-full" disabled>Waiting for Host</Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

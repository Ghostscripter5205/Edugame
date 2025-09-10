"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { GameChat } from "@/components/multiplayer/game-chat"
import { Eye, Trophy, Users, Clock, Play, Crown } from "lucide-react"

const gameData = {
  name: "Math Championship",
  mode: "Quiz Race",
  subject: "Mathematics",
  currentQuestion: 3,
  totalQuestions: 10,
  timeLeft: 15,
}

const players = [
  { id: 1, name: "Alex", score: 450, avatar: "A", isAnswering: true },
  { id: 2, name: "Sarah", score: 380, avatar: "S", isAnswering: false },
  { id: 3, name: "Mike", score: 320, avatar: "M", isAnswering: true },
  { id: 4, name: "Emma", score: 290, avatar: "E", isAnswering: true },
  { id: 5, name: "Jake", score: 250, avatar: "J", isAnswering: false },
]

const currentQuestion = {
  question: "What is the square root of 144?",
  options: ["10", "12", "14", "16"],
  correctAnswer: 1,
}

export default function SpectatePage() {
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Spectator Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                <span className="font-semibold">Spectating</span>
              </div>
              <Badge variant="outline">{gameData.name}</Badge>
              <Badge variant="secondary">{gameData.mode}</Badge>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="outline">
                Question {gameData.currentQuestion}/{gameData.totalQuestions}
              </Badge>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className={`font-mono ${gameData.timeLeft <= 10 ? "text-destructive" : ""}`}>
                  {gameData.timeLeft}s
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Spectator View */}
          <div className="lg:col-span-3 space-y-6">
            {/* Current Question Display */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Current Question</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-4">{currentQuestion.question}</h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-muted/30 flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span>{option}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Answer Progress */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Players answered:</span>
                    <span>
                      {players.filter((p) => !p.isAnswering).length}/{players.length}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(players.filter((p) => !p.isAnswering).length / players.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Player Status Grid */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Player Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className={`p-4 rounded-lg border ${
                        player.isAnswering
                          ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800"
                          : "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {player.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-semibold">{player.name}</div>
                          <div className="text-sm text-muted-foreground">{player.score} points</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {player.isAnswering ? (
                          <>
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                            <span className="text-sm text-yellow-700 dark:text-yellow-300">Thinking...</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="text-sm text-green-700 dark:text-green-300">Answered</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Join Game CTA */}
            <Card>
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Play className="w-12 h-12 text-primary mx-auto mb-3" />
                  <h3 className="text-xl font-semibold mb-2">Want to Join the Action?</h3>
                  <p className="text-muted-foreground">
                    This game is currently in progress, but you can join the next round!
                  </p>
                </div>
                <Button size="lg">
                  <Play className="w-5 h-5 mr-2" />
                  Join Next Game
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Live Leaderboard */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Live Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {players
                  .sort((a, b) => b.score - a.score)
                  .map((player, index) => (
                    <div key={player.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="text-sm font-bold w-6">
                        {index === 0 ? <Crown className="w-4 h-4 text-yellow-500" /> : `#${index + 1}`}
                      </div>
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {player.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate flex items-center gap-2">
                          {player.name}
                          {player.isAnswering && <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />}
                        </div>
                        <div className="text-xs text-muted-foreground">{player.score} pts</div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Game Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm">Game Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Total Players:</span>
                  <span className="font-semibold">{players.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Questions Left:</span>
                  <span className="font-semibold">{gameData.totalQuestions - gameData.currentQuestion}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Average Score:</span>
                  <span className="font-semibold">
                    {Math.round(players.reduce((sum, p) => sum + p.score, 0) / players.length)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Spectators:</span>
                  <span className="font-semibold flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    12
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Spectator Chat */}
      <GameChat isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
    </div>
  )
}

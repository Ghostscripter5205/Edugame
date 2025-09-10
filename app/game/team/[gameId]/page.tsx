"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { GameChat } from "@/components/multiplayer/game-chat"
import { Clock, Trophy, CheckCircle, XCircle, Zap, Target } from "lucide-react"

const sampleQuestion = {
  id: 1,
  question: "What is the result of 25 × 4?",
  options: ["90", "100", "110", "120"],
  correctAnswer: 1,
  subject: "Mathematics",
  difficulty: "Medium",
}

const teams = [
  {
    id: 1,
    name: "Lightning Bolts",
    color: "bg-chart-1",
    score: 450,
    members: [
      { id: 1, name: "Alex", avatar: "A", isCurrentUser: true },
      { id: 2, name: "Sarah", avatar: "S", isCurrentUser: false },
    ],
  },
  {
    id: 2,
    name: "Thunder Hawks",
    color: "bg-chart-2",
    score: 380,
    members: [
      { id: 3, name: "Mike", avatar: "M", isCurrentUser: false },
      { id: 4, name: "Emma", avatar: "E", isCurrentUser: false },
    ],
  },
  {
    id: 3,
    name: "Storm Riders",
    color: "bg-chart-3",
    score: 320,
    members: [
      { id: 5, name: "Jake", avatar: "J", isCurrentUser: false },
      { id: 6, name: "Lisa", avatar: "L", isCurrentUser: false },
    ],
  },
]

export default function TeamGamePage() {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [answered, setAnswered] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [teamAnswers, setTeamAnswers] = useState<{ [key: number]: number }>({})

  const currentTeam = teams[0] // User's team
  const currentUser = currentTeam.members.find((m) => m.isCurrentUser)

  useEffect(() => {
    if (timeLeft > 0 && !answered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !answered) {
      handleTimeUp()
    }
  }, [timeLeft, answered])

  const handleTimeUp = () => {
    setAnswered(true)
    setShowResult(true)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (answered) return

    setSelectedAnswer(answerIndex)
    setAnswered(true)
    setShowResult(true)

    // Simulate team member also answering
    setTeamAnswers({
      1: answerIndex,
      2: Math.floor(Math.random() * 4), // Teammate's answer
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Game Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="outline">Team Battle Mode</Badge>
              <Badge variant="secondary">{sampleQuestion.subject}</Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className={`font-mono text-lg ${timeLeft <= 10 ? "text-destructive" : ""}`}>{timeLeft}s</span>
              </div>
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${timeLeft <= 10 ? "bg-destructive" : "bg-primary"}`}
                  style={{ width: `${(timeLeft / 30) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Game Area */}
          <div className="lg:col-span-3">
            {/* Team Status */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${currentTeam.color} rounded-lg flex items-center justify-center`}>
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{currentTeam.name}</h2>
                      <p className="text-sm text-muted-foreground">Your Team</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{currentTeam.score}</div>
                    <p className="text-sm text-muted-foreground">Team Score</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {currentTeam.members.map((member) => (
                    <div key={member.id} className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{member.name}</span>
                      {member.isCurrentUser && (
                        <Badge variant="secondary" className="text-xs">
                          You
                        </Badge>
                      )}
                      {teamAnswers[member.id] !== undefined && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Question Card */}
            <Card>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <Badge variant="outline" className="mb-4">
                    {sampleQuestion.difficulty}
                  </Badge>
                  <h1 className="text-3xl font-bold text-balance mb-6">{sampleQuestion.question}</h1>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {sampleQuestion.options.map((option, index) => {
                    let buttonVariant: "default" | "outline" | "destructive" | "secondary" = "outline"
                    let buttonClass = "h-auto p-6 text-lg font-medium transition-all duration-300"

                    if (showResult) {
                      if (index === sampleQuestion.correctAnswer) {
                        buttonVariant = "default"
                        buttonClass += " bg-green-500 hover:bg-green-600 text-white border-green-500"
                      } else if (index === selectedAnswer && index !== sampleQuestion.correctAnswer) {
                        buttonVariant = "destructive"
                      } else {
                        buttonClass += " opacity-50"
                      }
                    } else if (selectedAnswer === index) {
                      buttonVariant = "secondary"
                    }

                    return (
                      <Button
                        key={index}
                        variant={buttonVariant}
                        className={buttonClass}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={answered}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-left flex-1">{option}</span>
                          {showResult && index === sampleQuestion.correctAnswer && (
                            <CheckCircle className="w-5 h-5 text-white" />
                          )}
                          {showResult && index === selectedAnswer && index !== sampleQuestion.correctAnswer && (
                            <XCircle className="w-5 h-5" />
                          )}
                        </div>
                      </Button>
                    )
                  })}
                </div>

                {showResult && (
                  <div className="mt-8 text-center">
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-semibold ${
                        selectedAnswer === sampleQuestion.correctAnswer
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedAnswer === sampleQuestion.correctAnswer ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Team Success! +{Math.max(100, timeLeft * 10)} points
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5" />
                          {selectedAnswer === null ? "Time's up!" : "Keep trying!"}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Team Leaderboard */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Team Rankings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {teams
                  .sort((a, b) => b.score - a.score)
                  .map((team, index) => (
                    <div
                      key={team.id}
                      className={`p-4 rounded-lg border ${
                        team.id === currentTeam.id ? "bg-primary/10 border-primary/20" : "bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-lg font-bold w-6">#{index + 1}</div>
                        <div className={`w-8 h-8 ${team.color} rounded-lg flex items-center justify-center`}>
                          <Target className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate">
                            {team.name}
                            {team.id === currentTeam.id && (
                              <Badge variant="secondary" className="ml-1 text-xs">
                                Your Team
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{team.score} points</div>
                        </div>
                      </div>

                      <div className="flex -space-x-2">
                        {team.members.map((member) => (
                          <Avatar key={member.id} className="w-6 h-6 border-2 border-background">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {member.avatar}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Multiplayer Chat */}
      <GameChat isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
    </div>
  )
}

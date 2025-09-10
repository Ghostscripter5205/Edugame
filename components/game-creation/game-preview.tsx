"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Play, Clock, Trophy } from "lucide-react"

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

interface GamePreviewProps {
  gameData: GameData
  onBack: () => void
  onSave: () => void
}

export function GamePreview({ gameData, onBack, onSave }: GamePreviewProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const totalPoints = gameData.questions.reduce((sum, q) => sum + q.points, 0)
  const averageTime = Math.round(
    gameData.questions.reduce((sum, q) => sum + q.timeLimit, 0) / gameData.questions.length,
  )

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Questions
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Game Preview</h1>
              <p className="text-muted-foreground">Review your game before saving</p>
            </div>
          </div>
          <Button onClick={onSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Game
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{gameData.title}</CardTitle>
                  <Badge variant="outline" className="capitalize">
                    {gameData.difficulty}
                  </Badge>
                </div>
                {gameData.description && <p className="text-muted-foreground">{gameData.description}</p>}
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Question Preview</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                        disabled={currentQuestion === 0}
                      >
                        Previous
                      </Button>
                      <span className="px-3 py-1 bg-muted rounded text-sm">
                        {currentQuestion + 1} of {gameData.questions.length}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentQuestion(Math.min(gameData.questions.length - 1, currentQuestion + 1))}
                        disabled={currentQuestion === gameData.questions.length - 1}
                      >
                        Next
                      </Button>
                    </div>
                  </div>

                  {gameData.questions[currentQuestion] && (
                    <Card className="border-2">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant="secondary">Question {currentQuestion + 1}</Badge>
                          <Badge variant="outline">
                            <Clock className="w-3 h-3 mr-1" />
                            {gameData.questions[currentQuestion].timeLimit}s
                          </Badge>
                          <Badge variant="outline">
                            <Trophy className="w-3 h-3 mr-1" />
                            {gameData.questions[currentQuestion].points} pts
                          </Badge>
                        </div>

                        <h4 className="text-xl font-medium mb-6">{gameData.questions[currentQuestion].question}</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {gameData.questions[currentQuestion].answers.map((answer, index) => (
                            <div
                              key={index}
                              className={`p-4 rounded-lg border-2 transition-colors ${
                                index === gameData.questions[currentQuestion].correctAnswer
                                  ? "border-green-500 bg-green-50 text-green-800"
                                  : "border-border bg-card hover:bg-muted"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                                    index === gameData.questions[currentQuestion].correctAnswer
                                      ? "bg-green-500 text-white"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {String.fromCharCode(65 + index)}
                                </div>
                                <span>{answer}</span>
                                {index === gameData.questions[currentQuestion].correctAnswer && (
                                  <Badge variant="secondary" className="ml-auto">
                                    Correct
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Game Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Subject</span>
                  <Badge variant="outline" className="capitalize">
                    {gameData.subject}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Questions</span>
                  <span className="text-sm text-muted-foreground">{gameData.questions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Points</span>
                  <span className="text-sm text-muted-foreground">{totalPoints}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Avg. Time</span>
                  <span className="text-sm text-muted-foreground">{averageTime}s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Visibility</span>
                  <Badge variant={gameData.isPublic ? "default" : "secondary"}>
                    {gameData.isPublic ? "Public" : "Private"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ready to Publish?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your game looks great! Once you save it, players will be able to find and play your game.
                </p>
                <div className="space-y-2">
                  <Button onClick={onSave} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save & Publish Game
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Play className="w-4 h-4 mr-2" />
                    Test Play Game
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

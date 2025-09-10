"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Edit, Save, ArrowLeft, Eye } from "lucide-react"
import { QuestionBuilder } from "@/components/game-creation/question-builder"
import { GamePreview } from "@/components/game-creation/game-preview"

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

export default function CreateGamePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<"setup" | "questions" | "preview">("setup")
  const [gameData, setGameData] = useState<Partial<GameData>>({
    title: "",
    description: "",
    subject: "",
    difficulty: "medium",
    questions: [],
    isPublic: true,
  })
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [showQuestionBuilder, setShowQuestionBuilder] = useState(false)

  // Redirect if not authenticated
  if (!user) {
    router.push("/")
    return null
  }

  const handleGameInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (gameData.title && gameData.subject) {
      setCurrentStep("questions")
    }
  }

  const handleAddQuestion = (question: Question) => {
    setGameData((prev) => ({
      ...prev,
      questions: [...(prev.questions || []), question],
    }))
    setShowQuestionBuilder(false)
  }

  const handleEditQuestion = (question: Question) => {
    setGameData((prev) => ({
      ...prev,
      questions: prev.questions?.map((q) => (q.id === question.id ? question : q)) || [],
    }))
    setEditingQuestion(null)
    setShowQuestionBuilder(false)
  }

  const handleDeleteQuestion = (questionId: string) => {
    setGameData((prev) => ({
      ...prev,
      questions: prev.questions?.filter((q) => q.id !== questionId) || [],
    }))
  }

  const handleSaveGame = () => {
    const completeGameData: GameData = {
      id: Date.now().toString(),
      title: gameData.title!,
      description: gameData.description!,
      subject: gameData.subject!,
      difficulty: gameData.difficulty!,
      questions: gameData.questions!,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      isPublic: gameData.isPublic!,
    }

    // Save to localStorage (in a real app, this would be an API call)
    const existingGames = JSON.parse(localStorage.getItem("eduGame_games") || "[]")
    existingGames.push(completeGameData)
    localStorage.setItem("eduGame_games", JSON.stringify(existingGames))

    router.push("/dashboard")
  }

  if (currentStep === "setup") {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => router.push("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold">Create New Game</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Game Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGameInfoSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Game Title *</Label>
                  <Input
                    id="title"
                    value={gameData.title}
                    onChange={(e) => setGameData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter a catchy title for your game"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={gameData.description}
                    onChange={(e) => setGameData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what your game is about"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Select
                      value={gameData.subject}
                      onValueChange={(value) => setGameData((prev) => ({ ...prev, subject: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="math">Mathematics</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="geography">Geography</SelectItem>
                        <SelectItem value="art">Art</SelectItem>
                        <SelectItem value="music">Music</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={gameData.difficulty}
                      onValueChange={(value) => setGameData((prev) => ({ ...prev, difficulty: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={gameData.isPublic}
                    onChange={(e) => setGameData((prev) => ({ ...prev, isPublic: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="isPublic">Make this game public (others can find and play it)</Label>
                </div>

                <Button type="submit" className="w-full">
                  Continue to Questions
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentStep === "questions") {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => setCurrentStep("setup")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Setup
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{gameData.title}</h1>
                <p className="text-muted-foreground">Add questions to your game</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("preview")}
                disabled={!gameData.questions?.length}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handleSaveGame} disabled={!gameData.questions?.length}>
                <Save className="w-4 h-4 mr-2" />
                Save Game
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Questions ({gameData.questions?.length || 0})</CardTitle>
                  <Button onClick={() => setShowQuestionBuilder(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </CardHeader>
                <CardContent>
                  {gameData.questions?.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="mb-4">No questions added yet</p>
                      <Button onClick={() => setShowQuestionBuilder(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Question
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {gameData.questions?.map((question, index) => (
                        <Card key={question.id} className="border-l-4 border-l-primary">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="secondary">Q{index + 1}</Badge>
                                  <Badge variant="outline">{question.points} pts</Badge>
                                  <Badge variant="outline">{question.timeLimit}s</Badge>
                                </div>
                                <h4 className="font-medium mb-2">{question.question}</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  {question.answers.map((answer, answerIndex) => (
                                    <div
                                      key={answerIndex}
                                      className={`p-2 rounded ${
                                        answerIndex === question.correctAnswer
                                          ? "bg-green-100 text-green-800 border border-green-200"
                                          : "bg-muted"
                                      }`}
                                    >
                                      {answer}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingQuestion(question)
                                    setShowQuestionBuilder(true)
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteQuestion(question.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Game Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Subject</Label>
                    <p className="text-sm text-muted-foreground capitalize">{gameData.subject}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Difficulty</Label>
                    <p className="text-sm text-muted-foreground capitalize">{gameData.difficulty}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Questions</Label>
                    <p className="text-sm text-muted-foreground">{gameData.questions?.length || 0} questions</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Total Points</Label>
                    <p className="text-sm text-muted-foreground">
                      {gameData.questions?.reduce((sum, q) => sum + q.points, 0) || 0} points
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Visibility</Label>
                    <p className="text-sm text-muted-foreground">{gameData.isPublic ? "Public" : "Private"}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {showQuestionBuilder && (
          <QuestionBuilder
            question={editingQuestion}
            onSave={editingQuestion ? handleEditQuestion : handleAddQuestion}
            onCancel={() => {
              setShowQuestionBuilder(false)
              setEditingQuestion(null)
            }}
          />
        )}
      </div>
    )
  }

  if (currentStep === "preview") {
    return (
      <GamePreview gameData={gameData as GameData} onBack={() => setCurrentStep("questions")} onSave={handleSaveGame} />
    )
  }

  return null
}

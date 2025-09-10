"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, ArrowLeft, ArrowRight, RotateCcw, BookOpen } from "lucide-react"
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

interface ReviewGameModeProps {
  game: GameData
}

export function ReviewGameMode({ game }: ReviewGameModeProps) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [reviewedQuestions, setReviewedQuestions] = useState<Set<number>>(new Set())

  const currentQ = game.questions[currentQuestion]
  const isLastQuestion = currentQuestion === game.questions.length - 1
  const isFirstQuestion = currentQuestion === 0

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowExplanation(true)
    setReviewedQuestions((prev) => new Set([...prev, currentQuestion]))
  }

  const nextQuestion = () => {
    if (!isLastQuestion) {
      setCurrentQuestion((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const previousQuestion = () => {
    if (!isFirstQuestion) {
      setCurrentQuestion((prev) => prev - 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const resetQuestion = () => {
    setSelectedAnswer(null)
    setShowExplanation(false)
  }

  const goToQuestion = (questionIndex: number) => {
    setCurrentQuestion(questionIndex)
    setSelectedAnswer(null)
    setShowExplanation(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Game Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push(`/play/${game.id}`)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Badge variant="outline">
                Question {currentQuestion + 1} of {game.questions.length}
              </Badge>
              <Badge variant="secondary">{game.subject}</Badge>
              <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2">
                <BookOpen className="w-3 h-3 mr-1" />
                Review Mode
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Reviewed: {reviewedQuestions.size}/{game.questions.length}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={((currentQuestion + 1) / game.questions.length) * 100} className="h-2" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <Card className="mb-6">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <Badge variant="outline" className="mb-4 capitalize">
                    {game.difficulty}
                  </Badge>
                  <h1 className="text-3xl font-bold text-balance mb-6">{currentQ.question}</h1>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {currentQ.answers.map((answer, index) => {
                    let buttonVariant: "default" | "outline" | "destructive" | "secondary" = "outline"
                    let buttonClass = "h-auto p-6 text-lg font-medium transition-all duration-300"

                    if (showExplanation) {
                      if (index === currentQ.correctAnswer) {
                        buttonVariant = "default"
                        buttonClass += " bg-green-500 hover:bg-green-600 text-white border-green-500"
                      } else if (index === selectedAnswer && index !== currentQ.correctAnswer) {
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
                        disabled={showExplanation}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-left flex-1">{answer}</span>
                          {showExplanation && index === currentQ.correctAnswer && (
                            <CheckCircle className="w-5 h-5 text-white" />
                          )}
                          {showExplanation && index === selectedAnswer && index !== currentQ.correctAnswer && (
                            <XCircle className="w-5 h-5" />
                          )}
                        </div>
                      </Button>
                    )
                  })}
                </div>

                {showExplanation && (
                  <div className="mt-8">
                    <div
                      className={`p-4 rounded-lg mb-4 ${
                        selectedAnswer === currentQ.correctAnswer
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {selectedAnswer === currentQ.correctAnswer ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <XCircle className="w-5 h-5" />
                        )}
                        <span className="font-semibold">
                          {selectedAnswer === currentQ.correctAnswer ? "Correct!" : "Incorrect"}
                        </span>
                      </div>
                      <p>
                        The correct answer is: <strong>{currentQ.answers[currentQ.correctAnswer]}</strong>
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={resetQuestion} variant="outline">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Try Again
                      </Button>
                      <Button onClick={previousQuestion} variant="outline" disabled={isFirstQuestion}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                      <Button onClick={nextQuestion} disabled={isLastQuestion}>
                        Next Question
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {!showExplanation && selectedAnswer === null && (
                  <div className="mt-8 text-center">
                    <p className="text-muted-foreground">Select an answer to see the explanation</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold mb-4">Question Navigation</h2>
                <div className="grid grid-cols-5 lg:grid-cols-3 gap-2">
                  {game.questions.map((_, index) => (
                    <Button
                      key={index}
                      variant={index === currentQuestion ? "default" : "outline"}
                      size="sm"
                      className={`relative ${reviewedQuestions.has(index) ? "border-green-500" : ""}`}
                      onClick={() => goToQuestion(index)}
                    >
                      {index + 1}
                      {reviewedQuestions.has(index) && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
                      )}
                    </Button>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span>Reviewed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary rounded-full" />
                      <span>Current</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border border-border rounded-full" />
                      <span>Not reviewed</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

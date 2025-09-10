"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Trophy, CheckCircle, XCircle, ArrowLeft } from "lucide-react"
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

interface SoloGameModeProps {
  game: GameData
}

export function SoloGameMode({ game }: SoloGameModeProps) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(game.questions[0]?.timeLimit || 30)
  const [score, setScore] = useState(0)
  const [gamePhase, setGamePhase] = useState<"playing" | "final">("playing")
  const [answered, setAnswered] = useState(false)

  const currentQ = game.questions[currentQuestion]
  const isLastQuestion = currentQuestion === game.questions.length - 1

  // Timer effect
  useEffect(() => {
    if (gamePhase === "playing" && timeLeft > 0 && !answered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !answered) {
      handleTimeUp()
    }
  }, [timeLeft, gamePhase, answered])

  const handleTimeUp = () => {
    setAnswered(true)
    setShowResult(true)
    setTimeout(() => {
      nextQuestion()
    }, 3000)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (answered) return

    setSelectedAnswer(answerIndex)
    setAnswered(true)
    setShowResult(true)

    // Update score if correct
    if (answerIndex === currentQ.correctAnswer) {
      const pointsEarned = Math.max(currentQ.points * 0.5, currentQ.points * (timeLeft / currentQ.timeLimit))
      setScore((prev) => prev + Math.round(pointsEarned))
    }

    setTimeout(() => {
      nextQuestion()
    }, 3000)
  }

  const nextQuestion = () => {
    if (isLastQuestion) {
      setGamePhase("final")
    } else {
      setCurrentQuestion((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setTimeLeft(game.questions[currentQuestion + 1]?.timeLimit || 30)
      setAnswered(false)
    }
  }

  const restartGame = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setTimeLeft(game.questions[0]?.timeLimit || 30)
    setGamePhase("playing")
    setAnswered(false)
    setScore(0)
  }

  if (gamePhase === "final") {
    const totalPossiblePoints = game.questions.reduce((sum, q) => sum + q.points, 0)
    const percentage = Math.round((score / totalPossiblePoints) * 100)

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8 text-center">
            <div className="mb-8">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-2">Solo Game Complete!</h1>
              <p className="text-xl text-muted-foreground">
                You scored {score} out of {totalPossiblePoints} points ({percentage}%)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-2xl font-bold">{score}</div>
                <div className="text-sm text-muted-foreground">Final Score</div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-2xl font-bold">{percentage}%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={restartGame} size="lg">
                Play Again
              </Button>
              <Button variant="outline" size="lg" onClick={() => router.push(`/play/${game.id}`)}>
                Back to Modes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
              <Badge variant="outline">Solo Mode</Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-lg font-semibold">Score: {score}</div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className={`font-mono text-lg ${timeLeft <= 10 ? "text-destructive" : ""}`}>{timeLeft}s</span>
              </div>
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${timeLeft <= 10 ? "bg-destructive" : "bg-primary"}`}
                  style={{ width: `${(timeLeft / currentQ.timeLimit) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={((currentQuestion + 1) / game.questions.length) * 100} className="h-2" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
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

                if (showResult) {
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
                    disabled={answered}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-left flex-1">{answer}</span>
                      {showResult && index === currentQ.correctAnswer && <CheckCircle className="w-5 h-5 text-white" />}
                      {showResult && index === selectedAnswer && index !== currentQ.correctAnswer && (
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
                    selectedAnswer === currentQ.correctAnswer
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedAnswer === currentQ.correctAnswer ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Correct! +
                      {Math.round(Math.max(currentQ.points * 0.5, currentQ.points * (timeLeft / currentQ.timeLimit)))}{" "}
                      points
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      {selectedAnswer === null ? "Time's up!" : "Incorrect!"}
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Trash2 } from "lucide-react"

interface Question {
  id: string
  question: string
  answers: string[]
  correctAnswer: number
  timeLimit: number
  points: number
}

interface QuestionBuilderProps {
  question?: Question | null
  onSave: (question: Question) => void
  onCancel: () => void
}

export function QuestionBuilder({ question, onSave, onCancel }: QuestionBuilderProps) {
  const [formData, setFormData] = useState({
    question: "",
    answers: ["", "", "", ""],
    correctAnswer: 0,
    timeLimit: 30,
    points: 100,
  })

  useEffect(() => {
    if (question) {
      setFormData({
        question: question.question,
        answers: [...question.answers],
        correctAnswer: question.correctAnswer,
        timeLimit: question.timeLimit,
        points: question.points,
      })
    }
  }, [question])

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...formData.answers]
    newAnswers[index] = value
    setFormData((prev) => ({ ...prev, answers: newAnswers }))
  }

  const addAnswer = () => {
    if (formData.answers.length < 6) {
      setFormData((prev) => ({ ...prev, answers: [...prev.answers, ""] }))
    }
  }

  const removeAnswer = (index: number) => {
    if (formData.answers.length > 2) {
      const newAnswers = formData.answers.filter((_, i) => i !== index)
      setFormData((prev) => ({
        ...prev,
        answers: newAnswers,
        correctAnswer:
          prev.correctAnswer >= index && prev.correctAnswer > 0 ? prev.correctAnswer - 1 : prev.correctAnswer,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.question.trim()) return
    if (formData.answers.filter((a) => a.trim()).length < 2) return
    if (!formData.answers[formData.correctAnswer]?.trim()) return

    const questionData: Question = {
      id: question?.id || Date.now().toString(),
      question: formData.question.trim(),
      answers: formData.answers.filter((a) => a.trim()),
      correctAnswer: formData.correctAnswer,
      timeLimit: formData.timeLimit,
      points: formData.points,
    }

    onSave(questionData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{question ? "Edit Question" : "Add New Question"}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="question">Question *</Label>
              <Textarea
                id="question"
                value={formData.question}
                onChange={(e) => setFormData((prev) => ({ ...prev, question: e.target.value }))}
                placeholder="Enter your question here..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Answer Options *</Label>
                {formData.answers.length < 6 && (
                  <Button type="button" variant="outline" size="sm" onClick={addAnswer}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Option
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {formData.answers.map((answer, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={formData.correctAnswer === index}
                        onChange={() => setFormData((prev) => ({ ...prev, correctAnswer: index }))}
                        className="text-primary"
                      />
                      <Label className="text-sm">Correct</Label>
                    </div>
                    <Input
                      value={answer}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      placeholder={`Answer option ${index + 1}`}
                      className="flex-1"
                    />
                    {formData.answers.length > 2 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeAnswer(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeLimit">Time Limit (seconds)</Label>
                <Select
                  value={formData.timeLimit.toString()}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, timeLimit: Number.parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 seconds</SelectItem>
                    <SelectItem value="15">15 seconds</SelectItem>
                    <SelectItem value="20">20 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="45">45 seconds</SelectItem>
                    <SelectItem value="60">60 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="points">Points</Label>
                <Select
                  value={formData.points.toString()}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, points: Number.parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50 points</SelectItem>
                    <SelectItem value="100">100 points</SelectItem>
                    <SelectItem value="150">150 points</SelectItem>
                    <SelectItem value="200">200 points</SelectItem>
                    <SelectItem value="250">250 points</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                {question ? "Update Question" : "Add Question"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

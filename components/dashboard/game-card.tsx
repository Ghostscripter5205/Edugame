"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Copy, Share, Eye, EyeOff, Play, BarChart3, Calendar, Users, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

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
  plays?: number
  lastPlayed?: string
}

interface GameCardProps {
  game: GameData
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
  onToggleVisibility: () => void
  onPlay: () => void
}

export function GameCard({ game, onEdit, onDelete, onDuplicate, onToggleVisibility, onPlay }: GameCardProps) {
  const totalPoints = game.questions.reduce((sum, q) => sum + q.points, 0)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: game.title,
          text: game.description,
          url: `${window.location.origin}/game/${game.id}`,
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(`${window.location.origin}/game/${game.id}`)
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/game/${game.id}`)
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate mb-1">{game.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {game.description || "No description provided"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleVisibility}
            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {game.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="capitalize">
            {game.subject}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {game.difficulty}
          </Badge>
          <Badge variant={game.isPublic ? "default" : "secondary"}>{game.isPublic ? "Public" : "Private"}</Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
            <span>{game.questions.length} questions</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{game.plays || 0} plays</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{totalPoints} points</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{formatDistanceToNow(new Date(game.createdAt), { addSuffix: true })}</span>
          </div>
        </div>

        {game.lastPlayed && (
          <p className="text-xs text-muted-foreground mb-4">
            Last played {formatDistanceToNow(new Date(game.lastPlayed), { addSuffix: true })}
          </p>
        )}

        <div className="flex gap-2">
          <Button onClick={onPlay} size="sm" className="flex-1">
            <Play className="w-4 h-4 mr-2" />
            Play
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onDuplicate}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive bg-transparent"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

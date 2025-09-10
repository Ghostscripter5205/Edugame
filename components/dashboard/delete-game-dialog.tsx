"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"

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
  plays?: number
  lastPlayed?: string
}

interface DeleteGameDialogProps {
  game: GameData
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteGameDialog({ game, onConfirm, onCancel }: DeleteGameDialogProps) {
  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Delete Game
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{game.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">{game.title}</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• {game.questions.length} questions will be permanently deleted</p>
              <p>• {game.plays || 0} play records will be lost</p>
              {game.isPublic && <p>• Other users will no longer be able to access this game</p>}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

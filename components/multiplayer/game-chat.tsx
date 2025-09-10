"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, MessageCircle, Crown } from "lucide-react"

interface ChatMessage {
  id: string
  playerId: string
  playerName: string
  message: string
  timestamp: Date
  isHost?: boolean
  type: "message" | "reaction" | "system"
}

interface GameChatProps {
  isOpen: boolean
  onToggle: () => void
}

export function GameChat({ isOpen, onToggle }: GameChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      playerId: "system",
      playerName: "System",
      message: "Welcome to the game! Good luck everyone!",
      timestamp: new Date(Date.now() - 60000),
      type: "system",
    },
    {
      id: "2",
      playerId: "2",
      playerName: "Sarah",
      message: "Ready to play!",
      timestamp: new Date(Date.now() - 30000),
      isHost: true,
      type: "message",
    },
    {
      id: "3",
      playerId: "3",
      playerName: "Mike",
      message: "Let's do this!",
      timestamp: new Date(Date.now() - 15000),
      type: "message",
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        playerId: "1",
        playerName: "Alex",
        message: newMessage.trim(),
        timestamp: new Date(),
        type: "message",
      }
      setMessages((prev) => [...prev, message])
      setNewMessage("")
    }
  }

  const sendReaction = (reaction: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      playerId: "1",
      playerName: "Alex",
      message: reaction,
      timestamp: new Date(),
      type: "reaction",
    }
    setMessages((prev) => [...prev, message])
  }

  if (!isOpen) {
    return (
      <Button onClick={onToggle} variant="outline" size="sm" className="fixed bottom-4 right-4 z-50 bg-transparent">
        <MessageCircle className="w-4 h-4 mr-2" />
        Chat
        <Badge variant="secondary" className="ml-2">
          {messages.length}
        </Badge>
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-96 z-50 flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Game Chat
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            ×
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-3 pt-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-2 mb-3">
          {messages.map((msg) => (
            <div key={msg.id} className="text-sm">
              {msg.type === "system" ? (
                <div className="text-center text-muted-foreground italic">{msg.message}</div>
              ) : msg.type === "reaction" ? (
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {msg.playerName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{msg.playerName}</span>
                  <span className="text-lg">{msg.message}</span>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {msg.playerName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-xs">{msg.playerName}</span>
                      {msg.isHost && <Crown className="w-3 h-3 text-yellow-500" />}
                    </div>
                    <div className="text-xs text-muted-foreground break-words">{msg.message}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Reactions */}
        <div className="flex gap-1 mb-3">
          <Button variant="ghost" size="sm" className="p-1 h-8 w-8" onClick={() => sendReaction("👍")}>
            👍
          </Button>
          <Button variant="ghost" size="sm" className="p-1 h-8 w-8" onClick={() => sendReaction("❤️")}>
            ❤️
          </Button>
          <Button variant="ghost" size="sm" className="p-1 h-8 w-8" onClick={() => sendReaction("🎉")}>
            🎉
          </Button>
          <Button variant="ghost" size="sm" className="p-1 h-8 w-8" onClick={() => sendReaction("🔥")}>
            🔥
          </Button>
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className="text-sm"
          />
          <Button size="sm" onClick={sendMessage} disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

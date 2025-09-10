"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Plus, Search, Play, Users, Trophy, BookOpen } from "lucide-react"
import { GameCard } from "@/components/dashboard/game-card"
import { DeleteGameDialog } from "@/components/dashboard/delete-game-dialog"

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

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [games, setGames] = useState<GameData[]>([])
  const [filteredGames, setFilteredGames] = useState<GameData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [deleteGame, setDeleteGame] = useState<GameData | null>(null)

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      router.push("/")
      return
    }

    // Load user's games from localStorage
    const allGames = JSON.parse(localStorage.getItem("eduGame_games") || "[]")
    const userGames = allGames.filter((game: GameData) => game.createdBy === user.id)

    // Add mock play data for demonstration
    const gamesWithStats = userGames.map((game: GameData) => ({
      ...game,
      plays: Math.floor(Math.random() * 100),
      lastPlayed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    }))

    setGames(gamesWithStats)
    setFilteredGames(gamesWithStats)
  }, [user])

  useEffect(() => {
    let filtered = games

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (game) =>
          game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Subject filter
    if (subjectFilter !== "all") {
      filtered = filtered.filter((game) => game.subject === subjectFilter)
    }

    // Difficulty filter
    if (difficultyFilter !== "all") {
      filtered = filtered.filter((game) => game.difficulty === difficultyFilter)
    }

    setFilteredGames(filtered)
  }, [games, searchQuery, subjectFilter, difficultyFilter])

  const handleDeleteGame = (gameId: string) => {
    const allGames = JSON.parse(localStorage.getItem("eduGame_games") || "[]")
    const updatedGames = allGames.filter((game: GameData) => game.id !== gameId)
    localStorage.setItem("eduGame_games", JSON.stringify(updatedGames))

    setGames((prev) => prev.filter((game) => game.id !== gameId))
    setDeleteGame(null)
  }

  const handleToggleVisibility = (gameId: string) => {
    const allGames = JSON.parse(localStorage.getItem("eduGame_games") || "[]")
    const updatedGames = allGames.map((game: GameData) =>
      game.id === gameId ? { ...game, isPublic: !game.isPublic } : game,
    )
    localStorage.setItem("eduGame_games", JSON.stringify(updatedGames))

    setGames((prev) => prev.map((game) => (game.id === gameId ? { ...game, isPublic: !game.isPublic } : game)))
  }

  const handleDuplicateGame = (game: GameData) => {
    const duplicatedGame = {
      ...game,
      id: Date.now().toString(),
      title: `${game.title} (Copy)`,
      createdAt: new Date().toISOString(),
      plays: 0,
      lastPlayed: undefined,
    }

    const allGames = JSON.parse(localStorage.getItem("eduGame_games") || "[]")
    allGames.push(duplicatedGame)
    localStorage.setItem("eduGame_games", JSON.stringify(allGames))

    setGames((prev) => [duplicatedGame, ...prev])
  }

  const totalGames = games.length
  const totalPlays = games.reduce((sum, game) => sum + (game.plays || 0), 0)
  const totalQuestions = games.reduce((sum, game) => sum + game.questions.length, 0)
  const publicGames = games.filter((game) => game.isPublic).length

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Games Dashboard</h1>
            <p className="text-muted-foreground">Manage your educational games and track their performance</p>
          </div>
          <Button onClick={() => router.push("/create")}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Game
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalGames}</p>
                  <p className="text-sm text-muted-foreground">Total Games</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center">
                  <Play className="w-6 h-6 text-chart-2" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalPlays}</p>
                  <p className="text-sm text-muted-foreground">Total Plays</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-chart-3" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalQuestions}</p>
                  <p className="text-sm text-muted-foreground">Questions Created</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-chart-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{publicGames}</p>
                  <p className="text-sm text-muted-foreground">Public Games</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search games..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
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
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Games Grid */}
        {filteredGames.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {games.length === 0 ? "No games created yet" : "No games match your filters"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {games.length === 0
                  ? "Create your first educational game to get started!"
                  : "Try adjusting your search or filter criteria."}
              </p>
              {games.length === 0 && (
                <Button onClick={() => router.push("/create")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Game
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onEdit={() => router.push(`/create?edit=${game.id}`)}
                onDelete={() => setDeleteGame(game)}
                onDuplicate={() => handleDuplicateGame(game)}
                onToggleVisibility={() => handleToggleVisibility(game.id)}
                onPlay={() => router.push(`/game/${game.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {deleteGame && (
        <DeleteGameDialog
          game={deleteGame}
          onConfirm={() => handleDeleteGame(deleteGame.id)}
          onCancel={() => setDeleteGame(null)}
        />
      )}
    </div>
  )
}

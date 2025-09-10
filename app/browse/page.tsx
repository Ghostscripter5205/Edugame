"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Play, Users, BookOpen, Clock, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

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
  rating?: number
}

export default function BrowseGamesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [games, setGames] = useState<GameData[]>([])
  const [filteredGames, setFilteredGames] = useState<GameData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")

  useEffect(() => {
    // Load public games from localStorage
    const allGames = JSON.parse(localStorage.getItem("eduGame_games") || "[]")
    const publicGames = allGames.filter((game: GameData) => game.isPublic)

    // Add some sample games if none exist
    if (publicGames.length === 0) {
      const sampleGames = [
        {
          id: "sample-1",
          title: "Basic Math Quiz",
          description: "Test your knowledge of basic arithmetic operations",
          subject: "mathematics",
          difficulty: "easy",
          questions: Array(10)
            .fill(null)
            .map((_, i) => ({
              id: i + 1,
              question: `What is ${i + 1} + ${i + 2}?`,
              options: [`${i + 3}`, `${i + 2}`, `${i + 4}`, `${i + 1}`],
              correctAnswer: 0,
              timeLimit: 30,
              points: 100,
            })),
          createdBy: "EduGame",
          createdAt: new Date().toISOString(),
          isPublic: true,
          plays: 1250,
          rating: 4.8,
        },
        {
          id: "sample-2",
          title: "World Geography",
          description: "Explore countries, capitals, and landmarks around the world",
          subject: "geography",
          difficulty: "medium",
          questions: Array(15)
            .fill(null)
            .map((_, i) => ({
              id: i + 1,
              question: `Geography question ${i + 1}`,
              options: ["Option A", "Option B", "Option C", "Option D"],
              correctAnswer: 0,
              timeLimit: 45,
              points: 150,
            })),
          createdBy: "EduGame",
          createdAt: new Date().toISOString(),
          isPublic: true,
          plays: 890,
          rating: 4.6,
        },
        {
          id: "sample-3",
          title: "Science Fundamentals",
          description: "Basic concepts in physics, chemistry, and biology",
          subject: "science",
          difficulty: "medium",
          questions: Array(12)
            .fill(null)
            .map((_, i) => ({
              id: i + 1,
              question: `Science question ${i + 1}`,
              options: ["Option A", "Option B", "Option C", "Option D"],
              correctAnswer: 0,
              timeLimit: 40,
              points: 120,
            })),
          createdBy: "EduGame",
          createdAt: new Date().toISOString(),
          isPublic: true,
          plays: 567,
          rating: 4.7,
        },
      ]

      const updatedGames = [...allGames, ...sampleGames]
      localStorage.setItem("eduGame_games", JSON.stringify(updatedGames))
      setGames([...publicGames, ...sampleGames])
    } else {
      setGames(publicGames)
    }
  }, [])

  useEffect(() => {
    let filtered = games

    if (searchTerm) {
      filtered = filtered.filter(
        (game) =>
          game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          game.subject.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (subjectFilter !== "all") {
      filtered = filtered.filter((game) => game.subject === subjectFilter)
    }

    if (difficultyFilter !== "all") {
      filtered = filtered.filter((game) => game.difficulty === difficultyFilter)
    }

    setFilteredGames(filtered)
  }, [games, searchTerm, subjectFilter, difficultyFilter])

  const playGame = (game: GameData) => {
    router.push(`/play/${game.id}`)
  }

  const joinRandomGame = () => {
    router.push("/lobby")
  }

  const createGame = () => {
    if (user) {
      router.push("/create")
    } else {
      // Handle login required
    }
  }

  const subjects = [...new Set(games.map((game) => game.subject))]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.push("/")}>
              <BookOpen className="w-5 h-5 mr-2" />
              EduGame
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={joinRandomGame}>
              <Users className="w-4 h-4 mr-2" />
              Join Game
            </Button>
            <Button onClick={createGame}>
              <Play className="w-4 h-4 mr-2" />
              Create Game
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Discover Educational Games</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from thousands of educational games created by teachers and students worldwide
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject} className="capitalize">
                  {subject}
                </SelectItem>
              ))}
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

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <Card key={game.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{game.title}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">{game.description}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary" className="capitalize">
                    {game.subject}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {game.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {game.questions.length} questions
                    </span>
                    {game.plays && (
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {game.plays} plays
                      </span>
                    )}
                  </div>
                  {game.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{game.rating}</span>
                    </div>
                  )}
                </div>
                <Button onClick={() => playGame(game)} className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Play Game
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No games found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

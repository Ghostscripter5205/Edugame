"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  Database,
  Users,
  PaintRoller as GameController2,
  Settings,
  Trash2,
  Eye,
  Code,
} from "lucide-react"

export default function DevPanel() {
  const { user } = useAuth()
  const router = useRouter()
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [allGames, setAllGames] = useState<any[]>([])
  const [gameSessions, setGameSessions] = useState<any[]>([])
  const [systemStats, setSystemStats] = useState<any>({})

  const isDeveloper = user && (user.username === "The_dev01" || user.username === "The_dev02")

  useEffect(() => {
    if (!isDeveloper) {
      router.push("/")
      return
    }

    loadSystemData()
  }, [isDeveloper, router])

  const loadSystemData = () => {
    // Load users
    const users = JSON.parse(localStorage.getItem("eduGame_users") || "[]")
    setAllUsers(users)

    // Load games
    const games = JSON.parse(localStorage.getItem("eduGame_games") || "[]")
    setAllGames(games)

    // Load active game sessions
    const sessions = Object.keys(localStorage)
      .filter((key) => key.startsWith("gameSession_"))
      .map((key) => ({
        key,
        ...JSON.parse(localStorage.getItem(key) || "{}"),
      }))
    setGameSessions(sessions)

    // Calculate system stats
    setSystemStats({
      totalUsers: users.length,
      totalGames: games.length,
      activeSessions: sessions.length,
      totalQuestions: games.reduce((acc: number, game: any) => acc + (game.questions?.length || 0), 0),
      storageUsed: JSON.stringify(localStorage).length,
    })
  }

  const clearAllData = () => {
    if (confirm("⚠️ This will delete ALL user data, games, and sessions. Are you sure?")) {
      localStorage.clear()
      loadSystemData()
      alert("All data cleared!")
    }
  }

  const deleteUser = (userId: string) => {
    if (confirm("Delete this user and all their games?")) {
      const users = allUsers.filter((u) => u.id !== userId)
      localStorage.setItem("eduGame_users", JSON.stringify(users))

      // Also delete their games
      const games = allGames.filter((g) => g.createdBy !== userId)
      localStorage.setItem("eduGame_games", JSON.stringify(games))

      loadSystemData()
    }
  }

  const deleteGame = (gameId: string) => {
    if (confirm("Delete this game?")) {
      const games = allGames.filter((g) => g.id !== gameId)
      localStorage.setItem("eduGame_games", JSON.stringify(games))
      loadSystemData()
    }
  }

  const endGameSession = (sessionKey: string) => {
    localStorage.removeItem(sessionKey)
    loadSystemData()
  }

  if (!isDeveloper) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Access Denied
            </CardTitle>
            <CardDescription>This developer panel is restricted to authorized developers only.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Developer Panel</h1>
          <p className="text-gray-600">Welcome, {user.username}! System administration and debugging tools.</p>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{systemStats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <GameController2 className="h-4 w-4 text-emerald-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Games</p>
                  <p className="text-2xl font-bold">{systemStats.totalGames}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Active Sessions</p>
                  <p className="text-2xl font-bold">{systemStats.activeSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Questions</p>
                  <p className="text-2xl font-bold">{systemStats.totalQuestions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Storage (KB)</p>
                  <p className="text-2xl font-bold">{Math.round(systemStats.storageUsed / 1024)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="games">Games</TabsTrigger>
            <TabsTrigger value="sessions">Live Sessions</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">
                          Created: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.username.includes("dev") ? "default" : "secondary"}>
                          {user.username.includes("dev") ? "Developer" : "User"}
                        </Badge>
                        <Button variant="destructive" size="sm" onClick={() => deleteUser(user.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="games" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Game Management</CardTitle>
                <CardDescription>View and manage all created games</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allGames.map((game) => (
                    <div key={game.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{game.title}</p>
                        <p className="text-sm text-gray-600">{game.description}</p>
                        <p className="text-xs text-gray-500">
                          {game.questions?.length || 0} questions • Created:{" "}
                          {new Date(game.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={game.isPublic ? "default" : "secondary"}>
                          {game.isPublic ? "Public" : "Private"}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => router.push(`/play/${game.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteGame(game.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Live Game Sessions</CardTitle>
                <CardDescription>Monitor and manage active multiplayer sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gameSessions.map((session) => (
                    <div key={session.key} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Game Code: {session.gameCode}</p>
                        <p className="text-sm text-gray-600">
                          Players: {session.players?.length || 0} • Host: {session.hostName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Status: {session.status} • Game ID: {session.gameId}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={session.status === "waiting" ? "secondary" : "default"}>{session.status}</Badge>
                        <Button variant="destructive" size="sm" onClick={() => endGameSession(session.key)}>
                          End Session
                        </Button>
                      </div>
                    </div>
                  ))}
                  {gameSessions.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No active game sessions</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Administration</CardTitle>
                <CardDescription>Dangerous operations - use with caution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h3 className="font-medium text-red-800 mb-2">Danger Zone</h3>
                  <p className="text-sm text-red-600 mb-4">These actions cannot be undone and will affect all users.</p>
                  <Button variant="destructive" onClick={clearAllData} className="w-full">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Clear All Data
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">System Information</h3>
                  <div className="text-sm space-y-1">
                    <p>Storage Used: {Math.round(systemStats.storageUsed / 1024)} KB</p>
                    <p>Browser: {navigator.userAgent}</p>
                    <p>Platform: {navigator.platform}</p>
                    <p>Last Refresh: {new Date().toLocaleString()}</p>
                  </div>
                  <Button variant="outline" onClick={loadSystemData} className="mt-4 bg-transparent">
                    Refresh Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

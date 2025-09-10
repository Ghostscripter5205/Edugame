"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Crown,
  Shield,
  Users,
  Database,
  Settings,
  Trash2,
  Eye,
  EyeOff,
  Ban,
  AlertTriangle,
  Activity,
  BarChart3,
  Unlock,
  UserX,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function OwnerPanelPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [games, setGames] = useState<any[]>([])
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    totalGames: 0,
    totalPlays: 0,
    activeGames: 0,
    bannedUsers: 0,
    reportedContent: 0,
  })

  // Redirect if not owner
  useEffect(() => {
    if (!user || user.username !== "The_dev01") {
      router.push("/")
      return
    }
  }, [user, router])

  useEffect(() => {
    if (user?.username === "The_dev01") {
      loadSystemData()
    }
  }, [user])

  const loadSystemData = () => {
    // Load all users
    const allUsers = JSON.parse(localStorage.getItem("eduGame_users") || "[]")
    setUsers(allUsers)

    // Load all games
    const allGames = JSON.parse(localStorage.getItem("eduGame_games") || "[]")
    setGames(allGames)

    // Calculate system stats
    const activeSessions = Object.keys(localStorage).filter((key) => key.startsWith("gameSession_")).length
    const bannedUsers = allUsers.filter((u: any) => u.banned).length

    setSystemStats({
      totalUsers: allUsers.length,
      totalGames: allGames.length,
      totalPlays: allGames.reduce((sum: number, game: any) => sum + (game.plays || 0), 0),
      activeGames: activeSessions,
      bannedUsers,
      reportedContent: 0,
    })
  }

  const banUser = (userId: string) => {
    const updatedUsers = users.map((u) =>
      u.id === userId ? { ...u, banned: true, bannedAt: new Date().toISOString() } : u,
    )
    setUsers(updatedUsers)
    localStorage.setItem("eduGame_users", JSON.stringify(updatedUsers))
    loadSystemData()
  }

  const unbanUser = (userId: string) => {
    const updatedUsers = users.map((u) => (u.id === userId ? { ...u, banned: false, bannedAt: null } : u))
    setUsers(updatedUsers)
    localStorage.setItem("eduGame_users", JSON.stringify(updatedUsers))
    loadSystemData()
  }

  const deleteGame = (gameId: string) => {
    const updatedGames = games.filter((g) => g.id !== gameId)
    setGames(updatedGames)
    localStorage.setItem("eduGame_games", JSON.stringify(updatedGames))
    loadSystemData()
  }

  const toggleGameVisibility = (gameId: string) => {
    const updatedGames = games.map((g) => (g.id === gameId ? { ...g, isPublic: !g.isPublic } : g))
    setGames(updatedGames)
    localStorage.setItem("eduGame_games", JSON.stringify(updatedGames))
  }

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear ALL system data? This cannot be undone!")) {
      localStorage.clear()
      setUsers([])
      setGames([])
      setSystemStats({
        totalUsers: 0,
        totalGames: 0,
        totalPlays: 0,
        activeGames: 0,
        bannedUsers: 0,
        reportedContent: 0,
      })
    }
  }

  const exportSystemData = () => {
    const systemData = {
      users,
      games,
      stats: systemStats,
      exportedAt: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(systemData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `edugame-system-export-${new Date().toISOString().split("T")[0]}.json`
    link.click()

    URL.revokeObjectURL(url)
  }

  if (!user || user.username !== "The_dev01") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">Owner privileges required</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-500" />
            <span className="text-2xl font-bold">Owner Panel</span>
            <Badge variant="destructive">SYSTEM ADMIN</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.push("/dev")}>
              <Settings className="w-4 h-4 mr-2" />
              Dev Panel
            </Button>
            <Button variant="outline" onClick={() => router.push("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* System Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Database className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{systemStats.totalGames}</div>
              <div className="text-sm text-muted-foreground">Total Games</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{systemStats.totalPlays}</div>
              <div className="text-sm text-muted-foreground">Total Plays</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Activity className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{systemStats.activeGames}</div>
              <div className="text-sm text-muted-foreground">Active Games</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <UserX className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{systemStats.bannedUsers}</div>
              <div className="text-sm text-muted-foreground">Banned Users</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{systemStats.reportedContent}</div>
              <div className="text-sm text-muted-foreground">Reports</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="games">Game Management</TabsTrigger>
            <TabsTrigger value="system">System Control</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{user.username}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                          <div className="text-xs text-muted-foreground">
                            Joined: {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        {user.banned && <Badge variant="destructive">Banned</Badge>}
                      </div>
                      <div className="flex items-center gap-2">
                        {user.banned ? (
                          <Button variant="outline" size="sm" onClick={() => unbanUser(user.id)}>
                            <Unlock className="w-4 h-4 mr-2" />
                            Unban
                          </Button>
                        ) : (
                          <Button variant="destructive" size="sm" onClick={() => banUser(user.id)}>
                            <Ban className="w-4 h-4 mr-2" />
                            Ban
                          </Button>
                        )}
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
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {games.map((game) => (
                    <div key={game.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{game.title}</h3>
                          <Badge variant={game.isPublic ? "default" : "secondary"}>
                            {game.isPublic ? "Public" : "Private"}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {game.subject}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{game.description}</p>
                        <div className="text-xs text-muted-foreground">
                          Created by: {game.createdBy} • {game.questions.length} questions • {game.plays || 0} plays
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => toggleGameVisibility(game.id)}>
                          {game.isPublic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteGame(game.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="destructive" onClick={clearAllData} className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All System Data
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    This will permanently delete all users, games, and system data. This action cannot be undone.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={exportSystemData} className="w-full">
                    <Database className="w-4 h-4 mr-2" />
                    Export System Data
                  </Button>
                  <Button onClick={loadSystemData} variant="outline" className="w-full bg-transparent">
                    <Activity className="w-4 h-4 mr-2" />
                    Refresh System Stats
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                  <p className="text-muted-foreground">Detailed analytics and reporting features coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

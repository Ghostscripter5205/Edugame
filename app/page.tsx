"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Users, Trophy, BookOpen, Zap, Star, LogOut } from "lucide-react"
import { LoginDialog } from "@/components/auth/login-dialog"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleJoinGame = () => {
    router.push("/lobby")
  }

  const handleCreateGame = () => {
    if (user) {
      router.push("/create")
    }
  }

  const handleStartPlaying = () => {
    router.push("/browse")
  }

  const handleLogoClick = () => {
    if (user && user.username === "The_dev01") {
      router.push("/owner")
    } else if (user && user.username === "The_dev02") {
      router.push("/dev")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 bg-primary rounded-lg flex items-center justify-center ${
                user && (user.username === "The_dev01" || user.username === "The_dev02")
                  ? "cursor-pointer hover:bg-primary/80 transition-colors"
                  : ""
              }`}
              onClick={handleLogoClick}
              title={
                user && user.username === "The_dev01"
                  ? "Access Owner Panel"
                  : user && user.username === "The_dev02"
                    ? "Access Developer Panel"
                    : ""
              }
            >
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-primary">EduGame</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#games" className="text-muted-foreground hover:text-foreground transition-colors">
              Games
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleJoinGame}>
              <Play className="w-4 h-4 mr-2" />
              Join a Game
            </Button>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Welcome, {user.username}!</span>
                <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
                  Dashboard
                </Button>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <LoginDialog>
                <Button size="sm">Log In</Button>
              </LoginDialog>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-balance mb-6">
              Fun, free, educational
              <span className="text-primary block">games for everyone!</span>
            </h1>

            <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
              Transform learning into an adventure with interactive quiz games, multiplayer challenges, and engaging
              educational content.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="text-lg px-8 py-6" onClick={handleStartPlaying}>
                <Play className="w-5 h-5 mr-2" />
                Start Playing Now
              </Button>
              {user ? (
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 bg-transparent"
                  onClick={handleCreateGame}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Create a Game
                </Button>
              ) : (
                <LoginDialog>
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
                    <Users className="w-5 h-5 mr-2" />
                    Create a Game
                  </Button>
                </LoginDialog>
              )}
            </div>

            {/* Character Illustrations */}
            <div className="flex justify-center items-end gap-8 mb-16">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-chart-1 to-chart-2 rounded-full flex items-center justify-center shadow-lg">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-chart-3 rounded-full flex items-center justify-center">
                  <Star className="w-3 h-3 text-white" />
                </div>
              </div>

              <div className="relative transform -translate-y-4">
                <div className="w-32 h-32 bg-gradient-to-br from-chart-2 to-chart-4 rounded-full flex items-center justify-center shadow-xl">
                  <Trophy className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-chart-5 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-chart-4 to-chart-5 rounded-full flex items-center justify-center shadow-lg">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-chart-1 rounded-full flex items-center justify-center">
                  <Play className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose EduGame?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the features that make learning fun and engaging for students of all ages.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Interactive Gameplay</h3>
                <p className="text-muted-foreground">
                  Engage students with dynamic quiz games and interactive challenges that make learning memorable.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Multiplayer Fun</h3>
                <p className="text-muted-foreground">
                  Connect with friends and classmates in real-time multiplayer games that promote collaboration.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-chart-3/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-chart-3" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Achievement System</h3>
                <p className="text-muted-foreground">
                  Earn badges, climb leaderboards, and unlock rewards as you progress through educational content.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-chart-4/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-chart-4" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Rich Content Library</h3>
                <p className="text-muted-foreground">
                  Access thousands of questions across multiple subjects and grade levels.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-chart-5/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-chart-5" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Instant Feedback</h3>
                <p className="text-muted-foreground">
                  Get immediate results and explanations to help reinforce learning concepts.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Free to Play</h3>
                <p className="text-muted-foreground">
                  Enjoy unlimited access to educational games without any cost or subscription fees.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Learning?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of educators and students who are already making learning fun with EduGame.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6" onClick={handleStartPlaying}>
                <Play className="w-5 h-5 mr-2" />
                Get Started Free
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-primary">EduGame</span>
            </div>

            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2024 EduGame. Making learning fun for everyone.
          </div>
        </div>
      </footer>
    </div>
  )
}

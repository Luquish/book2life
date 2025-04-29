"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MoveRight, Sparkles, BookOpen, Palette, ImageIcon } from "lucide-react"
import { Stars } from "@/components/Stars"

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Stars count={50} />
      </div>

      {/* Header */}
      <header className="container mx-auto pt-6 px-4">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-300" />
            <span className="text-xl font-bold">Book2life</span>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="ghost" 
              className="text-white hover:text-yellow-300"
              onClick={() => router.push('/about')}
            >
              About
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:text-yellow-300"
              onClick={() => router.push('/gallery')}
            >
              Gallery
            </Button>
            <Button 
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              onClick={() => router.push('/create')}
            >
              Create Now
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-20 pb-32">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-6">
            <div className="relative">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Transform Your Stories Into{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-300">
                  Magical Illustrations
                </span>
              </h1>
              <div className="absolute -top-6 -right-6 animate-float">
                <Sparkles className="h-12 w-12 text-yellow-300" />
              </div>
            </div>

            <p className="text-lg text-purple-100">
              Upload your story and watch as our AI brings your words to life with beautiful, custom illustrations in
              various artistic styles.
            </p>

            <div className="pt-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 group"
                onClick={() => router.push('/create')}
              >
                Start Creating
                <MoveRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>

          <div className="md:w-1/2 relative">
            <div className="relative z-10 rounded-lg overflow-hidden shadow-2xl transform transition-transform hover:scale-105 duration-500">
              <img
                src="/The-dragon.png"
                alt="Book illustration example"
                className="w-auto h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent flex items-end">
                <div className="p-6">
                  <p className="text-white font-medium">
                    "The dragon soared through the starlit sky, its scales shimmering like diamonds..."
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-10 -left-10 z-0 w-40 h-40 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -top-10 -right-10 z-0 w-40 h-40 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl pointer-events-none"></div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/0 via-indigo-900/50 to-blue-900/0 pointer-events-none"></div>

        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-300">
              How the Magic Works
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-indigo-800/30 backdrop-blur-sm p-8 rounded-xl border border-indigo-700/50 transform transition-transform hover:scale-105 duration-300">
              <div className="bg-gradient-to-br from-pink-500 to-purple-500 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Upload Your Story</h3>
              <p className="text-purple-100">
                Share your story with us, whether it's a short tale or a chapter from your book.
              </p>
            </div>

            <div className="bg-indigo-800/30 backdrop-blur-sm p-8 rounded-xl border border-indigo-700/50 transform transition-transform hover:scale-105 duration-300">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <Palette className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Choose Your Style</h3>
              <p className="text-purple-100">
                Select from various artistic styles like storybook, watercolor, manga, pixel art, and more.
              </p>
            </div>

            <div className="bg-indigo-800/30 backdrop-blur-sm p-8 rounded-xl border border-indigo-700/50 transform transition-transform hover:scale-105 duration-300">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <ImageIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">See It Come to Life</h3>
              <p className="text-purple-100">
                Watch as our AI transforms your words into beautiful illustrations that capture the essence of your
                story.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-indigo-800/50">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Sparkles className="h-5 w-5 text-yellow-300" />
            <span className="font-bold">Book2life</span>
          </div>
          <div className="text-sm text-purple-200">© {new Date().getFullYear()} Book2life. All rights reserved.</div>
        </div>
      </footer>

      {/* Global styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

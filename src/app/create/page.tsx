"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { StyleSelector } from "@/components/style-selector"
import { useToast } from "@/hooks/use-toast"
import { Stars } from "@/components/Stars"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

import { BookOpen, Sparkles, ArrowLeft, Wand2, Loader2, Palette, ImageIcon } from "lucide-react"

export default function CreatePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [story, setStory] = useState("")
  const [selectedStyle, setSelectedStyle] = useState("storybook")
  const [maxImages, setMaxImages] = useState(6)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("write")
  
  // Nuevos estados para las opciones de imagen
  const [imageOptions, setImageOptions] = useState({
    model: "dall-e-2",
    size: "1024x1024",
    style: "vivid",
    quality: "standard",
    background: "auto",
    moderation: "auto",
    output_compression: 100,
    output_format: "png",
  })

  const [progress, setProgress] = useState(0)
  const [generationStatus, setGenerationStatus] = useState("")
  const [showProgress, setShowProgress] = useState(false)

  const handleSubmit = async () => {
    if (!story.trim()) {
      toast({
        title: "Story required",
        description: "Please enter your story before continuing.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setShowProgress(true)
    setProgress(0)
    setGenerationStatus("Analizando la historia...")

    try {
      // Simular progreso de análisis
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProgress(20)
      setGenerationStatus("Segmentando la historia en escenas...")
      
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          story,
          style: selectedStyle,
          maxImages,
          imageOptions,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate illustrations")
      }

      // Simular progreso de generación
      const data = await response.json()
      const totalImages = data.pages.length
      const progressPerImage = (80 / totalImages)

      for (let i = 0; i < totalImages; i++) {
        setProgress(20 + (progressPerImage * (i + 1)))
        setGenerationStatus(`Generando ilustración ${i + 1} de ${totalImages}...`)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      setProgress(100)
      setGenerationStatus("¡Libro completado!")
      await new Promise(resolve => setTimeout(resolve, 500))

      // Store the result in localStorage
      localStorage.setItem("bookResults", JSON.stringify(data))
      router.push("/results")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setShowProgress(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Stars count={30} />
      </div>

      {/* Header */}
      <header className="container mx-auto pt-6 px-4">
        <nav className="flex justify-between items-center">
          <Button
            variant="ghost"
            className="text-white hover:text-yellow-300 flex items-center gap-2"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-300" />
            <span className="text-xl font-bold">Book2life</span>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-300">
            Create Your Illustrated Story
          </span>
        </h1>

        <Card className="max-w-4xl mx-auto bg-indigo-800/30 backdrop-blur-sm border-indigo-700/50">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8 bg-indigo-950/50">
                <TabsTrigger
                  value="write"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Write Story
                </TabsTrigger>
                <TabsTrigger
                  value="style"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500"
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Choose Style
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="write" className="mt-0">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Enter Your Story</h2>
                  <p className="text-purple-200">
                    Write or paste your story below. Our AI will transform it into beautiful illustrations.
                  </p>
                  <Textarea
                    placeholder="Once upon a time in a magical forest..."
                    className="min-h-[300px] bg-indigo-950/50 border-indigo-700/50 text-white placeholder:text-indigo-300/70"
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={() => setActiveTab("style")}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                    >
                      Next: Choose Style
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="style" className="mt-0">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Select Illustration Style</h2>
                  <p className="text-purple-200">Choose the artistic style for your story illustrations.</p>

                  <StyleSelector selectedStyle={selectedStyle} onSelectStyle={setSelectedStyle} />

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("write")}
                      className="border-indigo-500 text-white hover:bg-indigo-800/50"
                    >
                      Back: Story
                    </Button>
                    <Button
                      onClick={() => setActiveTab("settings")}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                    >
                      Next: Settings
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="mt-0">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Illustration Settings</h2>
                    <p className="text-purple-200">Customize how many illustrations you want for your story.</p>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Number of Illustrations</span>
                        <span className="font-semibold">{maxImages}</span>
                      </div>
                      <Slider
                        value={[maxImages]}
                        min={1}
                        max={10}
                        step={1}
                        onValueChange={(value: number[]) => setMaxImages(value[0])}
                        className="py-4"
                      />
                    </div>

                    <div className="space-y-4 pt-6">
                      <h3 className="text-lg font-semibold">Image Generation Options</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Model</label>
                          <select
                            className="w-full bg-indigo-950/50 border-indigo-700/50 rounded-md"
                            value={imageOptions.model}
                            onChange={(e) => setImageOptions({...imageOptions, model: e.target.value})}
                          >
                            <option value="dall-e-2">DALL-E 2</option>
                            <option value="dall-e-3">DALL-E 3</option>
                            <option value="gpt-image-1">GPT-4V</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Size</label>
                          <select
                            className="w-full bg-indigo-950/50 border-indigo-700/50 rounded-md"
                            value={imageOptions.size}
                            onChange={(e) => setImageOptions({...imageOptions, size: e.target.value})}
                          >
                            <option value="1024x1024">1024x1024 (Square)</option>
                            <option value="1536x1024">1536x1024 (Landscape)</option>
                            <option value="1024x1536">1024x1536 (Portrait)</option>
                          </select>
                        </div>

                        {imageOptions.model === 'dall-e-3' && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Style</label>
                            <select
                              className="w-full bg-indigo-950/50 border-indigo-700/50 rounded-md"
                              value={imageOptions.style}
                              onChange={(e) => setImageOptions({...imageOptions, style: e.target.value})}
                            >
                              <option value="vivid">Vivid</option>
                              <option value="natural">Natural</option>
                            </select>
                          </div>
                        )}

                        {imageOptions.model === 'gpt-image-1' && (
                          <>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Background</label>
                              <select
                                className="w-full bg-indigo-950/50 border-indigo-700/50 rounded-md"
                                value={imageOptions.background}
                                onChange={(e) => setImageOptions({...imageOptions, background: e.target.value})}
                              >
                                <option value="auto">Auto</option>
                                <option value="transparent">Transparent</option>
                                <option value="opaque">Opaque</option>
                              </select>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium">Output Format</label>
                              <select
                                className="w-full bg-indigo-950/50 border-indigo-700/50 rounded-md"
                                value={imageOptions.output_format}
                                onChange={(e) => setImageOptions({...imageOptions, output_format: e.target.value})}
                              >
                                <option value="png">PNG</option>
                                <option value="jpeg">JPEG</option>
                                <option value="webp">WebP</option>
                              </select>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium">Quality</label>
                              <select
                                className="w-full bg-indigo-950/50 border-indigo-700/50 rounded-md"
                                value={imageOptions.quality}
                                onChange={(e) => setImageOptions({...imageOptions, quality: e.target.value})}
                              >
                                <option value="auto">Auto</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                              </select>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium">Compression ({imageOptions.output_compression}%)</label>
                              <Slider
                                value={[imageOptions.output_compression]}
                                min={0}
                                max={100}
                                step={1}
                                onValueChange={(value) => setImageOptions({...imageOptions, output_compression: value[0]})}
                                className="py-4"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("style")}
                      className="border-indigo-500 text-white hover:bg-indigo-800/50"
                    >
                      Back: Style
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Magic...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-4 w-4" />
                          Create Illustrations
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Progress Dialog */}
      <Dialog open={showProgress} onOpenChange={setShowProgress}>
        <DialogContent className="sm:max-w-md bg-indigo-900 border-indigo-700/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center text-white">
              Creando tu libro ilustrado
            </DialogTitle>
            <DialogDescription className="text-center text-purple-200">
              {generationStatus}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <Progress value={progress} className="h-2 bg-indigo-950" />
            
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

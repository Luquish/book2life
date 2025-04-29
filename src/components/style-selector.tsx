"use client"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StyleOption {
  id: string
  name: string
  description: string
  previewColor: string
}

interface StyleSelectorProps {
  selectedStyle: string
  onSelectStyle: (style: string) => void
}

const styleOptions: StyleOption[] = [
  {
    id: "storybook",
    name: "Storybook",
    description: "Whimsical storybook illustration with soft pastel colors and ink outlines",
    previewColor: "from-pink-400 to-purple-300",
  },
  {
    id: "watercolor",
    name: "Watercolor",
    description: "Delicate watercolor painting with vibrant washes and subtle gradients",
    previewColor: "from-blue-400 to-teal-300",
  },
  {
    id: "manga",
    name: "Manga",
    description: "Black-and-white manga panel with dynamic lines and cinematic angles",
    previewColor: "from-gray-700 to-gray-500",
  },
  {
    id: "pixel",
    name: "Pixel Art",
    description: "Retro pixel-art style with limited color palette and crisp pixels",
    previewColor: "from-indigo-500 to-purple-400",
  },
  {
    id: "lowpoly",
    name: "Low Poly",
    description: "Low-poly 3D render with bright polygons and minimal details",
    previewColor: "from-green-400 to-emerald-300",
  },
  {
    id: "realistic",
    name: "Realistic",
    description: "Hyper-realistic digital art with cinematic lighting and detailed textures",
    previewColor: "from-amber-500 to-orange-400",
  },
]

export function StyleSelector({ selectedStyle, onSelectStyle }: StyleSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {styleOptions.map((style) => (
        <Card
          key={style.id}
          className={cn(
            "cursor-pointer transition-all duration-300 transform hover:scale-105 overflow-hidden",
            selectedStyle === style.id
              ? "ring-2 ring-pink-500 bg-indigo-800/50"
              : "bg-indigo-950/50 hover:bg-indigo-900/50",
          )}
          onClick={() => onSelectStyle(style.id)}
        >
          <div className={cn("h-32 bg-gradient-to-br", style.previewColor)} />
          <CardContent className="p-4">
            <h3 className="font-bold mb-1">{style.name}</h3>
            <p className="text-sm text-purple-200">{style.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Download, Share } from "lucide-react"
import Image from "next/image"

interface BookPage {
  image_path: string;
  image_type: 'url' | 'base64';
  text: string;
}

function ImageDisplay({ page, index }: { page: BookPage; index: number }) {
  const [base64Data, setBase64Data] = useState<string>("");

  useEffect(() => {
    async function loadBase64Data() {
      if (page.image_type === 'base64') {
        try {
          // Cargar el contenido del archivo .b64
          const response = await fetch(`${page.image_path}.b64`);
          const data = await response.text();
          setBase64Data(data);
        } catch (error) {
          console.error('Error loading base64 data:', error);
        }
      }
    }

    if (page.image_type === 'base64') {
      loadBase64Data();
    }
  }, [page]);

  if (page.image_type === 'base64' && base64Data) {
    return (
      <div className="relative aspect-square">
        <img
          src={`data:image/png;base64,${base64Data}`}
          alt={`Ilustración ${index + 1}`}
          className="rounded-lg object-cover w-full h-full"
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-square">
      <Image
        src={page.image_path}
        alt={`Ilustración ${index + 1}`}
        fill
        className="rounded-lg object-cover"
      />
    </div>
  );
}

export default function ResultsPage() {
  const router = useRouter()
  const [pages, setPages] = useState<BookPage[]>([])

  useEffect(() => {
    const results = localStorage.getItem("bookResults")
    if (results) {
      const data = JSON.parse(results)
      setPages(data.pages || [])
    }
  }, [])

  if (pages.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">No hay resultados disponibles</h1>
          <Button
            onClick={() => router.push("/create")}
            className="bg-gradient-to-r from-pink-500 to-purple-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a crear
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={() => router.push("/create")}
            variant="ghost"
            className="text-white hover:text-yellow-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Crear otro libro
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-indigo-500 text-white hover:bg-indigo-800/50"
              onClick={() => {/* Implementar compartir */}}
            >
              <Share className="mr-2 h-4 w-4" />
              Compartir
            </Button>
            <Button
              variant="outline"
              className="border-indigo-500 text-white hover:bg-indigo-800/50"
              onClick={() => {/* Implementar descarga */}}
            >
              <Download className="mr-2 h-4 w-4" />
              Descargar PDF
            </Button>
          </div>
        </div>

        <div className="grid gap-8">
          {pages.map((page, index) => (
            <Card key={index} className="bg-indigo-800/30 backdrop-blur-sm border-indigo-700/50">
              <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <ImageDisplay page={page} index={index} />
                    <div className="flex items-center">
                      <p className="text-lg leading-relaxed">{page.text}</p>
                    </div>
                  </div>
                
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 
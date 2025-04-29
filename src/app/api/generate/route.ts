import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Cargar variables desde .env si existe
dotenv.config();

// Verificar API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  throw new Error("Definí OPENAI_API_KEY (variable o .env)");
}

const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Configuración global
const OUTPUT_DIR = path.resolve("public", "output");
const IMAGE_SIZE = "1024x1024";
const MODEL_TEXT = "gpt-4.1";
const MODEL_IMAGE = "gpt-image-1";

// Estilos predefinidos
const STYLE_PRESETS: Record<string, string> = {
  "storybook": "whimsical storybook illustration, soft pastel colors, ink outlines, flat shading",
  "watercolor": "delicate watercolor painting, vibrant washes, subtle gradients, paper texture",
  "manga": "black-and-white manga panel, dynamic lines, screentone shading, cinematic angle",
  "pixel": "retro pixel-art, 32x32 style, limited color palette, crisp pixels",
  "lowpoly": "low-poly 3D render, bright low-count polygons, minimal details, isometric view",
  "realistic": "hyper-realistic digital art, cinematic lighting, 50mm lens, detailed textures",
};

// Interfaces
interface Scene {
  index: number;
  text: string;
}

interface BookPage {
  image_path: string;
  text: string;
}

// Paso 1 - Segmentar historia
async function segmentStory(story: string, maxImages: number): Promise<Scene[]> {
  const systemInstructions = 
    `You are an expert children's book editor. Split the input STORY into a maximum ` +
    `of ${maxImages} scenes, one illustration per scene. Reply ONLY with JSON in the form ` +
    `[{"index": int, "text": str}, ...] and DO NOT change the original text.`;

  const response = await client.chat.completions.create({
    model: MODEL_TEXT,
    messages: [
      { role: "system", content: systemInstructions },
      { role: "user", content: story }
    ],
    response_format: { type: "json_object" }
  });

  const jsonStr = response.choices[0].message.content?.trim() || '{}';
  
  try {
    let data = JSON.parse(jsonStr);
    let sceneData: any[];
    
    // Manejar estructura JSON anidada si es necesario
    if (typeof data === 'object' && data !== null) {
      if ('result' in data) {
        sceneData = data.result;
      } else if ('results' in data) {
        sceneData = data.results;
      } else if ('scenes' in data) {
        sceneData = data.scenes;
      } else if (Object.keys(data).every(key => !isNaN(Number(key)))) {
        // Convertir diccionario con claves numéricas a lista de escenas
        sceneData = Object.keys(data)
          .sort((a, b) => Number(a) - Number(b))
          .map(key => data[key]);
      } else {
        sceneData = Array.isArray(data) ? data : [data];
      }
    } else {
      sceneData = Array.isArray(data) ? data : [data];
    }
    
    // Validar y convertir a Scene[]
    const scenes: Scene[] = sceneData.map(item => ({
      index: Number(item.index),
      text: String(item.text)
    }));
    
    return scenes.slice(0, maxImages);
  } catch (e) {
    throw new Error(`Error parsing scene JSON: ${e}\nLLM output:\n${jsonStr}`);
  }
}

// Paso 2 - Crear prompts para imágenes
function buildPrompts(scenes: Scene[], styleKey: string): string[] {
  const styleWords = STYLE_PRESETS[styleKey];
  const prompts: string[] = [];
  
  scenes.forEach((scene, idx) => {
    const refClause = idx > 0 
      ? " Maintain the same characters, color palette and environment consistency as the previous page."
      : "";
      
    const prompt = 
      `${styleWords}. Illustration for a children's story, square composition. ` +
      `Scene ${idx+1}: ${scene.text.trim().substring(0, 350)}${refClause}`;
      
    prompts.push(prompt);
  });
  
  return prompts;
}

// Paso 3 - Generar imágenes
async function genImage(prompt: string, imageOptions: any = {}): Promise<string> {
  const result = await client.images.generate({
    model: imageOptions.model || 'dall-e-2',
    prompt: prompt,
    n: imageOptions.n || 1,
    size: imageOptions.size || '1024x1024',
    style: imageOptions.style || 'vivid',
    quality: imageOptions.quality || 'standard',
    response_format: 'url',
    ...(imageOptions.model === 'gpt-image-1' && {
      background: imageOptions.background || 'auto',
      moderation: imageOptions.moderation || 'auto',
      output_compression: imageOptions.output_compression || 100,
      output_format: imageOptions.output_format || 'png'
    })
  });

  // La respuesta podría proporcionar URL o b64_json
  const imageData = result.data?.[0];
  if (!imageData) {
    throw new Error("No image data returned from API");
  }
  
  let imgBytes: Buffer;
  
  if (imageData.url) {
    // Descargar imagen desde URL
    const response = await fetch(imageData.url);
    imgBytes = Buffer.from(await response.arrayBuffer());
  } else if (imageData.b64_json) {
    // Decodificar datos base64
    imgBytes = Buffer.from(imageData.b64_json, 'base64');
  } else {
    throw new Error("No image data returned from API");
  }
  
  const filename = `${uuidv4()}.png`;
  const filepath = path.join(OUTPUT_DIR, filename);
  await fs.mkdir(path.dirname(filepath), { recursive: true });
  await fs.writeFile(filepath, imgBytes);
  return `/output/${filename}`; // Devolver la ruta relativa para el frontend
}

async function generateImages(prompts: string[]): Promise<string[]> {
  const imagePaths: string[] = [];
  
  // Generar imágenes secuencialmente
  for (let i = 0; i < prompts.length; i++) {
    const path = await genImage(prompts[i]);
    imagePaths.push(path);
  }
  
  return imagePaths;
}

// Paso 4 - Combinar texto e imágenes
function composePages(scenes: Scene[], imagePaths: string[]): BookPage[] {
  return scenes.map((scene, index) => ({
    image_path: imagePaths[index],
    text: scene.text
  }));
}

// Pipeline principal
async function illustrateStory(story: string, styleKey: string, maxImages: number): Promise<BookPage[]> {
  // Crear directorio de salida si no existe
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  
  const scenes = await segmentStory(story, maxImages);
  const prompts = buildPrompts(scenes, styleKey);
  const imagePaths = await generateImages(prompts);
  return composePages(scenes, imagePaths);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      story, 
      style = 'storybook', 
      maxImages = 5,
      imageOptions = {
        model: 'dall-e-2',
        size: '1024x1024',
        style: 'vivid',
        quality: 'standard',
        background: 'auto',
        moderation: 'auto',
        output_compression: 100,
        output_format: 'png'
      }
    } = body;
    
    if (!story) {
      return NextResponse.json({ error: 'Se requiere texto de historia' }, { status: 400 });
    }
    
    if (!Object.keys(STYLE_PRESETS).includes(style)) {
      return NextResponse.json({ 
        error: `Estilo no válido. Opciones: ${Object.keys(STYLE_PRESETS).join(', ')}` 
      }, { status: 400 });
    }
    
    // Generar el libro ilustrado
    const pages = await illustrateStory(story, style, maxImages);
    
    return NextResponse.json({ 
      success: true, 
      pages,
      totalPages: pages.length
    });
    
  } catch (error: any) {
    console.error('Error al generar el libro:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 
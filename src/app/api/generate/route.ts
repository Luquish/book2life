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
const MODEL_TEXT = "gpt-4.1-mini";

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
  image_type: 'url' | 'base64';
  text: string;
}

// Paso 1 - Segmentar historia
async function segmentStory(story: string, maxImages: number): Promise<Scene[]> {
  const startTime = Date.now();
  console.log('🔍 Iniciando segmentación de la historia...')
  console.log(`📝 Longitud de la historia: ${story.length} caracteres`)
  console.log(`🎯 Máximo de imágenes solicitadas: ${maxImages}`)

  const systemInstructions = 
    `You are an expert literary editor and story analyst. Your task is to analyze the input STORY and split it into scenes for illustration, following these strict rules:

1. First, analyze the story structure:
   - Identify chapters in any format (e.g. "Capítulo 1", "Cap. 1", "PRIMER CAPÍTULO", "1.", "Chapter One", etc.)
   - Count the number of paragraphs
   - If the text is written as a single block, identify natural story breaks (scene changes, time jumps, perspective shifts)

2. Then, determine the number of scenes based on these rules:
   - If the story has chapters:
     * Use one scene per chapter as a minimum
     * If total chapters < ${maxImages}, identify additional key moments within longer chapters
   - If the story has clear paragraphs but no chapters:
     * If paragraphs ≥ ${maxImages}, select the most significant moments
     * If paragraphs < ${maxImages}, analyze each paragraph for multiple key moments
   - If the story is a single block:
     * Analyze as a literary expert to identify significant moments or scene transitions

3. For each scene:
   - Select text that provides clear visual elements for illustration
   - Include relevant character descriptions, settings, and actions
   - Keep context that maintains story continuity

IMPORTANT: You must return an array of scenes, even if there's only one scene.

Reply with a JSON array in this format:
{
  "scenes": [{
    "index": number,
    "text": "detailed scene text with visual elements"
  }]
}`;

  console.log('⏳ Enviando solicitud a OpenAI para segmentación...');
  const response = await client.chat.completions.create({
    model: MODEL_TEXT,
    messages: [
      { role: "system", content: systemInstructions },
      { role: "user", content: story }
    ],
    response_format: { type: "json_object" }
  });
  console.log(`⚡ Respuesta de OpenAI recibida en ${(Date.now() - startTime)/1000} segundos`);

  const jsonStr = response.choices[0].message.content?.trim() || '{}';
  console.log('✨ Respuesta del modelo de segmentación recibida')
  console.log('📄 Respuesta JSON:', jsonStr);
  
  try {
    let data = JSON.parse(jsonStr);
    let sceneData: any[];
    
    // Validación y extracción de escenas
    if (!data || typeof data !== 'object') {
      throw new Error('Respuesta inválida: no es un objeto JSON');
    }

    // Intentar obtener el array de escenas de diferentes propiedades posibles
    if (Array.isArray(data)) {
      sceneData = data;
    } else if (data.scenes && Array.isArray(data.scenes)) {
      sceneData = data.scenes;
    } else if (data.results && Array.isArray(data.results)) {
      sceneData = data.results;
    } else if (data.result && Array.isArray(data.result)) {
      sceneData = data.result;
    } else {
      // Si es un objeto único, convertirlo en array
      if (!Array.isArray(data) && typeof data === 'object' && 'text' in data) {
        sceneData = [data];
      } else {
        throw new Error('No se encontró un array de escenas válido en la respuesta');
      }
    }

    console.log(`📊 Número de escenas encontradas: ${sceneData.length}`);
    
    // Validar y convertir a Scene[]
    const scenes: Scene[] = sceneData.map((item, index) => {
      const scene = {
        index: Number(item.index || index + 1),
        text: String(item.text || '').trim()
      };

      // Validar contenido de la escena
      if (!scene.text || scene.text.length < 10) {
        console.error(`❌ Escena ${scene.index} inválida:`, scene);
        throw new Error(`La escena ${scene.index} no tiene contenido válido`);
      }

      return scene;
    });
    
    console.log(`📚 Historia segmentada exitosamente en ${scenes.length} escenas`);
    return scenes;
  } catch (e: any) {
    console.error('❌ Error al procesar la respuesta:', e);
    console.error('📄 Respuesta JSON recibida:', jsonStr);
    throw new Error(`Error al procesar las escenas: ${e.message}`);
  }
}

// Paso 2 - Crear prompts para imágenes
function buildPrompts(scenes: Scene[], styleKey: string, imageOptions: any = {}): string[] {
  console.log(`🎨 Construyendo prompts con estilo: ${styleKey}`)
  const styleWords = STYLE_PRESETS[styleKey];
  const prompts: string[] = [];
  
  scenes.forEach((scene, idx) => {
    // Validar que la escena tenga texto
    if (!scene.text) {
      console.error(`❌ Error: Escena ${idx + 1} no tiene texto`);
      throw new Error(`Scene ${idx + 1} has no text`);
    }

    console.log(`📝 Construyendo prompt para escena ${idx + 1}`);
    
    const refClause = idx > 0 
      ? " Maintain the same characters, color palette and environment consistency as the previous page."
      : "";

    const sceneText = scene.text.trim();
    console.log(`📄 Texto de la escena ${idx + 1}: "${sceneText.substring(0, 50)}..."`);
    
    const prompt = 
      `${styleWords}. Illustration for a story, square composition. ` +
      `Scene ${idx + 1}: ${sceneText}${refClause}`;
    
    console.log(`🎯 Longitud del prompt ${idx + 1}: ${prompt.length} caracteres`);
    prompts.push(prompt);
  });
  
  console.log(`📝 ${prompts.length} prompts generados`);
  return prompts;
}

// Paso 3 - Generar imágenes
async function genImage(prompt: string, imageOptions: any = {}): Promise<{ path: string; type: 'url' | 'base64' }> {
  console.log('🎨 Generando imagen...')
  console.log('📝 Longitud del prompt:', prompt.length, 'caracteres')
  console.log('Opciones:', JSON.stringify(imageOptions, null, 2))
  
  const options: any = {
    model: imageOptions.model || 'dall-e-2',
    prompt: prompt,
    n: imageOptions.n || 1,
    size: imageOptions.size || '1024x1024'
  };

  // Configurar opciones según el modelo
  if (options.model === 'dall-e-3') {
    options.style = imageOptions.style || 'vivid';
    options.quality = imageOptions.quality || 'standard';
    options.response_format = 'url';
  } else if (options.model === 'dall-e-2') {
    options.response_format = 'url';
  } else if (options.model === 'gpt-image-1') {
    options.background = imageOptions.background || 'auto';
    options.moderation = imageOptions.moderation || 'auto';
    options.output_compression = imageOptions.output_compression || 100;
    options.output_format = imageOptions.output_format || 'png';
  }

  console.log('Configuración final de la API:', JSON.stringify(options, null, 2))

  try {
    const result = await client.images.generate(options);
    console.log('✅ Imagen generada exitosamente')
    
    // La respuesta podría proporcionar URL o b64_json
    const imageData = result.data?.[0];
    if (!imageData) {
      throw new Error("No image data returned from API");
    }
    
    let imgBytes: Buffer;
    let imageType: 'url' | 'base64' = 'url';
    
    if (options.model === 'gpt-image-1') {
      // GPT-4V siempre retorna base64
      if (!imageData.b64_json) {
        throw new Error("No base64 image data returned from API");
      }
      imgBytes = Buffer.from(imageData.b64_json, 'base64');
      imageType = 'base64';
    } else {
      // DALL-E 2/3 retornan URL
      if (!imageData.url) {
        throw new Error("No URL returned from API");
      }
      const response = await fetch(imageData.url);
      imgBytes = Buffer.from(await response.arrayBuffer());
      imageType = 'url';
    }
    
    const filename = `${uuidv4()}.png`;
    const filepath = path.join(OUTPUT_DIR, filename);
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await fs.writeFile(filepath, imgBytes);

    // Si es base64, también guardamos el string base64 original
    if (imageType === 'base64') {
      const base64Path = path.join(OUTPUT_DIR, `${filename}.b64`);
      await fs.writeFile(base64Path, imageData.b64_json || '');
    }

    return {
      path: `/output/${filename}`,
      type: imageType
    };
  } catch (error) {
    console.error('❌ Error al generar imagen:', error)
    throw error;
  }
}

async function generateImages(prompts: string[], imageOptions: any = {}): Promise<Array<{ path: string; type: 'url' | 'base64' }>> {
  console.log(`🖼️ Iniciando generación de ${prompts.length} imágenes...`)
  const imagePaths: Array<{ path: string; type: 'url' | 'base64' }> = [];
  
  // Generar imágenes secuencialmente
  for (let i = 0; i < prompts.length; i++) {
    console.log(`\n📸 Generando imagen ${i + 1} de ${prompts.length}`)
    const result = await genImage(prompts[i], imageOptions);
    imagePaths.push(result);
  }
  
  console.log('✨ Todas las imágenes generadas exitosamente')
  return imagePaths;
}

// Paso 4 - Combinar texto e imágenes
function composePages(scenes: Scene[], imageResults: Array<{ path: string; type: 'url' | 'base64' }>, imageOptions: any): BookPage[] {
  return scenes.map((scene, index) => ({
    image_path: imageResults[index].path,
    image_type: imageResults[index].type,
    text: scene.text,
  }));
}

// Pipeline principal
async function illustrateStory(story: string, styleKey: string, maxImages: number, imageOptions: any = {}): Promise<BookPage[]> {
  console.log('\n🚀 Iniciando proceso de ilustración...')
  console.log(`Estilo seleccionado: ${styleKey}`)
  console.log('Opciones de imagen:', JSON.stringify(imageOptions, null, 2))
  
  // Crear directorio de salida si no existe
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  
  const scenes = await segmentStory(story, maxImages);
  const prompts = buildPrompts(scenes, styleKey, imageOptions);
  const imageResults = await generateImages(prompts, imageOptions);
  const pages = composePages(scenes, imageResults, imageOptions);
  
  console.log('✅ Proceso de ilustración completado')
  console.log(`📚 Libro generado con ${pages.length} páginas`)
  return pages;
}

export async function POST(request: NextRequest) {
  console.log('\n📬 Nueva solicitud de generación recibida')
  
  try {
    const body = await request.json();
    console.log('📦 Datos recibidos:', JSON.stringify(body, null, 2))
    
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
      console.error('❌ Error: No se proporcionó texto de historia')
      return NextResponse.json({ error: 'Se requiere texto de historia' }, { status: 400 });
    }
    
    if (!Object.keys(STYLE_PRESETS).includes(style)) {
      console.error(`❌ Error: Estilo "${style}" no válido`)
      return NextResponse.json({ 
        error: `Estilo no válido. Opciones: ${Object.keys(STYLE_PRESETS).join(', ')}` 
      }, { status: 400 });
    }
    
    // Generar el libro ilustrado
    const pages = await illustrateStory(story, style, maxImages, imageOptions);
    
    console.log('✨ Respuesta enviada exitosamente')
    return NextResponse.json({ 
      success: true, 
      pages,
      totalPages: pages.length
    });
    
  } catch (error: any) {
    console.error('❌ Error al generar el libro:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 
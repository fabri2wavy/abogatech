import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
    try {
        const { pregunta, archivo, abogadoId } = await request.json();

        console.log("🔍 Buscando datos en Supabase para el ID:", abogadoId);

        if (!abogadoId) throw new Error("No se recibió el ID del abogado");

        const { data: perfilAbogado, error: errorPerfil } = await supabase
            .from('perfiles')
            .select('nombres, apellido_paterno')
            .eq('id', abogadoId)
            .single();

        if (errorPerfil) console.error("Error al buscar perfil:", errorPerfil.message);

        const nombreDoctor = perfilAbogado ? `${perfilAbogado.nombres} ${perfilAbogado.apellido_paterno}` : "Abogado";
        console.log("Identidad confirmada:", nombreDoctor);

        const { data: misExpedientes, error: errorExpedientes } = await supabase
            .from('expedientes')
            .select(`
        numero_caso,
        titulo,
        estado,
        cliente:perfiles!cliente_id (nombres, apellido_paterno)
      `)
            .eq('abogado_asignado_id', abogadoId)
            .limit(10);

        if (errorExpedientes) console.error("Error al buscar expedientes:", errorExpedientes.message);
        console.log(`Expedientes encontrados: ${misExpedientes?.length || 0}`);

        const systemPrompt = `
      Eres el Asistente Legal de Inteligencia Artificial de Iturri & Asociados.
      
      CONTEXTO CRÍTICO:
      Estás hablando en privado con el Dr. ${nombreDoctor}. 
      
      REGLA DE SALUDO: 
      Si el usuario te dice "Hola", "Buenos días", o cualquier saludo inicial, TU PRIMERA FRASE DEBE SER: "Hola Doctor ${nombreDoctor}." 
      
      BASE DE DATOS EN TIEMPO REAL:
      Estos son los expedientes que el Dr. ${nombreDoctor} tiene asignados actualmente:
      ${JSON.stringify(misExpedientes || [])}
      
      INSTRUCCIONES MULTIMODALES:
      Si el usuario adjunta un documento, prioriza el análisis de ese texto legal.
    `;

        const inputArray: any[] = [
            { type: "text", text: systemPrompt + "\n\nMensaje del usuario: " + pregunta }
        ];

        if (archivo) {
            inputArray.push({
                type: "document",
                data: archivo,
                mime_type: "application/pdf"
            });
        }

        const interaction = await ai.interactions.create({
            model: "gemini-3.5-flash",
            input: inputArray
        });

        return NextResponse.json({ respuesta: interaction.output_text });

    } catch (error) {
        console.error("Falla crítica en el endpoint:", error);
        return NextResponse.json({ error: 'Fallo el procesamiento.' }, { status: 500 });
    }
}
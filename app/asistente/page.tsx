'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/infrastructure/supabase/client';

export default function AsistenteLegal() {
    const [mensajes, setMensajes] = useState<{ rol: string, contenido: string }[]>([]);
    const [input, setInput] = useState('');
    const [cargando, setCargando] = useState(false);

    const [usuarioId, setUsuarioId] = useState<string | null>(null);
    const [archivoBase64, setArchivoBase64] = useState<string | null>(null);
    const [nombreArchivo, setNombreArchivo] = useState<string>('');

    // Validar sesión real del navegador
    useEffect(() => {
        const supabase = createClient();

        const revisarSesion = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUsuarioId(user.id);
            }
        };

        revisarSesion();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUsuarioId(session?.user?.id || null);
        });

        return () => authListener.subscription.unsubscribe();
    }, []);

    const manejarArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === "application/pdf") {
            setNombreArchivo(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                setArchivoBase64(base64String);
            };
            reader.readAsDataURL(file);
        } else {
            alert("Por favor, sube solo archivos PDF.");
        }
    };

    const enviarMensaje = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!input.trim() && !archivoBase64) || !usuarioId) return;

        const nuevaPregunta = input;
        setMensajes((prev) => [...prev, { rol: 'usuario', contenido: nuevaPregunta }]);
        setInput('');
        setCargando(true);

        try {
            const res = await fetch('/api/asistente', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pregunta: nuevaPregunta,
                    archivo: archivoBase64,
                    abogadoId: usuarioId // Pasamos la identidad de forma segura
                })
            });

            const data = await res.json();
            setMensajes((prev) => [...prev, { rol: 'ia', contenido: data.respuesta }]);
        } catch (error) {
            setMensajes((prev) => [...prev, { rol: 'ia', contenido: 'Error de conexión.' }]);
        } finally {
            setCargando(false);
        }
    };

    if (!usuarioId) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white shadow-lg rounded-xl">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Acceso Restringido</h2>
                    <p className="text-gray-500">Por favor, inicia sesión en el CRM para usar el asistente AI.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50 font-sans">
            <header className="bg-slate-900 text-white p-4 shadow-md flex items-center justify-between">
                <h1 className="text-xl font-bold">Abogatech AI</h1>
                <div className="flex items-center gap-2 text-sm text-green-400">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    Conectado como Doctor
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {mensajes.length === 0 && (
                    <div className="text-center text-gray-400 mt-20">
                        <p className="text-lg">Asistente Privado y Lector de Documentos.</p>
                        <p className="text-sm">Di "Hola" para comenzar o adjunta un expediente PDF.</p>
                    </div>
                )}

                {mensajes.map((msg, index) => (
                    <div key={index} className={`flex ${msg.rol === 'usuario' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] p-3 rounded-lg shadow-sm ${msg.rol === 'usuario' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'}`}>
                            {msg.contenido}
                        </div>
                    </div>
                ))}

                {cargando && (
                    <div className="flex justify-start">
                        <div className="bg-white text-gray-500 border p-3 rounded-lg rounded-bl-none shadow-sm animate-pulse">
                            Analizando...
                        </div>
                    </div>
                )}
            </main>

            <footer className="p-4 bg-white border-t border-gray-200 shadow-inner flex flex-col gap-2">
                {nombreArchivo && (
                    <div className="text-sm text-green-600 font-medium bg-green-50 p-2 rounded-md border border-green-200 inline-block">
                        📄 Documento cargado: {nombreArchivo}
                    </div>
                )}
                <form onSubmit={enviarMensaje} className="flex gap-2">
                    <label className="cursor-pointer bg-slate-200 hover:bg-slate-300 text-slate-700 p-3 rounded-lg flex items-center justify-center transition-colors">
                        <input type="file" accept=".pdf" className="hidden" onChange={manejarArchivo} />
                        📎 PDF
                    </label>

                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Escribe 'Hola' para probar la personalización..."
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        disabled={cargando}
                    />
                    <button
                        type="submit"
                        disabled={cargando}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Enviar
                    </button>
                </form>
            </footer>
        </div>
    );
}
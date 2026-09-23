'use client';

import { useState, useRef, useEffect } from 'react';

interface Props {
    abogadoId: string;
    nombreAbogado?: string;
}

export default function WidgetAsistente({ abogadoId, nombreAbogado }: Props) {
    const [abierto, setAbierto] = useState(false);
    const [mensajes, setMensajes] = useState<{ rol: string; contenido: string }[]>([]);
    const [input, setInput] = useState('');
    const [cargando, setCargando] = useState(false);
    const [archivoBase64, setArchivoBase64] = useState<string | null>(null);
    const [nombreArchivo, setNombreArchivo] = useState('');

    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll al último mensaje
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [mensajes, cargando]);

    // Focus en el input al abrir
    useEffect(() => {
        if (abierto && inputRef.current) {
            inputRef.current.focus();
        }
    }, [abierto]);

    const manejarArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setNombreArchivo(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                setArchivoBase64(base64String);
            };
            reader.readAsDataURL(file);
        } else {
            alert('Por favor, sube solo archivos PDF.');
        }
        // Reset para permitir re-subir el mismo archivo
        e.target.value = '';
    };

    const quitarArchivo = () => {
        setArchivoBase64(null);
        setNombreArchivo('');
    };

    const enviarMensaje = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!input.trim() && !archivoBase64) || cargando) return;

        const textoUsuario = input.trim() || `📄 ${nombreArchivo}`;
        setMensajes((prev) => [...prev, { rol: 'usuario', contenido: textoUsuario }]);
        const preguntaEnviar = input;
        setInput('');
        setCargando(true);

        try {
            const res = await fetch('/api/asistente', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pregunta: preguntaEnviar,
                    archivo: archivoBase64,
                    abogadoId,
                }),
            });

            const data = await res.json();
            setMensajes((prev) => [...prev, { rol: 'ia', contenido: data.respuesta || data.error }]);
        } catch {
            setMensajes((prev) => [
                ...prev,
                { rol: 'ia', contenido: 'Error de conexión con el servidor.' },
            ]);
        } finally {
            setCargando(false);
            setArchivoBase64(null);
            setNombreArchivo('');
        }
    };

    return (
        <>
            {/* ── Panel de chat ──────────────────────────────────── */}
            <div
                style={{
                    position: 'fixed',
                    bottom: '5.5rem',
                    right: '1.5rem',
                    zIndex: 60,
                    width: '400px',
                    maxWidth: 'calc(100vw - 2rem)',
                    height: '520px',
                    maxHeight: 'calc(100vh - 8rem)',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255,255,255,0.06)',
                    opacity: abierto ? 1 : 0,
                    transform: abierto ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.95)',
                    pointerEvents: abierto ? 'auto' : 'none',
                    transition: 'opacity 250ms cubic-bezier(0.16, 1, 0.3, 1), transform 250ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        background: 'linear-gradient(135deg, var(--color-navy) 0%, #111111 100%)',
                        borderBottom: '1px solid var(--color-navy-border)',
                        padding: '14px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexShrink: 0,
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {/* Ícono IA */}
                        <div
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: 'var(--radius-full)',
                                background: 'var(--color-gold-dim)',
                                border: '1px solid rgba(204, 0, 0, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
                                <path d="M16 14h.01" /><path d="M8 14h.01" />
                                <path d="M12 18v2" /><path d="M7 22h10" />
                                <path d="M6 10a6 6 0 0 0 12 0" />
                            </svg>
                        </div>
                        <div>
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 600,
                                    color: 'var(--color-text-on-dark)',
                                    fontFamily: 'var(--font-body)',
                                    lineHeight: 1.2,
                                }}
                            >
                                Abogatech AI
                            </p>
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: '11px',
                                    color: 'var(--color-text-muted)',
                                    fontFamily: 'var(--font-body)',
                                }}
                            >
                                Asistente Legal Privado
                            </p>
                        </div>
                    </div>

                    {/* Indicador + Cerrar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--color-success)' }}>
                            <span
                                style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    background: 'var(--color-success)',
                                    display: 'inline-block',
                                    animation: 'pulse 2s infinite',
                                }}
                            />
                            Activo
                        </div>
                        <button
                            onClick={() => setAbierto(false)}
                            aria-label="Cerrar asistente"
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px',
                                color: 'var(--color-text-muted)',
                                transition: 'color var(--transition-fast)',
                                display: 'flex',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-on-dark)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Área de mensajes */}
                <div
                    ref={scrollRef}
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '16px',
                        background: 'var(--color-surface)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                    }}
                >
                    {mensajes.length === 0 && (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                textAlign: 'center',
                                color: 'var(--color-text-muted)',
                                fontFamily: 'var(--font-body)',
                                gap: '8px',
                                padding: '0 20px',
                            }}
                        >
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-surface-border)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                            <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                                Asistente Privado
                            </p>
                            <p style={{ margin: 0, fontSize: '12px' }}>
                                Di &quot;Hola&quot; para comenzar o adjunta un PDF.
                            </p>
                        </div>
                    )}

                    {mensajes.map((msg, i) => (
                        <div
                            key={i}
                            style={{
                                display: 'flex',
                                justifyContent: msg.rol === 'usuario' ? 'flex-end' : 'flex-start',
                            }}
                        >
                            <div
                                style={{
                                    maxWidth: '82%',
                                    padding: '10px 14px',
                                    borderRadius: msg.rol === 'usuario'
                                        ? '14px 14px 4px 14px'
                                        : '14px 14px 14px 4px',
                                    fontSize: 'var(--text-sm)',
                                    lineHeight: 1.5,
                                    fontFamily: 'var(--font-body)',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    ...(msg.rol === 'usuario'
                                        ? {
                                            background: 'var(--color-gold)',
                                            color: 'var(--color-text-on-gold)',
                                            boxShadow: '0 2px 8px rgba(204, 0, 0, 0.2)',
                                        }
                                        : {
                                            background: 'var(--color-surface-card)',
                                            color: 'var(--color-text-primary)',
                                            border: '1px solid var(--color-surface-border)',
                                            boxShadow: 'var(--shadow-sm)',
                                        }),
                                }}
                            >
                                {msg.contenido}
                            </div>
                        </div>
                    ))}

                    {cargando && (
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <div
                                style={{
                                    background: 'var(--color-surface-card)',
                                    border: '1px solid var(--color-surface-border)',
                                    padding: '10px 14px',
                                    borderRadius: '14px 14px 14px 4px',
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--color-text-muted)',
                                    fontFamily: 'var(--font-body)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}
                            >
                                <span
                                    style={{
                                        display: 'inline-block',
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: 'var(--color-gold)',
                                        animation: 'pulse 1.2s infinite',
                                    }}
                                />
                                Analizando...
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer / Input */}
                <div
                    style={{
                        background: 'var(--color-surface-card)',
                        borderTop: '1px solid var(--color-surface-border)',
                        padding: '12px',
                        flexShrink: 0,
                    }}
                >
                    {/* Archivo adjunto */}
                    {nombreArchivo && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: '12px',
                                color: 'var(--color-success)',
                                fontWeight: 500,
                                background: 'var(--color-success-bg)',
                                border: '1px solid var(--color-success-border)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '6px 10px',
                                marginBottom: '8px',
                                fontFamily: 'var(--font-body)',
                            }}
                        >
                            <span>📄 {nombreArchivo}</span>
                            <button
                                onClick={quitarArchivo}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--color-text-muted)',
                                    fontSize: '14px',
                                    padding: '0 2px',
                                    lineHeight: 1,
                                }}
                                aria-label="Quitar archivo"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    <form
                        onSubmit={enviarMensaje}
                        style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                    >
                        {/* Botón PDF */}
                        <label
                            style={{
                                cursor: cargando ? 'not-allowed' : 'pointer',
                                opacity: cargando ? 0.5 : 1,
                                background: 'var(--color-surface)',
                                border: '1px solid var(--color-surface-border)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background var(--transition-fast)',
                                flexShrink: 0,
                            }}
                            title="Adjuntar PDF"
                        >
                            <input
                                type="file"
                                accept=".pdf"
                                style={{ display: 'none' }}
                                onChange={manejarArchivo}
                                disabled={cargando}
                            />
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                            </svg>
                        </label>

                        {/* Input */}
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Escribe tu consulta legal..."
                            disabled={cargando}
                            style={{
                                flex: 1,
                                padding: '9px 14px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--color-surface-border)',
                                background: 'var(--color-surface)',
                                color: 'var(--color-text-primary)',
                                fontSize: 'var(--text-sm)',
                                fontFamily: 'var(--font-body)',
                                outline: 'none',
                                transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-gold)';
                                e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-gold-glow)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-surface-border)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />

                        {/* Botón enviar */}
                        <button
                            type="submit"
                            disabled={cargando || (!input.trim() && !archivoBase64)}
                            style={{
                                background: cargando || (!input.trim() && !archivoBase64)
                                    ? 'var(--color-navy-light)'
                                    : 'var(--color-gold)',
                                color: 'var(--color-text-on-gold)',
                                border: 'none',
                                borderRadius: 'var(--radius-sm)',
                                padding: '9px 12px',
                                cursor: cargando || (!input.trim() && !archivoBase64) ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background var(--transition-fast), transform var(--transition-fast)',
                                flexShrink: 0,
                            }}
                            aria-label="Enviar mensaje"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>

            {/* ── Botón flotante ─────────────────────────────────── */}
            <button
                onClick={() => setAbierto((prev) => !prev)}
                aria-label={abierto ? 'Cerrar asistente' : 'Abrir asistente AI'}
                style={{
                    position: 'fixed',
                    bottom: '1.5rem',
                    right: '1.5rem',
                    zIndex: 60,
                    width: '56px',
                    height: '56px',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: abierto
                        ? 'var(--color-navy)'
                        : 'linear-gradient(135deg, var(--color-gold) 0%, #a30000 100%)',
                    boxShadow: abierto
                        ? 'var(--shadow-lg)'
                        : 'var(--shadow-gold), 0 8px 24px rgba(204, 0, 0, 0.3)',
                    transition: 'transform var(--transition-base), background var(--transition-base), box-shadow var(--transition-base)',
                    transform: abierto ? 'rotate(0deg)' : 'rotate(0deg)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
                {abierto ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-on-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                    </svg>
                ) : (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="10" r="1" fill="white" stroke="none" />
                        <circle cx="8" cy="10" r="1" fill="white" stroke="none" />
                        <circle cx="16" cy="10" r="1" fill="white" stroke="none" />
                    </svg>
                )}
            </button>
        </>
    );
}

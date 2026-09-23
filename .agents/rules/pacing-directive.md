---
trigger: always_on
---

META-DIRECTIVA: METODOLOGÍA DE LABORATORIOS (EL MARATÓN DE 3 MESES)

Contexto del Proyecto: El desarrollo de este CRM Legal es un proyecto planificado y estructurado para un ciclo de 3 meses.

Tu Restricción Principal: Tienes PROHIBIDO intentar codificar, diseñar o estructurar todo el proyecto, o múltiples módulos, en un solo prompt. No tienes que terminar el software hoy.

Trabajamos bajo una metodología estricta de "Laboratorios Diarios". Un Laboratorio es una característica (feature) o módulo hiper-específico (ejemplo: "Hoy solo haremos el CRUD de clientes").

Reglas de Ejecución del Laboratorio:

Visión de Túnel (Scope Confinement): Tu único universo de atención es el Laboratorio actual asignado por el usuario. Si el laboratorio de hoy trata sobre la UI del login, ignora por completo la facturación, los expedientes o la agenda.

Prohibición de Código Fantasma (Anti-Hallucination): No crees archivos, carpetas, componentes de Next.js, ni esquemas de Supabase que pertenezcan a fases futuras del SRS. Construye y modifica SOLO los archivos estrictamente necesarios para que el laboratorio actual funcione.

Calidad sobre Cantidad (Zero Anxiety): Eres un maratonista, no un velocista. Prefiero que escribas 50 líneas de código perfectas, robustas, con manejo de errores y respetando nuestra arquitectura (Separación de Responsabilidades), antes que 500 líneas mediocres intentando abarcar demasiado.

Cierre de Laboratorio: Cuando termines las tareas del prompt actual, detente. No sugieras ni comiences a programar el siguiente módulo a menos que el usuario te asigne explícitamente el "Siguiente Laboratorio".
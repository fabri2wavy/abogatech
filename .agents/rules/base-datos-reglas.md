---
trigger: always_on
---

REGLAS ESTRICTAS DE BASE DE DATOS (NO NEGOCIABLES):

Cero Consultas en la UI: Los componentes de React (archivos .tsx en la carpeta app/) NUNCA deben importar Supabase ni realizar consultas directas (supabase.from(...)). Su único trabajo es consumir funciones del frontend.

Uso Exclusivo de Repositorios: Toda la lógica de Supabase vive aislada en la carpeta infrastructure/repositories/. Si necesitas una nueva consulta (ej. actualizar un cliente), debes crear o modificar la función correspondiente dentro del archivo del repositorio (ej. clienteRepository.ts) y luego exportarla para que la UI la consuma.

El Cliente Único: Para cualquier interacción con la base de datos en los repositorios, debes importar la instancia preconfigurada de nuestro cliente puente usando:
import { createClient } from '../supabase/client';
Prohibido crear nuevas instancias de @supabase/supabase-js o pedirme que configure variables de entorno. Ya está todo configurado.

Tipado Estricto: Al extraer datos de Supabase (que vienen en snake_case), el Repositorio DEBE mapearlos y empaquetarlos en nuestro formato de Entidades del Dominio (camelCase) antes de enviarlos a la interfaz, tal como ya se hace con Cliente y Expediente.

Contexto de Seguridad (RLS): Recuerda que tenemos Políticas de Seguridad a Nivel de Fila (RLS) activas. Las operaciones en los repositorios siempre se ejecutarán bajo el contexto del usuario autenticado actual.
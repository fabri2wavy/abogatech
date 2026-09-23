# Documento de Especificación de Requerimientos (SRS)
## Proyecto: Abogatech — CRM Legal (Iturri & Asociados)

**Versión:** 2.0 — Actualizada a partir del código fuente
**Fecha:** Julio 2026
**Desarrollador:** Ariel Fabricio Tarqui Villalba
**Repositorio:** crm-legal-iturri

---

## 1. Introducción

### 1.1 Propósito
Este documento define los requerimientos funcionales y no funcionales del sistema **Abogatech**, un CRM (Customer Relationship Management) especializado para el sector legal, desarrollado para la firma Iturri & Asociados. El sistema centraliza la gestión de expedientes, clientes, documentación, agenda de plazos legales, finanzas y comunicación interna del despacho, incorporando además un asistente conversacional basado en inteligencia artificial.

Esta versión actualiza el SRS original para reflejar el estado real del sistema implementado, que ha crecido de 4 a 14 módulos funcionales durante el desarrollo del MVP.

### 1.2 Alcance del Sistema
Abogatech gestiona el ciclo de vida completo de un caso legal: desde el registro del cliente y la apertura del expediente, pasando por el seguimiento procesal (bitácora, agenda, documentos), hasta el cierre y la facturación. Incluye también módulos administrativos (auditoría, configuración, reportes) y un asistente de IA con acceso contextual a los datos del abogado autenticado.

### 1.3 Pila Tecnológica (Stack)

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 16 (App Router) + React + Tailwind CSS |
| Backend / BaaS | Supabase (PostgreSQL + Auth + Storage) |
| Infraestructura local | Docker + Supabase CLI |
| Inteligencia Artificial | Google Gemini API (`@google/genai`) |
| Arquitectura | Clean Architecture (Presentación / Dominio / Infraestructura) |
| Seguridad | Row Level Security (RLS), Middleware de Next.js, RBAC aplicativo |

### 1.4 Definiciones y Siglas

| Sigla | Significado |
|---|---|
| RLS | Row Level Security (seguridad a nivel de fila en PostgreSQL) |
| RBAC | Role-Based Access Control |
| NUREJ | Número Único de Registro Judicial (Bolivia) |
| FELCC | Fuerza Especial de Lucha Contra el Crimen |
| CRUD | Create, Read, Update, Delete |
| KPI | Key Performance Indicator |
| BI | Business Intelligence |

---

## 2. Descripción General

### 2.1 Perfiles de Usuario (Roles)

1. **Administrador/Socio:** Acceso total al sistema. Ve todos los expedientes de la firma, reasigna casos, gestiona el equipo, accede a reportes financieros globales, auditoría y configuración.
2. **Abogado Titular:** Gestiona únicamente sus expedientes asignados (auto-asignación al crear). Sube documentos, actualiza bitácora, registra informes de avance, usa el asistente de IA.
3. **Cliente (Portal de visualización):** Acceso de solo lectura restringido por RLS a sus propios expedientes. Ve informes marcados como públicos y descarga documentos marcados como visibles para cliente.

> Nota: el rol de "Procurador/Pasante" contemplado en la versión 1.0 del SRS no está implementado en el esquema actual de roles (`admin`, `abogado`, `cliente`); se mantiene como candidato para una futura iteración.

### 2.2 Contexto Legal Boliviano
El modelo de datos de Expedientes incorpora nomenclatura específica del sistema judicial boliviano: NUREJ, número de Fiscalía, número FELCC, juez y secretario actuario asignados, fiscal e investigador a cargo, y etapa procesal — permitiendo que el sistema refleje fielmente el seguimiento de procesos civiles y penales en Bolivia.

---

## 3. Requerimientos Funcionales

### Módulo 1 — Autenticación y Sesión
- **RF-1.1:** El sistema debe permitir el inicio de sesión mediante correo y contraseña (Supabase Auth).
- **RF-1.2:** Al crear un usuario en `auth.users`, un trigger debe asignarle automáticamente el rol `cliente` por defecto en la tabla `perfiles`.
- **RF-1.3:** El middleware debe interceptar todas las rutas `/dashboard/*` y redirigir a `/login` si no existe sesión activa.
- **RF-1.4:** El sistema debe permitir el cierre de sesión (`signOut`) con limpieza de caché del enrutador.

### Módulo 2 — Gestión de Clientes (Directorio)
- **RF-2.1:** El sistema debe permitir el CRUD completo de perfiles de clientes (personas naturales), incluyendo datos legales: CI, expedido, nacionalidad, estado civil, profesión, dirección, y datos de referidor.
- **RF-2.2:** Cada perfil de cliente debe mostrar el historial de expedientes asociados (Vista de Perfil 360°).
- **RF-2.3:** El sistema debe impedir el borrado de un cliente que posea expedientes activos o históricos, capturando el error de integridad referencial (FK) y notificando al usuario.

### Módulo 3 — Gestión de Expedientes (Casos)
- **RF-3.1:** El sistema debe permitir crear un expediente con: número de caso, título, materia, juzgado, parte contraria, cliente asociado y abogado responsable.
- **RF-3.2:** El expediente debe tener un estado dinámico: `en_espera`, `mediacion`, `juicio`, `cerrado`.
- **RF-3.3:** El sistema debe registrar campos específicos del proceso legal boliviano: rol del cliente en el proceso (demandante/demandado/imputado/víctima), tipo de proceso, NUREJ, número de Fiscalía, número FELCC, juez actual, secretario actuario, fiscal actual, investigador asignado, etapa procesal y cuantía.
- **RF-3.4:** El administrador debe poder crear expedientes asignándolos a cualquier abogado; el abogado solo puede auto-asignarse los expedientes que crea.
- **RF-3.5:** El sistema debe permitir archivar expedientes sin eliminarlos.
- **RF-3.6:** El administrador debe ver todos los expedientes de la firma; el abogado, únicamente los suyos (aplicado vía RLS).

### Módulo 4 — Bitácora del Expediente
- **RF-4.1:** El sistema debe permitir registrar entradas de bitácora (actualizaciones y avances) por expediente, con autor, fecha/hora y contenido.
- **RF-4.2:** Cada entrada debe poder marcarse como visible o no visible para el cliente.

### Módulo 5 — Gestión Documental
- **RF-5.1:** El sistema debe permitir subir y almacenar archivos (PDF, DOCX y otros) asociados a un expediente, usando Supabase Storage.
- **RF-5.2:** Cada documento debe registrar nombre, ruta, tamaño, autor y fecha de subida.
- **RF-5.3:** Cada documento debe poder marcarse como visible o no visible para el cliente; los documentos privados no deben ser accesibles sin el token de autorización correspondiente.

### Módulo 6 — Agenda y Plazos Legales
- **RF-6.1:** El sistema debe contar con un calendario para registrar eventos de tipo audiencia, reunión, vencimiento o tarea.
- **RF-6.2:** Cada evento debe tener estado (`pendiente`, `completado`, `cancelado`), fecha de inicio, fecha de fin, responsable asignado y, opcionalmente, un expediente vinculado.
- **RF-6.3:** El sistema debe permitir crear, actualizar y eliminar eventos de agenda.

### Módulo 7 — Gestión Financiera
- **RF-7.1:** El sistema debe permitir registrar un honorario por expediente, con monto total, moneda (BS/USD) y estado de contrato (vigente/finalizado).
- **RF-7.2:** El honorario debe poder fraccionarse en cuotas de pago, cada una con descripción, monto, fecha de vencimiento y estado (`pendiente`, `pagado`, `atrasado`).
- **RF-7.3:** El sistema debe permitir registrar gastos asociados a un expediente (concepto, monto, fecha, comprobante y estado de reembolso).
- **RF-7.4:** El sistema debe generar un estado de cuenta por expediente que agrupe honorario, cuotas y gastos.
- **RF-7.5:** El sistema debe generar un reporte financiero global (solo Administrador) con el total facturado, total pendiente, total en mora y el estado de pago por expediente (`al_dia`, `en_proceso`, `moroso`).
- **RF-7.6:** El sistema debe generar alertas de cuotas próximas a vencer o vencidas, indicando días restantes y nivel de urgencia.

### Módulo 8 — Plantillas de Documentos
- **RF-8.1:** El sistema debe permitir crear, editar y eliminar plantillas de documentos (memorial, contrato, poder, otro) con contenido parametrizable.
- **RF-8.2:** El sistema debe generar un documento final a partir de una plantilla, sustituyendo variables (motor basado en expresiones regulares) con datos del cliente y del expediente.

### Módulo 9 — Equipo (Directorio Interno)
- **RF-9.1:** El sistema debe permitir el registro de miembros del equipo legal (nombres, cargo, especialidad, contacto, estado laboral: activo/inactivo/vacaciones).
- **RF-9.2:** El registro de nuevos miembros debe crear también su cuenta de autenticación (vía Admin API de Supabase, ejecutada exclusivamente en Server Actions).

### Módulo 10 — Reportes y Business Intelligence
- **RF-10.1:** El sistema debe calcular y mostrar KPIs financieros globales: total facturado, total cobrado, total en mora (solo Administrador).
- **RF-10.2:** El sistema debe mostrar la carga laboral por abogado (número de casos activos).
- **RF-10.3:** El sistema debe mostrar la distribución de casos por materia legal.

### Módulo 11 — Configuración Global
- **RF-11.1:** El sistema debe permitir a un administrador crear, editar, activar/desactivar y eliminar parámetros de configuración organizados por categoría.

### Módulo 12 — Auditoría
- **RF-12.1:** El sistema debe registrar un log de auditoría por cada acción sensible, incluyendo usuario, acción, entidad afectada, ID de entidad, detalle (JSON) y fecha.
- **RF-12.2:** El administrador debe poder consultar el historial completo de logs de auditoría.

### Módulo 13 — Informes de Avance
- **RF-13.1:** El sistema debe permitir generar informes mensuales de avance por expediente, con resumen del proceso, estado actual, medidas precautorias y comentarios.
- **RF-13.2:** El sistema debe permitir consultar el historial de informes de avance de un expediente.

### Módulo 14 — Asistente Legal con Inteligencia Artificial
- **RF-14.1:** El sistema debe ofrecer un asistente conversacional (chat) impulsado por la API de Google Gemini, disponible para abogados autenticados.
- **RF-14.2:** El asistente debe recibir como contexto, en tiempo real, la identidad del abogado y hasta 10 de sus expedientes asignados (número de caso, título, estado y cliente asociado), consultados directamente desde la base de datos mediante `service_role`.
- **RF-14.3:** El asistente debe personalizar el saludo inicial dirigiéndose al abogado por su nombre y apellido.
- **RF-14.4:** El sistema debe permitir adjuntar un archivo a la consulta enviada al asistente.

---

## 4. Requerimientos No Funcionales

| ID | Categoría | Descripción |
|---|---|---|
| RNF-1 | Usabilidad | La interfaz debe ser moderna, limpia, construida en React/Next.js con diseño responsivo (Mobile First), permitiendo a los abogados revisar casos desde el teléfono en el juzgado. |
| RNF-2 | Seguridad | El sistema requiere autenticación robusta y control de acceso basado en roles (RBAC), reforzado con Row Level Security (RLS) a nivel de base de datos. Los documentos privados no son accesibles sin el token correspondiente. |
| RNF-3 | Seguridad | Las claves de administración (`service_role`) deben usarse exclusivamente en Server Actions o rutas API del servidor, nunca expuestas al cliente/navegador. |
| RNF-4 | Rendimiento | Las vistas principales (dashboard, listado de casos) deben renderizarse rápidamente, delegando la carga pesada al backend (Server Components / Server Actions de Next.js). |
| RNF-5 | Rendimiento | Las políticas RLS deben optimizarse usando subconsultas (`select auth.uid()`) para evitar cuellos de botella en las consultas. |
| RNF-6 | Mantenibilidad | El sistema debe seguir Clean Architecture con separación estricta en tres capas (Presentación, Dominio, Infraestructura). Ningún componente de UI debe importar Supabase directamente. |
| RNF-7 | Mantenibilidad | Todos los imports deben usar el alias absoluto `@/`, prohibiendo rutas relativas que crucen capas. |
| RNF-8 | Escalabilidad | Agregar un nuevo módulo debe requerir únicamente: nueva entidad de dominio → nuevo repositorio → nueva página, sin modificar las capas existentes. |
| RNF-9 | Portabilidad | El entorno de desarrollo debe poder desplegarse localmente mediante Docker y Supabase CLI, aislando base de datos, autenticación y almacenamiento de la máquina del desarrollador. |
| RNF-10 | Consistencia | La comunicación entre capas debe seguir un contrato genérico `RepositoryResponse<T>` (`{ data, error }`) para el manejo uniforme de errores. |
| RNF-11 | Auditabilidad | Toda acción sensible del sistema debe quedar registrada en el módulo de Auditoría con trazabilidad de usuario, acción y momento. |

---

## 5. Arquitectura del Sistema

### 5.1 Vista General de Capas

```
┌─────────────────────────────────────────────────────┐
│                   PRESENTACIÓN                      │
│              app/ + components/                     │
│     (React, Next.js App Router, UI "tonta")         │
├─────────────────────────────────────────────────────┤
│                     DOMINIO                         │
│                    domain/                          │
│    (Entidades, Tipos, Servicios puros — SIN         │
│     dependencia de Supabase ni React)               │
├─────────────────────────────────────────────────────┤
│                 INFRAESTRUCTURA                     │
│               infrastructure/                       │
│   (Repositorios Supabase, Server Actions,           │
│    Clientes de BD — toda la lógica de datos)        │
└─────────────────────────────────────────────────────┘
```

Regla de oro: las dependencias siempre apuntan hacia adentro. La Presentación depende del Dominio; la Infraestructura implementa contratos del Dominio.

### 5.2 Flujo de Datos Seguro

```
UI (Componente) → Repositorio → Supabase → Row Level Security
                                              │
                          Filtra filas autorizadas según auth.uid()
                                              │
UI (Entidad tipada camelCase) ← Repositorio ← Datos (snake_case)
```

### 5.3 Mapa de Módulos

| Módulo | Ruta UI | Repositorio | Entidad de Dominio |
|---|---|---|---|
| Autenticación | `/login` | `authRepository` | — |
| Dashboard | `/dashboard` | `usuarioRepository` | `UsuarioPerfil` |
| Clientes | `/dashboard/clientes` | `clienteRepository` | `Cliente` |
| Expedientes | `/dashboard/casos` | `expedienteRepository` | `Expediente` |
| Bitácora | Tab en `/dashboard/casos/[id]` | `bitacoraRepository` | `EntradaBitacora` |
| Documentos | Tab en `/dashboard/casos/[id]` | `documentoRepository` | `Documento` |
| Finanzas (caso) | Tab en `/dashboard/casos/[id]` | `finanzasRepository` | `Honorario`, `CuotaPago`, `GastoExpediente` |
| Finanzas (global) | `/dashboard/finanzas` | `finanzasRepository` | `ReporteFinancieroGlobal` |
| Informes de avance | Tab en `/dashboard/casos/[id]` | `informesRepository` | `InformeAvance` |
| Plantillas | `/dashboard/plantillas` | `plantillasRepository` | `Plantilla` |
| Agenda | `/dashboard/agenda` | `agendaRepository` | `EventoAgenda` |
| Equipo | `/dashboard/equipo` | `equipoRepository` | `MiembroEquipo` |
| Reportes (BI) | `/dashboard/reportes` | `reportesRepository` | `KpisFinancieros`, `CargaAbogado`, `DistribucionMateria` |
| Configuración | `/dashboard/configuracion` | `configuracionRepository` | `ConfiguracionGlobal` |
| Auditoría | `/dashboard/auditoria` | `auditoriaRepository` | `AuditoriaLog` |
| Asistente IA | `/asistente` | API Route (`app/api/asistente`) | — |

### 5.4 Principios de Seguridad

| Capa | Mecanismo | Descripción |
|---|---|---|
| Base de Datos | RLS | Cada consulta se ejecuta bajo `auth.uid()`; los clientes solo ven sus expedientes, los abogados solo sus asignaciones. |
| Middleware | `middleware.ts` | Intercepta rutas `/dashboard/*` y redirige a `/login` sin sesión válida. |
| Server Actions | `'use server'` | Operaciones sensibles (CRUD plantillas, registro de equipo) se ejecutan en el servidor. |
| RBAC aplicativo | Validación en repositorios | El módulo de reportes verifica `rol === 'admin'` antes de entregar datos financieros. |
| Admin API | `service_role` | Solo usada en Server Actions/rutas API; nunca expuesta al cliente. |

---

## 6. Modelo de Datos (Entidades Principales)

```
PERFILES ||--o{ EXPEDIENTES : "gestiona (abogado)"
CLIENTES ||--o{ EXPEDIENTES : "posee"
EXPEDIENTES ||--o{ ENTRADA_BITACORA : "registra"
EXPEDIENTES ||--o{ DOCUMENTOS : "almacena"
EXPEDIENTES ||--o{ EVENTOS_AGENDA : "programa"
EXPEDIENTES ||--o| HONORARIOS : "factura"
HONORARIOS ||--o{ CUOTAS_PAGO : "fracciona"
EXPEDIENTES ||--o{ GASTOS_EXPEDIENTE : "genera"
EXPEDIENTES ||--o{ INFORMES_AVANCE : "reporta"

PERFILES {
    uuid id PK
    string nombre_completo
    string rol "admin, abogado, cliente"
    string email
}
CLIENTES {
    uuid id PK
    string nombre_completo
    string carnet_identidad
}
EXPEDIENTES {
    uuid id PK
    string numeroCaso
    string estado "en_espera, mediacion, juicio, cerrado"
    string nurej
    string numeroFiscalia
    string numeroFelcc
    uuid cliente_id FK
    uuid abogado_id FK
}
```

---

## 7. Trazabilidad de Cambios respecto al SRS v1.0

| Cambio | Detalle |
|---|---|
| Roles | Se retira "Procurador/Pasante" (no implementado); se confirman 3 roles activos. |
| Módulos nuevos | Finanzas, Plantillas, Equipo, Reportes BI, Configuración, Auditoría, Informes de Avance y Asistente IA no existían en el SRS v1.0. |
| Expedientes | Se añaden campos de nomenclatura judicial boliviana (NUREJ, FELCC, Fiscalía, etc.), ausentes en la v1.0. |
| Arquitectura | Se documenta formalmente la migración a Clean Architecture (3 capas), no contemplada en la v1.0. |

---

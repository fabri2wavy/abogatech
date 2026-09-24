# FRONT-02 — Layout SaaS ABOGATECH

El shell muestra ABOGATECH / Gestión Legal como marca de producto y separa la
firma activa de esa marca. El login y los metadatos globales usan branding neutral.
Las referencias de Iturri en tarjetas públicas y el endpoint del asistente siguen
fuera del alcance de este cambio.

## Contexto y selector permanente

`FirmSwitcher` consume exclusivamente `useFirm()`. Con una membresía muestra el
nombre de firma y el rol. Con varias muestra un select nativo etiquetado, usable
con teclado y en móvil. Al elegir otra firma llama a `switchFirm(firmId)`; no
escribe cookies ni crea estado paralelo de tenant. Elegir la firma actual no hace
nada. El bloqueo de operaciones concurrentes, errores, persistencia y navegación
siguen a cargo de FRONT-01.

El selector contempla `isSwitching` deshabilitando la interacción y mostrando
feedback. En el flujo real, `FirmProvider` retira el shell anterior y muestra
“Cambiando de firma…” hasta la navegación. No quedan visibles los datos ni el
menú de la firma anterior durante la operación. El select nativo se cierra al
elegir; tras navegar, el drawer móvil empieza cerrado.

Las etiquetas de rol se comparten entre bienvenida, selector, selección inicial
y footer mediante `components/firm/roleLabels.ts`. El footer muestra nombre,
email y rol contextual; no conserva un rol global ni una copia en estado local.
`BotonSalir`, auth, middleware, provider, actions y repositorios no se modifican.

## Navegación

| Rol | Enlaces |
| --- | --- |
| admin | Inicio, Expedientes, Clientes, Agenda, Finanzas, Plantillas, Equipo, Reportes; Administración: Configuración y Auditoría |
| finanzas | Inicio, Finanzas, Mi Perfil |
| asociado_senior | Inicio, Mis Casos, Mis Clientes, Agenda, Plantillas, Equipo, Reportes, Mi Perfil |
| abogado | Inicio, Mis Casos, Mis Clientes, Agenda, Plantillas, Mi Perfil |
| cliente | Inicio, Mi Expediente |

No se presume permiso financiero para asociado senior. Los enlaces usan el rol
del membership activo; no se agregaron consultas de permisos ni columnas.
La navegación es visual: no reemplaza la autorización del backend.

## Responsive

Se conserva el sidebar de escritorio y el drawer móvil, con navegación desplazable,
selector arriba y perfil/logout abajo. El drawer cerrado queda oculto también al
teclado. Al abrirlo se enfoca el botón de cierre, Tab permanece dentro del menú,
Escape/overlay/botón permiten cerrarlo y el foco vuelve al botón de apertura.

## Validación

- `npx tsc --noEmit`: aprobado.
- `node --test tests/firm-context.test.mjs`: 31/31 aprobados. Incluye los cinco
  menús, perfil contextual, selector, estados de cambio y recorrido A → B → A con
  el repositorio/actions reales y datos simulados, además de las pruebas FRONT-01.
- ESLint sobre todos los archivos TS/TSX/MJS modificados o creados: cero errores;
  una advertencia preexistente sobre fuentes externas en `app/layout.tsx`.
- `npm run build`: aprobado. Registra advertencias del módulo Gemini legado,
  convención middleware y mensajes `DYNAMIC_SERVER_USAGE` al intentar prerenderizar
  rutas con cookies; termina correctamente clasificando dashboard como dinámico.
- Chromium, componentes reales y CSS del proyecto con backend simulado, desde
  un entorno temporal fuera de la aplicación: desktop 1440×900 y móvil 390×844,
  320×568. Selector, drawer, cambio de menú, carga sin contexto anterior,
  recarga, regreso a A y caso de una membresía comprobados. Sin overflow horizontal.
- `/login` real en localhost: branding ABOGATECH, título neutral y placeholder
  `correo@firma.com` comprobados en navegador.

El QA autenticado real de FRONT-02 sigue pendiente. Solo se dispone del correo
`qa.admin.a@abogatech.test`; hace falta la contraseña de prueba o que el usuario
realice el recorrido. La prueba con datos simulados no certifica Supabase ni RLS.

### Recorrido pendiente contra Supabase SaaS

1. Iniciar sesión con `qa.admin.a@abogatech.test`.
2. Firma A: comprobar “QA Firma A”, “Administrador” y menú admin.
3. Elegir Firma B: durante la carga desaparece el shell anterior; después se ven
   “QA Firma B”, “Abogado” y menú abogado, sin Finanzas, Equipo, Reportes,
   Configuración ni Auditoría.
4. Recargar y comprobar que permanece Firma B / Abogado.
5. Volver a Firma A y comprobar que reaparece el menú admin.
6. Repetir desde el drawer móvil; comprobar también logout y reapertura sin sesión.

## Límites

Sin cambios de backend, migraciones, RLS, RPCs, policies, subscriptions ni claves
`service_role`. No se instalaron dependencias en el proyecto.
No se migraron Clientes, Expedientes, Agenda, Finanzas, Documentos, Equipo,
Plantillas, Reportes, Configuración, Auditoría, portal de clientes ni asistente.
No se avanzó a FRONT-03.

# FRONT-01: autenticación y contexto de firma

El layout de `/dashboard` carga la sesión con `auth.getUser()`, identidad desde
`profiles`, memberships propios con `status = activo` desde `firm_memberships` y
las firmas visibles desde `firms`. Todas las consultas usan el cliente SSR de la
sesión y RLS. `React.cache` deduplica dentro del request, sin cache global de roles.

`FirmProvider` recibe los datos del servidor. `useFirm()` expone `firmId`, `firm`,
`membership`, `role`, `memberships`, `user`, `status`, `isSwitching` y `switchFirm`.
El estado `ready` garantiza firma, membership y rol presentes. Los demás estados
no tienen rol ni firma. La carga inicial tiene `loading.tsx`; el cambio de firma
tiene `isSwitching`. La autenticación ya está resuelta al mostrar los estados
`no_membership`, `firm_selection_required` o `ready`.

## Preferencia y selección

- Cero memberships activos/visibles: pantalla controlada sin montar el dashboard.
- Uno: firma automática, sin selector.
- Varios: cookie válida o selector mínimo, nunca el primero por defecto.
- Cookie ajena, revocada o suspendida: ignorada; se normaliza o borra al hidratar.
- La cookie `active_firm_id` es HttpOnly, SameSite=Lax, Path=/, Secure en producción
  y dura 30 días. Se escribe en una Server Action, después de revalidar la sesión.
  SSR no puede escribir cookies; por eso la selección automática se persiste al
  hidratar, aunque el contexto ya está resuelto antes de renderizar.
- `switchFirm` comprueba los memberships locales y vuelve a validarlos en servidor.
  Tras guardar la selección navega completamente a `/dashboard`, reiniciando los
  estados y caches de los módulos legados. Si falla, muestra error y permite reintentar.
- Rol y cookie solo controlan contexto/UX. RLS sigue autorizando cada operación.
  No se evalúan reglas de suscripción ni duración del trial en el frontend.

## Compatibilidad

La página inicial `/dashboard` muestra únicamente la bienvenida, la firma activa
y el rol del membership desde `useFirm()`. No importa las vistas de negocio
anteriores ni consulta agenda, expedientes, clientes o KPIs. Su grafo de imports
no alcanza `adminDatabase.ts` y no requiere una clave `service_role`.

`obtenerPerfilActual`, `obtenerPerfilActualServer` y `obtenerPerfilConRol` mantienen
sus interfaces. Su rol procede exclusivamente del membership activo; devuelven
`null` cuando no hay contexto operativo. La versión cliente consulta el endpoint
privado `/api/firm-context`, sin cache persistente, deduplicando solo requests
simultáneos. Los componentes nuevos deben usar `useFirm()`.

`UsuarioPerfil` permanece como DTO legado. `obtenerAbogados` y su mapper se
conservan para los listados de asignación existentes; no se usan para auth/tenancy.
El editor del perfil propio lee `profiles` y muestra el rol contextual. Antes de
escribir campos adicionales verifica que existan en la fila visible; si no están,
devuelve un error controlado, sin escribir a `perfiles` ni inventar columnas.

## Contrato de datos y límites

La única referencia local de base de datos es un volcado del modelo antiguo.
Se implementaron los campos del contrato entregado: `profiles.id/nombres`,
`firm_memberships.id/firm_id/user_id/role/status`,
`firms.id/nombre/slug/status`. Los resultados se validan en runtime.
Un profile inexistente o datos incompatibles producen `error`, nunca `admin`.
La identidad mostrada usa `nombres`; falta confirmar los campos de apellidos del
backend nuevo para completar el nombre. No se infieren desde metadata de Auth.

Las columnas de apellidos/teléfono del editor previo no están confirmadas para
`profiles`: su edición queda condicionada a que el backend las exponga realmente.
Si no existen, ese formulario necesita adaptación posterior al contrato real;
no se han creado migraciones, RPCs, enums ni políticas para suplirlo.

## Pruebas automáticas

Ejecutar `node --test tests/firm-context.test.mjs` (usa Node y TypeScript existentes).
Los tests ejecutan el repositorio, las actions, el middleware y las adaptaciones
reales con I/O simulado. Cubren sesión ausente, cero/una/varias firmas, cookies
inválidas, roles diferentes por firma, memberships invitados/suspendidos/revocados,
firmas invisibles, errores de consultas, ausencia de profile, inputs arbitrarios,
persistencia, login/logout y cookies SSR al redirigir.
También cubren la bienvenida para los cinco roles, la ausencia de contenido sin
contexto listo y el grafo de imports transitivos del dashboard y sus layouts,
limitando la infraestructura alcanzable a auth y contexto de firma.
No sustituyen la verificación de RLS y Auth contra el backend real.

## Pruebas manuales preparadas

Usar las credenciales QA existentes en un entorno con Supabase configurado.
No introducir contraseñas ni IDs QA en código productivo.

| Cuenta | Firma esperada | Rol esperado |
| --- | --- | --- |
| qa.admin.a@abogatech.test | QA Firma A | admin |
| qa.abogado.a@abogatech.test | QA Firma A | abogado |
| qa.finanzas.a@abogatech.test | QA Firma A | finanzas |
| qa.cliente.a@abogatech.test | QA Firma A | cliente |
| qa.admin.b@abogatech.test | QA Firma B | admin |
| qa.abogado.b@abogatech.test | QA Firma B | abogado |
| qa.cliente.b@abogatech.test | QA Firma B | cliente |

1. Sin sesión abrir `/dashboard`, una ruta anidada y `/asistente`: redirección a `/login`.
2. Iniciar sesión con cada QA: firma automática y rol correspondiente desde el primer render.
   Verificar en red que auth/tenancy solo consulta `profiles`, `firm_memberships`, `firms`.
   El dashboard inicial no debe realizar consultas de negocio antiguas ni mostrar
   errores de agenda o de clave administrativa ausente.
3. Recargar: misma firma; verificar atributos de `active_firm_id` en DevTools.
4. Sustituir la cookie en DevTools por una firma ajena: nunca adquiere su contexto/rol.
5. Con un usuario de prueba que YA tenga varias membresías activas: borrar cookie,
   abrir dashboard, seleccionar una firma y recargar. Debe conservarse la elección.
6. Probar `switchFirm` desde un consumidor de `useFirm`: otra firma disponible debe
   cambiar el rol; un ID ajeno debe rechazarse. El selector permanente es FRONT-02.
7. Con fixtures existentes sin memberships o con solo invitados/suspendidos:
   pantalla sin firma, sin sidebar ni consultas de negocio.
8. Con profile ausente o fallo de consulta: error recuperable, sin rol por defecto.
9. Cerrar sesión y abrir dashboard nuevamente, también usando Atrás: sin acceso autenticado.
10. Probar expiración/renovación de sesión: conservar las cookies emitidas por Supabase SSR.

No se modificaron memberships ni datos del backend para preparar estos casos.

## Validación de esta entrega

- 23 tests automáticos aprobados.
- `npx tsc --noEmit`: aprobado.
- ESLint de todos los archivos modificados/creados: aprobado.
- `npm run lint`: 69 errores y 44 warnings preexistentes en módulos ajenos.
  Se comparó con HEAD en una copia temporal: 72 errores y 46 warnings originales.
- `npm run build`: compilación y TypeScript aprobados; falla al recopilar datos de
  `/api/asistente` con `supabaseUrl is required`. El módulo existente instancia su
  cliente al importarse y este entorno carece de configuración Supabase.
- QA del desacoplamiento: servidor reiniciado con `npm run dev`, usando `.env`
  sin `SUPABASE_SERVICE_ROLE_KEY`. `/login` responde 200 y `/dashboard` sin sesión
  redirige a `/login` con 307. El login real con `qa.admin.a@abogatech.test` queda
  pendiente de su contraseña o de la comprobación del usuario en su navegador.
  Estas verificaciones no certifican login/logout autenticado ni RLS del SaaS real.

## Fuera de alcance

Los repositorios de clientes, casos, documentos, agenda, finanzas, equipo,
plantillas, auditoría y reportes, además de sus Server Actions y el asistente,
conservan consultas/autorizaciones del modelo anterior. Pueden fallar contra el
backend SaaS y requieren sus módulos FRONT posteriores. No se certifica la
seguridad multi-tenant de esas operaciones antiguas con esta entrega.

No se implementaron billing, onboarding, reglas de trial, rebranding del sidebar
ni selector permanente de cambio de firma (FRONT-02).

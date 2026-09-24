import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import ts from 'typescript';

const require = createRequire(import.meta.url);

// Ejecuta el código real con límites de I/O controlados, sin credenciales ni backend.
function loadModule(file, dependencies) {
  const source = readFileSync(new URL(file, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  });
  const exports = {};
  const moduleRequire = (name) => {
    if (Object.hasOwn(dependencies, name)) return dependencies[name];
    throw new Error(`Dependencia sin mock: ${name}`);
  };
  new Function('require', 'exports', outputText)(moduleRequire, exports);
  return exports;
}

const { resolveActiveFirm } = loadModule('../domain/entities/FirmContext.ts', {});
const roleLabelsModule = loadModule('../components/firm/roleLabels.ts', {});

const firm = (id) => ({ id, nombre: `Firma ${id}`, slug: `firma-${id}`, status: 'trial' });
const membership = (firmId, role = 'abogado', status = 'activo', userId = 'user') => ({
  id: `membership-${firmId}`, firm_id: firmId, user_id: userId, role, status,
});

test('el grafo de imports del dashboard solo alcanza infraestructura de auth y contexto de firma', () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const allowed = new Set([
    'infrastructure/repositories/authRepository.ts',
    'infrastructure/repositories/firmRepository.ts',
    'infrastructure/repositories/firmRepository.server.ts',
    'infrastructure/actions/firmActions.ts',
    'infrastructure/supabase/client.ts',
    'infrastructure/supabase/server.ts',
  ]);
  const visited = new Set();
  function visit(file) {
    if (visited.has(file)) return;
    visited.add(file);
    const path = relative(root, file);
    if (path.startsWith('infrastructure/')) {
      assert.ok(allowed.has(path), `Dependencia ajena a FRONT-01: ${path}`);
    }
    const { outputText } = ts.transpileModule(readFileSync(file, 'utf8'), {
      fileName: file,
      compilerOptions: { module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX },
    });
    for (const { fileName: specifier } of ts.preProcessFile(outputText, true, true).importedFiles) {
      if (!specifier.startsWith('@/') && !specifier.startsWith('.')) continue;
      if (/\.css$/.test(specifier)) continue;
      const target = specifier.startsWith('@/') ? resolve(root, specifier.slice(2)) : resolve(dirname(file), specifier);
      const resolved = ts.resolveModuleName(target, file, { moduleResolution: ts.ModuleResolutionKind.Bundler }, ts.sys).resolvedModule;
      assert.ok(resolved, `Import local sin resolver: ${specifier}`);
      visit(resolved.resolvedFileName);
    }
  }
  for (const entry of ['app/layout.tsx', 'app/dashboard/layout.tsx', 'app/dashboard/page.tsx', 'app/dashboard/loading.tsx']) {
    visit(resolve(root, entry));
  }
});

for (const [role, label] of Object.entries({ admin: 'Administrador', finanzas: 'Finanzas',
  asociado_senior: 'Asociado Senior', abogado: 'Abogado', cliente: 'Cliente' })) {
  test(`dashboard muestra la firma y el rol del membership activo: ${role}`, async () => {
    const context = await harness({ memberships: [membership('b', role)] }).repository.obtenerContextoUsuarioActualServer();
    const { default: Dashboard } = loadModule('../app/dashboard/page.tsx', {
      '@/components/firm/roleLabels': roleLabelsModule,
      'react/jsx-runtime': require('react/jsx-runtime'),
      '@/components/firm/FirmProvider': { useFirm: () => context },
    });
    const html = require('react-dom/server').renderToStaticMarkup(require('react').createElement(Dashboard));
    assert.match(html, /Bienvenido a Abogatech/);
    assert.match(html, /Firma b/);
    assert.match(html, /Usuario/);
    assert.ok(html.includes(label));
    if (role !== 'admin') assert.ok(!html.includes('Administrador'));
  });
}

test('dashboard no muestra firma ni rol cuando el contexto no está listo', () => {
  for (const status of ['unauthenticated', 'error', 'no_membership', 'firm_selection_required']) {
    const { default: Dashboard } = loadModule('../app/dashboard/page.tsx', {
      '@/components/firm/roleLabels': roleLabelsModule,
      'react/jsx-runtime': require('react/jsx-runtime'),
      '@/components/firm/FirmProvider': { useFirm: () => ({ status, firm: null, role: null, user: null }) },
    });
    assert.equal(require('react-dom/server').renderToStaticMarkup(require('react').createElement(Dashboard)), '');
  }
});

function harness({ user = { id: 'user', email: 'user@example.test' }, profile = { id: 'user', nombres: 'Usuario' },
  memberships = [membership('a')], firms = [firm('a'), firm('b')], cookie, failedTable } = {}) {
  const values = new Map(cookie ? [['active_firm_id', cookie]] : []);
  const writes = [];
  const queries = [];
  const cookieStore = {
    get: (key) => values.has(key) ? { value: values.get(key) } : undefined,
    set: (key, value, options) => { values.set(key, value); writes.push({ key, value, options }); },
    delete: (key) => { values.delete(key); writes.push({ key, deleted: true }); },
  };
  const tables = { profiles: profile ? [profile] : [], firm_memberships: memberships, firms };
  const client = {
    auth: { getUser: async () => ({ data: { user }, error: null }) },
    from(table) {
      assert.ok(Object.hasOwn(tables, table), `Tabla inesperada: ${table}`);
      const query = { table, filters: [], select: null };
      queries.push(query);
      let rows = tables[table];
      const result = (single = false) => ({ data: single ? rows[0] ?? null : rows,
        error: failedTable === table ? new Error('Error de consulta simulado') : null });
      const builder = {
        select: (columns) => { query.select = columns; return builder; },
        eq: (column, value) => {
          query.filters.push([column, value]); rows = rows.filter((row) => row[column] === value); return builder;
        },
        in: (column, list) => { rows = rows.filter((row) => list.includes(row[column])); return builder; },
        maybeSingle: async () => result(true),
        then: (resolve, reject) => Promise.resolve(result()).then(resolve, reject),
      };
      return builder;
    },
  };
  const repository = loadModule('../infrastructure/repositories/firmRepository.server.ts', {
    'server-only': {}, react: { cache: (fn) => fn }, 'next/headers': { cookies: async () => cookieStore },
    zod: require('zod'), '@/infrastructure/supabase/server': { createClient: async () => client },
    '@/domain/entities/FirmContext': { resolveActiveFirm, inactiveFirm: { firmId: null, firm: null, role: null, membership: null } },
  });
  const actions = loadModule('../infrastructure/actions/firmActions.ts', {
    '@/domain/entities/FirmContext': { resolveActiveFirm },
    '@/infrastructure/repositories/firmRepository.server': repository,
  });
  return { repository, actions, queries, values, writes, memberships };
}

test('sin sesión no consulta tablas ni devuelve roles', async () => {
  const h = harness({ user: null });
  const context = await h.repository.obtenerContextoUsuarioActualServer();
  assert.equal(context.status, 'unauthenticated');
  assert.equal(context.role, null);
  assert.equal(h.queries.length, 0);
});

test('sin memberships activos devuelve no_membership y descarta cookie', async () => {
  const h = harness({ memberships: [membership('a', 'admin', 'suspendido'), membership('b', 'admin', 'invitado')], cookie: 'a' });
  const context = await h.actions.sincronizarFirmaActiva();
  assert.equal(context.status, 'no_membership');
  assert.equal(context.role, null);
  assert.equal(context.firmId, null);
  assert.equal(h.values.has('active_firm_id'), false);
});

test('una firma se selecciona y persiste automáticamente, reemplazando una cookie ajena', async () => {
  const h = harness({ cookie: 'foreign-firm' });
  const context = await h.actions.sincronizarFirmaActiva();
  assert.equal(context.status, 'ready');
  assert.equal(context.firmId, 'a');
  assert.equal(context.role, 'abogado');
  assert.deepEqual(context.firm, firm('a'));
  assert.deepEqual(h.queries.find((query) => query.table === 'firms').select.split(',').map((column) => column.trim()),
    ['id', 'nombre', 'slug', 'status']);
  assert.equal(h.values.get('active_firm_id'), 'a');
  assert.equal(h.writes[0].options.httpOnly, true);
  assert.equal(h.writes[0].options.sameSite, 'lax');
  assert.ok(h.queries.find((query) => query.table === 'firm_memberships').filters.some(([column, value]) => column === 'user_id' && value === 'user'));
});

for (const cookie of [undefined, 'foreign-firm']) {
  test(`varias firmas requieren elección sin cookie válida (${cookie})`, async () => {
    const h = harness({ memberships: [membership('a', 'admin'), membership('b')], cookie });
    const context = await h.actions.sincronizarFirmaActiva();
    assert.equal(context.status, 'firm_selection_required');
    assert.equal(context.firmId, null);
    assert.equal(context.role, null);
    assert.equal(context.memberships.length, 2);
    assert.equal(h.values.has('active_firm_id'), false);
  });
}

test('cookie válida restaura el rol de esa firma, ignorando cualquier rol de profile', async () => {
  const h = harness({ profile: { id: 'user', nombres: 'Usuario', rol: 'admin', role: 'admin' },
    memberships: [membership('a', 'admin'), membership('b', 'cliente')], cookie: 'b' });
  const context = await h.repository.obtenerContextoUsuarioActualServer();
  assert.equal(context.firmId, 'b');
  assert.equal(context.role, 'cliente');
});

test('switchFirm valida el servidor y cambia firma y rol juntos', async () => {
  const h = harness({ memberships: [membership('a', 'admin'), membership('b', 'abogado')], cookie: 'a' });
  assert.equal((await h.actions.cambiarFirmaActiva('b')).success, true);
  const context = await h.repository.obtenerContextoUsuarioActualServer();
  assert.equal(context.firmId, 'b');
  assert.equal(context.role, 'abogado');
});

test('switchFirm rechaza firma arbitraria, inputs inválidos y membership revocado', async () => {
  const h = harness({ memberships: [membership('a'), membership('b')], cookie: 'a' });
  for (const invalid of ['foreign-firm', '', null, { firmId: 'b' }]) {
    assert.equal((await h.actions.cambiarFirmaActiva(invalid)).success, false);
  }
  h.memberships[1].status = 'suspendido';
  assert.equal((await h.actions.cambiarFirmaActiva('b')).success, false);
  assert.equal(h.values.get('active_firm_id'), 'a');
  assert.equal(h.writes.length, 0);
});

test('una firma invisible por RLS y memberships de otro usuario no crean contexto', async () => {
  const h = harness({ memberships: [membership('a'), membership('b', 'admin', 'activo', 'another-user')], firms: [firm('b')] });
  const context = await h.repository.obtenerContextoUsuarioActualServer();
  assert.equal(context.status, 'no_membership');
  assert.equal(context.role, null);
});

for (const options of [{ profile: null }, { memberships: [membership('a', 'unknown-role')] }, { failedTable: 'firm_memberships' }, { failedTable: 'firms' }]) {
  test(`perfil ausente/datos inválidos/error de consulta no asignan admin: ${JSON.stringify(options)}`, async (t) => {
    t.mock.method(console, 'error', () => {});
    const h = harness(options);
    const context = await h.repository.obtenerContextoUsuarioActualServer();
    assert.equal(context.status, 'error');
    assert.equal(context.role, null);
    assert.equal(context.firmId, null);
  });
}

test('middleware protege dashboard y conserva cookies SSR al redirigir', async () => {
  const { NextRequest, NextResponse } = require('next/server');
  const { middleware, config } = loadModule('../middleware.ts', {
    'next/server': { NextResponse },
    '@supabase/ssr': { createServerClient: (_url, _key, { cookies }) => ({ auth: {
      getUser: async () => {
        cookies.setAll([{ name: 'session-cookie', value: '', options: { path: '/', maxAge: 0 } }]);
        return { data: { user: null } };
      },
    } }) },
  });
  const response = await middleware(new NextRequest('https://example.test/dashboard/casos'));
  assert.equal(response.headers.get('location'), 'https://example.test/login');
  assert.equal(response.cookies.get('session-cookie').maxAge, 0);
  assert.ok(config.matcher.includes('/dashboard/:path*'));
  assert.ok(config.matcher.includes('/asistente/:path*'));
});

test('login conserva signInWithPassword y logout propaga errores sin simular éxito', async () => {
  const calls = [];
  const auth = loadModule('../infrastructure/repositories/authRepository.ts', {
    '@/infrastructure/supabase/client': { createClient: () => ({ auth: {
      signInWithPassword: async (credentials) => { calls.push(credentials); return { error: null }; },
      signOut: async () => ({ error: new Error('Sesión no cerrada') }),
    } }) },
    './firmRepository': {},
  });
  assert.deepEqual(await auth.iniciarSesion('user@example.test', 'test-password'), { success: true });
  assert.deepEqual(calls, [{ email: 'user@example.test', password: 'test-password' }]);
  await assert.rejects(auth.cerrarSesion(), /Sesión no cerrada/);
});

test('APIs antiguas devuelven el rol activo y null cuando no hay firma resuelta', async () => {
  let context = await harness({ memberships: [membership('a', 'finanzas')] }).repository.obtenerContextoUsuarioActualServer();
  const repository = loadModule('../infrastructure/repositories/usuarioRepository.ts', {
    '@/infrastructure/supabase/client': {},
    './firmRepository': { obtenerContextoUsuarioActual: async () => context },
  });
  const auth = loadModule('../infrastructure/repositories/authRepository.ts', {
    '@/infrastructure/supabase/client': {},
    './firmRepository': { obtenerContextoUsuarioActual: async () => context },
  });
  assert.equal((await repository.obtenerPerfilActual()).rol, 'finanzas');
  assert.equal((await auth.obtenerPerfilConRol()).rol, 'finanzas');
  context = await harness({ memberships: [] }).repository.obtenerContextoUsuarioActualServer();
  assert.equal(await repository.obtenerPerfilActual(), null);
  assert.equal(await auth.obtenerPerfilConRol(), null);
});

// FRONT-02: componentes reales, con el contexto como único límite simulado.
function layoutHarness(context) {
  const react = require('react');
  const jsx = require('react/jsx-runtime');
  const provider = { useFirm: () => context };
  const dependencies = {
    react, 'react/jsx-runtime': jsx,
    '@/components/firm/FirmProvider': provider, './FirmProvider': provider,
    '@/components/firm/roleLabels': roleLabelsModule, './roleLabels': roleLabelsModule,
  };
  const switcher = loadModule('../components/firm/FirmSwitcher.tsx', dependencies);
  const profile = loadModule('../components/layout/PerfilUsuario.tsx', dependencies);
  const { default: Layout } = loadModule('../app/dashboard/DashboardClientLayout.tsx', {
    ...dependencies,
    'next/navigation': { usePathname: () => '/dashboard' },
    '@/components/firm/FirmSwitcher': switcher,
    '@/components/layout/PerfilUsuario': profile,
    '@/components/layout/BotonSalir': { default: () => null },
    '@/components/WidgetAsistente': { default: () => null },
  });
  const render = (Component) => require('react-dom/server').renderToStaticMarkup(react.createElement(Component));
  return { html: () => render(Layout), switcher: switcher.FirmSwitcher, profile: () => render(profile.default) };
}

for (const [role, expected] of Object.entries({
  admin: ['Inicio', 'Expedientes', 'Clientes', 'Agenda', 'Finanzas', 'Plantillas', 'Equipo', 'Reportes', 'Configuración', 'Auditoría'],
  finanzas: ['Inicio', 'Finanzas', 'Mi Perfil'],
  asociado_senior: ['Inicio', 'Mis Casos', 'Mis Clientes', 'Agenda', 'Plantillas', 'Equipo', 'Reportes', 'Mi Perfil'],
  abogado: ['Inicio', 'Mis Casos', 'Mis Clientes', 'Agenda', 'Plantillas', 'Mi Perfil'],
  cliente: ['Inicio', 'Mi Expediente'],
})) {
  test(`sidebar muestra exactamente la navegación contextual de ${role}`, async () => {
    const context = await harness({ memberships: [membership('a', role)] }).repository.obtenerContextoUsuarioActualServer();
    const ui = layoutHarness(context);
    const html = ui.html();
    const nav = html.match(/<nav\b[^>]*>([\s\S]*?)<\/nav>/)[1];
    const labels = [...nav.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)].map((match) => match[1].replace(/<[^>]*>/g, '').trim());
    assert.deepEqual(labels, expected);
    assert.match(html, /ABOGATECH/);
    assert.match(html, /Gestión Legal/);
    assert.doesNotMatch(html, /Iturri|I&amp;A|CRM Legal/);
    assert.match(ui.profile(), /Usuario/);
    assert.match(ui.profile(), /user@example.test/);
    assert.ok(ui.profile().includes(roleLabelsModule.roleLabels[role]));
    assert.doesNotMatch(html, /<select/); // Una firma: contexto visible, sin selector.
  });
}

function findElement(node, type) {
  if (!node || typeof node !== 'object') return undefined;
  if (node.type === type) return node;
  return require('react').Children.toArray(node.props?.children).map((child) => findElement(child, type)).find(Boolean);
}

test('selector permanente delega en switchFirm y actualiza firma, perfil y menú al volver del servidor', async () => {
  const h = harness({ memberships: [membership('a', 'admin'), membership('b', 'abogado')], cookie: 'a' });
  let context = await h.repository.obtenerContextoUsuarioActualServer();
  const calls = [];
  let switched;
  const switchFirm = (id) => {
    calls.push(id);
    switched = h.actions.cambiarFirmaActiva(id);
    return switched;
  };
  let ui = layoutHarness({ ...context, isSwitching: false, switchFirm });
  const select = findElement(ui.switcher(), 'select');
  assert.equal(select.props.value, 'a');
  select.props.onChange({ target: { value: 'a' } });
  assert.deepEqual(calls, []);
  select.props.onChange({ target: { value: 'b' } });
  assert.deepEqual(calls, ['b']);
  assert.equal((await switched).success, true);
  // Nuevo contexto SSR, incluida la preferencia persistida por FRONT-01.
  context = await h.repository.obtenerContextoUsuarioActualServer();
  ui = layoutHarness({ ...context, isSwitching: false, switchFirm });
  assert.equal(findElement(ui.switcher(), 'select').props.value, 'b');
  assert.match(ui.profile(), /Abogado/);
  assert.doesNotMatch(ui.profile(), /Administrador/);
  const nav = ui.html().match(/<nav\b[^>]*>([\s\S]*?)<\/nav>/)[1];
  assert.doesNotMatch(nav, /Finanzas|Equipo|Reportes|Configuración|Auditoría/);
  assert.equal((await h.repository.obtenerContextoUsuarioActualServer()).firmId, 'b');
  findElement(ui.switcher(), 'select').props.onChange({ target: { value: 'a' } });
  await switched;
  ui = layoutHarness(await h.repository.obtenerContextoUsuarioActualServer());
  assert.match(ui.profile(), /Administrador/);
  assert.match(ui.html(), /Configuración/);
});

test('selector deshabilitado durante cambio y sin rol anterior visible', async () => {
  const context = await harness({ memberships: [membership('a', 'admin'), membership('b')], cookie: 'a' }).repository.obtenerContextoUsuarioActualServer();
  const calls = [];
  const ui = layoutHarness({ ...context, isSwitching: true, switchFirm: (id) => { calls.push(id); } });
  const select = findElement(ui.switcher(), 'select');
  assert.equal(select.props.disabled, true);
  assert.equal(select.props.value, '');
  select.props.onChange({ target: { value: 'b' } });
  assert.deepEqual(calls, []);
  const html = require('react-dom/server').renderToStaticMarkup(ui.switcher());
  assert.match(html, /Cambiando de firma/);
  assert.doesNotMatch(html, /Administrador/);
});

test('selección inicial muestra nombres y roles legibles sin UUID', async () => {
  const context = await harness({ memberships: [membership('a', 'admin'), membership('b', 'abogado')] }).repository.obtenerContextoUsuarioActualServer();
  const { FirmAccessState } = loadModule('../components/firm/FirmAccessState.tsx', {
    'react/jsx-runtime': require('react/jsx-runtime'),
    './FirmProvider': { useFirm: () => context },
    './roleLabels': roleLabelsModule,
    '@/components/ui/Button': { Button: ({ children }) => require('react').createElement('button', null, children) },
    '@/components/layout/BotonSalir': { default: () => null },
  });
  const html = require('react-dom/server').renderToStaticMarkup(require('react').createElement(FirmAccessState));
  assert.match(html, /Selecciona una firma/);
  assert.match(html, /Firma a/);
  assert.match(html, /Firma b/);
  assert.match(html, /Administrador/);
  assert.match(html, /Abogado/);
  assert.doesNotMatch(html, /membership-a|membership-b/);
});

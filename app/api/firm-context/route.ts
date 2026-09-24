import { NextResponse } from 'next/server';
import { obtenerContextoUsuarioActualServer } from '@/infrastructure/repositories/firmRepository.server';

export async function GET() {
  const context = await obtenerContextoUsuarioActualServer();
  return NextResponse.json(context, {
    status: context.status === 'unauthenticated' ? 401 : context.status === 'error' ? 503 : 200,
    headers: { 'Cache-Control': 'private, no-store' },
  });
}

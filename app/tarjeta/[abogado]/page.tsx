import { notFound } from 'next/navigation';
import { abogadosMock } from '@/infrastructure/data/abogadosMock';
import TarjetaVista from '@/components/tarjetas/TarjetaVista';

interface Props {
  params: Promise<{
    abogado: string;
  }>;
}

// 1. Corregimos generateMetadata haciéndola async y esperando los params
export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const perfil = abogadosMock[resolvedParams.abogado];
  
  if (!perfil) return { title: 'Perfil no encontrado' };
  
  return {
    title: `${perfil.nombre} | Iturri & Asociados`,
    description: `${perfil.cargo} en Iturri & Asociados. Contacto y oficinas.`,
  };
}

// 2. Corregimos la página principal haciéndola async y esperando los params
export default async function TarjetaAbogadoPage({ params }: Props) {
  const resolvedParams = await params;
  const perfil = abogadosMock[resolvedParams.abogado];

  if (!perfil) {
    notFound();
  }

  return <TarjetaVista perfil={perfil} />;
}
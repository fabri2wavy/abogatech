"use client";

import React from 'react';
import { AbogadoPerfil } from '@/infrastructure/data/abogadosMock';

interface Props {
  perfil: AbogadoPerfil;
}

export default function TarjetaVista({ perfil }: Props) {
  const ENLACES_GENERALES = {
    web: "https://www.abogados.bo/",
    linkedin: "https://www.linkedin.com/company/iturri-asociados-firma-de-abogados/",
    facebook: "https://www.facebook.com/iturriabogados/",
    twitter: "https://x.com/iturriabogados",
    instagram: "https://www.instagram.com/iturriabogados/?igshid=YmMyMTA2M2Y%3D",
    oficinaLaPaz: "https://www.google.com/maps/place/Iturri+%26+Asociados+Firma+de+Abogados/@-16.5452286,-68.0891828,3719m/data=!3m1!1e3!4m6!3m5!1s0x915f217fa16c057f:0xf04f6f24a3f180f5!8m2!3d-16.5452286!4d-68.0891828!16s%2Fg%2F11kjpjpqr0?entry=ttu&g_ep=EgoyMDI2MDYwMy4xIKXMDSoASAFQAw%3D%3D",
    oficinaSantaCruz: "https://www.google.com/maps/place/Estudio+Jur%C3%ADdico+N%C3%BA%C3%B1ez+del+Prado+Medina+%26+Asociados+Soc.+Civ.+(NPM-LEX+Soc.+Civ.)/@-17.7722752,-63.1912113,924m/data=!3m2!1e3!4b1!4m6!3m5!1s0x93f1e7a5ed0b98b3:0x8862ea232acdecd9!8m2!3d-17.7722752!4d-63.1912113!16s%2Fg%2F11r27_37mp?hl=es-BO&entry=ttu&g_ep=EgoyMDI2MDYwMy4xIKXMDSoASAFQAw%3D%3D"
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex flex-col items-center font-sans">

      {/* Contenedor Principal de la Tarjeta */}
      <div className="w-full max-w-md mx-auto min-h-screen shadow-2xl flex flex-col pb-12 bg-[#111111]">

        {/* Banner Rojo Corporativo */}
        <div className="bg-[#cc0000] h-40 w-full relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        </div>

        {/* Avatar Circular */}
        <div className="flex justify-center -mt-16 relative z-20">
          <div className="w-32 h-32 rounded-full border-4 border-[#111111] overflow-hidden shadow-2xl bg-gray-800">
            <img
              src={perfil.fotoUrl}
              alt={perfil.nombre}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(perfil.nombre)}&background=0D8ABC&color=fff`;
              }}
            />
          </div>
        </div>

        {/* Datos Principales */}
        <div className="text-center px-6 mt-5">
          <h1 className="text-3xl font-bold tracking-wide text-white">{perfil.nombre}</h1>
          <p className="text-red-500 font-medium mt-1 text-base">{perfil.cargo}</p>
          <p className="text-gray-400 text-xs tracking-[0.2em] uppercase mt-1">Iturri & Asociados</p>
        </div>

        {/* Bloques de Información y Enlaces */}
        <div className="px-6 mt-8 space-y-8">

          {/* Sede La Paz */}
          <div className="bg-gray-800/50 p-5 rounded-2xl border border-gray-700/50">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-[#cc0000]">📍</span>
              <p className="font-bold text-lg text-white tracking-wide">LA PAZ</p>
            </div>
            <div className="text-sm text-gray-300 space-y-1 pl-6">
              <p>Av. Costanera esq. Calle 9</p>
              <p>Edificio Costanera 1000, Torre 1, Piso 7, Of C</p>
              <p>Zona Calacoto</p>
              <p className="text-white font-semibold pt-2 flex items-center">
                <span className="mr-2">📞</span> Telf: (591) 2 2776776
              </p>
            </div>
          </div>

          {/* Sede Santa Cruz */}
          <div className="bg-gray-800/50 p-5 rounded-2xl border border-gray-700/50">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-[#cc0000]">📍</span>
              <p className="font-bold text-lg text-white tracking-wide">SANTA CRUZ</p>
            </div>
            <div className="text-sm text-gray-300 space-y-1 pl-6">
              <p>Calle Ricardo Jaimes Freire N° 7, Piso 4 Oficina 1411</p>
              <p>Edif. Suites Toborochi entre Av. San Martin y Enrique Finot</p>
              <p>Zona Equipetrol</p>
              <p className="text-white font-semibold pt-2 flex items-center">
                <span className="mr-2">📞</span> Telf: (591) 3 3877234
              </p>
            </div>
          </div>

          {/* Directorio Digital */}
          <div className="pt-2">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 pl-1">
              Directorio Digital
            </h2>
            <div className="space-y-3">
              {/* Enlaces Generales (Fijos para todos los perfiles) */}
              <LinkButton text="🌐 Página Web" href={ENLACES_GENERALES.web} />
              <LinkButton text="💼 LinkedIn" href={ENLACES_GENERALES.linkedin} />
              <LinkButton text="📘 Facebook" href={ENLACES_GENERALES.facebook} />
              <LinkButton text="🐦 X" href={ENLACES_GENERALES.twitter} />
              <LinkButton text="📸 Instagram" href={ENLACES_GENERALES.instagram} />
              <LinkButton text="🗺️ Oficina La Paz" href={ENLACES_GENERALES.oficinaLaPaz} />
              <LinkButton text="🗺️ Oficina Santa Cruz" href={ENLACES_GENERALES.oficinaSantaCruz} />

              {/* Enlace Dinámico y Personal (Cambia según el abogado) */}
              <LinkButton text="👤 LinkedIn Personal" href={perfil.linkedinPersonal} highlight />
            </div>
          </div>

          {/* Botón de Acción Principal */}
          <div className="pt-4">
            <a
              href={`mailto:${perfil.email}`}
              className="flex items-center justify-center w-full bg-[#cc0000] text-white py-4 rounded-xl font-bold hover:bg-red-700 active:scale-95 transition-all duration-200 shadow-lg shadow-red-900/50"
            >
              ✉️ Contactar por Correo
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}

// Componente auxiliar para renderizar los enlaces de forma segura
function LinkButton({ text, href, highlight = false }: { text: string; href?: string; highlight?: boolean }) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-between w-full py-3.5 px-5 rounded-xl font-medium transition-all duration-300 active:scale-95
        ${highlight
          ? 'bg-gray-800 border-2 border-gray-600 text-white hover:border-gray-400'
          : 'bg-gray-800/80 border border-gray-700/50 text-gray-200 hover:bg-gray-700 hover:text-white'
        }`}
    >
      <span>{text}</span>
      <span className="text-gray-500 text-sm">→</span>
    </a>
  );
}
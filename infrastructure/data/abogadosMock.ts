export interface AbogadoPerfil {
  id: string;
  nombre: string;
  cargo: string;
  fotoUrl: string;
  email: string;
  linkedinPersonal?: string;
}

export const abogadosMock: Record<string, AbogadoPerfil> = {
  "martin-iturri": {
    id: "martin-iturri",
    nombre: "Martín Iturri",
    cargo: "Director",
    fotoUrl: "/tarjetas/doctor_iturri.jpg",
    email: "miturri@abogados.bo",
    linkedinPersonal: "https://linkedin.com/in/martin-iturri"
  },
  "victor-martin": {
    id: "victor-martin",
    nombre: "Victor Martin",
    cargo: "Asociado Senior",
    fotoUrl: "/tarjetas/doctor_martin.jpg",
    email: "vmartin@abogados.bo",
    linkedinPersonal: "https://www.linkedin.com/in/v%C3%ADctor-martin-a7962548/"
  },
  "andrea-garrett": {
    id: "andrea-garrett",
    nombre: "Andrea Garrett",
    cargo: "Abogado",
    fotoUrl: "/tarjetas/doctora_andrea.jpg",
    email: "agarrett@abogados.bo",
    linkedinPersonal: "https://linkedin.com/in/andrea-garrett"
  },
  "zulema-espejo": {
    id: "zulema-espejo",
    nombre: "Zulema Espejo",
    cargo: "Asociada Senior",
    fotoUrl: "/tarjetas/doctora_zulema.jpg",
    email: "zespejo@abogados.bo",
    linkedinPersonal: "https://linkedin.com/in/zulema-espejp"
  }
};
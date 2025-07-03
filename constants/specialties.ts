export const PROFESSIONAL_SPECIALTIES = [
  "Fisioterapeuta",
  "Nutricionista",
  "Auxiliar de Enfermagem",
  "Cuidador de Idoso",
  "Técnico de Enfermagem",
  "Terapeuta Ocupacional",
  "Psicólogo",
  "Médico Geriatra",
  "Enfermeiro"
] as const;

export type ProfessionalSpecialty = typeof PROFESSIONAL_SPECIALTIES[number];


export function isValidSpecialty(specialty: string): boolean {
  return PROFESSIONAL_SPECIALTIES.includes(specialty as ProfessionalSpecialty);
}

// Função para normalizar uma especialidade (remover acentos, espaços extras, etc)
export function normalizeSpecialty(specialty: string): string {
  return specialty
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
} 
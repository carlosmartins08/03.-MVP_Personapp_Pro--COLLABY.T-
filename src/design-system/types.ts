import { colors } from './tokens';

export type ApproachType = keyof typeof colors.approach;
export type MoodLevel = 1 | 2 | 3 | 4 | 5;
export type MoodLabel = 'Muito mal' | 'Ansioso' | 'Neutro' | 'Bem' | 'Ótimo!';
export type ConsultStatus = 'pending' | 'confirmed' | 'active' | 'ended';
export type UserRole = 'patient' | 'professional' | 'admin';
export type VinculoStatus = 'PENDENTE' | 'ATIVO' | 'SUSPENSO' | 'ENCERRADO';

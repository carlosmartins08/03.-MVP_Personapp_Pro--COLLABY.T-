# Design System PersonApp
- Tokens em: src/design-system/tokens.ts
- Tipos em:  src/design-system/types.ts
- Importar via: import { colors, ApproachKey } from '@/design-system'
- Regra: nunca hardcode hex fora do tokens.ts
- Fonte: Roboto (carregada via <link> no index.html)
- Grid: base 4px (spacing.xs=4, sm=8, md=12...)

## Componentes Primitivos
Localizacao: src/design-system/components/
Importar: import { Button, Input, Card } from '@/design-system/components'
IMPORTANTE: estes NAO substituem os componentes em src/components/ui/ (shadcn).
As telas existentes continuam usando shadcn. Novas telas PersonApp usam este DS.

## Estados de Loading
Usar Skeleton de src/design-system/components/Skeleton para todo estado
de carregamento. Nunca usar spinners em tela cheia para dados parciais.

## AppHeader
3 variantes: patient (azul), professional (branco), minimal (transparente)
Usar em telas PersonApp. As telas existentes mantem seus headers atuais
ate migracao explicita no Marco 4.

## MoodFace — Check-in Emocional
5 niveis: 1=Muito mal, 2=Ansioso, 3=Neutro, 4=Bem, 5=Otimo!
Fundo da tela muda por nivel. Face SVG com boca animada por estado.
Props: value (1-5), onChange, onNext, showSkip, stepCurrent, stepTotal

## Componentes Clinicos
- AppHeader: headers das telas principais (3 variantes)
- MoodFace: check-in emocional (5 niveis)
- SOSButton: crise — ver docs/SAFETY_CRITICAL.md
- ConsultDarkCard: card de consulta (fundo escuro, 4 status)
- ApproachCard: card de abordagem psicologica (8 cores)

## Layouts
- LayoutPaciente.tsx: layout EXISTENTE das telas atuais (preservado)
- LayoutProfissional.tsx: layout EXISTENTE das telas atuais (preservado)
- PatientAppLayout.tsx: novo layout PersonApp com BottomNav + SOSButton FAB
- ProfessionalAppLayout.tsx: novo layout PersonApp com BottomNav sem SOS

# DS Reference — PersonApp
> Leia este arquivo ANTES de qualquer missao visual.
> E a fonte unica de verdade para cores, tokens e componentes.

## Status de implementacao

| Item | Documentado | Implementado | Coerente |
|------|-------------|--------------|---------|
| Tokens de cor | SIM | SIM | SIM |
| Tipografia (Roboto) | SIM | SIM | SIM |
| Spacing grid 4px | SIM | SIM | NAO |
| Button (5 variantes) | SIM | SIM | SIM |
| Input (5 estados) | SIM | SIM | SIM |
| Card (4 variantes) | SIM | SIM | SIM |
| PageHeader | SIM | SIM | SIM |
| Avatar | SIM | SIM | SIM |
| Badge | SIM | SIM | SIM |
| Tabs | SIM | SIM | SIM |
| Label | SIM | SIM | SIM |
| Textarea | SIM | SIM | SIM |
| AppHeader (3 variantes) | SIM | SIM | NAO |
| EmptyState | SIM | SIM | SIM |
| BottomNav | SIM | SIM | SIM |
| MoodFace (5 niveis) | SIM | SIM | SIM |
| SOSButton | SIM | SIM | SIM |
| ConsultDarkCard | SIM | SIM | SIM |
| ApproachCard | SIM | SIM | SIM |

## Tokens de cor corretos (fonte: src/design-system/tokens.ts)
> Spacing: usar xl2/xl3 ou 2xl/3xl — ambos funcionam
```ts
export const colors = {
  primary: {
    50: '#EAF1FB',
    100: '#C0D8F5',
    200: '#8AB4E8',
    300: '#4E89D4',
    400: '#3055A4',
    500: '#244085',
    600: '#192D65',
    700: '#0F1D45',
  },
  neutral: {
    0: '#FFFFFF',
    50: '#F5F7FA',
    100: '#EAEDF2',
    200: '#BFBFBF',
    300: '#737373',
    400: '#333333',
    500: '#1A1A1A',
  },
  surface: {
    page: '#F5F7FA',
    card: '#FFFFFF',
    dark: '#1A1A2E',
    header: '#3055A4',
  },
  semantic: {
    success: '#5CB85C',
    successBg: '#EBF8F0',
    warning: '#F0A500',
    warningBg: '#FFF8E6',
    error: '#D9534F',
    errorBg: '#FEEEED',
    sos: '#C0392B',
    sosBg: '#FFF0F0',
  },
  approach: {
    psicanalise: { bg: '#EAF1FB', text: '#0F1D45', accent: '#3055A4' },
    behaviorismo: { bg: '#FFF8E6', text: '#875F00', accent: '#F0A500' },
    humanismo: { bg: '#EBF8F0', text: '#166534', accent: '#5CB85C' },
    cognitivismo: { bg: '#F0F4FF', text: '#1E3A8A', accent: '#3B82F6' },
    psicPositiva: { bg: '#FEF9C3', text: '#713F12', accent: '#EAB308' },
    neuropsicologia: { bg: '#FDF2F8', text: '#701A75', accent: '#A855F7' },
    sistemica: { bg: '#FFF7ED', text: '#7C2D12', accent: '#F97316' },
    transpessoal: { bg: '#F0FDFA', text: '#134E4A', accent: '#14B8A6' },
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xl2: 24,
  xl3: 32,
  xl4: 40,
  xl5: 48,
  xl6: 64,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xl2: 24,
  full: 9999,
} as const;

export const typography = {
  display: { size: 32, weight: 700 },
  h1: { size: 24, weight: 700 },
  h2: { size: 20, weight: 600 },
  h3: { size: 18, weight: 500 },
  body: { size: 16, weight: 400 },
  bodySm: { size: 14, weight: 400 },
  caption: { size: 12, weight: 400 },
  label: { size: 12, weight: 500 },
} as const;
```

## Classes Tailwind disponiveis (fonte: tailwind.config.ts)
- ds-primary
- ds-primary-light
- ds-surface-dark
- ds-success
- ds-warning
- ds-error
- ds-sos
- font-roboto

## Importacao correta dos componentes
import { Button, Input, Card, Avatar, Badge } from '@/design-system/components'
import { AppHeader, BottomNav, MoodFace, SOSButton } from '@/design-system/components'
import { ConsultDarkCard, ApproachCard } from '@/design-system/components'

## Substituicao de componentes (shadcn -> DS)
- @/components/ui/tabs       -> @/design-system/components -> Tabs (mesma API)
- PageHeader (interno)       -> @/design-system/components -> PageHeader
- @/components/ui/label      -> @/design-system/components -> Label
- @/components/ui/textarea   -> @/design-system/components -> Textarea
- EmptyState (interno)       -> @/design-system/components -> EmptyState

### Manter em shadcn (sem equivalente DS)
- @/components/ui/dialog     -> manter shadcn
- @/components/ui/select     -> manter shadcn
- @/components/ui/toast      -> manter shadcn
- @/components/ui/sheet      -> manter shadcn
- @/components/ui/switch     -> manter shadcn
- @/components/ui/progress   -> manter shadcn

## Problemas de coerencia encontrados
- docs/DESIGN_SYSTEM.md diz que componentes do DS NAO substituem shadcn, enquanto docs/design-system.md trata o DS como fonte unica e completa.
- docs/DESIGN_SYSTEM.md e muito resumido e conflita com o nivel de detalhe da versao 2.0 em docs/design-system.md.
- AppHeader implementa variantes, mas a saudacao e "Ola, {nome}" sem emoji, diferente do "Ola {nome} ??" documentado.
- Spacing tokens usam nomes xl2/xl3/xl4 em tokens.ts, enquanto a doc usa 2xl/3xl/4xl.
- MoodFace usa cores hex hardcoded em vez de tokens (contraria a regra de nao hardcode).
- Varios componentes listados na doc 2.0 (AlertBanner, ProfessionalCard, ConsultationRoom, TimerDisplay, etc.) nao existem em src/design-system/components.

## Regras obrigatorias para qualquer missao visual
1. NUNCA usar hex hardcoded — sempre usar token do tokens.ts
2. NUNCA importar de @/components/ui nas telas PersonApp
3. SEMPRE usar font-roboto nas telas PersonApp
4. SEMPRE usar AppHeader no topo das telas personapp/
5. SOSButton NUNCA recebe disabled, NUNCA opacity < 1
6. Cores por abordagem vem de colors.approach[key] do tokens.ts




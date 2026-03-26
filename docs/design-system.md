# PersonApp Design System

Versao 2.0 - Marco 2026

React (Web) + React Native (Mobile) | Roboto | Grid 4px | AI Studio Ready

**1. Visao Geral**
O Design System da PersonApp e o conjunto completo de decisoes visuais, tokens, componentes e prompts de IA que garantem consistencia e velocidade no desenvolvimento do produto. E a fonte unica de verdade para toda a equipe de design e engenharia.

| Dimensao | Decisao |
| --- | --- |
| Stack | React (Web) + React Native (Mobile) |
| Linguagem | TypeScript em todo o projeto |
| Fonte | Roboto - Google Fonts (Web) / built-in (RN) |
| Grid base | 4px - todos os espacamentos sao multiplos de 4 |
| Cor primaria | Azul PersonApp #3055A4 |
| Ferramenta de geracao | Google AI Studio (Gemini 2.5 Pro) |
| Estilo visual | Flat, clean, acolhedor - sem gradientes decorativos |

**2. Tokens de Cor**
Use sempre os tokens - nunca hardcode hex direto nos componentes. Isso garante que mudancas de tema sejam aplicadas globalmente.

**2.1 Cor Primaria - Azul PersonApp**
| Token | Hex | Uso |
| --- | --- | --- |
| primary.50 | #EAF1FB | Backgrounds de campos e cards leves |
| primary.100 | #C0D8F5 | Hover states, badges leves |
| primary.200 | #8AB4E8 | Borders de elementos informativos |
| primary.300 | #4E89D4 | Estados intermediarios |
| primary.400 | #3055A4 | COR PRINCIPAL - botoes, links, headers, icones ativos |
| primary.500 | #244085 | Hover do botao primario |
| primary.600 | #192D65 | Pressed state, texto sobre fundo claro |
| primary.700 | #0F1D45 | Texto sobre backgrounds azuis claros |

**2.2 Neutros**
| Token | Hex | Uso |
| --- | --- | --- |
| neutral.0 | #FFFFFF | Superficies de cards, fundo de inputs |
| neutral.50 | #F5F7FA | Fundo de pagina, backgrounds secundarios |
| neutral.100 | #EAEDF2 | Bordas padrao, divisores |
| neutral.200 | #BFBFBF | Texto desabilitado, icones inativos |
| neutral.300 | #737373 | Texto secundario, subtitulos, labels |
| neutral.400 | #333333 | Texto primario - corpo e titulos |
| neutral.500 | #1A1A1A | Texto de alto contraste |
| surface.dark | #1A1A2E | Cards de consulta, tela de check-in de humor |

**2.3 Semanticas**
| Categoria | Background | Principal | Texto | Uso na PersonApp |
| --- | --- | --- | --- | --- |
| Success | #EBF8F0 | #5CB85C | #2D7B2D | CRP verificado, consulta confirmada, atividade concluida |
| Warning | #FFF8E6 | #F0A500 | #875F00 | Vinculo pendente, pagamento atrasado, prazo proximo |
| Error | #FEEEED | #D9534F | #8B1A1A | Erro de login, CRP invalido, falha de pagamento |
| Info | #EAF1FB | #3055A4 | #0F1D45 | Notificacoes informativas, dicas, contexto |
| SOS | #FFF0F0 | #C0392B | #7B0000 | Botao de crise - NUNCA desabilitado |

**2.4 Cores por Abordagem Psicologica**
Cada abordagem tem sua propria cor. Usada em cards do profissional, badges de especializacao e na triagem da anamnese.

| Abordagem | Background | Texto | Accent | Token |
| --- | --- | --- | --- | --- |
| Psicanalise | #EAF1FB | #0F1D45 | #3055A4 | approach.psicanalise |
| Behaviorismo | #FFF8E6 | #875F00 | #F0A500 | approach.behaviorismo |
| Humanismo | #EBF8F0 | #166534 | #5CB85C | approach.humanismo |
| Cognitivismo | #F0F4FF | #1E3A8A | #3B82F6 | approach.cognitivismo |
| Psicologia Positiva | #FEF9C3 | #713F12 | #EAB308 | approach.psicPositiva |
| Neuropsicologia | #FDF2F8 | #701A75 | #A855F7 | approach.neuropsicologia |
| Sistêmica | #FFF7ED | #7C2D12 | #F97316 | approach.sistemica |
| Transpessoal | #F0FDFA | #134E4A | #14B8A6 | approach.transpessoal |

**3. Tipografia**
Fonte: Roboto. Importar via Google Fonts (Web) ou incluir nos assets (React Native). Dois pesos apenas no corpo: 400 regular e 500 medium. Bold (700) reservado para titulos e numeros display.

| Token | Tamanho | Peso | Uso |
| --- | --- | --- | --- |
| text.display | 32px | 700 | Hero headlines, cronometro de consulta, numeros de metricas |
| text.h1 | 24px | 700 | Titulos de tela - "Ola, Maria", "Sua agenda" |
| text.h2 | 20px | 600 | Titulo de secao dentro de uma tela |
| text.h3 | 18px | 500 | Subtitulos, cabecalhos de cards |
| text.body | 16px | 400 | Corpo de texto - descricoes, conteudo principal |
| text.bodySm | 14px | 400 | Texto de apoio, metadados de cards |
| text.caption | 12px | 400 | Datas, timestamps, textos de rodape |
| text.label | 12px | 500 | Labels de campos, uppercase com letter-spacing 0.08em |

Regras de tipografia:
- Nunca usar font-weight abaixo de 400 ou acima de 700.
- Letter-spacing apenas em labels uppercase (0.04em a 0.08em).
- Line-height: 1.2 (tight) para titulos, 1.5 (base) para corpo, 1.7 (relaxed) para blocos longos.
- Truncamento com text-overflow: ellipsis em nomes de pacientes e profissionais - nunca quebrar linha em cards.

**4. Espacamento e Layout**
**4.1 Escala de Espacamento - Grid 4px**
| Token | Valor | Uso tipico |
| --- | --- | --- |
| spacing.xs | 4px | Gap entre icone e texto dentro de um botao |
| spacing.sm | 8px | Padding interno de badges, gap entre tags |
| spacing.md | 12px | Gap entre campos de formulario, padding de rows compactos |
| spacing.lg | 16px | Padding lateral de telas (mobile), gap entre cards |
| spacing.xl | 20px | Padding de header mobile |
| spacing.2xl | 24px | Padding de cards, secoes de dashboard |
| spacing.3xl | 32px | Espacamento entre secoes de tela |
| spacing.4xl | 40px | Margem superior de conteudo apos headers |
| spacing.5xl | 48px | Altura da bottom nav, headers fixos |
| spacing.6xl | 64px | Espacamento generoso entre blocos de conteudo |

**4.2 Border Radius**
| Token | Valor | Uso |
| --- | --- | --- |
| radius.sm | 4px | Badges, pills, tags pequenas |
| radius.md | 8px | Inputs, botoes pequenos, chips |
| radius.lg | 12px | Cards, modais, botoes principais |
| radius.xl | 16px | Sheets, panels, bottom sheets |
| radius.2xl | 24px | Telas de onboarding, cards heroes |
| radius.full | 9999px | Avatares, FABs, pills de status |

**4.3 Breakpoints (Web)**
| Breakpoint | Largura | Layout |
| --- | --- | --- |
| mobile | 320px - 767px | Single column, bottom nav, cards full width |
| tablet | 768px - 1023px | 2 colunas, sidebar colapsavel |
| desktop | 1024px+ | Sidebar fixa 240px + conteudo principal |

**4.4 Alturas de Componentes Interativos**
| Componente | Altura mobile | Altura web | Regra |
| --- | --- | --- | --- |
| Botao primary full | 52px | 48px | Toque minimo 44px (WCAG) |
| Botao md padrao | 44px | 40px | Padrao de interacao |
| Botao sm | 36px | 32px | Acoes secundarias compactas |
| Input de texto | 48px | 44px | Conforto de digitacao |
| Bottom nav | 64px | N/A | Zona de polegar alcancavel |
| Header de tela | 64px - 80px | 56px | Espaco para greeting + nav |
| SOS FAB | 56x56px | N/A | Sempre visivel, toque generoso |

**5. Componentes**
**5.1 Mapa de Componentes**
| Componente | Web | Mobile | RF Relacionado | Prioridade |
| --- | --- | --- | --- | --- |
| Button | Sim | Sim | Todos | Sprint 1 |
| Input | Sim | Sim | RF001, RF005 | Sprint 1 |
| Card | Sim | Sim | RF015, RF021 | Sprint 1 |
| Badge | Sim | Sim | RF029, RF030 | Sprint 1 |
| Avatar | Sim | Sim | RF005, RF029 | Sprint 1 |
| AppHeader | Sim | Sim | Todos | Sprint 2 |
| BottomNav | - | Sim | RF021, RF022 | Sprint 2 |
| MoodFace | Sim | Sim | RF017, RF033 | Sprint 3 |
| AnamnesisForm | Sim | Sim | RF014 | Sprint 3 |
| SOSButton | Sim | Sim | RF035 | Sprint 4 |
| AlertBanner | Sim | Sim | RF027, RF035 | Sprint 4 |
| ProfessionalCard | Sim | Sim | RF015, RF029 | Sprint 5 |
| ApproachCard | Sim | Sim | RF022, RF029 | Sprint 5 |
| ConsultDarkCard | Sim | Sim | RF018, RF025 | Sprint 6 |
| ConsultationRoom | Sim | Sim | RF018 | Sprint 6 |
| TimerDisplay | Sim | Sim | RF018 | Sprint 6 |
| PatientDashboard | Sim | Sim | RF021 | Sprint 7 |
| ProfessionalDashboard | Sim | Sim | RF022 | Sprint 7 |
| DiaryEntry | Sim | Sim | RF017 | Sprint 8 |
| NotificationItem | Sim | Sim | RF027 | Sprint 8 |
| PaymentForm | Sim | Sim | RF024 | Sprint 9 |

**5.2 Button - Especificacao**
| Variante | Fundo | Texto | Borda | Uso |
| --- | --- | --- | --- | --- |
| primary | #3055A4 | #FFFFFF | Nenhuma | Acao principal de cada tela |
| secondary | Transparente | #3055A4 | 1.5px #3055A4 | Acao secundaria importante |
| ghost | Transparente | #3055A4 | Nenhuma | Acoes terciarias, links de navegacao |
| danger | #D9534F | #FFFFFF | Nenhuma | Encerrar consulta, deletar, acoes destrutivas |
| sos | #C0392B | #FFFFFF | Nenhuma | EXCLUSIVO para o botao de crise - nunca disabled |
| disabled | #EAEDF2 | #BFBFBF | Nenhuma | Estado inativo - opacity 0.4 no container |

**5.3 Input - Estados**
| Estado | Borda | Sombra de foco | Background |
| --- | --- | --- | --- |
| default | 1.5px #BFBFBF | Nenhuma | #FFFFFF |
| focus | 1.5px #3055A4 | 0 0 0 3px rgba(48,85,164,0.18) | #FFFFFF |
| error | 1.5px #D9534F | 0 0 0 3px rgba(217,83,79,0.15) | #FEEEED |
| success | 1.5px #5CB85C | Nenhuma | #FFFFFF |
| disabled | 1.5px #EAEDF2 | Nenhuma | #F5F7FA |

**5.4 MoodFace - Especificacao**
Componente exclusivo PersonApp. Face SVG expressiva com animacao por estado emocional. Fundo escuro adaptativo.

| Nivel | Label | Fundo de tela | Circulo face | Boca (path SVG) |
| --- | --- | --- | --- | --- |
| 1 | Muito mal | #2D1A1A | #FEEEED | M48 98 Q70 88 92 98 (curva pra cima = triste) |
| 2 | Ansioso | #2D2610 | #FFF8E6 | M50 93 Q70 89 90 93 (reta levemente curvada) |
| 3 | Neutro | #222230 | #EAEDF2 | M52 90 Q70 90 88 90 (reta) |
| 4 | Bem | #1A2D1E | #EBF8F0 | M48 88 Q70 102 92 88 (sorriso leve) |
| 5 | Otimo! | #1A1D2D | #EAF1FB | M44 86 Q70 108 96 86 (sorriso largo + bochechas) |

**5.5 SOSButton - Regras Criticas**
ATENCAO: Este e o componente com maior criticidade etica do projeto. Uma falha visual pode custar uma vida.

- Cor: #C0392B - NUNCA pode ser alterada por tema ou configuracao.
- NUNCA recebe prop `disabled` - omitir intencionalmente das props.
- NUNCA recebe opacity abaixo de 1.0.
- NUNCA e ocultado por `display:none`, `visibility:hidden` ou `opacity:0`.
- Posicao: sempre visivel - FAB fixo (mobile) ou item destacado na nav.
- Acessibilidade: `accessibilityRole='button'`, label `Acionar suporte de crise`.
- Ao tocar: abrir modal com 3 opcoes (CVV 188, Rede de apoio, Ajuda proxima).
- Texto no modal: "Voce nao esta sozinho. Estamos aqui." - sempre visivel.

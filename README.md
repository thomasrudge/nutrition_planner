# NutriSnap

> Rastreamento de nutrição por IA para comida brasileira. Envie uma foto do seu prato e receba identificação automática dos alimentos, estimativa de quantidade e cálculo completo de macros.

🔗 **Live:** https://nutrisnap-sigma.vercel.app

🔗 **Video funcionamento principal:** https://youtu.be/6gfQp8dZk-U

---

## O que faz

A maioria dos apps de contagem de calorias é feita para comida ocidental e depende de busca manual. O NutriSnap resolve isso para refeições brasileiras: arroz, feijão, farofa, mandioca, purê e outras 13 categorias são reconhecidas a partir de uma única foto, com a quantidade estimada pela área segmentada.

Projeto final da disciplina de Visão Computacional no Insper.

---

## Modelo

- **Arquitetura:** YOLO11s-seg (segmentação de instâncias)
- **Treino:** fine-tuning completo, 80 épocas, GPU T4
- **Classes:** 18 categorias de comida brasileira
- **Resultados:** Mask mAP50 = 0.603, mAP50-95 = 0.471

Dataset construído a partir de três fontes: FoodSeg103 (filtrado), Brazilian Food (Mendeley) e ~400 imagens do Pinterest anotadas manualmente. A anotação usou uma ferramenta semi-automática própria em Streamlit + SAM 2 (clique → máscara → classe), com desfoque Gaussiano e seleção de canal RGB para alimentos granulares como feijão e farofa.

A estimativa de quantidade usa **fração da área** (área da máscara / área da imagem), invariante ao redimensionamento, multiplicada pela área do prato (24cm ⌀) e pela densidade específica de cada classe.

---

## Resultados

### Gerais

| Métrica | Valor |
|--------|-------|
| Mask mAP50 | 0.603 |
| Mask mAP50-95 | 0.471 |
| Box mAP50 | 0.615 |
| Melhoria sobre o baseline | +20% |

### Destaques por classe

| Classe | Mask mAP50 |
|-------|------------|
| purê | 0.884 |
| farofa | 0.857 |
| brócolis | 0.780 |
| cenoura | 0.762 |
| feijão | 0.730 |
| arroz | 0.726 |
| tomate | 0.712 |
| pizza | 0.662 |
| macarrão | 0.638 |
| pão | 0.608 |
| batata frita | 0.582 |
| batata cozida | 0.519 |
| carne bovina | 0.510 |
| ovo | 0.415 |
| frango | 0.331 |
| mandioca | 0.291 |
| peixe | 0.230 |

### Principais ganhos

- **Dados brasileiros importaram mais que tamanho do modelo:** enriquecer o dataset com imagens do Pinterest fez o feijão saltar de 0.40 → 0.73 e deu confiabilidade estatística a classes antes sub-representadas (purê, farofa, mandioca)
- **YOLO11s superou YOLO11m em custo-benefício** — o modelo maior trouxe ganho marginal frente ao custo adicional de treino

### Limitações conhecidas

- A estimativa de quantidade depende bastante do enquadramento (não há referência real de escala); mitigada por orientação ao usuário ("enquadre o prato") e edição manual na tela de revisão
- Classes visualmente ambíguas continuam difíceis: frango vs outras carnes claras, e peixe (grande variedade de espécies e preparações)

---

## Stack

- **Frontend:** React + Vite + TypeScript + Tailwind
- **Backend:** NestJS + TypeORM + PostgreSQL
- **Serviço de IA:** Python + FastAPI + Ultralytics YOLO
- **Armazenamento:** Supabase (Postgres + CDN para as fotos)

---

## Arquitetura de Deploy

| Serviço | Plataforma |
|---------|----------|
| Frontend | Vercel |
| Backend | Render |
| Serviço de IA | Hugging Face Spaces (16GB RAM) |
| Banco + CDN | Supabase |

---

## Estrutura do Projeto

```
nutrition_planner/
├── backend/      # API NestJS
├── ai/           # Python + FastAPI + YOLO
└── README.md
```

---

## Endpoints da API

> Base URL: `http://localhost:3000`

### Auth
| Método | Endpoint | Descrição |
|--------|----------|-------------|
| POST | `/auth/signup` | Registra um novo usuário, retorna JWT |
| POST | `/auth/signin` | Faz login, retorna JWT |

### Users
| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/users/:id` | Busca usuário por ID |
| GET | `/users/email/:email` | Busca usuário por email |
| PATCH | `/users/:id` | Atualiza usuário |
| DELETE | `/users/:id` | Remove usuário |

### Meals
| Método | Endpoint | Descrição |
|--------|----------|-------------|
| POST | `/meal/analyze` | Envia foto, roda IA, retorna análise (sem persistir) |
| POST | `/meal/save` | Persiste refeição + itens após revisão do usuário |
| POST | `/meal/reclassify` | Recalcula nutrição quando o usuário edita um item |
| GET | `/meal/user` | Retorna todas as refeições do usuário atual |
| GET | `/meal/date/:date` | Retorna refeições por data |
| GET | `/meal/:id` | Busca refeição por ID |
| PATCH | `/meal/:id` | Atualiza refeição |
| DELETE | `/meal/:id` | Remove refeição |

### User Goals
| Método | Endpoint | Descrição |
|--------|----------|-------------|
| POST | `/user-goal` | Cria metas do usuário |
| GET | `/user-goal` | Busca metas do usuário atual |
| PATCH | `/user-goal` | Atualiza metas do usuário |

---

## Setup Local

Clone o repositório:

```bash
git clone <repository-url>
cd nutrition_planner
```

### Serviço de IA (Python)

```bash
cd ai
uv venv
uv sync
source .venv/bin/activate   # ou .venv\Scripts\activate no Windows
uvicorn main:app --reload --port 8001
```

### Backend (NestJS)

```bash
cd backend
npm install
npm run start:dev
```

Configure o `.env` em `backend/` e `ai/` com as credenciais necessárias (Supabase, banco, JWT secret, URL do serviço de IA).

---


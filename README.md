# AXIS — Planeje viagens com quem importa

## Descrição

O AXIS é um aplicativo mobile de planejamento de viagens em grupo. A proposta é facilitar a organização de viagens entre amigos e familiares, reunindo destinos, datas, roteiros, atividades, orçamento e despesas em um único lugar. Assim, os participantes não precisam depender de mensagens dispersas e planilhas separadas para planejar uma viagem.

## Objetivo

Oferecer uma plataforma simples e intuitiva para planejar viagens, organizar itinerários e acompanhar informações e gastos em um só aplicativo, com foco na experiência de quem viaja em grupo.

## Tecnologias Utilizadas

### Mobile
- React Native
- Expo
- Expo Router
- TypeScript
- expo-blur
- expo-linear-gradient
- expo-image
- expo-haptics

### Backend (2TW)
- Node.js
- Firebase Authentication
- Firebase Firestore

### Desenvolvimento e hospedagem
- npm
- Git e GitHub
- Vercel
- Render

## Funcionalidades

- Tela inicial e apresentação do AXIS
- Cadastro e login de usuários
- Exploração de destinos e países
- Consulta de informações sobre destinos
- Criação e organização de viagens
- Escolha de datas, interesses e orçamento
- Criação e edição de roteiros e atividades
- Marcação de atividades concluídas
- Área de viagens salvas
- Telas de despesas e organização financeira
- Perfil do usuário
- Interface nos modos claro e escuro
- Recursos de convite e participação em viagens em desenvolvimento

## Estrutura do Projeto

```text
AXIS/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── public/
│   │   ├── discover.tsx
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── plan.tsx
│   │   ├── plan-2.tsx
│   │   ├── plan-3.tsx
│   │   └── plan-4.tsx
│   └── logic/
│       ├── _layout.tsx
│       ├── home.tsx
│       ├── about.tsx
│       ├── profile.tsx
│       ├── country/[id].tsx
│       ├── destination/[id].tsx
│       ├── expenses/
│       │   ├── [id].tsx
│       │   └── new.tsx
│       └── trips/
│           ├── index.tsx
│           ├── create.tsx
│           ├── method.tsx
│           ├── duration.tsx
│           ├── preferences.tsx
│           ├── budget.tsx
│           ├── itinerary.tsx
│           ├── expenses.tsx
│           ├── join.tsx
│           ├── tripDraft.ts
│           └── tripStore.ts
├── assets/
│   └── images/                # Fotos dos destinos, países e identidade visual
├── components/
│   ├── ui/
│   ├── AuthScreen.tsx
│   ├── AxisToggle.tsx
│   ├── GlassBackdrop.tsx
│   ├── GlassBottomNav.tsx
│   ├── GlassFrost.tsx
│   ├── TripInvitationModal.tsx
│   └── UserAvatar.tsx
├── constants/
│   ├── glass.ts
│   └── theme.ts
├── contexts/
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── hooks/
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts
│   └── use-theme-color.ts
├── lib/
│   └── firebase.ts
├── scripts/
│   └── reset-project.js
├── backend/                   # API Node.js hospedada no Render
│   ├── package.json
│   └── server.js
├── .gitignore
├── app.json
├── eas.json
├── eslint.config.js
├── expo-env.d.ts
├── package.json
├── package-lock.json
├── tsconfig.json
├── vercel.json
└── README.md
```

A pasta `app` reúne as telas e rotas do aplicativo. `components` contém componentes reutilizáveis; `contexts` e `hooks` organizam estados e comportamentos compartilhados; `lib/firebase.ts` concentra a configuração do Firebase; `assets/images` reúne as imagens; e `backend` contém o servidor Node.js criado para publicação no Render.

## Como Executar

### Pré-requisitos

- Node.js e npm instalados
- Git instalado
- Celular com o aplicativo Expo Go instalado
- Computador e celular conectados à mesma rede, quando utilizada a conexão local

### Passo a passo para testar no Expo Go

1. Clone o repositório:

```bash
git clone https://github.com/laurazxk/AXIS.git
```

2. Entre na pasta do projeto:

```bash
cd AXIS
```

3. Instale as dependências:

```bash
npm install
```

4. Crie um arquivo chamado `.env` na raiz do projeto, no mesmo nível do `package.json`.

5. Acesse https://www.invertexto.com/axisexpo, copie o conteúdo disponibilizado e cole no arquivo `.env`. Salve o arquivo. Não publique o `.env` no GitHub.

6. Inicie o Expo:

```bash
npx expo start
```

7. Aguarde a exibição do QR Code no terminal. Com o Expo Go instalado no celular, escaneie o código QR (no iPhone, também é possível utilizar a câmera do aparelho).

8. Aguarde o carregamento do projeto no Expo Go para utilizar o AXIS.

## Deploy

### Aplicativo — Vercel
https://axis-alpha-eight.vercel.app/

### Backend — Render
https://axis-backend-cj26.onrender.com

### Site de apresentação do protótipo
https://axisapp2tw.vercel.app/

## Aplicativo Mobile

O AXIS é desenvolvido em React Native com Expo e utiliza o Expo Router para navegação entre telas. O aplicativo possui apresentação inicial, autenticação, exploração de destinos, planejamento de viagens, roteiros, despesas e perfil. Para executar a versão mobile em um dispositivo físico, siga o procedimento único descrito em **Como Executar**.

## Integrantes

- Julia Bandeira Freitas da Silva
- Kyara Murayama de Oliveira
- Laila Camile Gonçalves de Menezes
- Laura Santos Marques

## Pitch

Planejar uma viagem em grupo pode ser complicado: informações se perdem em conversas, decisões ficam espalhadas e os gastos nem sempre são fáceis de acompanhar. O AXIS foi criado para reunir o planejamento em um único aplicativo, ajudando amigos e familiares a organizar destinos, roteiros, atividades e despesas de maneira mais prática e colaborativa.

Vídeo do pitch: https://youtu.be/0IaSEN9XK6Q?si=dz0xAtf5fzbCAxAB

## Links Importantes

- Repositório GitHub: https://github.com/laurazxk/AXIS
- Deploy Vercel: https://axis-alpha-eight.vercel.app/
- Backend Render: https://axis-backend-cj26.onrender.com
- Protótipo no Figma: https://www.figma.com/design/63TQRcoanS9PuaG0fYvoIy/Axis-prot%C3%B3tipo?node-id=0-1&t=RaJ1OQYpsrp9BYkv-1
- Site de apresentação do protótipo: https://axisapp2tw.vercel.app/
- Pitch: https://youtu.be/0IaSEN9XK6Q?si=dz0xAtf5fzbCAxAB

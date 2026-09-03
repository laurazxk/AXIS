# AXIS — Planeje viagens com quem importa

## Descrição

O **Axis** é um aplicativo mobile de planejamento de viagens em grupo. Ele resolve o problema da desorganização entre amigos que viajam juntos: roteiros bagunçados, gastos mal divididos e falta de sincronização entre os participantes.

A proposta é centralizar tudo em um único lugar — destino, datas, atividades, orçamento e divisão de despesas — de forma simples e colaborativa.

## Objetivo

Permitir que grupos de amigos ou familiares planejem suas viagens dentro de um único aplicativo, com criação de itinerários, organização de destinos e controle de despesas.

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
- expo-symbols

### Desenvolvimento

- Node.js
- npm
- Git
- GitHub

### Deploy

- Vercel
- Render

## Funcionalidades

- Tela de splash do aplicativo
- Telas de apresentação do Axis
- Cadastro de usuário
- Login de usuário
- Exploração de destinos
- Exploração de países populares
- Visualização de informações de países
- Visualização de informações de destinos
- Criação de roteiro de viagem
- Organização de atividades
- Definição de datas e orçamento
- Controle de despesas
- Divisão de gastos entre participantes
- Área de viagens
- Perfil do usuário
- Navegação entre as principais áreas do aplicativo
- Interface adaptada para dispositivos móveis

## Estrutura do Projeto

```text
AXIS/
├── app/
│   ├── logic/
│   │   ├── _layout.tsx
│   │   ├── country.tsx
│   │   ├── country/
│   │   │   └── [id].tsx
│   │   ├── destination.tsx
│   │   ├── destination/
│   │   │   └── [id].tsx
│   │   ├── expenses.tsx
│   │   ├── home.tsx
│   │   ├── profile.tsx
│   │   └── trips.tsx
│   │
│   ├── public/
│   │   ├── discover.tsx
│   │   ├── login.tsx
│   │   ├── plan.tsx
│   │   ├── plan-2.tsx
│   │   ├── plan-3.tsx
│   │   ├── plan-4.tsx
│   │   └── register.tsx
│   │
│   ├── _layout.tsx
│   └── index.tsx
│
├── assets/
│   └── images/
│       ├── bigben.jpg
│       ├── burjkhalifa.jpg
│       ├── coliseu.jpg
│       ├── cristo.jpg
│       ├── france.jpg
│       ├── greece.jpg
│       ├── italy.jpg
│       ├── japan.jpg
│       ├── libertystatue.jpg
│       ├── logo.png
│       ├── machupicchu.jpg
│       ├── perfil.jpg
│       ├── planeje 1.png
│       ├── planeje 2.png
│       ├── planeje 3.png
│       ├── planeje 4.png
│       ├── portugal.jpg
│       ├── santorini.jpg
│       ├── sk.jpg
│       ├── spain.jpg
│       ├── switzerland.jpg
│       ├── sydney.jpg
│       ├── tajmahal.jpg
│       ├── torreeiffel.jpg
│       ├── uk.jpg
│       └── usa.jpg
│
├── components/
│   ├── external-link.tsx
│   ├── GlassBottomNav.tsx
│   ├── haptic-tab.tsx
│   ├── hello-wave.tsx
│   ├── parallax-scroll-view.tsx
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   └── ui/
│       ├── collapsible.tsx
│       ├── icon-symbol.ios.tsx
│       └── icon-symbol.tsx
│
├── constants/
│   └── theme.ts
│
├── hooks/
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts
│   └── use-theme-color.ts
│
├── scripts/
│   └── reset-project.js
│
├── .gitignore
├── app.json
├── eslint.config.js
├── package.json
├── package-lock.json
├── tsconfig.json
├── vercel.json
└── README.md

Como Executar
Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

Node.js versão 18 ou superior
npm
Expo
Aplicativo Expo Go no celular, caso queira testar no dispositivo físico

1. Clonar o repositório
git clone https://github.com/laurazxk/AXIS.git
2. Entrar na pasta do projeto
cd AXIS
3. Instalar as dependências
npm install
4. Iniciar o projeto
npx expo start

Após executar o comando, será exibido um QR Code no terminal.

Para testar no celular, abra o Expo Go e escaneie o QR Code.

Também é possível executar o projeto em um navegador utilizando a opção correspondente disponibilizada pelo Expo.

Fluxo de Navegação

O aplicativo possui um fluxo inicial de apresentação para o usuário.

Splash
   ↓
Apresentação
   ↓
Plan
   ↓
Plan 2
   ↓
Plan 3
   ↓
Plan 4
   ↓
Home

Após finalizar as telas de apresentação, o usuário é direcionado para a Home principal do Axis, onde pode explorar destinos e países.

A partir da Home, o usuário pode acessar:

Home
 ├── Destinos
 │    └── Detalhes do destino
 │
 ├── Países
 │    └── Detalhes do país
 │
 ├── Viagens
 │
 ├── Despesas
 │
 └── Perfil
Aplicativo Mobile

O Axis é desenvolvido utilizando React Native + Expo.

Para testar o aplicativo:

Instale o aplicativo Expo Go na App Store ou Google Play.
Clone o repositório.
Entre na pasta do projeto.
Execute:
npm install
npx expo start
Escaneie o QR Code utilizando o Expo Go.
Deploy
Frontend — Vercel

Links Importantes

Repositório GitHub: https://github.com/laurazxk/AXIS

Deploy Vercel: https://axis-alpha-eight.vercel.app/

Deploy Render: https://axis-14ov.onrender.com

Protótipo

site apresentando: https://axisapp2tw.vercel.app
figma: https://www.figma.com/design/63TQRcoanS9PuaG0fYvoIy/Axis-prot%C3%B3tipo?node-id=0-1&t=RaJ1OQYpsrp9BYkv-1

Futuras Implementações

Entre as melhorias planejadas para o projeto estão:

Integração completa com banco de dados
Sincronização das viagens em tempo real
Integração completa com autenticação
Geração de itinerários utilizando Inteligência Artificial
Sistema de convite para participantes
Maior integração entre planejamento e despesas
Geração de APK para Android
Publicação do aplicativo para iOS

Integrantes
Julia Bandeira
Laura Marques
Laila Camile
Kyara Murayama

Pitch

O Axis foi desenvolvido para resolver um problema real: quem já tentou organizar uma viagem em grupo sabe que pode ser um caos.
Mensagens perdidas, planilhas confusas, gastos desorganizados e dificuldade para decidir o que fazer são problemas comuns durante o planejamento de uma viagem.
O Axis resolve isso com um aplicativo intuitivo que reúne roteiro, destinos, grupo e finanças em um só lugar.

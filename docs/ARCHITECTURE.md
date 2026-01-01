# Visão geral da arquitetura

## 1. Estrutura do projeto

Esta seção fornece uma visão geral de alto nível da estrutura de diretórios e arquivos do projeto, categorizada por camada arquitetônica ou principal área funcional. É essencial para navegar rapidamente pelo código-fonte, localizar arquivos relevantes e compreender a organização geral e a separação de responsabilidades.

```txt
├── app.json                  # Configuração do aplicativo
├── App.tsx                   # Entry point da aplicação React Native
├── index.js                  # Ponto de entrada da aplicação
├── babel.config.js           # Configuração do Babel
├── metro.config.js           # Configuração do bundler Metro
├── tailwind.config.js        # Configuração do NativeWind
├── nativewind-env.d.ts       # Tipagens do NativeWind
├── global.css                # Estilos globais compartilhados
├── package.json              # Dependências e scripts do projeto
├── tsconfig.json             # Configuração do TypeScript (paths, alias, ...)
│
├── docs/                     # Documentação do projeto
│
├── src/                      # Código fonte principal
│   ├── app/                  # Configurações e navegação global da aplicação
│   │   ├── config/           # Arquivos de configuração
│   │   └── navigation/       # Estrutura de navegação
│   │       ├── RootStack.tsx # Stack principal
│   │       └── AppTabs.tsx   # Navegação por abas
│   │
│   ├── libs/                 # Lógica de domínio e integração com backend
│   │   ├── domain/           # Módulos de domínio da aplicação
│   │   │   ├── auth/         # Domínio de autenticação
│   │   │   │   ├── index.ts  # Barrel export
│   │   │   │   └── src/
│   │   │   │       ├── controller.ts  # Orquestra fluxos do domínio
│   │   │   │       ├── service.js     # Regras de negócio
│   │   │   │       ├── repository.ts  # Acesso a dados
│   │   │   │       ├── model.ts       # Modelo de domínio
│   │   │   │       ├── schema.ts      # Validação / tipagem
│   │   │   │       └── middleware.ts  # Regras intermediárias
│   │   │   ├── events/       # Domínio de eventos
│   │   │   └── user/         # Domínio de usuário
│   │   │
│   │   └── supabase/         # Infraestrutura para backend externo
│   │       ├── client.ts     # Cliente Supabase
│   │       ├── appState.ts   # Gerenciamento de estado global da aplicação
│   │       └── index.ts      # Barrel export
│   │
│   ├── screens/              # Telas da aplicação
│   │   ├── auth/             # Fluxo de autenticação
│   │   │   ├── views/        # Telas
│   │   │   └── components/   # Componentes específicos do módulo
│   │   ├── chats/            # Fluxo de chats
│   │   ├── debug/            # Telas de debug e testes
│   │   ├── events/           # Fluxo de eventos
│   │   ├── explore/          # Exploração de conteúdo
│   │   ├── introduction/     # Introdução
│   │   ├── profile/          # Perfil do usuário
│   │   ├── search/           # Tela de busca
│   │   └── settings/         # Configurações do usuário
│   │
│   └── shared/               # Recursos compartilhados
│       ├── components/       # Componentes reutilizáveis
│       │   ├── header/
│       │   ├── go-to-screen/
│       │   └── onboarding/
│       ├── constants/        # Constantes e tipos globais
│       │   ├── colors/
│       │   └── types/
│       └── hooks/            # Hooks customizados reutilizáveis
```

### 1.1. Observações sobre a Arquitetura

- **Domain-Driven Design**: Cada domínio (auth, events, user) segue padrão MVC com repository
- **Supabase**: Backend-as-a-Service para autenticação, banco de dados e armazenamento
- **Navigation**: Sistema de navegação com tabs e stack
- **TypeScript**: Tipagem forte em todo o projeto

<!-- ## 2. Diagrama de alto nível do sistema

```mermaid
``` -->

## 2. Componentes principais

### 2.1. Frontend

Nome: Interface / Tela do Usuário

Descrição: Representa toda a camada de apresentação da aplicação, organizada por screens/features

Tecnologias: React, React Native, Typescript, Nativewind, Lucide

### 2.2. Backend

Nome: Infraestrutura

Descrição: Comunicação com backend externo, armazenamento e autenticação via Supabase, incluindo PostgreSQL e serviços de autenticação

Tecnologias: Supabase (BaaS), PostgreSQL (via Supabase)

### 2.3. Stacks

Nome: Principais Tecnologias

Descrição: Principais tecnologias e suas versões que fazem o programa funcionar e são essenciais para funcionar

Tecnologias
    - NodeJS: 22.2.0
    - Java: 17.0.12
    - React: 19.2.0
    - React Native: 0.83.1
    - Typescript: 5.8.3
    - NativeWind: 4.2.1
    - ADB: 1.0.41
    - SDK: 36
    - Build Tools: 36.1.0

## 3. Armazenamento de dados

### 3.1. Banco de dados

Nome: Supabase

Type: PostgreSQL

Propósito: Gerenciar persistência de dados da aplicação, autenticação, sincronização de estado, execução das operações CRUD e utilização _realtime_

### 3.2. Armazenamento local

Nome: AsyncStorage

Type: Storage local / Key-Value

Propósito: Persistir dados localmente no dispositivo (tokens de autenticação, configurações e estados de interface), acesso rápido a informações que não precisam ser constantemente buscadas do backend, armazenando dados temporários e cache offline

<!-- ## 4. Integrações externas / APIs

(List any third-party services or external APIs the system interacts with.)

Service Name 1: [e.g., Stripe, SendGrid, Google Maps API]

Purpose: [Briefly describe its function, e.g., "Payment processing."]

Integration Method: [e.g., REST API, SDK] -->

## 5. Deployment & Infrastructure

Cloud Provider: Supabase (BaaS)

Principais serviços utilizados: PostgreSQL (via Supabase), autenticação e Realtime (via Supabase)

CI/CD Pipeline: GitHub Actions

Monitoramento & Logging: Supabase Logs (queries, auth events)

## 6. Considerações de segurança

<!-- Authentication: OAuth2 (pendente), JWT - ambos via Supabase -->

Authentication: JWT (via Supabase)

<!-- Authorization: -->

Data Encryption: Crypto - Módulo do NodeJS

<!-- ## 8. Development & Testing Environment

Local Setup Instructions: [Link to CONTRIBUTING.md or brief steps]

Testing Frameworks: [e.g., Jest, Pytest, JUnit]

Code Quality Tools: [e.g., ESLint, Black, SonarQube] -->

<!-- ## 9. Future Considerations / Roadmap

(Briefly note any known architectural debts, planned major changes, or significant future features that might impact the architecture.)

[e.g., "Migrate from monolith to microservices."]

[e.g., "Implement event-driven architecture for real-time updates."] -->

## 7. Identificação do projeto

Nome: BR Connect

URL do repositório: [amazonext/br-connect](https://github.com/amazonext/br-connect)

Datas de início:
    - Call: 14/07/25 - Edgar(@eded001) e Alessandro(@AlessandroDaCostaESilva)
    - Primeiro commit: 15/08/25

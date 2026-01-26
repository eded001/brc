# Visão geral da arquitetura

## 1. Estrutura do projeto

Esta seção fornece uma visão geral de alto nível da **estrutura de diretórios e arquivos** do projeto, categorizada por **camada arquitetônica** ou **área funcional principal**. É essencial para navegar rapidamente pelo código-fonte, localizar arquivos relevantes e compreender a **organização geral** e a **separação de responsabilidades**.

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

* **Domain-Driven Design**: Cada domínio (*auth, events, user*) segue **padrão MVC com repository**.
* **Supabase**: Backend-as-a-Service para autenticação, banco de dados e armazenamento.
* **Navigation**: Sistema de navegação com **tabs** e **stack**.
* **TypeScript**: Tipagem forte em todo o projeto.

---

## 2. Componentes principais

### 2.1. Frontend

**Nome:** Interface / Tela do Usuário

**Descrição:** Representa toda a **camada de apresentação** da aplicação, organizada por *screens/features*.

**Tecnologias:**

* **React**
* **React Native**
* **TypeScript**
* **NativeWind**
* **Lucide**

### 2.2. Backend

**Nome:** Infraestrutura

**Descrição:** Comunicação com backend externo, armazenamento e autenticação via **Supabase**, incluindo **PostgreSQL** e serviços de autenticação.

**Tecnologias:**

* **Supabase (BaaS)**
* **PostgreSQL (via Supabase)**

### 2.3. Stacks

**Nome:** Principais Tecnologias

**Descrição:** Principais tecnologias e suas versões que fazem o programa funcionar e são essenciais.

**Tecnologias:**

* **Linguagens & Runtimes**

  * NodeJS: 22 (LTS)
  * Java: 17
  * TypeScript: 5.8.3
* **Frameworks de Interface**

  * React: 19.2.0
  * React Native: 0.83.1
* **Estilização**

  * NativeWind: 4.2.1
* **Infraestrutura mobile**

  * ADB: 1.0.41
  * SDK: 36
  * Build Tools: 36.1.0

---

## 3. Armazenamento de dados

### 3.1. Banco de dados

**Nome:** Supabase

**Type:** PostgreSQL

**Propósitos:**

* Gerenciar **persistência de dados** da aplicação
* **Autenticação**
* **Sincronização de estado**
* Execução das operações **CRUD**
* Utilização de **realtime**

### 3.2. Armazenamento local

**Nome:** AsyncStorage

**Type:** Storage local / Key-Value

**Propósitos:**

* Persistir dados localmente no dispositivo (*tokens de autenticação, configurações e estados de interface*)
* Acesso rápido a informações que não precisam ser constantemente buscadas do backend
* Armazenamento de dados temporários (*cache offline*)

---

## 4. Deployment & Infrastructure

**Cloud Provider:** Supabase (BaaS)

**Principais serviços utilizados:**

* **PostgreSQL** (via Supabase)
* **Autenticação**
* **Realtime** (via Supabase)

**CI/CD Pipeline:** GitHub Actions

**Monitoramento & Logging:** Supabase Logs (*queries, auth events*)

---

## 5. Considerações de segurança

* **Authentication:** JWT (*via Supabase*)
* **Data Encryption:** Crypto - Módulo do NodeJS

---

## 6. Identificação do projeto

**Nome:** BR Connect

**URL do repositório:** [amazonext/br-connect](https://github.com/amazonext/br-connect)

# Instalação do Projeto

Este documento descreve os requisitos técnicos e o processo necessário para configurar corretamente o ambiente de desenvolvimento do projeto **BRC**.

O objetivo é garantir padronização do ambiente entre os colaboradores e evitar inconsistências de versão que possam comprometer a execução do sistema.

Repositório oficial do projeto:
[https://github.com/eded001/brc](https://github.com/eded001/brc)

---

## 1. Requisitos de Ambiente

Antes de iniciar a instalação, certifique-se de que os seguintes componentes estejam devidamente instalados e configurados em sua máquina.

### 1.1 Linguagens e Runtimes (Obrigatórios)

Estes são os componentes centrais para execução e build do projeto.

| Tecnologia     | Versão Requerida | Observações                                                                    |
| -------------- | ---------------- | ------------------------------------------------------------------------------ |
| **Node.js**    | **22 (LTS)**     | Necessário para execução do ambiente JavaScript e gerenciamento de pacotes     |
| **Java (JDK)** | **17 >= 20**     | Utilizado no build Android. Fora desse intervalo o projeto **não é suportado** |

> **IMPORTANTE**
> Versões do **Java** inferiores a 17 ou superiores a 20 **não são suportadas**.

---

### 1.2 Frameworks Utilizados

Não é necessário instalar esses frameworks manualmente; eles serão instalados via `npm install`. Estão listados apenas para referência técnica.

- React 19.2.0
- React Native 0.83.1

> O projeto **não utiliza Expo**. Toda a execução mobile ocorre via ambiente nativo (Android).

---

### 1.3 Infraestrutura Android (Para Execução Mobile)

Para executar o projeto em emuladores ou dispositivos físicos Android, é necessário configurar o ambiente Android nativo.

| Ferramenta              | Versão |
| ----------------------- | ------ |
| **ADB**                 | 1.0.41 |
| **Android SDK**         | 36     |
| **Android Build Tools** | 36.1.0 |

Certifique-se de que:

- O `ANDROID_HOME` (ou `ANDROID_SDK_ROOT`) esteja configurado
- O `adb` esteja disponível no PATH do sistema
- Um emulador Android esteja criado **ou** a depuração USB esteja habilitada em um dispositivo físico

---

## 2. Clonando o Repositório

```bash
git clone https://github.com/eded001/brc.git
cd brc
```

---

## 3. Instalação das Dependências

O projeto **não utiliza Yarn**. O gerenciador de pacotes padrão é o **npm**.

```bash
npm install
```

Esse comando instalará todas as dependências necessárias definidas no `package.json`.

---

## 4. Execução do Projeto

### 4.1 Iniciar o Metro Bundler

```bash
npx react-native start
```

---

### 4.2 Executar no Android

Com um emulador aberto ou dispositivo conectado:

```bash
npx react-native run-android
```

Esse comando irá:

1. Compilar o projeto Android
2. Instalar o aplicativo no dispositivo/emulador
3. Iniciar a aplicação automaticamente

---

## 5. Verificação de Ambiente (Opcional, mas Recomendado)

Para validar se o ambiente React Native está corretamente configurado:

```bash
npx react-native doctor
```

Esse comando identifica dependências ausentes ou versões incompatíveis.

---

## 6. Observações Importantes

- Este projeto utiliza **ambiente nativo React Native**, sem Expo.
- O uso de versões incorretas do **Java** é a causa mais comum de falhas de build.
- Sempre que houver erro de build Android, valide primeiro:
  - Versão do Java
  - Variáveis de ambiente do SDK
  - Presença do ADB no PATH

A padronização do ambiente é obrigatória para garantir estabilidade e reprodutibilidade do projeto.

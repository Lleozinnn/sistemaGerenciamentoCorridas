# 🏃 Sistema de Gerenciamento de Competições de Corridas

Trabalho Interdisciplinar desenvolvido para o **2º período do curso de Tecnologia em Sistemas para Internet (TSI)** do Instituto Federal do Espírito Santo (**Ifes**).

O projeto integra as competências das disciplinas de:
- **Análise de Sistemas**
- **Programação Orientada a Objetos I (POO I)**
- **UX Design**

---

## 📌 Sumário
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Modelagem e Arquitetura Orientada a Objetos](#-modelagem-e-arquitetura-orientada-a-objetos)
- [Requisitos do Sistema](#-requisitos-do-sistema)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Repositório](#-estrutura-do-repositório)
- [Como Executar a Aplicação](#-como-executar-a-aplicação)
- [Entregas e Links Úteis](#-entregas-e-links-úteis)
- [Integrantes da Equipe](#-integrantes-da-equipe)

---

## 📖 Sobre o Projeto

O **Sistema de Gerenciamento de Competições de Corridas** é uma aplicação web voltada para organizadores e gestores de eventos esportivos. A plataforma permite cadastrar e gerenciar competições — com suporte inicial às modalidades de **Maratona** e **Trail Running** —, além de manter o controle de atletas participantes e suas respectivas inscrições, assegurando capacidade máxima, regras de negócio e relatórios de consulta rápida.

O sistema foi arquitetado para permitir expansões futuras para novas modalidades sem impactar as regras existentes (princípio *Open/Closed* do SOLID).

---

## ✨ Funcionalidades Principais

- **Gestão de Atletas (CRUD completo):**
  - Cadastro de atletas com validação de dados obrigatórios.
  - Associação com modalidades de corrida preferenciais/atuantes.
  - Listagem, edição e exclusão de atletas.
  - Filtro por modalidade esportiva via processamento em array de objetos.
- **Gestão de Competições (CRUD completo):**
  - Cadastro de competições com atributos gerais e especializados (altimetria, percurso urbano, tipo de terreno, postos de checagem, etc.).
  - Listagem geral e filtragem dinâmica por categoria (*Maratona* / *Trail Running*).
- **Inscrições e Associações:**
  - Inscrição de atletas em competições respeitando o limite máximo de participantes.
  - Bloqueio contra inscrições duplicadas de um mesmo atleta na mesma prova.
  - Consulta detalhada dos inscritos por evento e histórico de provas por atleta.
- **Relatórios Gerenciais:**
  - Visão geral da competição (nome, tipo, inscritos, distância, local e data).
  - Resumo de ocupação e demanda das competições.

---

## 📐 Modelagem e Arquitetura Orientada a Objetos

A aplicação adota o padrão arquitetural **MVC (Model-View-Controller)** e aplica os pilares fundamentais da POO:

```
                  ┌──────────────────────┐
                  │        Atleta        │
                  ├──────────────────────┤
                  │ - nome               │
                  │ - idade              │
                  │ - documento          │
                  │ - nacionalidade      │
                  │ - modalidade         │
                  └──────────┬───────────┘
                             │ *
                             │ (agregação: inscritos)
                             ▼ 0..*
               ┌───────────────────────────────┐
               │    <<abstract>> Competicao    │
               ├───────────────────────────────┤
               │ # nome                        │
               │ # local                       │
               │ # data                        │
               │ # distancia                   │
               │ # maxParticipantes            │
               │ # atletasInscritos: Atleta[]  │
               ├───────────────────────────────┤
               │ + inscrever(atleta: Atleta)   │
               │ + listarAtletas(): Atleta[]   │
               │ + toString(): string          │
               └───────────────▲───────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            │                                     │
┌──────────────────────────┐         ┌──────────────────────────┐
│         Maratona         │         │       TrailRunning       │
├──────────────────────────┤         ├──────────────────────────┤
│ - altimetria             │         │ - terreno                │
│ - percursoUrbano         │         │ - nivelDificuldade       │
├──────────────────────────┤         │ - qtdCheckpoints         │
│ + toString(): string     │         │ - tipoModalidade         │
└──────────────────────────┘         ├──────────────────────────┤
                                     │ + toString(): string     │
                                     └──────────────────────────┘
```

### Destaques de POO:
- **Encapsulamento e Ocultamento:** Atributos privados/protegidos manipulados via métodos de acesso e mutadores (*getters/setters*), garantindo a integridade dos dados em memória.
- **Herança e Polimorfismo:** `Maratona` e `TrailRunning` herdam da superclasse abstrata `Competicao`.
- **Sobrescrita de Métodos e Reúso:** As subclasses sobrescrevem o método `toString()`, invocando `super.toString()` para reaproveitar os dados comuns da superclasse.
- **Associação/Agregação:** A classe `Competicao` mantém um vetor contendo referências aos objetos da classe `Atleta`.

---

## 📋 Requisitos do Sistema

### Requisitos Funcionais (RF)
- **RF01:** Cadastrar atletas (nome, idade, documento, nacionalidade).
- **RF02:** Associar o atleta à modalidade correspondente.
- **RF03 / RF04:** Consultar e filtrar atletas cadastrados por modalidade.
- **RF05 / RF06:** Cadastrar competições informando dados comuns (nome, local, data, distância, maxParticipantes).
- **RF07:** Suportar atributos específicos para Maratonas e Trail Running.
- **RF08 / RF09:** Listar e filtrar competições por tipo.
- **RF10:** Inscrever atletas respeitando a lotação máxima da competição.
- **RF11:** Impedir inscrições duplicadas do mesmo atleta na mesma prova.
- **RF12 / RF13:** Listar atletas por competição e competições por atleta.
- **RF14 / RF15:** Gerar relatórios específicos e gerais de eventos e inscritos.

### Requisitos Não Funcionais (RNF)
- **RNF01:** Tempo de resposta inferior a 2 segundos para operações de cadastro, consulta e filtro.
- **RNF02:** Suporte a grandes volumes de dados locais sem perda sensível de desempenho.
- **RNF03 / RNF04:** Usabilidade simplificada com fluxo de cadastro em no máximo 5 etapas e interface intuitiva orientada a UX.
- **RNF05 / RNF06:** Arquitetura flexível e extensível segundo o princípio Aberto/Fechado (*Open/Closed*).
- **RNF07 / RNF08:** Compatibilidade com navegadores modernos e código padronizado.
- **RNF09 / RNF10:** Validação de entradas e consistência de regras de negócio antes de persistir dados.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Modelagem e UX:**
  - **Figma:** Prototipação navegável de alta fidelidade das interfaces do sistema.
  - **Astah / PlantUML:** Elaboração do Diagrama de Classes UML.
- **Gestão de Projeto:**
  - **Trello:** Gestão ágil das Histórias de Usuário (*User Stories*) via quadro Kanban (`Material de Referência`, `A Fazer / To Do`, `Fazendo / Doing`, `Feito / Done`).

---

## 📁 Estrutura do Repositório

```bash
├── docs/
│   ├── diagrama_classes.png      # Diagrama de Classes UML
│   └── especificacao_requisitos.pdf
├── src/
│   ├── controllers/             # Controladores (lógica de mediação View-Model)
│   ├── models/                  # Classes de entidades (Atleta, Competicao, etc.)
│   ├── views/                   # Telas e scripts de interface
│   ├── styles/                  # Folhas de estilo CSS
│   └── app.js                   # Ponto de entrada / inicialização
├── index.html                   # Página inicial da aplicação
└── README.md                    # Documentação do projeto
```

---

## 🚀 Como Executar a Aplicação

Por ser uma aplicação baseada em tecnologias web nativas (HTML, CSS e JavaScript Vanilla):

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
   ```
2. **Navegue até a pasta do projeto:**
   ```bash
   cd NOME-DO-REPOSITORIO
   ```
3. **Execute o projeto:**
   - Utilize a extensão **Live Server** no Visual Studio Code para servir a pasta do projeto e abrir uma página em `front-end/HTML/`.
   - O carregamento inicial usa os arquivos `front-end/data/atletasMockados.json` e `front-end/data/competicoesMockadas.json`, portanto a aplicação deve ser acessada por um servidor local, não diretamente via `file://`.

---

## 🔗 Entregas e Links Úteis

- 📌 **Quadro no Trello:** [Acesse o Trello do Projeto](https://trello.com/b/...)
- 🎨 **Protótipo no Figma:** [Acesse o Figma do Projeto](https://www.figma.com/file/...)
- 📊 **Diagrama de Classes:** [Visualizar Diagrama](./docs/diagrama_classes.png)

---

## 👥 Integrantes da Equipe

- **Leonardo Silva Beling**
- **Gabriel Zanotti Ratunde Westfal**
- **Miguel Perini Broetto**
- **José Henrique Pereira Loose**

---
*Instituto Federal do Espírito Santo (Ifes) - Campus Serra/Cefor - 2026/02*

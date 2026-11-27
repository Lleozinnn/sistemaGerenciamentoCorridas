import { CompeticaoController } from "../../controllers/competicaoController.js";

const competicaoController = new CompeticaoController();
const tabelaCompeticoes = document.querySelector("#tabela-competicoes");
const legendaCompeticoes = document.querySelector("#competicoes-caption");
const resumoCompeticoes = document.querySelector("#competicoes-footer");
const formularioFiltro = document.querySelector("#competition-filter-form");
const campoPesquisa = document.querySelector("#competition-search");
const seletorModalidade = document.querySelector("#competition-modality");
const legendaFiltro = document.querySelector("#competition-filter-caption");
const competicoes = competicaoController.listarCompeticoes();

function criarListaDetalhes(detalhes) {
    const lista = document.createElement("dl");
    lista.className = "competition-detail-list";

    detalhes.forEach(([rotulo, valor]) => {
        const linha = document.createElement("div");
        const titulo = document.createElement("dt");
        const descricao = document.createElement("dd");

        titulo.textContent = rotulo;
        descricao.textContent =
            valor === undefined || valor === null || valor === ""
                ? "Não informado"
                : String(valor);
        linha.appendChild(titulo);
        linha.appendChild(descricao);
        lista.appendChild(linha);
    });

    return lista;
}

function formatarDataHorario(dataHorario) {
    const data = new Date(dataHorario);
    if (Number.isNaN(data.getTime())) {
        return dataHorario || "Não informado";
    }

    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(data);
}

function obterDetalhesModalidade(competicao) {
    const opcoes = competicao.opMod || {};

    if (competicao.modalidade === "Urbano") {
        return [
            ["Altimetria acumulada", `${opcoes.altimetria ?? "Não informado"} m`],
            ["Percurso urbano", opcoes.percursoUrbano],
            ["Descrição do trajeto", opcoes.descricaoTrajeto],
            ["Largada e chegada", opcoes.pontosLargadaChegada],
        ];
    }

    return [
        ["Tipo de terreno", opcoes.tipoTerreno],
        ["Nível de dificuldade", opcoes.nivel ?? opcoes.nivelDificuldade],
        ["Quantidade de checkpoints", opcoes.quantidadeCheckpoints],
        ["Localização dos checkpoints", opcoes.localizacaoCheckpoints],
        ["Tipo de prova", opcoes.tipoProva],
    ];
}

function criarCelulaDetalhada(dadosPrincipais, detalhes) {
    const celula = document.createElement("td");
    const valorPrincipal = document.createElement("strong");

    valorPrincipal.textContent = dadosPrincipais;
    celula.appendChild(valorPrincipal);
    celula.appendChild(criarListaDetalhes(detalhes));
    return celula;
}

function renderizarCompeticoes(competicoesExibidas) {
    tabelaCompeticoes.innerHTML = "";

    if (competicoesExibidas.length === 0) {
        const linha = document.createElement("tr");
        const celula = document.createElement("td");
        celula.colSpan = 5;
        celula.textContent =
            competicoes.length === 0
                ? "Nenhuma competição cadastrada."
                : "Nenhuma competição corresponde aos filtros.";
        linha.appendChild(celula);
        tabelaCompeticoes.appendChild(linha);
    } else {
        competicoesExibidas.forEach((competicao) => {
            const linha = document.createElement("tr");
            const inscricoes = competicaoController.listarInscricoesCompeticao(
                competicao.id,
            );
            const valorInscricao = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
            }).format(competicao.valorInscricao);
            const modalidadeExibida =
                competicao.modalidade === "Urbano"
                    ? "Maratona Urbana"
                    : competicao.modalidade;

            linha.appendChild(
                criarCelulaDetalhada(competicao.nome, [
                    ["Identificação", competicao.id],
                    ["Local / endereço", competicao.local],
                    ["Data e horário", formatarDataHorario(competicao.dataHorario)],
                    ["Distância", `${competicao.distanciaKm} km`],
                    ["Valor da inscrição", valorInscricao],
                ]),
            );
            linha.appendChild(
                criarCelulaDetalhada(
                    modalidadeExibida,
                    obterDetalhesModalidade(competicao),
                ),
            );

            const celulaInscricoes = criarCelulaDetalhada(
                `${competicao.qtdInscritos} / ${competicao.limiteVagas}`,
                [
                    ["Vagas disponíveis", competicao.vagasDisponiveis],
                    ["Atletas inscritos", inscricoes.length],
                ],
            );
            linha.appendChild(celulaInscricoes);

            const celulaStatus = document.createElement("td");
            const status = document.createElement("span");
            status.className =
                competicao.statusProva === "Aberta"
                    ? "status status--ok"
                    : "status status--danger";
            status.textContent = competicao.statusProva;
            celulaStatus.appendChild(status);
            linha.appendChild(celulaStatus);

            const celulaAcoes = document.createElement("td");
            const linkEditar = document.createElement("a");
            linkEditar.className = "button button--small button--secondary";
            linkEditar.href =
                `editarCompeticao.html?id=${encodeURIComponent(competicao.id)}`;
            linkEditar.textContent = "Editar";
            celulaAcoes.appendChild(linkEditar);
            linha.appendChild(celulaAcoes);

            tabelaCompeticoes.appendChild(linha);
        });
    }

    if (competicoes.length === 0) {
        legendaCompeticoes.textContent = "Nenhuma competição cadastrada.";
        resumoCompeticoes.textContent = "Nenhuma competição para exibir.";
        return;
    }

    legendaCompeticoes.textContent =
        `${competicoesExibidas.length} ${competicoesExibidas.length === 1 ? "competição encontrada" : "competições encontradas"}`;
    resumoCompeticoes.textContent = competicoesExibidas.length === competicoes.length
        ? `Exibindo todas as ${competicoes.length} competições`
        : `Exibindo ${competicoesExibidas.length} de ${competicoes.length} competições`;
}

function normalizarTexto(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function filtrarCompeticoes() {
    const nomePesquisado = normalizarTexto(campoPesquisa.value.trim());
    const modalidadeSelecionada = seletorModalidade.value;
    const competicoesFiltradas = competicoes.filter((competicao) => {
        const nomeCorresponde = normalizarTexto(competicao.nome).includes(
            nomePesquisado,
        );
        const modalidadeCorresponde =
            !modalidadeSelecionada ||
            competicao.modalidade === modalidadeSelecionada;

        return nomeCorresponde && modalidadeCorresponde;
    });
    const filtrosAplicados = [];

    if (campoPesquisa.value.trim()) {
        filtrosAplicados.push(`nome "${campoPesquisa.value.trim()}"`);
    }
    if (modalidadeSelecionada) {
        filtrosAplicados.push(
            `modalidade ${modalidadeSelecionada === "Urbano" ? "Maratona Urbana" : modalidadeSelecionada}`,
        );
    }

    legendaFiltro.textContent = filtrosAplicados.length > 0
        ? `Filtro aplicado: ${filtrosAplicados.join(" • ")}`
        : "Nenhum filtro aplicado";
    renderizarCompeticoes(competicoesFiltradas);
}

formularioFiltro.addEventListener("submit", (event) => {
    event.preventDefault();
    filtrarCompeticoes();
});

renderizarCompeticoes(competicoes);

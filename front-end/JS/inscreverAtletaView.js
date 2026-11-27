import { AtletaController } from "../../controllers/atletaController.js";
import { CompeticaoController } from "../../controllers/competicaoController.js";

const athleteSelect = document.querySelector("#enrollment-athlete");
const competitionSelect = document.querySelector("#enrollment-competition");
const athleteSummary = document.querySelector("#athlete-summary");
const competitionSummary = document.querySelector("#competition-summary");
const capacitySummary = document.querySelector("#capacity-summary");
const enrollmentForm = document.querySelector("#enrollment-form");
const validationMessage = document.querySelector("#validation-message");

const atletaController = new AtletaController();
const competicaoController = new CompeticaoController();
const validacoes = [
    {
        etapa: "cadastro",
        resultado: "#check-athlete",
        detalhe: "#check-athlete-detail",
        mensagemSucesso: "Atleta encontrado no sistema.",
    },
    {
        etapa: "modalidade",
        resultado: "#check-modality",
        detalhe: "#check-modality-detail",
        mensagemSucesso: "Modalidade do atleta compatível com a competição.",
    },
    {
        etapa: "capacidade",
        resultado: "#check-capacity",
        detalhe: "#check-capacity-detail",
        mensagemSucesso: "Há vaga disponível na competição.",
    },
    {
        etapa: "duplicidade",
        resultado: "#check-duplicate",
        detalhe: "#check-duplicate-detail",
        mensagemSucesso: "Não existe outra inscrição deste atleta.",
    },
];

atletaController.listarAtletas().forEach((atleta) => {
    const option = new Option(
        `${atleta.nome} • Atleta #${atleta.id} • ${atleta.modalidade}`,
        atleta.cpf,
    );
    option.dataset.modalidade = atleta.modalidade;
    option.dataset.nome = atleta.nome;
    athleteSelect.appendChild(option);
});

if (athleteSelect.options.length === 1) {
    athleteSelect.options[0].textContent = "Nenhum atleta cadastrado";
}

competicaoController.listarCompeticoes().forEach((competicao) => {
    const option = new Option(competicao.nome, String(competicao.id));
    option.dataset.modalidade = competicao.modalidade;
    competitionSelect.appendChild(option);
});

if (competitionSelect.options.length === 1) {
    competitionSelect.options[0].textContent = "Nenhuma competição cadastrada";
}

function atualizarResumoAtleta() {
    const opcaoAtleta = athleteSelect.selectedOptions[0];
    if (!opcaoAtleta || !opcaoAtleta.value) {
        athleteSummary.textContent = "Modalidade do atleta: não selecionada";
        return;
    }

    athleteSummary.textContent =
        `Modalidade do atleta: ${opcaoAtleta.dataset.modalidade}`;
}

function atualizarResumoCompeticao() {
    const idCompeticao = Number(competitionSelect.value);
    const resultado = competicaoController.buscarCompeticaoPorId(idCompeticao);
    if (resultado.tipo === "ERRO") {
        competitionSummary.textContent =
            "Modalidade da competição: não selecionada";
        capacitySummary.textContent =
            "Selecione uma competição para consultar as vagas.";
        return;
    }

    const competicao = resultado.competicao;
    const modalidade = competicao.modalidade === "Urbano"
        ? "Maratona Urbana"
        : competicao.modalidade;
    const vagasDisponiveis = Math.max(0, competicao.vagasDisponiveis());
    competitionSummary.textContent =
        `Modalidade da competição: ${modalidade}`;
    capacitySummary.textContent =
        `${competicao.quantidadeAtletasInscritos()} / ${competicao.limiteVagas} inscritos • ` +
        `${vagasDisponiveis} ${vagasDisponiveis === 1 ? "vaga disponível" : "vagas disponíveis"}`;
}

function atualizarValidacoes(resultado) {
    const indiceFalha = validacoes.findIndex(
        (validacao) => validacao.etapa === resultado.etapa,
    );

    validacoes.forEach((validacao, indice) => {
        const campoResultado = document.querySelector(validacao.resultado);
        const campoDetalhe = document.querySelector(validacao.detalhe);
        const foiValidado = resultado.tipo === "SUCESSO" || indiceFalha > indice;
        const falhou = resultado.tipo === "ERRO" && indice === indiceFalha;

        campoResultado.textContent = foiValidado
            ? "Validado"
            : falhou
                ? "Bloqueado"
                : "Não verificado";
        campoResultado.classList.toggle("is-blocked", falhou);
        campoDetalhe.textContent = falhou
            ? resultado.mensagem
            : foiValidado
                ? validacao.mensagemSucesso
                : "Aguardando validação.";
    });

    validationMessage.textContent = resultado.mensagem;
}

athleteSelect.addEventListener("change", atualizarResumoAtleta);
competitionSelect.addEventListener("change", atualizarResumoCompeticao);
enrollmentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const resultado = competicaoController.inscreverAtleta(
        Number(competitionSelect.value),
        athleteSelect.value,
    );

    atualizarValidacoes(resultado);
    if (resultado.tipo === "SUCESSO") {
        atualizarResumoCompeticao();
    }
});

atualizarResumoAtleta();
atualizarResumoCompeticao();

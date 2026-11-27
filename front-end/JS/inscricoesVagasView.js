import { CompeticaoController } from "../../controllers/competicaoController.js";

const competitionSelect = document.querySelector("#capacity-competition");
const capacityName = document.querySelector("#capacity-name");
const capacityModality = document.querySelector("#capacity-modality");
const capacityCount = document.querySelector("#capacity-count");
const capacitySummary = document.querySelector("#capacity-summary");
const capacityProgress = document.querySelector("#capacity-progress");
const progressTrack = document.querySelector(".progress-track");
const capacityMessage = document.querySelector("#capacity-message");
const statusCard = document.querySelector("#capacity-status-card");
const capacityStatus = document.querySelector("#capacity-status");
const statusDescription = document.querySelector("#capacity-status-description");
const updatedAt = document.querySelector("#capacity-updated-at");
const registrationsTable = document.querySelector("#capacity-registrations");

let competicaoController = new CompeticaoController();

function carregarCompeticoes(idSelecionado = "") {
    competicaoController = new CompeticaoController();
    const competicoes = competicaoController.listarCompeticoes();
    competitionSelect.replaceChildren(
        new Option("Selecione uma competição", ""),
    );

    competicoes.forEach((competicao) => {
        const option = new Option(competicao.nome, String(competicao.id));
        competitionSelect.appendChild(option);
    });

    if (competicoes.some((competicao) => String(competicao.id) === idSelecionado)) {
        competitionSelect.value = idSelecionado;
    } else if (competicoes.length > 0) {
        competitionSelect.value = String(competicoes[0].id);
    }

    atualizarOcupacao();
}

function atualizarOcupacao() {
    const idCompeticao = Number(competitionSelect.value);
    const resultado = competicaoController.buscarCompeticaoPorId(idCompeticao);

    if (resultado.tipo === "ERRO") {
        capacityName.textContent = "Selecione uma competição";
        capacityModality.textContent = "";
        capacityCount.textContent = "0 / 0 inscritos";
        capacitySummary.textContent =
            "A ocupação será exibida após selecionar uma competição.";
        capacityProgress.style.width = "0%";
        progressTrack.setAttribute("aria-valuenow", "0");
        capacityMessage.textContent =
            "Selecione uma competição para acompanhar as vagas.";
        statusCard.classList.remove("status-card--danger");
        statusCard.classList.add("status-card--ok");
        capacityStatus.textContent = "Não selecionada";
        statusDescription.textContent =
            "Selecione uma competição para consultar seu status.";
        registrationsTable.replaceChildren();
        updatedAt.textContent = new Date().toLocaleTimeString("pt-BR");
        return;
    }

    const competicao = resultado.competicao;
    const inscritos = competicao.quantidadeAtletasInscritos();
    const limite = competicao.limiteVagas;
    const vagasDisponiveis = Math.max(0, limite - inscritos);
    const ocupacao = limite > 0
        ? Math.min(100, (inscritos / limite) * 100)
        : 100;
    const vagasEsgotadas = competicao.status === "Vagas Esgotadas";
    const status = vagasEsgotadas ? "Vagas Esgotadas" : "Vagas disponíveis";
    const modalidade = competicao.modalidade === "Urbano"
        ? "Maratona Urbana"
        : competicao.modalidade;

    capacityName.textContent = competicao.nome;
    capacityModality.textContent = `${modalidade} • ${competicao.local}`;
    capacityCount.textContent = `${inscritos} / ${limite} inscritos`;
    capacitySummary.textContent =
        `${ocupacao.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% da capacidade • ` +
        (vagasEsgotadas
            ? "nenhuma vaga disponível"
            : `${vagasDisponiveis} ${vagasDisponiveis === 1 ? "vaga disponível" : "vagas disponíveis"}`);
    capacityProgress.style.width = `${ocupacao}%`;
    progressTrack.setAttribute("aria-valuenow", String(ocupacao));
    capacityMessage.textContent = vagasEsgotadas
        ? "O limite de inscrições foi atingido."
        : "As inscrições permanecem abertas enquanto houver capacidade disponível.";
    statusCard.classList.toggle("status-card--danger", vagasEsgotadas);
    statusCard.classList.toggle("status-card--ok", !vagasEsgotadas);
    capacityStatus.textContent = status;
    statusDescription.textContent = vagasEsgotadas
        ? "A prova atingiu o limite máximo de inscrições."
        : `A prova aceita novas inscrições. Restam ${vagasDisponiveis} ` +
          `${vagasDisponiveis === 1 ? "vaga" : "vagas"} para atingir o limite.`;

    const inscritosAtuais = competicao.listarAtletasInscritos();
    registrationsTable.replaceChildren();
    if (inscritosAtuais.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 2;
        cell.textContent = "Nenhum atleta inscrito nesta competição.";
        row.appendChild(cell);
        registrationsTable.appendChild(row);
    } else {
        inscritosAtuais.forEach((atleta) => {
            const row = document.createElement("tr");
            const nameCell = document.createElement("td");
            const statusCell = document.createElement("td");
            const registrationStatus = document.createElement("span");
            nameCell.textContent = atleta.nome;
            registrationStatus.className = "status status--ok";
            registrationStatus.textContent = "Confirmada";
            statusCell.appendChild(registrationStatus);
            row.append(nameCell, statusCell);
            registrationsTable.appendChild(row);
        });
    }

    updatedAt.textContent = new Date().toLocaleTimeString("pt-BR");
}

competitionSelect.addEventListener("change", atualizarOcupacao);
window.addEventListener("storage", (event) => {
    if (event.key === "competicoes") {
        carregarCompeticoes(competitionSelect.value);
    }
});
window.addEventListener("competicoesAtualizadas", () => {
    carregarCompeticoes(competitionSelect.value);
});

carregarCompeticoes();

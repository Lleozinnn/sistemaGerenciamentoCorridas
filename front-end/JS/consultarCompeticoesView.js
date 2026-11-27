import { CompeticaoController } from "../../controllers/competicaoController.js";

const competicaoController = new CompeticaoController();
const tabelaCompeticoes = document.querySelector("#tabela-competicoes");
const competicoes = competicaoController.listarCompeticoes();

if (competicoes.length === 0) {
    const linha = document.createElement("tr");
    const celula = document.createElement("td");
    celula.colSpan = 5;
    celula.textContent = "Nenhuma competição cadastrada.";
    linha.appendChild(celula);
    tabelaCompeticoes.appendChild(linha);
} else {
    competicoes.forEach((competicao) => {
        const linha = document.createElement("tr");
        const dados = [
            competicao.nome,
            competicao.modalidade === "Urbano"
                ? "Maratona Urbana"
                : competicao.modalidade,
            `${competicao.qtdInscritos} / ${competicao.limiteVagas}`,
        ];

        dados.forEach((valor) => {
            const celula = document.createElement("td");
            celula.textContent = valor;
            linha.appendChild(celula);
        });

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

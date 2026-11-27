import { AtletaController } from "../../controllers/atletaController.js";
import { CompeticaoController } from "../../controllers/competicaoController.js";

const atletaController = new AtletaController();
const competicaoController = new CompeticaoController();

const mensagem = document.querySelector("#inscricoes-mensagem");
const resumoAtleta = document.querySelector("#resumo-atleta");
const nomeAtleta = document.querySelector("#nome-atleta");
const cpfAtleta = document.querySelector("#cpf-atleta");
const modalidadeAtleta = document.querySelector("#modalidade-atleta");
const quantidadeInscricoes = document.querySelector("#quantidade-inscricoes");
const legendaCompeticoes = document.querySelector("#legenda-competicoes");
const listaCompeticoes = document.querySelector("#lista-competicoes");
const rodapeCompeticoes = document.querySelector("#rodape-competicoes");

const formatarModalidade = (modalidade) =>
    modalidade === "Urbano" ? "Maratona Urbana" : modalidade || "Não identificada";

const exibirMensagem = (texto) => {
    mensagem.textContent = texto;
    mensagem.hidden = false;
};

const cpf = new URLSearchParams(window.location.search).get("cpf");

if (!cpf) {
    exibirMensagem("Informe o CPF do atleta pela lista de atletas para consultar as inscrições.");
} else {
    const resultadoConsulta = atletaController.consultarAtleta(cpf);

    if (resultadoConsulta.tipo === "ERRO") {
        exibirMensagem(resultadoConsulta.mensagem);
    } else {
        const atleta = resultadoConsulta.atleta;
        const competicoesInscrito = competicaoController.listarCompeticoes().filter(
            (competicao) =>
                competicaoController
                    .listarInscricoesCompeticao(competicao.id)
                    .some((inscricao) => inscricao.cpf === atleta.cpf),
        );

        resumoAtleta.hidden = false;
        nomeAtleta.textContent = atleta.nome;
        cpfAtleta.textContent = atleta.cpf;
        modalidadeAtleta.textContent = formatarModalidade(atleta.modalidade);
        quantidadeInscricoes.textContent = String(competicoesInscrito.length);
        legendaCompeticoes.textContent =
            `${competicoesInscrito.length} de ${competicoesInscrito.length} competições • Apenas inscrições ativas de ${atleta.nome}`;

        if (competicoesInscrito.length === 0) {
            listaCompeticoes.innerHTML =
                '<tr><td colspan="4">Este atleta não possui inscrições ativas.</td></tr>';
        } else {
            competicoesInscrito.forEach((competicao) => {
                const linha = document.createElement("tr");
                const celulaNome = document.createElement("td");
                const celulaModalidade = document.createElement("td");
                const celulaStatus = document.createElement("td");
                const celulaAcao = document.createElement("td");
                const status = document.createElement("span");
                const linkCompeticao = document.createElement("a");

                celulaNome.textContent = competicao.nome;
                celulaModalidade.textContent = formatarModalidade(competicao.modalidade);
                status.className = "status status--ok";
                status.textContent = "Ativa";
                celulaStatus.appendChild(status);
                linkCompeticao.className = "button button--small button--secondary";
                linkCompeticao.href = "consultarCompeticoes.html";
                linkCompeticao.textContent = "Ver competição";
                celulaAcao.appendChild(linkCompeticao);

                linha.appendChild(celulaNome);
                linha.appendChild(celulaModalidade);
                linha.appendChild(celulaStatus);
                linha.appendChild(celulaAcao);
                listaCompeticoes.appendChild(linha);
            });
        }

        rodapeCompeticoes.textContent =
            `Todas as ${competicoesInscrito.length} inscrições ativas estão sendo exibidas.`;
    }
}

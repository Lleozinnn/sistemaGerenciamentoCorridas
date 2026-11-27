// Esta é a View.

import { CompeticaoController } from "../../controllers/competicaoController.js";

const formEdicaoCompeticao = document.querySelector("#competition-edit-form");
const inNomeCompeticao = document.querySelector("#competition-name");
const inLocalCompeticao = document.querySelector("#competition-location");
const inDataHorario = document.querySelector("#competition-date");
const inDistancia = document.querySelector("#competition-distance");
const inNumeroMaximoVagas = document.querySelector("#competition-capacity");
const inValorInscricao = document.querySelector("#registration-fee");
const inModalidade = document.querySelector("#competition-modality");
const inStatusCompeticao = document.querySelector("#competition-status");
const btExcluirCompeticao = document.querySelector("#delete-competition");
const mensagemEdicao = document.querySelector("#competition-edit-message");
const paginaEdicao = document.querySelector("#competition-edit-page");
const mensagemErroPagina = document.querySelector("#competition-edit-error");
const textoErroPagina = document.querySelector(
    "#competition-edit-error-message",
);

const competicaoController = new CompeticaoController();

function exibirMensagemEdicao(tipo, mensagem) {
    mensagemEdicao.textContent = mensagem;
    mensagemEdicao.className =
        tipo === "SUCESSO"
            ? "competition-edit-message"
            : "competition-edit-message competition-edit-message--error";
    mensagemEdicao.hidden = false;
}

function exibirErroPagina(mensagem) {
    textoErroPagina.textContent = mensagem;
    mensagemErroPagina.hidden = false;
}

const idInformado = new URLSearchParams(window.location.search).get("id");
const idCompeticao = Number(idInformado);

if (
    idInformado === null ||
    idInformado.trim() === "" ||
    !Number.isSafeInteger(idCompeticao) ||
    idCompeticao <= 0
) {
    exibirErroPagina("Informe na URL o ID de uma competição existente.");
} else {
    const resultadoBusca =
        competicaoController.buscarCompeticaoPorId(idCompeticao);

    if (resultadoBusca.tipo === "ERRO") {
        exibirErroPagina(resultadoBusca.mensagem);
    } else {
        const competicao = resultadoBusca.competicao;
        paginaEdicao.hidden = false;
        inNomeCompeticao.value = competicao.nome;
        inLocalCompeticao.value = competicao.local;
        inDataHorario.value = competicao.dataHorario;
        inDistancia.value = competicao.distanciaKm;
        inNumeroMaximoVagas.value = competicao.limiteVagas;
        inValorInscricao.value = competicao.valorInscricao;
        inStatusCompeticao.value = competicao.status;
        inModalidade.value =
            competicao.modalidade === "Urbano"
                ? "Maratona Urbana"
                : competicao.modalidade;

        formEdicaoCompeticao.addEventListener("submit", (event) => {
            event.preventDefault();

            const nome = inNomeCompeticao.value.trim();
            const local = inLocalCompeticao.value.trim();
            const dataHorario = inDataHorario.value;
            const distancia = Number(inDistancia.value);
            const numeroMaximoVagas = Number(inNumeroMaximoVagas.value);
            const valorInscricao = Number(inValorInscricao.value);
            const status = inStatusCompeticao.value.trim();

            let formularioValido = true;

            if (!nome) {
                exibirMensagemEdicao("ERRO", "Informe o nome da competição.");
                inNomeCompeticao.focus();
                formularioValido = false;
            } else if (!local) {
                exibirMensagemEdicao("ERRO", "Informe o local da competição.");
                inLocalCompeticao.focus();
                formularioValido = false;
            } else if (!dataHorario || Number.isNaN(new Date(dataHorario).getTime())) {
                exibirMensagemEdicao("ERRO", "Informe uma data e horário válidos.");
                inDataHorario.focus();
                formularioValido = false;
            } else if (!Number.isFinite(distancia) || distancia <= 0) {
                exibirMensagemEdicao("ERRO", "Informe uma distância maior que zero.");
                inDistancia.focus();
                formularioValido = false;
            } else if (!Number.isInteger(numeroMaximoVagas) || numeroMaximoVagas <= 0) {
                exibirMensagemEdicao(
                    "ERRO",
                    "Informe um número inteiro de vagas maior que zero.",
                );
                inNumeroMaximoVagas.focus();
                formularioValido = false;
            } else if (!Number.isFinite(valorInscricao) || valorInscricao < 0) {
                exibirMensagemEdicao(
                    "ERRO",
                    "Informe um valor de inscrição igual ou maior que zero.",
                );
                inValorInscricao.focus();
                formularioValido = false;
            } else if (!status) {
                exibirMensagemEdicao("ERRO", "Informe o status da competição.");
                inStatusCompeticao.focus();
                formularioValido = false;
            }

            if (formularioValido) {
                const resultadoEdicao = competicaoController.editarCompeticao(
                    idCompeticao,
                    nome,
                    local,
                    dataHorario,
                    distancia,
                    numeroMaximoVagas,
                    valorInscricao,
                    status,
                );
                exibirMensagemEdicao(
                    resultadoEdicao.tipo,
                    resultadoEdicao.mensagem,
                );
            }
        });

        btExcluirCompeticao.addEventListener("click", () => {
            if (window.confirm("Tem certeza de que deseja excluir esta competição?")) {
                const resultadoExclusao =
                    competicaoController.excluirCompeticao(idCompeticao);
                if (resultadoExclusao.tipo === "SUCESSO") {
                    window.location.assign("consultarCompeticoes.html");
                } else {
                    exibirMensagemEdicao(
                        resultadoExclusao.tipo,
                        resultadoExclusao.mensagem,
                    );
                }
            }
        });
    }
}

// Esta é a View.

import { CompeticaoController } from "../../controllers/competicaoController.js";

// Instancie aqui todos os elementos html da página que irá utilizar para manipular.

const inNomeCompeticao = document.querySelector("#competition-name");
const inLocalCompeticao = document.querySelector("#competition-location");
const inDataHorario = document.querySelector("#competition-date");
const inDistancia = document.querySelector("#competition-distance");
const inNumeroMaximoVagas = document.querySelector("#competition-capacity");
const inValorInscricao = document.querySelector("#registration-fee");
const selectModalidade = document.querySelector("#modality");
const inAltimetriaAcumulada = document.querySelector("#elevation");
const inPercursoUrbano = document.querySelector("#route");
const areaDescricaoTrajeto = document.querySelector("#route-description");
const inPontoLargada = document.querySelector("#start-point");
const inLinhaChegada = document.querySelector("#finish-point");
const inTipoTerreno = document.querySelector("#tipoTerreno");
const inNivelDificuldade = document.querySelector("#nivelDificuldade");
const inQuantidadeCheckpoints = document.querySelector("#quantidadeCheckpoints");
const areaLocalizacaoCheckpoints = document.querySelector("#localizacaoCheckpoints");
const inTipoProva = document.querySelector("#tipoProva");
const secaoCamposEspecificos = document.querySelector(".specific-fields");
const tituloModalidade = document.querySelector("#modality-title");
const camposUrbanos = document.querySelector("#urban-fields");
const camposTrail = document.querySelector("#trail-fields");
const formCadastro = document.querySelector("main form");
const mensagemFormulario = document.querySelector("#competition-form-message");
const btLimpar = document.querySelector("#btLimpar");
const btCadastrar = document.querySelector("#btCadastrar");

const competicaoController = new CompeticaoController();

function atualizarCamposModalidade() {
    // Lógica de solicitar campos diferentes de acordo com a modalidade selecionada.

    const modalidade = selectModalidade.value;
    const mostrarCamposUrbanos = modalidade === "Urbano";
    const mostrarCamposTrail = modalidade === "Trail Running";

    secaoCamposEspecificos.hidden = !mostrarCamposUrbanos && !mostrarCamposTrail;
    camposUrbanos.hidden = !mostrarCamposUrbanos;
    camposTrail.hidden = !mostrarCamposTrail;
    tituloModalidade.textContent = mostrarCamposUrbanos ? "Maratona Urbana" : "Trail Running";

    camposUrbanos.querySelectorAll("input, textarea").forEach(campo => {
        campo.disabled = !mostrarCamposUrbanos;
    });
    camposTrail.querySelectorAll("input, textarea").forEach(campo => {
        campo.disabled = !mostrarCamposTrail;
    });
}

selectModalidade.addEventListener("change", atualizarCamposModalidade);

atualizarCamposModalidade();

function validarCadastro() {
    const nomeCompeticao = inNomeCompeticao.value.trim();
    const localCompeticao = inLocalCompeticao.value.trim();
    const distancia = Number(inDistancia.value);
    const numeroMaximoVagas = Number(inNumeroMaximoVagas.value);
    const valorInscricao = Number(inValorInscricao.value);
    const modalidade = selectModalidade.value;
    const dataHorario = new Date(inDataHorario.value);
    function exibirErro(mensagem, campo) {
        mensagemFormulario.textContent = mensagem;
        mensagemFormulario.className = "form-message form-message--error";
        mensagemFormulario.hidden = false;
        campo.focus();
    };
    let opcoesModalidade;

    if (nomeCompeticao === "") {
        exibirErro("Informe o nome da competição.", inNomeCompeticao);
    } else if (localCompeticao === "") {
        exibirErro("Informe o local da competição.", inLocalCompeticao);
    } else if (
        inDataHorario.value === "" ||
        Number.isNaN(dataHorario.getTime()) ||
        dataHorario <= new Date()
    ) {
        exibirErro(
            "Informe uma data e horário posteriores ao momento atual.",
            inDataHorario,
        );
    } else if (
        inDistancia.value === "" ||
        !Number.isFinite(distancia) ||
        distancia <= 0
    ) {
        exibirErro("Informe uma distância maior que zero.", inDistancia);
    } else if (
        inNumeroMaximoVagas.value === "" ||
        !Number.isInteger(numeroMaximoVagas) ||
        numeroMaximoVagas <= 0
    ) {
        exibirErro(
            "Informe um número inteiro de vagas maior que zero.",
            inNumeroMaximoVagas,
        );
    } else if (
        inValorInscricao.value === "" ||
        !Number.isFinite(valorInscricao) ||
        valorInscricao < 0
    ) {
        exibirErro(
            "Informe um valor de inscrição igual ou maior que zero.",
            inValorInscricao,
        );
    } else if (modalidade === "") {
        exibirErro("Selecione uma modalidade.", selectModalidade);
    } else {
        let opcoesModalidade;

        if (modalidade === "Urbano") {
            const altimetriaAcumulada = Number(inAltimetriaAcumulada.value);

            if (
                inAltimetriaAcumulada.value === "" ||
                !Number.isFinite(altimetriaAcumulada) ||
                altimetriaAcumulada < 0
            ) {
                exibirErro(
                    "Informe uma altimetria igual ou maior que zero.",
                    inAltimetriaAcumulada,
                );
            } else if (inPercursoUrbano.value.trim() === "") {
                exibirErro("Informe o percurso urbano.", inPercursoUrbano);
            } else if (areaDescricaoTrajeto.value.trim() === "") {
                exibirErro(
                    "Informe a descrição detalhada do trajeto.",
                    areaDescricaoTrajeto,
                );
            } else if (inPontoLargada.value.trim() === "") {
                exibirErro("Informe o ponto de largada.", inPontoLargada);
            } else if (inLinhaChegada.value.trim() === "") {
                exibirErro("Informe a linha de chegada.", inLinhaChegada);
            } else {
                opcoesModalidade = {
                    altimetria: altimetriaAcumulada,
                    percursoUrbano: inPercursoUrbano.value.trim(),
                    descricaoTrajeto: areaDescricaoTrajeto.value.trim(),
                    pontosLargadaChegada:
                        `Largada: ${inPontoLargada.value.trim()}; ` +
                        `Chegada: ${inLinhaChegada.value.trim()}`,
                };
            }
        } else if (modalidade === "Trail Running") {
            if (inTipoTerreno.value.trim() === "") {
                exibirErro("Informe o tipo de terreno.", inTipoTerreno);
            } else if (inNivelDificuldade.value.trim() === "") {
                exibirErro("Informe o nível de dificuldade.", inNivelDificuldade);
            } else {
                const quantidadeCheckpoints =
                    Number(inQuantidadeCheckpoints.value);

                if (
                    inQuantidadeCheckpoints.value === "" ||
                    !Number.isInteger(quantidadeCheckpoints) ||
                    quantidadeCheckpoints <= 0
                ) {
                    exibirErro(
                        "Informe uma quantidade inteira de checkpoints maior que zero.",
                        inQuantidadeCheckpoints,
                    );
                } else if (areaLocalizacaoCheckpoints.value.trim() === "") {
                    exibirErro(
                        "Informe a localização dos checkpoints.",
                        areaLocalizacaoCheckpoints,
                    );
                } else if (inTipoProva.value.trim() === "") {
                    exibirErro("Informe o tipo de prova.", inTipoProva);
                } else {
                    opcoesModalidade = {
                        tipoTerreno: inTipoTerreno.value.trim(),
                        nivelDificuldade: inNivelDificuldade.value.trim(),
                        quantidadeCheckpoints,
                        localizacaoCheckpoints:
                            areaLocalizacaoCheckpoints.value.trim(),
                        tipoProva: inTipoProva.value.trim(),
                    };
                }
            }
        } else {
            exibirErro("Selecione uma modalidade válida.", selectModalidade);
        }

        if (opcoesModalidade) {
            return {
                nomeCompeticao,
                localCompeticao,
                dataHorario: inDataHorario.value,
                distancia,
                numeroMaximoVagas,
                valorInscricao,
                modalidade,
                opcoesModalidade,
            };
        }
    }

    return null;
}

function cadastrar() {
    const dadosCompeticao = validarCadastro();

    if (dadosCompeticao) {
        const resultado = competicaoController.cadastrarCompeticao(
            dadosCompeticao.nomeCompeticao,
            dadosCompeticao.localCompeticao,
            dadosCompeticao.dataHorario,
            dadosCompeticao.distancia,
            dadosCompeticao.numeroMaximoVagas,
            dadosCompeticao.valorInscricao,
            dadosCompeticao.modalidade,
            dadosCompeticao.opcoesModalidade,
        );

        mensagemFormulario.textContent = resultado.mensagem;
        mensagemFormulario.className =
            resultado.tipo === "SUCESSO"
                ? "form-message form-message--success"
                : "form-message form-message--error";
        mensagemFormulario.hidden = false;

        if (resultado.tipo === "SUCESSO") {
            formCadastro.reset();
            atualizarCamposModalidade();
        }
    }
}

btCadastrar.addEventListener("click", cadastrar);

btLimpar.addEventListener("click", () => {
    formCadastro.reset();
    atualizarCamposModalidade();
    mensagemFormulario.textContent = "";
    mensagemFormulario.hidden = true;
});
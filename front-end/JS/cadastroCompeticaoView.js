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

function cadastrar() {
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
        return;
    } else if (localCompeticao === "") {
        exibirErro("Informe o local da competição.", inLocalCompeticao);
        return;
    } else if (
        inDataHorario.value === "" ||
        Number.isNaN(dataHorario.getTime()) ||
        dataHorario <= new Date()
    ) {
        exibirErro(
            "Informe uma data e horário posteriores ao momento atual.",
            inDataHorario,
        );
        return;
    } else if (
        inDistancia.value === "" ||
        !Number.isFinite(distancia) ||
        distancia <= 0
    ) {
        exibirErro("Informe uma distância maior que zero.", inDistancia);
        return;
    } else if (
        inNumeroMaximoVagas.value === "" ||
        !Number.isInteger(numeroMaximoVagas) ||
        numeroMaximoVagas <= 0
    ) {
        exibirErro(
            "Informe um número inteiro de vagas maior que zero.",
            inNumeroMaximoVagas,
        );
        return;
    } else if (
        inValorInscricao.value === "" ||
        !Number.isFinite(valorInscricao) ||
        valorInscricao < 0
    ) {
        exibirErro(
            "Informe um valor de inscrição igual ou maior que zero.",
            inValorInscricao,
        );
        return;
    } else if (modalidade === "") {
        exibirErro("Selecione uma modalidade.", selectModalidade);
        return;
    }

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
            return;
        } else if (inPercursoUrbano.value.trim() === "") {
            exibirErro("Informe o percurso urbano.", inPercursoUrbano);
            return;
        } else if (areaDescricaoTrajeto.value.trim() === "") {
            exibirErro(
                "Informe a descrição detalhada do trajeto.",
                areaDescricaoTrajeto,
            );
            return;
        } else if (inPontoLargada.value.trim() === "") {
            exibirErro("Informe o ponto de largada.", inPontoLargada);
            return;
        } else if (inLinhaChegada.value.trim() === "") {
            exibirErro("Informe a linha de chegada.", inLinhaChegada);
            return;
        }

        opcoesModalidade = {
            altimetria: altimetriaAcumulada,
            percursoUrbano: inPercursoUrbano.value.trim(),
            descricaoTrajeto: areaDescricaoTrajeto.value.trim(),
            pontosLargadaChegada:
                `Largada: ${inPontoLargada.value.trim()}; ` +
                `Chegada: ${inLinhaChegada.value.trim()}`,
        };
    } else if (modalidade === "Trail Running") {
        if (inTipoTerreno.value.trim() === "") {
            exibirErro("Informe o tipo de terreno.", inTipoTerreno);
            return;
        } else if (inNivelDificuldade.value.trim() === "") {
            exibirErro("Informe o nível de dificuldade.", inNivelDificuldade);
            return;
        }

        const quantidadeCheckpoints = Number(inQuantidadeCheckpoints.value);
        if (
            inQuantidadeCheckpoints.value === "" ||
            !Number.isInteger(quantidadeCheckpoints) ||
            quantidadeCheckpoints <= 0
        ) {
            exibirErro(
                "Informe uma quantidade inteira de checkpoints maior que zero.",
                inQuantidadeCheckpoints,
            );
            return;
        } else if (areaLocalizacaoCheckpoints.value.trim() === "") {
            exibirErro(
                "Informe a localização dos checkpoints.",
                areaLocalizacaoCheckpoints,
            );
            return;
        } else if (inTipoProva.value.trim() === "") {
            exibirErro("Informe o tipo de prova.", inTipoProva);
            return;
        }

        opcoesModalidade = {
            tipoTerreno: inTipoTerreno.value.trim(),
            nivelDificuldade: inNivelDificuldade.value.trim(),
            quantidadeCheckpoints,
            localizacaoCheckpoints: areaLocalizacaoCheckpoints.value.trim(),
            tipoProva: inTipoProva.value.trim(),
        };
    } else {
        exibirErro("Selecione uma modalidade válida.", selectModalidade);
        return;
    }

    const resultado = competicaoController.cadastrarCompeticao(
        nomeCompeticao,
        localCompeticao,
        inDataHorario.value,
        distancia,
        numeroMaximoVagas,
        valorInscricao,
        modalidade,
        opcoesModalidade,
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

btCadastrar.addEventListener("click", cadastrar);

btLimpar.addEventListener("click", () => {
    formCadastro.reset();
    atualizarCamposModalidade();
    mensagemFormulario.textContent = "";
    mensagemFormulario.hidden = true;
});
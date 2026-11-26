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
const btCadastrar = document.querySelector("#btCadastrar");
const btLimpar = document.querySelector("#btLimpar");

// Inicialize o controller aqui e carregue os dados do localStorage

// Adicione um elemento de escuta a um botão e inicie sua lógica para cadastrar / excluir / editar informações.
// Todas as validações devem ser realizadas nesta camada.
// O controller deverá ser chamado apenas para realizar as operações dispostas em cada método.

const competicaoController = new CompeticaoController();
console.log(competicaoController.cadastrarCompeticao("teste", "teste4", "teste", "teste", "teste", "teste", "Urbano", {
    altimetria: "123",
    percursoUrbano: "teste",
    descricaoTrajeto: "teste",
    pontosLargadaChegada: "teste"
}))

function atualizarCamposModalidade() {
    // Lógica de solicitar campos diferentes de acordo com a modalidade selecionada.

    const modalidade = selectModalidade.value;
    const mostrarCamposUrbanos = modalidade === "Urbano";
    const mostrarCamposTrail = modalidade === "Trail Running";

    secaoCamposEspecificos.hidden = !mostrarCamposUrbanos && !mostrarCamposTrail;
    camposUrbanos.hidden = !mostrarCamposUrbanos;
    camposTrail.hidden = !mostrarCamposTrail;
    tituloModalidade.textContent = mostrarCamposUrbanos ? "Maratona Urbana" : "Trail Running";
}

selectModalidade.addEventListener("change", atualizarCamposModalidade);

btCadastrar.addEventListener("click", event => { // Quando clicado o botão de cadastrar competição
    // Lógica de validação de informações e efetivação do cadastro
})

btLimpar.addEventListener("click", event => { // Quando clicado o botão de Limpar dados do formulário
    // Limnpeza dos campos de input do formulário
})
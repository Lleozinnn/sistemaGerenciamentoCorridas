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
const areaZonasVelocidade = document.querySelector("#speed-zones");

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

selectModalidade.addEventListener("change", event => {
    
})
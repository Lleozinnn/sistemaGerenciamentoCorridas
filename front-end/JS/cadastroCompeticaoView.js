// Esta é a View.

import { CompeticaoController } from "../../controllers/competicaoController.js";

// Instancie aqui todos os elementos html da página que irá utilizar para manipular.

// Campo de seleção (select) para escolher a modalidade esportiva (ex.: "maratona-urbana") e atualizar os campos específicos.
const selectModalidade = document.querySelector("#modality");
// Campo numérico (type="number") para informar a altimetria acumulada (desnível positivo do percurso) em metros.
const inAltimetriaAcumulada = document.querySelector("#elevation");
// Campo de texto (type="text") para listar as avenidas, ruas e vias principais do percurso urbano na ordem de passagem.
const inPercursoUrbano = document.querySelector("#route");
// Campo de texto longo (textarea) para escrever a descrição detalhada do trajeto (largada à chegada, cruzamentos, curvas, retornos e piso).
const areaDescricaoTrajeto = document.querySelector("#route-description");
// Campo de texto (type="text") para informar o ponto e o endereço da largada.
const inPontoLargada = document.querySelector("#start-point");
// Campo de texto (type="text") para informar o ponto e o endereço da linha de chegada.
const inLinhaChegada = document.querySelector("#finish-point");
// Campo de texto longo (textarea) para indicar as zonas de velocidade por quilômetro ou referência urbana (aceleração, ritmo e sprint final).
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
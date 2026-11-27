import { AtletaController } from "../../controllers/atletaController.js";
import { CompeticaoController } from "../../controllers/competicaoController.js";
import { AtletaController } from "../../controllers/atletaController.js";

// Obtém os campos e os resumos exibidos na tela de inscrição.
const selecaoAtleta = document.querySelector("#enrollment-athlete");
const selecaoCompeticao = document.querySelector("#enrollment-competition");
const resumoAtleta = document.querySelector("#athlete-summary");
const resumoCompeticao = document.querySelector("#competition-summary");
const formularioInscricao = document.querySelector("#enrollment-form");
const mensagemInscricao = document.querySelector("#mensagem-inscricao");
const btInscricao = document.querySelector("#btInscricao");
btInscricao.disabled = false;
// Lê os atletas cadastrados e os adiciona à lista de seleção.


const competicaoController = new CompeticaoController();
const atletaController = new AtletaController();



// Atualiza o resumo e a validação conforme o atleta selecionado.
function atualizarResumoAtleta() {
    const opcaoSelecionada = selecaoAtleta.selectedOptions[0];
    const modalidade = opcaoSelecionada.dataset.modalidade;
    if (!opcaoSelecionada || !opcaoSelecionada.value) {
        resumoAtleta.textContent = "Modalidade do atleta: não selecionada";
        btInscricao.style.backgroundColor = "grey";
        btInscricao.disabled = true;
    } else {
        resumoAtleta.textContent = `Modalidade do atleta: ${modalidade}`;

        // Caso um atleta seja selecionado, ativa o botão de inscrição.
        btInscricao.disabled = false;
        btInscricao.style.backgroundColor = "rgb(24, 174, 162)";
    }

// Atualiza o resumo da modalidade da competição selecionada.
function atualizarResumoCompeticao() {
    btInscricao.disabled = true;
    btInscricao.style.backgroundColor = "grey";
    const opcaoSelecionada = selecaoCompeticao.selectedOptions[0];
    const modalidade = opcaoSelecionada.dataset.modalidade;
    if (!opcaoSelecionada || !opcaoSelecionada.value) {
        resumoCompeticao.textContent = "Modalidade da competição: não selecionada";
        selecaoAtleta.innerHTML = "";
        selecaoAtleta.innerHTML = "<option data-modalidade='não selecionada' value=''>Selecione um atleta</option>";
        selecaoAtleta.disabled = true;
    } else {
        // Exibe a modalidade de competição na tela
        resumoCompeticao.textContent = `Modalidade da competição: ${modalidade}`;

        // Busca pelos competidores com a mesma modalidade
        const atletas = atletaController.listarAtletasPorModalidade(modalidade).atletas;

        // Listagem dos atletas compatíveis com a competição no dropdown
        const numeroCompeticao = Number(opcaoSelecionada.value)
        selecaoAtleta.innerHTML = "<option data-modalidade='não selecionada' value=''>Selecione um atleta</option>";
        const inscricoes = competicaoController.listarInscricoesCompeticao(numeroCompeticao);
        atletas.forEach((atleta) => {
            // Lista apenas os atletas que não estiverem inscritos
            const inscrito = inscricoes.find(inscr => inscr.cpf == atleta.cpf)
            if (inscrito == undefined) {
                const option = document.createElement("option");
                option.value = atleta.cpf;
                option.textContent =
                    `${atleta.nome} • Atleta CPF ${atleta.cpf} • ${atleta.modalidade}`;
                option.dataset.modalidade = atleta.modalidade;
                option.dataset.nome = atleta.nome;
                selecaoAtleta.appendChild(option);
            }
        });
        // Informa quando ainda não há atletas cadastrados.
        if (atletas.length === 0) {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "Nenhum atleta cadastrado";
            selecaoAtleta.innerHTML = "";
            selecaoAtleta.disabled = true;
            selecaoAtleta.appendChild(option);
        }
        selecaoAtleta.disabled = false;
    }
};
// Carrega as competições disponíveis na lista de seleção.
const competicoes = competicaoController.listarCompeticoes();

competicoes.forEach((competicao) => {
    const option = document.createElement("option");
    option.textContent = `${competicao.nome} • ${competicao.modalidade}`;
    if (competicao.vagasDisponiveis == 0) {
        option.textContent += " - Sem vagas";
        option.disabled = true;
    }
    option.value = competicao.id;

    option.dataset.modalidade = competicao.modalidade;
    selecaoCompeticao.appendChild(option);
});

// Recalcula os resumos sempre que uma opção for alterada

selecaoAtleta.addEventListener("change", atualizarResumoAtleta);
selecaoCompeticao.addEventListener("change", atualizarResumoCompeticao);

// Apresenta os resumos iniciais ao abrir a tela.
atualizarResumoAtleta();
atualizarResumoCompeticao();


function exibirResultadoInscricao(resultadoController) {
    const inscricaoRealizada = resultadoController.tipo === "SUCESSO";
    const mensagem = resultadoController.mensagem;

    mensagemInscricao.textContent =
        `${inscricaoRealizada ? "Inscrição realizada" : "Inscrição não realizada"}: ${mensagem}`;
    mensagemInscricao.className =
        `notice ${inscricaoRealizada ? "notice--success" : "notice--error"}`;
    mensagemInscricao.hidden = false;

    return { inscricaoRealizada, mensagem };
}

function inscrever(evento) {
    evento.preventDefault();
    const opcaoSelecionadaCompeticao = selecaoCompeticao.selectedOptions[0];
    const opcaoSelecionadaAtleta = selecaoAtleta.selectedOptions[0];

    const idCompeticao = Number(opcaoSelecionadaCompeticao.value);
    const cpfAtleta = opcaoSelecionadaAtleta.value;

    const resultadoController = competicaoController.inscreverAtleta(
        idCompeticao,
        cpfAtleta,
    );
    const resultado = exibirResultadoInscricao(resultadoController);

    if (resultado.inscricaoRealizada) {
        atualizarResumoCompeticao();
    }

    return resultado;
}

formularioInscricao.addEventListener("submit", inscrever);

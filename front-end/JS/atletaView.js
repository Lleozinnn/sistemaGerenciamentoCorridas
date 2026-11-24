import AtletaController from "../../controllers/atletaController.js";

const atletaController = new AtletaController();
const formCadastroAtleta = document.querySelector("#athlete-registration-form");
const inNome = document.querySelector("#athlete-name");
const inCpf = document.querySelector("#athlete-cpf");
const inNacionalidade = document.querySelector("#athlete-nationality");
const radioModalidade = document.querySelectorAll('input[name="modalidade"]');
const dtNascimento = document.querySelector("#athlete-birth-date");
const btCadastrar = document.querySelector("#btCadastrar");
const mensagemAtleta = document.querySelector("#mensagemAtleta");
const mensagemTitulo = document.querySelector("#mensagemAtletaTitulo");
const mensagemTexto = document.querySelector("#mensagemAtletaTexto");

const exibirMensagem = (tipo, titulo, texto) => {
    mensagemAtleta.hidden = false;
    mensagemAtleta.className =
        `athlete-registration-message field--wide athlete-registration-message--${tipo}`;
    mensagemTitulo.textContent = titulo;
    mensagemTexto.textContent = texto;
};

formCadastroAtleta.addEventListener("submit", (event) => {
    event.preventDefault();
    // trim() remove os espaços em branco do início e do fim da string
    const nome = inNome.value.trim();
    const cpf = inCpf.value.trim();
    const nacionalidade = inNacionalidade.value.trim();
    const modalidade = Array.from(radioModalidade).find(radio => radio.checked)?.value;
    const nascimento = dtNascimento.value;

    if (!nome) {
        exibirMensagem("error", "Nome obrigatório", "Informe o nome completo do atleta.");
        inNome.focus();
        return;
    }

    if (!cpf) {
        exibirMensagem("error", "CPF obrigatório", "Informe o CPF do atleta.");
        inCpf.focus();
        return;
    }

    if (!nascimento) {
        exibirMensagem("error", "Data de nascimento obrigatória", "Informe a data de nascimento do atleta.");
        dtNascimento.focus();
        return;
    }

    if (!nacionalidade) {
        exibirMensagem("error", "Nacionalidade obrigatória", "Informe a nacionalidade do atleta.");
        inNacionalidade.focus();
        return;
    }

    if (!modalidade) {
        exibirMensagem("error", "Modalidade obrigatória", "Selecione Urbano ou Trail Running.");
        return;
    }

    const resultado = atletaController.cadastrarAtleta(
        nome.trim(),
        cpf,
        nascimento,
        nacionalidade,
        modalidade
    );

    if (resultado.tipo === "SUCESSO") {
        exibirMensagem("success", "Cadastro realizado", resultado.mensagem);
        formCadastroAtleta.reset();
    } else {
        exibirMensagem("error", "Cadastro não realizado", resultado.mensagem);
        inCpf.focus();
    }
});


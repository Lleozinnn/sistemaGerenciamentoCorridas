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
const STORAGE_KEY = "atletasCadastrados";

const salvarAtletas = () => {
    const atletas = atletaController.listarAtletas().map((atleta) => {
        const resultado = atletaController.consultarAtleta(atleta.cpf);
        return resultado.tipo === "SUCESSO" ? resultado.atleta : atleta;
    });
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(atletas));
};

const carregarAtletas = () => {
    const atletasSalvos = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");

    atletasSalvos.forEach((atleta) => {
        if (!atletaController.buscarCpf(atleta.cpf)) {
            atletaController.cadastrarAtleta(
                atleta.nome,
                atleta.cpf,
                atleta.dtNascimento || "",
                atleta.nacionalidade || "",
                atleta.modalidade
            );
        }
    });
};

const exibirMensagem = (tipo, titulo, texto) => {
    mensagemAtleta.hidden = false;
    mensagemAtleta.className =
        `athlete-registration-message field--wide athlete-registration-message--${tipo}`;
    mensagemTitulo.textContent = titulo;
    mensagemTexto.textContent = texto;
};

if (formCadastroAtleta) {
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
            salvarAtletas();
        } else {
            exibirMensagem("error", "Cadastro não realizado", resultado.mensagem);
            inCpf.focus();
        }
    });
}

const athleteFilterForm = document.querySelector("#athlete-filter-form");

if (athleteFilterForm) {
    carregarAtletas();

    const athleteSearch = document.querySelector("#athlete-search");
    const athleteModality = document.querySelector("#athlete-modality");
    const athleteTableBody = document.querySelector("#athlete-table-body");
    const athleteListCaption = document.querySelector("#athlete-list-caption");
    const athleteFilterCaption = document.querySelector("#athlete-filter-caption");
    const athleteTableSummary = document.querySelector("#athlete-table-summary");
    const athleteDetails = document.querySelector("#athlete-details");
    const athleteDetailsName = document.querySelector("#athlete-details-name");
    const athleteDetailsInfo = document.querySelector("#athlete-details-info");

    const removerFormatacaoCpf = (cpf) => cpf.replace(/\D/g, "");

    const encontrarPorCpf = (cpf) => {
        const cpfPesquisado = removerFormatacaoCpf(cpf);

        return atletaController.listarAtletas().find(
            (atleta) => removerFormatacaoCpf(atleta.cpf) === cpfPesquisado
        );
    };

    const renderizarAtletas = (atletas) => {
        athleteTableBody.innerHTML = "";

        if (atletas.length === 0) {
            athleteTableBody.innerHTML =
                '<tr><td colspan="5">Nenhum atleta encontrado</td></tr>';
        } else {
            atletas.forEach((atleta) => {
                const linha = document.createElement("tr");
                linha.innerHTML = `
                    <td>${atleta.nome}</td>
                    <td>#${atleta.id}</td>
                    <td>${atleta.modalidade}</td>
                    <td>0</td>
                    <td>
                        <a class="button button--small button--secondary"
                           href="inscricoesAtivas.html">Ver inscrições</a>
                    </td>
                `;
                athleteTableBody.appendChild(linha);
            });
        }

        athleteListCaption.textContent =
            `${atletas.length} ${atletas.length === 1 ? "atleta encontrado" : "atletas encontrados"}`;
        athleteTableSummary.textContent =
            `${atletas.length} ${atletas.length === 1 ? "atleta listado" : "atletas listados"}`;
    };

    athleteFilterForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const cpf = athleteSearch.value.trim();
        const modalidade = athleteModality.value;
        athleteDetails.hidden = true;

        if (cpf) {
            const atleta = encontrarPorCpf(cpf);

            if (!atleta) {
                athleteFilterCaption.textContent = "CPF não encontrado";
                renderizarAtletas([]);
                return;
            }

            const resultado = atletaController.consultarAtleta(atleta.cpf);

            if (resultado.tipo === "SUCESSO") {
                const dados = resultado.atleta;
                athleteFilterCaption.textContent = `Atleta encontrado pelo CPF ${cpf}`;
                renderizarAtletas([atleta]);
                athleteDetails.hidden = false;
                athleteDetailsName.textContent = dados.nome;
                athleteDetailsInfo.textContent =
                    `CPF: ${dados.cpf} | Data de nascimento: ${dados.dtNascimento} | Idade: ${dados.idade} | Nacionalidade: ${dados.nacionalidade} | Modalidade: ${dados.modalidade}`;
            }
            return;
        }

        if (modalidade) {
            const resultado = atletaController.listarAtletasPorModalidade(modalidade);

            if (resultado.tipo === "SUCESSO") {
                athleteFilterCaption.textContent = `Filtro aplicado: ${modalidade}`;
                renderizarAtletas(resultado.atletas);
            } else {
                athleteFilterCaption.textContent = resultado.mensagem;
                renderizarAtletas([]);
            }
            return;
        }

        athleteFilterCaption.textContent = "Nenhum filtro aplicado";
        renderizarAtletas(atletaController.listarAtletas());
    });

    renderizarAtletas(atletaController.listarAtletas());
}


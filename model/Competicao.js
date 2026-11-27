import { Atleta } from "./Atleta.js";

export class ErroValidacaoInscricao extends Error {
    constructor(mensagem, etapa) {
        super(mensagem);
        this.name = "ErroValidacaoInscricao";
        this.etapa = etapa;
    }
}

export class Competicao {
    static #qtCompeticoes = 0;
    #id;
    #nome;
    #local;
    #dataHorario;
    #distanciaKm;
    #valorInscricao;
    #limiteVagas;
    #status;
    #atletasInscritos;

    constructor(nome, local, dataHorario, distanciaKm = 0.0, valorInscricao = 0.0, limiteVagas = 1, id) {
        this.#nome = nome;
        this.#local = local;
        this.#dataHorario = dataHorario;
        this.#distanciaKm = distanciaKm;
        this.#valorInscricao = valorInscricao;
        this.#limiteVagas = limiteVagas;
        this.#status = "Aberta";
        this.#atletasInscritos = [];
        this.#id = Number.isSafeInteger(Number(id)) && Number(id) > 0
            ? Number(id)
            : ++Competicao.#qtCompeticoes;
        Competicao.#qtCompeticoes = Math.max(Competicao.#qtCompeticoes, this.#id);
        this.atualizarStatusCompeticao();
    }
    get id() {
        return this.#id;
    }
    get nome() {
        return this.#nome;
    }
    get local() {
        return this.#local;
    }
    get dataHorario() {
        return this.#dataHorario;
    }
    get distanciaKm() {
        return this.#distanciaKm;
    }
    get valorInscricao() {
        return this.#valorInscricao;
    }
    get limiteVagas() {
        return this.#limiteVagas;
    }
    get status() {
        return this.#status;
    }
    get atletasInscritos() {
        return this.#atletasInscritos.slice();
    }
    set nome(nome) {
        this.#nome = nome;
    }
    set local(local) {
        this.#local = local;
    }
    set dataHorario(dataHorario) {
        this.#dataHorario = dataHorario;
    }
    set distanciaKm(distanciaKm) {
        this.#distanciaKm = distanciaKm;
    }
    set valorInscricao(valorInscricao) {
        this.#valorInscricao = valorInscricao;
    }
    set limiteVagas(limiteVagas) {
        this.#limiteVagas = limiteVagas;
        this.atualizarStatusCompeticao();
    }
    set status(status) {
        this.#status = status;
    }

    vagasDisponiveis() {
        return this.#limiteVagas - this.#atletasInscritos.length;
    }

    atualizarStatusCompeticao() {
        if (this.vagasDisponiveis() <= 0) {
            this.#status = "Vagas Esgotadas";
        } else {
            this.#status = "Aberta";
        }
    }

    quantidadeAtletasInscritos() {
        return this.#atletasInscritos.length;
    }

    listarAtletasInscritos() {
        return this.#atletasInscritos.slice();
    }

    gerarRelatorioAtletasInscritos() {
        if (this.#atletasInscritos.length === 0) {
            return "Nenhum atleta inscrito nesta competição.";
        }

        let relatorio = `Relatório de Atletas Inscritos na Competição: ${this.#nome}\n`;
        relatorio += "--------------------------------------------------\n";
        this.#atletasInscritos.forEach((atleta, index) => {
            relatorio += `${index + 1}. Nome: ${atleta.nome}, CPF: ${atleta.cpf}, Modalidade: ${atleta.modalidade}\n`;
        });
        relatorio += "--------------------------------------------------\n";
        relatorio += `Total de Atletas Inscritos: ${this.#atletasInscritos.length}\n`;

        return relatorio;
    }
    inscreverAtleta (atleta) {
        this.#validarModalidade(atleta);
        this.#validarVagas();
        this.#validarDuplicidade(atleta);
        this.#atletasInscritos.push(atleta);
        this.atualizarStatusCompeticao();
        return true;
    }

    #validarModalidade(atleta) {
        if (!(atleta instanceof Atleta) || atleta.modalidade !== this.modalidade) {
            throw new ErroValidacaoInscricao(
                "O atleta não atende à modalidade desta competição.",
                "modalidade",
            );
        }
    }

    #validarVagas() {
        if (this.vagasDisponiveis() <= 0) {
            throw new ErroValidacaoInscricao(
                "Não há vagas disponíveis nesta competição.",
                "capacidade",
            );
        }
    }

    #validarDuplicidade(atleta) {
        const jaInscrito = this.#atletasInscritos.some(
            (atletaInscrito) =>
                atletaInscrito.cpf === atleta.cpf ||
                atletaInscrito.id === atleta.id,
        );
        if (jaInscrito) {
            throw new ErroValidacaoInscricao(
                "Este atleta já está inscrito nesta competição.",
                "duplicidade",
            );
        }
    }
}  
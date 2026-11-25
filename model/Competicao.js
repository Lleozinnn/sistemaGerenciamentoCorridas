import { Atleta } from "./Atleta.js";

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

    constructor(nome, local, dataHorario, distanciaKm = 0.0, valorInscricao = 0.0, limiteVagas = 1) {
        this.nome = nome;
        this.local = local;
        this.dataHorario = dataHorario;
        this.distanciaKm = distanciaKm;
        this.valorInscricao = valorInscricao;
        this.limiteVagas = limiteVagas;
        this.#status = "Aberta";
        this.#atletasInscritos = [];
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
        return this.#atletasInscritos;
    }
    set nome(nome) {
        this.#nome = nome;
    }
    set dataHorario(dataHorario) {
        this.#dataHorario = dataHorario;
    }
    set valorInscricao(valorInscricao) {
        this.#valorInscricao = valorInscricao;
    }
    set limiteVagas(limiteVagas) {
        this.#limiteVagas = limiteVagas;
    }
    set status(status) {
        this.#status = status;
    }

    inscreverAtleta (atleta) {
        if (atleta instanceof Atleta) {
            this.#atletasInscritos.push(atleta);
            return true;
        }
        return false;
    }
}  
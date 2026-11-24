import Competicao from "./Competicao.js";

export class TrailRunning extends Competicao {
    #tipoTerreno;
    #nivelDificuldade;
    #quantidadeCheckpoints;
    #localizacaoCheckpoints;
    #tipoProva;

    constructor(
        nome,
        local,
        dataHorario,
        distanciaKm = 0.0,
        valorInscricao = 0.0,
        limiteVagas = 1,
        tipoTerreno = "",
        nivelDificuldade = "Médio",
        quantidadeCheckpoints = 1,
        localizacaoCheckpoints = "",
        tipoProva = "Velocidade"
    ) {
        super(nome, local, dataHorario, distanciaKm, valorInscricao, limiteVagas);
        this.tipoTerreno = tipoTerreno;
        this.nivelDificuldade = nivelDificuldade;
        this.quantidadeCheckpoints = quantidadeCheckpoints;
        this.localizacaoCheckpoints = localizacaoCheckpoints;
        this.tipoProva = tipoProva;
    }

    get tipoTerreno() {
        return this.#tipoTerreno;
    }

    get nivelDificuldade() {
        return this.#nivelDificuldade;
    }

    get quantidadeCheckpoints() {
        return this.#quantidadeCheckpoints;
    }

    get localizacaoCheckpoints() {
        return this.#localizacaoCheckpoints;
    }

    get tipoProva() {
        return this.#tipoProva;
    }
}
import { Competicao } from "./Competicao.js";

export class Urbano extends Competicao {
    #altimetriaAcumulada;
    #percursoUrbano;
    #descricaoTrajeto;
    #pontosLargadaChegada;
    constructor(
        nome,
        local,
        dataHorario,
        distanciaKm = 0.0,
        valorInscricao = 0.0,
        limiteVagas = 1,
        altimetriaAcumulada = 0.0,
        percursoUrbano = "",
        descricaoTrajeto = "",
        pontosLargadaChegada = ""
    ) {
        super(nome, local, dataHorario, distanciaKm, valorInscricao, limiteVagas);
        this.#altimetriaAcumulada = altimetriaAcumulada;
        this.#percursoUrbano = percursoUrbano;
        this.#descricaoTrajeto = descricaoTrajeto;
        this.#pontosLargadaChegada = pontosLargadaChegada;
    }
    get altimetriaAcumulada() {
        return this.#altimetriaAcumulada;
    }
    get percursoUrbano() {
        return this.#percursoUrbano;
    }
    get descricaoTrajeto() {
        return this.#descricaoTrajeto;
    }
    get pontosLargadaChegada() {
        return this.#pontosLargadaChegada;
    }
}

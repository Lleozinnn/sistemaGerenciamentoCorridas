import { Atleta } from "../model/Atleta";
import { TrailRunning } from "../model/TrailRunning";
import { Urbano } from "../model/Urbano";

export class competicaoController {
    #vetCompeticoes = [];
    
    // Métodos

    inscreverAtleta(IdCompeticao, atleta) {
        if (atleta instanceof Atleta) {
            let comp = this.#vetCompeticoes.find((competicao) => competicao.id == IdCompeticao);
            comp.inscreverAtleta(atleta);
            return {
                tipo: "SUCESSO",
                mensagem: "Inscrição realizada com sucesso."
            }
        }
        return {
            tipo: "ERRO",
            mensagem: "A inscrição não pode ser realizada."
        }
    }
    registrarCompeticao (nome, local, dataHorario, distancia, valor, limiteVagas, modalidade) {
        const modalidades = ["Trail Running", "Urbano"];
        if (modalidades.includes(modalidade)) {
            switch (modalidade) {
                case "Trail Running":
                    competicao = new TrailRunning(nome, local, dataHorario, distancia, valor, limiteVagas);
                    this.#vetCompeticoes.push(competicao);
                    break;
                case "Urbano":
                    competicao = new Urbano(nome, local, dataHorario, distancia, valor, limiteVagas);
                    this.#vetCompeticoes.push(competicao);
                    break;
            }
            return {
                tipo: "SUCESSO",
                mensagem: "Competição registrada com sucesso."
            }
        }
        return {
            tipo: "ERRO",
            mensagem: "Modalidade inválida."
        }
    }

}


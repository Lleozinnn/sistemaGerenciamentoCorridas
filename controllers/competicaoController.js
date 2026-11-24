import { Atleta } from "../model/Atleta";

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
    registrarCompeticao (nome, local, dataHorario, distancia, valor, limiteVagas) {
        
    }

}


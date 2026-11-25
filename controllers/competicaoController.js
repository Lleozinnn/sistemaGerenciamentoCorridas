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
    registrarCompeticao(nome, local, dataHorario, distancia, valor, limiteVagas) {

    }

    atualizarStatusCompeticao(competicao, status) {
        let comp = this.buscarCompeticaoPorId(competicao.id);
        if (comp != undefined) {
            comp.status = status;
            return {
                tipo: "SUCESSO",
                mensagem: "Ativo."
            }
        } else {
            return {
                tipo: "ERRO",
                mensagem: "Vagas esgotadas."
            }
        }
    }


    vagasDisponiveis(IdCompeticao) {
        let comp = this.buscarCompeticaoPorId(IdCompeticao);
        if (comp.tipo == "SUCESSO") {
            return {
                tipo: "SUCESSO",
                mensagem: "Vagas disponíveis.",
                vagas: comp.competicao.vagasDisponiveis()
            }
        } else {
            return {
                tipo: "ERRO",
                mensagem: "Vagas esgotadas."
            }
        }
    }

    buscarCompeticaoPorId(IdCompeticao) {
        let comp = this.#vetCompeticoes.find((competicao) => competicao.id == IdCompeticao);
        if (comp != undefined) {
            return {
                tipo: "SUCESSO",
                mensagem: "Competição encontrada.",
                competicao: comp
            }
        } else {
            return {
                tipo: "ERRO",
                mensagem: "Competição não encontrada."
            }
        }
    }
}
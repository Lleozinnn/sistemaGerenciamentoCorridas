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
    listarCompeticoes() {
        return this.#vetCompeticoes.map((competicao) => ({
            id: competicao.id,
            nome: competicao.nome,
            local: competicao.local,
            dataHorario: competicao.dataHorario,
            distanciaKm: competicao.distanciaKm,
            valorInscricao: competicao.valorInscricao,
            limiteVagas: competicao.limiteVagas,
            status: competicao.status
        }));
    }
    relatorioCompeticao(competicao) {
        let comp = this.buscarCompeticaoPorId(competicao.id);
        if (comp != undefined) {
            return {
                tipo: "SUCESSO",
                mensagem: "Relatório da competição gerado com sucesso.",
                relatorio: {
                    id: comp.id,
                    nome: comp.nome,
                    local: comp.local,
                    dataHorario: comp.dataHorario,
                    distanciaKm: comp.distanciaKm,
                    valorInscricao: comp.valorInscricao,
                    limiteVagas: comp.limiteVagas,
                    status: comp.status,
                    atletasInscritos: comp.atletasInscritos
                }
            }
        } else {
            return {
                tipo: "ERRO",
                mensagem: "Competição não encontrada."
            }
        }
    }
}
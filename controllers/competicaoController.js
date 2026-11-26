import { Atleta } from "../model/Atleta.js";
import { TrailRunning } from "../model/TrailRunning.js";
import { Urbano } from "../model/Urbano.js";
export class CompeticaoController {
    #vetCompeticoes = [];
    #modalidadesAceitas = ["Urbano", "Trail Running"];

    // Métodos
    inscreverAtleta(IdCompeticao, atleta) {
        if (atleta instanceof Atleta) {
            let comp = this.#vetCompeticoes.find(
                (competicao) => competicao.id == IdCompeticao,
            );
            comp.inscreverAtleta(atleta);
            return {
                tipo: "SUCESSO",
                mensagem: "Inscrição realizada com sucesso.",
            };
        }
        return {
            tipo: "ERRO",
            mensagem: "A inscrição não pode ser realizada.",
        };
    }
    cadastrarCompeticao(
        nome,
        local,
        dataHorario,
        distanciaKm,
        limiteVagas,
        valorInscricao,
        modalidade,
        opMod,
    ) {
        // opMod é um objeto com opcoes que variam de acordo com a modalidade de
        // competição escolhida.
        if (this.#modalidadesAceitas.includes(modalidade)) {
            let competicao;
            switch (modalidade) {
                case "Trail Running":
                    competicao = new TrailRunning(
                        nome,
                        local,
                        dataHorario,
                        distanciaKm,
                        valorInscricao,
                        limiteVagas, // Até aqui é Superclasse
                        opMod.tipoTerreno,
                        opMod.nivelDificuldade,
                        opMod.quantidadeCheckpoints,
                        opMod.localizacaoCheckpoints,
                        opMod.tipoProva, // Aqui já é subclasse
                    );
                    break;
                case "Urbano":
                    competicao = new Urbano(
                        nome,
                        local,
                        dataHorario,
                        distanciaKm,
                        valorInscricao,
                        limiteVagas, // Até aqui é Superclasse
                        opMod.altimetria,
                        opMod.percursoUrbano,
                        opMod.descricaoTrajeto,
                        opMod.pontosLargadaChegada, // Aqui já é subclasse
                    );
                    break;
            }
            this.#vetCompeticoes.push(competicao);
            return {
                tipo: "SUCESSO",
                mensagem: `${nome} foi criado com sucesso e está ativo.`,
            };
        } else {
            return {
                tipo: "ERRO",
                mensagem: "Houve um erro interno ao criar a competição",
            };
        }
    }

    atualizarStatusCompeticao(competicao, status) {
        let comp = this.buscarCompeticaoPorId(competicao.id);
        if (comp != undefined) {
            comp.status = status;
            return {
                tipo: "SUCESSO",
                mensagem: "Ativo.",
            };
        } else {
            return {
                tipo: "ERRO",
                mensagem: "Vagas esgotadas.",
            };
        }
    }
    listarCompeticoes () {
        const competicoes = this.#vetCompeticoes.map( competicao => {
            return {
                nome: competicao.nome,
                modalidade: competicao instanceof TrailRunning ? "Trail Running" : "Maratona Urbana",
                qtdInscritos: competicao.limiteVagas,
                statusProva: competicao.status
            }
        });
        return competicoes;
    }
    vagasDisponiveis(IdCompeticao) {
        let comp = this.buscarCompeticaoPorId(IdCompeticao);
        if (comp.tipo == "SUCESSO") {
            return {
                tipo: "SUCESSO",
                mensagem: "Vagas disponíveis.",
                vagas: comp.competicao.vagasDisponiveis(),
            };
        } else {
            return {
                tipo: "ERRO",
                mensagem: "Vagas esgotadas.",
            };
        }
    }

    buscarCompeticaoPorId(IdCompeticao) {
        let comp = this.#vetCompeticoes.find(
            (competicao) => competicao.id == IdCompeticao,
        );
        if (comp != undefined) {
            return {
                tipo: "SUCESSO",
                mensagem: "Competição encontrada.",
                competicao: comp,
            };
        } else {
            return {
                tipo: "ERRO",
                mensagem: "Competição não encontrada.",
            };
        }
    }
    listarCompeticoes() {
        return this.#vetCompeticoes.map((competicao) => ({
            id: competicao.id,
            nome: competicao.nome,
            local: competicao.local,
            dataHorario: competicao.dataHorario,
            distanciaKm: competicao.distanciaKm,
            limiteVagas: competicao.limiteVagas,
            valorInscricao: competicao.valorInscricao,
            modalidade: competicao.modalidade,
            opMod: competicao.opMod,
        }));
    }

    #carregarDados() {
        const competicoes = JSON.parse(localStorage.getItem("competicoes"));
        this.#vetCompeticoes = [];
        competicoes.forEach((competicao) => {
            this.cadastrarCompeticao(
                competicao.nome,
                competicao.local,
                competicao.dataHorario,
                competicao.distancia,
                competicao.limiteVagas,
                competicao.valorInscricao,
                competicao.modalidade,
                competicao.opMod,
            );
        });
    }
    #salvarDados() {
        let competicoes = this.#vetCompeticoes.map((competicao) => {
            let objComp = {
                // Objeto com atributos da SuperClasse
                nome: competicao.nome,
                local: competicao.local,
                dataHorario: competicao.dataHorario,
                distanciaKm: competicao.distanciaKm,
                valorInscricao: competicao.valorInscricao,
                limiteVagas: competicao.limiteVagas,
            };
            // Complementação com atributos da subclasse conforme a modalidade da competicao
            objComp.opMod = {};
            if (competicao instanceof Urbano) {
                objComp.modalidade = "Urbano";
                objComp.opMod.altimetria = competicao.altimetriaAcumulada;
                objComp.opMod.percursoUrbano = competicao.percursoUrbano;
                objComp.opMod.descricaoTrajeto = competicao.descricaoTrajeto;
                objComp.opMod.pontosLargadaChegada = competicao.pontosLargadaChegada;
            } else {
                objComp.modalidade = "Trail Running";
                objComp.opMod.tipoTerreno = competicao.tipoTerreno;
                objComp.opMod.nivel = competicao.nivel;
                objComp.opMod.quantidadeCheckpoints = competicao.quantidadeCheckpoints;
                objComp.opMod.localizacaoCheckpoints =
                    competicao.localizacaoCheckpoints;
                objComp.opMod.tipoProva = competicao.tipoProva;
            }
            return objComp;
        });
        localStorage.setItem("competicoes", JSON.stringify(competicoes));
    }
}

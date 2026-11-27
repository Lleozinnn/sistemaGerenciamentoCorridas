import { Atleta } from "../model/Atleta.js";
import { AtletaController } from "./atletaController.js";
import { ErroValidacaoInscricao } from "../model/Competicao.js";
import { TrailRunning } from "../model/TrailRunning.js";
import { Urbano } from "../model/Urbano.js";
export class CompeticaoController {
    #vetCompeticoes = [];
    #modalidadesAceitas = ["Urbano", "Trail Running"];
    #atletaController = new AtletaController();

    constructor() {
        this.#carregarDados();
    }

    // Métodos
    inscreverAtleta(idCompeticao, cpfAtleta) {
        const atleta = this.#atletaController.buscarCpf(cpfAtleta);
        console.log(atleta)
        const comp = this.#vetCompeticoes.find(
            (competicao) => competicao.id == idCompeticao,
        );
        if (atleta !== undefined && comp !== undefined) {
            if (comp.vagasDisponiveis() == 0) {
                return {
                    tipo: "ERRO",
                    mensagem: "Essa competição não tem mais vagas",
                };
            }
            else if (comp.inscreverAtleta(atleta)) {
                this.#salvarDados();
                return {
                    tipo: "SUCESSO",
                    mensagem: "Inscrição realizada com sucesso.",
                };
            }
            else {
                return {
                    tipo: "ERRO",
                    mensagem: "Houve erro ao realizar a inscrição",
                };
            }
        }
        return {
            tipo: "ERRO",
            mensagem: "Competição ou atleta não encontrado",
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
        id,
    ) {
        // opMod é um objeto com opcoes que variam de acordo com a modalidade de
        // competição escolhida.
        if (this.#modalidadesAceitas.includes(modalidade)) {
            let competicao;
            const idCompeticao = id ?? this.#proximoIdCompeticao();
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
                        idCompeticao,
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
                        idCompeticao,
                    );
                    break;
            }
            this.#vetCompeticoes.push(competicao);
            const ultimoIdSalvo = Number(
                localStorage.getItem("ultimoIdCompeticao") || 0,
            );
            localStorage.setItem(
                "ultimoIdCompeticao",
                String(Math.max(ultimoIdSalvo, competicao.id)),
            );
            this.#salvarDados();
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
    atualizarStatusCompeticao(competicao) {
        let comp = this.buscarCompeticaoPorId(competicao.id);
        if (comp != undefined) {
            comp.atualizarStatusCompeticao();
            this.#salvarDados();
            return {
                tipo: "SUCESSO",
                mensagem: comp.status,
            };
        } else {
            return {
                tipo: "ERRO",
                mensagem: "Vagas esgotadas.",
            };
        }
    }
    listarInscricoesCompeticao(idCompeticao) {
        const resultadoBusca = this.buscarCompeticaoPorId(idCompeticao);

        if (resultadoBusca.tipo !== "SUCESSO") {
            return [];
        }

        return resultadoBusca.competicao.listarAtletasInscritos().map((atleta) => ({
            nome: atleta.nome,
            cpf: atleta.cpf,
            dtNascimento: atleta.dtNascimento,
        }));
    }
    vagasDisponiveis(idCompeticao) {
        let comp = this.buscarCompeticaoPorId(idCompeticao);
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

    buscarCompeticaoPorId(idCompeticao) {
        let comp = this.#vetCompeticoes.find(
            (competicao) => competicao.id == idCompeticao,
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
    editarCompeticao(
        idCompeticao,
        nome,
        local,
        dataHorario,
        distanciaKm,
        limiteVagas,
        valorInscricao,
    ) {
        const resultadoBusca = this.buscarCompeticaoPorId(idCompeticao);
        if (resultadoBusca.tipo === "ERRO") {
            return resultadoBusca;
        }

        const competicao = resultadoBusca.competicao;
        competicao.nome = nome;
        competicao.local = local;
        competicao.dataHorario = dataHorario;
        competicao.distanciaKm = distanciaKm;
        competicao.limiteVagas = limiteVagas;
        competicao.valorInscricao = valorInscricao;
        this.#salvarDados();

        return {
            tipo: "SUCESSO",
            mensagem: "Competição editada com sucesso.",
            competicao,
        };
    }
    excluirCompeticao(idCompeticao) {
        const indiceCompeticao = this.#vetCompeticoes.findIndex(
            (competicao) => competicao.id == idCompeticao,
        );
        if (indiceCompeticao === -1) {
            return {
                tipo: "ERRO",
                mensagem: "Competição não encontrada.",
            };
        }

        this.#vetCompeticoes.splice(indiceCompeticao, 1);
        this.#salvarDados();
        return {
            tipo: "SUCESSO",
            mensagem: "Competição excluída com sucesso.",
        };
    }
    listarCompeticoes() {
        return this.#vetCompeticoes.map((competicao) => ({
            id: competicao.id,
            nome: competicao.nome,
            local: competicao.local,
            dataHorario: competicao.dataHorario,
            distanciaKm: competicao.distanciaKm,
            limiteVagas: competicao.limiteVagas,
            vagasDisponiveis: competicao.vagasDisponiveis(),
            valorInscricao: competicao.valorInscricao,
            modalidade: competicao.modalidade,
            opMod: competicao.opMod,
            qtdInscritos: competicao.quantidadeAtletasInscritos(),
            statusProva: competicao.status,
        }));
    }

    #carregarDados() {
        const competicoes = JSON.parse(
            localStorage.getItem("competicoes") || "[]",
        );
        this.#vetCompeticoes = [];
        competicoes.forEach((competicao) => {
            const opcoesModalidade = { ...competicao.opMod };
            if (
                competicao.modalidade === "Trail Running" &&
                opcoesModalidade.nivelDificuldade === undefined
            ) {
                opcoesModalidade.nivelDificuldade = opcoesModalidade.nivel;
            }

            this.cadastrarCompeticao(
                competicao.nome,
                competicao.local,
                competicao.dataHorario,
                competicao.distanciaKm,
                competicao.limiteVagas,
                competicao.valorInscricao,
                competicao.modalidade,
                opcoesModalidade,
                competicao.id,
            );

            const competicaoCarregada = this.#vetCompeticoes.find(
                (item) => item.id == competicao.id,
            );
            const inscritosSalvos = Array.isArray(competicao.inscritos)
                ? competicao.inscritos
                : [];

            inscritosSalvos.forEach((inscrito) => {
                const dadosAtleta =
                    typeof inscrito === "object" && inscrito !== null
                        ? inscrito
                        : null;
                const cpfAtleta = dadosAtleta ? dadosAtleta.cpf : inscrito;
                let atletaInscrito = this.#atletaController.buscarCpf(cpfAtleta);

                if (!atletaInscrito && dadosAtleta && dadosAtleta.cpf) {
                    atletaInscrito = new Atleta(
                        dadosAtleta.nome,
                        dadosAtleta.cpf,
                        dadosAtleta.dtNascimento,
                        dadosAtleta.nacionalidade,
                        dadosAtleta.modalidade,
                    );
                }

                if (competicaoCarregada && atletaInscrito) {
                    competicaoCarregada.inscreverAtleta(atletaInscrito);
                }
            });
        });
        this.#salvarDados();
    }
    #proximoIdCompeticao() {
        const ultimoIdSalvo = Number(
            localStorage.getItem("ultimoIdCompeticao") || 0,
        );
        const maiorIdEmMemoria = this.#vetCompeticoes.reduce(
            (maiorId, competicao) => Math.max(maiorId, competicao.id),
            0,
        );
        return Math.max(ultimoIdSalvo, maiorIdEmMemoria) + 1;
    }

    #validarCadastroAtleta(cpfAtleta) {
        const atleta = this.#atletaController.buscarCpf(cpfAtleta);
        if (atleta === undefined) {
            throw new ErroValidacaoInscricao(
                "O atleta não possui cadastro no sistema.",
                "cadastro",
            );
        }
        return atleta;
    }

    #buscarCompeticaoParaInscricao(idCompeticao) {
        const comp = this.#vetCompeticoes.find(
            (competicao) => competicao.id == idCompeticao,
        );
        if (comp === undefined) {
            throw new ErroValidacaoInscricao(
                "A competição selecionada não foi encontrada.",
                "competicao",
            );
        }
        return comp;
    }

    #salvarDados() {
        let competicoes = this.#vetCompeticoes.map((competicao) => {
            let objComp = {
                id: competicao.id,
                nome: competicao.nome,
                local: competicao.local,
                dataHorario: competicao.dataHorario,
                distanciaKm: competicao.distanciaKm,
                valorInscricao: competicao.valorInscricao,
                limiteVagas: competicao.limiteVagas,
                inscritos: competicao.listarAtletasInscritos().map((atleta) => ({
                    nome: atleta.nome,
                    cpf: atleta.cpf,
                    dtNascimento: atleta.dtNascimento,
                    nacionalidade: atleta.nacionalidade,
                    modalidade: atleta.modalidade,
                })),
            };
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
                objComp.opMod.nivelDificuldade = competicao.nivelDificuldade;
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

import Atleta from "../model/Atleta.js";
export default class AtletaController {
    #vetAtletas;
    constructor() {
        this.#vetAtletas = [];
    }
    cadastrarAtleta(nome, cpf, dtNascimento, nacionalidade, modalidade) {
        if (this.buscarCpf(cpf) !== undefined) {
            return {
                tipo: "ERRO",
                mensagem: "CPF já está cadastrado."
            }
        }
        const modalidades = ["Urbano", "Trail Running"];
        if (!modalidades.includes(modalidade)) {
            return {
                tipo: "ERRO",
                mensagem: "Modalidade inválida. Selecione 'Urbano' ou 'Trail Running'."
            }
        }
        const novoAtleta = new Atleta(nome,
            cpf,
            dtNascimento,
            nacionalidade,
            modalidade
        );
        this.#vetAtletas.push(novoAtleta);
        return {
            tipo: "SUCESSO",
            mensagem: "Novo atleta cadastrado com sucesso"
        };
    }
    buscarCpf(cpf) {
        return this.#vetAtletas.find((atleta) => atleta.cpf === cpf);
    }
    listarAtletas() {
        return this.#vetAtletas.map((atleta) => ({
            nome: atleta.nome,
            id: atleta.id,
            modalidade: atleta.modalidade,
            cpf: atleta.cpf,
            // inscricoesAtivas: atleta.listarCompeticoes().length
        }));
    }
    consultarAtleta(cpf) {
        let atleta = this.buscarCpf(cpf);
        if (atleta === undefined) {
            return {
                tipo: "ERRO",
                mensagem: "Cpf não encontrado"
            }
        }
        return {
            tipo: "SUCESSO",
            mensagem: "Atleta encontrado com sucesso",
            atleta: {
                id: atleta.id,
                nome: atleta.nome,
                cpf: atleta.cpf,
                dtNascimento: atleta.dtNascimento,
                idade: atleta.calcularIdade(),
                nacionalidade: atleta.nacionalidade,
                modalidade: atleta.modalidade
            }
        };
    }
    editarAtleta(cpf, nome, nacionalidade) {
        let atleta = this.buscarCpf(cpf);
        if (atleta == undefined) {
            return {
                tipo: "ERRO",
                mensagem: "Atleta não encontrado"
            };
        }
        atleta.nome = nome;
        atleta.nacionalidade = nacionalidade;

        return {
            tipo: "SUCESSO",
            mensagem: "Atleta editado com sucesso!",
            atleta: {
                id: atleta.id,
                nome: atleta.nome,
                cpf: atleta.cpf,
                dtNascimento: atleta.dtNascimento,
                idade: atleta.calcularIdade(),
                nacionalidade: atleta.nacionalidade,
                modalidade: atleta.modalidade
            }

        }
    }
    excluirAtleta(cpf) {
        let indAtletaExcluido = this.#vetAtletas.findIndex(
            (atleta) => atleta.cpf == cpf
        );
        if (indAtletaExcluido != -1) {
            this.#vetAtletas.splice(indAtletaExcluido, 1)
            return {
                tipo: "SUCESSO",
                mensagem: "Atleta excluido com sucesso!"
            };
        }
        return {
            tipo: "ERRO",
            mensagem: "Atleta não enocntrado"
        };
    }

    listarCompeticoesAtleta(cpf) {
        //Primeiro passo: buscar atleta
        const atleta = this.#vetAtletas.find((atleta) => atleta.cpf === cpf);
        if (atleta !== undefined) {
            //Segundo passo: pegar as competições do atleta
            const competicoes = atleta.listarCompeticoes();
            //Terceiro Passo: listar as competições do atleta
            let listaCompeticao = [];
            competicoes.forEach(competicao => {
                return listaCompeticao.push({
                    nome: competicao.nome,
                    local: competicao.local,
                    dataHorario: competicao.dataHorario,
                    distancia: competicao.distanciaKm,
                    valorInscricao: competicao.valorInscricao,
                    limiteVagas: competicao.limiteVagas
                })
            });
            return {
                tipo: "SUCESSO",
                mensagem: "Atleta encontrado com sucesso",
                listaCompeticaoAtleta: listaCompeticao
            }

        } else {
            return {
                tipo: "ERRO",
                mensagem: "Esse atleta não existe"
            }
        }
    }
    listarAtletasPorModalidade(modalidade) {
        const modalidades = ["Urbano", "Trail Running"];
        if (!modalidades.includes(modalidade)) {
            return {
                tipo: "ERRO",
                mensagem: "Modalidade inválida. Selecione 'Urbano' ou 'Trail Running'."
            }
        }
        return {
            tipo: "SUCESSO",
            mensagem: "Atletas encontrados com sucesso!",
            atletas: this.#vetAtletas.filter((atleta) => atleta.modalidade === modalidade)
        };
    }
}

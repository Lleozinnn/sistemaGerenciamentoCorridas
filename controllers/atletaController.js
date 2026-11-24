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
                mensagem: "Cpf já está cadastrado."
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
    consultarAtleta() {}

}

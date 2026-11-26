export class Atleta {
    static qtAtletas = 0;
    #id;
    #nome;
    #cpf;
    #dtNascimento;
    #nacionalidade;
    #modalidade;
    constructor(nome, cpf, dtNascimento, nacionalidade, modalidade) {
        this.#id = ++Atleta.qtAtletas;
        this.#nome = nome;
        this.#cpf = cpf;
        this.#dtNascimento = dtNascimento;
        this.#nacionalidade = nacionalidade;
        this.#modalidade = modalidade;
    }
    get id() {
        return this.#id;
    }
    get nome() {
        return this.#nome;
    }
    get cpf() {
        return this.#cpf;
    }
    get dtNascimento() {
        return this.#dtNascimento;
    }
    get nacionalidade() {
        return this.#nacionalidade;
    }
    get modalidade() {
        return this.#modalidade;
    }
    set nome(nome) {
        this.#nome = nome;
    }
    set nacionalidade(nacionalidade) {
        this.#nacionalidade = nacionalidade;
    }

    calcularIdade() {
        const hoje = new Date();
        const nasc = new Date(this.#dtNascimento);
        let idade = hoje.getFullYear() - nasc.getFullYear();
        const mes = hoje.getMonth() - nasc.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) {
            idade--;
        }
        return idade;
    }

    validarCPF() {
        // Implementar lógica de validação de CPF
        return true; // Retornar true se o CPF for válido, false caso contrário
    }

    toString() {
        return `ID: ${this.#id},
         Nome: ${this.#nome},
         CPF: ${this.#cpf},
         Data de Nascimento: ${this.#dtNascimento},
         Nacionalidade: ${this.#nacionalidade},
         Modalidade: ${this.#modalidade}`;
    }
    stringfy() {
        return `${this.#id};
        ${this.#nome};
        ${this.#cpf};
        ${this.#dtNascimento};
        ${this.#nacionalidade};
        ${this.#modalidade}`;
    }
}
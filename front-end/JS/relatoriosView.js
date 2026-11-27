import { CompeticaoController } from '../../controllers/competicaoController.js';
import { AtletaController } from '../../controllers/atletaController.js';

class RelatoriosView {
    #competicaoController;
    #atletaController;
    #selectCompeticao;
    #btnGerarGeral;
    #containerGeral;
    #containerCompeticao;

    constructor() {
        this.#competicaoController = new CompeticaoController();
        this.#atletaController = new AtletaController();

        this.#selectCompeticao = document.getElementById('selectCompeticao');
        this.#btnGerarGeral = document.getElementById('btnRelatorioGeral');
        this.#containerGeral = document.getElementById('relatorioGeralContainer');
        this.#containerCompeticao = document.getElementById('relatorioCompeticaoContainer');

        this.#inicializar();
    }

    #inicializar() {
        this.#carregarSelectCompeticoes();
        this.#gerarRelatorioGeral();

        this.#selectCompeticao?.addEventListener('change', (evento) => {
            const competicaoId = evento.target.value;

            if (competicaoId) {
                this.#gerarRelatorioPorCompeticao(competicaoId);
            } else if (this.#containerCompeticao) {
                this.#containerCompeticao.innerHTML =
                    '<p>Selecione uma competição para visualizar o relatório.</p>';
            }
        });

        this.#btnGerarGeral?.addEventListener('click', () => {
            const competicaoSelecionada = this.#selectCompeticao?.value || '';
            this.#carregarSelectCompeticoes(competicaoSelecionada);
            this.#gerarRelatorioGeral();

            if (competicaoSelecionada) {
                this.#gerarRelatorioPorCompeticao(competicaoSelecionada);
            }
        });
    }

    #lerListaLocalStorage(chave) {
        try {
            const dados = JSON.parse(localStorage.getItem(chave) || '[]');
            return Array.isArray(dados) ? dados : [];
        } catch (erro) {
            console.error(`Não foi possível ler a chave "${chave}" do localStorage.`, erro);
            return [];
        }
    }

    #obterDados() {
        const competicoesSalvas = this.#lerListaLocalStorage('competicoes');
        const atletasSalvos = this.#lerListaLocalStorage('atletas');

        const competicoesResumo = typeof this.#competicaoController.listarCompeticoes === 'function'
            ? this.#competicaoController.listarCompeticoes()
            : [];

        const atletasController = typeof this.#atletaController.listarAtletas === 'function'
            ? this.#atletaController.listarAtletas()
            : [];

        const fonteCompeticoes = competicoesSalvas.length > 0
            ? competicoesSalvas
            : (Array.isArray(competicoesResumo) ? competicoesResumo : []);

        const atletas = atletasSalvos.length > 0
            ? atletasSalvos
            : (Array.isArray(atletasController) ? atletasController : []);

        const competicoes = fonteCompeticoes.map((competicao) => {
            const competicaoResumo = Array.isArray(competicoesResumo)
                ? competicoesResumo.find(
                    (item) => String(item.id) === String(competicao.id)
                )
                : undefined;

            let inscritos = Array.isArray(competicao.inscritos)
                ? competicao.inscritos
                : null;

            if (inscritos === null && typeof this.#competicaoController.listarInscricoesCompeticao === 'function') {
                try {
                    const inscricoesController = this.#competicaoController.listarInscricoesCompeticao(competicao.id);
                    inscritos = Array.isArray(inscricoesController) ? inscricoesController : [];
                } catch (erro) {
                    console.error('Não foi possível carregar as inscrições da competição.', erro);
                    inscritos = [];
                }
            }

            inscritos = inscritos || [];

            return {
                ...(competicaoResumo || {}),
                ...competicao,
                inscritos,
                qtdInscritos: inscritos.length > 0
                    ? inscritos.length
                    : Number(competicaoResumo?.qtdInscritos ?? 0)
            };
        });

        return { competicoes, atletas };
    }

    #escaparHtml(valor) {
        return String(valor ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    #normalizarCpf(cpf) {
        return String(cpf ?? '').replace(/\D/g, '');
    }

    #buscarAtletaPorCpf(atletas, cpf) {
        const cpfNormalizado = this.#normalizarCpf(cpf);

        if (!cpfNormalizado) {
            return undefined;
        }

        return atletas.find((atleta) =>
            this.#normalizarCpf(atleta.cpf) === cpfNormalizado
        );
    }

    #obterAtletasInscritos(competicao, atletas) {
        let inscricoes = Array.isArray(competicao.inscritos)
            ? competicao.inscritos
            : [];

        if (inscricoes.length === 0 && typeof this.#competicaoController.listarInscricoesCompeticao === 'function') {
            try {
                const inscricoesController = this.#competicaoController.listarInscricoesCompeticao(competicao.id);
                if (Array.isArray(inscricoesController)) {
                    inscricoes = inscricoesController;
                }
            } catch (erro) {
                console.error('Não foi possível recuperar os atletas inscritos.', erro);
            }
        }

        return inscricoes.map((inscricao) => {
            const dadosInscricao = typeof inscricao === 'object' && inscricao !== null
                ? inscricao
                : { cpf: inscricao };

            const atletaCadastro = this.#buscarAtletaPorCpf(atletas, dadosInscricao.cpf);

            return {
                ...(atletaCadastro || {}),
                ...dadosInscricao
            };
        });
    }

    #calcularInscritos(competicao) {
        if (Array.isArray(competicao.inscritos)) {
            return competicao.inscritos.length;
        }

        const totalInscritos = Number(competicao.qtdInscritos ?? 0);
        return Number.isFinite(totalInscritos) ? Math.max(0, totalInscritos) : 0;
    }

    #obterLimiteVagas(competicao) {
        const limiteVagas = Number(competicao.limiteVagas ?? 0);
        return Number.isFinite(limiteVagas) ? Math.max(0, limiteVagas) : 0;
    }

    #formatarDataHorario(competicao) {
        return competicao.dataHorario
            ? String(competicao.dataHorario)
            : '-';
    }

    #formatarDistancia(competicao) {
        if (competicao.distanciaKm === undefined || competicao.distanciaKm === null || competicao.distanciaKm === '') {
            return '-';
        }

        return `${this.#escaparHtml(competicao.distanciaKm)} km`;
    }

    #calcularIdade(dtNascimento) {
        if (!dtNascimento) {
            return '-';
        }

        const dataTexto = String(dtNascimento).trim();
        let dataNascimento;
        let partesData = dataTexto.match(/^(\d{4})-(\d{2})-(\d{2})/);

        if (partesData) {
            dataNascimento = new Date(
                Number(partesData[1]),
                Number(partesData[2]) - 1,
                Number(partesData[3])
            );
        } else {
            partesData = dataTexto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

            if (partesData) {
                dataNascimento = new Date(
                    Number(partesData[3]),
                    Number(partesData[2]) - 1,
                    Number(partesData[1])
                );
            } else {
                dataNascimento = new Date(dataTexto);
            }
        }

        if (Number.isNaN(dataNascimento.getTime())) {
            return '-';
        }

        const hoje = new Date();

        if (dataNascimento > hoje) {
            return '-';
        }

        let idade = hoje.getFullYear() - dataNascimento.getFullYear();
        const aindaNaoFezAniversario = hoje.getMonth() < dataNascimento.getMonth()
            || (
                hoje.getMonth() === dataNascimento.getMonth()
                && hoje.getDate() < dataNascimento.getDate()
            );

        if (aindaNaoFezAniversario) {
            idade -= 1;
        }

        return idade >= 0 ? idade : '-';
    }

    #carregarSelectCompeticoes(competicaoSelecionada = '') {
        if (!this.#selectCompeticao) {
            return;
        }

        const { competicoes } = this.#obterDados();
        this.#selectCompeticao.innerHTML = '<option value="">Selecione uma competição...</option>';

        competicoes.forEach((competicao, indice) => {
            const identificador = competicao.id ?? indice;
            const nome = competicao.nome || `Competição #${indice + 1}`;
            const modalidade = competicao.modalidade || 'Geral';
            const opcao = document.createElement('option');

            opcao.value = String(identificador);
            opcao.textContent = `${nome} (${modalidade})`;
            opcao.selected = String(identificador) === String(competicaoSelecionada);
            this.#selectCompeticao.appendChild(opcao);
        });
    }

    #gerarRelatorioGeral() {
        if (!this.#containerGeral) {
            return;
        }

        const { competicoes, atletas } = this.#obterDados();
        const totalCompeticoes = competicoes.length;
        const totalAtletas = atletas.length;

        let totalInscricoes = 0;
        let totalLimiteVagas = 0;
        let totalVagasDisponiveis = 0;
        let competicoesUrbano = 0;
        let competicoesTrail = 0;

        competicoes.forEach((competicao) => {
            const numeroInscritos = this.#calcularInscritos(competicao);
            const limiteVagas = this.#obterLimiteVagas(competicao);
            const vagasDisponiveis = Math.max(0, limiteVagas - numeroInscritos);

            totalInscricoes += numeroInscritos;
            totalLimiteVagas += limiteVagas;
            totalVagasDisponiveis += vagasDisponiveis;

            const modalidade = String(competicao.modalidade || '').toLowerCase();
            if (modalidade.includes('trail')) {
                competicoesTrail += 1;
            } else if (modalidade.includes('urbano')) {
                competicoesUrbano += 1;
            }
        });

        const percentualOcupacao = totalLimiteVagas > 0
            ? ((totalInscricoes / totalLimiteVagas) * 100).toFixed(1)
            : '0.0';

        this.#containerGeral.innerHTML = `
            <div class="relatorioCard relatorioGeral">
                <h2>Relatório Geral das Competições</h2>
                <div class="resumoMetricas">
                    <div class="metrica">
                        <strong>Total de Competições:</strong>
                        <span>${totalCompeticoes}</span>
                    </div>
                    <div class="metrica">
                        <strong>Modalidade Urbana:</strong>
                        <span>${competicoesUrbano}</span>
                    </div>
                    <div class="metrica">
                        <strong>Modalidade Trail Running:</strong>
                        <span>${competicoesTrail}</span>
                    </div>
                    <div class="metrica">
                        <strong>Atletas Cadastrados:</strong>
                        <span>${totalAtletas}</span>
                    </div>
                    <div class="metrica">
                        <strong>Total Acumulado de Inscrições:</strong>
                        <span>${totalInscricoes}</span>
                    </div>
                    <div class="metrica">
                        <strong>Total de Vagas (Limite Acumulado):</strong>
                        <span>${totalLimiteVagas}</span>
                    </div>
                    <div class="metrica">
                        <strong>Balanço de Vagas Disponíveis:</strong>
                        <span>${totalVagasDisponiveis} vagas livres (${percentualOcupacao}% de ocupação)</span>
                    </div>
                </div>

                <h3>Competições Cadastradas</h3>
                ${this.#renderizarTabelaResumoCompeticoes(competicoes)}
            </div>
        `;
    }

    #renderizarTabelaResumoCompeticoes(competicoes) {
        if (competicoes.length === 0) {
            return '<p>Nenhuma competição cadastrada até o momento.</p>';
        }

        const linhasTabela = competicoes.map((competicao) => {
            const nome = this.#escaparHtml(competicao.nome || 'Sem nome');
            const modalidade = this.#escaparHtml(competicao.modalidade || '-');
            const dataHorario = this.#escaparHtml(this.#formatarDataHorario(competicao));
            const local = this.#escaparHtml(competicao.local || '-');
            const distancia = this.#formatarDistancia(competicao);
            const numeroInscritos = this.#calcularInscritos(competicao);
            const limiteVagas = this.#obterLimiteVagas(competicao);
            const vagasDisponiveis = Math.max(0, limiteVagas - numeroInscritos);

            return `
                <tr>
                    <td>${nome}</td>
                    <td>${modalidade}</td>
                    <td>${dataHorario}</td>
                    <td>${local}</td>
                    <td>${distancia}</td>
                    <td>${numeroInscritos}</td>
                    <td>${limiteVagas}</td>
                    <td>${vagasDisponiveis}</td>
                </tr>
            `;
        }).join('');

        return `
            <table class="tabelaRelatorio">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Tipo/Modalidade</th>
                        <th>Data/Horário</th>
                        <th>Local</th>
                        <th>Distância</th>
                        <th>Inscritos</th>
                        <th>Limite de Vagas</th>
                        <th>Vagas Restantes</th>
                    </tr>
                </thead>
                <tbody>${linhasTabela}</tbody>
            </table>
        `;
    }

    #gerarRelatorioPorCompeticao(competicaoId) {
        if (!this.#containerCompeticao) {
            return false;
        }

        const { competicoes, atletas } = this.#obterDados();
        const competicaoEncontrada = competicoes.find(
            (competicao) => String(competicao.id) === String(competicaoId)
        );

        if (!competicaoEncontrada) {
            this.#containerCompeticao.innerHTML = '<p>Competição não encontrada.</p>';
            return false;
        }

        const nome = this.#escaparHtml(competicaoEncontrada.nome || 'Sem nome');
        const modalidade = this.#escaparHtml(competicaoEncontrada.modalidade || '-');
        const dataHorario = this.#escaparHtml(this.#formatarDataHorario(competicaoEncontrada));
        const local = this.#escaparHtml(competicaoEncontrada.local || '-');
        const distancia = this.#formatarDistancia(competicaoEncontrada);

        const atletasInscritos = this.#obterAtletasInscritos(competicaoEncontrada, atletas);
        const numeroAtualInscritos = atletasInscritos.length > 0
            ? atletasInscritos.length
            : this.#calcularInscritos(competicaoEncontrada);
        const limiteVagas = this.#obterLimiteVagas(competicaoEncontrada);
        const vagasDisponiveis = Math.max(0, limiteVagas - numeroAtualInscritos);
        const percentualOcupacao = limiteVagas > 0
            ? ((numeroAtualInscritos / limiteVagas) * 100).toFixed(1)
            : '0.0';

        const linhasAtletas = atletasInscritos.length > 0
            ? atletasInscritos.map((atleta, indice) => `
                <tr>
                    <td>${indice + 1}</td>
                    <td>${this.#escaparHtml(atleta.nome || '-')}</td>
                    <td>${this.#escaparHtml(atleta.cpf || '-')}</td>
                    <td>${this.#escaparHtml(this.#calcularIdade(atleta.dtNascimento))}</td>
                </tr>
            `).join('')
            : '<tr><td colspan="4">Nenhum atleta inscrito nesta competição.</td></tr>';

        this.#containerCompeticao.innerHTML = `
            <div class="relatorioCard relatorioIndividual">
                <h2>Relatório Individual: ${nome}</h2>
                <ul class="dadosObrigatoriosCompeticao">
                    <li><strong>Nome:</strong> ${nome}</li>
                    <li><strong>Tipo/Modalidade:</strong> ${modalidade}</li>
                    <li><strong>Data/Horário:</strong> ${dataHorario}</li>
                    <li><strong>Local:</strong> ${local}</li>
                    <li><strong>Distância:</strong> ${distancia}</li>
                    <li><strong>Número atual de inscritos:</strong> ${numeroAtualInscritos}</li>
                    <li><strong>Limite de vagas:</strong> ${limiteVagas}</li>
                    <li><strong>Vagas disponíveis:</strong> ${vagasDisponiveis} (${percentualOcupacao}% de ocupação)</li>
                </ul>

                <h3>Atletas Inscritos</h3>
                <table class="tabelaRelatorio">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>Idade</th>
                        </tr>
                    </thead>
                    <tbody>${linhasAtletas}</tbody>
                </table>
            </div>
        `;

        return true;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RelatoriosView();
});

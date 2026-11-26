// Caso o projeto utilize ES Modules, mantenha os imports abaixo;
// caso utilize scripts globais no HTML, remova os imports e use as instâncias globais.
import { CompeticaoController } from '../../controllers/competicaoController.js';
import { AtletaController } from '../../controllers/atletaController.js';

class RelatoriosView {
    #competicaoController;
    #atletaController;
    #selectCompeticao;
    #btnGerarGeral;
    #btnGerarCompeticao;
    #containerGeral;
    #containerCompeticao;

    constructor() {
        this.#competicaoController = new CompeticaoController();
        this.#atletaController = new AtletaController();

        this.#selectCompeticao = document.getElementById('selectCompeticao');
        this.#btnGerarGeral = document.getElementById('btnRelatorioGeral');
        this.#btnGerarCompeticao = document.getElementById('btnRelatorioCompeticao');
        this.#containerGeral = document.getElementById('relatorioGeralContainer');
        this.#containerCompeticao = document.getElementById('relatorioCompeticaoContainer');

        this.#inicializar();
    }

    get selectCompeticao() {
        return this.#selectCompeticao;
    }

    get containerGeral() {
        return this.#containerGeral;
    }

    get containerCompeticao() {
        return this.#containerCompeticao;
    }

    #inicializar() {
        this.#carregarSelectCompeticoes();
        this.#gerarRelatorioGeral();

        if (this.#selectCompeticao) {
            this.#selectCompeticao.addEventListener('change', (evento) => {
                const competicaoId = evento.target.value;
                if (competicaoId !== '') {
                    this.#gerarRelatorioPorCompeticao(competicaoId);
                } else if (this.#containerCompeticao) {
                    this.#containerCompeticao.innerHTML =
                        '<p>Selecione uma competição para visualizar o relatório.</p>';
                }
            });
        }

        if (this.#btnGerarGeral) {
            this.#btnGerarGeral.addEventListener('click', () => {
                this.#gerarRelatorioGeral();
            });
        }

        if (this.#btnGerarCompeticao) {
            this.#btnGerarCompeticao.addEventListener('click', () => {
                const competicaoId = this.#selectCompeticao?.value;
                if (competicaoId) {
                    this.#gerarRelatorioPorCompeticao(competicaoId);
                } else if (this.#containerCompeticao) {
                    this.#containerCompeticao.innerHTML =
                        '<p>Selecione uma competição antes de gerar o relatório individual.</p>';
                }
            });
        }
    }

    #escaparHtml(valor) {
        return String(valor ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    #obterDados() {
        const competicoes = typeof this.#competicaoController.listarCompeticoes === 'function'
            ? this.#competicaoController.listarCompeticoes()
            : JSON.parse(localStorage.getItem('competicoes')) || [];

        const atletas = typeof this.#atletaController.listarAtletas === 'function'
            ? this.#atletaController.listarAtletas()
            : JSON.parse(localStorage.getItem('atletas')) || [];

        return {
            competicoes: Array.isArray(competicoes) ? competicoes : [],
            atletas: Array.isArray(atletas) ? atletas : []
        };
    }

    #calcularInscritos(competicao) {
        if (Array.isArray(competicao.inscritos)) {
            return competicao.inscritos.length;
        }
        const totalDireto = Number(competicao.numeroInscritos ?? competicao.totalInscritos ?? 0);
        return Number.isNaN(totalDireto) ? Math.max(0, totalDireto) : Math.max(0, totalDireto);
    }

    #obterLimiteVagas(competicao) {
        const limite = Number(competicao.limiteVagas ?? competicao.vagas ?? 0);
        return Number.isNaN(limite) ? 0 : Math.max(0, limite);
    }

    #formatarDataHorario(competicao) {
        if (competicao.dataHorario) {
            return String(competicao.dataHorario);
        }

        const data = competicao.data || '';
        const horario = competicao.horario || competicao.hora || '';

        if (data && horario) {
            return `${data} às ${horario}`;
        }
        return data || horario || '-';
    }

    #carregarSelectCompeticoes() {
        if (!this.#selectCompeticao) return;

        const { competicoes } = this.#obterDados();
        this.#selectCompeticao.innerHTML = '<option value="">Selecione uma competição...</option>';

        competicoes.forEach((competicao, indice) => {
            const identificador = competicao.id ?? indice;
            const nome = competicao.nome || competicao.titulo || `Competição #${indice + 1}`;
            const modalidade = competicao.tipo || competicao.modalidade || 'Geral';

            const option = document.createElement('option');
            option.value = String(identificador);
            option.textContent = `${nome} (${modalidade})`;
            this.#selectCompeticao.appendChild(option);
        });
    }

    /**
     * Gera o relatório geral de todas as competições cadastradas,
     * com totais acumulados de inscrições e balanço de vagas.
     */
    #gerarRelatorioGeral() {
        if (!this.#containerGeral) return;

        const { competicoes, atletas } = this.#obterDados();

        const totalCompeticoes = competicoes.length;
        const totalAtletas = atletas.length;

        let totalInscricoes = 0;
        let totalLimiteVagas = 0;
        let totalVagasDisponiveis = 0;
        let competicoesUrbano = 0;
        let competicoesTrail = 0;

        competicoes.forEach((competicao) => {
            const inscritos = this.#calcularInscritos(competicao);
            const limiteVagas = this.#obterLimiteVagas(competicao);
            const vagasDisponiveis = Math.max(0, limiteVagas - inscritos);

            totalInscricoes += inscritos;
            totalLimiteVagas += limiteVagas;
            totalVagasDisponiveis += vagasDisponiveis;

            const tipoModalidade = String(competicao.tipo || competicao.modalidade || '').toLowerCase();
            if (tipoModalidade.includes('trail')) {
                competicoesTrail++;
            } else {
                competicoesUrbano++;
            }
        });

        const taxaOcupacao = totalLimiteVagas > 0
            ? ((totalInscricoes / totalLimiteVagas) * 100).toFixed(1)
            : '0.0';

        this.#containerGeral.innerHTML = `
            <div class="relatorio-card relatorio-geral">
                <h2>Relatório Geral das Competições</h2>
                <div class="resumo-metricas">
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
                        <span>${totalVagasDisponiveis} vagas livres (${taxaOcupacao}% de ocupação)</span>
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

        const linhasTabela = competicoes.map((competicao, indice) => {
            const nome = this.#escaparHtml(competicao.nome || competicao.titulo || `Competição ${indice + 1}`);
            const tipoModalidade = this.#escaparHtml(competicao.tipo || competicao.modalidade || '-');
            const dataHorario = this.#escaparHtml(this.#formatarDataHorario(competicao));
            const local = this.#escaparHtml(competicao.local || '-');
            const distancia = competicao.distancia !== undefined && competicao.distancia !== ''
                ? `${this.#escaparHtml(competicao.distancia)} km`
                : '-';

            const inscritos = this.#calcularInscritos(competicao);
            const limiteVagas = this.#obterLimiteVagas(competicao);
            const vagasRestantes = Math.max(0, limiteVagas - inscritos);

            return `
                <tr>
                    <td>${nome}</td>
                    <td>${tipoModalidade}</td>
                    <td>${dataHorario}</td>
                    <td>${local}</td>
                    <td>${distancia}</td>
                    <td>${inscritos}</td>
                    <td>${limiteVagas}</td>
                    <td>${vagasRestantes}</td>
                </tr>
            `;
        }).join('');

        return `
            <table class="tabela-relatorio">
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

    /**
     * Gera o relatório individual detalhado de uma competição selecionada.
     */
    #gerarRelatorioPorCompeticao(competicaoId) {
        if (!this.#containerCompeticao) return;

        const { competicoes, atletas } = this.#obterDados();

        const competicaoEncontrada = competicoes.find(
            (competicao, indice) => String(competicao.id ?? indice) === String(competicaoId)
        );

        if (!competicaoEncontrada) {
            this.#containerCompeticao.innerHTML = '<p>Competição não encontrada.</p>';
            return;
        }

        const nome = this.#escaparHtml(competicaoEncontrada.nome || competicaoEncontrada.titulo || 'Sem nome');
        const tipoModalidade = this.#escaparHtml(competicaoEncontrada.tipo || competicaoEncontrada.modalidade || '-');
        const dataHorario = this.#escaparHtml(this.#formatarDataHorario(competicaoEncontrada));
        const local = this.#escaparHtml(competicaoEncontrada.local || '-');
        const distancia = competicaoEncontrada.distancia !== undefined && competicaoEncontrada.distancia !== ''
            ? `${this.#escaparHtml(competicaoEncontrada.distancia)} km`
            : '-';

        const numeroAtualInscritos = this.#calcularInscritos(competicaoEncontrada);
        const limiteVagas = this.#obterLimiteVagas(competicaoEncontrada);
        const vagasDisponiveis = Math.max(0, limiteVagas - numeroAtualInscritos);
        const percentualOcupacao = limiteVagas > 0
            ? ((numeroAtualInscritos / limiteVagas) * 100).toFixed(1)
            : '0.0';

        const listaInscritosRaw = Array.isArray(competicaoEncontrada.inscritos)
            ? competicaoEncontrada.inscritos
            : [];

        const atletasInscritos = listaInscritosRaw.map((item) => {
            if (typeof item === 'object' && item !== null) {
                return item;
            }
            return atletas.find(
                (atleta) => String(atleta.id) === String(item) || String(atleta.cpf) === String(item)
            ) || { nome: `Atleta (${item})` };
        });

        const detalhesModalidade = competicaoEncontrada.altimetria || competicaoEncontrada.terreno
            ? `<p><strong>Altimetria:</strong> ${this.#escaparHtml(competicaoEncontrada.altimetria || '-')} m | <strong>Terreno:</strong> ${this.#escaparHtml(competicaoEncontrada.terreno || '-')}</p>`
            : `<p><strong>Percurso / Largada:</strong> ${this.#escaparHtml(competicaoEncontrada.percurso || local)}</p>`;

        const linhasAtletas = atletasInscritos.length > 0
            ? atletasInscritos.map((atleta, indice) => `
                <tr>
                    <td>${indice + 1}</td>
                    <td>${this.#escaparHtml(atleta.nome || '-')}</td>
                    <td>${this.#escaparHtml(atleta.cpf || '-')}</td>
                    <td>${this.#escaparHtml(atleta.idade || atleta.dataNascimento || '-')}</td>
                    <td>${this.#escaparHtml(atleta.categoria || atleta.sexo || '-')}</td>
                    <td>${this.#escaparHtml(atleta.tempo || 'Pendente')}</td>
                </tr>
            `).join('')
            : '<tr><td colspan="6">Nenhum atleta inscrito nesta competição.</td></tr>';

        this.#containerCompeticao.innerHTML = `
            <div class="relatorio-card relatorio-individual">
                <h2>Relatório Individual: ${nome}</h2>
                <ul class="dados-obrigatorios-competicao">
                    <li><strong>Nome:</strong> ${nome}</li>
                    <li><strong>Tipo/Modalidade:</strong> ${tipoModalidade}</li>
                    <li><strong>Data/Horário:</strong> ${dataHorario}</li>
                    <li><strong>Local:</strong> ${local}</li>
                    <li><strong>Distância:</strong> ${distancia}</li>
                    <li><strong>Número atual de inscritos:</strong> ${numeroAtualInscritos}</li>
                    <li><strong>Limite de vagas:</strong> ${limiteVagas}</li>
                    <li><strong>Vagas disponíveis:</strong> ${vagasDisponiveis} (${percentualOcupacao}% de ocupação)</li>
                </ul>
                ${detalhesModalidade}

                <h3>Atletas Inscritos</h3>
                <table class="tabela-relatorio">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>Idade / Nasc.</th>
                            <th>Categoria / Sexo</th>
                            <th>Tempo / Status</th>
                        </tr>
                    </thead>
                    <tbody>${linhasAtletas}</tbody>
                </table>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RelatoriosView();
});
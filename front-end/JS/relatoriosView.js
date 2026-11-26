// Caso o projeto utilize ES Modules, mantenha os imports abaixo;
// caso utilize scripts globais no HTML, remova os imports e use as instâncias globais.
import { CompeticaoController } from '../../controllers/competicaoController.js';
import { AtletaController } from '../../controllers/atletaController.js';

class RelatoriosView {
    constructor() {
        this.competicaoController = new CompeticaoController();
        this.atletaController = new AtletaController();

        // Elementos da tela relatoriosCompeticao.html
        this.selectCompeticao = document.getElementById('selectCompeticao');
        this.btnGerarGeral = document.getElementById('btnRelatorioGeral');
        this.btnGerarCompeticao = document.getElementById('btnRelatorioCompeticao');
        this.containerGeral = document.getElementById('relatorioGeralContainer');
        this.containerCompeticao = document.getElementById('relatorioCompeticaoContainer');

        this.inicializar();
    }

    inicializar() {
        this.carregarSelectCompeticoes();
        this.gerarRelatorioGeral();

        if (this.selectCompeticao) {
            this.selectCompeticao.addEventListener('change', (e) => {
                const id = e.target.value;
                if (id) {
                    this.gerarRelatorioPorCompeticao(id);
                } else if (this.containerCompeticao) {
                    this.containerCompeticao.innerHTML = '<p>Selecione uma competição para visualizar o relatório.</p>';
                }
            });
        }

        if (this.btnGerarGeral) {
            this.btnGerarGeral.addEventListener('click', () => this.gerarRelatorioGeral());
        }

        if (this.btnGerarCompeticao) {
            this.btnGerarCompeticao.addEventListener('click', () => {
                if (this.selectCompeticao?.value) {
                    this.gerarRelatorioPorCompeticao(this.selectCompeticao.value);
                }
            });
        }
    }

    /**
     * Obtém lista de competições e atletas dos controllers ou localStorage
     */
    obterDados() {
        const competicoes = typeof this.competicaoController.listarCompeticoes === 'function'
            ? this.competicaoController.listarCompeticoes()
            : JSON.parse(localStorage.getItem('competicoes')) || [];

        const atletas = typeof this.atletaController.listarAtletas === 'function'
            ? this.atletaController.listarAtletas()
            : JSON.parse(localStorage.getItem('atletas')) || [];

        return { competicoes, atletas };
    }

    carregarSelectCompeticoes() {
        if (!this.selectCompeticao) return;

        const { competicoes } = this.obterDados();
        this.selectCompeticao.innerHTML = '<option value="">Selecione uma competição...</option>';

        competicoes.forEach((comp, index) => {
            const id = comp.id ?? index;
            const nome = comp.nome || comp.titulo || `Competição #${index + 1}`;
            const option = document.createElement('option');
            option.value = id;
            option.textContent = `${nome} (${comp.modalidade || 'Geral'})`;
            this.selectCompeticao.appendChild(option);
        });
    }

    /**
     * 1. RELATÓRIO GERAL DO SISTEMA
     */
    gerarRelatorioGeral() {
        if (!this.containerGeral) return;

        const { competicoes, atletas } = this.obterDados();

        const totalCompeticoes = competicoes.length;
        const totalAtletas = atletas.length;

        let totalInscricoes = 0;
        let totalVagasOfertadas = 0;
        let competicoesUrbano = 0;
        let competicoesTrail = 0;

        competicoes.forEach((comp) => {
            const inscritos = Array.isArray(comp.inscritos) ? comp.inscritos.length : 0;
            const vagas = Number(comp.limiteVagas || comp.vagas || 0);

            totalInscricoes += inscritos;
            totalVagasOfertadas += vagas;

            const modalidade = (comp.modalidade || comp.tipo || '').toLowerCase();
            if (modalidade.includes('trail')) {
                competicoesTrail++;
            } else {
                competicoesUrbano++;
            }
        });

        const taxaOcupacao = totalVagasOfertadas > 0
            ? ((totalInscricoes / totalVagasOfertadas) * 100).toFixed(1)
            : '0.0';

        this.containerGeral.innerHTML = `
            <div class="relatorio-card relatorio-geral">
                <h2>Relatório Geral do Sistema</h2>
                <div class="resumo-metricas">
                    <div class="metrica">
                        <strong>Total de Competições:</strong> <span>${totalCompeticoes}</span>
                    </div>
                    <div class="metrica">
                        <strong>Competições Urbanas:</strong> <span>${competicoesUrbano}</span>
                    </div>
                    <div class="metrica">
                        <strong>Competições Trail Running:</strong> <span>${competicoesTrail}</span>
                    </div>
                    <div class="metrica">
                        <strong>Atletas Cadastrados:</strong> <span>${totalAtletas}</span>
                    </div>
                    <div class="metrica">
                        <strong>Total de Inscrições Ativas:</strong> <span>${totalInscricoes}</span>
                    </div>
                    <div class="metrica">
                        <strong>Taxa Geral de Ocupação:</strong> <span>${taxaOcupacao}% (${totalInscricoes}/${totalVagasOfertadas} vagas)</span>
                    </div>
                </div>

                <h3>Resumo por Competição</h3>
                ${this.renderizarTabelaResumoCompeticoes(competicoes)}
            </div>
        `;
    }

    renderizarTabelaResumoCompeticoes(competicoes) {
        if (competicoes.length === 0) {
            return '<p>Nenhuma competição cadastrada até o momento.</p>';
        }

        const linhas = competicoes.map((comp, idx) => {
            const inscritos = Array.isArray(comp.inscritos) ? comp.inscritos.length : 0;
            const vagas = Number(comp.limiteVagas || comp.vagas || 0);
            const vagasDisponiveis = Math.max(0, vagas - inscritos);

            return `
                <tr>
                    <td>${comp.nome || `Competição ${idx + 1}`}</td>
                    <td>${comp.modalidade || comp.tipo || '-'}</td>
                    <td>${comp.data || '-'}</td>
                    <td>${comp.distancia ? `${comp.distancia} km` : '-'}</td>
                    <td>${inscritos} / ${vagas}</td>
                    <td>${vagasDisponiveis}</td>
                </tr>
            `;
        }).join('');

        return `
            <table class="tabela-relatorio">
                <thead>
                    <tr>
                        <th>Competição</th>
                        <th>Modalidade</th>
                        <th>Data</th>
                        <th>Distância</th>
                        <th>Inscritos / Vagas</th>
                        <th>Vagas Restantes</th>
                    </tr>
                </thead>
                <tbody>${linhas}</tbody>
            </table>
        `;
    }

    /**
     * 2. RELATÓRIO INDIVIDUAL DE CADA COMPETIÇÃO
     */
    gerarRelatorioPorCompeticao(competicaoId) {
        if (!this.containerCompeticao) return;

        const { competicoes, atletas } = this.obterDados();

        const competicao = competicoes.find((c, idx) => String(c.id ?? idx) === String(competicaoId));

        if (!competicao) {
            this.containerCompeticao.innerHTML = '<p>Competição não encontrada.</p>';
            return;
        }

        const listaInscritosRaw = Array.isArray(competicao.inscritos) ? competicao.inscritos : [];
        const vagasTotais = Number(competicao.limiteVagas || competicao.vagas || 0);
        const totalInscritos = listaInscritosRaw.length;
        const vagasRestantes = Math.max(0, vagasTotais - totalInscritos);
        const ocupacao = vagasTotais > 0 ? ((totalInscritos / vagasTotais) * 100).toFixed(1) : '0.0';

        // Resolve dados completos dos atletas caso inscritos armazene apenas IDs ou CPFs
        const atletasInscritos = listaInscritosRaw.map((item) => {
            if (typeof item === 'object' && item !== null) return item;
            return atletas.find((a) => String(a.id) === String(item) || String(a.cpf) === String(item)) || { nome: `Atleta (${item})` };
        });

        // Informações específicas de Urbano vs TrailRunning
        const detalhesModalidade = competicao.altimetria || competicao.terreno
            ? `<p><strong>Altimetria:</strong> ${competicao.altimetria || '-'} m | <strong>Terreno:</strong> ${competicao.terreno || '-'}</p>`
            : `<p><strong>Percurso / Ponto de Largada:</strong> ${competicao.local || competicao.percurso || '-'}</p>`;

        const linhasAtletas = atletasInscritos.length > 0
            ? atletasInscritos.map((atleta, i) => `
                <tr>
                    <td>${i + 1}</td>
                    <td>${atleta.nome || '-'}</td>
                    <td>${atleta.cpf || '-'}</td>
                    <td>${atleta.idade || atleta.dataNascimento || '-'}</td>
                    <td>${atleta.categoria || atleta.sexo || '-'}</td>
                    <td>${atleta.tempo || 'Pendente'}</td>
                </tr>
            `).join('')
            : '<tr><td colspan="6">Nenhum atleta inscrito nesta competição.</td></tr>';

        this.containerCompeticao.innerHTML = `
            <div class="relatorio-card relatorio-individual">
                <h2>Relatório da Competição: ${competicao.nome || 'Sem nome'}</h2>
                <div class="detalhes-competicao">
                    <p><strong>Modalidade:</strong> ${competicao.modalidade || competicao.tipo || '-'} | <strong>Distância:</strong> ${competicao.distancia || '-'} km</p>
                    <p><strong>Data:</strong> ${competicao.data || '-'} | <strong>Local:</strong> ${competicao.local || '-'}</p>
                    ${detalhesModalidade}
                    <p><strong>Ocupação:</strong> ${totalInscritos} inscritos de ${vagasTotais} vagas (${ocupacao}% ocupado | ${vagasRestantes} disponíveis)</p>
                </div>

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

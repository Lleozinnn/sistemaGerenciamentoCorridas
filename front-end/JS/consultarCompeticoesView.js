import { CompeticaoController } from "../../controllers/competicaoController.js";

const competicaoController = new CompeticaoController();

console.log(competicaoController.listarCompeticoes());

const competicoes = competicaoController.listarCompeticoes();

const tabelaCompeticoes = document.getElementById("tabela-competicoes");

competicoes.forEach((competicao) => {
    const linha = `
   <tr>
              <td>${competicao.nome}</td>
              <td>${competicao.modalidade}</td>
              <td>${competicao.inscritos} / ${competicao.limite}</td>
              <td>${competicao.statusProva}</td>
              <td>
                <button id="editar" class="btn btn-primary">Editar</button>
                <button id="excluir" class="btn btn-danger">Excluir</button>
              </td>
    </tr>`;
    tabelaCompeticoes.innerHTML += linha;
});
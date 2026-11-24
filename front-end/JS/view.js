import AtletaController from "../../controllers/atletaController.js";

const controller = new AtletaController();

controller.cadastrarAtleta("João", "12345678900", "1990-01-01", "Brasileiro", "Corrida");
controller.cadastrarAtleta("Maria", "98765432100", "1995-05-15", "Brasileira", "Natação");
controller.cadastrarAtleta("Pedro", "45678912300", "1988-10-20", "Brasileiro", "Ciclismo");

console.log(controller.listarAtletas());
console.log(controller.consultarAtleta("12345678900"));
console.log(controller.editarAtleta("12345678900", "João Silva", "USA"));
console.log(controller.excluirAtleta("12345678900"));
console.log(controller.listarAtletas());

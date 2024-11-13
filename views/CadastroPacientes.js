import { PacienteController } from '../controllers/PacienteController.js';
import { ConsultaController } from '../controllers/ConsultaController.js';
import { View } from './View.js';

import promptSync from 'prompt-sync';
const prompt = promptSync({ sigint: true });

export class CadastroPacientes extends View {
    constructor(pacientes_controller, consultas_controller) {
        super();

         // Verificando se pacientes_controller é uma instancia do PacienteController
         if(!(pacientes_controller instanceof PacienteController))
            throw new Error("pacientes_controller não é uma instancia de PacienteController");

        // Verificando se consultas_controller é uma instancia do ConsultaController
        if(!(consultas_controller instanceof ConsultaController))
            throw new Error("consultas_controller não é uma instancia de ConsultaController");
        
        this.pacientes_controller = pacientes_controller;
        this.consultas_controller = consultas_controller;
    }

    show() {
        console.log(
            "Menu do Cadastro de Pacientes \n1 - Cadastrar novo paciente \n2 - Excluir paciente " +
            "\n3 - Listar pacientes (ordenado por CPF) \n4 - Listar pacientes (ordenado por nome) \n5 - Voltar p/ menu principal"
        );
    }


    #validarEntrada(mensagem, metodo){

        var response = {success: false, error: ""};
        do {
            const entrada = prompt(mensagem);
            response = metodo(entrada);

            if(!response.success)
                console.log(response.error);

        } while (!response.success);

        return true;
    }


    cadastrarNovoPaciente() {
        console.log("Cadastro de novo paciente:");
        this.pacientes_controller.iniciarNovoPaciente();

        // Esse wrapper serve para conseguir passar o contexto da instância para o método
        this.#validarEntrada("CPF: ", (entrada) => this.pacientes_controller.setCpf(entrada));
        this.#validarEntrada("Nome: ", (entrada) => this.pacientes_controller.setNome(entrada));
        this.#validarEntrada("Data de nascimento: ", (entrada) => this.pacientes_controller.setData_nasc(entrada));

        const resultado = this.pacientes_controller.addPaciente();
        if (resultado.success) {
            console.log("Paciente cadastrado com sucesso!");
        } else {
            console.log(resultado.error);
        }
    }

    excluirPaciente() {
        const cpf = prompt("CPF: ");
        const resultado = this.pacientes_controller.removePaciente(cpf, this.consultas_controller);

        if (resultado.success) {
            console.log("Paciente excluído com sucesso.");
        } else {
            console.log(resultado.error);
        }
    }

    listarPacientesOrdenadoPorCpf() {
        const lista_pacientes = this.pacientes_controller.getPacientesOrdenadosPorCpf(this.consultas_controller);
        console.log(lista_pacientes)
    }

    listarPacientesOrdenadoPorNome() {
        const lista_pacientes = this.pacientes_controller.getPacientesOrdenadosPorNome(this.consultas_controller);
        console.log(lista_pacientes)
    }

    processarOpcao(opcao) {
        switch (opcao) {
            case 1:
                this.cadastrarNovoPaciente();
                return { tela: "CadastroPacientes", sair: true};

            case 2:
                this.excluirPaciente();
                return { tela: "CadastroPacientes", sair: true};

            case 3:
                this.listarPacientesOrdenadoPorCpf();
                return { tela: "CadastroPacientes", sair: true};

            case 4:
                this.listarPacientesOrdenadoPorNome();
                return { tela: "CadastroPacientes", sair: true};

            case 5:
                console.log("Voltando para o menu principal...");
                return { tela: "Menu", sair: true};

            default:
                console.log("Opção inválida! Por favor, escolha uma opção de 1 a 5.");
                return { tela: "CadastroPacientes", sair: false};
        }
    }
}

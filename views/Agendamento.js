import { View } from "./View.js";
import { PacienteController } from "../controllers/PacienteController.js";
import { ConsultaController } from "../controllers/ConsultaController.js";

import { ErrorCodes } from "../utils/Error.js";

export class Agendamento extends View{

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

    show(){
        console.log("\nAgenda \n1-Agendar consulta \n2-Cancelar agendamento \n3-Listar agenda \n4-Voltar p/ menu principal\n");
    }

    agendarConsulta(){
        this.consultas_controller.iniciarNovaConsulta();

        // Esse wrapper serve para conseguir passar o contexto da instância para o método
        const cpf_valido = super.validarEntrada("CPF: ", (entrada) => this.consultas_controller.setCpf(entrada, this.pacientes_controller));

        // Se errar no cpf desistir da operação
        if(!cpf_valido.success){
            return;
        }

        super.validarEntradaLoop("Data da consulta: ", (entrada) => this.consultas_controller.setDataConsulta(entrada));
        super.validarEntradaLoop("Hora inicial: ", (entrada) => this.consultas_controller.setHoraInicial(entrada));
        super.validarEntradaLoop("Hora final: ", (entrada) => this.consultas_controller.setHoraFinal(entrada));

        const resultado = this.consultas_controller.addConsulta();
        if (resultado.success) {
            console.log("Paciente cadastrado com sucesso!");
        } else {
            console.log(resultado.error);
        }
    }

    cancelarAgendamento(){

        // Esse wrapper serve para conseguir passar o contexto da instância para o método
        const cpf_valido = super.validarEntrada("CPF: ", (entrada) => this.pacientes_controller.validaCpf(entrada));

        // Se errar no cpf desistir da operação
        if(!cpf_valido.success){
            return;
        }

        // COrrigir mensagem de erro. não se pode desmarcar consultas passadas
        const data_consulta = super.validarEntradaLoop("Data da consulta: ", (entrada) => this.consultas_controller.validaData(entrada));
        const hora_inicial = super.validarEntradaLoop("Hora inicial: ", (entrada) => this.consultas_controller.validaData(entrada));

        const resultado = this.consultas_controller.removeConsulta(cpf_valido.entrada, data_consulta, hora_inicial);

        if (resultado.success) {
            console.log("Consulta excluída com sucesso.");
        } else {
            console.log(resultado.error);
        }
    }

    listarAgenda(){
        const opcao = super.validarEntradaLoop("Apresentar a agenda T-Toda ou P-Periodo: ", (entrada) => {
                if((entrada === 'T') || (entrada === 'P'))
                    return {success: true}

                return {success: false, error: ErrorCodes.ERR_ENTRADA_INVALIDA_AGENDA};
        })
        
        if(opcao === 'T') {
            console.log(this.consultas_controller.listarConsultas(this.pacientes_controller));
            return;
        }

        // Preciso de um jeito melhor de validar entradas
        const data_inicial = super.validarEntradaLoop("Data inicial: ", (entrada) => this.consultas_controller.validaData(entrada));
        const data_final = super.validarEntradaLoop("Data final: ", (entrada) => this.consultas_controller.validaData(entrada, data_inicial));

        console.log(this.consultas_controller.listarConsultas(this.pacientes_controller, true, data_inicial, data_final));
    }

    processarOpcao(opcao){
        switch (opcao) {
            case 1:
                this.agendarConsulta();
                return { tela: "Agendamento", sair: true};

            case 2:
                this.cancelarAgendamento();
                return { tela: "Agendamento", sair: true };

            case 3:
                this.listarAgenda()
                return { tela: "Agendamento", sair: true };
            
            case 4:
                return { tela: "Menu", sair: true };

            default:
                // Chama novamente se a opção for inválida
                console.log("Opção inválida! Por favor, escolha uma opção de 1 a 4.");
                return { sair: false };
        }
    }


};
import {PacienteBuilder} from "../models/PacienteBuilder.js"
import { DateTime } from "luxon";

export class PacienteController{

    constructor() {
        this.pacientes = new Map(); // Estou usando um hasmap para agilizar a procura por pacientes que será recorrente
        this.paciente_builder = new PacienteBuilder();
    }

    iniciarNovoPaciente(){
        this.paciente_builder.clear();
    }

    validaCpf(cpf){
        if(this.pacientes.has(cpf))
            return {success: false, error: "Erro: Paciente já cadastrado!"};

        if(!this.paciente_builder.validaCpf(cpf))
            return {success: false, error: "Erro: CPF inválido"};

        return { success: true }
    }

    setCpf(cpf){
        if(this.pacientes.has(cpf))
            return {success: false, error: "Erro: Paciente já cadastrado!"}

        return this.paciente_builder.setCpf(cpf);
    }

    setNome(nome){
        return this.paciente_builder.setNome(nome);
    }

    setData_nasc(data){
        return this.paciente_builder.setData_nasc(data);
    }

    addPaciente(){
        const paciente = this.paciente_builder.build();
        if(!paciente.success)
            return paciente;

        this.pacientes.set(paciente.paciente.cpf, paciente.paciente);
        this.paciente_builder.clear();

        return {success: true};
    }

    removePaciente(cpf, consulta_controller){
        
        // VErifica se o paciente já existe
        if (!this.pacientes.has(cpf)) 
            return { success: false, error: "Erro: paciente não cadastrado" };
        
        // Verifica se o paciente possui agendamentos futuros
        if(consulta_controller.hasAgendamentosFuturos(cpf))
            return { success: false, error: "Erro: paciente está agendado." };
        
        this.pacientes.delete(cpf);
        consulta_controller.removeConsultasPaciente(cpf);

        return { success: true};
    }

    getPaciente(cpf){
        if(!this.exists(cpf))
            return null;

        return this.pacientes.get(cpf);
    }

    exists(cpf) {
        return this.pacientes.has(cpf);
    }

    geraListaPacientes(lista_pacientes, consulta_controller){
        // Cabeçalho da tabela
        let resultado = '------------------------------------------------------------\n';
        resultado +=    'CPF         Nome                           Dt.Nasc.    Idade\n';
        resultado +=    '------------------------------------------------------------\n';

        // Iterar sobre os pacientes
        lista_pacientes.forEach((paciente) => {

            // calcular idade do paciente
            const hoje = DateTime.now();
            const idade = Math.floor(hoje.diff(paciente.data_nasc, 'years').years);

            // Adicionar as informações do paciente
            resultado += `${paciente.cpf} ${paciente.nome.padEnd(30, ' ')} ${paciente.data_nasc.toFormat('dd/MM/yyyy')} ${String(idade).padStart(6)}\n`;

            // Verificar se o paciente tem agendamento futuro
            const agendamento = consulta_controller.getAgendamentosFuturos(paciente.cpf);
            if (agendamento.success) {
                // Adicionar informações de agendamento futuro
                agendamento.consultas.forEach((consulta) => {
                    resultado += "".padEnd(12) +`Agendado para: ${consulta.data_consulta.toFormat('dd/MM/yyyy')}\n`
                    resultado += "".padEnd(12)+`${consulta.hora_inicial.toFormat('HH:mm')} às ${consulta.hora_final.toFormat('HH:mm')}\n`;
                });
            }
        });

        resultado +=  '------------------------------------------------------------\n';

        return resultado;
    }

    getPacientesOrdenadosPorCpf(consulta_controller){
        // Ordenar os pacientes pelo CPF
        const pacientesOrdenados = [...this.pacientes.values()].sort((a, b) => a.cpf - b.cpf);
        return this.geraListaPacientes(pacientesOrdenados, consulta_controller);
    }

    getPacientesOrdenadosPorNome(consulta_controller){
        // Ordenar os pacientes pelo nome
        const pacientesOrdenados = [...this.pacientes.values()].sort((a, b) => a.nome.localeCompare(b.nome));
        return this.geraListaPacientes(pacientesOrdenados, consulta_controller);
    }

}
import { Consulta } from "./Consulta.js";
import { Paciente } from "./Paciente.js"


export class Agenda{
    pacientes;
    consultas;

    constructor(){
        this.pacientes = new Map(); // Estou usando um hasmap para agilizar a procura por pacientes que será recorrente
        this.consultas = new Map();
    }

    removePaciente(cpf){

        // VErifica se o paciente já existe
        if (!this.pacientes.has(cpf)) 
            return { success: false, message: "Erro: paciente não cadastrado" };
        
        // Verifica se o paciente possui agendamentos futuros
        const consultasPaciente = this.consultas.get(cpf);
        if (consultasPaciente && consultasPaciente.some((c) => !c.isConsultaPassada())) 
            return { success: false, message: "Erro: paciente está agendado." };
        
        this.consultas.delete(cpf);
        this.pacientes.delete(cpf);
        return { success: true, message: "Paciente excluído com sucesso!" };
    }

    addPaciente(paciente){
        if (this.pacientes.has(paciente.cpf)) 
            return { success: false, message: "Erro: CPF já cadastrado!" };
        

        this.pacientes.set(paciente.cpf, paciente);
        return { success: true, message: "Paciente cadastrado com sucesso!" };
    }

    #isSobreposta(consulta){
        for (const [cpf, consultas_cliente] of this.consultas.entries()) 
            for (let i = 0; i < consultas_cliente.length; i++) 
                if(consulta.isSobreposta(consultas_cliente[i]))
                    return true;

        return false;
    }

    addConsulta(consulta) {
        const cpf_paciente = consulta.cpf_paciente;

        if (!this.pacientes.has(cpf_paciente)) 
            return { success: false, message: "Erro: paciente não cadastrado" };

        if (this.#isSobreposta(consulta)) 
            return { success: false, message: "Erro: já existe uma consulta agendada nesse horário" };

        if (!this.consultas.has(cpf_paciente)) 
            this.consultas.set(cpf_paciente, []);
        
        this.consultas.get(cpf_paciente).push(consulta);
        return { success: true, message: "Agendamento realizado com sucesso!" };
    }

    removeConsulta(cpf, data_consulta, hora_inicial){

        const consultasArray = this.consultas.get(cpf);

        for (let i = 0; i < consultasArray.length; i++) {
            if(data_consulta === consultasArray[i].data_consulta && consultasArray[i].hora_inicial === hora_inicial){
                this.consultas.set(cpf, consultasArray.splice(i, 1));
                return true;
            }
        }

        return false;
    }

};
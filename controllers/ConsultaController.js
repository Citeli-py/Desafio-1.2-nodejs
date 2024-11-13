import { ConsultaBuilder } from "../models/ConsultaBuilder.js";

export class ConsultaController{

    consultas;
    consulta_builder;

    constructor(){
        this.consultas = new Map();
        this.consulta_builder = new ConsultaBuilder();
    }

    iniciarNovaConsulta(){
        this.consulta_builder.clear();
    }

    setCpf(cpf, paciente_controller){
        if(!paciente_controller.exists(cpf))
            return {success: false, error: "Erro: paciente não cadastrado"};


        return this.consulta_builder.setCpf(cpf)
    }

    setDataConsulta(data) {
        return this.consulta_builder.setDataConsulta(data);
    }

    setHoraInicial(horaInicial) {
       return this.consulta_builder.setHoraInicial(horaInicial);
    }

    setHoraFinal(horaFinal) {
        return this.consulta_builder.setHoraFinal(horaFinal);
    }

    addConsulta(){
        const consulta = this.consulta_builder.build();
        if(!consulta.success)
            return consulta;

        if(!this.consultas.has(consulta.consulta.cpf_paciente))
            this.consultas.set(consulta.consulta.cpf_paciente, []);

        this.consultas.get(consulta.consulta.cpf_paciente).push(consulta.consulta);
        this.consulta_builder.clear();

        return {success: true};
    }

    removeConsulta(cpf, data_consulta, hora_inicial){

        if(!this.consultas.has(cpf))
            return {success: false, error: "Erro: paciente não cadastrado"};

        const consultas_paciente = this.consultas.get(cpf);

        for (let i = 0; i < consultas_paciente.length; i++) {
            if(data_consulta === consultas_paciente[i].data_consulta && consultas_paciente[i].hora_inicial === hora_inicial){
                this.consultas.set(cpf, consultas_paciente.splice(i, 1));
                return {success: true};
            }
        }

        return {success: false, error: "Erro: agendamento não encontrado"};
    }

    removeConsultasPaciente(cpf){

        if(!this.consultas.has(cpf))
            return {success: false, error: "Erro: paciente não cadastrado"};

        this.consultas.delete(cpf);
        return {success: true};
    }

    hasAgendamentosFuturos(cpf){

        // Verifica se o paciente possui agendamentos futuros
        const consultas_paciente = this.consultas.get(cpf);
        if (consultas_paciente && consultas_paciente.some((c) => !c.isConsultaPassada())) 
            return true;

        return false;
    }

    getAgendamentosFuturos(cpf){
        if(!this.consultas.has(cpf))
            return {success: false, error: "Paciente não possui agendamentos"};

        // Verifica se o paciente possui agendamentos futuros
        const consultas_paciente = this.consultas.get(cpf);
        var consultas_futuras = consultas_paciente.filter((consulta) => !consulta.isConsultaPassada());

        return {success: true, consultas: consultas_futuras};
    }

    listarConsultas(){
        
    }
};
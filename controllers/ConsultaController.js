import { ConsultaBuilder } from "../models/ConsultaBuilder.js";
import { DateTime } from "luxon";

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
            if(data_consulta === consultas_paciente[i].data_consulta.toFormat("dd/MM/yyyy") && consultas_paciente[i].hora_inicial.toFormat("HHmm") === hora_inicial){
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

    listarConsultas(paciente_controller, filtro_periodo=false, data_inicial=null, data_final=null){

        function concatDataEHora(consulta) {
            return DateTime.fromObject({
                year: consulta.data_consulta.year,
                month: consulta.data_consulta.month,
                day: consulta.data_consulta.day,
                hour: consulta.hora_inicial.hour,
                minute: consulta.hora_inicial.minute
            }).toMillis();
        }

        if(filtro_periodo && !(data_inicial && data_final))
            throw new Error("Listar consultas com período deve ter data inicial e final");
            

        var listaConsultas = [...this.consultas.values()].flat();

        if(filtro_periodo){
            const data_inicial_formata  = DateTime.fromFormat(data_inicial, "dd/MM/yyyy");
            const data_final_formata    = DateTime.fromFormat(data_final, "dd/MM/yyyy");

            listaConsultas = listaConsultas.filter(consulta => {
                const data = consulta.data_consulta;
                return (
                    data >= data_inicial_formata.startOf('day') &&
                    data <= data_final_formata.endOf('day')
                );
            });
        }

        listaConsultas = listaConsultas.sort(
            (a, b) => concatDataEHora(a) - concatDataEHora(b)
        );

        // Cabeçalho
        var resultado = "-------------------------------------------------------------\n";
        resultado    += "   Data    H.Ini H.Fim Tempo Nome                   Dt.Nasc. \n";
        resultado    += "-------------------------------------------------------------\n";

        for(let i=0; i < listaConsultas.length; i++){
            const consulta = listaConsultas[i];

            var data_consulta = "";
            if((i === 0) || !listaConsultas[i].data_consulta.equals(listaConsultas[i-1].data_consulta)){
                data_consulta = consulta.data_consulta.toFormat("dd/MM/yyyy")
            }

            resultado += `${data_consulta.padEnd(10, ' ')} `;
            resultado += `${consulta.hora_inicial.toFormat("HH:mm")} `;
            resultado += `${consulta.hora_final.toFormat("HH:mm")} `;
            resultado += `${consulta.hora_final.diff(consulta.hora_inicial, ["hours", "minutes"]).toFormat("hh:mm")} `;

            const paciente = paciente_controller.getPaciente(consulta.cpf_paciente);
            resultado += `${paciente.nome.padEnd(21, ' ')} ${paciente.data_nasc.toFormat("dd/MM/yyyy")}\n`;
        }
        

        resultado    += "-------------------------------------------------------------";
        return resultado;
    }


    validaHoraInicial(hora_inicial){
        const HoraInicial = DateTime.fromFormat(hora_inicial, "HHmm");

        if (!HoraInicial.isValid) {
            return { success: false, error: "Erro: hora inválida. use o formato HHMM!" };
        }

        return { success: true };
    }

    validaData(data, data_inicial=null){
        const Data = DateTime.fromFormat(data, "dd/MM/yyyy");

        if (!Data.isValid) {
            return { success: false, error: "Erro: Data inválida. Use o formato DD/MM/AAAA." };
        }

        if(data_inicial){
            const DataInicial = DateTime.fromFormat(data_inicial, "dd/MM/yyyy");

            if(Data.diff(DataInicial, ['days']) < 0)
                return { success: false, error: "Erro: Data final menor que a inicial." };
        }

        return { success: true };
    }
};

export class Consulta{
    cpf_paciente;
    data_consulta;
    hora_inicial;
    hora_final;
    

    isSobreposta(consulta){
        // Verifica se uma consulta sobrepõe a outra
        if(!this.data_consulta.equals(consulta.data_consulta))
            return false;

        // Verifica se uma consulta sobrepõe a outra
        if((this.hora_inicial >= consulta.hora_final) || (this.hora_final <= consulta.hora_inicial))
            return false;

        return true
    }

    isConsultaPassada(){
        const hoje = DateTime.now();

        if(this.data_consulta.diff(hoje.startOf('day')).days < 0)
            return true;

        // Estou considerando que caso você tenha perdido o horario de entrar na consulta ela já não vale mais
        if(this.hora_inicial.diff(hoje.startOf('hour')).hours < 0)
            return true;

        return false;
    }
};
import { DateTime } from 'luxon';

export class Consulta{
    #cpf_paciente;
    #data_consulta;
    #hora_inicial;
    #hora_final;

    constructor(cpf_paciente){
        this.cpf_paciente = cpf_paciente;
    }

    get data_consulta(){
        return this.#data_consulta;
    }

    get hora_inicial(){
        return this.#hora_inicial;
    }

    get hora_final(){
        return this.#hora_final;
    }

    set data_consulta(novaData){
        novaData = DateTime.fromFormat(novaData, "dd/MM/yyyy");

        if (!novaData.isValid) 
            throw new Error("Erro: Data inválida. Use o formato DD/MM/AAAA.");
        
        const hoje = DateTime.now();

        if( novaData.diff(hoje.startOf('day'), 'days').days < 0)
            throw new Error(`Erro: Não se pode marcar uma consulta antes da data de hoje ${hoje.day}/${hoje.month}/${hoje.year}`);

        if((novaData.diff(hoje.startOf('day'), 'days').days === 0) && !this.#isAberto(hoje))
            throw new Error("Erro: Não é mais possivel marcar uma consulta hoje, horario de funcionamento das 8:00h às 19:00h");
            

        this.#data_consulta = novaData;
    }

    set hora_inicial(novaHoraInicial){

        if(!this.#data_consulta)
            throw new Error("Erro: sem data de consulta!");

        novaHoraInicial = DateTime.fromFormat(novaHoraInicial, "HHmm");
        if(!novaHoraInicial.isValid)
            throw new Error("Erro: Esse formato de hora não é valido!");

        if(novaHoraInicial.minute%15 !== 0)
            throw new Error("Erro: As consultas só podem ser marcadas de 15 em 15 minutos");

        // Uma consulta tem que ter no minimo 15 minutos entõa não é possivel marcar uma consulta as 19hrs por mais que esteja aberto
        if(!this.#isAberto(novaHoraInicial) || novaHoraInicial.hour >= 19)
            throw new Error("Erro: O horario de funcionamento é das 08:00h às 19:00h");

        const agora = DateTime.now();

        if((this.#data_consulta.diff(agora.startOf('day'), 'days').days === 0) && (novaHoraInicial.diff(agora, 'hours').hours < 0 ))
            throw new Error(`Erro: Não é possivel agendar horario antes das ${agora.toFormat("HH:mm")}h`);
            

        this.#hora_inicial = novaHoraInicial;
    }

    set hora_final(novaHoraFinal){

        if(!this.#data_consulta)
            throw new Error("Erro: sem data de consulta!");

        if(!this.#hora_inicial)
            throw new Error("Erro: sem hora inicial da consulta!");

        novaHoraFinal = DateTime.fromFormat(novaHoraFinal, "HHmm");
        if(!novaHoraFinal.isValid)
            throw new Error("Erro: Esse formato de hora não é valido!");

        if(novaHoraFinal.minute%15 !== 0)
            throw new Error("Erro: As consultas só podem ser marcadas de 15 em 15 minutos");

        if(!this.#isAberto(novaHoraFinal))
            throw new Error("Erro: O horario de funcionamento é das 08:00h às 19:00h");

        if(novaHoraFinal<=this.#hora_inicial)
            throw new Error("Erro: Hora final tem que ser maior que hora inicial!");

        this.#hora_final = novaHoraFinal;
    }

    sobreposta(consulta){
        if(!this.#data_consulta.equals(consulta.data_consulta))
            return false;

        // Verifica se uma consulta sobrepõe a outra
        if((this.#hora_inicial >= consulta.hora_final) || (this.#hora_final <= consulta.hora_inicial))
            return false;

        return true
    }

    #isAberto(data){
        let [ hora_aberto, hora_fechado ] = [8, 19];

        return (data.hour >= hora_aberto) && (data.hour <= hora_fechado);
    }
};
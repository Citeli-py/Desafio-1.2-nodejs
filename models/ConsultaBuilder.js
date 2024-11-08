import { DateTime } from 'luxon';
import { Consulta } from './Consulta';

export class ConsultaBuilder {
    #cpf_paciente;
    #data_consulta;
    #hora_inicial;
    #hora_final;

    constructor(cpf_paciente) {
        this.#cpf_paciente = cpf_paciente;
    }

    setDataConsulta(data) {
        const novaData = DateTime.fromFormat(data, "dd/MM/yyyy");
        const hoje = DateTime.now();

        if (!novaData.isValid) {
            return { success: false, error: "Erro: Data inválida. Use o formato DD/MM/AAAA." };
        }

        if (novaData.diff(hoje.startOf('day'), 'days').days < 0) {
            return { success: false, error: `Erro: Não se pode marcar uma consulta antes da data de hoje ${hoje.toFormat("dd/MM/yyyy")}` };
        }

        if (novaData.diff(hoje.startOf('day'), 'days').days === 0 && !this.#isAberto(hoje)) {
            return { success: false, error: "Erro: Não é mais possível marcar uma consulta hoje, horário de funcionamento das 08:00h às 19:00h" };
        }

        this.#data_consulta = novaData;
        return { success: true };
    }

    setHoraInicial(horaInicial) {
        if (!this.#data_consulta) {
            return { success: false, error: "Erro: sem data de consulta!" };
        }

        const novaHoraInicial = DateTime.fromFormat(horaInicial, "HHmm");
        if (!novaHoraInicial.isValid) {
            return { success: false, error: "Erro: Esse formato de hora não é válido!" };
        }

        if (novaHoraInicial.minute % 15 !== 0) {
            return { success: false, error: "Erro: As consultas só podem ser marcadas de 15 em 15 minutos" };
        }

        if (!this.#isAberto(novaHoraInicial) || novaHoraInicial.hour >= 19) {
            return { success: false, error: "Erro: O horário de funcionamento é das 08:00h às 19:00h" };
        }

        const agora = DateTime.now();
        if (this.#data_consulta.diff(agora.startOf('day'), 'days').days === 0 && novaHoraInicial.diff(agora, 'hours').hours < 0) {
            return { success: false, error: `Erro: Não é possível agendar horário antes das ${agora.toFormat("HH:mm")}h` };
        }

        this.#hora_inicial = novaHoraInicial;
        return { success: true };
    }

    setHoraFinal(horaFinal) {
        if (!this.#data_consulta) {
            return { success: false, error: "Erro: sem data de consulta!" };
        }

        if (!this.#hora_inicial) {
            return { success: false, error: "Erro: sem hora inicial da consulta!" };
        }

        const novaHoraFinal = DateTime.fromFormat(horaFinal, "HHmm");
        if (!novaHoraFinal.isValid) {
            return { success: false, error: "Erro: Esse formato de hora não é válido!" };
        }

        if (novaHoraFinal.minute % 15 !== 0) {
            return { success: false, error: "Erro: As consultas só podem ser marcadas de 15 em 15 minutos" };
        }

        if (!this.#isAberto(novaHoraFinal)) {
            return { success: false, error: "Erro: O horário de funcionamento é das 08:00h às 19:00h" };
        }

        if (novaHoraFinal <= this.#hora_inicial) {
            return { success: false, error: "Erro: Hora final deve ser maior que a hora inicial!" };
        }

        this.#hora_final = novaHoraFinal;
        return { success: true };
    }

    build() {
        if (!this.#cpf_paciente || !this.#data_consulta || !this.#hora_inicial || !this.#hora_final) {
            return { success: false, error: "Erro: faltam dados obrigatórios para criar a consulta." };
        }

        const consulta = new Consulta(this.#cpf_paciente);
        consulta.data_consulta = this.#data_consulta;
        consulta.hora_inicial = this.#hora_inicial;
        consulta.hora_final = this.#hora_final;

        return { success: true, consulta };
    }

    #isAberto(data) {
        const [hora_aberto, hora_fechado] = [8, 19];
        return data.hour >= hora_aberto && data.hour < hora_fechado;
    }
}

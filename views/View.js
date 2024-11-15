import promptSync from 'prompt-sync';
const prompt = promptSync({ sigint: true });
import { ErrorCodes } from '../utils/Error.js';

export class View{

    processarErros(erro) {
        const ErrorToMsg = {
            [ErrorCodes.ERR_CPF_INVALIDO]:                  "Erro: CPF inválido.",
            [ErrorCodes.ERR_CPF_DUPLICADO]:                 "Erro: Paciente já cadastrado.",
            [ErrorCodes.ERR_NOME_INVALIDO]:                 "Erro: Nome deve ter pelo menos 5 caracteres.",
            [ErrorCodes.ERR_DATA_PACIENTE_INVALIDA]:        "Erro: Data de nascimento inválida. Formato esperado: DD/MM/AAAA.",
            [ErrorCodes.ERR_IDADE_INSUFICIENTE]:            "Erro: Paciente deve ter pelo menos 13 anos.",
            [ErrorCodes.ERR_PACIENTE_NAO_CADASTRADO]:       "Erro: Paciente não cadastrado.",
            [ErrorCodes.ERR_PACIENTE_AGENDADO]:             "Erro: paciente está agendado.",
            [ErrorCodes.ERR_PACIENTE_INCOMPLETO]:           "Erro: faltam dados obrigatórios para criar o paciente.",

            [ErrorCodes.ERR_DATA_CONSULTA_INVALIDA]:        "Erro: Data da consulta deve ter o formato DD/MM/AAAA.",
            [ErrorCodes.ERR_DATA_CONSULTA_ANTERIOR]:        "Erro: Não é possivel fazer agendamento anterior a data de hoje",
            [ErrorCodes.ERR_DATA_CONSULTA_HOJE_FECHADO]:    "Erro: Não é mais possível marcar uma consulta hoje, horário de funcionamento das 08:00h às 19:00h",
            [ErrorCodes.ERR_HORA_INVALIDA]:                 "Erro: Formato inválido de hora, use o fromato HHmm.",
            [ErrorCodes.ERR_HORA_HORARIO_INVALIDO]:         "Erro: As consultas só podem ser marcadas de 15 em 15 minutos",
            [ErrorCodes.ERR_HORA_FINAL_ANTES_INICIAL]:      "Erro: Hora final deve ser maior que a hora inicial!" ,
            [ErrorCodes.ERR_HORA_PASSADA]:                  "Erro: Não é possível agendar horário anterior ao horário atual",
            [ErrorCodes.ERR_HORA_HORARIO_FECHADO]:          "Erro: O horário de funcionamento é das 08:00h às 19:00h",
            [ErrorCodes.ERR_HORA_SEM_DATA_CONSULTA]:        "Erro: sem data de consulta!",
            [ErrorCodes.ERR_HORA_SEM_HORA_INICIAL]:         "Erro: sem hora inicial da consulta!",
            [ErrorCodes.ERR_CONSULTA_INCOMPLETA]:           "Erro: faltam dados obrigatórios para criar a consulta.",
            [ErrorCodes.ERR_DATA_FINAL_MENOR_INICIAL]:      "Erro: Data final menor que a inicial.",
            
            [ErrorCodes.ERR_CONSULTA_NAO_ENCONTRADA]:       "Erro: agendamento não encontrado",
            [ErrorCodes.ERR_ENTRADA_INVALIDA_AGENDA]:       "Entrada deve ser T ou P!",
        };
    
        console.log(ErrorToMsg[erro] || "Erro desconhecido.");
    }

    show() {
        throw new Error("Método show() deve ser implementado nas subclasses");
    }

    lerOpcao(mensagem) {
        const opcao = parseInt(prompt(mensagem));
        return opcao;
    }

    validarEntrada(mensagem, metodo){

        var entrada = prompt(mensagem);
        var response = metodo(entrada);

        if(!response.success)
            this.processarErros(response.error);

        return {success: response.success, entrada: entrada};
    }

    validarEntradaLoop(mensagem, metodo){

        var response = {success: false, error: ""};
        var entrada;

        do {
            entrada = prompt(mensagem);
            response = metodo(entrada);

            if(!response.success)
                this.processarErros(response.error);

        } while (!response.success);

        return entrada;
    }

    processarOpcao(opcao){
        throw new Error("Método processarOpcao() deve ser implementado nas subclasses");
    }


    main() {
        var sair = false;
        var mensagem;

        while(!sair){

            this.show();
            const opcao = this.lerOpcao("> ");
            mensagem = this.processarOpcao(opcao);

            sair = mensagem.sair;
        }

        return mensagem.tela;
    }
};
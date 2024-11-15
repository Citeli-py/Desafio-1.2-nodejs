export const ErrorCodes = {
    // Erros relacionados ao paciente
    ERR_CPF_INVALIDO:               100, // O CPF informado não está no formato válido.
    ERR_CPF_DUPLICADO:              101, // O CPF já está cadastrado no sistema.
    ERR_NOME_INVALIDO:              102, // O nome informado contém caracteres inválidos ou está vazio.
    ERR_DATA_PACIENTE_INVALIDA:     103, // A data de nascimento do paciente é inválida ou está fora do formato esperado.
    ERR_IDADE_INSUFICIENTE:         104, // O paciente não possui idade mínima para o cadastro.
    ERR_PACIENTE_NAO_CADASTRADO:    105, // Tentativa de agendar consulta para um paciente não cadastrado.
    ERR_PACIENTE_AGENDADO:          106, // O paciente já possui uma consulta marcada no horário especificado.
    ERR_PACIENTE_INCOMPLETO:        107, // Dados obrigatórios do paciente estão ausentes ou incompletos.

    // Erros relacionados à consulta
    ERR_DATA_CONSULTA_INVALIDA:     200, // A data informada para a consulta é inválida ou está fora do formato esperado.
    ERR_DATA_CONSULTA_ANTERIOR:     201, // A data informada para a consulta é anterior à data atual.
    ERR_DATA_CONSULTA_HOJE_FECHADO: 202, // Tentativa de marcar consulta no mesmo dia, mas fora do horário permitido.
    ERR_HORA_INVALIDA:              203, // A hora informada não está no formato válido.
    ERR_HORA_HORARIO_INVALIDO:      204, // O horário informado está fora do intervalo de funcionamento permitido.
    ERR_HORA_FINAL_ANTES_INICIAL:   205, // A hora final da consulta é anterior ou igual à hora inicial.
    ERR_HORA_PASSADA:               206, // O horário informado já passou e não é mais possível agendar.
    ERR_HORA_HORARIO_FECHADO:       207, // Tentativa de agendar consulta em horário fora do expediente.
    ERR_HORA_SEM_DATA_CONSULTA:     208, // Tentativa de definir horário sem antes definir a data da consulta.
    ERR_HORA_SEM_HORA_INICIAL:      209, // Tentativa de definir a hora final sem antes definir a hora inicial.
    ERR_CONSULTA_INCOMPLETA:        210, // Dados obrigatórios para criação da consulta estão ausentes ou incompletos.
    ERR_CONSULTA_NAO_ENCONTRADA:    211, // Consulta especificada não foi encontrada no sistema.

    // Erros gerais ou específicos adicionais
    ERR_DATA_FINAL_MENOR_INICIAL:   300, // A data final fornecida é menor que a data inicial.
    ERR_ENTRADA_INVALIDA_AGENDA:    301  // Entrada inválida ou fora do formato esperado ao manipular a agenda.
};

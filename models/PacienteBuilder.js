import { DateTime } from 'luxon';
import { Paciente } from './Paciente.js';
import { ErrorCodes } from '../utils/Error.js';

export class PacienteBuilder {
    #cpf;
    #nome;
    #data_nasc;

    validaCpf(cpf){
        if (!this.#validaCodigoCpf(cpf)) 
            return false;

        return true;
    }

    setCpf(novoCpf){

        if (!this.validaCpf(novoCpf)) {
            return { success: false, error: ErrorCodes.ERR_CPF_INVALIDO };
        }

        this.#cpf = novoCpf;
        return { success: true };
    }

    validaNome(nome){
        if (nome.length < 5)
            return { success: false, error: ErrorCodes.ERR_NOME_INVALIDO };

        return {success: true}
    }

    setNome(novoNome){
        const result = this.validaNome(novoNome);

        if(result.success)
            this.#nome = novoNome;
        
        return result;
    }

    setData_nasc(novaData){
        // Converte a string para uma data Luxon usando o formato "dd/MM/yyyy"
        novaData = DateTime.fromFormat(novaData, "dd/MM/yyyy");

        if (!novaData.isValid) 
            return { success: false, error: ErrorCodes.ERR_DATA_PACIENTE_INVALIDA };


        const idade = DateTime.now().diff(novaData, "years").years;
        if (idade < 13) 
            return { success: false, error: ErrorCodes.ERR_IDADE_INSUFICIENTE};
        

        this.#data_nasc = novaData;
        return { success: true };
    }


    clear(){
        this.#cpf = null;
        this.#nome = null;
        this.#data_nasc = null;
    }

    build() {
        if (!this.#cpf || !this.#nome || !this.#data_nasc) {
            return {
                success: false,
                error: ErrorCodes.ERR_PACIENTE_INCOMPLETO
            };
        }

        const paciente = new Paciente();
        paciente.cpf = this.#cpf;
        paciente.nome = this.#nome;
        paciente.data_nasc = this.#data_nasc;

        this.clear();

        return { success: true, paciente };
    }

    #isNumerico(str) {
        return /^\d+$/.test(str);
    }

    #validaCodigoCpf(cpf) {
        if (!cpf || cpf.length !== 11 || !this.#isNumerico(cpf)) 
            return false;

        let digitoJ = Number(cpf[9]);
        let digitoK = Number(cpf[10]);

        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += (10 - i) * Number(cpf[i]);
        }

        let resto = soma % 11;
        if ((resto <= 1 && digitoJ !== 0) || (resto > 1 && (11 - resto) !== digitoJ)) 
            return false;

        soma += 2 * digitoJ;
        for (let i = 0; i < 9; i++) {
            soma += Number(cpf[i]);
        }

        resto = soma % 11;
        if ((resto <= 1 && digitoK !== 0) || (resto > 1 && (11 - resto) !== digitoK)) 
            return false;

        return true;
    }

};
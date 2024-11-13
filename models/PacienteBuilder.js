import { DateTime } from 'luxon';
import { Paciente } from './Paciente.js';

export class PacienteBuilder {
    #cpf;
    #nome;
    #data_nasc;

    setCpf(novoCpf){

        if(novoCpf.length !== 11)
            return { success: false, error: "Erro: CPF inválido" };

        if(!this.#isNumerico(novoCpf))
            return { success: false, error: "Erro: CPF inválido" };

        if (!this.#validaCpf(novoCpf))
            return { success: false, error: "Erro: CPF inválido" };
            
        this.#cpf = novoCpf; 
        return { success: true };
    }

    setNome(novoNome){
        if (novoNome.length < 5)
            return { success: false, error: "Erro: Nome deve ter pelo menos 5 caracteres" };
        
        this.#nome = novoNome;
        return { success: true };
    }

    setData_nasc(novaData){
        // Converte a string para uma data Luxon usando o formato "dd/MM/yyyy"
        novaData = DateTime.fromFormat(novaData, "dd/MM/yyyy");

        if (!novaData.isValid) 
            return { success: false, error: "Erro: Data de nascimento inválida. Formato esperado: DD/MM/AAAA." };


        const idade = DateTime.now().diff(novaData, "years").years;
        if (idade < 13) 
            return { success: false, error: "Erro: paciente deve ter pelo menos 13 anos."};
        

        this.#data_nasc = novaData;
        return { success: true };
    }

    #isNumerico(str){
        // Regex para verificar se há apenas numeros na string
        return /^\d+$/.test(str)
    }

    #validaCpf(cpf){
        let digitoJ = Number(cpf[9]);
        let digitoK = Number(cpf[10]);

        // Esse for vai fazer a soma 10A + 9B + 8C + 7D + 6E + 5F + 4G + 3H + 2I
        let soma = 0;
        for(let i=0; i<9; i++)
            soma += (10-i)*Number(cpf[i]);
        

        let resto = soma%11;
        if((resto <= 1) && (0 !== digitoJ)) 
            return false;

        if((resto > 1) && ((11-resto) !== digitoJ))
            return false;
    
        // Para o segundo dígito vamos aproveitar a soma do anterior e somar cada digito do cpf
        //  10A + 9B + 8C + 7D + 6E + 5F + 4G + 3H + 2I 
        // +  A +  B +  C +  D +  E +  F +  G +  H +  I + 2J
        // ---------------------------------------------------
        // 11A + 10B + 9C + 8D + 7E + 6F + 5G + 4H + 3I + 2J 

        soma += 2*digitoJ
        for(let i=0; i<9; i++)
            soma += Number(cpf[i]);

        resto = soma%11;
        if((resto <= 1) && (0 !== digitoK)) 
            return false;

        if((resto > 1) && ((11-resto) !== digitoK))
            return false;
        

        return true;
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
                error: "Erro: faltam dados obrigatórios para criar o paciente."
            };
        }

        const paciente = new Paciente();
        paciente.cpf = this.#cpf;
        paciente.nome = this.#nome;
        paciente.data_nasc = this.#data_nasc;

        this.clear();

        return { success: true, paciente };
    }

};
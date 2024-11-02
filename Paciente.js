
export class Paciente {
    #cpf;
    #nome;
    #data_nasc;


    set cpf(novoCpf){

        if(novoCpf.length !== 11)
            throw new Error("CPF inválido");

        if(!this.#isNumerico(novoCpf))
            throw new Error("CPF inválido");

        if (!this.#validaCpf(novoCpf))
            throw new Error("CPF inválido");
            
        this.#cpf = novoCpf; 
    }

    set nome(novoNome){
        if (novoNome.length < 5)
            throw new Error("Erro: Nome deve ter pelo menos 5 caracteres");
        
        this.#nome = novoNome;

    }

    set data_nasc(novaData){
        // Converte a string para uma data Luxon usando o formato "dd/MM/yyyy"
        novaData = DateTime.fromFormat(novaData, "dd/MM/yyyy");

        if (!novaData.isValid) 
            throw new Error("Erro: Data de nascimento inválida. Formato esperado: DD/MM/AAAA.");


        const idade = DateTime.now().diff(novaData, "years").years;
        if (idade < 13) {
            throw new Error("Erro: O cliente deve ter pelo menos 18 anos.");
        }

        this.#data_nasc = novaData;

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

};

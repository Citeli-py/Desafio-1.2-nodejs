import promptSync from 'prompt-sync';
const prompt = promptSync({ sigint: true });


export class View{

    show() {
        throw new Error("Método show() deve ser implementado nas subclasses");
    }

    lerEntrada(mensagem) {
        const opcao = parseInt(prompt(mensagem));
        return opcao;
    }

    validarEntrada(mensagem, metodo){

        var response = {success: false, error: ""};
        do {
            const entrada = prompt(mensagem);
            response = metodo(entrada);

            if(!response.success)
                console.log(response.error);

        } while (!response.success);

        return true;
    }

    processarOpcao(opcao){
        throw new Error("Método processarOpcao() deve ser implementado nas subclasses");
    }


    main() {
        var sair = false;
        var mensagem;

        while(!sair){

            this.show();
            const opcao = this.lerEntrada("> ");
            mensagem = this.processarOpcao(opcao);

            sair = mensagem.sair;
        }

        return mensagem.tela;
    }
};
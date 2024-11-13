import { View } from './VIew.js';


export class Menu extends View{

    show() {
        console.log("Menu Principal\n1 - Cadastro de pacientes\n2 - Agenda\n3 - Fim\n");
    }

    processarOpcao(opcao){
        switch (opcao) {
            case 1:
                console.log("Você escolheu: Cadastro de pacientes");
                return { tela: "CadastroPacientes", sair: true};

            case 2:
                console.log("Você escolheu: Agenda");
                return { tela: "Agenda", sair: true };
            case 3:
                console.log("Você escolheu: Fim");
                return { tela: "Fim", sair: true };
            default:
                // Chama novamente se a opção for inválida
                console.log("Opção inválida! Por favor, escolha uma opção de 1 a 3.");
                return { sair: false };
        }
    }
}

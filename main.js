import {Paciente} from './models/Paciente.js'
import { Agenda } from './models/Agenda.js'
import { Consulta } from './models/Consulta.js'

import promptSync from 'prompt-sync';
const prompt = promptSync({ sigint: true });



var agenda = new Agenda();

// agenda.addPaciente();
// agenda.addPaciente();

// agenda.addConsulta();

// agenda.removePaciente("16262362754")

const capturarEntrada = (mensagem, propriedade, classe) => {
    let instancia = new classe();
    var entrada;

    while (true) {
        try {
            entrada = prompt(mensagem);
            instancia[propriedade] = entrada;
            break
        } catch (erro) {
            console.log(erro.message);
        }
    }

    return entrada;
};

import { PacienteBuilder } from './models/PacienteBuilder.js';

const builder = new PacienteBuilder();

const cpfResult = builder.setCpf("19086839703");
if (!cpfResult.success) {
    console.log(cpfResult.error); // Notifica o erro na `view`
}

const nomeResult = builder.setNome("João Silva");
if (!nomeResult.success) {
    console.log(nomeResult.error); // Notifica o erro na `view`
}

const dataNascResult = builder.setData_nasc("01/01/2000");
if (!dataNascResult.success) {
    console.log(dataNascResult.error); // Notifica o erro na `view`
}

const buildResult = builder.build();
if (buildResult.success) {
    const paciente = buildResult.paciente;
    console.log("Paciente criado com sucesso:", paciente);
} else {
    console.log(buildResult.error); // Notifica o erro na `view`
}


import { CadastroPacientes } from './views/CadastroPacientes.js';

new CadastroPacientes().show();
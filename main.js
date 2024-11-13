import {Paciente} from './models/Paciente.js'
import { Agenda } from './controllers/Agenda.js'
import { Menu } from './views/Menu.js';

import promptSync from 'prompt-sync';
import { CadastroPacientes } from './views/CadastroPacientes.js';
import { PacienteController } from './controllers/PacienteController.js';
import { ConsultaController } from './controllers/ConsultaController.js';
const prompt = promptSync({ sigint: true });

const consulta_controller = new ConsultaController();
const pacientes_controller = new PacienteController();
// const cadastro = new CadastroPacientes(pacientes_controller, consulta_controller);

// cadastro.opcaoCadastrarNovoPaciente();
// cadastro.opcaoCadastrarNovoPaciente();
// cadastro.opcaoCadastrarNovoPaciente();

// consulta_controller.iniciarNovaConsulta();
// console.log(consulta_controller.setCpf('19086839703', pacientes_controller));
// console.log(consulta_controller.setDataConsulta("13/11/2024"));
// console.log(consulta_controller.setHoraInicial("1800"));
// console.log(consulta_controller.setHoraFinal("1830"));
// console.log(consulta_controller.addConsulta());

// console.log(pacientes_controller.getPacientesOrdenadosPorCpf(consulta_controller))
// console.log(pacientes_controller.getPacientesOrdenadosPorNome(consulta_controller))

const Telas = { "Menu":               new Menu(),
                "CadastroPacientes":  new CadastroPacientes(pacientes_controller, consulta_controller),
                "Fim":                false
            };

var tela_atual = Telas.Menu;

while(tela_atual){
    let proxima_tela= tela_atual.main()
    tela_atual = Telas[proxima_tela];
}
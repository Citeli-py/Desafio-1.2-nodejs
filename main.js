import {Paciente} from './Paciente.js'
import { Agenda } from './Agenda.js'
import { Consulta } from './Consulta.js'



var agenda = new Agenda();

// agenda.addPaciente();
agenda.addPaciente();

agenda.addConsulta();
agenda.addConsulta();

console.log(agenda.consultas.get("16262362754")[0].sobreposta(agenda.consultas.get("16262362754")[1]));
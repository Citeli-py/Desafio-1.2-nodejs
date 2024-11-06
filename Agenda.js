import { Consulta } from "./Consulta.js";
import { Paciente } from "./Paciente.js"
import promptSync from 'prompt-sync';
const prompt = promptSync({ sigint: true });


export class Agenda{
    pacientes;
    consultas;

    constructor(){
        this.pacientes = new Map(); // Estou usando um hasmap para agilizar a procura por pacientes que será recorrente
        this.consultas = new Map();
    }

    removePaciente(cpf){
        if(this.pacientes.has(cpf))
            throw Error("Erro: paciente não cadastrado")
        
        // Verificar se tem uma consulta

        // Excluir agendamentos passados

    }

    addPaciente(){

        let paciente = new Paciente();

        const capturarEntrada = (mensagem, propriedade) => {
            let valido = false;
            while (!valido) {
                try {
                    paciente[propriedade] = prompt(mensagem);

                    if (propriedade === 'cpf' && this.pacientes.has(paciente.cpf)) {
                        throw new Error("Erro: CPF já cadastrado!");
                    }
                    valido = true;
                } catch (erro) {
                    console.log(erro.message);
                }
            }
        };
        
        
        capturarEntrada("CPF: ", "cpf");
        capturarEntrada("Nome: ", "nome");
        capturarEntrada("Data de Nascimento: ", "data_nasc");

        // Adiciona o paciente e confirma o cadastro
        this.pacientes.set(paciente.cpf, paciente);
        console.log("Paciente cadastrado com sucesso!");
    }

    addConsulta(){
        
        let cpf_paciente;
        while(1){
            cpf_paciente = prompt("CPF: ");
            if(this.pacientes.has(cpf_paciente))
                break;

            console.log("Erro: paciente não cadastrado");
        }

        const consulta = new Consulta(cpf_paciente);

        const capturarEntrada = (mensagem, propriedade) => {
            let valido = false;
            while (!valido) {
                try {
                    consulta[propriedade] = prompt(mensagem);
                    valido = true;
                } catch (erro) {
                    console.log(erro.message);
                }
            }
        };

        capturarEntrada("Data da consulta: ", "data_consulta");
        capturarEntrada("Hora inicial: ", "hora_inicial");
        capturarEntrada("Hora final: ", "hora_final");

        if (!this.consultas.has(cpf_paciente)) {
            this.consultas.set(cpf_paciente, []);
        }
        this.consultas.get(cpf_paciente).push(consulta);
        
    }

};
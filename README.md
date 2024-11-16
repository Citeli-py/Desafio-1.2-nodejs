# Desafio 1.2 IUUUL - Consultório Odontológico

Este projeto foi desenvolvido como parte de um desafio de residência. Ele implementa um sistema de gerenciamento para um consultório odontológico, permitindo o controle de pacientes e consultas. O sistema foi estruturado com base em boas práticas de desenvolvimento de software, utilizando os padrões de projeto **MVC (Model-View-Controller)** e **Builder**, além de seguir uma organização clara de arquivos para facilitar a manutenção e a escalabilidade do código.

---

## 🔧 Funcionalidades

1. **Gerenciamento de Pacientes:**
   - Cadastro de pacientes com validação de CPF.
   - Listagem de pacientes cadastrados.

2. **Gerenciamento de Consultas:**
   - Agendamento de consultas, com validação de horário e sobreposição.
   - Cancelamento de consultas (respeitando as regras de datas futuras).
   - Listagem da agenda, com opções para exibição completa ou por período.

3. **Interface Simples e Intuitiva:**
   - Sistema interativo com menus claros para as operações.
   - Mensagens informativas em caso de erros ou operações inválidas.

---

## 🛠️ Estrutura do Projeto

A estrutura do projeto foi organizada para facilitar a separação de responsabilidades e a aplicação dos padrões de projeto mencionados. 

```
├── controllers
│   ├── PacienteController.js
│   ├── ConsultaController.js
├── models
│   ├── Paciente.js
|   ├── PacienteBuilder.js
│   ├── Consulta.js
|   ├── ConsultaBuilder.js
├── views
│   ├── View.js
│   ├── Agendamento.js
|   ├── CadastroPacientes.js
│   ├── Menu.js
├── utils
│   ├── Error.js
├── test
│   ├── entradas.txt
|   ├── run_test.sh
|   ├── teste.py
├── main.js
```

### 📂 Diretórios

- **`controllers/`**: Contém as classes responsáveis por gerenciar a lógica de negócios, como `PacienteController` e `ConsultaController`.
- **`models/`**: Representa os dados da aplicação, como `Paciente` e `Consulta`, e seus respectivos Builders.
- **`views/`**: Gerencia a interação com o usuário, exibindo menus e capturando entradas.
- **`utils/`**: Funções auxiliares e definições de erros padronizados.
- **`test/`**: Scripts para testes automatizados, como o programa em Python para popular e testar funcionalidades do sistema.

---

## 📐 Padrões de Projeto

### **MVC (Model-View-Controller)**
O projeto foi desenvolvido seguindo o padrão MVC, que separa claramente as responsabilidades:

- **Model**: Representa os dados e a lógica de negócio, como as classes `Paciente` e `Consulta`.
- **View**: Gerencia a interface do usuário, exibindo menus e capturando entradas.
- **Controller**: Atua como intermediário entre o Model e a View, implementando a lógica de controle (e.g., validações e coordenação das operações).

### **Builder**
O padrão Builder foi aplicado para simplificar a criação de objetos complexos e permitir que uma instância só possa existir se ele tiver todos os atributos necessários. Por exemplo:

- A classe `ConsultaController` utiliza o `ConsultaBuilder` para gerenciar a criação de novas instâncias de consultas, garantindo que todos os atributos obrigatórios sejam definidos antes de concluir o agendamento.

---

## 🧪 Testes com Python

Para auxiliar no desenvolvimento e validação do sistema, foi criado um programa em Python que:

- Popula os Maps dos controladores com pacientes e consultas fictícios.
- Realiza testes automatizados para verificar o comportamento das funcionalidades principais (e.g., agendamento, cancelamento, listagem).

O programa é uma ferramenta complementar que facilita o processo de testes e validação do sistema.

---

## 🚀 Como Executar

1. **Clonar o Repositório:**
   ```bash
   git clone https://github.com/SeuUsuario/consultorio-odontologico.git
   cd consultorio-odontologico
   ```

2. **Instalar Dependências:**
   Certifique-se de que o Node.js está instalado, então instale as dependências:
   ```bash
   npm install
   ```

3. **Executar o Programa:**
   ```bash
   node main.js
   ```

4. **Executar os Testes em Python:**
   Certifique-se de ter o Python instalado, depois execute:
   ```bash
   pip install pyautogui
   ./test/run_test.sh
   ```

---

## 🛡️ Considerações Finais

Este projeto demonstra a aplicação de conceitos fundamentais de engenharia de software, incluindo a utilização de padrões de projeto e boas práticas de organização. O sistema é extensível, modular e fácil de manter, representando um ponto de partida sólido para aplicações mais complexas no futuro.

Contribuições, sugestões ou dúvidas são bem-vindas!
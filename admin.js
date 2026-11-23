const formulario = document.getElementById("formulario-usuario");
const campoNome = document.getElementById("nome-usuario");
const campoEmail = document.getElementById("email-usuario");
const campoPesquisa = document.getElementById("pesquisa-usuario");
const listaUsuarios = document.getElementById("lista-usuarios");
const mensagemLista = document.getElementById("mensagem-lista");
const botaoExcluirTodos = document.getElementById("excluir-todos");

const chaveProximoUsuario = "sintaxe-labs-proximo-usuario";
const prefixoUsuario = "sintaxe-labs-usuario-";

/* 
    É importante mencionar que a atividade "Atividade prática com JavaScript – Criação de lista de tarefas" que foi realizada em casa e 
    que foi continuada em sala de aula (Ao realizarmos a adição do registro de datas) serviu como base para a aplicação de alguns conceitos 
    importantes que estão presentes neste arquivo.
*/

function cadastrarUsuario(evento) {
    evento.preventDefault();

    const nome = campoNome.value.trim();
    const email = campoEmail.value;

    if (nome === "") {
        alert("Informe o nome do usuário.");
        return;
    }

    const numero = Number(localStorage.getItem(chaveProximoUsuario));
    const chave = prefixoUsuario + numero;

    const dataAtual = new Date();

    const dia = dataAtual.getDate();
    const mes = dataAtual.getMonth() + 1;
    const ano = dataAtual.getFullYear();

    const dataFormatada = dia + "/" + mes + "/" + ano;

    localStorage.setItem(chave + "-nome", nome);
    localStorage.setItem(chave + "-email", email);
    localStorage.setItem(chave + "-dataFormatada", dataFormatada);
    localStorage.setItem(chaveProximoUsuario, numero + 1);

    campoNome.value = "";
    campoEmail.value = "";
    campoPesquisa.value = "";
    mostrarUsuarios();
}

function mostrarUsuarios() {
    listaUsuarios.innerHTML = "";
    mensagemLista.textContent = "";

    const pesquisa = campoPesquisa.value.trim().toUpperCase();
    const proximoUsuario = Number(localStorage.getItem(chaveProximoUsuario));
    let cadastrados = 0;
    let encontrados = 0;

    for (let numero = 0; numero < proximoUsuario; numero++) {
        const chave = prefixoUsuario + numero;
        const nome = localStorage.getItem(chave + "-nome");

        if (nome === null) {
            continue;
        }

        cadastrados++;
        const email = localStorage.getItem(chave + "-email");

        if (nome.toUpperCase().includes(pesquisa) || email.toUpperCase().includes(pesquisa)) {
            const data = localStorage.getItem(chave + "-dataFormatada");
            const item = document.createElement("li");
            const texto = document.createTextNode(data + " – " + nome + " – " + email);
            const botaoExcluir = document.createElement("button");

            botaoExcluir.type = "button";
            botaoExcluir.className = "botao-trilha";
            botaoExcluir.textContent = "Excluir";
            botaoExcluir.setAttribute("aria-label", "Excluir cadastro de " + nome + " (" + email + ")");
            botaoExcluir.addEventListener("click", function () {
                excluirUsuario(chave);
                mostrarUsuarios();
            });

            item.appendChild(texto);
            item.appendChild(botaoExcluir);
            listaUsuarios.appendChild(item);
            encontrados++;
        }
    }

    if (cadastrados === 0) {
        mensagemLista.textContent = "Nenhum usuário cadastrado.";
    } else if (encontrados === 0) {
        mensagemLista.textContent = "Nenhum usuário encontrado.";
    }
}

function excluirUsuario(chave) {
    localStorage.removeItem(chave + "-nome");
    localStorage.removeItem(chave + "-email");
    localStorage.removeItem(chave + "-data");
}

function excluirTodosUsuarios() {
    const proximoUsuario = Number(localStorage.getItem(chaveProximoUsuario));

    for (let numero = 0; numero < proximoUsuario; numero++) {
        excluirUsuario(prefixoUsuario + numero);
    }

    localStorage.removeItem(chaveProximoUsuario);
    campoPesquisa.value = "";
    mostrarUsuarios();
}

formulario.addEventListener("submit", cadastrarUsuario);
campoPesquisa.addEventListener("input", mostrarUsuarios);
botaoExcluirTodos.addEventListener("click", excluirTodosUsuarios);

mostrarUsuarios();

const formulario = document.getElementById("formulario-usuario");
const campoNome = document.getElementById("nome-usuario");
const campoEmail = document.getElementById("email-usuario");
const campoPesquisa = document.getElementById("pesquisa-usuario");
const listaUsuarios = document.getElementById("lista-usuarios");
const mensagemLista = document.getElementById("mensagem-lista");
const botaoExcluirTodos = document.getElementById("excluir-todos");

const chaveUsuarios = "sintaxe-labs-usuarios";

/* 
    É importante mencionar que a atividade "Atividade prática com JavaScript – Criação de lista de tarefas" que foi realizada em casa e 
    que foi continuada em sala de aula (Ao realizarmos a adição do registro de datas) serviu como base para a aplicação de alguns conceitos 
    importantes que estão presentes neste arquivo.
*/

function lerCadastros() {
    const dados = localStorage.getItem(chaveUsuarios);

    if (dados === null) {
        return { usuarios: [], proximoId: 0 };
    }

    return JSON.parse(dados);
}

function salvarCadastros(cadastros) {
    localStorage.setItem(chaveUsuarios, JSON.stringify(cadastros));
}

function migrarCadastrosAntigos() {
    const chaveContadorAntigo = "sintaxe-labs-proximo-usuario";
    const totalAntigo = Number(localStorage.getItem(chaveContadorAntigo));

    if (totalAntigo > 0 && localStorage.getItem(chaveUsuarios) === null) {
        const cadastros = lerCadastros();

        for (let id = 0; id < totalAntigo; id++) {
            const chaveAntiga = "sintaxe-labs-usuario-" + id;
            const nome = localStorage.getItem(chaveAntiga + "-nome");
            const email = localStorage.getItem(chaveAntiga + "-email");

            if (nome !== null && email !== null) {
                const data = localStorage.getItem(chaveAntiga + "-dataFormatada");
                cadastros.usuarios.push({ id, nome, email, data });
            }
        }

        cadastros.proximoId = totalAntigo;
        salvarCadastros(cadastros);
    }

    for (let indice = localStorage.length - 1; indice >= 0; indice--) {
        const chave = localStorage.key(indice);

        if (/^sintaxe-labs-usuario-\d+-(nome|email|dataFormatada|data)$/.test(chave)) {
            localStorage.removeItem(chave);
        }
    }

    localStorage.removeItem(chaveContadorAntigo);
}

function cadastrarUsuario(evento) {
    evento.preventDefault();

    const nome = campoNome.value.trim();
    const email = campoEmail.value;

    if (nome === "") {
        alert("Informe o nome do usuário.");
        return;
    }

    const dataAtual = new Date();

    const dia = dataAtual.getDate();
    const mes = dataAtual.getMonth() + 1;
    const ano = dataAtual.getFullYear();

    const dataFormatada = dia + "/" + mes + "/" + ano;

    const cadastros = lerCadastros();
    cadastros.usuarios.push({ id: cadastros.proximoId, nome, email, data: dataFormatada });
    cadastros.proximoId++;
    salvarCadastros(cadastros);

    campoNome.value = "";
    campoEmail.value = "";
    campoPesquisa.value = "";
    mostrarUsuarios();
}

function mostrarUsuarios() {
    listaUsuarios.innerHTML = "";
    mensagemLista.textContent = "";

    const pesquisa = campoPesquisa.value.trim().toUpperCase();
    const usuarios = lerCadastros().usuarios;
    let encontrados = 0;

    for (const usuario of usuarios) {
        const nome = usuario.nome;
        const email = usuario.email;

        if (nome.toUpperCase().includes(pesquisa) || email.toUpperCase().includes(pesquisa)) {
            const data = usuario.data;
            const item = document.createElement("li");
            const texto = document.createTextNode(data + " – " + nome + " – " + email);
            const botaoExcluir = document.createElement("button");

            botaoExcluir.type = "button";
            botaoExcluir.className = "botao-trilha";
            botaoExcluir.textContent = "Excluir";
            botaoExcluir.setAttribute("aria-label", "Excluir cadastro de " + nome + " (" + email + ")");
            botaoExcluir.addEventListener("click", function () {
                excluirUsuario(usuario.id);
            });

            item.appendChild(texto);
            item.appendChild(botaoExcluir);
            listaUsuarios.appendChild(item);
            encontrados++;
        }
    }

    if (usuarios.length === 0) {
        mensagemLista.textContent = "Nenhum usuário cadastrado.";
    } else if (encontrados === 0) {
        mensagemLista.textContent = "Nenhum usuário encontrado.";
    }
}

function excluirUsuario(id) {
    const cadastros = lerCadastros();

    for (let indice = 0; indice < cadastros.usuarios.length; indice++) {
        if (cadastros.usuarios[indice].id === id) {
            cadastros.usuarios.splice(indice, 1);
            salvarCadastros(cadastros);
            break;
        }
    }

    mostrarUsuarios();
}

function excluirTodosUsuarios() {
    localStorage.removeItem(chaveUsuarios);
    campoPesquisa.value = "";
    mostrarUsuarios();
}

formulario.addEventListener("submit", cadastrarUsuario);
campoPesquisa.addEventListener("input", mostrarUsuarios);
botaoExcluirTodos.addEventListener("click", excluirTodosUsuarios);

migrarCadastrosAntigos();
mostrarUsuarios();

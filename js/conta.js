const formularioCadastro = document.getElementById("formulario-cadastro");
const formularioLogin = document.getElementById("formulario-login");
const campoEmail = document.getElementById("email");
const campoSenha = document.getElementById("senha");
const mensagemConta = document.getElementById("mensagem-conta");

function obterChaveConta() {
    const email = campoEmail.value.toLowerCase();
    return "sintaxe-labs-conta-" + email;
}

function cadastrarConta(evento) {
    evento.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const sobrenome = document.getElementById("sobrenome").value.trim();
    const confirmacao = document.getElementById("confirmacao-senha").value;
    const senha = campoSenha.value;

    if (nome === "" || sobrenome === "") {
        mensagemConta.textContent = "Preencha o nome e o sobrenome.";
        return;
    }

    if (senha !== confirmacao) {
        mensagemConta.textContent = "As senhas precisam ser iguais.";
        return;
    }

    const chaveConta = obterChaveConta();
    const chaveSenha = chaveConta + "-senha";

    try {
        if (localStorage.getItem(chaveSenha) !== null) {
            mensagemConta.textContent = "Este e-mail já foi cadastrado.";
            return;
        }

        localStorage.setItem(chaveConta + "-nome", nome + " " + sobrenome);
        localStorage.setItem(chaveSenha, senha);
    } catch {
        mensagemConta.textContent = "Não foi possível salvar o cadastro neste navegador.";
        return;
    }

    window.location.href = "login.html";
}

function entrarNaConta(evento) {
    evento.preventDefault();

    const chaveConta = obterChaveConta();

    try {
        const senhaCadastrada = localStorage.getItem(chaveConta + "-senha");

        if (campoSenha.value !== senhaCadastrada) {
            mensagemConta.textContent = "E-mail ou senha incorretos.";
            return;
        }
    } catch {
        mensagemConta.textContent = "Não foi possível ler o cadastro neste navegador.";
        return;
    }

    window.location.href = "../index.html";
}

if (formularioCadastro !== null) {
    formularioCadastro.addEventListener("submit", cadastrarConta);
}

if (formularioLogin !== null) {
    formularioLogin.addEventListener("submit", entrarNaConta);
}

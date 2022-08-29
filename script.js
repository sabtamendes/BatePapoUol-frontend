let nome;
let destinatario = "Todos";
let tipoMensagem = "message";


function enviarNome() {
    nome = document.querySelector('.inputValue').value;
    
   
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants',
        {
            name: nome
        });
    promise.then(iniciarChat);
    promise.catch(perguntarNomeNovamente);

}

//ARROW FUNCTION - FAZER
function iniciarChat(response) {
    const removerTela = document.querySelector('.entrada');
    if (response.data.status === 200) {
        removerTela.classList.remove('hidden');
        pegarDados();
    }
    removerTela.classList.add('hidden');
}

function perguntarNomeNovamente(erro) {
    const text = document.querySelector('.texto');
    // text.innerHTML = "";
    if (erro.response.status === 400) {
        text.innerHTML = `<div class="texto"><p>Digite um novo usuário, esse já está em uso! 😅</p></div>`
    }
}

function pegarDados() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(renderizarMensagem);
    listarParticipantes();
}

function renderizarMensagem(response) {
    const exibirMensagens = document.querySelector('.mensagens');

    exibirMensagens.innerHTML = "";
    for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].type === 'status') {
            exibirMensagens.innerHTML += `<li class="status">
            <span>(${response.data[i].time})</span> <strong>${response.data[i].from}</strong> ${response.data[i].text}
        </li>`
        }

        if (response.data[i].type === 'message') {
            exibirMensagens.innerHTML += ` <li class="publico">
            <span>(${response.data[i].time})</span> <strong>${response.data[i].from}</strong> para <strong>${response.data[i].to}</strong>: ${response.data[i].text} </div>
        </li>`
        }

        if (response.data[i].type === 'private_message' && (response.data.to === nome || response.data[i].from === nome)) {
            exibirMensagens.innerHTML += `
            <li class="reservadamente">
                <span>(${response.data[i].time})</span> <strong>${response.data[i].from}</strong> reservadamente para <strong>${response.data[i].to}</strong>: ${response.data[i].text}
            </li>`
        }

    }
    atualizarMensagens();
}

function atualizarMensagens() {
    const recarregarMensagens = document.querySelector(".mensagens li:last-child");
    recarregarMensagens.scrollIntoView();
}

function recarregarMensagens() {
    setInterval(pegarDados, 3000);
    setInterval(informarConexao, 5000, nome);
    setInterval(listarParticipantes, 10000);
}
recarregarMensagens();

function informarConexao() {
    if (nome !== undefined) {
        axios.post('https://mock-api.driven.com.br/api/v6/uol/status', { name: nome });
    }
}

// function perguntarNome() {
//     nome = prompt('Qual o seu lindo nome?');
//     const enviarNome = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants',
//         {
//             name: nome
//         });

//     enviarNome.then(pegarDados);
//     enviarNome.catch(perguntarNomeNovamente);
// }
// perguntarNome();

function listarParticipantes() {
    const pegarLista = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    pegarLista.then(renderizarParticipantes);
}


function escolherVisibilidade(mensagem, elemento) {
    const selecionar = document.querySelector('.visibilidades .check');

    if (selecionar !== null) {
        selecionar.classList.remove('ocultar');

    }

    elemento.classList.toggle('ocultar');

    tipoMensagem = mensagem;
}

function selecionarParticipante(destinatarioPrivado, element) {
    const selecionar = document.querySelector('.contatos .check');
    if (selecionar !== null) {
        selecionar.classList.remove('ocultar');
    }
    element.classList.toggle('ocultar');

    destinatario = destinatarioPrivado;
    document.querySelector('.mensagemPadrao').innerHTML = `Enviando para ${destinatario}`;
}

function renderizarParticipantes(response) {
    const usuarios = document.querySelector('.contatos');
    usuarios.innerHTML = "";

    usuarios.innerHTML = ` <li class="visibilidade-publico">
    <ion-icon name="people"></ion-icon><span>Todos</span>
    <ion-icon class="check" name="checkmark-outline">
</li>`

    for (let i = 0; i < response.data.length; i++) {
        usuarios.innerHTML += ` <li class="visibilidade-publico" onclick="selecionarParticipante('${response.data[i].name}', this)">
        <ion-icon name="person-circle"></ion-icon><span class="nome">${response.data[i].name}</span><ion-icon class="check" name="checkmark-outline">
        </ion-icon>
    </li>`

    }
}

document.addEventListener("keyup", function (evento) {
    if (evento.key === "Enter") {
        enviarMensagens();
    }
});

function enviarMensagemPrivada() {
    if (destinatario === 'private_mensagem' && tipoMensagem === 'message') {
        return true;
    }
    return false;
}
enviarMensagemPrivada();

function enviarMensagens() {
    let mensagem = document.querySelector('#input').value;

    const enviarNovaMensagem = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages',
        {
            from: nome,
            to: destinatario,
            text: mensagem,
            type: tipoMensagem
        });
    enviarNovaMensagem.then(pegarDados)
    document.querySelector("#input").value = "";
    destinatario = "Todos";
    document.querySelector('.mensagemPadrao').innerHTML = `Enviando para ${destinatario}`;
}

function recarregarPagina() {
    window.location.reload();
}

function mostrarNavbar() {
    const nav = document.querySelector('.navbar');
    const background = document.querySelector(".menu");
    nav.classList.toggle('hidden');
    background.classList.toggle('hidden');
}

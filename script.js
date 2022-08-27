let nome;
function enviarNome() {
    nome = document.querySelector('.inputValue').value;
    const removerTela = document.querySelector('.entrada');
    if (nome !== undefined) {
        removerTela.classList.remove('hidden');
    }
    removerTela.classList.add('hidden');
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants',
        {
            name: nome
        });
    promise.then(iniciarChat);
    promise.catch(perguntarNomeNovamente);

}

//ARROW FUNCTION - FAZER
function iniciarChat(response) {
    console.log(response)
    pegarDados();
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
            <span>(${response.data[i].time})</span> <strong>${response.data[i].from}</strong> <strong>${response.data[i].to}</strong>: ${response.data[i].text} </div>
        </li>`
        }

        if (response.data[i].type === 'private_message') {
            exibirMensagens.innerHTML += `
            <li class="reservadamente">
                <span>(${response.data[i].time})</span> <strong>${response.data[i].from}</strong> reservadamente para <strong>${response.data[i].to}</strong>: ${response.data[i].text}
                quer tc?
            </li>`
        }
        mensagemPrivada(response);
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

function perguntarNomeNovamente(erro) {
    const text = document.querySelector('.texto');
    if (erro.response.status === 400) {
        text.innerHTML = `<p>Digite um novo usuário, esse já está em uso!</p>`
    }
    recarregarPagina();
}

function enviarMensagens() {
    let mensagem = document.querySelector('#input').value;

    const enviarNovaMensagem = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages',
        {
            from: nome,
            to: "Todos", //"nome do destinatário (Todos se não for um específico)",
            text: mensagem,
            type: "message" // ou "private_message" para o bônus
        });
    enviarNovaMensagem.then(pegarDados)
    document.querySelector("#input").value = "";
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

function listarParticipantes() {
    const pegarLista = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    pegarLista.then(renderizarParticipantes)
}

function renderizarParticipantes(response) {
    const usuarios = document.querySelector('.post');
    usuarios.innerHTML = "";
    for (let i = 0; i < response.data.length; i++) {
        usuarios.innerHTML += ` <li>
       <span> <ion-icon name="person-circle-outline"></ion-icon> 
        ${response.data[i].name}</span>
    </li>`

    }
}

document.addEventListener("keyup", function (evento) {
    if (evento.key === "Enter") {
        enviarMensagens()
    }
});

//não está dando certo
function mensagemPrivada(response) {
    if (response.data.type === 'private_message' && response.data.from === nome && response.data.to === nome) {
        return true;

    }
    return false;
}

function check() {
    const selecionar = document.querySelector('.postDois  .checkmark');

    if (selecionar !== null) {
        selecionar.classList.add('ocultar');
        //selecionar.innerHTML = `<ion-icon name="checkmark-sharp"></ion-icon>`
    }
    const tag = document.querySelector('.postDois .checkmark')
    tag.classList.remove('ocultar');

    // console.log(tag)
}
const AXIOS_URL = "https://mock-api.driven.com.br/api/v6/uol/";

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

function iniciarChat(response) {
    //     const removerTela = document.querySelector('.entrada');
    //     if (response !== undefined) {
    //         removerTela.classList.remove('hidden');
    //     }
    //     removerTela.classList.add('hidden');
    console.log(response)
    pegarDados();
}






// enviarNome('Sabta');
// let nome;
// function enviarNome() {
//     nome = prompt('Qual o seu lindo nome?')

//     const promise = axios.post(`${AXIOS_URL}participants`, {
//         name: nome
//     });


//     promise.then(pegarDados);
//     // promise.catch(perguntarNomeNovamente);

// }

// enviarNome()

// function perguntarNomeNovamente(erro) {
//     if (erro.response.status === 400) {
//         alert("Digite outro nome, este já está em uso!");
//     }
// }



// /* ----------------------------------------------------------------------------------------------*/



// // pegarDados();











// function enviarMensagens() {

//     const input = document.querySelector('#input');

//     const mensagem = {
//         from: nome,
//         to: "Todos",
//         text: input.value,
//         type: "message" // ou "private_message" para o bônus
//     }
//     const enviar = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', mensagem);
//     enviar.then(pegarDados);
//     enviar.catch(recarregarMensagens)
//     console.log(enviar)
// }
// enviarMensagens();



function pegarDados() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(renderizarMensagem);

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
    }
    atualizarMensagens();
}

function atualizarMensagens() {
    const recarregarMensagens = document.querySelector(".mensagens li:last-child");
    recarregarMensagens.scrollIntoView();
}

function recarregarMensagens() {
    //setInterval(pegarDados, 3000);
    setInterval(informarConexao, 5000, nome);
    setInterval(listarParticipantes, 10000);
}
recarregarMensagens();

function informarConexao() {
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', { name: nome });

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
        recarregarPagina();
    }
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
    enviarNovaMensagem.then(iniciarChat)
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
    console.log(nav)
}

// function iniciarChat(response){
//     console.log(response)
// }


function listarParticipantes() {
    axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
}
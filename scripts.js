let todosQuizzes = [];
let quizzSelecionado = {};
const TEMPO2S = 2 * 1000;
let respostasCorretas = 0;
let respostasRespondidas = 0;

let userQuizz = {image: "", levels: [], questions: [], title: ""};
let tamPerguntas = 0;
let tamNiveis = 0;

buscarQuizzes();
function buscarQuizzes() {
    let promise = axios.get(
        'https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes'
    );
    promise.then(verPromise);
    promise.then(carregarQuizzes);
    //promise.catch(tratarFalha);
}

function carregarQuizzes(response) {
    todosQuizzes = response.data;
    console.log(todosQuizzes);
    renderizarQuizzes();
}

function renderizarQuizzes() {
    let quiz = document.querySelector('.quizzes');
    quiz.innerHTML = '';

    for (let i = 0; i < todosQuizzes.length; i++) {
        quiz.innerHTML += `
            <div class="quizz" onclick="escolherQuizz(this)">
                <img src="${todosQuizzes[i].image}" alt=""/>
                <p>${todosQuizzes[i].title}</p>
            </div>             
        `;
    }
}

function escolherQuizz(element) {
    let bolinha2 = document.querySelector('.conteiner').classList.add('hidden');
    let bolinha = document
        .querySelector('.quizz-page')
        .classList.remove('hidden');
    let quizzID = element.querySelector('p').innerHTML.trim();
    console.log(bolinha);
    console.log(bolinha2);
    console.log(element);
    console.log(quizzID);
    const index = todosQuizzes.findIndex(
        (element) => element.title === quizzID
    );
    console.log(index);
    quizzSelecionado = todosQuizzes[index];
    console.log(quizzSelecionado);
    renderizarQuizz();
}

function renderizarQuizz() {
    document.querySelector('.quizz-page').innerHTML = `
        <div class="quizz-topo">
            <div class="topo">
                <h2>${quizzSelecionado.title}</h2>
                <img src="${quizzSelecionado.image}" alt=""/>    
            </div>
        </div>
    `;
    let perguntas = quizzSelecionado.questions;

    console.log(perguntas.length);
    for (let i = 0; i < perguntas.length; i++) {
        console.log(perguntas[i].answers.length);
        console.log(i);
        document.querySelector('.quizz-page').innerHTML += `        
        <div class="quizz-perguntas">
            <div class="quizz-pergunta-titulo" style="background-color:${perguntas[i].color}">
                <h3 class="white">${perguntas[i].title}</h3>
            </div>
            <div class="quizz-respostas" id="pergunta${i}">               
                
            </div>        
        </div>  
        `;
        let sequenciaRespostas = [];
        let respostasEmbaralhadas = [];

        for (let j = 0; j < perguntas[i].answers.length; j++) {
            console.log(j);
            sequenciaRespostas.push(j);
            console.log(sequenciaRespostas);
        }

        shuffle(sequenciaRespostas);
        for (let k = 0; k < sequenciaRespostas.length; k++) {
            respostasEmbaralhadas.push(sequenciaRespostas[k]);
        }
        console.log(respostasEmbaralhadas);

        for (let k = 0; k < respostasEmbaralhadas.length; k++) {
            let id = `pergunta${i}`;
            let resposta = respostasEmbaralhadas[k];
            document.getElementById(id).innerHTML += `
                <div class="quizz-pergunta-resposta ${perguntas[i].answers[resposta].isCorrectAnswer}" onclick="escolherResposta(this)">
                    <div class="hidden opacidade"></div>
                    <img src="${perguntas[i].answers[resposta].image}" alt="">
                    <span class="quizz-resposta">${perguntas[i].answers[resposta].text}</span>
                </div>
            `;
        }
    }
}
function escolherResposta(elemento) {
    let perguntaRespondida = elemento.parentNode;

    if (perguntaRespondida.classList.contains('respondido') === false) {
        let valor = elemento.classList.contains('true');

        if (valor === true) {
            console.log('resposta correta');
            respostasRespondidas++;
            respostasCorretas++;
        } else {
            console.log('resposta errada');
            respostasRespondidas++;
        }
        console.log(valor);

        perguntaRespondida.classList.add('respondido');
        let perguntaContaner = perguntaRespondida.parentNode;
        perguntaContaner.classList.add('respondida');
        let todasRespostas = perguntaRespondida.querySelectorAll(
            '.quizz-pergunta-resposta'
        );
        for (let i = 0; i < todasRespostas.length; i++) {
            let transparente = todasRespostas[i];
            if (
                transparente.classList.contains('false') &&
                transparente !== elemento
            ) {
                transparente.firstElementChild.classList.remove('hidden');
            } else if (
                transparente.classList.contains('true') &&
                transparente !== elemento
            ) {
                transparente.firstElementChild.classList.remove('hidden');
            }
        }
        console.log(todasRespostas.length);
        scrollParaElemento(perguntaContaner.nextElementSibling);
        console.log(respostasCorretas);
        console.log(respostasRespondidas);
        console.log(respostasCorretas / respostasRespondidas);
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function scrollParaElemento(elemento) {
    setTimeout(() => {
        elemento.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }, TEMPO2S);
}


// ------------- tela 3 ----------------
function verPromise(p){
    console.log(p);
}

function criarQuizz(){
    document.querySelector(".conteiner").classList.add("hidden");
    document.querySelector(".quizz-creator").classList.remove("hidden");
}

function getInputFocus(focus){
    //focus.removeAttribute("value");
    focus.value = "";
}

function getInputBlur(blur){
    if(blur.getAttribute("name") === "Título do seu quizz"){
        //blur.setAttribute("value", "Título do seu quizz");
        userQuizz.title = blur.value;
        if(blur.value === ""){
            blur.value = "Título do seu quizz";
        }
    }else if(blur.getAttribute("name") === "Url da imagem do seu quizz"){
        //blur.setAttribute("value", "Url da imagem do seu quizz");
        userQuizz.image = blur.value;
        if(blur.value === ""){
            blur.value = "Url da imagem do seu quizz";
        }
    }else if(blur.getAttribute("name") === "Quantidade de perguntas do quizz"){
        //blur.setAttribute("value", "Quantidade de perguntas do quizz");
        if(isNaN(Number(blur.value))){
            alert("Cara, digite um número");
        }else{
            tamPerguntas = Number(blur.value);
        }
        if(blur.value === ""){
            blur.value = "Quantidade de perguntas do quizz";
        }
    }else if(blur.getAttribute("name") === "Quantidade de níveis do quizz"){
        //blur.setAttribute("value", "Quantidade de níveis do quizz");
        if(isNaN(Number(blur.value))){
            alert("Cara, digite um número");
        }else{
            tamNiveis = Number(blur.value);
        }
        if(blur.value === ""){
            blur.value = "Quantidade de níveis do quizz";
        }
    }
}

function validacaoBasico(){
    if(userQuizz.title.length < 20 || userQuizz.title.length > 65){
        return alert("título inválido");
    }else if(!userQuizz.image.startsWith("https://") && !userQuizz.image.startsWith("http://")){
        return alert("imagem inválida");
    }else if(tamPerguntas < 3){
        return alert("Quantidade de perguntas insuficiente");
    }else if(tamNiveis < 2){
        return alert("Quantidade de níveis insuficiente");
    }else{
        document.querySelector(".creator-page.p1").classList.add("hidden");
        document.querySelector(".creator-page.p2").classList.remove("hidden");
    }
}
// -------------------------------------

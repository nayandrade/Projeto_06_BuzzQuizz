let todosQuizzes = [];
let quizzSelecionado = {};

buscarQuizzes();
function buscarQuizzes() {
    let promise = axios.get(
        'https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes'
    );
    promise.then(carregarQuizzes);
    promise.catch(tratarFalha);
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
        let respostasEmbaralhadas = []        

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
            let resposta = respostasEmbaralhadas[k]
            document.getElementById(id).innerHTML += `
                <div class="quizz-pergunta-resposta" onclick="escolherResposta(this)">
                    <img src="${perguntas[i].answers[resposta].image}" alt="">
                    <span class="quizz-resposta">${perguntas[i].answers[resposta].text}</span>
                </div>
            `;
        }       
    }
}

/* function escolherResposta(elemento) {

}*/

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}



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
    renderizarQuizz()
}

function renderizarQuizz() {
    document.querySelector('.quizz-page').innerHTML = ""
    console.log(quizzSelecionado.questions)
    // for (let i = 0; i = quizzSelecionado.questions.length; i++) {
    //     console.log(i)                
    // }
    document.querySelector('.quizz-page').innerHTML += `
        <div class="quizz-topo">
            <div class="topo">
                <h2>${quizzSelecionado.title}</h2>>    
            </div>
        </div>
        <div class="quizz-perguntas">
            <div class="quizz-pergunta-titulo">
                <h3 class="white">${quizzSelecionado.questions[0].title}</h3>
            </div>
            <div class="quizz-respostas">
                <div class="quizz-pergunta-resposta">
                    <img src="${quizzSelecionado.questions[0].answers[0].image}" alt="">
                    <span class="quizz-resposta">${quizzSelecionado.questions[0].answers[0].text}</span>
                </div>
                <div class="quizz-pergunta-resposta">
                    <img src="${quizzSelecionado.questions[0].answers[1].image}" alt="">
                    <span class="quizz-resposta">${quizzSelecionado.questions[0].answers[1].text}</span>
                </div>
                <div class="quizz-pergunta-resposta">
                    <img src="${quizzSelecionado.questions[0].answers[2].image}" alt="">
                    <span class="quizz-resposta">${quizzSelecionado.questions[0].answers[2].text}</span>
                </div>
                <div class="quizz-pergunta-resposta">
                    <img src="${quizzSelecionado.questions[0].answers[3].image}" alt="">
                    <span class="quizz-resposta">${quizzSelecionado.questions[0].answers[3].text}</span>
                </div>
            </div>        
        </div>
    
    
    `;
}

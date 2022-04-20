let todosQuizzes = [];
buscarQuizzes()
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
            <div class="quizz">
                <img src="${todosQuizzes[i].image}" alt="Imagem Cumpade"/>
                <p>${todosQuizzes[i].title}</p>
            </div>      
        
        `;
    }
}

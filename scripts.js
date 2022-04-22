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
    focus.value = "";
}

function getInputBlur(blur){
    if(blur.getAttribute("name") === "Título do seu quizz"){
        userQuizz.title = blur.value;
        if(blur.value === ""){
            blur.value = "Título do seu quizz";
        }
    }else if(blur.getAttribute("name") === "Url da imagem do seu quizz"){
        userQuizz.image = blur.value;
        if(blur.value === ""){
            blur.value = "Url da imagem do seu quizz";
        }
    }else if(blur.getAttribute("name") === "Quantidade de perguntas do quizz"){
        if(isNaN(Number(blur.value))){
            alert("Cara, digite um número");
        }else{
            tamPerguntas = Number(blur.value);
        }
        if(blur.value === ""){
            blur.value = "Quantidade de perguntas do quizz";
        }
    }else if(blur.getAttribute("name") === "Quantidade de níveis do quizz"){
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
        criarPerquntas(tamPerguntas);
        const arrPerguntas = {title: "", color: "", answers: [{text: "", image: ""},{text: "", image: ""},{text: "", image: ""},{text: "", image: ""}]};
        const arrNiveis = {title: "", image: "", text: "", minValue: -1};
        for(let i=0; i<tamPerguntas; i++){
            userQuizz.questions[i] = arrPerguntas;
        }
        for(let j=0; j<tamNiveis; j++){
            userQuizz.levels[j] = arrNiveis;
        }
    }
}

function criarPerquntas(pergunta){
    const page32 = document.querySelector(".creator-page.p2");
    for(let i=1; i<pergunta; i++){
        page32.innerHTML += `   <div class="fechado p">
                                    <h1>Pergunta ${i+1}</h1>
                                    <ion-icon name="create-outline"></ion-icon>
                                </div>
                                <div class="pergunta hidden">
                                    <h1>Pergunta ${i+1}</h1>
                                    <input onfocus="getInputFocus(this)" onblur="getInputBlurPerg(this)" type="text" name="Texto da pergunta ${i}" value="Texto da pergunta"/>
                                    <input onfocus="getInputFocus(this)" onblur="getInputBlurPerg(this)" type="text" name="Cor de fundo da pergunta ${i}" value="Cor de fundo da pergunta"/>
                                    <h1>Resposta correta</h1>
                                    <input onfocus="getInputFocus(this)" onblur="getInputBlurPerg(this)" type="text" name="Resposta correta ${i}" value="Resposta correta"/>
                                    <input onfocus="getInputFocus(this)" onblur="getInputBlurPerg(this)" type="text" name="URL da imagem ${i}" value="URL da imagem"/>
                                    <h1>Respostas incorretas</h1>
                                    <input onfocus="getInputFocus(this)" onblur="getInputBlurPerg(this)" type="text" name="Resposta incorreta 1 ${i}" value="Resposta incorreta 1"/>
                                    <input onfocus="getInputFocus(this)" onblur="getInputBlurPerg(this)" type="text" name="URL da imagem 1 ${i}" value="URL da imagem 1"/>
                                    <h1 class="hidden"></h1>
                                    <input onfocus="getInputFocus(this)" onblur="getInputBlurPerg(this)" type="text" name="Resposta incorreta 2 ${i}" value="Resposta incorreta 2"/>
                                    <input onfocus="getInputFocus(this)" onblur="getInputBlurPerg(this)" type="text" name="URL da imagem 2 ${i}" value="URL da imagem 2"/>
                                    <h1 class="hidden"></h1>
                                    <input onfocus="getInputFocus(this)" onblur="getInputBlurPerg(this)" type="text" name="Resposta incorreta 3 ${i}" value="Resposta incorreta 3"/>
                                    <input onfocus="getInputFocus(this)" onblur="getInputBlurPerg(this)" type="text" name="URL da imagem 3 ${i}" value="URL da imagem 3"/>
                                </div>
        `;
    }
    page32.innerHTML += `<button onclick="validacaoPerguntas()" class="botao-prosseguir">Prosseguir pra criar níveis</button>`;
}

function getInputBlurPerg(blur){
    for(let i=0; i<userQuizz.questions.length; i++){
        if(blur.getAttribute("name") === `Texto da pergunta ${i}`){
            userQuizz.questions[i]= {title: blur.value, color: userQuizz.questions[i].color, answers: userQuizz.questions[i].answers};
            if(blur.value === ""){
                blur.value = "Texto da pergunta";
            }
        }else if(blur.getAttribute("name") === `Cor de fundo da pergunta ${i}`){
            userQuizz.questions[i]= {title: userQuizz.questions[i].title, color: blur.value, answers: userQuizz.questions[i].answers};
            if(blur.value === ""){
                blur.value = "Cor de fundo da pergunta";
            }
        }else if(blur.getAttribute("name") === `Resposta correta ${i}`){
            userQuizz.questions[i].answers[0]= {text: blur.value, image: userQuizz.questions[i].answers[0].image, isCorrectAnswer: true};
            if(blur.value === ""){
                blur.value = "Resposta correta";
            }
        }else if(blur.getAttribute("name") === `URL da imagem ${i}`){
            userQuizz.questions[i].answers[0]= {text: userQuizz.questions[i].answers[0].text, image: blur.value, isCorrectAnswer: true};
            if(blur.value === ""){
                blur.value = "URL da imagem";
            }
        }else if(blur.getAttribute("name") === `Resposta incorreta 1 ${i}`){
            userQuizz.questions[i].answers[1]= {text: blur.value, image: userQuizz.questions[i].answers[1].image, isCorrectAnswer: false};
            if(blur.value === ""){
                blur.value = "Resposta incorreta 1";
            }
        }else if(blur.getAttribute("name") === `URL da imagem 1 ${i}`){
            userQuizz.questions[i].answers[1]= {text: userQuizz.questions[i].answers[1].text, image: blur.value, isCorrectAnswer: false};
            if(blur.value === ""){
                blur.value = "URL da imagem 1";
            }
        }else if(blur.getAttribute("name") === `Resposta incorreta 2 ${i}`){
            userQuizz.questions[i].answers[2]= {text: blur.value, image: userQuizz.questions[i].answers[2].image, isCorrectAnswer: false};
            if(blur.value === ""){
                blur.value = "Resposta incorreta 2";
            }
        }else if(blur.getAttribute("name") === `URL da imagem 2 ${i}`){
            userQuizz.questions[i].answers[2]= {text: userQuizz.questions[i].answers[2].text, image: blur.value, isCorrectAnswer: false};
            if(blur.value === ""){
                blur.value = "URL da imagem 2";
            }
        }else if(blur.getAttribute("name") === `Resposta incorreta 3 ${i}`){
            userQuizz.questions[i].answers[3]= {text: blur.value, image: userQuizz.questions[i].answers[3].image, isCorrectAnswer: false};
            if(blur.value === ""){
                blur.value = "Resposta incorreta 3";
            }
        }else if(blur.getAttribute("name") === `URL da imagem 3 ${i}`){
            userQuizz.questions[i].answers[3]= {text: userQuizz.questions[i].answers[3].text, image: blur.value, isCorrectAnswer: false};
            if(blur.value === ""){
                blur.value = "URL da imagem 3";
            }
        }
    }
}

function validacaoPerguntas(){
    let respostaErrada = -1;

    for(let k=0; k<userQuizz.questions.length; k++){
        if(userQuizz.questions[k].title.length < 20){
            return alert("Nome da pergunta inválido");
        }else if(validarNaoCor(userQuizz.questions[k].color)){
            return alert("Cor inválida");
        }else if(userQuizz.questions[k].answers[0].text === ""){
            return alert("Crie uma resposta correta");
        }else if(!userQuizz.questions[k].answers[0].image.startsWith("https://") && !userQuizz.questions[k].answers[0].image.startsWith("http://")){
            return alert("Imagem da resposta correta inválida");
        }

        respostaErrada = validarRespostaIncorreta(userQuizz.questions[k].answers);
        if(respostaErrada === 0){
            return alert("Insira uma resposta incorreta para imagem");
        }else if(respostaErrada === 1){
            return alert("Insira no mínimo uma resposta incorreta");
        }else if(respostaErrada === 2){
            return alert("Insira uma imagem para resposta");
        }else if(respostaErrada === 3){
            return alert("Insira no mínimo uma imagem");
        }else if(respostaErrada === 4){
            return alert("Imagem incorreta é inválida");
        }
    }

    //document.querySelector(".creator-page.p2").classList.add("hidden");
    //document.querySelector(".creator-page.p3").classList.remove("hidden");
}

function validarRespostaIncorreta(respostaIncorreta){
    let contText = 0;
    let contImg = 0;

    for(let r=1; r<4; r++){
        if(respostaIncorreta[r].text === ""){
            if(respostaIncorreta[r].image != ""){
                return 0;
            }
            contText++;
            if(contText > 2){
                return 1;
            }
        }
        if(respostaIncorreta[r].image === ""){
            if(respostaIncorreta[r].text != ""){
                return 2;
            }
            contImg++;
            if(contImg > 2){
                return 3;
            }
        }else if(!respostaIncorreta[r].image.startsWith("https://") && !respostaIncorreta[r].image.startsWith("http://")){
            return 4;
        }
    }
    return 5;
}

function validarNaoCor(color){
    color.toLowerCase();
    let caracteres = "ghijklmnopqrstuvwxyz*/?:.,;$%@!&()_-+=";
    for(let c=0; c<caracteres.length; c++){
        if(color.indexOf(caracteres[c]) != -1){
            return true;
        }
    }
    if(color.length < 7){
        return true;
    }else if(!color.startsWith("#")){
        return true;
    }
    return false;
}
// -------------------------------------

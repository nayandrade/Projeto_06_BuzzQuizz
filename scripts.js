let todosQuizzes = [];
let quizzSelecionado = {};
let meusQuizzes = [];
let quizzID;
const TEMPO2S = 2 * 1000;
const TEMPO_MEIO_S = 500;
let respostasCorretas = 0;
let respostasRespondidas = 0;
let nivel = 0;

let userQuizz = { image: '', levels: [], questions: [], title: '' };
let tamPerguntas = 0;
let tamNiveis = 0;

buscarQuizzes();
function buscarQuizzes() {
    let promise = axios.get(
        'https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes'
    );
    promise.then(verPromise);
    promise.then(carregarQuizzes);
    promise.then(temQuizz);
    //promise.catch(tratarFalha);
}

function carregarQuizzes(response) {
    todosQuizzes = response.data;
    console.log(todosQuizzes);
    renderizarQuizzes();
}

//temQuizz();

function renderizarQuizzes() {
    let quiz = document.querySelector('.quizzes');
    quiz.innerHTML = '';

    for (let i = 0; i < todosQuizzes.length; i++) {
        quiz.innerHTML += `
            <div class="quizz" onclick="escolherQuizz(this)">
                <img src="${todosQuizzes[i].image}" alt=""/>
                <p>${todosQuizzes[i].title}</p>
                <span class="hidden">${todosQuizzes[i].id}</span>
            </div>             
        `;
    }
}

function escolherQuizz(element) {
    document.querySelector('.conteiner').classList.add('hidden');
    document.querySelector('.quizz-page').classList.remove('hidden');
    quizzID = element.querySelector('span').innerHTML.trim();
    console.log(quizzID);
    console.log(typeof quizzID);
    console.log(element);
    let index = todosQuizzes.findIndex((x) => x.id === Number(quizzID));
    console.log(index);
    console.log(element.id);
    console.log(element.title);
    console.log(element.image);
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
                    <h3 class="white box">${perguntas[i].title}</h3>
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

    scrollParaTopo();
}
function escolherResposta(elemento) {
    let perguntas = quizzSelecionado.questions;
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

        if (respostasRespondidas === perguntas.length) {
            console.log('acabou o quizz');
            console.log(`respostasCorretas ${respostasCorretas}`);
            console.log(`respostasRespondidas ${respostasRespondidas}`);
            nivel = (respostasCorretas / respostasRespondidas) * 100;
            console.log(`nivel ${nivel}`);
            document.querySelector('.quizz-page').innerHTML += `
            <div class="quizz-finalizar"></div>
            `;
            finalizarQuizz();
        } else {
            console.log(todasRespostas);
            console.log(todasRespostas.length);
            scrollParaElemento(perguntaContaner.nextElementSibling);
        }
    }
}

function finalizarQuizz() {
    let niveis = quizzSelecionado.levels;
    let nivelFinal = 0;
    console.log(nivelFinal);

    // while (Math.round(nivel) < niveis[i].minValue)

    for (let i = 0; i < niveis.length; i++) {
        if (
            niveis[i].minValue <= Math.round(nivel) &&
            niveis[i].minValue >= nivelFinal
        ) {
            nivelFinal = niveis[i].minValue;
        }
    }
    console.log(nivelFinal);

    for (let j = 0; j < niveis.length; j++) {
        if (niveis[j].minValue === nivelFinal) {
            document.querySelector('.quizz-finalizar').innerHTML = `  
                <div class="quizz-finalizar-titulo">
                    <h3 class="white">${niveis[j].title}</h3>
                </div>
                <div class="quizz-nivel">                         
                    <img src="${niveis[j].image}" alt="">
                    <p class="">${niveis[j].text}</p>                                  
                </div>                    
                `;

            document.querySelector('.quizz-page').innerHTML += `
                <div class="quizz-reiniciar"onclick="reiniciarQuizz()">Reiniciar Quizz</div>   
                <div class="quizz-voltar" onclick="voltarParaHome()">Voltar pra home</div> 
            `;
            break;
        }
    }
    let quizzPage = document.querySelector('.quizz-page');
    scrollParaElemento(quizzPage.lastElementChild);
    console.log(nivelFinal);
}

function reiniciarQuizz() {
    console.log('reiniciar Quizz');
    //let elemento = document.querySelector('header')
    respostasRespondidas = 0;
    respostasCorretas = 0;
    renderizarQuizz();
}

function voltarParaHome() {
    window.location.reload();
    console.log('Voltar para Home');
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function scrollParaElemento(elemento) {
    setTimeout(() => {
        elemento.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, TEMPO2S);
}

function scrollParaTopo() {
    elemento = document.querySelector('.quizz-topo');
    console.log(elemento);

    setTimeout(() => {
        elemento.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, TEMPO_MEIO_S);
}

// ------------- tela 3 ----------------
function verPromise(p) {
    console.log(p);
}

function criarQuizz() {
    document.querySelector('.conteiner').classList.add('hidden');
    document.querySelector('.quizz-creator').classList.remove('hidden');
}

function getInputBlur(blur) {
    if (blur.getAttribute('name') === 'Título do seu quizz') {
        userQuizz.title = blur.value;
    } else if (blur.getAttribute('name') === 'Url da imagem do seu quizz') {
        userQuizz.image = blur.value;
    } else if (
        blur.getAttribute('name') === 'Quantidade de perguntas do quizz'
    ) {
        if (isNaN(Number(blur.value))) {
            alert('Digite um número');
        } else {
            tamPerguntas = Number(blur.value);
        }
    } else if (blur.getAttribute('name') === 'Quantidade de níveis do quizz') {
        if (isNaN(Number(blur.value))) {
            alert('Digite um número');
        } else {
            tamNiveis = Number(blur.value);
        }
    }
}

function validacaoBasico() {
    if (userQuizz.title.length < 20 || userQuizz.title.length > 65) {
        return alert('título inválido');
    } else if (tamPerguntas < 3) {
        return alert('Quantidade de perguntas insuficiente');
    } else if (tamNiveis < 2) {
        return alert('Quantidade de níveis insuficiente');
    } else {
        validaimg(userQuizz.image);
    }
}

function validaimg(file) {
    let img = new Image();
    img.src = file;

    document.querySelector('.creator-page.p1 button').innerHTML = 'Aguarde...';
    document
        .querySelector('.creator-page.p1 button')
        .removeAttribute('onclick');

    img.onload = function () {
        document.querySelector('.creator-page.p1').classList.add('hidden');
        document.querySelector('.creator-page.p2').classList.remove('hidden');
        document.querySelector('.creator-page.p1 button').innerHTML =
            'Prosseguir pra criar perguntas';
        document
            .querySelector('.creator-page.p1 button')
            .setAttribute('onclick', 'validacaoBasico()');
        criarPerquntas(tamPerguntas);
        criarNiveis(tamNiveis);
        const arrPerguntas = {
            title: '',
            color: '',
            answers: [
                { text: '', image: '', isCorrectAnswer: true },
                { text: '', image: '', isCorrectAnswer: false },
                { text: '', image: '', isCorrectAnswer: false },
                { text: '', image: '', isCorrectAnswer: false },
            ],
        };
        const arrNiveis = { title: '', image: '', text: '', minValue: -1 };
        for (let i = 0; i < tamPerguntas; i++) {
            userQuizz.questions[i] = arrPerguntas;
        }
        for (let j = 0; j < tamNiveis; j++) {
            userQuizz.levels[j] = arrNiveis;
        }
    };
    img.onerror = function () {
        alert('imagem inválida');
        document.querySelector('.creator-page.p1 button').innerHTML =
            'Prosseguir pra criar perguntas';
        document
            .querySelector('.creator-page.p1 button')
            .setAttribute('onclick', 'validacaoBasico()');
    };
}

function criarPerquntas(pergunta) {
    const page32 = document.querySelector('.creator-page.p2');
    for (let i = 1; i < pergunta; i++) {
        page32.innerHTML += `   <div class="fechado p${i + 1}">
                                    <h1>Pergunta ${i + 1}</h1>
                                    <ion-icon onclick="abrirPergunta(this)" name="create-outline"></ion-icon>
                                </div>
                                <div class="pergunta p${i + 1} hidden">
                                    <h1>Pergunta ${i + 1}</h1>
                                    <input placeholder="Texto da pergunta" onblur="getInputBlurPerg(this)" type="text" name="Texto da pergunta ${i}" value=""/>
                                    <input placeholder="Cor de fundo da pergunta" onblur="getInputBlurPerg(this)" type="text" name="Cor de fundo da pergunta ${i}" value=""/>
                                    <h1>Resposta correta</h1>
                                    <input placeholder="Resposta correta" onblur="getInputBlurPerg(this)" type="text" name="Resposta correta ${i}" value=""/>
                                    <input placeholder="URL da imagem" onblur="getInputBlurPerg(this)" type="text" name="URL da imagem ${i}" value=""/>
                                    <h1>Respostas incorretas</h1>
                                    <input placeholder="Resposta incorreta 1" onblur="getInputBlurPerg(this)" type="text" name="Resposta incorreta 1 ${i}" value=""/>
                                    <input placeholder="URL da imagem" onblur="getInputBlurPerg(this)" type="text" name="URL da imagem 1 ${i}" value=""/>
                                    <h1 class="hidden"></h1>
                                    <input placeholder="Resposta incorreta 2" onblur="getInputBlurPerg(this)" type="text" name="Resposta incorreta 2 ${i}" value=""/>
                                    <input placeholder="URL da imagem" onblur="getInputBlurPerg(this)" type="text" name="URL da imagem 2 ${i}" value=""/>
                                    <h1 class="hidden"></h1>
                                    <input placeholder="Resposta incorreta 3" onblur="getInputBlurPerg(this)" type="text" name="Resposta incorreta 3 ${i}" value=""/>
                                    <input placeholder="URL da imagem" onblur="getInputBlurPerg(this)" type="text" name="URL da imagem 3 ${i}" value=""/>
                                </div>
        `;
    }
    page32.innerHTML += `<button onclick="validacaoPerguntas()" class="botao-prosseguir">Prosseguir pra criar níveis</button>`;
}

function getInputBlurPerg(blur) {
    for (let i = 0; i < userQuizz.questions.length; i++) {
        if (blur.getAttribute('name') === `Texto da pergunta ${i}`) {
            userQuizz.questions[i] = {
                title: blur.value,
                color: userQuizz.questions[i].color,
                answers: [
                    userQuizz.questions[i].answers[0],
                    userQuizz.questions[i].answers[1],
                    userQuizz.questions[i].answers[2],
                    userQuizz.questions[i].answers[3],
                ],
            };
        } else if (
            blur.getAttribute('name') === `Cor de fundo da pergunta ${i}`
        ) {
            userQuizz.questions[i] = {
                title: userQuizz.questions[i].title,
                color: blur.value,
                answers: [
                    userQuizz.questions[i].answers[0],
                    userQuizz.questions[i].answers[1],
                    userQuizz.questions[i].answers[2],
                    userQuizz.questions[i].answers[3],
                ],
            };
        } else if (blur.getAttribute('name') === `Resposta correta ${i}`) {
            userQuizz.questions[i].answers[0] = {
                text: blur.value,
                image: userQuizz.questions[i].answers[0].image,
                isCorrectAnswer: true,
            };
        } else if (blur.getAttribute('name') === `URL da imagem ${i}`) {
            userQuizz.questions[i].answers[0] = {
                text: userQuizz.questions[i].answers[0].text,
                image: blur.value,
                isCorrectAnswer: true,
            };
            validaimgPer(blur.value);
        } else if (blur.getAttribute('name') === `Resposta incorreta 1 ${i}`) {
            userQuizz.questions[i].answers[1] = {
                text: blur.value,
                image: userQuizz.questions[i].answers[1].image,
                isCorrectAnswer: false,
            };
        } else if (blur.getAttribute('name') === `URL da imagem 1 ${i}`) {
            userQuizz.questions[i].answers[1] = {
                text: userQuizz.questions[i].answers[1].text,
                image: blur.value,
                isCorrectAnswer: false,
            };
            validaimgPer(blur.value);
        } else if (blur.getAttribute('name') === `Resposta incorreta 2 ${i}`) {
            userQuizz.questions[i].answers[2] = {
                text: blur.value,
                image: userQuizz.questions[i].answers[2].image,
                isCorrectAnswer: false,
            };
        } else if (blur.getAttribute('name') === `URL da imagem 2 ${i}`) {
            userQuizz.questions[i].answers[2] = {
                text: userQuizz.questions[i].answers[2].text,
                image: blur.value,
                isCorrectAnswer: false,
            };
            validaimgPer(blur.value);
        } else if (blur.getAttribute('name') === `Resposta incorreta 3 ${i}`) {
            userQuizz.questions[i].answers[3] = {
                text: blur.value,
                image: userQuizz.questions[i].answers[3].image,
                isCorrectAnswer: false,
            };
        } else if (blur.getAttribute('name') === `URL da imagem 3 ${i}`) {
            userQuizz.questions[i].answers[3] = {
                text: userQuizz.questions[i].answers[3].text,
                image: blur.value,
                isCorrectAnswer: false,
            };
            validaimgPer(blur.value);
        }
    }
}

function validaimgPer(file) {
    let img = new Image();
    img.src = file;

    document.querySelector('.creator-page.p2 button').innerHTML = 'Aguarde...';
    document
        .querySelector('.creator-page.p2 button')
        .removeAttribute('onclick');

    img.onload = function () {
        document.querySelector('.creator-page.p2 button').innerHTML =
            'Prosseguir pra criar níveis';
        document
            .querySelector('.creator-page.p2 button')
            .setAttribute('onclick', 'validacaoPerguntas()');
    };
    img.onerror = function () {
        if (file === '') {
            document.querySelector('.creator-page.p2 button').innerHTML =
                'Prosseguir pra criar níveis';
            document
                .querySelector('.creator-page.p2 button')
                .setAttribute('onclick', 'validacaoPerguntas()');
        } else {
            return alert('Imagem inválida');
        }
    };
}

function abrirPergunta(item) {
    for (let p = 0; p < userQuizz.questions.length; p++) {
        document.querySelector(`.fechado.p${p + 1}`).classList.remove('hidden');
        document.querySelector(`.pergunta.p${p + 1}`).classList.add('hidden');
        if (item.parentNode.classList.contains(`p${p + 1}`)) {
            item.parentNode.classList.add('hidden');
            document
                .querySelector(`.pergunta.p${p + 1}`)
                .classList.remove('hidden');
            document.querySelector(`.pergunta.p${p + 1}`).scrollIntoView();
        }
    }
}

function validacaoPerguntas() {
    let respostaErrada = -1;

    for (let k = 0; k < userQuizz.questions.length; k++) {
        respostaErrada = validarRespostaIncorreta(
            userQuizz.questions[k].answers
        );
        if (userQuizz.questions[k].title.length < 20) {
            return alert(`Nome da pergunta ${k+1} inválido`);
        } else if (validarNaoCor(userQuizz.questions[k].color)) {
            return alert(`Cor ${k+1} inválida`);
        } else if (userQuizz.questions[k].answers[0].text === '') {
            return alert(`Crie uma resposta correta na pergunta ${k+1}`);
        } else if (userQuizz.questions[k].answers[0].image === '') {
            return alert(`Insira uma imagem para resposta correta na pergunta ${k+1}`);
        }
        if (respostaErrada === 0) {
            return alert(`Insira uma resposta incorreta para imagem na pegunta ${k+1}`);
        } else if (respostaErrada === 1) {
            return alert(`Insira no mínimo uma resposta incorreta para pergunta ${k+1}`);
        } else if (respostaErrada === 2) {
            return alert(`Insira uma imagem para resposta na pergunta ${k+1}`);
        }
    }

    document.querySelector('.creator-page.p2').classList.add('hidden');
    document.querySelector('.creator-page.p3').classList.remove('hidden');
}

function validarRespostaIncorreta(respostaIncorreta) {
    let cont = 0;

    for (let r = 1; r < respostaIncorreta.length; r++) {
        if (respostaIncorreta[r].text === '') {
            if (respostaIncorreta[r].image != '') {
                return 0;
            } else {
                cont++;
                if (cont > 2) {
                    return 1;
                }
            }
        } else if (respostaIncorreta[r].text != '') {
            if (respostaIncorreta[r].image === '') {
                return 2;
            }
        }
    }
}

function validarNaoCor(color) {
    color.toLowerCase();
    let caracteres = `ghijklmnopqrstuvwxyz*""''/?:.,;$%@!&()_-+=`;
    for (let c = 0; c < caracteres.length; c++) {
        if (color.indexOf(caracteres[c]) != -1) {
            return true;
        }
    }
    if (color.length != 7) {
        return true;
    } else if (!color.startsWith('#')) {
        return true;
    }
    return false;
}

function criarNiveis(nivel) {
    let page33 = document.querySelector('.creator-page.p3');
    for (let n = 1; n < nivel; n++) {
        page33.innerHTML += `  <div class="fechado n${n + 1}">
                                    <h1>Nível ${n + 1}</h1>
                                    <ion-icon onclick="abrirNivel(this)" name="create-outline"></ion-icon>
                                </div>
                                <div class="creator-data nivel n${
                                    n + 1
                                } hidden">
                                    <h1>Nível ${n + 1}</h1>
                                    <input type="text" onblur="onblurNivel(this)" name="Título do nível ${n}" placeholder="Título do nível" value=""/>
                                    <input type="text" onblur="onblurNivel(this)" name="% de acerto mínima ${n}" placeholder="% de acerto mínima" value=""/>
                                    <input type="text" onblur="onblurNivel(this)" name="URL da imagem do nível ${n}" placeholder="URL da imagem do nível" value=""/>
                                    <input type="text" onblur="onblurNivel(this)" name="Descrição do nível ${n}" placeholder="Descrição do nível" value=""/>
                                </div>
        `;
    }
    page33.innerHTML += `<button onclick="validarNivel()" class="botao-prosseguir">Finalizar Quizz</button>`;
}

function onblurNivel(blur) {
    for (let i = 0; i < userQuizz.levels.length; i++) {
        if (blur.getAttribute('name') === `Título do nível ${i}`) {
            userQuizz.levels[i] = {
                title: blur.value,
                image: userQuizz.levels[i].image,
                text: userQuizz.levels[i].text,
                minValue: userQuizz.levels[i].minValue,
            };
        } else if (blur.getAttribute('name') === `% de acerto mínima ${i}`) {
            userQuizz.levels[i] = {
                title: userQuizz.levels[i].title,
                image: userQuizz.levels[i].image,
                text: userQuizz.levels[i].text,
                minValue: blur.value,
            };
        } else if (
            blur.getAttribute('name') === `URL da imagem do nível ${i}`
        ) {
            validarImgNivel(blur.value);
            userQuizz.levels[i] = {
                title: userQuizz.levels[i].title,
                image: blur.value,
                text: userQuizz.levels[i].text,
                minValue: userQuizz.levels[i].minValue,
            };
        } else if (blur.getAttribute('name') === `Descrição do nível ${i}`) {
            userQuizz.levels[i] = {
                title: userQuizz.levels[i].title,
                image: userQuizz.levels[i].image,
                text: blur.value,
                minValue: userQuizz.levels[i].minValue,
            };
        }
    }
}

function validarImgNivel(file) {
    let img = new Image();
    img.src = file;

    document
        .querySelector('.creator-page.p3 button')
        .removeAttribute('onclick');
    document.querySelector('.creator-page.p3 button').innerHTML = 'Aguarde...';

    img.onload = function () {
        document
            .querySelector('.creator-page.p3 button')
            .setAttribute('onclick', 'validarNivel()');
        document.querySelector('.creator-page.p3 button').innerHTML =
            'Finalizar Quizz';
    };
    img.onerror = function () {
        if (file === '') {
            document
                .querySelector('.creator-page.p3 button')
                .setAttribute('onclick', 'validarNivel()');
            document.querySelector('.creator-page.p3 button').innerHTML =
                'Finalizar Quizz';
            return alert('Insira uma imagem válida');
        } else {
            document.querySelector('.creator-page.p3 button').innerHTML =
                'Imagem inválida';
            return alert('Insira uma imagem válida');
        }
    };
}

function validarNivel() {
    let boolval = false;
    for (let n = 0; n < userQuizz.levels.length; n++) {
        if (userQuizz.levels[n].title < 10) {
            return alert('Título inválido');
        } else if (typeof Number(userQuizz.levels[n].minValue) != 'number') {
            return alert('Insira apenas números em acerto mínimo');
        } else if (userQuizz.levels[n].image === '') {
            return alert('Insira o endereço de uma imagem');
        } else if (userQuizz.levels[n].text < 30) {
            return alert('Descrição do nível inválida');
        }
        if (typeof Number(userQuizz.levels[n].minValue) === 'number') {
            if (
                Number(userQuizz.levels[n].minValue) < 0 ||
                Number(userQuizz.levels[n].minValue) > 100
            ) {
                return alert('Nível inválido');
            }
            for (let i = 0; i < n; i++) {
                if (
                    userQuizz.levels[i].minValue ===
                    userQuizz.levels[n].minValue
                ) {
                    return alert('Insira valores de níveis diferentes');
                }
            }
            if (Number(userQuizz.levels[n].minValue) === 0) {
                boolval = true;
            }
        }
    }
    if (boolval) {
        document.querySelector('.creator-page.p3').classList.add('hidden');
        for (let i = 0; i < userQuizz.questions.length; i++) {
            userQuizz.questions[i].answers = userQuizz.questions[
                i
            ].answers.filter((answer) => answer.text != '');
        }
        const promisePost = axios.post(
            'https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes',
            userQuizz
        );
        promisePost.then(mostrarQuizz);
    } else {
        return alert('Insira um nível com acerto 0%');
    }
}

function abrirNivel(item) {
    for (let n = 0; n < userQuizz.levels.length; n++) {
        document.querySelector(`.fechado.n${n + 1}`).classList.remove('hidden');
        document
            .querySelector(`.creator-data.nivel.n${n + 1}`)
            .classList.add('hidden');
        if (item.parentNode.classList.contains(`n${n + 1}`)) {
            item.parentNode.classList.add('hidden');
            document
                .querySelector(`.creator-data.nivel.n${n + 1}`)
                .classList.remove('hidden');
            document
                .querySelector(`.creator-data.nivel.n${n + 1}`)
                .scrollIntoView();
        }
    }
}

function mostrarQuizz(id) {
    const page34 = document.querySelector('.creator-page.p4');
    page34.classList.remove('hidden');
    page34.innerHTML = `<h1>Seu quizz está pronto!</h1>
                        <div class="quizz">
                            <img
                                src=${userQuizz.image}
                                alt=""
                            />
                            <p>
                                ${userQuizz.title}
                            </p>
                            
                        </div>
                        <button onclick="carregarQuizz2()" class="botao-prosseguir">Acessar Quizz</button>
                        <button onclick="escolherVoltar()" class="botao-home">Voltar pra home</button>
    `;
    console.log(id);
    console.log(id.data.id);
    quizzID = id.data.id;
    meusQuizzes.push(quizzID);

    armazenarQuizz();
}

function carregarQuizz2() {
    let promise = axios.get(
        'https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes'
    );
    promise.then(verPromise);
    promise.then(escolherQuizz2);
}

function escolherQuizz2(response) {
    todosQuizzes = response.data;
    console.log(todosQuizzes);

    document.querySelector('.quizz-creator').classList.add('hidden');
    document.querySelector('.creator-page.p4').classList.add('hidden');
    document.querySelector('.quizz-page').classList.remove('hidden');
    let index = todosQuizzes.findIndex((x) => x.id === Number(quizzID));
    quizzSelecionado = todosQuizzes[index];
    
    renderizarQuizz();
}

function escolherVoltar() {
    window.location.reload();
}

function armazenarQuizz() {
    let idSerializado = JSON.stringify(meusQuizzes);
    localStorage.setItem('ids', idSerializado);
    console.log(idSerializado);
}

function temQuizz() {
    let minhaLista = localStorage.getItem('ids');
    console.log(minhaLista);
    if (minhaLista !== null) {
        listarQuizzUsuario();
    } else {
        listarQuizzCreate();
    }
}

function listarQuizzCreate() {
    document.querySelector('.quizz-create').classList.remove('hidden');
    document.querySelector('.all-quizzes-user').classList.add('hidden');
}

function listarQuizzUsuario() {
    document.querySelector('.quizz-create').classList.add('hidden');
    document.querySelector('.all-quizzes-user').classList.remove('hidden');
    console.log(todosQuizzes);

    const idSerializada = localStorage.getItem('ids');
    const lista = JSON.parse(idSerializada);
    console.log(lista);

    for (let i = 0; i < lista.length; i++) {
        let indice = Number(lista[i]);
        console.log(indice);
        

        for (let j = 0; j < todosQuizzes.length; j++) {
            if(todosQuizzes[j].id == indice ) {
                console.log(todosQuizzes);
                console.log(todosQuizzes[j])

                console.log(todosQuizzes[j].id);
                document.querySelector('.quizzes-user').innerHTML += `
                <div class="quizz" onclick="escolherQuizz(this)">
                    <img src="${todosQuizzes[j].image}" alt=""/>
                    <p>${todosQuizzes[j].title}</p>
                    <span class="hidden">${todosQuizzes[j].id}</span>
                </div>   
            `;

            }


        }
        
    }
}
// -------------------------------------

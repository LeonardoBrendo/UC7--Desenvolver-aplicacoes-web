const formIMC = document.getElementById('formIMC');
const pesoInput = document.getElementById('peso');
const alturaInput = document.getElementById('altura');
const resultadoDiv = document.getElementById('resultado');
const imcValorSpan = document.getElementById('imcValor');
const classificacaoDiv = document.getElementById('classificacao');
const btnLimpar = document.getElementById('btnLimpar');

function calcularIMC(peso, altura) {
    return peso / (altura * altura);
}

function classificarIMC(imc) {
    if (imc < 18.5) {
        return { texto: 'Abaixo do peso', cor: 'blue' };
    } else if (imc >= 18.5 && imc < 25) {
        return { texto: 'Peso normal', cor: 'green' };
    }  else if (imc >= 25 && imc < 30) {
        return { texto: 'Sobrepeso', cor: 'orange' };
    } else if (imc >= 30 && imc < 35) {
        return { texto: 'Obesidade grau 1', cor: 'red' };
    } else if (imc >= 35 && imc < 40) {
        return { texto: 'Obesidade grau 2', cor: 'darkred' };
    }   else {
        return { texto: 'Obesidade grau 3', cor: 'maroon' };
    }
}

function mostrarResultado(imc, classificacao) {
    imcValorSpan.textContent = imc.toFixed(2);
    classificacaoDiv.textContent = classificacao.texto;
    classificacaoDiv.style.color = classificacao.cor;
    resultadoDiv.style.display = 'block';
    btnLimpar.style.display = 'block';
}

function limparformulario() {
    pesoInput.value = '';
    alturaInput.value = '';
    resultadoDiv.style.display = 'none';
    btnLimpar.style.display = 'none';
    pesoInput.focus();
}

function handleSubmit(event) {
    event.preventDefault();
    const peso = parseFloat(pesoInput.value);
    const altura = parseFloat(alturaInput.value);

    if (isNaN(peso) || isNaN(altura) || peso <= 0 || altura <= 0 || altura > 2.51 || peso > 635) {
        alert('Por favor, insira valores válidos para peso e altura.');
        return false;
    }

    const imc = calcularIMC(peso, altura);
    const classificacao = classificarIMC(imc);
    mostrarResultado(imc, classificacao);
}

formIMC.addEventListener('submit', handleSubmit);
btnLimpar.addEventListener('click', limparformulario);

pesoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        alturaInput.focus();
    }
});

alturaInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSubmit(e);
    }
});
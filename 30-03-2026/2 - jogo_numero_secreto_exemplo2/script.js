let numeroSecreto = Math.floor(Math.random() * 10) + 1;
let tentativas = 0;

const palpiteInput = document.getElementById("palpite");
const btnChutar = document.getElementById("btnChutar");
const mensagemDiv = document.getElementById("mensagem");
const contadorSpan = document.getElementById("contador");
const btnNovoJogo = document.getElementById("btnNovoJogo");

function chutar() {
    const palpite = Number(palpiteInput.value);

    if (!palpite || palpite < 1 || palpite > 100) {
        mensagemDiv.textContent = "Por favor, insira um número entre 1 e 100.";
        return false;
    }

    tentativas++;
    contadorSpan.textContent = tentativas;

    if (palpite === numeroSecreto) {
        mensagemDiv.textContent = `Parabéns! Você acertou o número secreto ${numeroSecreto} em ${tentativas} tentativas!`;
        btnChutar.disabled = true;
        btnNovoJogo.style.display = "inline-block";
    } else if (palpite < numeroSecreto) {
        mensagemDiv.textContent = "Tente um número maior!";
    } else {
        mensagemDiv.textContent = "Tente um número menor!";
    }

    palpiteInput.value = "";
    palpiteInput.focus();
}

function novoJogo() {
    numeroSecreto = Math.floor(Math.random() * 10) + 1;
    tentativas = 0;
    contadorSpan.textContent = tentativas;
    mensagemDiv.textContent = "";
    btnChutar.disabled = false;
    btnNovoJogo.style.display = "none";
    palpiteInput.value = "";
    palpiteInput.focus();
}

btnChutar.addEventListener("click", chutar);
btnNovoJogo.addEventListener("click", novoJogo);
palpiteInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        chutar();
    }   
});
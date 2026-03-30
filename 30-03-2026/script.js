const citacoes = [
    { texto: "O sucesso é a soma de pequenos esforços repetidos dia após dia.", autor: "Robert Collier" },
    { texto: "Acredite em si mesmo e todo o resto será possível.", autor: "Desconhecido" },
    { texto: "Não espere por oportunidades, crie você mesmo as suas.", autor: "Desconhecido" },
    { texto: "O fracasso é a oportunidade de começar de novo com mais inteligência.", autor: "Henry Ford" },
    { texto: "Sonhe grande, trabalhe duro e nunca desista.", autor: "Desconhecido" },
    { texto: "A única maneira de fazer um excelente trabalho é amar o que você faz.", autor: "Steve Jobs" },
    { texto: "O futuro pertence àqueles que acreditam na beleza de seus sonhos.", autor: "Eleanor Roosevelt" },
    { texto: "Se você pode sonhar, você pode realizar.", autor: "Walt Disney" }
]

let ultimoIndice = -1;

const citacaoDiv = document.getElementById("citacao");
const autorDiv = document.getElementById("autor");
const novaCitacaoBtn = document.getElementById("btnGerar");

function gerarCitacao() {
    let novoIndice;
    do {
        novoIndice = Math.floor(Math.random() * citacoes.length);
    } while (novoIndice === ultimoIndice && citacoes.length > 1);

    ultimoIndice = novoIndice;
    const citacao = citacoes[novoIndice];
    citacaoDiv.textContent = `"${citacao.texto}"`;
    autorDiv.textContent = `+ ${citacao.autor}`;
}

gerarCitacao();
novaCitacaoBtn.addEventListener("click", gerarCitacao);
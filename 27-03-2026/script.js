const titulo = document.getElementById('titulo');
titulo.textContent = 'Valor do Titulo';

document.writeln("<h1>Valor do Titulo</h1>");

document.body.style.backgroundColor = 'lightblue';

const textos = document.getElementsByClassName('texto');
for (let i = 0; i < textos.length; i++) {
    textos[i].style.color = 'red';
}

const timeoutId = setTimeout(() => {
  console.log("You won't see this message.");
}, 5000);

textos[0].textContent = 'Parágrafo 1 - Editado';
textos[1].textContent = 'Parágrafo 2 - Editado';
textos[2].textContent = 'Parágrafo 3 - Editado';
textos[3].textContent = 'Parágrafo 4 - Editado';

textos[0].style.fontSize = '20px';
textos[1].style.fontSize = '20px';
textos[2].style.fontSize = '20px';
textos[3].style.fontSize = '20px';

textos[0].classList.add('destaque');

const paragrafos = document.getElementsByTagName('p');
console.log("Total de <p> encontrados: " + paragrafos.length);

const primeiroItem = document.querySelector('.item');
primeiroItem.style.color = 'blue';

const todosItens = document.querySelectorAll('.item');
todosItens.forEach((item, index) => {
    if (index % 2 == 0) {
        item.style.fontSize = '18px';
        item.style.fontWeight = 'bold';
        item.style.color = 'red';
    }
});

const novoItem = document.createElement("li");
novoItem.textContent = "Item 5";
novoItem.classList.add('item');
document.getElementById('lista').appendChild(novoItem);

const botao = document.getElementById("btn");

botao.addEventListener("click", function() {
    alert("Botão clicado!");
});

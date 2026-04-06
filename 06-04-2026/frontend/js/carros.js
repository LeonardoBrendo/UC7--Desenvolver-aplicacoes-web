const API_URL = '/api/carros';

const carroForm = document.getElementById('carroForm');
const carrosList = document.getElementById('carrosList');
const searchInput = document.getElementById('searchInput');
const limparBtn = document.getElementById('limparBtn');
const loadingMessage = document.getElementById('loadingMessage');

let carros = [];
let editandoId = null;

function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `<span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span><span>${message}</span>`;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
}

function formatarPreco(preco) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(preco);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function listarCarros() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao carregar carros');
        
        carros = await response.json();
        renderizarCarros(carros);
        
        if (loadingMessage) loadingMessage.style.display = 'none';
    } catch (error) {
        console.error('Erro:', error);
        showAlert('Erro ao carregar lista de carros', 'error');
        if (loadingMessage) {
            loadingMessage.textContent = 'Erro ao carregar carros';
            loadingMessage.style.color = '#e74c3c';
        }
    }
}

async function criarCarro(carroData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(carroData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao criar carro');
        }
        
        const novoCarro = await response.json();
        showAlert(`Carro "${novoCarro.nome}" criado com sucesso!`, 'success');
        await listarCarros();
        limparFormulario();
    } catch (error) {
        console.error('Erro:', error);
        showAlert(error.message, 'error');
    }
}

async function atualizarCarro(id, carroData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(carroData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao atualizar carro');
        }
        
        const carroAtualizado = await response.json();
        showAlert(`Carro "${carroAtualizado.nome}" atualizado com sucesso!`, 'success');
        await listarCarros();
        limparFormulario();
        editandoId = null;
    } catch (error) {
        console.error('Erro:', error);
        showAlert(error.message, 'error');
    }
}

async function deletarCarro(id, nome) {
    if (!confirm(`Tem certeza que deseja excluir o carro "${nome}"?`)) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao deletar carro');
        }
        
        showAlert(`Carro "${nome}" deletado com sucesso!`, 'success');
        await listarCarros();
    } catch (error) {
        console.error('Erro:', error);
        showAlert(error.message, 'error');
    }
}

function editarCarro(carro) {
    document.getElementById('carroId').value = carro.id;
    document.getElementById('nome').value = carro.nome;
    document.getElementById('marca').value = carro.marca;
    document.getElementById('preco').value = carro.preco;
    document.getElementById('ano').value = carro.ano;
    
    editandoId = carro.id;
    const submitBtn = document.querySelector('.btn-primary');
    if (submitBtn) submitBtn.textContent = '✏️ Atualizar Carro';
    
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

function limparFormulario() {
    if (carroForm) carroForm.reset();
    const carroIdInput = document.getElementById('carroId');
    if (carroIdInput) carroIdInput.value = '';
    editandoId = null;
    
    const submitBtn = document.querySelector('.btn-primary');
    if (submitBtn) submitBtn.textContent = '💾 Salvar Carro';
}

function renderizarCarros(carrosParaRenderizar) {
    if (!carrosList) return;
    
    if (carrosParaRenderizar.length === 0) {
        carrosList.innerHTML = '<div class="empty-message">Nenhum carro encontrado</div>';
        return;
    }
    
    carrosList.innerHTML = carrosParaRenderizar.map(carro => `
        <div class="carro-card">
            <div class="carro-info">
                <div class="carro-nome">${escapeHtml(carro.nome)}</div>
                <div class="carro-marca">🏢 ${escapeHtml(carro.marca)}</div>
                <div class="carro-preco">💰 ${formatarPreco(carro.preco)}</div>
                <div class="carro-ano">📅 Ano: ${carro.ano}</div>
            </div>
            <div class="carro-actions">
                <button class="btn btn-edit" onclick="editarCarro(${JSON.stringify(carro).replace(/"/g, '&quot;')})">
                    ✏️ Editar
                </button>
                <button class="btn btn-delete" onclick="deletarCarro(${carro.id}, '${escapeHtml(carro.nome)}')">
                    🗑️ Excluir
                </button>
            </div>
        </div>
    `).join('');
}

function filtrarCarros() {
    if (!searchInput) return;
    
    const termo = searchInput.value.toLowerCase().trim();
    
    if (termo === '') {
        renderizarCarros(carros);
        return;
    }
    
    const carrosFiltrados = carros.filter(carro => 
        carro.nome.toLowerCase().includes(termo) || 
        carro.marca.toLowerCase().includes(termo)
    );
    
    renderizarCarros(carrosFiltrados);
}

if (carroForm) {
    carroForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const carroData = {
            nome: document.getElementById('nome').value.trim(),
            marca: document.getElementById('marca').value.trim(),
            preco: parseFloat(document.getElementById('preco').value),
            ano: parseInt(document.getElementById('ano').value)
        };
        
        if (!carroData.nome || !carroData.marca || !carroData.preco || !carroData.ano) {
            showAlert('Por favor, preencha todos os campos', 'error');
            return;
        }
        
        if (carroData.preco <= 0) {
            showAlert('O preço deve ser maior que zero', 'error');
            return;
        }
        
        if (carroData.ano < 1900 || carroData.ano > 2026) {
            showAlert('Ano inválido', 'error');
            return;
        }
        
        if (editandoId) {
            await atualizarCarro(editandoId, carroData);
        } else {
            await criarCarro(carroData);
        }
    });
    
    if (searchInput) searchInput.addEventListener('input', filtrarCarros);
    
    if (limparBtn) {
        limparBtn.addEventListener('click', () => {
            limparFormulario();
            showAlert('Formulário limpo!', 'info');
        });
    }
    
    listarCarros();
    
    const precoInput = document.getElementById('preco');
    if (precoInput) {
        precoInput.addEventListener('blur', (e) => {
            let valor = parseFloat(e.target.value);
            if (!isNaN(valor)) e.target.value = valor.toFixed(2);
        });
    }
}
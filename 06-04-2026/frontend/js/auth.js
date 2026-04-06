const MOCK_USERS = [
    {
        id: 1,
        username: 'admin',
        password: 'admin123',
        name: 'Administrador',
        role: 'admin'
    },
    {
        id: 2,
        username: 'user',
        password: 'user123',
        name: 'Usuário Comum',
        role: 'user'
    }
];

const loginForm = document.getElementById('loginForm');
const togglePasswordBtn = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const rememberMeCheckbox = document.getElementById('rememberMe');
const usernameInput = document.getElementById('username');

function showAlert(message, type = 'error') {
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) existingAlert.remove();
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span><span>${message}</span>`;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => alertDiv.remove(), 3000);
}

function validateCredentials(username, password) {
    const user = MOCK_USERS.find(u => u.username === username && u.password === password);
    
    if (user) {
        return {
            success: true,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role
            }
        };
    }
    
    return { success: false, message: 'Usuário ou senha inválidos!' };
}

function saveSession(user, rememberMe) {
    const sessionData = {
        user: user,
        timestamp: new Date().getTime(),
        expiresIn: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
    };
    
    localStorage.setItem('userSession', JSON.stringify(sessionData));
    
    if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('savedUsername', user.username);
    } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('savedUsername');
    }
}

function checkAuth() {
    const sessionData = localStorage.getItem('userSession');
    
    if (sessionData) {
        try {
            const session = JSON.parse(sessionData);
            const now = new Date().getTime();
            
            if (now - session.timestamp < session.expiresIn) {
                return session.user;
            } else {
                localStorage.removeItem('userSession');
                localStorage.removeItem('rememberMe');
                return null;
            }
        } catch (error) {
            console.error('Erro ao ler sessão:', error);
            return null;
        }
    }
    return null;
}

function logout() {
    localStorage.removeItem('userSession');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('savedUsername');
    window.location.href = '/pages/login.html';
}

function loadSavedCredentials() {
    if (!usernameInput) return;
    
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    const savedUsername = localStorage.getItem('savedUsername');
    
    if (rememberMe && savedUsername) {
        usernameInput.value = savedUsername;
        if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
        if (passwordInput) passwordInput.focus();
    }
}

function login(username, password, rememberMe) {
    const result = validateCredentials(username, password);
    
    if (result.success) {
        saveSession(result.user, rememberMe);
        showAlert(`Bem-vindo, ${result.user.name}! Redirecionando...`, 'success');
        setTimeout(() => window.location.href = '/pages/dashboard.html', 1500);
    } else {
        showAlert(result.message, 'error');
        if (passwordInput) {
            passwordInput.value = '';
            passwordInput.focus();
        }
    }
}

if (loginForm) {
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePasswordBtn.textContent = type === 'password' ? '👁️' : '🙈';
        });
    }
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput ? usernameInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value : '';
        const rememberMe = rememberMeCheckbox ? rememberMeCheckbox.checked : false;
        
        if (!username || !password) {
            showAlert('Por favor, preencha todos os campos!', 'error');
            return;
        }
        login(username, password, rememberMe);
    });
    
    loadSavedCredentials();
}

if (window.location.pathname.includes('dashboard.html')) {
    const user = checkAuth();
    if (!user) {
        window.location.href = '/pages/login.html';
    } else {
        const userNameDisplay = document.getElementById('userNameDisplay');
        const userRoleDisplay = document.getElementById('userRoleDisplay');
        
        if (userNameDisplay) userNameDisplay.textContent = user.name;
        if (userRoleDisplay) userRoleDisplay.textContent = user.role === 'admin' ? 'Admin' : 'User';
        
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) logoutBtn.addEventListener('click', logout);
    }
}
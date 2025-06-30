document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // Lista de usuários válidos (em produção, use backend)
    const validUsers = {
        'admin': 'python123',
        'editor': 'quiz123'
    };
    
    if (validUsers[username] === password) {
        // Login bem-sucedido
        sessionStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('username', username);
        window.location.href = 'quiz.html';
    } else {
        alert('Credenciais inválidas!');
    }
});
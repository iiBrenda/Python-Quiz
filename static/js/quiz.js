class PythonBackground {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.pythonLogos = [];
    this.mouse = { x: null, y: null };
    this.resizeTimeout = null;
    
    this.init();
  }

  init() {
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.zIndex = '-1';
    this.canvas.style.opacity = '0.7';
    document.body.prepend(this.canvas);

    this.resize();
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => this.resize(), 200);
    });
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    // Criar partículas
    for (let i = 0; i < 100; i++) {
      this.particles.push(this.createParticle());
    }

    // Criar logos Python flutuantes
    for (let i = 0; i < 8; i++) {
      this.pythonLogos.push(this.createPythonLogo());
    }

    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticle() {
    const size = Math.random() * 3 + 1;
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: size,
      speedX: Math.random() * 1 - 0.5,
      speedY: Math.random() * 1 - 0.5,
      color: `hsl(${Math.random() * 60 + 190}, 70%, 60%)`,
      originalSize: size
    };
  }

  createPythonLogo() {
    const size = Math.random() * 40 + 30;
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: size,
      speedX: Math.random() * 0.5 - 0.25,
      speedY: Math.random() * 0.5 - 0.25,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 0.5 - 0.25
    };
  }

  drawPythonLogo(x, y, size, rotation) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(rotation * Math.PI / 180);
    
    // Desenhar logo Python simplificado
    this.ctx.beginPath();
    this.ctx.fillStyle = '#3776AB';
    this.ctx.arc(0, 0, size/2, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.fillStyle = '#FFD43B';
    this.ctx.arc(0, 0, size/2.5, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.fillStyle = '#3776AB';
    this.ctx.arc(size/4, -size/4, size/6, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Fundo gradiente
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#0f2027');
    gradient.addColorStop(0.5, '#203a43');
    gradient.addColorStop(1, '#2c5364');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Atualizar e desenhar partículas
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      
      // Interação com o mouse
      if (this.mouse.x && this.mouse.y) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const angle = Math.atan2(dy, dx);
          const force = (100 - distance) / 100;
          p.x -= Math.cos(angle) * force * 2;
          p.y -= Math.sin(angle) * force * 2;
        }
      }
      
      // Movimento
      p.x += p.speedX;
      p.y += p.speedY;
      
      // Rebater nas bordas
      if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;
      
      // Desenhar
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
    }
    
    // Atualizar e desenhar logos Python
    for (let i = 0; i < this.pythonLogos.length; i++) {
      const logo = this.pythonLogos[i];
      
      logo.x += logo.speedX;
      logo.y += logo.speedY;
      logo.rotation += logo.rotationSpeed;
      
      // Rebater nas bordas
      if (logo.x < -50 || logo.x > this.canvas.width + 50) logo.speedX *= -1;
      if (logo.y < -50 || logo.y > this.canvas.height + 50) logo.speedY *= -1;
      
      this.drawPythonLogo(logo.x, logo.y, logo.size, logo.rotation);
    }
    
    // Linhas de conexão entre partículas
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(55, 118, 171, ${1 - distance/100})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(() => this.animate());
  }
}

// Inicialize o fundo quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new PythonBackground();
    let currentQuestion = 0;
    let score = 0;
    let userAnswers = [];
    let quizData = [];
    let isAdmin = false;

    // Elementos do DOM
    const quizContent = document.getElementById('quizContent');
    const progressText = document.getElementById('progressText');
    const progressBar = document.getElementById('progressBar');

    // Inicialização
    checkAdminStatus();
    loadQuestions();
    addAdminButton();

    // Função para adicionar botão de admin flutuante
    function addAdminButton() {
        const adminBtn = document.createElement('button');
        adminBtn.id = 'floatingAdminBtn';
        adminBtn.innerHTML = '<i class="fas fa-user-cog"></i>';
        adminBtn.addEventListener('click', () => {
            if (isAdmin) {
                if (confirm('Deseja sair do modo admin?')) {
                    logout();
                }
            } else {
                showAdminLogin();
            }
        });
        document.body.appendChild(adminBtn);
    }

    // Substitua a função showAdminLogin por esta versão corrigida
function showAdminLogin() {
    quizContent.innerHTML = `
        <div class="admin-login">
            <h2><i class="fas fa-lock"></i> Acesso Admin</h2>
            <form id="adminLoginForm">
                <div class="form-group">
                    <label for="adminUsername">Usuário:</label>
                    <input type="text" id="adminUsername" required>
                </div>
                <div class="form-group">
                    <label for="adminPassword">Senha:</label>
                    <input type="password" id="adminPassword" required>
                </div>
                <button type="submit" class="btn">
                    <i class="fas fa-sign-in-alt"></i> Entrar
                </button>
            </form>
        </div>
    `;

    document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;
        
        if (username === 'admin' && password === 'python123') {
            sessionStorage.setItem('username', 'admin');
            isAdmin = true;
            updateAdminUI();
            // Em vez de loadQuestions(), vamos direto para o painel admin
            showResults(); // Mostra a tela de resultados que tem o botão do painel admin
            document.getElementById('adminBtn').click(); // Abre automaticamente o painel admin
        } else {
            alert('Credenciais inválidas!');
        }
    });
}

// E adicione esta função para forçar a abertura do painel admin quando já estiver logado
function checkAdminStatus() {
    const loggedUser = sessionStorage.getItem('username');
    isAdmin = (loggedUser === 'admin');
    updateAdminUI();
    
    // Se já estiver logado como admin, abre automaticamente o painel
    if (isAdmin && window.location.hash === '#admin') {
        setTimeout(() => {
            if (document.getElementById('adminBtn')) {
                document.getElementById('adminBtn').click();
            }
        }, 500);
    }
}

    function checkAdminStatus() {
        const loggedUser = sessionStorage.getItem('username');
        isAdmin = (loggedUser === 'admin');
        updateAdminUI();
    }

    function updateAdminUI() {
        const adminBtn = document.getElementById('floatingAdminBtn');
        if (adminBtn) {
            adminBtn.innerHTML = isAdmin ? '<i class="fas fa-user-shield"></i>' : '<i class="fas fa-user"></i>';
            adminBtn.className = isAdmin ? 'admin-active' : '';
        }

        if (isAdmin) {
            document.querySelectorAll('.admin-only').forEach(el => {
                el.style.display = 'block';
            });
        }
    }

    window.logout = function() {
        sessionStorage.removeItem('username');
        isAdmin = false;
        updateAdminUI();
        location.reload();
    };

    

function loadQuestions() {
    showLoading();

    fetch('/api/perguntas')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Debug: verifique os dados no console
            console.log("Dados recebidos:", data); 
            
            if (!Array.isArray(data)) {
                throw new Error("Formato inválido: esperado array de perguntas");
            }

            quizData = data;
            currentQuestion = 0;
            loadQuestion();
        })
        .catch(error => {
            console.error("Falha ao carregar perguntas:", error);
            
            quizContent.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>Falha ao carregar o quiz</h3>
                    <p>${error.message}</p>
                    <button onclick="window.location.reload()" class="btn">
                        <i class="fas fa-sync-alt"></i> Tentar novamente
                    </button>
                </div>
            `;
        });
}

    function showLoading() {
        quizContent.innerHTML = `
            <div class="loading-container">
                <div class="spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
                <p>Carregando perguntas...</p>
            </div>
        `;
    }

    function loadQuestion() {
        if (currentQuestion >= quizData.length) {
            showResults();
            return;
        }

        const question = quizData[currentQuestion];
        updateProgress();
        
        quizContent.innerHTML = `
            <div class="question">${question.question}</div>
            <div class="options" id="optionsContainer"></div>
            <button id="submitBtn" class="btn">
                <i class="fas fa-paper-plane"></i> Enviar Resposta
            </button>
            <div id="feedback" class="feedback"></div>
            <button id="hintBtn" class="btn btn-secondary" style="margin-top: 1.5rem;">
                <i class="fas fa-lightbulb"></i> Mostrar Dica
            </button>
            <div id="hint" style="display: none; margin-top: 1.5rem; padding: 1.5rem; 
                 background: rgba(255, 212, 59, 0.1); border-radius: 10px; 
                 border-left: 4px solid var(--python-yellow); color: var(--python-yellow);">
                <i class="fas fa-info-circle"></i> ${question.hint || 'Nenhuma dica disponível'}
            </div>
        `;

        const optionsContainer = document.getElementById('optionsContainer');
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.innerHTML = `
                <input type="radio" name="answer" id="option${index}" value="${option}">
                <label for="option${index}">${option}</label>
            `;
            optionsContainer.appendChild(optionElement);
        });

        document.getElementById('submitBtn').addEventListener('click', checkAnswer);
        document.getElementById('hintBtn').addEventListener('click', toggleHint);
    }

    function updateProgress() {
        const progress = ((currentQuestion) / quizData.length) * 100;
        progressText.innerHTML = `
            <i class="fas spinner"></i> Pergunta ${currentQuestion + 1} de ${quizData.length}
        `;
        progressBar.style.width = `${progress}%`;
    }

    function toggleHint() {
        const hint = document.getElementById('hint');
        hint.style.display = hint.style.display === 'none' ? 'block' : 'none';
    }

    function checkAnswer() {
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        const feedback = document.getElementById('feedback');

        if (!selectedOption) {
            showFeedback('Por favor, selecione uma opção!', false);
            return;
        }

        const userAnswer = selectedOption.value;
        const correctAnswer = quizData[currentQuestion].answer;
        const isCorrect = userAnswer === correctAnswer;
        
        userAnswers.push({
            question: quizData[currentQuestion].question,
            userAnswer,
            correctAnswer,
            isCorrect
        });

        if (isCorrect) {
            score++;
            showFeedback('Resposta correta!', true);
            createConfetti();
        } else {
            showFeedback(`Resposta incorreta! A correta é: <strong>${correctAnswer}</strong>`, false);
        }

        highlightAnswers(correctAnswer);
        setTimeout(() => {
            currentQuestion++;
            loadQuestion();
        }, 1500);
    }

    function showFeedback(message, isCorrect) {
        const feedback = document.getElementById('feedback');
        feedback.innerHTML = `
            <i class="fas ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'}"></i> ${message}
            ${isCorrect ? '<i class="fas fa-smile"></i>' : ''}
        `;
        feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        
        if (!isCorrect) {
            feedback.style.animation = 'shake 0.5s ease';
            setTimeout(() => feedback.style.animation = '', 500);
        }
    }

    function highlightAnswers(correctAnswer) {
        document.querySelectorAll('.option').forEach(option => {
            option.style.pointerEvents = 'none';
            const input = option.querySelector('input');
            
            if (input.value === correctAnswer) {
                option.style.backgroundColor = 'rgba(46, 204, 113, 0.2)';
                option.style.border = '1px solid var(--correct-green)';
                option.querySelector('label').style.color = 'var(--correct-green)';
            } else if (input.checked && input.value !== correctAnswer) {
                option.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
                option.style.border = '1px solid var(--incorrect-red)';
                option.querySelector('label').style.color = 'var(--incorrect-red)';
            }
        });
    }

    function showResults() {
        const percentage = Math.round((score / quizData.length) * 100);
        const offset = 565.48 - (565.48 * percentage) / 100;
        
        quizContent.innerHTML = `
            <div class="results">
                <h2><i class="fas fa-trophy"></i> Quiz Concluído!</h2>
                
                <svg class="progress-circle" viewBox="0 0 200 200">
                    <circle class="circle-bg" cx="100" cy="100" r="90"/>
                    <circle class="circle-progress" cx="100" cy="100" r="90" style="--offset: ${offset};"/>
                    <text x="100" y="110" text-anchor="middle" font-size="40" fill="white" font-weight="bold">${percentage}%</text>
                </svg>
                
                <div class="score">Você acertou ${score} de ${quizData.length} perguntas</div>
                
                <div class="results-actions">
                    <button onclick="location.reload()" class="btn">
                        <i class="fas fa-redo"></i> Refazer Quiz
                    </button>
                    <button id="reviewBtn" class="btn btn-secondary">
                        <i class="fas fa-search"></i> Revisar Respostas
                    </button>
                    ${isAdmin ? `
                        <button id="adminBtn" class="btn btn-admin">
                            <i class="fas fa-cog"></i> Painel Admin
                        </button>
                    ` : ''}
                </div>
            </div>
            
            <div id="reviewContainer" class="review-container" style="display: none;"></div>
            <div id="adminPanel" class="admin-panel" style="display: none;"></div>
        `;

        createConfetti(true);
        setupResultsButtons();
    }

    function setupResultsButtons() {
        document.getElementById('reviewBtn').addEventListener('click', () => {
            const reviewContainer = document.getElementById('reviewContainer');
            reviewContainer.style.display = reviewContainer.style.display === 'none' ? 'block' : 'none';
            
            if (reviewContainer.style.display === 'block') {
                loadReview();
            }
        });

        if (isAdmin) {
            document.getElementById('adminBtn').addEventListener('click', () => {
                const adminPanel = document.getElementById('adminPanel');
                adminPanel.style.display = adminPanel.style.display === 'none' ? 'block' : 'none';
                
                if (adminPanel.style.display === 'block') {
                    loadAdminPanel();
                }
            });
        }
    }

    function loadReview() {
        const reviewContainer = document.getElementById('reviewContainer');
        reviewContainer.innerHTML = `
            <div class="review-content">
                <h3><i class="fas fa-clipboard-list"></i> Detalhes das Respostas</h3>
                ${userAnswers.map((answer, index) => `
                    <div class="answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}">
                        <div class="question">${index + 1}. ${answer.question}</div>
                        <div class="user-answer">
                            <i class="fas ${answer.isCorrect ? 'fa-check' : 'fa-times'}"></i>
                            Sua resposta: ${answer.userAnswer}
                        </div>
                        ${!answer.isCorrect ? `
                            <div class="correct-answer">
                                <i class="fas fa-check"></i> Resposta correta: ${answer.correctAnswer}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    function loadAdminPanel() {
        const adminPanel = document.getElementById('adminPanel');
        adminPanel.innerHTML = `
            <div class="admin-content">
                <h3><i class="fas fa-cog"></i> Painel de Administração</h3>
                
                <div class="admin-actions">
                    <button id="refreshQuestions" class="btn btn-small">
                        <i class="fas fa-sync-alt"></i> Atualizar Lista
                    </button>
                </div>
                
                <div class="admin-tabs">
                    <button class="tab-btn active" data-tab="manage-questions">Gerenciar Perguntas</button>
                    <button class="tab-btn" data-tab="add-question">Adicionar Pergunta</button>
                </div>
                
                <div id="manage-questions" class="tab-content active">
                    <div class="search-container">
                        <input type="text" id="questionSearch" placeholder="Buscar perguntas...">
                        <button id="searchBtn" class="btn btn-small"><i class="fas fa-search"></i></button>
                    </div>
                    <div id="questionsList" class="questions-list"></div>
                </div>
                
                <div id="add-question" class="tab-content">
                    <form id="questionForm" class="admin-form">
                        <input type="hidden" id="questionId">
                        <div class="form-group">
                            <label for="questionText">Pergunta:</label>
                            <textarea id="questionText" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="questionOptions">Opções (uma por linha):</label>
                            <textarea id="questionOptions" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="correctAnswer">Resposta Correta:</label>
                            <input type="text" id="correctAnswer" required>
                        </div>
                        <div class="form-group">
                            <label for="questionHint">Dica (opcional):</label>
                            <input type="text" id="questionHint">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> Salvar
                            </button>
                            <button type="button" id="cancelEdit" class="btn btn-secondary">
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Configura eventos
        document.getElementById('refreshQuestions').addEventListener('click', loadQuestionsList);
        document.getElementById('searchBtn').addEventListener('click', searchQuestions);
        document.getElementById('questionSearch').addEventListener('keyup', function(e) {
            if (e.key === 'Enter') searchQuestions();
        });
        
        document.getElementById('questionForm').addEventListener('submit', function(e) {
            e.preventDefault();
            saveQuestion();
        });
        
        document.getElementById('cancelEdit').addEventListener('click', function() {
            document.querySelector('.tab-btn[data-tab="manage-questions"]').click();
            resetQuestionForm();
        });

        setupAdminTabs();
        loadQuestionsList();
    }

    function setupAdminTabs() {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn, .tab-content').forEach(el => {
                    el.classList.remove('active');
                });
                
                tab.classList.add('active');
                const tabId = tab.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    function loadQuestionsList() {
        const questionsList = document.getElementById('questionsList');
        questionsList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Carregando perguntas...</div>';
        
        // Simula delay de carregamento
        setTimeout(() => {
            if (quizData.length === 0) {
                questionsList.innerHTML = '<div class="no-questions">Nenhuma pergunta cadastrada</div>';
                return;
            }
            
            questionsList.innerHTML = `
                <div class="questions-table">
                    <div class="table-header">
                        <div>ID</div>
                        <div>Pergunta</div>
                        <div>Ações</div>
                    </div>
                    ${quizData.map(question => `
                        <div class="question-item" data-id="${question.id}">
                            <div>${question.id}</div>
                            <div>${question.question}</div>
                            <div class="actions">
                                <button class="btn-edit" data-id="${question.id}">
                                    <i class="fas fa-edit"></i> Editar
                                </button>
                                <button class="btn-delete" data-id="${question.id}">
                                    <i class="fas fa-trash"></i> Excluir
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            // Configura eventos dos botões
            document.querySelectorAll('.btn-edit').forEach(btn => {
                btn.addEventListener('click', function() {
                    const questionId = this.getAttribute('data-id');
                    editQuestion(questionId);
                });
            });
            
            document.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', function() {
                    const questionId = this.getAttribute('data-id');
                    deleteQuestion(questionId);
                });
            });
        }, 500);
    }

    function editQuestion(questionId) {
        const question = quizData.find(q => q.id == questionId);
        if (!question) return;

        // Preenche o formulário
        document.getElementById('questionId').value = question.id;
        document.getElementById('questionText').value = question.question;
        document.getElementById('questionOptions').value = question.options.join('\n');
        document.getElementById('correctAnswer').value = question.answer;
        document.getElementById('questionHint').value = question.hint || '';
        
        // Muda para a aba de edição
        document.querySelector('.tab-btn[data-tab="add-question"]').click();
        document.querySelector('#questionForm button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Atualizar';
    }

    function saveQuestion() {
        const questionId = document.getElementById('questionId').value;
        const questionText = document.getElementById('questionText').value.trim();
        const optionsText = document.getElementById('questionOptions').value;
        const correctAnswer = document.getElementById('correctAnswer').value.trim();
        const hint = document.getElementById('questionHint').value.trim();

        // Validação básica
        if (!questionText || !optionsText || !correctAnswer) {
            showAdminMessage('Preencha todos os campos obrigatórios!', 'error');
            return;
        }

        // Processa as opções
        const options = optionsText.split('\n')
            .map(opt => opt.trim())
            .filter(opt => opt !== '');

        if (!options.includes(correctAnswer)) {
            showAdminMessage('A resposta correta deve estar entre as opções!', 'error');
            return;
        }

        const questionData = {
            id: questionId || Date.now(),
            question: questionText,
            options: options,
            answer: correctAnswer,
            hint: hint || ''
        };

        showAdminLoading();
        
        // Simula operação assíncrona
        setTimeout(() => {
            if (questionId) {
                // Atualiza pergunta existente
                const index = quizData.findIndex(q => q.id == questionId);
                if (index !== -1) {
                    quizData[index] = questionData;
                    showAdminMessage('Pergunta atualizada com sucesso!', 'success');
                }
            } else {
                // Adiciona nova pergunta
                quizData.push(questionData);
                showAdminMessage('Pergunta adicionada com sucesso!', 'success');
            }

            // Atualiza a interface
            resetQuestionForm();
            loadQuestionsList();
            document.querySelector('.tab-btn[data-tab="manage-questions"]').click();
        }, 800);
    }

    function deleteQuestion(questionId) {
        if (!confirm('Tem certeza que deseja excluir esta pergunta permanentemente?')) {
            return;
        }

        showAdminLoading();
        
        // Simula operação assíncrona
        setTimeout(() => {
            quizData = quizData.filter(q => q.id != questionId);
            showAdminMessage('Pergunta excluída com sucesso!', 'success');
            loadQuestionsList();
        }, 800);
    }

    function searchQuestions() {
        const searchTerm = document.getElementById('questionSearch').value.toLowerCase();
        const filtered = quizData.filter(q => 
            q.question.toLowerCase().includes(searchTerm) || 
            q.options.some(opt => opt.toLowerCase().includes(searchTerm))
        );
        
        const questionsList = document.getElementById('questionsList');
        
        if (filtered.length === 0) {
            questionsList.innerHTML = '<div class="no-results">Nenhuma pergunta encontrada</div>';
            return;
        }
        
        questionsList.innerHTML = `
            <div class="questions-table">
                <div class="table-header">
                    <div>ID</div>
                    <div>Pergunta</div>
                    <div>Ações</div>
                </div>
                ${filtered.map(question => `
                    <div class="question-item" data-id="${question.id}">
                        <div>${question.id}</div>
                        <div>${question.question}</div>
                        <div class="actions">
                            <button class="btn-edit" data-id="${question.id}">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="btn-delete" data-id="${question.id}">
                                <i class="fas fa-trash"></i> Excluir
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function resetQuestionForm() {
        document.getElementById('questionForm').reset();
        document.getElementById('questionId').value = '';
        document.querySelector('#questionForm button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Salvar';
    }

    function showAdminLoading() {
        const adminPanel = document.getElementById('adminPanel');
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'admin-loading';
        loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        adminPanel.appendChild(loadingDiv);
        
        setTimeout(() => {
            if (loadingDiv.parentNode === adminPanel) {
                adminPanel.removeChild(loadingDiv);
            }
        }, 3000);
    }

    function showAdminMessage(message, type) {
        const adminPanel = document.getElementById('adminPanel');
        const messageDiv = document.createElement('div');
        messageDiv.className = `admin-message ${type}`;
        messageDiv.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                             type === 'error' ? 'fa-times-circle' : 
                             'fa-info-circle'}"></i>
            ${message}
        `;
        adminPanel.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode === adminPanel) {
                adminPanel.removeChild(messageDiv);
            }
        }, 5000);
    }

    function showNoQuestionsMessage() {
        quizContent.innerHTML = `
            <div class="no-questions">
                <h3><i class="fas fa-exclamation-triangle"></i> Nenhuma pergunta disponível</h3>
                <p>O quiz não possui perguntas cadastradas no momento.</p>
                ${isAdmin ? `
                    <button id="addFirstQuestion" class="btn">
                        <i class="fas fa-plus"></i> Adicionar Primeira Pergunta
                    </button>
                ` : ''}
            </div>
        `;

        if (isAdmin) {
            document.getElementById('addFirstQuestion').addEventListener('click', () => {
                document.querySelector('.tab-btn[data-tab="add-question"]').click();
            });
        }
    }

    function createConfetti(intense = false) {
        const count = intense ? 200 : 50;
        const defaults = {
            spread: 60,
            ticks: 100,
            gravity: 0.5,
            decay: 0.94,
            startVelocity: 30,
            colors: ['#3776AB', '#FFD43B', '#2ECC71', '#E74C3C', '#FFFFFF']
        };

        for (let i = 0; i < count; i++) {
            confetti({
                ...defaults,
                particleCount: 1,
                angle: Math.random() * 360,
                origin: { x: Math.random(), y: Math.random() - 0.2 }
            });
        }
    }
    

   // ... (seu código anterior permanece o mesmo)

    // Adiciona CSS
    const style = document.createElement('style');
    style.textContent = `
        #floatingAdminBtn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #6e48aa;
            color: white;
            border: none;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s ease;
        }
        
        #floatingAdminBtn.admin-active {
            background: #2ecc71;
        }
        
        #floatingAdminBtn:hover {
            transform: scale(1.1);
        }
        
        .loading-container {
            text-align: center;
            padding: 20px;
        }
        
        .spinner {
            margin-bottom: 15px;
            font-size: 30px;
            color: #3776AB;
        }
        
        .question {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            font-weight: bold;
        }
        
        .options {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 1.5rem;
        }
        
        .option {
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .option:hover {
            background-color: rgb(1, 0, 88);
        }
        
        .feedback {
            margin-top: 1rem;
            padding: 10px;
            border-radius: 5px;
        }
        
        .correct {
            background-color: rgba(46, 204, 113, 0.2);
            color: #2ecc71;
        }
        
        .incorrect {
            background-color: rgba(231, 76, 60, 0.1);
            color: #e74c3c;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-5px); }
            40%, 80% { transform: translateX(5px); }
        }
        
        /* Estilos do painel admin */
        .admin-content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            margin-top: 20px;
        }
        
        .admin-tabs {
            display: flex;
            border-bottom: 1px solid #ddd;
            margin-bottom: 20px;
        }
        
        .tab-btn {
            padding: 10px 20px;
            background: none;
            border: none;
            cursor: pointer;
            border-bottom: 3px solid transparent;
            transition: all 0.3s;
        }
        
        .tab-btn.active {
            border-bottom: 3px solid #6e48aa;
            font-weight: bold;
            color: #6e48aa;
        }
        
        .tab-content {
            display: none;
            padding: 15px 0;
        }
        
        .tab-content.active {
            display: block;
        }
        
        .search-container {
            display: flex;
            margin-bottom: 15px;
        }
        
        .search-container input {
            flex: 1;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px 0 0 4px;
        }
        
        .search-container button {
            border-radius: 0 4px 4px 0;
        }
        
        .questions-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .questions-table .table-header {
            display: flex;
            font-weight: bold;
            padding: 10px;
            background: rgb(129, 155, 232);
            border-radius: 4px;
        }
        
        .questions-table .question-item {
            display: flex;
            padding: 10px;
            border-bottom: 1px solid #eee;
            align-items: center;
        }
        
        .questions-table .question-item > div {
            flex: 1;
            padding: 5px;
        }
        
        .questions-table .actions {
            display: flex;
            gap: 5px;
        }
        
        .btn-edit {
            background: #3498db;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .btn-delete {
            background: #e74c3c;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .admin-form .form-group {
            margin-bottom: 15px;
        }
        
        .admin-form label {
            color: #000000;
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        
        .admin-form textarea,
        .admin-form input[type="text"] {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        .admin-form textarea {
            min-height: 100px;
            resize: vertical;
        }
        
        .form-actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        
        .admin-loading {
            padding: 15px;
            text-align: center;
            color: #6e48aa;
        }
        
        .admin-message {
            padding: 10px 15px;
            margin: 10px 0;
            border-radius: 4px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .admin-message.success {
            background: rgba(46, 204, 113, 0.2);
            color: #2ecc71;
            border-left: 3px solid #2ecc71;
        }
        
        .admin-message.error {
            background: rgba(231, 76, 60, 0.1);
            color: #e74c3c;
            border-left: 3px solid #e74c3c;
        }
        
        .admin-message.info {
            background: rgba(52, 152, 219, 0.1);
            color: #3498db;
            border-left: 3px solid #3498db;
        }
            .admin-login {
    background: rgba(15, 32, 39, 0.8); /* Cor de fundo do tema Python com transparência */
    padding: 2rem;
    border-radius: 10px;
    max-width: 500px;
    margin: 2rem auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    color: white;
    border: 1px solid rgba(55, 118, 171, 0.5);
}

.admin-login h2 {
    color: #FFD43B; /* Amarelo Python para o título */
    text-align: center;
    margin-bottom: 1.5rem;
}

.admin-login .form-group label {
    color: #ffffff;
    display: block;
    margin-bottom: 0.5rem;
}

.admin-login input[type="text"],
.admin-login input[type="password"] {
    width: 100%;
    padding: 10px;
    margin-bottom: 1rem;
    border: 1px solid #3776AB;
    border-radius: 5px;
    background: rgba(44, 83, 100, 0.5);
    color: white;
}

.admin-login button[type="submit"] {
    background: #3776AB; /* Azul Python */
    color: white;
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
}

.admin-login button[type="submit"]:hover {
    background: #2c5364; /* Tom mais escuro do azul Python */
}
    `;
    document.head.appendChild(style);
});

// Inicialize o fundo quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new PythonBackground();
});
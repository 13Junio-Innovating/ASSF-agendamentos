// Dados mockados para simular um banco de dados
let schedules = [];
const mockUsers = {
  'admin': 'admin',
  'ADMIN': 'admin',
  'Admin': 'admin'
};

// Instrutores mockados
const instructors = [
  { name: 'João Silva', specialty: 'Surf Iniciante' },
  { name: 'Maria Santos', specialty: 'Surf Avançado' },
  { name: 'Pedro Oliveira', specialty: 'Longboard' }
];

// Função para mostrar o modal de agendamento
function showScheduleModal(type) {
  document.getElementById('modalidade').value = type;
  const disabilityField = document.getElementById('disabilityField');
  
  // Show/hide disability field based on modality
  if (type === 'aluno') {
    disabilityField.style.display = 'block';
  } else {
    disabilityField.style.display = 'none';
  }
  
  const modal = new bootstrap.Modal(document.getElementById('scheduleModal'));
  modal.show();
}

// Função para mostrar o modal de login
function showLoginModal() {
  const modal = new bootstrap.Modal(document.getElementById('loginModal'));
  modal.show();
}

// Melhorar a validação do login
function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (!username || !password) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  if (mockUsers[username.toLowerCase()] === password) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('adminUser', username);
    bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
    window.location.href = 'admin.html';
  } else {
    alert('Usuário ou senha inválidos!');
  }
}

// Accessibility Functions
function toggleHighContrast() {
  document.body.classList.toggle('high-contrast');
  const stylesheet = document.getElementById('high-contrast-stylesheet');
  stylesheet.disabled = !stylesheet.disabled;
  
  // Save preference
  localStorage.setItem('highContrast', document.body.classList.contains('high-contrast'));
  
  // Announce change to screen readers
  announceToScreenReader('Modo de alto contraste ' + 
    (document.body.classList.contains('high-contrast') ? 'ativado' : 'desativado'));
}

function increaseFontSize() {
  const elements = document.querySelectorAll('body, p, h1, h2, h3, h4, h5, h6, button, input, select, textarea');
  elements.forEach(el => {
    const currentSize = parseFloat(window.getComputedStyle(el).fontSize);
    el.style.fontSize = (currentSize * 1.1) + 'px';
  });
  announceToScreenReader('Tamanho do texto aumentado');
}

function decreaseFontSize() {
  const elements = document.querySelectorAll('body, p, h1, h2, h3, h4, h5, h6, button, input, select, textarea');
  elements.forEach(el => {
    const currentSize = parseFloat(window.getComputedStyle(el).fontSize);
    el.style.fontSize = (currentSize * 0.9) + 'px';
  });
  announceToScreenReader('Tamanho do texto diminuído');
}

function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'alert');
  announcement.setAttribute('aria-live', 'polite');
  announcement.classList.add('sr-only');
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

// Enhanced keyboard navigation
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    if (e.target.classList.contains('hover-card')) {
      e.target.click();
    }
  }
  
  if (e.key === 'Escape') {
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach(modal => {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) modalInstance.hide();
    });
  }
});

// Enhanced form validation with accessibility
function validateForm(form) {
  const invalidElements = form.querySelectorAll(':invalid');
  if (invalidElements.length > 0) {
    const firstInvalid = invalidElements[0];
    firstInvalid.focus();
    const errorMessage = `Por favor, preencha o campo ${firstInvalid.getAttribute('aria-label') || firstInvalid.getAttribute('name')}`;
    announceToScreenReader(errorMessage);
    return false;
  }
  return true;
}

// Adicionar validação de formulário
function saveSchedule() {
  const form = document.getElementById('scheduleForm');
  if (!validateForm(form)) return;
  
  const formData = new FormData(form);
  const schedule = {
    id: Date.now(),
    modalidade: formData.get('modalidade'),
    nome: formData.get('nome'),
    email: formData.get('email'),
    telefone: formData.get('telefone'),
    tipoDeficiencia: formData.get('modalidade') === 'aluno' ? formData.get('tipoDeficiencia') : '',
    data: formData.get('data'),
    horario: formData.get('horario'),
    status: 'Pendente',
    dataCriacao: new Date().toISOString()
  };

  schedules.push(schedule);
  localStorage.setItem('schedules', JSON.stringify(schedules));
  
  alert('Agendamento realizado com sucesso!');
  bootstrap.Modal.getInstance(document.getElementById('scheduleModal')).hide();
  form.reset();
}

// Carregar agendamentos do localStorage ao iniciar
document.addEventListener('DOMContentLoaded', () => {
  const savedSchedules = localStorage.getItem('schedules');
  if (savedSchedules) {
    schedules = JSON.parse(savedSchedules);
  }
  
  if (localStorage.getItem('highContrast') === 'true') {
    toggleHighContrast();
  }
});
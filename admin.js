// Verificar autenticação
function checkAuth() {
    if (!localStorage.getItem('isLoggedIn')) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  }
  
  // Função para fazer logout
  function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('adminUser');
    window.location.href = 'index.html';
  }
  
  // Função para carregar e exibir os agendamentos
  function loadSchedules() {
    const schedules = JSON.parse(localStorage.getItem('schedules')) || [];
    const tableBody = document.getElementById('scheduleTableBody');
    tableBody.innerHTML = '';
  
    schedules.forEach(schedule => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${schedule.id}</td>
        <td>${schedule.modalidade}</td>
        <td>${schedule.nome}</td>
        <td>${schedule.email}</td>
        <td>${schedule.telefone}</td>
        <td>${formatDate(schedule.data)}</td>
        <td>${schedule.horario}</td>
        <td>
          <select class="form-select form-select-sm status-select" data-id="${schedule.id}">
            <option value="Pendente" ${schedule.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
            <option value="Confirmado" ${schedule.status === 'Confirmado' ? 'selected' : ''}>Confirmado</option>
            <option value="Cancelado" ${schedule.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
          </select>
        </td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="deleteSchedule(${schedule.id})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  
    // Adicionar event listeners para os selects de status
    document.querySelectorAll('.status-select').forEach(select => {
      select.addEventListener('change', (e) => {
        updateStatus(parseInt(e.target.dataset.id), e.target.value);
      });
    });
  }
  
  // Função para atualizar o status do agendamento
  function updateStatus(id, newStatus) {
    const schedules = JSON.parse(localStorage.getItem('schedules')) || [];
    const index = schedules.findIndex(s => s.id === id);
    
    if (index !== -1) {
      schedules[index].status = newStatus;
      localStorage.setItem('schedules', JSON.stringify(schedules));
    }
  }
  
  // Função para deletar um agendamento
  function deleteSchedule(id) {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      const schedules = JSON.parse(localStorage.getItem('schedules')) || [];
      const filteredSchedules = schedules.filter(s => s.id !== id);
      localStorage.setItem('schedules', JSON.stringify(filteredSchedules));
      loadSchedules();
    }
  }
  
  // Função para aplicar filtros
  function applyFilters() {
    const modalidade = document.getElementById('filterModalidade').value;
    const status = document.getElementById('filterStatus').value;
    const data = document.getElementById('filterData').value;
    
    let schedules = JSON.parse(localStorage.getItem('schedules')) || [];
    
    if (modalidade) {
      schedules = schedules.filter(s => s.modalidade === modalidade);
    }
    
    if (status) {
      schedules = schedules.filter(s => s.status === status);
    }
    
    if (data) {
      schedules = schedules.filter(s => s.data === data);
    }
    
    displayFilteredSchedules(schedules);
  }
  
  // Função para exibir os agendamentos filtrados
  function displayFilteredSchedules(schedules) {
    const tableBody = document.getElementById('scheduleTableBody');
    tableBody.innerHTML = '';
  
    if (schedules.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" class="text-center">
            Nenhum agendamento encontrado
          </td>
        </tr>
      `;
      return;
    }
  
    schedules.forEach(schedule => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${schedule.id}</td>
        <td>${schedule.modalidade}</td>
        <td>${schedule.nome}</td>
        <td>${schedule.email}</td>
        <td>${schedule.telefone}</td>
        <td>${formatDate(schedule.data)}</td>
        <td>${schedule.horario}</td>
        <td>
          <select class="form-select form-select-sm status-select" data-id="${schedule.id}">
            <option value="Pendente" ${schedule.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
            <option value="Confirmado" ${schedule.status === 'Confirmado' ? 'selected' : ''}>Confirmado</option>
            <option value="Cancelado" ${schedule.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
          </select>
        </td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="deleteSchedule(${schedule.id})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  
    // Adicionar event listeners para os selects de status
    document.querySelectorAll('.status-select').forEach(select => {
      select.addEventListener('change', (e) => {
        updateStatus(parseInt(e.target.dataset.id), e.target.value);
      });
    });
  }
  
  // Função auxiliar para formatar a data
  function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  }
  
  // Função para exportar para Excel (.xls)
  function exportToExcel() {
    const schedules = JSON.parse(localStorage.getItem('schedules')) || [];
    
    // Create Excel-compatible content
    let excelContent = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel'>";
    excelContent += "<head><meta charset='UTF-8'></head><body>";
    excelContent += "<table border='1'>";
    
    // Add headers
    excelContent += "<tr>";
    excelContent += "<th>ID</th>";
    excelContent += "<th>Modalidade</th>";
    excelContent += "<th>Nome</th>";
    excelContent += "<th>Email</th>";
    excelContent += "<th>Telefone</th>";
    excelContent += "<th>Tipo de Deficiência</th>";
    excelContent += "<th>Data</th>";
    excelContent += "<th>Horário</th>";
    excelContent += "<th>Status</th>";
    excelContent += "<th>Data de Criação</th>";
    excelContent += "</tr>";
    
    // Add data rows
    schedules.forEach(schedule => {
      excelContent += "<tr>";
      excelContent += `<td>${schedule.id}</td>`;
      excelContent += `<td>${schedule.modalidade}</td>`;
      excelContent += `<td>${schedule.nome}</td>`;
      excelContent += `<td>${schedule.email}</td>`;
      excelContent += `<td>${schedule.telefone}</td>`;
      excelContent += `<td>${schedule.tipoDeficiencia || 'N/A'}</td>`;
      excelContent += `<td>${formatDate(schedule.data)}</td>`;
      excelContent += `<td>${schedule.horario}</td>`;
      excelContent += `<td>${schedule.status}</td>`;
      excelContent += `<td>${new Date(schedule.dataCriacao).toLocaleString()}</td>`;
      excelContent += "</tr>";
    });
    
    excelContent += "</table></body></html>";
    
    // Create download link
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "agendamentos.xls";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  // Verificar autenticação ao carregar a página
  document.addEventListener('DOMContentLoaded', () => {
    if (checkAuth()) {
      loadSchedules();
      // Mostrar nome do usuário logado
      const adminUser = localStorage.getItem('adminUser');
      if (adminUser) {
        document.getElementById('adminUsername').textContent = adminUser;
      }
    }
  });
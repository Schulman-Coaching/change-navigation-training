/* ============================================================
   CNT Dashboard — JavaScript Engine
   All 6 views + state management + localStorage persistence
   ============================================================ */

const STATE_KEY = 'cnt_dashboard_state';
const CIRCUMFERENCE = 2 * Math.PI * 26; // r=26

let tasks = [];
let sites = [];
let meta = {};
let taskState = {};  // { taskId: status }

// ─── Init ──────────────────────────────────────────────
async function init() {
  await loadData();
  hydrateState();
  renderKanban();
  renderCalendar();
  updateHeader();
  setupNav();
  setupModal();
}

// ─── Data Loading ──────────────────────────────────────
async function loadData() {
  const resp = await fetch('tasks.json');
  const data = await resp.json();
  tasks = data.tasks;
  sites = data.sites;
  meta = data.meta;
}

function hydrateState() {
  const saved = localStorage.getItem(STATE_KEY);
  if (saved) {
    taskState = JSON.parse(saved);
  }
  // Apply saved state to tasks
  tasks.forEach(t => {
    if (taskState[t.id] && taskState[t.id] !== t.status) {
      t.status = taskState[t.id];
    }
  });
}

function persistState() {
  const state = {};
  tasks.forEach(t => { state[t.id] = t.status; });
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
  taskState = state;
}

// ─── Header Progress ───────────────────────────────────
function updateHeader() {
  const done = tasks.filter(t => t.status === 'done').length;
  const pct = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
  const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;

  const circle = document.getElementById('header-progress-circle');
  circle.setAttribute('stroke-dasharray', CIRCUMFERENCE);
  circle.setAttribute('stroke-dashoffset', offset);

  document.getElementById('header-progress-text').textContent = pct + '%';
}

// ─── Navigation ────────────────────────────────────────
function setupNav() {
  const buttons = document.querySelectorAll('.nav-btn');
  const views = document.querySelectorAll('.view');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      views.forEach(v => v.classList.add('hidden'));
      const viewId = 'view-' + btn.dataset.view;
      document.getElementById(viewId).classList.remove('hidden');

      // Lazy-render views when first opened
      if (btn.dataset.view === 'calendar') renderCalendar();
      if (btn.dataset.view === 'automation') renderAutomationMatrix();
      if (btn.dataset.view === 'sites') renderSites();
      if (btn.dataset.view === 'dependencies') renderDependencies();
      if (btn.dataset.view === 'stats') renderStats();
    });
  });
}

// ─── Kanban Board ──────────────────────────────────────
function renderKanban() {
  const columns = {
    pending: document.getElementById('pending-column'),
    in_progress: document.getElementById('in-progress-column'),
    review: document.getElementById('review-column'),
    done: document.getElementById('done-column'),
  };

  // Clear
  Object.values(columns).forEach(col => { col.innerHTML = ''; });

  // Group tasks by status
  const grouped = { pending: [], in_progress: [], review: [], done: [] };
  tasks.forEach(t => {
    const status = t.status || 'pending';
    if (grouped[status]) grouped[status].push(t);
  });

  // Render each column
  Object.entries(grouped).forEach(([status, taskList]) => {
    taskList.forEach(task => {
      columns[status].appendChild(createTaskCard(task));
    });
  });

  // Update counts
  Object.entries(grouped).forEach(([status, taskList]) => {
    const badge = document.getElementById(status.replace('_', '-') + '-count');
    if (badge) badge.textContent = taskList.length;
  });

  // Setup drag-and-drop
  setupDragDrop();
}

function createTaskCard(task) {
  const card = document.createElement('div');
  card.className = 'task-card';
  card.draggable = true;
  card.dataset.taskId = task.id;

  const badgeClass = task.category === 'automated' ? 'badge-auto'
    : task.category === 'semi' ? 'badge-semi'
    : 'badge-human';

  const badgeText = task.category === 'automated' ? 'Auto'
    : task.category === 'semi' ? 'Semi'
    : 'Human';

  const siteColor = sites.find(s => s.id === task.site);
  const dotColor = siteColor ? siteColor.accent
    : task.site === 'all' ? '#777777' : '#777777';

  card.innerHTML = `
    <div class="card-id">${task.id}</div>
    <div class="card-title">${task.title}</div>
    <div class="card-meta">
      <span class="card-badge ${badgeClass}">${badgeText}</span>
      <span class="card-site-dot" style="background:${dotColor}"></span>
      <span class="card-week">Wk ${task.week}</span>
    </div>
  `;

  card.addEventListener('click', (e) => {
    if (!card.classList.contains('dragging')) {
      openTaskModal(task);
    }
  });

  // Drag events
  card.addEventListener('dragstart', handleDragStart);
  card.addEventListener('dragend', handleDragEnd);

  return card;
}

function setupDragDrop() {
  const columns = document.querySelectorAll('.column-body');

  columns.forEach(col => {
    col.addEventListener('dragover', (e) => {
      e.preventDefault();
      col.classList.add('drag-over');
    });

    col.addEventListener('dragleave', () => {
      col.classList.remove('drag-over');
    });

    col.addEventListener('drop', (e) => {
      e.preventDefault();
      col.classList.remove('drag-over');
      const taskId = e.dataTransfer.getData('text/plain');
      const newStatus = col.closest('.kanban-column').dataset.status;
      moveTask(taskId, newStatus);
    });
  });
}

let dragTaskId = null;

function handleDragStart(e) {
  dragTaskId = this.dataset.taskId;
  this.classList.add('dragging');
  e.dataTransfer.setData('text/plain', this.dataset.taskId);
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd() {
  this.classList.remove('dragging');
  dragTaskId = null;
}

function moveTask(taskId, newStatus) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  const oldStatus = task.status;
  task.status = newStatus;
  persistState();
  renderKanban();
  updateHeader();
  showToast(`${task.id} → ${formatStatus(newStatus)}`);
}

function formatStatus(s) {
  const map = {
    pending: 'Pending',
    in_progress: 'In Progress',
    review: 'Review',
    done: 'Done'
  };
  return map[s] || s;
}

// ─── Calendar View ─────────────────────────────────────
let calendarInstance = null;

function renderCalendar() {
  const container = document.getElementById('calendar-container');
  if (container.innerHTML !== '' && calendarInstance) {
    calendarInstance.refetchEvents();
    return;
  }

  const weekStart = new Date('2026-05-26');
  const weekEnd = new Date('2026-08-24');

  const events = tasks.map(t => {
    const taskDate = new Date(weekStart);
    taskDate.setDate(taskDate.getDate() + (t.week - 1) * 7);

    const colors = {
      automated: '#3ec8a0',
      semi: '#c8963e',
      human: '#8b9dc3'
    };

    const statusColors = {
      done: '#3ec870',
      in_progress: '#c8963e',
      review: '#c83e6b',
      pending: colors[t.category] || '#777777'
    };

    return {
      id: t.id,
      title: t.id + ': ' + t.title.substring(0, 40),
      start: taskDate.toISOString().split('T')[0],
      end: taskDate.toISOString().split('T')[0],
      backgroundColor: statusColors[t.status] || statusColors.pending,
      borderColor: 'transparent',
      textColor: '#ffffff',
      extendedProps: { task: t }
    };
  });

  calendarInstance = new FullCalendar.Calendar(container, {
    initialView: 'dayGridMonth',
    initialDate: '2026-06-01',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,listWeek'
    },
    events: events,
    eventClick: function(info) {
      openTaskModal(info.event.extendedProps.task);
    },
    height: 'auto',
    validRange: {
      start: '2026-05-26',
      end: '2026-08-24'
    }
  });

  calendarInstance.render();
}

// ─── Automation Matrix ─────────────────────────────────
let automationChart = null;

function renderAutomationMatrix() {
  const ctx = document.getElementById('automation-chart');
  if (!ctx) return;

  const autoValue = { automated: 10, semi: 5, human: 1 };

  const datasets = [
    { label: 'Automated', data: [], bg: '#3ec8a0', border: '#3ec8a0' },
    { label: 'Semi-Auto', data: [], bg: '#c8963e', border: '#c8963e' },
    { label: 'Human Only', data: [], bg: '#8b9dc3', border: '#8b9dc3' }
  ];

  tasks.forEach(t => {
    const ds = datasets.find(d => d.label === (t.category === 'automated' ? 'Automated' : t.category === 'semi' ? 'Semi-Auto' : 'Human Only'));
    ds.data.push({
      x: t.hours,
      y: autoValue[t.category],
      label: t.id,
      title: t.title
    });
  });

  if (automationChart) automationChart.destroy();

  automationChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: datasets.map(ds => ({
        label: ds.label,
        data: ds.data.map(d => ({ x: d.x, y: d.y })),
        backgroundColor: ds.bg + '99',
        borderColor: ds.border,
        borderWidth: 1,
        pointRadius: 8,
        pointHoverRadius: 12
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#777777', font: { family: 'Inter', size: 12 } }
        },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              const ds = datasets[ctx.datasetIndex];
              const d = ds.data[ctx.dataIndex];
              return d.label + ': ' + d.title.substring(0, 50);
            }
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Effort (hours)', color: '#777777' },
          ticks: { color: '#555555', stepSize: 1 },
          grid: { color: '#222222' },
          min: 0,
          max: 6
        },
        y: {
          title: { display: true, text: 'Automation Potential', color: '#777777' },
          ticks: {
            color: '#555555',
            stepSize: 1,
            callback: function(v) {
              if (v === 10) return 'Full';
              if (v === 5) return 'Semi';
              if (v === 1) return 'Manual';
              return '';
            }
          },
          grid: { color: '#222222' },
          min: 0,
          max: 11
        }
      }
    }
  });
}

// ─── Site Status ───────────────────────────────────────
function renderSites() {
  const grid = document.getElementById('sites-grid');
  if (!grid) return;

  grid.innerHTML = '';

  sites.forEach(site => {
    const siteTasks = tasks.filter(t => t.site === site.id || t.site === 'all');
    const siteDone = siteTasks.filter(t => t.status === 'done').length;
    const sitePct = siteTasks.length > 0 ? Math.round((siteDone / siteTasks.length) * 100) : 0;

    const card = document.createElement('div');
    card.className = 'site-card';
    card.style.borderLeftColor = site.accent;

    card.innerHTML = `
      <div class="site-name" style="color:${site.accent}">${site.name}</div>
      <div class="site-audience">${site.audience}</div>
      <div class="site-tagline">"${site.tagline}"</div>
      <span class="site-status-badge ${site.status === 'launch-ready' ? 'launch-ready' : 'scaffolded'}">${site.status}</span>
      <div class="site-stats" style="margin-top:16px">
        <div class="stat-item">
          <div class="stat-value" style="color:${site.accent}">${site.pages_built}</div>
          <div class="stat-label">Pages</div>
        </div>
        <div class="stat-item">
          <div class="stat-value" style="color:${site.accent}">${site.blog_posts}</div>
          <div class="stat-label">Blog Posts</div>
        </div>
        <div class="stat-item">
          <div class="stat-value" style="color:${site.accent}">${sitePct}%</div>
          <div class="stat-label">Tasks Done</div>
        </div>
      </div>
      <div class="site-missing">
        <h5>Missing</h5>
        <ul>
          ${site.missing.map(m => `<li>${m}</li>`).join('')}
        </ul>
      </div>
    `;

    grid.appendChild(card);
  });
}

// ─── Dependencies ──────────────────────────────────────
let depChart = null;

function renderDependencies() {
  const depData = {};
  const reversedMap = {};

  tasks.forEach(t => {
    depData[t.id] = { title: t.title, deps: [], status: t.status };
    reversedMap[t.id] = [];
  });

  tasks.forEach(t => {
    t.dependencies.forEach(depId => {
      if (depData[t.id]) depData[t.id].deps.push(depId);
      if (reversedMap[depId]) reversedMap[depId].push(t.id);
    });
    depData[t.id].status = t.status;
  });

  // Render dep list
  const list = document.getElementById('dep-list');
  if (list) {
    list.innerHTML = '<h3>Task Dependencies</h3>';

    Object.entries(depData)
      .filter(([_, d]) => d.deps.length > 0)
      .sort((a, b) => b[1].deps.length - a[1].deps.length)
      .forEach(([id, d]) => {
        const block = document.createElement('div');
        block.className = 'dep-block';

        const statusClass = d.status === 'done' ? 'ready'
          : d.deps.every(depId => depData[depId] && depData[depId].status === 'done') ? 'ready'
          : 'blocked';

        block.innerHTML = `
          <div class="dep-header">${id}: ${d.title.substring(0, 40)}</div>
          <ul class="dep-children">
            ${d.deps.map(depId => {
              const depTask = depData[depId];
              const depDone = depTask && depTask.status === 'done';
              return `<li class="${depDone ? 'ready' : 'blocked'}">↳ ${depId}${depTask ? ': ' + depTask.title.substring(0, 30) : ''} ${depDone ? '✓' : '✗'}</li>`;
            }).join('')}
          </ul>
        `;
        list.appendChild(block);
      });
  }

  // Render dep bar chart
  const ctx = document.getElementById('dep-chart');
  if (!ctx) return;

  const depCounts = Object.entries(depData)
    .filter(([_, d]) => d.deps.length > 0)
    .sort((a, b) => b[1].deps.length - a[1].deps.length)
    .slice(0, 12);

  if (depChart) depChart.destroy();

  depChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: depCounts.map(([id]) => id),
      datasets: [{
        label: 'Dependencies',
        data: depCounts.map(([_, d]) => d.deps.length),
        backgroundColor: depCounts.map(([id, d]) => {
          const allDone = d.deps.every(depId => depData[depId] && depData[depId].status === 'done');
          return allDone ? '#3ec87099' : '#c83e6b99';
        }),
        borderColor: depCounts.map(([id, d]) => {
          const allDone = d.deps.every(depId => depData[depId] && depData[depId].status === 'done');
          return allDone ? '#3ec870' : '#c83e6b';
        }),
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: { color: '#555555', stepSize: 1 },
          grid: { color: '#222222' }
        },
        y: {
          ticks: { color: '#777777', font: { size: 11 } },
          grid: { color: '#222222' }
        }
      }
    }
  });
}

// ─── Stats View ────────────────────────────────────────
let categoryChart = null;
let weekChart = null;
let siteChart = null;

function renderStats() {
  const done = tasks.filter(t => t.status === 'done').length;
  const totalHours = tasks.reduce((sum, t) => sum + (t.hours || 0), 0);
  const autoPct = tasks.length > 0
    ? Math.round((tasks.filter(t => t.category === 'automated').length / tasks.length) * 100)
    : 0;

  document.getElementById('stat-total').textContent = tasks.length;
  document.getElementById('stat-done').textContent = done;
  document.getElementById('stat-hours').textContent = totalHours.toFixed(1);
  document.getElementById('stat-auto-pct').textContent = autoPct + '%';

  // Category pie chart
  renderCategoryPie();
  // Week bar chart
  renderWeekBar();
  // Site bar chart
  renderSiteBar();
}

function renderCategoryPie() {
  const ctx = document.getElementById('category-chart');
  if (!ctx) return;

  const counts = {
    automated: tasks.filter(t => t.category === 'automated').length,
    semi: tasks.filter(t => t.category === 'semi').length,
    human: tasks.filter(t => t.category === 'human').length
  };

  if (categoryChart) categoryChart.destroy();

  categoryChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Automated', 'Semi-Auto', 'Human Only'],
      datasets: [{
        data: [counts.automated, counts.semi, counts.human],
        backgroundColor: ['#3ec8a099', '#c8963e99', '#8b9dc399'],
        borderColor: ['#3ec8a0', '#c8963e', '#8b9dc3'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: { color: '#777777', font: { family: 'Inter', size: 11 } }
        }
      }
    }
  });
}

function renderWeekBar() {
  const ctx = document.getElementById('week-chart');
  if (!ctx) return;

  const weekCounts = {};
  for (let w = 1; w <= (meta.total_weeks || 12); w++) {
    weekCounts[w] = { total: 0, done: 0 };
  }
  tasks.forEach(t => {
    const w = t.week || 1;
    if (weekCounts[w]) {
      weekCounts[w].total++;
      if (t.status === 'done') weekCounts[w].done++;
    }
  });

  const weeks = Object.keys(weekCounts).map(w => 'W' + w);

  if (weekChart) weekChart.destroy();

  weekChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: weeks,
      datasets: [
        {
          label: 'Done',
          data: Object.values(weekCounts).map(w => w.done),
          backgroundColor: '#3ec87099',
          borderColor: '#3ec870',
          borderWidth: 1
        },
        {
          label: 'Remaining',
          data: Object.values(weekCounts).map(w => w.total - w.done),
          backgroundColor: '#c8963e33',
          borderColor: '#c8963e',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: { color: '#777777', font: { family: 'Inter', size: 11 } }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: { color: '#555555' },
          grid: { color: '#222222' }
        },
        y: {
          stacked: true,
          ticks: { color: '#555555', stepSize: 1 },
          grid: { color: '#222222' }
        }
      }
    }
  });
}

function renderSiteBar() {
  const ctx = document.getElementById('site-chart');
  if (!ctx) return;

  const siteLabels = sites.map(s => s.name.split(':')[1].trim());
  const siteColors = sites.map(s => s.accent);

  const siteCounts = sites.map(site => {
    const siteTasks = tasks.filter(t => t.site === site.id);
    return {
      total: siteTasks.length,
      done: siteTasks.filter(t => t.status === 'done').length
    };
  });

  if (siteChart) siteChart.destroy();

  siteChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: siteLabels,
      datasets: [
        {
          label: 'Done',
          data: siteCounts.map(s => s.done),
          backgroundColor: siteColors.map(c => c + '99'),
          borderColor: siteColors,
          borderWidth: 1
        },
        {
          label: 'Remaining',
          data: siteCounts.map(s => s.total - s.done),
          backgroundColor: '#333333',
          borderColor: '#444444',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: { color: '#777777', font: { family: 'Inter', size: 11 } }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: { color: '#777777' },
          grid: { display: false }
        },
        y: {
          stacked: true,
          ticks: { color: '#555555', stepSize: 1 },
          grid: { color: '#222222' }
        }
      }
    }
  });
}

// ─── Task Modal ────────────────────────────────────────
function setupModal() {
  const modal = document.getElementById('task-modal');
  const closeBtn = modal.querySelector('.modal-close');
  const backdrop = modal.querySelector('.modal-backdrop');

  closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  backdrop.addEventListener('click', () => modal.classList.add('hidden'));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') modal.classList.add('hidden');
  });
}

function openTaskModal(task) {
  const modal = document.getElementById('task-modal');
  const statusText = formatStatus(task.status);

  const depNames = task.dependencies.map(depId => {
    const dep = tasks.find(t => t.id === depId);
    return dep ? `${dep.id}: ${dep.title}` : depId;
  }).join(', ') || 'None';

  document.getElementById('modal-title').textContent = task.id + ': ' + task.title;
  document.getElementById('modal-body').innerHTML = `
    <div class="modal-field"><label>Category</label><span>${task.category === 'automated' ? '⚙️ Fully Automatable' : task.category === 'semi' ? '🔧 Semi-Automatable' : '👤 Human-Only'}</span></div>
    <div class="modal-field"><label>Status</label><span>${statusText}</span></div>
    <div class="modal-field"><label>Week</label><span>Week ${task.week}</span></div>
    <div class="modal-field"><label>Effort</label><span>${task.hours} hours</span></div>
    <div class="modal-field"><label>Site</label><span>${task.site}</span></div>
    <div class="modal-field"><label>Phase</label><span>${task.phase}</span></div>
    <div class="modal-field"><label>Dependencies</label><span>${depNames}</span></div>
    <div class="modal-field"><label>Source</label><span>${task.source || '—'}</span></div>
    <div class="modal-field"><label>Automation Note</label><span>${task.automation_note || '—'}</span></div>
    <div class="modal-actions">
      <button data-status="pending" class="${task.status === 'pending' ? 'active-status' : ''}" onclick="changeTaskStatus('${task.id}', 'pending')">Pending</button>
      <button data-status="in_progress" class="${task.status === 'in_progress' ? 'active-status' : ''}" onclick="changeTaskStatus('${task.id}', 'in_progress')">In Progress</button>
      <button data-status="review" class="${task.status === 'review' ? 'active-status' : ''}" onclick="changeTaskStatus('${task.id}', 'review')">Review</button>
      <button data-status="done" class="${task.status === 'done' ? 'active-status' : ''}" onclick="changeTaskStatus('${task.id}', 'done')">Done</button>
    </div>
  `;

  modal.classList.remove('hidden');
}

function changeTaskStatus(taskId, newStatus) {
  moveTask(taskId, newStatus);
  document.getElementById('task-modal').classList.add('hidden');
}

// ─── Toast ─────────────────────────────────────────────
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2000);
}

// ─── Keyboard Shortcuts ───────────────────────────────
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + 1-6 switches views
  if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '6') {
    e.preventDefault();
    const views = ['kanban', 'calendar', 'automation', 'sites', 'dependencies', 'stats'];
    const idx = parseInt(e.key) - 1;
    const btn = document.querySelector(`[data-view="${views[idx]}"]`);
    if (btn) btn.click();
  }
});

// ─── Boot ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);

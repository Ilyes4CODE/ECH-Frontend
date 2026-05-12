/** ECH SAHARA ERP — Shared UI Components */
const UI = {
  navItems: [
    {key:'nav_dashboard', href:'dashboard.html',     icon:'fa-gauge-high',   section:'main'},
    {key:'nav_caisse',    href:'caisse.html',        icon:'fa-cash-register',section:'main'},
    {key:'nav_projects',  href:'projects.html',      icon:'fa-diagram-project',section:'main'},
    {key:'nav_bl',        href:'bon-livraison.html', icon:'fa-truck-fast',   section:'main'},
    {key:'nav_bc',        href:'bon-commande.html',  icon:'fa-file-invoice', section:'main'},
    {key:'nav_missions',  href:'ordre-mission.html', icon:'fa-plane-departure',section:'main'},
    {key:'nav_dettes',    href:'dettes.html',        icon:'fa-hand-holding-dollar',section:'main'},
    {key:'nav_accreances',href:'accreances.html',    icon:'fa-arrow-trend-up',section:'main'},
    {key:'nav_users',     href:'users.html',         icon:'fa-users',        section:'admin', admin:true},
  ],

  renderShell(activeKey, titleKey) {
    // Sidebar
    const isAdmin = Auth.isAdmin();
    const username = Auth.username() || '—';
    const initial = username.charAt(0).toUpperCase() || 'U';
    const role = (Auth.groups()[0]) || 'User';

    const mainItems = this.navItems.filter(n => n.section==='main').map(n =>
      `<a href="${n.href}" class="sb-item ${n.key===activeKey?'active':''}">
        <i class="fas ${n.icon}"></i>
        <span data-i18n="${n.key}">${I18n.t(n.key)}</span>
      </a>`).join('');

    const adminItems = isAdmin ? this.navItems.filter(n => n.section==='admin').map(n =>
      `<a href="${n.href}" class="sb-item ${n.key===activeKey?'active':''}">
        <i class="fas ${n.icon}"></i>
        <span data-i18n="${n.key}">${I18n.t(n.key)}</span>
      </a>`).join('') : '';

    const sidebarHTML = `
      <div class="sb-brand">
        <div class="logo"><i class="fas fa-hard-hat"></i></div>
        <div class="name" data-i18n="app_name">ECH SAHARA<span data-i18n="app_sub">ERP — Génie Civil</span></div>
      </div>
      <nav class="sb-nav">
        <div class="sb-section" data-i18n="sec_main">Principal</div>
        ${mainItems}
        ${isAdmin ? `<div class="sb-section" data-i18n="sec_admin">Administration</div>${adminItems}` : ''}
        <div class="sb-section">Compte</div>
        <a href="profile.html" class="sb-item ${activeKey==='nav_profile'?'active':''}">
          <i class="fas fa-user-circle"></i>
          <span data-i18n="nav_profile">Mon profil</span>
        </a>
      </nav>
      <div class="sb-foot">
        <div class="sb-user" onclick="UI.confirmLogout()">
          <div class="avatar">${initial}</div>
          <div class="info">
            <div class="n">${username}</div>
            <div class="r">${role}</div>
          </div>
          <i class="fas fa-right-from-bracket" style="color:var(--c-text-3);"></i>
        </div>
      </div>
    `;
    const sb = document.querySelector('.sidebar');
    if (sb) sb.innerHTML = sidebarHTML;

    // Topbar
    const tb = document.querySelector('.topbar');
    if (tb) {
      tb.innerHTML = `
        <button class="hamburger" onclick="UI.toggleSidebar()" aria-label="Menu"><i class="fas fa-bars"></i></button>
        <h1 data-i18n="${titleKey}">${I18n.t(titleKey)}</h1>
        <div class="topbar-right">
          <div class="lang-pill">
            <button class="${I18n.lang==='fr'?'active':''}" data-lang-btn="fr" onclick="I18n.setLang('fr')">FR</button>
            <button class="${I18n.lang==='ar'?'active':''}" data-lang-btn="ar" onclick="I18n.setLang('ar')">ع</button>
          </div>
          <button class="icon-btn" data-i18n-title="nav_profile" onclick="location.href='profile.html'"><i class="fas fa-user"></i></button>
        </div>
      `;
    }

    // Overlay for mobile sidebar
    if (!document.querySelector('.sb-overlay')) {
      const ov = document.createElement('div');
      ov.className = 'sb-overlay';
      ov.onclick = () => this.toggleSidebar(false);
      document.body.appendChild(ov);
    }

    // Toast container
    if (!document.querySelector('.toasts')) {
      const t = document.createElement('div');
      t.className = 'toasts';
      document.body.appendChild(t);
    }

    I18n.applyAll();
  },

  init(activeKey, titleKey) {
    if (!Auth.require()) return false;
    this.renderShell(activeKey, titleKey);
    return true;
  },

  toggleSidebar(force) {
    const sb = document.querySelector('.sidebar');
    const ov = document.querySelector('.sb-overlay');
    if (!sb) return;
    const open = force !== undefined ? force : !sb.classList.contains('open');
    sb.classList.toggle('open', open);
    ov?.classList.toggle('open', open);
  },

  // Toast
  toast(msg, type='success', duration=4000) {
    const wrap = document.querySelector('.toasts');
    if (!wrap) return;
    const icons = { success:'fa-circle-check', error:'fa-circle-xmark', warning:'fa-triangle-exclamation', info:'fa-circle-info' };
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.innerHTML = `
      <div class="ti"><i class="fas ${icons[type]||icons.info}"></i></div>
      <div class="tc"><div class="tm">${msg}</div></div>
      <button class="tx"><i class="fas fa-xmark"></i></button>
    `;
    wrap.appendChild(t);
    const close = () => {
      t.classList.add('toast-out');
      setTimeout(() => t.remove(), 250);
    };
    t.querySelector('.tx').onclick = close;
    if (duration > 0) setTimeout(close, duration);
  },
  ok(msg) { this.toast(msg, 'success'); },
  err(msg){ this.toast(msg, 'error'); },
  warn(msg){this.toast(msg, 'warning'); },

  // Confirm
  async confirm(titleKey, textKey, confirmKey='btn_confirm', cancelKey='btn_cancel') {
    const r = await Swal.fire({
      title: I18n.t(titleKey),
      text: textKey ? I18n.t(textKey) : undefined,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: I18n.t(confirmKey),
      cancelButtonText: I18n.t(cancelKey),
      reverseButtons: I18n.lang === 'ar',
    });
    return r.isConfirmed;
  },

  async confirmDelete() {
    return this.confirm('cf_delete_title', 'cf_delete_text', 'cf_yes_delete', 'cf_no');
  },

  async confirmLogout() {
    const ok = await this.confirm('cf_logout_title', 'cf_logout_text', 'cf_yes_logout', 'cf_no');
    if (ok) Auth.logout();
  },

  // Modal form (returns formData or null)
  async formModal({titleKey, html, confirmKey='btn_save', cancelKey='btn_cancel', width=480, didOpen, preConfirm}) {
    const r = await Swal.fire({
      title: I18n.t(titleKey),
      html,
      width,
      showCancelButton: true,
      confirmButtonText: I18n.t(confirmKey),
      cancelButtonText: I18n.t(cancelKey),
      reverseButtons: I18n.lang === 'ar',
      focusConfirm: false,
      didOpen: () => { I18n.applyAll(); didOpen && didOpen(); },
      preConfirm: () => {
        const popup = Swal.getPopup();
        // Validate required
        let ok = true;
        popup.querySelectorAll('[required]').forEach(el => {
          if (!el.value.trim()) { el.classList.add('error'); ok = false; }
          else el.classList.remove('error');
        });
        if (!ok) { Swal.showValidationMessage(I18n.t('err_required')); return false; }
        // Collect data
        const data = {};
        popup.querySelectorAll('[name]').forEach(el => {
          if (el.type === 'file') data[el.name] = el.files[0] || null;
          else data[el.name] = el.value;
        });
        return preConfirm ? preConfirm(data, popup) : data;
      }
    });
    return r.isConfirmed ? r.value : null;
  },

  // Loading
  showLoader(target, show=true) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    if (show) {
      el.innerHTML = `<div class="loader-wrap"><div class="loader"></div><div class="loader-text">${I18n.t('lbl_loading')}</div></div>`;
    }
  },

  // Format
  fmtAmount(v) {
    if (v === null || v === undefined || v === '' || isNaN(v)) return '—';
    return parseFloat(v).toLocaleString('fr-DZ', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' ' + I18n.t('lbl_da');
  },
  fmtNum(v) {
    if (v === null || v === undefined || isNaN(v)) return '0';
    return parseFloat(v).toLocaleString('fr-DZ', {maximumFractionDigits:0});
  },
  fmtDate(s) {
    if (!s) return '—';
    try {
      const d = new Date(s); if (isNaN(d)) return s;
      return d.toLocaleDateString('fr-FR', {day:'2-digit', month:'2-digit', year:'numeric'});
    } catch { return s; }
  },
  fmtDateTime(s) {
    if (!s) return '—';
    try {
      const d = new Date(s); if (isNaN(d)) return s;
      return d.toLocaleString('fr-FR', {day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'});
    } catch { return s; }
  },

  // Error handler
  async apiErr(res, fallbackKey='err_save') {
    if (!res) { this.err(I18n.t('err_network')); return; }
    if (res.status === 401) { this.err(I18n.t('err_unauthorized')); Auth.logout(); return; }
    if (res.status === 403) { this.err(I18n.t('err_forbidden')); return; }
    if (res.status === 404) { this.err(I18n.t('err_not_found')); return; }
    if (res.status >= 500)  { this.err(I18n.t('err_server')); return; }
    let m = I18n.t(fallbackKey);
    try {
      const j = await res.json();
      if (j.detail) m = j.detail;
      else if (j.error) m = j.error;
      else if (j.message) m = j.message;
      else {
        const k = Object.keys(j)[0];
        if (k && Array.isArray(j[k])) m = `${k}: ${j[k][0]}`;
        else if (k && typeof j[k] === 'string') m = j[k];
      }
    } catch {}
    this.err(m);
  },

  emptyRow(cols, icon='fa-inbox', textKey='lbl_no_data') {
    return `<tr><td colspan="${cols}"><div class="table-empty"><i class="fas ${icon}"></i><p data-i18n="${textKey}">${I18n.t(textKey)}</p></div></td></tr>`;
  },

  // Render simple stat
  renderStat({label, value, icon, color='primary', sub=''}) {
    return `<div class="stat">
      <div class="stat-row">
        <div>
          <div class="stat-label" data-i18n="${label}">${I18n.t(label)}</div>
          <div class="stat-value">${value}</div>
          ${sub ? `<div class="stat-sub">${sub}</div>` : ''}
        </div>
        <div class="stat-icon ${color}"><i class="fas ${icon}"></i></div>
      </div>
    </div>`;
  },

  // Pagination
  pagination({count, page, pageSize, onPage}) {
    const tp = Math.ceil(count / pageSize) || 1;
    const start = count === 0 ? 0 : Math.min((page-1)*pageSize+1, count);
    const end = Math.min(page*pageSize, count);
    return {
      html: `<div class="pagination">
        <div class="pagination-info">${start}–${end} ${I18n.t('lbl_of')} ${count} ${I18n.t('lbl_results')}</div>
        <div class="pagination-controls">
          <button id="pg-prev" ${page<=1?'disabled':''}><i class="fas fa-chevron-${I18n.lang==='ar'?'right':'left'}"></i></button>
          <button class="active">${page}</button>
          <span style="color:var(--c-text-3);font-size:11px;">/ ${tp}</span>
          <button id="pg-next" ${page>=tp?'disabled':''}><i class="fas fa-chevron-${I18n.lang==='ar'?'left':'right'}"></i></button>
        </div>
      </div>`,
      attach: (container) => {
        container.querySelector('#pg-prev')?.addEventListener('click', ()=>onPage(page-1));
        container.querySelector('#pg-next')?.addEventListener('click', ()=>onPage(page+1));
      }
    };
  }
};

// Re-render shell on lang change
document.addEventListener('lang-change', () => {
  document.body.style.fontFamily = I18n.lang==='ar' ? "'Tajawal',sans-serif" : "'Poppins',sans-serif";
});

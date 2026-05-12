/** ECH SAHARA ERP — JWT auth + auto-refresh fetch */
const Auth = {
  token()    { return localStorage.getItem('access_token'); },
  refresh()  { return localStorage.getItem('refresh_token'); },
  username() { return localStorage.getItem('username') || ''; },
  groups()   { try { return JSON.parse(localStorage.getItem('user_groups') || '[]'); } catch { return []; } },
  isAdmin()  { return this.groups().includes('Admin'); },

  save(d) {
    localStorage.setItem('access_token', d.access);
    localStorage.setItem('refresh_token', d.refresh);
    localStorage.setItem('username', d.username || '');
    localStorage.setItem('user_groups', JSON.stringify(d.groups || []));
  },
  logout() {
    ['access_token','refresh_token','username','user_groups'].forEach(k => localStorage.removeItem(k));
    location.href = 'login.html';
  },
  require() {
    if (!this.token()) { location.href = 'login.html'; return false; }
    return true;
  },

  async _refresh() {
    const r = this.refresh();
    if (!r) return false;
    try {
      const res = await fetch(CFG.API + CFG.R.REFRESH, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({refresh: r})
      });
      if (!res.ok) return false;
      const d = await res.json();
      localStorage.setItem('access_token', d.access);
      if (d.refresh) localStorage.setItem('refresh_token', d.refresh);
      return true;
    } catch { return false; }
  },

  async fetch(url, opts = {}) {
    const isFD = opts.body instanceof FormData;
    const lang = (typeof I18n !== 'undefined' && I18n.lang) ? I18n.lang : (localStorage.getItem('lang') || 'fr');
    opts.headers = {
      'Authorization': `Bearer ${this.token()}`,
      'Accept-Language': lang,
      'X-User-Lang': lang,
      ...(isFD ? {} : {'Content-Type':'application/json'}),
      ...(opts.headers || {})
    };
    let res = await fetch(CFG.API + url, opts);
    if (res.status === 401) {
      const ok = await this._refresh();
      if (!ok) { this.logout(); return null; }
      opts.headers.Authorization = `Bearer ${this.token()}`;
      res = await fetch(CFG.API + url, opts);
    }
    return res;
  },

  async get(url) {
    const r = await this.fetch(url);
    if (!r || !r.ok) throw new Error(`GET ${url} → ${r?.status}`);
    return r.json();
  },
  async post(url, body, isFD = false) {
    return this.fetch(url, {method:'POST', body: isFD ? body : JSON.stringify(body)});
  },
  async put(url, body, isFD = false) {
    return this.fetch(url, {method:'PUT', body: isFD ? body : JSON.stringify(body)});
  },
  async del(url) {
    return this.fetch(url, {method:'DELETE'});
  },
  async download(url) {
    const res = await this.fetch(url);
    if (!res || !res.ok) throw new Error('Download failed');
    const blob = await res.blob();
    const disp = res.headers.get('Content-Disposition') || '';
    const m = disp.match(/filename="?([^"]+)"?/);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = m ? m[1] : 'document.pdf';
    a.click();
    URL.revokeObjectURL(a.href);
  }
};

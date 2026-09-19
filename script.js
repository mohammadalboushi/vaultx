(function() {
  "use strict";

  // --- FIREBASE INIT ---
  const firebaseConfig = {
    apiKey: "AIzaSyBB_U4C880PW4GxZd8FALv8yBSiP2mNeBY",
    authDomain: "malaboushi.firebaseapp.com",
    databaseURL: "https://malaboushi-default-rtdb.firebaseio.com/",
    projectId: "malaboushi",
    storageBucket: "malaboushi.firebasestorage.app",
    messagingSenderId: "110336819350",
    appId: "1:110336819350:web:2b1b0488e72b811f0602b7"
  };
  
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const auth = firebase.auth();
  const db = firebase.database();
  let currentUser = null;

  const ICON = {
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/><path d="M10 11v6M14 11v6"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2.5"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>',
    eyeOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 5.2A10.4 10.4 0 0 1 12 5c6.4 0 10 7 10 7a17.7 17.7 0 0 1-3.4 4.3M6.6 6.7C4 8.5 2 12 2 12s3.6 7 10 7a10 10 0 0 0 4-.8"/><path d="M14.1 14.1a3 3 0 1 1-4.2-4.2"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    vault: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z"/></svg>',
    folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0l-4-4m4 4l4-4"/><path d="M5 19h14"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V9m0 0l-4 4m4-4l4 4"/><path d="M5 5h14"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9L2.9 17a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>',
    chevronL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    google: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>'
  };

  const DB_KEY = 'vault_manager_db_v2';
  
  const Adapter = {
    async load() {
      try {
        let raw = localStorage.getItem(DB_KEY);
        if (!raw) raw = localStorage.getItem('vault_manager_db_v1');
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    },
    async save(data) {
      try {
        localStorage.setItem(DB_KEY, JSON.stringify(data));
        if (currentUser) {
          db.ref(`vaultData/${currentUser.uid}`).set(data).catch(e => console.error("Sync Error", e));
        }
        return true;
      } catch (e) {
        return false;
      }
    }
  };

  function uid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
  }

  let state = {
    version: 2,
    projects: [],
    activeProjectId: 'all',
    searchQuery: '',
    ui: { mode: 'home', viewedProject: null, viewedAccount: null }
  };

  function defaultState() {
    return { version: 2, projects: [], activeProjectId: 'all', searchQuery: '', ui: { mode: 'home' } };
  }

  async function loadState() {
    try {
      const data = await Adapter.load();
      if (data && Array.isArray(data.projects)) {
        // إضافة شبكات حماية لحل مشكلة حذف Firebase للمصفوفات الفارغة
        data.projects.forEach(p => {
          p.accounts = p.accounts || []; 
          if (p.cards && p.accounts.length === 0) {
            p.accounts = [{
              id: uid(), name: 'حسابات عامة', createdAt: p.createdAt || Date.now(),
              fields: (p.cards || []).map(c => ({ ...c, _revealed: false }))
            }];
            delete p.cards;
          } else {
            p.accounts.forEach(acc => {
              acc.fields = acc.fields || []; 
              acc.fields.forEach(f => f._revealed = false);
            });
          }
        });
        state = Object.assign(defaultState(), data);
      } else {
        state = defaultState();
      }
    } catch (err) {
      console.error("Load Error (Data fixed automatically):", err);
      state = defaultState();
    }
  }

  let saveTimer = null;
  function persist() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { Adapter.save(state); }, 120);
  }

  auth.onAuthStateChanged(async (user) => {
    currentUser = user;
    const optBtn = document.getElementById('optionsBtn');
    if (optBtn) optBtn.classList.toggle('online', !!user);
    
    if (user) {
      try {
        const snap = await db.ref(`vaultData/${user.uid}`).once('value');
        const cloudData = snap.val();
        if (cloudData && Array.isArray(cloudData.projects)) {
          // إضافة شبكات حماية للمصفوفات القادمة من السحابة أيضاً
                              cloudData.projects.forEach(p => {
                      p.accounts = p.accounts || [];
                      p.accounts.forEach(acc => { acc.fields = acc.fields || []; });
                    });
                    const currentActive = state.activeProjectId;
                    const currentUI = state.ui;
                    state = Object.assign(defaultState(), cloudData);
                    state.activeProjectId = currentActive;
                    state.ui = currentUI;
                    localStorage.setItem(DB_KEY, JSON.stringify(state)); 
                    renderAll();
                  } else {
          if (state.projects.length > 0) {
            Adapter.save(state);
          }
        }
      } catch (err) {
        console.error("Cloud fetch failed:", err);
      }
    }
  });

  const Nav = {
    stack: [],
    open(id, hide) {
      this.stack.push({ id, hide });
      history.pushState({ ovl: id, depth: this.stack.length }, '');
    },
    requestClose(id) {
      const top = this.stack[this.stack.length - 1];
      if (top && top.id === id) history.back();
      else {
        const idx = this.stack.findIndex(o => o.id === id);
        if (idx > -1) { const [e] = this.stack.splice(idx, 1); e.hide(); }
      }
    },
    popTop() { const entry = this.stack.pop(); if (entry) entry.hide(); },
    get depth() { return this.stack.length; }
  };
  window.addEventListener('popstate', (e) => {
    if (Nav.depth > 0) Nav.popTop();
    else if (state.ui.mode === 'account') {
      state.ui = { mode: 'home', viewedProject: null, viewedAccount: null };
      renderAll();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (Nav.depth > 0) history.back();
      else if (state.ui.mode === 'account') navigateHome();
    }
  });

  function navigateHome() {
    if (state.ui.mode === 'account') history.back();
  }

  function navigateToAccount(projId, accId) {
    state.ui = { mode: 'account', viewedProject: projId, viewedAccount: accId };
    history.pushState({ view: 'account' }, '');
    renderAll();
  }

  const toastStack = document.getElementById('toastStack');
  function toast(msg, type = 'info') {
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    el.innerHTML = (type === 'success' ? ICON.check : type === 'error' ? ICON.warn : ICON.vault) + '<span></span>';
    el.querySelector('span').textContent = msg;
    toastStack.appendChild(el);
    setTimeout(() => { el.classList.add('leave'); setTimeout(() => el.remove(), 240); }, 2200);
  }

  const overlayRoot = document.getElementById('overlayRoot');
  function openSheet({ id, title, subtitle, bodyHTML, onMount, onClose }) {
    const wrap = document.createElement('div'); wrap.style.pointerEvents = 'auto';
    const backdrop = document.createElement('div'); backdrop.className = 'backdrop';
    const sheet = document.createElement('div'); sheet.className = 'sheet';
    sheet.innerHTML = `
    <div class="sheet-handle"></div>
    <div class="sheet-head">
      <div><h2>${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ''}</div>
      <button class="sheet-close" data-close aria-label="إغلاق">${ICON.close}</button>
    </div>
    <div class="sheet-body">${bodyHTML}</div>`;
    wrap.appendChild(backdrop); wrap.appendChild(sheet); overlayRoot.appendChild(wrap);
    document.body.classList.add('lock');
    requestAnimationFrame(() => { backdrop.classList.add('show'); sheet.classList.add('show'); });

    function hide() {
      backdrop.classList.remove('show'); sheet.classList.remove('show'); document.body.classList.remove('lock');
      setTimeout(() => wrap.remove(), 260);
      if (onClose) onClose();
    }
    function close() { Nav.requestClose(id); }
    backdrop.addEventListener('click', close);
    sheet.querySelector('[data-close]').addEventListener('click', close);
    Nav.open(id, hide);
    if (onMount) onMount(sheet, close);
    return { sheet, close };
  }

  let ctxMenuEl = null;
  let ctxBackdrop = null;
  function closeContextMenu() {
    if (ctxMenuEl) {
      const el = ctxMenuEl;
      el.classList.remove('show');
      setTimeout(() => el.remove(), 160);
      ctxMenuEl = null;
    }
    if (ctxBackdrop) { ctxBackdrop.remove(); ctxBackdrop = null; }
  }

  function openContextMenu(x, y, items) {
    closeContextMenu();
    const menu = document.createElement('div'); menu.className = 'ctx-menu'; menu.style.pointerEvents = 'auto';
    menu.innerHTML = items.map(it => it.sep ? '<div class="ctx-sep"></div>' : `<button class="ctx-item ${it.danger ? 'danger' : ''}" data-act="${it.act}">${it.icon}<span>${it.label}</span></button>`).join('');
    overlayRoot.appendChild(menu); ctxMenuEl = menu;

    ctxBackdrop = document.createElement('div');
    ctxBackdrop.style.cssText = 'position:fixed;inset:0;pointer-events:auto;background:transparent;z-index:110';
    overlayRoot.insertBefore(ctxBackdrop, menu);
    ctxBackdrop.addEventListener('click', (e) => { e.preventDefault(); closeContextMenu(); });

    const vw = window.innerWidth, vh = window.innerHeight;
    requestAnimationFrame(() => {
      if (!ctxMenuEl) return;
      const r = menu.getBoundingClientRect();
      let left = x - r.width / 2; left = Math.max(10, Math.min(left, vw - r.width - 10));
      let top = y; if (top + r.height > vh - 20) top = y - r.height - 14;
      menu.style.left = left + 'px'; menu.style.top = top + 'px'; menu.classList.add('show');
    });

    menu.querySelectorAll('[data-act]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const item = items.find(i => i.act === btn.getAttribute('data-act'));
        closeContextMenu();
        if (item && item.run) setTimeout(item.run, 160);
      });
    });
  }

  function openConfirm({ title, message, confirmLabel, danger, onConfirm }) {
    openSheet({
      id: 'confirm-' + uid(), title,
      bodyHTML: `<p style="font-size:13.5px;color:var(--text-dim);line-height:1.7;margin-bottom:20px">${message}</p>
      <div class="sheet-actions"><button class="btn btn-ghost" data-cancel>إلغاء</button><button class="btn ${danger ? 'btn-danger' : 'btn-accent'}" data-ok>${confirmLabel}</button></div>`,
      onMount: (sheet, close) => {
        sheet.querySelector('[data-cancel]').addEventListener('click', close);
        sheet.querySelector('[data-ok]').addEventListener('click', () => { close(); setTimeout(() => onConfirm(), 180); });
      }
    });
  }

  function bindLongPress(el, handler) {
    let timer = null, startX = 0, startY = 0, fired = false;
    function start(x, y) { fired = false; startX = x; startY = y; clearTimeout(timer); timer = setTimeout(() => { fired = true; if (navigator.vibrate) try { navigator.vibrate(8); } catch (e) {} handler(x, y); }, 480); }
    function move(x, y) { if (Math.abs(x - startX) > 10 || Math.abs(y - startY) > 10) clearTimeout(timer); }
    function end() { clearTimeout(timer); setTimeout(() => fired = false, 200); }
    el.addEventListener('touchstart', e => { start(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    el.addEventListener('touchmove', e => { move(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    el.addEventListener('touchend', end); el.addEventListener('touchcancel', end);
    el.addEventListener('mousedown', e => { if (e.button === 0) start(e.clientX, e.clientY); });
    el.addEventListener('mousemove', e => { move(e.clientX, e.clientY); });
    el.addEventListener('mouseup', end); el.addEventListener('mouseleave', end);
    el.addEventListener('contextmenu', e => { e.preventDefault(); clearTimeout(timer); if (!fired) { fired = true; handler(e.clientX, e.clientY); } });
    el.addEventListener('click', e => { if (fired) { e.preventDefault(); e.stopPropagation(); } }, { capture: true });
  }

  async function copyToClipboard(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) {
      try {
        const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); return true;
      } catch (e2) { return false; }
    }
  }

  function maskValue(v) {
    if (!v) return ''; const len = v.length; if (len <= 6) return '•'.repeat(len);
    return v.slice(0, Math.min(12, Math.ceil(len * 0.35))) + '•'.repeat(Math.min(16, len - Math.min(12, Math.ceil(len * 0.35))));
  }

  function escapeHTML(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } [c])); }

  function matchQuery(query, ...texts) {
    const q = query.toLowerCase().trim(); if (!q) return true;
    const terms = q.split(/\s+/); const combined = texts.filter(Boolean).join(' ').toLowerCase();
    return terms.every(t => combined.includes(t));
  }

  const UI = {
    topbar: document.getElementById('topbar'),
    btnBack: document.getElementById('btnBack'),
    brandMark: document.getElementById('brandMark'),
    topTitle: document.getElementById('topTitle'),
    topSub: document.getElementById('topSubtitle'),
    optionsBtn: document.getElementById('optionsBtn'),
    searchWrap: document.getElementById('searchWrap'),
    searchInput: document.getElementById('searchInput'),
    searchClear: document.getElementById('searchClear'),
    tabsWrap: document.getElementById('tabsWrap'),
    tabs: document.getElementById('tabs'),
    content: document.getElementById('content'),
    fab: document.getElementById('fabAdd')
  };

  function renderAll() {
    if (state.ui.mode === 'home') {
      renderTopbar(false); UI.searchWrap.style.display = 'block'; UI.tabsWrap.style.display = 'block';
      renderTabs(); renderHomeContent(); UI.fab.classList.remove('hide');
    } else {
      renderTopbar(true); UI.searchWrap.style.display = 'none'; UI.tabsWrap.style.display = 'none';
      renderAccountContent(); UI.fab.classList.remove('hide');
    }
  }

  function renderTopbar(isAccount) {
    if (isAccount) {
      const proj = state.projects.find(p => p.id === state.ui.viewedProject);
      const acc = proj?.accounts.find(a => a.id === state.ui.viewedAccount);
      UI.btnBack.style.display = 'flex'; UI.brandMark.style.display = 'none';
      UI.topTitle.textContent = acc ? acc.name : 'الحساب'; UI.topSub.textContent = proj ? proj.name : '';
      UI.optionsBtn.style.display = 'none';
    } else {
      UI.btnBack.style.display = 'none'; UI.brandMark.style.display = 'flex';
      UI.topTitle.textContent = 'VaultX';
      // إضافة حماية || [] عند الحساب
      const accCount = state.projects.reduce((sum, p) => sum + (p.accounts || []).length, 0);
      UI.topSub.textContent = state.projects.length ? `${state.projects.length} مشاريع · ${accCount} حسابات` : 'لا مشاريع بعد';
      UI.optionsBtn.style.display = 'flex';
    }
  }
  UI.btnBack.addEventListener('click', navigateHome);

  function renderTabs() {
    UI.tabs.innerHTML = '';
    const totalAccounts = state.projects.reduce((sum, p) => sum + (p.accounts || []).length, 0);

    const allTab = document.createElement('button');
    allTab.className = 'tab' + (state.activeProjectId === 'all' ? ' active' : '');
    allTab.innerHTML = `<span class="dot"></span><span class="tab-text">الكل</span><span class="tab-count">${totalAccounts}</span>`;
    allTab.addEventListener('click', () => { if (state.activeProjectId !== 'all') { state.activeProjectId = 'all'; persist(); renderAll(); } });
    UI.tabs.appendChild(allTab);

    state.projects.forEach(p => {
      const pCount = (p.accounts || []).length;
      const tab = document.createElement('button');
      tab.className = 'tab' + (p.id === state.activeProjectId ? ' active' : '');
      tab.innerHTML = `<span class="dot"></span><span class="tab-text" title="${escapeHTML(p.name)}">${escapeHTML(p.name)}</span><span class="tab-count">${pCount}</span>`;
      tab.addEventListener('click', () => { if (state.activeProjectId !== p.id) { state.activeProjectId = p.id; persist(); renderAll(); } });
      bindLongPress(tab, (x, y) => openProjectContextMenu(p, x, y));
      UI.tabs.appendChild(tab);
    });

    const addBtn = document.createElement('button'); addBtn.className = 'tab-add'; addBtn.innerHTML = ICON.plus;
    addBtn.addEventListener('click', openAddProjectSheet);
    UI.tabs.appendChild(addBtn);
  }

  function renderHomeContent() {
    if (state.projects.length === 0) {
      UI.content.innerHTML = `<div class="empty"><div class="empty-glyph">${ICON.vault}</div><h3>ابدأ بإنشاء أول مشروع</h3><p>كل مشروع يمثل خزانة لبياناتك وحساباتك.</p><button class="btn-primary" id="emptyAddProject">${ICON.plus}<span>إضافة مشروع</span></button></div>`;
      document.getElementById('emptyAddProject').addEventListener('click', openAddProjectSheet);
      return;
    }

    const query = state.searchQuery.toLowerCase();
    let targetProjects = state.activeProjectId === 'all' ? state.projects : state.projects.filter(p => p.id === state.activeProjectId);
    const grid = document.createElement('div'); grid.className = 'cards-grid';
    let matchCount = 0;

    targetProjects.forEach(proj => {
      // إضافة حماية || [] عند البحث وعرض الحسابات
      (proj.accounts || []).forEach(acc => {
        const matched = matchQuery(query, proj.name, acc.name, ...(acc.fields || []).map(f => f.label + ' ' + f.value));
        if (!matched) return;
        matchCount++;
        const el = document.createElement('div'); el.className = 'acc-card';
                const fCount = (acc.fields || []).length;
        const shortName = acc.name.length > 35 ? acc.name.slice(0, 35) + '...' : acc.name;
        el.innerHTML = `
        <div class="acc-info">
          <div class="acc-ic">${ICON.folder}</div>
          <div class="acc-text"><h3 dir="auto">${escapeHTML(shortName)}</h3><p>${fCount} بطاقة بيانات ${state.activeProjectId === 'all' ? `<span class="badge-proj">${escapeHTML(proj.name)}</span>` : ''}</p></div>
        </div>
        <div class="acc-arrow">${ICON.chevronL}</div>`;
        el.addEventListener('click', () => navigateToAccount(proj.id, acc.id));
        bindLongPress(el, (x, y) => openAccountContextMenu(proj, acc, x, y));
        grid.appendChild(el);
      });
    });
    if (matchCount === 0) {
      if (query) UI.content.innerHTML = `<div class="empty"><div class="empty-glyph">${ICON.search || ICON.vault}</div><h3>لا توجد نتائج</h3><p>لم نجد أي تطابق لبحثك.</p></div>`;
      else {
        UI.content.innerHTML = `<div class="empty"><div class="empty-glyph">${ICON.folder}</div><h3>لا توجد حسابات هنا</h3><p>أضف حساباً جديداً للبدء في حفظ بياناته.</p><button class="btn-primary" id="emptyAddAcc">${ICON.plus}<span>إضافة حساب</span></button></div>`;
        document.getElementById('emptyAddAcc').addEventListener('click', openAddAccountSheet);
      }
    } else { UI.content.innerHTML = ''; UI.content.appendChild(grid); }
  }

  function renderAccountContent() {
    const proj = state.projects.find(p => p.id === state.ui.viewedProject);
    const acc = proj?.accounts.find(a => a.id === state.ui.viewedAccount);
    if (!proj || !acc) { navigateHome(); return; }

    // إضافة حماية || [] 
    if (!acc.fields || acc.fields.length === 0) {
      UI.content.innerHTML = `<div class="empty"><div class="empty-glyph">${ICON.vault}</div><h3>الحساب فارغ</h3><p>أضف بيانات مثل كلمة السر، مفتاح الـ API، أو الروابط.</p><button class="btn-primary" id="emptyAddField">${ICON.plus}<span>إضافة بيانات</span></button></div>`;
      document.getElementById('emptyAddField').addEventListener('click', () => openAddFieldSheet(proj, acc));
      return;
    }

    const grid = document.createElement('div'); grid.className = 'cards-grid';
    (acc.fields || []).forEach(field => {
      const el = document.createElement('div'); el.className = 'card';
      const valWrap = document.createElement('div'); valWrap.className = 'card-value' + (field.sensitive ? '' : ' plain');
      valWrap.textContent = (field.sensitive && !field._revealed) ? maskValue(field.value) : (field.value || '—');

      el.innerHTML = `<div class="card-top"><div class="card-label"><span class="tag-dot"></span>${escapeHTML(field.label)}</div><button class="card-more" data-more aria-label="خيارات">${ICON.edit.replace('<svg','<svg style="width:15px;height:15px"')}</button></div>`;
      el.querySelector('.card-top').insertAdjacentElement('afterend', valWrap);

      const actions = document.createElement('div'); actions.className = 'card-actions';
      if (field.sensitive) {
        const eyeBtn = document.createElement('button'); eyeBtn.className = 'chip-btn';
        eyeBtn.innerHTML = (field._revealed ? ICON.eyeOff : ICON.eye) + `<span>${field._revealed ? 'إخفاء' : 'إظهار'}</span>`;
        eyeBtn.addEventListener('click', () => { field._revealed = !field._revealed; renderAccountContent(); });
        actions.appendChild(eyeBtn);
      }
      const copyBtn = document.createElement('button'); copyBtn.className = 'chip-btn'; copyBtn.innerHTML = ICON.copy + '<span>نسخ</span>';
      copyBtn.addEventListener('click', async () => {
        if (await copyToClipboard(field.value)) {
          copyBtn.classList.add('copied'); copyBtn.innerHTML = ICON.check + '<span>تم النسخ</span>';
          toast('تم نسخ «' + field.label + '» ✓', 'success');
          setTimeout(() => { copyBtn.className = 'chip-btn'; copyBtn.innerHTML = ICON.copy + '<span>نسخ</span>'; }, 1400);
        }
      });
      actions.appendChild(copyBtn); el.appendChild(actions);

      el.querySelector('[data-more]').addEventListener('click', (e) => {
        const r = e.currentTarget.getBoundingClientRect(); openFieldContextMenu(proj, acc, field, r.left + r.width / 2, r.bottom + 6);
      });
      bindLongPress(el, (x, y) => openFieldContextMenu(proj, acc, field, x, y));
      grid.appendChild(el);
    });
    UI.content.innerHTML = ''; UI.content.appendChild(grid);
  }

  UI.searchInput.addEventListener('input', (e) => { state.searchQuery = e.target.value; UI.searchClear.classList.toggle('show', !!state.searchQuery); renderHomeContent(); });
  UI.searchClear.addEventListener('click', () => { state.searchQuery = ''; UI.searchInput.value = ''; UI.searchClear.classList.remove('show'); UI.searchInput.focus(); renderHomeContent(); });

  UI.fab.addEventListener('click', () => {
    if (state.ui.mode === 'home') { if (state.projects.length === 0) openAddProjectSheet(); else openAddAccountSheet(); }
    else {
      const proj = state.projects.find(p => p.id === state.ui.viewedProject);
      const acc = proj?.accounts.find(a => a.id === state.ui.viewedAccount);
      if (proj && acc) openAddFieldSheet(proj, acc);
    }
  });

  function openAddProjectSheet() {
    openSheet({
      id: 'add-project-' + uid(), title: 'مشروع جديد', subtitle: 'أضف اسمًا لتنظيم بياناتك',
      bodyHTML: `<div class="field"><label>اسم المشروع</label><input type="text" id="pName" placeholder="مثال: Supabase" maxlength="60" autocomplete="off"></div><div class="sheet-actions"><button class="btn btn-ghost" data-cancel>إلغاء</button><button class="btn btn-accent" id="pSave" disabled>إضافة</button></div>`,
      onMount: (sheet, close) => {
        const inp = sheet.querySelector('#pName'), save = sheet.querySelector('#pSave');
        setTimeout(() => inp.focus(), 260);
        inp.addEventListener('input', () => save.disabled = !inp.value.trim());
        inp.addEventListener('keydown', e => { if (e.key === 'Enter' && inp.value.trim()) doSave(); });
        sheet.querySelector('[data-cancel]').addEventListener('click', close); save.addEventListener('click', doSave);
        function doSave() {
          const name = inp.value.trim(); if (!name) return;
          const proj = { id: uid(), name, createdAt: Date.now(), accounts: [] };
          state.projects.push(proj); state.activeProjectId = proj.id; persist(); close(); renderAll(); toast('تم إنشاء «' + name + '» ✓', 'success');
        }
      }
    });
  }

  function openEditProjectSheet(p) {
    openSheet({
      id: 'edit-proj-' + uid(), title: 'تعديل المشروع',
      bodyHTML: `<div class="field"><label>الاسم</label><input type="text" id="pName" value="${escapeHTML(p.name)}" maxlength="60" autocomplete="off"></div><div class="sheet-actions"><button class="btn btn-ghost" data-cancel>إلغاء</button><button class="btn btn-accent" id="pSave">حفظ</button></div>`,
      onMount: (sheet, close) => {
        const inp = sheet.querySelector('#pName'); setTimeout(() => { inp.focus(); inp.select(); }, 260);
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') doSave(); });
        sheet.querySelector('[data-cancel]').addEventListener('click', close); sheet.querySelector('#pSave').addEventListener('click', doSave);
        function doSave() { const name = inp.value.trim(); if (!name) return; p.name = name; persist(); close(); renderAll(); toast('تم التعديل ✓', 'success'); }
      }
    });
  }

  function confirmDeleteProject(p) {
    openConfirm({
      title: 'حذف المشروع؟', message: `سيتم حذف «${escapeHTML(p.name)}» نهائيًا.`, confirmLabel: 'حذف', danger: true,
      onConfirm: () => {
        state.projects = state.projects.filter(x => x.id !== p.id);
        if (state.activeProjectId === p.id) state.activeProjectId = 'all';
        persist(); renderAll(); toast('تم حذف المشروع', 'success');
      }
    });
  }

  function openProjectContextMenu(p, x, y) { openContextMenu(x, y, [{ act: 'rename', label: 'تعديل اسم المشروع', icon: ICON.edit, run: () => openEditProjectSheet(p) }, { sep: true }, { act: 'delete', label: 'حذف المشروع', icon: ICON.trash, danger: true, run: () => confirmDeleteProject(p) }]); }

  function openAddAccountSheet() {
    const showProjSelect = state.activeProjectId === 'all' && state.projects.length > 0;
    let selectedProjId = state.projects.length ? state.projects[0].id : null;
    const projChips = state.projects.map(p => `<button class="proj-chip ${p.id === selectedProjId ? 'active' : ''}" data-id="${p.id}">${escapeHTML(p.name)}</button>`).join('');

    openSheet({
      id: 'add-acc-' + uid(), title: 'حساب جديد',
      bodyHTML: `
      ${showProjSelect ? `<div class="field"><label>المشروع</label><div class="proj-chips" id="aProjChips">${projChips}</div></div>` : ''}
      <div class="field"><label>اسم الحساب / الإيميل</label><input type="text" id="aName" placeholder="مثال: ahmad@gmail.com" maxlength="80" autocomplete="off" dir="ltr" style="text-align:left"></div>
      <div class="sheet-actions"><button class="btn btn-ghost" data-cancel>إلغاء</button><button class="btn btn-accent" id="aSave" disabled>إضافة</button></div>`,
      onMount: (sheet, close) => {
        const inp = sheet.querySelector('#aName'), save = sheet.querySelector('#aSave');
        if (showProjSelect) {
          const chips = sheet.querySelectorAll('.proj-chip');
          chips.forEach(c => {
            c.addEventListener('click', () => { chips.forEach(x => x.classList.remove('active')); c.classList.add('active'); selectedProjId = c.getAttribute('data-id'); });
          });
        }
        setTimeout(() => inp.focus(), 260);
        inp.addEventListener('input', () => save.disabled = !inp.value.trim());
        inp.addEventListener('keydown', e => { if (e.key === 'Enter' && inp.value.trim()) doSave(); });
        sheet.querySelector('[data-cancel]').addEventListener('click', close); save.addEventListener('click', doSave);

        function doSave() {
          const name = inp.value.trim(); if (!name) return;
          const targetProjId = showProjSelect ? selectedProjId : state.activeProjectId;
          const proj = state.projects.find(p => p.id === targetProjId); if (!proj) return;
          proj.accounts = proj.accounts || []; // حماية
          proj.accounts.push({ id: uid(), name, createdAt: Date.now(), fields: [] });
          persist(); close(); renderAll(); toast('تم إضافة الحساب ✓', 'success');
        }
      }
    });
  }

  function openEditAccountSheet(proj, acc) {
    openSheet({
      id: 'edit-acc-' + uid(), title: 'تعديل الحساب',
      bodyHTML: `<div class="field"><label>الاسم</label><input type="text" id="aName" value="${escapeHTML(acc.name)}" maxlength="80" autocomplete="off" dir="ltr" style="text-align:left"></div><div class="sheet-actions"><button class="btn btn-ghost" data-cancel>إلغاء</button><button class="btn btn-accent" id="aSave">حفظ</button></div>`,
      onMount: (sheet, close) => {
        const inp = sheet.querySelector('#aName'); setTimeout(() => { inp.focus(); inp.select(); }, 260);
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') doSave(); });
        sheet.querySelector('[data-cancel]').addEventListener('click', close); sheet.querySelector('#aSave').addEventListener('click', doSave);
        function doSave() { const name = inp.value.trim(); if (!name) return; acc.name = name; persist(); close(); renderAll(); toast('تم التعديل ✓', 'success'); }
      }
    });
  }

  function confirmDeleteAccount(proj, acc) { openConfirm({ title: 'حذف الحساب؟', message: `سيتم حذف «${escapeHTML(acc.name)}» وجميع بطاقاته نهائيًا.`, confirmLabel: 'حذف', danger: true, onConfirm: () => { proj.accounts = proj.accounts.filter(x => x.id !== acc.id); persist(); renderAll(); toast('تم حذف الحساب', 'success'); } }); }
  function openAccountContextMenu(proj, acc, x, y) { openContextMenu(x, y, [{ act: 'edit', label: 'تعديل', icon: ICON.edit, run: () => openEditAccountSheet(proj, acc) }, { sep: true }, { act: 'delete', label: 'حذف', icon: ICON.trash, danger: true, run: () => confirmDeleteAccount(proj, acc) }]); }

  function fieldFormHTML(ext) {
    return `<div class="field"><label>اسم البيانات</label><input type="text" id="fLabel" placeholder="مثال: API Key" value="${ext ? escapeHTML(ext.label) : ''}" maxlength="60" autocomplete="off"></div><div class="field"><label>القيمة</label><textarea id="fValue" placeholder="القيمة الكاملة...">${ext ? escapeHTML(ext.value) : ''}</textarea></div><div class="switch-row"><div class="label-block"><strong>بيانات حساسة</strong><span>إخفاء القيمة تلقائيًا خلف نقاط</span></div><div class="switch ${(!ext || ext.sensitive) ? 'on' : ''}" id="fSens"><div class="knob"></div></div></div><div class="sheet-actions"><button class="btn btn-ghost" data-cancel>إلغاء</button><button class="btn btn-accent" id="fSave" ${ext ? '' : 'disabled'}>${ext ? 'حفظ' : 'إضافة'}</button></div>`;
  }
  function wireFieldForm(sheet, close, proj, acc, ext) {
    const lInp = sheet.querySelector('#fLabel'), vInp = sheet.querySelector('#fValue'), sw = sheet.querySelector('#fSens'), save = sheet.querySelector('#fSave');
    let sens = ext ? ext.sensitive : true;
    setTimeout(() => lInp.focus(), 260);
    function check() { save.disabled = !(lInp.value.trim() && vInp.value.trim()); }
    lInp.addEventListener('input', check); vInp.addEventListener('input', check);
    sw.addEventListener('click', () => { sens = !sens; sw.classList.toggle('on', sens); });
    sheet.querySelector('[data-cancel]').addEventListener('click', close);
    save.addEventListener('click', () => {
      const label = lInp.value.trim(), value = vInp.value.trim(); if (!label || !value) return;
      if (ext) { ext.label = label; ext.value = value; ext.sensitive = sens; ext.updatedAt = Date.now(); }
      else {
        acc.fields = acc.fields || []; // حماية
        acc.fields.push({ id: uid(), label, value, sensitive: sens, createdAt: Date.now(), updatedAt: Date.now(), _revealed: false });
      }
      persist(); close(); renderAll(); toast(ext ? 'تم التعديل ✓' : 'تمت الإضافة ✓', 'success');
    });
  }
  function openAddFieldSheet(proj, acc) { openSheet({ id: 'add-f-' + uid(), title: 'بيانات جديدة', subtitle: escapeHTML(acc.name), bodyHTML: fieldFormHTML(null), onMount: (s, c) => wireFieldForm(s, c, proj, acc, null) }); }
  function openEditFieldSheet(proj, acc, f) { openSheet({ id: 'edit-f-' + uid(), title: 'تعديل البيانات', subtitle: escapeHTML(f.label), bodyHTML: fieldFormHTML(f), onMount: (s, c) => wireFieldForm(s, c, proj, acc, f) }); }
  function confirmDeleteField(proj, acc, f) { openConfirm({ title: 'حذف البيانات؟', message: `سيتم حذف «${escapeHTML(f.label)}» نهائيًا.`, confirmLabel: 'حذف', danger: true, onConfirm: () => { acc.fields = acc.fields.filter(x => x.id !== f.id); persist(); renderAll(); toast('تم الحذف', 'success'); } }); }
  function openFieldContextMenu(proj, acc, f, x, y) { openContextMenu(x, y, [{ act: 'copy', label: 'نسخ القيمة', icon: ICON.copy, run: async () => { if (await copyToClipboard(f.value)) toast('تم نسخ «' + f.label + '» ✓', 'success'); } }, { act: 'edit', label: 'تعديل', icon: ICON.edit, run: () => openEditFieldSheet(proj, acc, f) }, { sep: true }, { act: 'delete', label: 'حذف', icon: ICON.trash, danger: true, run: () => confirmDeleteField(proj, acc, f) }]); }

  /* ============================================================
     OPTIONS & AUTH MENU
  ============================================================ */
  UI.optionsBtn.addEventListener('click', () => {
    const googleAuthBtn = currentUser
      ? `<button class="menu-item" data-act="logout">
           <span class="m-ic" style="overflow:hidden;padding:0;border:none">
             <img src="${currentUser.photoURL || 'https://www.gravatar.com/avatar/0?d=mp&f=y'}" referrerpolicy="no-referrer" alt="Profile" style="width:100%;height:100%;object-fit:cover;">
           </span>
           <span class="m-text"><strong>تسجيل الخروج</strong><span dir="ltr">${escapeHTML(currentUser.email)}</span></span>
         </button>`
      : `<button class="menu-item" data-act="login">
           <span class="m-ic" style="background:#fff;border-color:#ddd">${ICON.google}</span>
           <span class="m-text"><strong>تسجيل الدخول بجوجل</strong><span>حفظ ومزامنة عبر السحابة</span></span>
         </button>`;

    openSheet({
      id: 'opts',
      title: 'الخيارات',
      bodyHTML: `
        <div class="menu-list">
          <button class="menu-item" data-act="export"><span class="m-ic">${ICON.download}</span><span class="m-text"><strong>تصدير نسخة JSON</strong><span>حفظ جميع بياناتك في ملف</span></span></button>
          <button class="menu-item" data-act="import"><span class="m-ic">${ICON.upload}</span><span class="m-text"><strong>استيراد نسخة JSON</strong><span>استعادة بيانات سابقة</span></span></button>
          <button class="menu-item danger" data-act="wipe"><span class="m-ic">${ICON.trash}</span><span class="m-text"><strong>حذف جميع البيانات</strong><span>إزالة كل شيء نهائيًا</span></span></button>
          <div class="ctx-sep" style="margin:8px 4px"></div>
          ${googleAuthBtn}
        </div>`,
      onMount: (sheet, close) => {
        sheet.querySelector('[data-act="export"]').addEventListener('click', () => { close(); setTimeout(exportJSON, 180); });
        sheet.querySelector('[data-act="import"]').addEventListener('click', () => { close(); document.getElementById('importInput').click(); });
        sheet.querySelector('[data-act="wipe"]').addEventListener('click', () => { close(); setTimeout(confirmWipeAll, 180); });
        
        sheet.querySelector('[data-act="login"]')?.addEventListener('click', () => {
          close();
          const provider = new firebase.auth.GoogleAuthProvider();
          auth.signInWithPopup(provider).catch(err => {
             console.error(err);
             toast('تعذر تسجيل الدخول', 'error');
          });
        });
        
        sheet.querySelector('[data-act="logout"]')?.addEventListener('click', () => {
          close();
          auth.signOut().then(() => {
            localStorage.removeItem(DB_KEY);
            localStorage.removeItem('vault_manager_db_v1');
            state = defaultState();
            persist();
            renderAll();
            toast('تم تسجيل الخروج وتصفير البيانات', 'success');
          });
        });
      }
    });
  });

  function exportJSON() {
    if (state.projects.length === 0) { toast('لا توجد بيانات', 'error'); return; }
    // إضافة حماية المصفوفات عند التصدير
    const data = { app: 'vault-manager', version: 2, exportedAt: new Date().toISOString(), projects: state.projects.map(p => ({ id: p.id, name: p.name, createdAt: p.createdAt, accounts: (p.accounts || []).map(a => ({ id: a.id, name: a.name, createdAt: a.createdAt, fields: (a.fields || []).map(f => ({ id: f.id, label: f.label, value: f.value, sensitive: f.sensitive, createdAt: f.createdAt, updatedAt: f.updatedAt })) })) })) };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = `vault-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000); toast('تم التصدير ✓', 'success');
  }

  document.getElementById('importInput').addEventListener('change', (e) => {
    const file = e.target.files?.[0]; if (!file) return; e.target.value = '';
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed?.projects) throw new Error();
        const cleanProjects = parsed.projects.map(p => {
          let accounts = [];
          if (p.accounts) accounts = p.accounts.map(a => ({ id: a.id || uid(), name: a.name, createdAt: a.createdAt || Date.now(), fields: (a.fields || []).map(f => ({ ...f, id: f.id || uid(), _revealed: false })) }));
          else if (p.cards) accounts = [{ id: uid(), name: 'حسابات مستوردة', createdAt: Date.now(), fields: p.cards.map(f => ({ ...f, id: f.id || uid(), _revealed: false })) }];
          return { id: p.id || uid(), name: p.name, createdAt: p.createdAt || Date.now(), accounts };
        });
        openConfirm({
          title: 'استبدال البيانات؟', message: 'سيتم استبدال بياناتك الحالية بمحتوى الملف. يُنصح بالتصدير أولاً.', confirmLabel: 'استيراد واستبدال', danger: true,
          onConfirm: () => { state.projects = cleanProjects; state.activeProjectId = 'all'; persist(); renderAll(); toast('تم الاستيراد ✓', 'success'); }
        });
      } catch (err) { toast('ملف غير صالح', 'error'); }
    };
    reader.readAsText(file);
  });

  function confirmWipeAll() {
    openConfirm({ title: 'حذف كل شيء؟', message: 'سيتم حذف كل شيء نهائياً من الجهاز والسحابة.', confirmLabel: 'حذف نهائي', danger: true, onConfirm: () => { localStorage.removeItem('vault_manager_db_v1'); state = defaultState(); persist(); renderAll(); toast('تم حذف البيانات', 'success'); } });
  }

  (async function init() {
    await loadState();
    state.activeProjectId = 'all';
    state.ui = { mode: 'home', viewedProject: null, viewedAccount: null };
    if (!history.state) history.replaceState({ root: true }, '');
    renderAll();
  })();

})();

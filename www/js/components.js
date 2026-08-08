/* ═══════════════════════════════════════════════
   COMPONENT LIBRARY — Shravani AI Learning App
   Factory functions for every reusable component.
   Use: Components.button({...}) returns HTML string.
   ═══════════════════════════════════════════════ */

var Components = (function(){

  // ─── helpers ───
  function join(/*classes*/) {
    return Array.prototype.filter.call(arguments, function(c){ return c; }).join(' ');
  }

  // ════════════════════════════════════════════
  // 1. PRIMARY BUTTON
  // ════════════════════════════════════════════
  // opts: { label, icon, size:'large'|'medium'|'small', loading, disabled, full, onClick, className, type }
  function primaryButton(opts) {
    opts = opts || {};
    var size = opts.size === 'large' ? 'btn-large' : opts.size === 'small' ? 'btn-small' : '';
    var cls = join('btn btn-primary', size, opts.full && 'btn-full', opts.className);
    var disabled = opts.disabled || opts.loading ? 'disabled' : '';
    var inner = opts.loading ? '<span class="loading-dots"><span></span><span></span><span></span></span>' :
               (opts.icon ? opts.icon + ' ' : '') + (opts.label || 'Button');
    return '<button class="' + cls + '" ' + disabled + ' onclick="' + (opts.onClick || '') + '" type="' + (opts.type || 'button') + '">' + inner + '</button>';
  }

  // ════════════════════════════════════════════
  // 2. SECONDARY / BORDER / ICON / TEXT BUTTON
  // ════════════════════════════════════════════
  // opts: { label, icon, variant:'secondary'|'ghost'|'danger'|'success', ... }
  function button(opts) {
    opts = opts || {};
    var v = opts.variant === 'secondary' ? 'btn-secondary' :
           opts.variant === 'ghost' ? 'btn-ghost' :
           opts.variant === 'danger' ? 'btn-danger' :
           opts.variant === 'success' ? 'btn-success' : 'btn-primary';
    var size = opts.size === 'large' ? 'btn-large' : opts.size === 'small' ? 'btn-small' : '';
    var cls = join('btn', v, size, opts.iconOnly && 'btn-icon', opts.full && 'btn-full', opts.className);
    var disabled = opts.disabled ? 'disabled' : '';
    var inner = opts.iconOnly ? (opts.icon || '?') :
               (opts.icon ? opts.icon + ' ' : '') + (opts.label || '');
    return '<button class="' + cls + '" ' + disabled + ' onclick="' + (opts.onClick || '') + '" type="' + (opts.type || 'button') + '" aria-label="' + (opts.ariaLabel || opts.label || '') + '">' + inner + '</button>';
  }

  // ════════════════════════════════════════════
  // 3. CARD
  // ════════════════════════════════════════════
  // opts: { size:'lg'|'sm', clickable, colored, gradient, glass, style, onClick, children }
  function card(opts) {
    opts = opts || {};
    var cls = join('card', opts.size === 'lg' && 'card-lg', opts.size === 'sm' && 'card-sm',
                   opts.clickable && 'card-clickable', opts.colored && 'card-colored',
                   opts.glass && 'card-glass', opts.className);
    var styles = '';
    if (opts.gradient) styles += 'background:' + opts.gradient + ';';
    if (opts.style) styles += opts.style;
    var clickAttr = opts.onClick ? ' onclick="' + opts.onClick + '"' : '';
    return '<div class="' + cls + '" style="' + styles + '"' + clickAttr + '>' + (opts.children || '') + '</div>';
  }

  // ════════════════════════════════════════════
  // 4. PROGRESS CARD
  // ════════════════════════════════════════════
  // opts: { title, subtitle, progress (0-100), time, color, ring }
  function progressCard(opts) {
    opts = opts || {};
    var pct = Math.min(Math.max(opts.progress || 0, 0), 100);
    var color = opts.color || 'var(--color-primary)';
    var barColor = opts.color || '';
    var ringHTML = '';
    if (opts.ring !== false) {
      var circ = 226.19;
      var offset = circ - (circ * pct / 100);
      ringHTML = '<svg class="ring-svg" viewBox="0 0 80 80" style="width:64px;height:64px"><circle class="ring-bg" cx="40" cy="40" r="36"/><circle class="ring-fill" cx="40" cy="40" r="36" stroke="' + color + '" stroke-dashoffset="' + offset + '"/><text class="ring-text" x="40" y="41" font-size="14">' + pct + '%</text></svg>';
    }
    return '<div class="progress-card-compact card" style="' + (opts.style || '') + '">' +
      '<div class="progress-card-info">' +
        '<div class="progress-card-title">' + (opts.title || '') + '</div>' +
        '<div class="progress-card-subtitle">' + (opts.subtitle || '') + '</div>' +
        '<div class="progress-card-bar" style="background:' + (opts.barBg || 'var(--color-divider)') + '">' +
          '<div class="progress-card-bar-fill" style="width:' + pct + '%;' + (barColor ? 'background:' + barColor : '') + '"></div>' +
        '</div>' +
        (opts.time ? '<div class="progress-card-time">' + opts.time + '</div>' : '') +
      '</div>' +
      (opts.ring !== false ? '<div class="continue-card-ring">' + ringHTML + '</div>' : '') +
    '</div>';
  }

  // ════════════════════════════════════════════
  // 5. SUBJECT CARD
  // ════════════════════════════════════════════
  // opts: { icon, name, chapters, progress, color, onClick }
  function subjectCard(opts) {
    opts = opts || {};
    var pct = Math.min(Math.max(opts.progress || 0, 0), 100);
    var bg = opts.color || 'var(--color-primary-light)';
    var cls = join('subj-card', opts.colored && 'subj-card-colored');
    return '<div class="' + cls + '" style="background:' + bg + '" onclick="' + (opts.onClick || '') + '">' +
      '<span class="subj-card-icon">' + (opts.icon || '📖') + '</span>' +
      '<div class="subj-card-name">' + (opts.name || 'Subject') + '</div>' +
      '<div class="subj-card-meta">' + (opts.chapters || 0) + ' chapters</div>' +
      '<div class="subj-card-progress"><div class="subj-card-progress-fill" style="width:' + pct + '%"></div></div>' +
    '</div>';
  }

  // ════════════════════════════════════════════
  // 6. CHAPTER CARD
  // ════════════════════════════════════════════
  // opts: { number, name, difficulty:'easy'|'medium'|'hard', time, progress, onClick, color, bookmark }
  function chapterCard(opts) {
    opts = opts || {};
    var pct = Math.min(Math.max(opts.progress || 0, 0), 100);
    var color = opts.color || 'var(--color-primary)';
    var diffLabel = opts.difficulty || '';
    var diffColor = diffLabel === 'easy' ? 'var(--color-accent-green)' : diffLabel === 'medium' ? 'var(--color-warning)' : diffLabel === 'hard' ? 'var(--color-danger)' : '';
    var circ = 113.1;
    var offset = circ - (circ * pct / 100);
    var ringHTML = '<svg class="chapter-card-progress-ring" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="none" stroke="var(--color-divider)" stroke-width="4"/><circle cx="20" cy="20" r="18" fill="none" stroke="' + color + '" stroke-width="4" stroke-linecap="round" stroke-dasharray="113.1" stroke-dashoffset="' + offset + '" transform="rotate(-90 20 20)"/></svg>';
    return '<div class="chapter-card" onclick="' + (opts.onClick || '') + '">' +
      '<div class="chapter-card-left" style="background:' + color + '">' + (opts.number || '1') + '</div>' +
      '<div class="chapter-card-body">' +
        '<div class="chapter-card-name">' + (opts.name || 'Chapter') + '</div>' +
        '<div class="chapter-card-meta">' +
          (diffColor ? '<span class="badge" style="background:' + diffColor + '20;color:' + diffColor + '">' + opts.difficulty + '</span>' : '') +
          '<span>' + (opts.time || '') + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="chapter-card-right">' +
        ringHTML +
      '</div>' +
    '</div>';
  }

  // ════════════════════════════════════════════
  // 7. GAME CARD
  // ════════════════════════════════════════════
  // opts: { icon, name, xp, difficulty:'easy'|'medium'|'hard', onClick, color }
  function gameCard(opts) {
    opts = opts || {};
    var diffColor = opts.difficulty === 'easy' ? 'var(--color-accent-green)' :
                    opts.difficulty === 'medium' ? 'var(--color-warning)' :
                    opts.difficulty === 'hard' ? 'var(--color-danger)' : 'var(--color-accent-green)';
    return '<div class="game-card" style="border-color:' + (opts.color || 'transparent') + '" onclick="' + (opts.onClick || '') + '">' +
      '<span class="game-card-icon">' + (opts.icon || '🎮') + '</span>' +
      '<div class="game-card-name">' + (opts.name || 'Game') + '</div>' +
      '<div class="game-card-xp">⭐ ' + (opts.xp || 0) + ' XP</div>' +
      '<span class="badge" style="background:' + diffColor + '20;color:' + diffColor + ';margin-top:var(--space-6);display:inline-block">' + (opts.difficulty || 'easy') + '</span>' +
    '</div>';
  }

  // ════════════════════════════════════════════
  // 8. ACHIEVEMENT CARD
  // ════════════════════════════════════════════
  // opts: { icon, label, desc, unlocked }
  function achievementCard(opts) {
    opts = opts || {};
    var cls = 'ach-card' + (opts.unlocked ? ' unlocked' : ' locked');
    return '<div class="' + cls + '">' +
      '<span class="ach-card-icon">' + (opts.icon || '🏆') + '</span>' +
      '<div class="ach-card-label">' + (opts.label || 'Badge') + '</div>' +
      '<div class="ach-card-desc">' + (opts.unlocked ? '✅ ' : '🔒 ') + (opts.desc || '') + '</div>' +
    '</div>';
  }

  // ════════════════════════════════════════════
  // 9. STATISTICS CARD
  // ════════════════════════════════════════════
  // opts: { items: [{ icon, value, label, bg }] }
  function statisticsCard(opts) {
    opts = opts || {};
    var items = opts.items || [];
    var html = '<div class="stats-card">';
    items.forEach(function(item, i) {
      if (i > 0) html += '<div class="stats-divider"></div>';
      html += '<div class="stats-item">' +
        '<div class="stats-item-icon" style="background:' + (item.bg || 'var(--color-primary-light)') + '">' + (item.icon || '⭐') + '</div>' +
        '<div class="stats-item-value">' + (item.value || '0') + '</div>' +
        '<div class="stats-item-label">' + (item.label || '') + '</div>' +
      '</div>';
    });
    html += '</div>';
    return html;
  }

  // ════════════════════════════════════════════
  // 10. INPUT FIELD
  // ════════════════════════════════════════════
  // opts: { label, placeholder, type, value, error, success, multiline, onChange, onKeydown, id, maxlength, inputmode, pattern }
  function inputField(opts) {
    opts = opts || {};
    var errCls = opts.error ? 'input-error' : opts.success ? 'input-success' : '';
    var tag = opts.multiline ? 'textarea' : 'input';
    var extra = tag === 'textarea' ? '' : 'type="' + (opts.type || 'text') + '"';
    var valAttr = opts.value ? 'value="' + opts.value.replace(/"/g,'&quot;') + '"' : '';
    var ph = opts.placeholder ? 'placeholder="' + opts.placeholder + '"' : '';
    var labelHTML = opts.label ? '<label style="font-family:var(--font-family);font-size:var(--font-size-caption);font-weight:var(--font-weight-medium);color:var(--color-text-secondary);margin-bottom:var(--space-4);display:block">' + opts.label + '</label>' : '';
    var cls = join(tag === 'textarea' ? 'input textarea' : 'input', opts.size === 'lg' && 'input-lg', errCls, opts.className);
    return '<div>' + labelHTML +
      '<' + tag + ' class="' + cls + '" ' + extra + ' ' + ph + ' ' + valAttr +
        (opts.id ? ' id="' + opts.id + '"' : '') +
        (opts.maxlength ? ' maxlength="' + opts.maxlength + '"' : '') +
        (opts.inputmode ? ' inputmode="' + opts.inputmode + '"' : '') +
        (opts.pattern ? ' pattern="' + opts.pattern + '"' : '') +
        (opts.onChange ? ' oninput="' + opts.onChange + '"' : '') +
        (opts.onKeydown ? ' onkeydown="' + opts.onKeydown + '"' : '') +
        ' style="' + (opts.multiline ? '' : '') + '"></' + tag + '>' +
      (opts.error ? '<div style="font-size:var(--font-size-caption);color:var(--color-danger);margin-top:var(--space-4)">' + opts.error + '</div>' : '') +
    '</div>';
  }

  // ════════════════════════════════════════════
  // 11. SEARCH BAR
  // ════════════════════════════════════════════
  // opts: { placeholder, value, onChange, onClear, id }
  function searchBar(opts) {
    opts = opts || {};
    var id = opts.id || '_search_' + Math.random().toString(36).slice(2, 8);
    var hasVal = opts.value ? ' has-value' : '';
    return '<div class="search-bar' + hasVal + '" id="' + id + '_wrap">' +
      '<span class="search-bar-icon">🔍</span>' +
      '<input class="search-bar-input" type="text" placeholder="' + (opts.placeholder || 'Search...') + '" value="' + (opts.value || '') + '" id="' + id + '" oninput="var w=document.getElementById(\'' + id + '_wrap\');if(w)w.classList.toggle(\'has-value\',this.value.length>0);' + (opts.onChange || '') + '">' +
      '<button class="search-bar-clear" onclick="var inp=document.getElementById(\'' + id + '\');if(inp){inp.value=\'\';inp.focus();var w=document.getElementById(\'' + id + '_wrap\');if(w)w.classList.remove(\'has-value\');}' + (opts.onClear || '') + '">✕</button>' +
    '</div>';
  }

  // ════════════════════════════════════════════
  // 12. SECTION HEADER
  // ════════════════════════════════════════════
  // opts: { title, subtitle, actionLabel, actionOnClick }
  function sectionHeader(opts) {
    opts = opts || {};
    return '<div class="section-header-compact">' +
      '<div>' +
        '<div class="section-header-title">' + (opts.title || '') + '</div>' +
        (opts.subtitle ? '<div class="section-header-subtitle">' + opts.subtitle + '</div>' : '') +
      '</div>' +
      (opts.actionLabel ? '<button class="section-header-action" onclick="' + (opts.actionOnClick || '') + '">' + opts.actionLabel + '</button>' : '') +
    '</div>';
  }

  // ════════════════════════════════════════════
  // 13. DIALOG
  // ════════════════════════════════════════════
  // opts: { icon, title, desc, actions: [{ label, variant, onClick }], id }
  function dialog(opts) {
    opts = opts || {};
    var id = opts.id || '_dlg_' + Math.random().toString(36).slice(2, 8);
    var actionsHtml = '';
    if (opts.actions) {
      actionsHtml = '<div class="dialog-actions">';
      opts.actions.forEach(function(a) {
        actionsHtml += Components.button({ label: a.label, variant: a.variant || 'primary', onClick: a.onClick, full: true, className: a.className });
      });
      actionsHtml += '</div>';
    }
    return '<div class="dialog-overlay" id="' + id + '">' +
      '<div class="dialog">' +
        (opts.icon ? '<span class="dialog-icon">' + opts.icon + '</span>' : '') +
        (opts.title ? '<div class="dialog-title">' + opts.title + '</div>' : '') +
        (opts.desc ? '<div class="dialog-desc">' + opts.desc + '</div>' : '') +
        actionsHtml +
      '</div>' +
    '</div>';
  }

  // ════════════════════════════════════════════
  // 14. BOTTOM SHEET
  // ════════════════════════════════════════════
  // opts: { id, title, children, onClose, show }
  function bottomSheet(opts) {
    opts = opts || {};
    var id = opts.id || '_sheet_' + Math.random().toString(36).slice(2, 8);
    return '<div class="sheet-backdrop" id="' + id + '_backdrop" onclick="Components.closeSheet(\'' + id + '\');' + (opts.onClose || '') + '"></div>' +
      '<div class="sheet" id="' + id + '">' +
        '<div class="sheet-handle"></div>' +
        (opts.title ? '<div class="sheet-header"><div class="sheet-title">' + opts.title + '</div><button class="sheet-close" onclick="Components.closeSheet(\'' + id + '\');' + (opts.onClose || '') + '">✕</button></div>' : '') +
        (opts.children || '') +
      '</div>';
  }

  // ════════════════════════════════════════════
  // 15. BOTTOM NAVIGATION
  // ════════════════════════════════════════════
  // opts: { active:'home'|'subjects'|'ai'|'games'|'profile', onNavigate }
  function bottomNav(opts) {
    opts = opts || {};
    var active = opts.active || 'home';
    function isA(v) { return active === v ? ' nav-item-active' : ''; }
    return '<nav class="bottom-nav">' +
      '<button class="nav-item' + isA('home') + '" onclick="' + (opts.onNavigate ? opts.onNavigate + "('home')" : '') + '"><span class="nav-icon">🏠</span><span>Home</span></button>' +
      '<button class="nav-item' + isA('subjects') + '" onclick="' + (opts.onNavigate ? opts.onNavigate + "('subjects')" : '') + '"><span class="nav-icon">📚</span><span>Subjects</span></button>' +
      '<button class="nav-ai-btn" onclick="' + (opts.onNavigate ? opts.onNavigate + "('ai')" : '') + '"><span class="nav-icon">🤖</span></button>' +
      '<button class="nav-item' + isA('games') + '" onclick="' + (opts.onNavigate ? opts.onNavigate + "('games')" : '') + '"><span class="nav-icon">🎮</span><span>Games</span></button>' +
      '<button class="nav-item' + isA('profile') + '" onclick="' + (opts.onNavigate ? opts.onNavigate + "('profile')" : '') + '"><span class="nav-icon">👤</span><span>Profile</span></button>' +
    '</nav>';
  }

  // ════════════════════════════════════════════
  // 16. FLOATING AI BUTTON
  // ════════════════════════════════════════════
  // opts: { onClick, badge }
  function aiFloatingButton(opts) {
    opts = opts || {};
    return '<button class="ai-fab" onclick="' + (opts.onClick || '') + '" aria-label="AI Teacher">' +
      (opts.badge ? '<span class="badge badge-number" style="top:-2px;right:-2px">' + opts.badge + '</span>' : '') +
      '🤖</button>';
  }

  // ════════════════════════════════════════════
  // 17. TOP HEADER
  // ════════════════════════════════════════════
  // opts: { name, avatar, motto, actions: [{ icon, onClick }] }
  function topHeader(opts) {
    opts = opts || {};
    var avatarHtml = opts.avatar ?
      '<div class="avatar avatar-border"><img src="' + opts.avatar + '" alt=""></div>' :
      '<div class="avatar" style="background:var(--color-primary-light)">' + (opts.name ? opts.name.charAt(0).toUpperCase() : '👤') + '</div>';
    var actionsHtml = '';
    if (opts.actions) {
      opts.actions.forEach(function(a) {
        actionsHtml += '<button class="btn-icon-small btn-ghost" onclick="' + (a.onClick || '') + '" aria-label="' + (a.label || '') + '">' + (a.icon || '') + '</button>';
      });
    }
    return '<div class="top-header">' +
      '<div class="top-header-left">' +
        avatarHtml +
        '<div class="top-header-greeting">' +
          '<div class="top-header-small">Hello,</div>' +
          '<div class="top-header-name">' + (opts.name || 'Student!') + '</div>' +
          (opts.motto ? '<div class="top-header-motto">' + opts.motto + '</div>' : '') +
        '</div>' +
      '</div>' +
      (actionsHtml ? '<div class="top-header-actions">' + actionsHtml + '</div>' : '') +
    '</div>';
  }

  // ════════════════════════════════════════════
  // 18. CONTINUE LEARNING CARD
  // ════════════════════════════════════════════
  // opts: { subject, chapter, progress, time, color, onClick }
  function continueLearningCard(opts) {
    opts = opts || {};
    var pct = Math.min(Math.max(opts.progress || 0, 0), 100);
    var color = opts.color || 'var(--color-primary)';
    var circ = 226.19;
    var offset = circ - (circ * pct / 100);
    return '<div class="continue-card-compact">' +
      '<div class="continue-card-body">' +
        '<div class="continue-card-label">Continue Learning</div>' +
        '<div class="continue-card-subject">' + (opts.subject || 'Subject') + '</div>' +
        '<div class="continue-card-chapter">' + (opts.chapter || 'Chapter') + '</div>' +
        '<button class="btn btn-primary btn-small" onclick="' + (opts.onClick || '') + '">Continue ➜</button>' +
      '</div>' +
      '<div class="continue-card-ring">' +
        '<svg viewBox="0 0 80 80" style="width:72px;height:72px">' +
          '<circle cx="40" cy="40" r="36" fill="none" stroke="var(--color-divider)" stroke-width="6"/>' +
          '<circle cx="40" cy="40" r="36" fill="none" stroke="' + color + '" stroke-width="6" stroke-linecap="round" stroke-dasharray="226.19" stroke-dashoffset="' + offset + '" transform="rotate(-90 40 40)" style="transition:stroke-dashoffset ' + (opts.animSpeed || '0.8s') + ' ease"/>' +
          '<text x="40" y="44" text-anchor="middle" font-family="var(--font-family)" font-size="16" font-weight="700" fill="var(--color-text-primary)">' + pct + '%</text>' +
        '</svg>' +
        (opts.time ? '<div style="text-align:center;font-size:var(--font-size-tiny);color:var(--color-text-muted);margin-top:var(--space-4)">' + opts.time + '</div>' : '') +
      '</div>' +
    '</div>';
  }

  // ════════════════════════════════════════════
  // 19. DAILY GOAL CARD
  // ════════════════════════════════════════════
  // opts: { completed, total, message, reward }
  function dailyGoalCard(opts) {
    opts = opts || {};
    var completed = opts.completed || 0;
    var total = opts.total || 3;
    var pct = Math.min(Math.round(completed / total * 100), 100);
    var msgs = ["Let's start learning! 🚀", "Great start! Keep going! 💪", "Almost there! You rock! 🌟", "Perfect! You crushed it! 🎉"];
    var msg = opts.message || msgs[Math.min(completed, msgs.length - 1)];
    return '<div class="goal-card-compact">' +
      '<div class="goal-card-header">' +
        '<span class="goal-card-icon">🎯</span>' +
        '<span class="goal-card-title">Today\'s Goal</span>' +
        '<span class="goal-card-count">' + completed + ' / ' + total + '</span>' +
      '</div>' +
      '<div class="progress-track"><div class="progress-fill progress-fill-green" style="width:' + pct + '%"></div></div>' +
      '<div class="goal-card-msg">' + msg + '</div>' +
      (opts.reward ? '<div class="goal-card-reward">🎁 ' + opts.reward + '</div>' : '') +
    '</div>';
  }

  // ════════════════════════════════════════════
  // 20. EMPTY STATE
  // ════════════════════════════════════════════
  // opts: { icon, title, desc, actionLabel, actionOnClick }
  function emptyState(opts) {
    opts = opts || {};
    return '<div class="empty-state">' +
      '<span class="empty-state-icon">' + (opts.icon || '📭') + '</span>' +
      '<div class="empty-state-title">' + (opts.title || 'Nothing here yet') + '</div>' +
      (opts.desc ? '<div class="empty-state-desc">' + opts.desc + '</div>' : '') +
      (opts.actionLabel ? '<div class="empty-state-action">' + Components.button({ label: opts.actionLabel, variant: 'secondary', onClick: opts.actionOnClick, size: 'small' }) + '</div>' : '') +
    '</div>';
  }

  // ════════════════════════════════════════════
  // 21. LOADING STATE (skeletons)
  // ════════════════════════════════════════════
  // opts: { type:'card'|'list'|'text', count }
  function loadingState(opts) {
    opts = opts || {};
    var count = opts.count || 3;
    var html = '';
    if (opts.type === 'card' || opts.type === 'grid') {
      for (var i = 0; i < count; i++) {
        html += '<div class="skeleton skel-card" style="' + (opts.type === 'grid' ? 'display:inline-block;width:calc(50% - 6px);margin:3px' : 'margin-bottom:var(--space-12)') + '"></div>';
      }
    } else if (opts.type === 'list') {
      for (var j = 0; j < count; j++) {
        html += '<div style="display:flex;align-items:center;gap:var(--space-12);margin-bottom:var(--space-16)">' +
          '<div class="skeleton skel-avatar"></div>' +
          '<div style="flex:1"><div class="skeleton skel-line"></div><div class="skeleton skel-line skel-line-sm" style="margin-bottom:0"></div></div>' +
        '</div>';
      }
    } else {
      for (var k = 0; k < count; k++) {
        html += '<div class="skeleton skel-line"></div>';
        if (k === 0) html += '<div class="skeleton skel-line skel-line-sm"></div>';
      }
    }
    return '<div style="padding:var(--space-8) 0">' + html + '</div>';
  }

  // ════════════════════════════════════════════
  // 22. TOAST
  // ════════════════════════════════════════════
  // opts: { message, type:'success'|'warning'|'error'|'', duration(ms) }
  function showToast(opts) {
    opts = opts || {};
    var typeCls = opts.type === 'success' ? ' toast-success' :
                  opts.type === 'warning' ? ' toast-warning' :
                  opts.type === 'error' ? ' toast-error' : '';
    var el = document.createElement('div');
    el.className = 'toast' + typeCls;
    el.textContent = opts.message || '';
    document.body.appendChild(el);
    var dur = opts.duration || 2500;
    setTimeout(function() {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.3s ease';
      setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 300);
    }, dur);
  }

  // ════════════════════════════════════════════
  // 23. BADGE
  // ════════════════════════════════════════════
  // opts: { label, variant:'new'|'pro'|'hot'|'ai'|'default', number }
  function badge(opts) {
    opts = opts || {};
    var vCls = opts.variant === 'new' ? 'badge-new' :
               opts.variant === 'pro' ? 'badge-pro' :
               opts.variant === 'hot' ? 'badge-hot' :
               opts.variant === 'ai' ? 'badge-ai' : '';
    var cls = join('badge', vCls, opts.className);
    if (opts.number) {
      return '<span class="badge-number">' + opts.number + '</span>';
    }
    return '<span class="' + cls + '">' + (opts.label || '') + '</span>';
  }

  // ════════════════════════════════════════════
  // 24. CHIP
  // ════════════════════════════════════════════
  // opts: { label, variant:'subject'|'filter'|'suggestion', active, onClick, icon }
  function chip(opts) {
    opts = opts || {};
    var vCls = opts.variant === 'subject' ? 'chip-subject' :
               opts.variant === 'suggestion' ? 'chip-suggestion' : 'chip-filter';
    var cls = join('chip', vCls, opts.active && 'chip-active', opts.className);
    var icon = opts.icon || '';
    return '<button class="' + cls + '" onclick="' + (opts.onClick || '') + '">' +
      (icon ? icon + ' ' : '') + (opts.label || '') +
    '</button>';
  }

  // ════════════════════════════════════════════
  // 25. AVATAR
  // ════════════════════════════════════════════
  // opts: { src, name, size:'sm'|'lg'|'', border, onClick }
  function avatar(opts) {
    opts = opts || {};
    var sizeCls = opts.size === 'sm' ? 'avatar-sm' : opts.size === 'lg' ? 'avatar-lg' : '';
    var cls = join('avatar', sizeCls, opts.border && 'avatar-border', opts.className);
    if (opts.src) {
      return '<div class="' + cls + '"' + (opts.onClick ? ' onclick="' + opts.onClick + '" style="cursor:pointer"' : '') + '><img src="' + opts.src + '" alt=""></div>';
    }
    return '<div class="' + cls + '"' + (opts.onClick ? ' onclick="' + opts.onClick + '" style="cursor:pointer"' : '') + '>' + (opts.name ? opts.name.charAt(0).toUpperCase() : '🌸') + '</div>';
  }

  // ════════════════════════════════════════════
  // 26. AI MESSAGE BUBBLE
  // ════════════════════════════════════════════
  // opts: { text, type:'user'|'ai'|'voice', onSpeak }
  function messageBubble(opts) {
    opts = opts || {};
    if (opts.type === 'voice') {
      return '<div class="bubble bubble-voice" onclick="' + (opts.onSpeak || '') + '">🎤 ' + (opts.text || 'Tap to speak...') + '</div>';
    }
    var cls = opts.type === 'user' ? 'bubble-user' : 'bubble-ai';
    var listenHtml = opts.type === 'ai' && opts.onSpeak ? '<div class="bubble-speak" onclick="' + opts.onSpeak + '">🔊 Listen</div>' : '';
    return '<div class="bubble ' + cls + '">' +
      '<span>' + (opts.text || '').replace(/</g,'&lt;') + '</span>' +
      listenHtml +
    '</div>';
  }

  // ════════════════════════════════════════════
  // UTILITY: close bottom sheet
  // ════════════════════════════════════════════
  function closeSheet(id) {
    var backdrop = document.getElementById(id + '_backdrop');
    var sheet = document.getElementById(id);
    if (backdrop) backdrop.remove();
    if (sheet) sheet.remove();
  }

  // ════════════════════════════════════════════
  // UTILITY: close dialog
  // ════════════════════════════════════════════
  function closeDialog(id) {
    var el = document.getElementById(id);
    if (el) el.remove();
  }

  // ════════════════════════════════════════════
  // UTILITY: show dialog as overlay (appends to body)
  // ════════════════════════════════════════════
  function showDialog(opts) {
    var html = Components.dialog(opts);
    var div = document.createElement('div');
    div.innerHTML = html;
    while (div.firstChild) document.body.appendChild(div.firstChild);
    return document.querySelector('.dialog-overlay:last-child');
  }

  // ════════════════════════════════════════════
  // UTILITY: show bottom sheet
  // ════════════════════════════════════════════
  function showBottomSheet(opts) {
    var html = Components.bottomSheet(opts);
    var div = document.createElement('div');
    div.innerHTML = html;
    while (div.firstChild) document.body.appendChild(div.firstChild);
    return document.getElementById(opts.id || '');
  }

  // ════════════════════════════════════════════
  // PUBLIC API
  // ════════════════════════════════════════════
  return {
    // 1-2
    button: button,
    primaryButton: primaryButton,
    // 3
    card: card,
    // 4
    progressCard: progressCard,
    // 5
    subjectCard: subjectCard,
    // 6
    chapterCard: chapterCard,
    // 7
    gameCard: gameCard,
    // 8
    achievementCard: achievementCard,
    // 9
    statisticsCard: statisticsCard,
    // 10
    inputField: inputField,
    // 11
    searchBar: searchBar,
    // 12
    sectionHeader: sectionHeader,
    // 13
    dialog: dialog,
    // 14
    bottomSheet: bottomSheet,
    // 15
    bottomNav: bottomNav,
    // 16
    aiFloatingButton: aiFloatingButton,
    // 17
    topHeader: topHeader,
    // 18
    continueLearningCard: continueLearningCard,
    // 19
    dailyGoalCard: dailyGoalCard,
    // 20
    emptyState: emptyState,
    // 21
    loadingState: loadingState,
    // 22
    showToast: showToast,
    // 23
    badge: badge,
    // 24
    chip: chip,
    // 25
    avatar: avatar,
    // 26
    messageBubble: messageBubble,
    // utilities
    closeSheet: closeSheet,
    closeDialog: closeDialog,
    showDialog: showDialog,
    showBottomSheet: showBottomSheet
  };
})();
window.showToast = Components.showToast;

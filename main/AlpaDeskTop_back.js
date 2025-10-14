/* =========================
 * AlpaDeskTop.js 
 *  - 해당 라이브러리는 AlpaDesign(개발자 장윤수)가 제작하였으며 무단배포를 금지합니다.
 *  - 문의 : skskskwkd456@naver.com
 * ========================= */

const TYPE = { FILE: "file", FOLDER: "folder" };

const Icon = {
    get(extOrType, ico = null) {
        const t = (extOrType || "").toLowerCase();
        if (t === TYPE.FOLDER || t === "folder") {
            return '<span class="i_cover folders"><i class="bi bi-folder-fill"></i></span>';
        }
        switch (t) {
            case ".mp4": case ".webm": case ".youtube":
                return '<span class="i_cover videos"><i class="bi bi-file-play-fill"></i></span>';
            case ".pdf":
                return '<span class="i_cover pdf"><i class="bi bi-file-earmark-pdf"></i></span>';
            case ".jpg": case ".jpeg": case ".png": case ".gif":
                return '<span class="i_cover images"><i class="bi bi-file-image"></i></span>';
            case ".exe":
                return ico ?? '<span class="i_cover exe"><i class="bi bi-terminal-fill"></i></span>';
            default:
                return '<span class="i_cover earmark"><i class="bi bi-file-earmark"></i></span>';
        }
    }
};

const Path = {
    join(a, b) { return (a || "").replace(/\\+$/, "") + "\\" + (b || "").replace(/^\\+/, ""); },
    dirname(p) { const i = (p || "").lastIndexOf("\\"); return i > 0 ? p.slice(0, i) : (p || ""); },
    basename(p) { const i = (p || "").lastIndexOf("\\"); return i >= 0 ? p.slice(i + 1) : (p || ""); }
};

function getItemIconHTML(item) {
        // ico가 있으면 우선 사용
        if (item.ico) {
            const v = `${String(item.ico).trim()}`;
            // '<' 로 시작하면 이미 HTML이라고 간주(예: <i class="bi ..."></i>)
            if (v.startsWith('<')) return v;
            // 그 외는 이미지 URL로 간주
            return `<img src="${v}" alt="" style="width:24px;height:24px;object-fit:contain;">`;
        }
        // ico가 없으면 확장자별 기본 아이콘
        return Icon.get(item.ext);
    }

/** 표준화: 파일/폴더 공통 스키마
 *  - 파일: dirPath, fullPath 제공
 *  - 폴더: dirPath===path===fullPath
 */
function normItem(raw) {
  // --- 폴더 ---
  if (raw.ext === "folder" || raw.type === TYPE.FOLDER) {
    const p  = raw.url || raw.path || "";
    const rp = (raw.realPath ? String(raw.realPath) : p).replace(/\//g, "\\"); // realPath 보존
    
    return {
      type: TYPE.FOLDER,
      title: raw.title,
      name: raw.name || raw.txt || Path.basename(p),
      path: p,               // 아이콘(표시) 위치
      ext: "folder",
      realPath: rp,          // 시작 경로로 사용될 수 있는 실제 경로
      ico: raw.ico || null,
      idx: raw.idx ?? -1,
      pk:  raw.pk ?? null,
      dirPath: p,
      fullPath: p,
      order: raw.order ?? null
    };
  }

  // --- 파일(기존 그대로) ---
  const base = raw.url || raw.path || "";
  const name = raw.name || raw.txt || Path.basename(base);
  const looksLikeFull =
    base.toLowerCase().endsWith(("\\" + name).toLowerCase()) ||
    base.toLowerCase().endsWith(name.toLowerCase());
  const dir  = looksLikeFull ? Path.dirname(base) : base;
  const full = looksLikeFull ? base : Path.join(dir, name);

  return {
    type: TYPE.FILE,
    name,
    title: raw.title,
    path: base,
    ext: raw.ext || "",
    realPath: raw.realPath || raw.url || "",
    ico: raw.ico || null,
    idx: raw.idx ?? -1,
    pk:  raw.pk ?? null,
    dirPath: dir,
    fullPath: full,
    order: raw.order ?? null
  };
}




/* =========================
 * 바탕화면 아이콘 렌더러 (네 구조 유지)
 * ========================= */
class AlpaDesktop {
  constructor({ target, manager, disk, desktopPath = "C:\\Users\\바탕화면",onReorder =null  }){
    this.$root = $(target);
    this.manager = manager;
    this.diskRaw = disk;
    this.disk = disk.map(normItem);
    this.desktopPath = desktopPath.replace(/\//g,"\\");
    this.items = this.disk.filter(it => it.path === this.desktopPath);
    this.sel = -1;
    this.ns = `.desk-${Math.random().toString(36).slice(2)}`;
    this.onReorder = onReorder;
  }

  // pk가 있으면 대상(idx=pk) 항목 반환, 없으면 자기 자신
  // ★ 폴더가 바탕화면(예: C:\Users\바탕화면)에 있을 때는 realPath로 진입하도록 보정
  _resolveTarget(item){
  // 1) pk 링크 해석 (바로가기 → 원본)
  let target = item;
  if (item?.pk != null) {
    const found = this.disk.find(d => d.idx === item.pk);
    if (found) target = found;
  }

  // 2) 바탕화면 폴더면 realPath로 진입
  const isDesktopIcon = String(item?.path || "").replace(/\//g, "\\") === this.desktopPath; // 아이콘이 놓인 경로
  const isFolder = target?.type === TYPE.FOLDER;
  const hasReal = !!target?.realPath;

  if (isDesktopIcon && isFolder && hasReal) {
    const rp = String(target.realPath).replace(/\//g, "\\");
    return {
      ...target,
      path: rp,         // ★ 시작 경로를 realPath로
      dirPath: rp,
      fullPath: rp
    };
  }

  return target;
}


  render(){
  this.$root.empty().attr('tabindex', 0);

  this.items.forEach((it, i) => {
    const iconHtml = getItemIconHTML(it);
    const $ico = $(`
      <div class="window_ico"
           style="grid-column-start:${it.order?.x ?? 1}; grid-row-start:${it.order?.y ?? 1}"
           data-type="${it.type}" data-idx="${i}">
        ${iconHtml}
        <span class="txt">${it.name}</span>
      </div>
    `);

    this._placeIcon($ico, it.order?.x, it.order?.y);

    $ico.on('click', (e)=>{ e.preventDefault(); this.setSelect(i, true); this.$root.focus(); });
    $ico.on('dblclick', (e)=>{ e.preventDefault(); this.setSelect(i, false);
      const target = this._resolveTarget(this.items[i]); this.manager.open(target);
    });

    this.$root.append($ico);
  });

  this._enableDnd();

  this.$root.off('keydown' + this.ns).on('keydown' + this.ns, (e) => {
    if (e.key === 'ArrowUp') { e.preventDefault(); this.moveSel(-1); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); this.moveSel(+1); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (this.sel >= 0) { const target = this._resolveTarget(this.items[this.sel]); this.manager.open(target); }
    }
  });
}




  setSelect(i, clearOthers){
    if (i < 0 || i >= this.items.length) return;
    if (clearOthers) this.$root.find('.window_ico').removeClass('select');
    this.$root.find(`.window_ico[data-idx="${i}"]`).addClass('select');
    this.sel = i;
  }
  moveSel(delta){
    if (this.items.length === 0) return;
    if (this.sel === -1) { this.setSelect(0, true); return; }
    const next = Math.max(0, Math.min(this.items.length - 1, this.sel + delta));
    this.setSelect(next, true);
  }

  _placeIcon($ico, gx, gy){
    const col = Math.max(1, parseInt(gx || 1, 10));
    const row = Math.max(1, parseInt(gy || 1, 10));
    $ico.css({ gridColumn: `${col} / span 1`, gridRow: `${row} / span 1` });
  }

  _getGridMetrics(){
    const $c = this.$root;

    // 하단 작업표시줄 높이(드래그/최대화에서 제외)
    const BAR_H = 48;

    // 그리드 셀 피치(step) 실측용 프로브 3개 (1,1), (2,1), (1,2)
    const mkProbe = (col, row) => $(
      `<div class="grid-probe" style="
          grid-column:${col} / span 1;
          grid-row:${row} / span 1;
          width:1px;height:1px;visibility:hidden;pointer-events:none;"></div>`
    );
    const $p1 = mkProbe(1,1), $p2 = mkProbe(2,1), $p3 = mkProbe(1,2);
    $c.append($p1, $p2, $p3);

    const r1 = $p1[0].getBoundingClientRect();
    const r2 = $p2[0].getBoundingClientRect();
    const r3 = $p3[0].getBoundingClientRect();

    // 실제 셀 피치 (아이콘 크기/마진/갭 등 모든 CSS를 반영)
    const stepX = Math.max(1, Math.round(r2.left - r1.left));
    const stepY = Math.max(1, Math.round(r3.top  - r1.top));

    $p1.remove(); $p2.remove(); $p3.remove();

    // 사용 가능한 영역(하단 48px 제외)에서 최대 셀 개수
    const cRect = $c[0].getBoundingClientRect();
    const usableW = Math.floor(cRect.width);
    const usableH = Math.floor(cRect.height - BAR_H);
    const maxCol = Math.max(1, Math.floor(usableW / stepX));
    const maxRow = Math.max(1, Math.floor(usableH / stepY));

    return { stepX, stepY, maxCol, maxRow };
  }
_enableDnd(){
  // ==== 유틸: 한 줄 컬럼 수는 실측 stepX로 계산 ====
  const gridCols = (stepX) => {
    const w = this.$root.innerWidth();
    return Math.max(1, Math.floor(w / stepX));
  };

  // ==== 현재 아이콘 좌표 맵 ====
  const buildPosMap = () => {
    const map = new Map();       // "x,y" -> idx
    const posByIdx = new Map();  // idx -> {x,y}
    this.$root.find('.window_ico').each((_, el)=>{
      const $el = $(el);
      const idx = parseInt($el.data('idx'), 10);
      if (isNaN(idx)) return;
      const cs = getComputedStyle(el);
      const x = parseInt(cs.gridColumnStart || el.style.gridColumnStart || 1, 10) || 1;
      const y = parseInt(cs.gridRowStart    || el.style.gridRowStart    || 1, 10) || 1;
      const key = `${x},${y}`;
      map.set(key, idx);
      posByIdx.set(idx, { x, y });
    });
    return { map, posByIdx };
  };

  // ==== 좌표 반영(+콜백) ====
  const applyPos = (idx, x, y) => {
    let $ico = this.$root.find(`.window_ico[data-idx="${idx}"]`);
    if (!$ico.length && this._dragging?.idx === idx) {
      $ico = this._dragging.$el;
      this.$root.append($ico);
    }
    this._placeIcon($ico, x, y);

    const it = this.items[idx];
    it.order = { x, y };
    const globalIt = this.disk.find(d => d.idx === it.idx);
    if (globalIt) globalIt.order = { x, y };

    if (typeof this.onReorder === 'function') {
      try { this.onReorder({ idx: it.idx, order: { x, y }, item: it }); } catch(_){}
    }
  };

  // ==== 다음 셀 ====
  const nextCell = (x, y, stepX) => {
    const cols = gridCols(stepX);
    let nx = x + 1, ny = y;
    if (nx > cols) { nx = 1; ny = y + 1; }
    return { x: nx, y: ny };
  };

  // ==== 끼워넣기(연쇄 밀어내기) ====
  const insertAt = (wantX, wantY, movedIdx, stepX) => {
    const { map, posByIdx } = buildPosMap();

    const prev = posByIdx.get(movedIdx);
    if (prev) {
      const prevKey = `${prev.x},${prev.y}`;
      if (map.get(prevKey) === movedIdx) map.delete(prevKey);
    }

    let q = { x: wantX, y: wantY };
    let curIdx = movedIdx;

    while (true) {
      const key = `${q.x},${q.y}`;
      if (!map.has(key)) {
        map.set(key, curIdx);
        applyPos(curIdx, q.x, q.y);
        break;
      } else {
        const victim = map.get(key);
        map.set(key, curIdx);
        applyPos(curIdx, q.x, q.y);
        curIdx = victim;
        q = nextCell(q.x, q.y, stepX);
      }
    }
  };

  const $icons = this.$root.find('.window_ico');

  // 이미 초기화된 것만 destroy
  $icons.filter('.ui-draggable').each(function(){
    try { $(this).draggable('destroy'); } catch(e){}
  });

  $icons.draggable({
    helper: 'clone',
    appendTo: 'body',
    zIndex: 999999,
    scroll: true,

    start: (e, ui) => {
      window.__alpaDraggingIcon = true;

      const $ico = $(e.currentTarget);
      const idx  = parseInt($ico.data('idx'), 10);

      // 현재 아이콘의 셀 좌표(gx0, gy0)
      const cs = getComputedStyle($ico[0]);
      const gx0 = parseInt(cs.gridColumnStart || 1, 10) || 1;
      const gy0 = parseInt(cs.gridRowStart    || 1, 10) || 1;

      // placeholder로 자리 유지
      const w = $ico.outerWidth();
      const h = $ico.outerHeight();
      const $ph = $('<div class="ico-placeholder"></div>').css({
        width: w, height: h,
        gridColumn: `${gx0} / span 1`,
        gridRow:    `${gy0} / span 1`
      });
      this.$root[0].insertBefore($ph[0], $ico[0]);

      // helper(클론)는 계산 전용
      ui.helper.css({ opacity: 0.5 });

      // 원본을 커서 아래로 고정 (시작 튐 방지)
      const rect = $ico[0].getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      $ico.addClass('dragging')
          .appendTo('body')
          .css({
            position:'fixed',
            width:w, height:h,
            left:e.clientX - offsetX,
            top:e.clientY - offsetY,
            pointerEvents:'none'
          });

      // ★ 실측 step/최대 셀
      const { stepX, stepY, maxCol, maxRow } = this._getGridMetrics();

      this._dragging = {
        $el:$ico, idx, $ph,
        startClientX:e.clientX,
        startClientY:e.clientY,
        gx0, gy0, stepX, stepY, maxCol, maxRow,
        offsetX, offsetY
      };
    },

    drag: (e, ui) => {
      const st = this._dragging;
      if (!st) return;
      const { $el, offsetX, offsetY } = st;
      $el.css({ left:e.clientX - offsetX, top:e.clientY - offsetY });
    },

    stop: (e, ui) => {
      window.__alpaDraggingIcon = false;
      const st = this._dragging;
      if (!st) return;

      const { $el:$ico, idx, $ph, startClientX, startClientY,
              gx0, gy0, stepX, stepY, maxCol, maxRow } = st;

      // 상대 픽셀 이동 → 상대 셀 이동 (가속/미세 흔들림 방지)
      const dx = e.clientX - startClientX;
      const dy = e.clientY - startClientY;
      const dCol = Math.round(dx / stepX);
      const dRow = Math.round(dy / stepY);

      let gx = gx0 + dCol;
      let gy = gy0 + dRow;
      gx = Math.max(1, Math.min(maxCol, gx));
      gy = Math.max(1, Math.min(maxRow, gy));

      // 겹치면 연쇄 밀어내기
      insertAt(gx, gy, idx, stepX);

      if ($ph && $ph.length) $ph.remove();
      $ico.removeClass('dragging').css({
        position:'', left:'', top:'', width:'', height:'', pointerEvents:''
      });

      this._dragging = null;
    }
  });
}

}


/* =========================
 * 공통 창 베이스 (네 마크업/핸들 유지)
 *  - 루트: .alpaka-folder-window
 *  - 버튼: .alpaka-hide-btn / .alpaka-bigOrSmall-btn / .alpaka-close-btn
 *  - 바디: .alpaka-foloder-body#alpaka-folder
 * ========================= */
class WindowBase {
    static _spawnIndex = 0;
    static WORKAREA_FOOTER = 48;

    constructor({ manager, title }) {
        this.manager = manager;
        this.title = title;
        this.$root = $('<div class="alpaka-folder-window"></div>').css({
          position: 'absolute',
          // top/left는 아래 _applySpawnPosition()에서 설정
          width: '640px',
          height: '420px',
          display: 'none'
        });
        // 초기 auto 방지
        this.$root.css('z-index', 0);

        this._applySpawnPosition();

        this.ns = `.w${Math.random().toString(36).slice(2)}`;
        this._handlers = [];
        $("body").append(this.$root);
        this.buildChrome();
        this.setupDragResize();
    }

    _workArea(){
      const vw = Math.max(document.documentElement.clientWidth,  window.innerWidth  || 0);
      const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      const footer = WindowBase.WORKAREA_FOOTER;
      return { vw, vh, footer, maxH: Math.max(0, vh - footer) };
    }


    _applySpawnPosition() {
      const BASE_TOP  = 100;
      const BASE_LEFT = 100;
      const STEP      = 24;
      const MAX_STEPS = 8;

      const k = WindowBase._spawnIndex % MAX_STEPS;
      let top  = BASE_TOP  + k * STEP;
      let left = BASE_LEFT + k * STEP;

      const { vw, maxH } = this._workArea();
      const winW = 640, winH = 420;

      const safeTop  = Math.max(0, Math.min(top,  Math.max(0, maxH - winH - 20)));
      const safeLeft = Math.max(0, Math.min(left, Math.max(0, vw   - winW - 20)));

      this.$root.css({ top: `${safeTop}px`, left: `${safeLeft}px` });
      WindowBase._spawnIndex++;
    }

    
    buildChrome() {
        const $btns = $(`
      <div class="alpaka-folder_btn">
        <p class="alpaka-folder-name">${this.title}</p>
        <div class="alpaka-hide-btn"><i class="bi bi-dash-lg"></i></div>
        <div class="alpaka-bigOrSmall-btn"><i class="bi bi-files"></i></div>
        <div class="alpaka-close-btn"><i class="bi bi-x-lg"></i></div>
      </div>
    `);
        // 바디(콘텐츠) 컨테이너
        this.$content = $(`<div class="alpaka-foloder-body" id="alpaka-folder"></div>`);
        this.$root.append($btns, this.$content);

        let prev = null;
        this.$root.on(`click${this.ns}`, ".alpaka-close-btn", () => this.close());
        // 버튼 클릭 최대화
        this.$root.on(`click${this.ns}`, ".alpaka-bigOrSmall-btn", () => {
          let prev = this.__prevRect || null;
          if (this.$root.hasClass("bigOrsmall")) {
            if (prev) this.$root.css(prev);
          } else {
            this.__prevRect = {
              width:  `${this.$root[0].clientWidth}px`,
              height: `${this.$root[0].clientHeight}px`,
              top:    `${this.$root[0].offsetTop}px`,
              left:   `${this.$root[0].offsetLeft}px`
            };
            this.$root.css({ top: 0, left: 0, width: "100%", height: `calc(100vh - ${WindowBase.WORKAREA_FOOTER}px)` });
          }
          this.$root.toggleClass("bigOrsmall");
        });

        // 타이틀바 더블클릭 최대화
        this.$root.on(`dblclick${this.ns}`, ".alpaka-folder_btn", () => {
          let prev = this.__prevRect || null;
          if (this.$root.hasClass("bigOrsmall")) {
            if (prev) this.$root.css(prev);
          } else {
            this.__prevRect = {
              width:  `${this.$root[0].clientWidth}px`,
              height: `${this.$root[0].clientHeight}px`,
              top:    `${this.$root[0].offsetTop}px`,
              left:   `${this.$root[0].offsetLeft}px`
            };
            this.$root.css({ top: 0, left: 0, width: "100%", height: `calc(100vh - ${WindowBase.WORKAREA_FOOTER}px)` });
          }
          this.$root.toggleClass("bigOrsmall");
        });


        this.$root.on(`click${this.ns}`, ".alpaka-hide-btn", () => {
            this.$root.hide(300);
        });
    }

    setupDragResize() {
      const clampToWorkArea = () => {
        const { vw, maxH } = this._workArea();
        const rect = {
          top:  this.$root[0].offsetTop,
          left: this.$root[0].offsetLeft,
          w:    this.$root[0].clientWidth,
          h:    this.$root[0].clientHeight
        };
        // 수평
        if (rect.left < 0) rect.left = 0;
        if (rect.left + rect.w > vw) rect.left = Math.max(0, vw - rect.w);
        // 수직 (아래쪽은 작업표시줄 위까지만)
        if (rect.top < 0) rect.top = 0;
        if (rect.top + rect.h > maxH) rect.top = Math.max(0, maxH - rect.h);

        this.$root.css({ left: rect.left, top: rect.top });
        // 리사이즈로 인해 높이가 과하게 커졌다면 줄여줌
        if (this.$root[0].clientHeight > maxH) {
          this.$root.css({ height: `${maxH}px` });
        }
      };

      this.$root
        .resizable({
          minWidth: 360,
          minHeight: 240,
          handles: "n,e,s,w,ne,nw,se,sw",
          stop: () => clampToWorkArea()   // ★ 리사이즈 후 보정
        })
        .draggable({
          handle: ".alpaka-folder_btn",
          stop: () => clampToWorkArea()   // ★ 드래그 후 보정
        });

      // 포커스 시 최상단 (기존 로직 유지)
      this.$root.on(`mousedown${this.ns}`, () => {
        const key = this.$root.data('proc-key');
        if (key && this.manager && typeof this.manager.focus === 'function') {
          this.manager.focus(key);
        }
      });
    }


    onClose(h) { if (typeof h === "function") this._handlers.push(h); }
    open() { this.$root.show(); }
    close() {
        this._handlers.forEach(h => { try { h(); } catch (e) { } });
        this.dispose();
    }
    dispose() {
        try { this.$root.resizable("destroy").draggable("destroy"); } catch (e) { }
        this.$root.off(this.ns).remove();
        this._handlers = [];
    }
}

/* =========================
 * 폴더 창 (네 헤더/입력/내비 구조 유지)
 * ========================= */
class FolderWindow extends WindowBase {
    constructor({ manager,title, startPath, fileList }) {
        super({ manager, title });
        this.path = startPath;
        this.fileList = fileList;

        this._tiles = [];   // ★ 현재 화면에 렌더된 .file-item 목록 (순서 유지)
        this._sel   = -1;   // ★ 선택된 index (없으면 -1)
        this._keyns = `.fwkeys-${Math.random().toString(36).slice(2)}`;

        const $header = $(`
      <div class="alpaka-folder-header">
        <div class="alpaka-nav-buttons">
          <div class="alpaka-backBtn"><i class="bi bi-arrow-left"></i></div>
          <div class="alpaka-forwardBtn"><i class="bi bi-arrow-right"></i></div>
        </div>
        <input type="text" id="alpaka-folder_path" class="path" />
      </div>
    `);
        this.$root.find(".alpaka-folder_btn").after($header);
        this.$grid = this.$root.find("#alpaka-folder");

        this.history = [this.path];
        this.hi = 0;

        this.bind();
        this.render();
    }

    bind() {
        this.$root.on(`keypress${this.ns}`, "#alpaka-folder_path", (e) => {
            if (e.key === "Enter") {
                this.navigate($(e.currentTarget).val());
            }
        });

        this.$root
        .off('keydown' + this.ns, '#alpaka-folder_path')
        .on('keydown' + this.ns, '#alpaka-folder_path', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();     // 폼 제출/기본동작 방지
            e.stopPropagation();    // 바깥 Enter 핸들러(선택 실행 등)로 전파 방지
            const q = $(e.currentTarget).val().trim();
            if (q) this.navigate(q);  // 검색창을 경로 입력으로 사용한다면 navigate
            // 검색 기능을 따로 구현했다면 여기서 search(q) 호출로 교체
          }
        });
        this.$root.on(`click${this.ns}`, ".alpaka-backBtn", () => {
            if (this.hi > 0) { this.hi--; this.path = this.history[this.hi]; this.render(false); }
        });
        this.$root.on(`click${this.ns}`, ".alpaka-forwardBtn", () => {
            if (this.hi < this.history.length - 1) { this.hi++; this.path = this.history[this.hi]; this.render(false); }
        });
    }

    navigate(p) {
        this.path = p;
        this.history = this.history.slice(0, this.hi + 1);
        this.history.push(p);
        this.hi++;
        this.render(false);
    }

    render() {
        this.$grid.empty();
    this.$root.find("#alpaka-folder_path").val(this.path);

    const subFolders = new Set();
    const subFiles = [];
    this._tiles = [];        // ★ 렌더 시작 시 초기화
    this._sel = -1;          // ★ 선택 초기화

        for (const f of this.fileList) {
            if (f.type === TYPE.FILE) {
                // 현재 폴더의 직속 파일
                if ((f.dirPath || Path.dirname(f.path)) === this.path) {
                    subFiles.push(f);
                }
                // 파일 디렉터리에서 직속 하위 폴더명 추출
                const from = f.dirPath || f.path || "";
                if (from && from.startsWith(this.path + "\\")) {
                    const seg = from.substring(this.path.length + 1).split("\\")[0];
                    if (seg) subFolders.add(seg);
                }
            } else if (f.type === TYPE.FOLDER) {
                // 명시 폴더 엔트리 → 직속 하위
                const parent = Path.dirname(f.path);
                if (parent === this.path) {
                    subFolders.add(Path.basename(f.path));
                } else if (f.path.startsWith(this.path + "\\")) {
                    const seg = f.path.substring(this.path.length + 1).split("\\")[0];
                    if (seg) subFolders.add(seg);
                }
            }
        }

        for (const name of [...subFolders].sort()){
      const $tile = $(`
        <div class="file-item folder">
          ${Icon.get("folder")}
          <div class="file-name">${name}</div>
        </div>
      `);
      const idx = this._tiles.length;

      // ★ 단일 클릭: 선택(.selected)
      $tile.on('click', (e)=>{
        e.preventDefault();
        this.setSelected(idx);
        this.$root.focus(); // 키 입력 받을 수 있게
      });

      // ★ 더블클릭: 경로 이동
      $tile.on('dblclick', ()=>{
        this.navigate(Path.join(this.path, name));
      });

      this.$grid.append($tile);
      this._tiles.push({ $el:$tile, type:'folder', name });
    }

    // --- 파일 타일 ---
    for (const f of subFiles){
      const iconHtml = (typeof getItemIconHTML === 'function'
        ? getItemIconHTML(f)
        : Icon.get(f.ext, f.ico));

      const $tile = $(`
        <div class="file-item">
          ${iconHtml}
          <div class="file-name">${f.name}</div>
        </div>
      `);
      const idx = this._tiles.length;

      // ★ 단일 클릭: 선택(.selected)
      $tile.on('click', (e)=>{
        e.preventDefault();
        this.setSelected(idx);
        this.$root.focus();
      });

      // ★ 더블클릭: 파일 실행
      $tile.on('dblclick', ()=>{
        this.manager.open(f);
      });

      this.$grid.append($tile);
      this._tiles.push({ $el:$tile, type:'file', file:f });
    }

    if (this._tiles.length === 0){
      this.$grid.append('<div style="padding:10px;color:#999;">이 폴더에는 항목이 없습니다.</div>');
    }

    // ★ 키보드 바인딩 (한 번만; 포커스 가능하도록 tabindex 부여)
    this.$root.attr('tabindex', 0)
      .off('keydown' + this._keyns)
      .on('keydown' + this._keyns, (e)=>{
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.moveSelected(-1);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.moveSelected(+1);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          this.enterSelected();
        }
      });

        this.updateNavButtons();
    }

    // ★ i번째 타일을 선택하고 .selected 클래스 부여
  setSelected(i){
    if (!this._tiles || i < 0 || i >= this._tiles.length) return;
    this.$grid.find('.file-item.selected').removeClass('selected');
    this._tiles[i].$el.addClass('selected');
    this._sel = i;
  }

  // ★ 위/아래 이동
  moveSelected(delta){
    if (!this._tiles || this._tiles.length === 0) return;
    if (this._sel === -1) { this.setSelected(0); return; }
    const next = Math.max(0, Math.min(this._tiles.length - 1, this._sel + delta));
    this.setSelected(next);
  }

  // ★ Enter 동작: 폴더면 이동, 파일이면 실행
  enterSelected(){
    if (!this._tiles || this._sel < 0) return;
    const cur = this._tiles[this._sel];
    if (cur.type === 'folder') {
      this.navigate(Path.join(this.path, cur.name));
    } else if (cur.type === 'file') {
      this.manager.open(cur.file);
    }
  }

    updateNavButtons(){
        this.$root.find(".alpaka-backBtn")
        .toggleClass("active", this.hi > 0);
        this.$root.find(".alpaka-forwardBtn")
        .toggleClass("active", this.hi < this.history.length - 1);
    }
}

/* =========================
 * 파일 창 (창 내부에 직접 미리보기 렌더)
 * ========================= */
class FileWindow extends WindowBase {
    constructor({ manager,title, file }) {
        super({ manager,title });
        this.file = file;
        this.$root.addClass("window-file");
        this.render();

    }
    render() {
        const { ext, realPath } = this.file;
        const e = (ext || "").toLowerCase();
        let html = "";
        if ([".mp4", ".webm"].includes(e)) {
            html = `<video controls autoplay muted style="width:100%;height:100%"><source src="${realPath}" type="video/${e.replace(".", "")}"></video>`;
        } else if (e === ".youtube") {
            html = `<iframe src="${realPath}" style="width:100%;height:100%" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        } else if (e === ".pdf" || e === ".html") {
            html = `<iframe src="${realPath}" style="width:100%;height:100%" frameborder="0"></iframe>`;
        } else if ([".jpg", ".jpeg", ".png", ".gif"].includes(e)) {
            html = `<img src="${realPath}" style="max-width:100%;max-height:100%;display:block;margin:auto" />`;
        } else if([".exe"].includes(e)){
            html = `<iframe src="${realPath}"
                        class="viewer"
                        sandbox="allow-same-origin allow-scripts"
                        style="width:100%;height:100%;border:0"></iframe>
                </div>`

        } else {
            html = `<div style="padding:16px">해당 형식의 미리보기는 지원하지 않습니다.</div>`;
        }
        // 창 내부에 직접 렌더
        this.$content.empty().append($(html));
    }
}

/* =========================
 * 프로세스 관리자 (작업표시줄/포커스/z-index)
 *  - 초기 z >= 10 보장
 *  - "auto" 안전 파싱
 * ========================= */
class AlpaProcessManager {
    constructor({ fileList }) {
        this.fileList = fileList.map(normItem);
        this.processes = new Map();  // key -> {key, type, win, z, icon}
        this.zBase = 10;// 최소 10 이상
        this.order = [];
        this.$taskbar = $("#window_proccess_list");
        this.win = null;
    }

    /**
     * 파일/폴더를 경로 + 이름으로 직접 열기
     * @param {string} path - 경로 (예: "D:\\웹 개발\\극장 티켓팅 프로젝트\\기획서")
     * @param {string} name - 파일명 (예: "1.기획 및 의도.pdf")
     */
    runProccess(path, name) {
      const item = this.fileList.find(f =>{
        if(f.path.includes("C:")){
          console.log(f.path);
          console.log(Path.dirname(f.path));
        }
        Path.dirname(f.path) == path && f.name == name
      }
      );

      if (item) {
        this.open(item);
      } else {
        console.warn("경로/파일명을 찾을 수 없음:", path, name);
      }
    }

    runProccessIdx(idx) {
      const item = this.fileList.find(f =>
        f.idx == idx
      );
      if (item) {
        this.open(item);
      } else {
        console.warn("경로/파일명을 찾을 수 없음:", path, name);
      }
    }

    static keyOf(item) {
        if (item.type === TYPE.FOLDER) return `folder:${item.path}`;
        const k = item.realPath || item.fullPath || item.path;
        return `file:${k}`;
    }

    // "auto" → 0
    static _numZ($el) {
        const v = parseInt(($el.css("z-index") ?? "").toString(), 10);
        return Number.isFinite(v) ? v : 0;
    }
    // 현재 열린 창의 최대 z (최소 10 보장)
    static _maxZ() {
      const arr = $(".alpaka-folder-window").map((_, el) => AlpaProcessManager._numZ($(el))).get();
      const currentMax = arr.length ? Math.max(...arr) : 0;
      return Math.max(currentMax, 10);
    }

    focus(key) {
      if (!this.processes.has(key)) return;
      // ★ order에서 key를 제거 후 맨 뒤로 (최상단)
      this.order = this.order.filter(k => k !== key);
      this.order.push(key);
      this._reflowZ();

      const p = this.processes.get(key);
      p.win.$root.show(300);

      this.$taskbar.find('.alpaka-proccess_box').removeClass('select');
      this.$taskbar.find(`[data-key="${key}"]`).addClass('select');
    }

    open(item) {
      // ★ 폴더: '현재 보여주는 경로'가 같은 창이 이미 있으면 최상단만
      if (item.type === TYPE.FOLDER) {
        let dupKey = null;
        for (const [k, p] of this.processes) {
          if (p.type === TYPE.FOLDER && p.win && p.win.path === item.path) {
            dupKey = k;
            break;
          }
        }
        if (dupKey) { this.focus(dupKey); return; }

        // 동일 경로 창이 없으면 새 폴더창 생성
        const key = `folder:${item.path}:${Date.now()}_${Math.random().toString(36).slice(2)}`;
        this.win = new FolderWindow({ manager: this,title:item.title,  startPath: item.path, fileList: this.fileList });
        this.win.$root.data('proc-key', key);
        this.win.onClose(() => this.close(key));

        this.processes.set(key, { key, type: item.type, win : this.win, z: 0, icon: Icon.get(item.ext, item.ico) });
        this.order.push(key);        // ★ 최상단에 추가
        this._reflowZ();             // ★ 일괄 재배치

        this.win.open();
        this.renderTaskbar();
        return;
      }

      // ★ 파일: key 중복이면 최상단만, 아니면 새 창
      const key = AlpaProcessManager.keyOf(item);
      if (this.processes.has(key)) { this.focus(key); return; }

      this.win = new FileWindow({ manager: this,title: item.title, file: item });
      this.win.$root.data('proc-key', key);
      this.win.onClose(() => this.close(key));

      this.processes.set(key, { key, type: item.type, win:this.win, z: 0, icon: Icon.get(item.ext, item.ico) });
      this.order.push(key);          // ★ 최상단에 추가
      this._reflowZ();               // ★ 일괄 재배치

      this.win.open();
      this.renderTaskbar();
    }



    close(key) {
        const p = this.processes.get(key);
        if (!p) return;
        try { p.win.dispose(); } catch (e) {}
        this.processes.delete(key);

        // ★ 순서에서도 제거
        this.order = this.order.filter(k => k !== key);

        this._reflowZ();
        this.renderTaskbar();
    }

    _reflowZ() {
      // 앞쪽(인덱스가 작은 것)이 하단(zBase), 뒤쪽이 최상단(zBase + n - 1)
      this.order.forEach((k, i) => {
        const p = this.processes.get(k);
        if (!p) return;
        const z = this.zBase + i;
        p.z = z;
        p.win.$root.css('z-index', z);
      });
    }

    renderTaskbar() {
      const $t = this.$taskbar;
      if (!$t.length) return;
      $t.empty();

      // 현재 최상단 key
      const topKey = this.order.length ? this.order[this.order.length - 1] : null;

      for (const [k, p] of this.processes) {
        const isActive = (k === topKey);
        $t.append(`
          <div class="alpaka-proccess_box ${isActive ? 'select' : ''}" 
              data-key="${p.key}" 
              title="${p.win.file?.path}">
            ${p.icon}
          </div>
        `);
      }

      // 클릭 시 포커스
      $t.off("click.pm").on("click.pm", ".alpaka-proccess_box", (e) => {
        const key = $(e.currentTarget).data("key");
        this.focus(key);
      });
    }
}

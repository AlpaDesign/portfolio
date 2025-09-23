/* =========================
 * DeskTop.js (ALL-IN-ONE) 
 *  - 태그/클래스/아이디: 네 구조 그대로
 *  - 초기 z-index >= 10 보장
 *  - 새로 연 창/선택한 창이 항상 최상단
 *  - 파일 미리보기: 창 내부에 직접 렌더
 * ========================= */

const TYPE = { FILE: "file", FOLDER: "folder" };

const Icon = {
    get(extOrType) {
        const t = (extOrType || "").toLowerCase();
        if (t === TYPE.FOLDER || t === "folder") {
            return '<i class="bi bi-folder-fill" style="color:#f4b400;"></i>';
        }
        switch (t) {
            case ".mp4": case ".webm": case ".youtube":
                return '<i class="bi bi-file-play-fill" style="color:#ea4335;"></i>';
            case ".pdf":
                return '<i class="bi bi-file-earmark-pdf" style="color:#d93025;"></i>';
            case ".jpg": case ".jpeg": case ".png": case ".gif":
                return '<i class="bi bi-file-image" style="color:#34a853;"></i>';
            case ".exe":
                return '<i class="bi bi-terminal-fill" style="color:#555;"></i>';
            default:
                return '<i class="bi bi-file-earmark" style="color:#777;"></i>';
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
            const v = String(item.ico).trim();
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
    // 폴더
    if (raw.ext === "folder" || raw.type === TYPE.FOLDER) {
        const p = raw.url || raw.path || "";
        return {
            type: TYPE.FOLDER,
            name: raw.txt || Path.basename(p),
            path: p,
            ext: "folder",
            realPath: "",
            ico: raw.ico || null,
            idx: raw.pk ?? raw.idx ?? -1,
            dirPath: p,
            fullPath: p
        };
    }
    // 파일
    const base = raw.url || raw.path || "";
    const name = raw.name || raw.txt || Path.basename(base);
    const looksLikeFull =
        base.toLowerCase().endsWith(("\\" + name).toLowerCase()) ||
        base.toLowerCase().endsWith(name.toLowerCase());
    const dir = looksLikeFull ? Path.dirname(base) : base;
    const full = looksLikeFull ? base : Path.join(dir, name);

    return {
        type: TYPE.FILE,
        name,
        path: base,                               // 원본 보존
        ext: raw.ext || "",
        realPath: raw.realPath || raw.url || "",  // 실제 미디어/문서 경로
        ico: raw.ico || null,
        idx: raw.pk ?? raw.idx ?? -1,
        dirPath: dir,
        fullPath: full
    };
}

/* =========================
 * 바탕화면 아이콘 렌더러 (네 구조 유지)
 * ========================= */
class AlpaDesktop {
  constructor({ target, mainList, manager }){
    this.$root = $(target);
    this.items = mainList.map(normItem);
    this.manager = manager;
    this.sel = -1;             // ★ 현재 선택 index
    this.ns = `.desk-${Math.random().toString(36).slice(2)}`;
  }

  render(){
    this.$root.empty().attr('tabindex', 0); // ★ 키 입력 받을 수 있게
    this.items.forEach((it, i) => {
      const iconHtml = getItemIconHTML(it);
      const $ico = $(`
        <div class="window_ico" data-type="${it.type}" data-idx="${i}">
          <div class="ico_image">${iconHtml}</div>
          <span class="txt">${it.name}</span>
        </div>
      `);

      // ★ 단일 클릭: 선택
      $ico.on('click', (e) => {
        e.preventDefault();
        this.setSelect(i, true);
        this.$root.focus(); // 키입력 포커스
      });

      // ★ 더블클릭: 실행
      $ico.on('dblclick', (e) => {
        e.preventDefault();
        this.setSelect(i, false);
        this.manager.open(this.items[i]);
      });

      this.$root.append($ico);
    });

    // ★ 키보드 바인딩
    this.$root.off('keydown' + this.ns).on('keydown' + this.ns, (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.moveSel(-1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.moveSel(+1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (this.sel >= 0) this.manager.open(this.items[this.sel]);
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
}

/* =========================
 * 공통 창 베이스 (네 마크업/핸들 유지)
 *  - 루트: .alpaka-folder-window
 *  - 버튼: .alpaka-hide-btn / .alpaka-bigOrSmall-btn / .alpaka-close-btn
 *  - 바디: .alpaka-foloder-body#alpaka-folder
 * ========================= */
class WindowBase {
    constructor({ manager }) {
        this.manager = manager;
        this.$root = $('<div class="alpaka-folder-window"></div>').css({
            position: 'absolute', top: '100px', left: '100px',
            width: '640px', height: '420px', display: 'none'
        });
        // 초기 auto 방지
        this.$root.css('z-index', 0);

        this.ns = `.w${Math.random().toString(36).slice(2)}`;
        this._handlers = [];
        $("body").append(this.$root);
        this.buildChrome();
        this.setupDragResize();
    }

    buildChrome() {
        const $btns = $(`
      <div class="alpaka-folder_btn">
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
        this.$root.on(`click${this.ns}`, ".alpaka-bigOrSmall-btn", () => {
            if (this.$root.hasClass("bigOrsmall")) {
                if (prev) this.$root.css(prev);
            } else {
                prev = {
                    width: `${this.$root[0].clientWidth}px`,
                    height: `${this.$root[0].clientHeight}px`,
                    top: `${this.$root[0].offsetTop}px`,
                    left: `${this.$root[0].offsetLeft}px`
                };
                this.$root.css({ top: 0, left: 0, width: "100%", height: "calc(100vh - 39px)" });
            }
            this.$root.toggleClass("bigOrsmall");
        });
        this.$root.on(`click${this.ns}`, ".alpaka-hide-btn", () => {
            this.$root.toggleClass("minimized");
        });
    }

    setupDragResize() {
        this.$root
            .resizable({ minWidth: 360, minHeight: 240, handles: "n,e,s,w,ne,nw,se,sw" })
            .draggable({ handle: ".alpaka-folder_btn" });

        // 포커스 시 최상단
        this.$root.on(`mousedown${this.ns}`, () => {
            const maxZ = AlpaProcessManager._maxZ();
            this.$root.css("z-index", maxZ + 1);
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
    constructor({ manager, startPath, fileList }) {
        super({ manager });
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
        : Icon.get(f.ext));

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
    constructor({ manager, file }) {
        super({ manager });
        this.file = file;
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
        this.zBase = 10;             // 최소 10 이상
        this.$taskbar = $("#window_proccess_list");
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
        const p = this.processes.get(key);
        if (!p) return;
        const maxZ = AlpaProcessManager._maxZ();
        p.z = maxZ + 1;
        p.win.$root.css("z-index", p.z);
    }

    open(item) {
        const key = AlpaProcessManager.keyOf(item);
        if (this.processes.has(key)) { this.focus(key); return; }

        const win = (item.type === TYPE.FOLDER)
            ? new FolderWindow({ manager: this, startPath: item.path, fileList: this.fileList })
            : new FileWindow({ manager: this, file: item });

        // 최초 오픈 시 z 보장 (최소 11 이상)
        const z = AlpaProcessManager._maxZ() + 1;
        win.$root.css("z-index", z);

        win.onClose(() => this.close(key));
        this.processes.set(key, { key, type: item.type, win, z, icon: Icon.get(item.ext) });
        win.open();
        this.renderTaskbar();
    }

    close(key) {
        const p = this.processes.get(key);
        if (!p) return;
        try { p.win.dispose(); } catch (e) { }
        this.processes.delete(key);
        this.renderTaskbar();
    }

    renderTaskbar() {
        const $t = this.$taskbar;
        if (!$t.length) return;
        $t.empty();
        for (const [, p] of this.processes) {
            $t.append(`
        <div class="alpaka-proccess_box" data-key="${p.key}" title="${p.key}">
          ${p.icon}
        </div>
      `);
        }
        $t.off("click.pm").on("click.pm", ".alpaka-proccess_box", (e) => {
            const key = $(e.currentTarget).data("key");
            this.focus(key);
        });
    }
}

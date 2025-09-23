
class AlpakaIcon{
    static getIcon(type) {
        switch ((type || '').toLowerCase()) {
            case "folder": return '<i class="bi bi-folder-fill" style="color: #f4b400;"></i>';
            case ".mp4": case ".webm": return '<i class="bi bi-file-play-fill" style="color: #ea4335;"></i>';
            case ".pdf": return '<i class="bi bi-file-earmark-pdf" style="color: #d93025;"></i>';
            case ".jpg": case ".jpeg": case ".png": case ".gif": return '<i class="bi bi-file-image" style="color: #34a853;"></i>';
            default: return '<i class="bi bi-file-earmark" style="color: #777;"></i>';
        }
    }
}

class AlpaProccess{
    static screen_count = 20;
    constructor(fileList, mainList) {
        this.fileList = fileList;
        this.mainList = mainList;
        this.ProccessList = [];
        this.$desktop = null; // 아이콘 컨테이너 캐시
        this.ns = '.aproc';   // 프로세스 리스트 컨테이너용 네임스페이스
    }

    WindowMain(target) {
        const elem = this;
        this.$desktop = $(target);
        // 1) 아이콘 렌더
        this.mainList.forEach((item) => {
        const html = `
            <div class="window_ico" data-url="${item.url}" data-ext="${item.ext}" data-txt="${item.txt}" data-pk="${item.pk}">
            <div class="ico_image">${AlpakaIcon.getIcon(item.ext)}</div>
            <span class="txt">${item.txt}</span>
            </div>`;
        this.$desktop.append(html);
        });

        // 2) 위임 바인딩(한 번만)
        this.$desktop.off('dblclick' + this.ns, '.window_ico')
        .on('dblclick' + this.ns, '.window_ico', function () {
            const $ico = $(this);
            const item = {
                url: $ico.data('url'),
                ext: $ico.data('ext'),
                txt: $ico.data('txt'),
                pk:  $ico.data('pk')
            };
            elem.StartProcess(item, item.pk);
            $ico.removeClass('select');
        });
    }

    static StartProccessFile(proc){
        const folderItem = new AlpakaUI(proc);

        folderItem.onClose((e) => {
            AlpaProccess.EndProccess(e.name);
            AlpaProccess.taskbarInit('#window_proccess_list', e);
        });

        proc.item = folderItem;
        folderItem.open();
        AlpaProccess.taskbarBarAdd('#window_proccess_list', proc);
    }

    StartProcess(items, pk) {
        const isPath = this.ProccessList.some(p => p.path === items.url && items.ext === 'folder');
        if (isPath) return;

        const proc = {
            idx: this.ProccessList.length,
            name: `Proccess_${this.ProccessList.length}_${items.url}`,
            path: `${items.url}`,
            ext: items.ext,
            fileList: this.fileList,
            item: null,
            zIndex: AlpaProccess.screen_count,
            pk
        };

        const folderItem = new AlpakaUI(proc);
        folderItem.onClose((e) => {
            AlpaProccess.EndProccess(e.name);
            AlpaProccess.taskbarInit('#window_proccess_list', e);
        });

        proc.item = folderItem;
        folderItem.open();
        this.ProccessList.push(proc);
        AlpaProccess.taskbarBarAdd('#window_proccess_list', proc);
    }

    static EndProccess(name) {
        const i = this.ProccessList.findIndex(e => e.name === name);
        if (i !== -1) {
        // ① UI 인스턴스 dispose (중요)
        try { this.ProccessList[i].item?.dispose?.(); } catch(e) {}
            this.ProccessList.splice(i, 1);
        }
    }

    static taskbarBarAdd(t, proc){
        var target = $(t);

        var html = `
            <div class="alpaka-proccess_box">
                ${AlpakaIcon.getIcon(proc.ext)}
            </div>
        `
        target.append(html);
        
    }

    static taskbarInit(t, proc){
        var target = $(t);
        target.html("");
        this.ProccessList.forEach((elem)=>{
            var html = `
                <div class="alpaka-proccess_box">
                    ${AlpakaIcon.getIcon(proc.ext)}
                </div>
            `
            target.append(html);
        })
        
        
    }
}




class AlpakaUI {
    /**
     * @param {Array} Proccess - 파일 및 폴더 정보 배열
     */
    constructor(proccess) {
        this.proccess = proccess;
        this.fileList = proccess.fileList;
        this.mainTarget = $('<div class="alpaka-folder-window"></div>').css('z-index', -1);
        $('body').append(this.mainTarget);

        this.$folder = null;
        this.$pathInput = null;
        this.$viewer = null;
        this.historyStack = [];
        this.historyIndex = -1;
        this.opened = false;

        this._eventHandler = [];
        this._timers = new Set();
        this._rafIds = new Set();
        this._observers = [];
        this.ns = `.alpaka-${this.proccess.idx}`; // 네임스페이스
    }

    onClose(handler) {
        if (typeof handler === 'function') {
            this._eventHandler.push(handler);
        }
    }

    open() {
        if (this.opened) return;
        const idx = Math.max(this.proccess.idx + this.proccess.zIndex, AlpaProccess.screen_count);
        this.mainTarget.css({ zIndex: idx, display: 'block' });
        this.init();
        this.opened = true;
    }

    close() {
        // 외부 구독자 통지
        this._eventHandler.forEach(h => { try { h(this.proccess); } catch(e) {} });
        // 내부 자원 해제
        this.dispose();
        this.opened = false;
    }

    // === 핵심: 모든 자원 정리 ===
    dispose() {
        // 1) 문서/자기 루트 이벤트 해제
        $(document).off(this.ns);
        this.mainTarget.off(this.ns);

        // 2) 위젯 destroy
        try { this.mainTarget.resizable('destroy'); } catch(e) {}
        try { this.mainTarget.draggable('destroy'); } catch(e) {}

        // 3) 타이머/RAF 해제
        this._timers.forEach(id => clearTimeout(id) || clearInterval(id));
        this._rafIds.forEach(id => cancelAnimationFrame(id));
        this._timers.clear(); this._rafIds.clear();

        // 4) 옵저버 해제
        this._observers.forEach(o => { try { o.disconnect(); } catch(e) {} });
        this._observers = [];

        // 5) DOM 제거
        try { this.mainTarget.remove(); } catch(e) {}
        if (this.$viewer && this.$viewer.length) {
        try { this.$viewer.remove(); } catch(e) {}
        }

        // 6) 큰 참조 끊기(가비지 콜렉션 유도)
        this.$folder = this.$pathInput = this.$viewer = null;
        this.fileList = null;
        this.proccess = null;
        this._eventHandler = [];
    }

    // === 이 밑은 기존 로직 + 네임스페이스 적용 ===
    init() {
        if(this.proccess.ext == "folder"){
            this.ApeendFolder();
            const rafId = requestAnimationFrame(() => this.setupDraggableResizable());
            this._rafIds.add(rafId);

            this.$pathInput = this.mainTarget.find('#alpaka-folder_path');
            this.$viewer = $('#alpaka-folder_viewer');   // 전역 1개만 만든 구조
            this.$folder = this.mainTarget.find('#alpaka-folder');

            this.renderFolder(this.proccess.path, true);
            this.bindUI();
        } else{
            this.AppendFile();
            const rafId = requestAnimationFrame(() => this.setupDraggableResizable());
            this._rafIds.add(rafId);

            this.$pathInput = this.mainTarget.find('#alpaka-folder_path');
            this.$viewer = $('#alpaka-folder_viewer');   // 전역 1개만 만든 구조
            this.$folder = this.mainTarget.find('#alpaka-folder');

            this.renderFolder(this.proccess.path, true);
            this.bindUI();
        }

        
    }

    ApeendFolder(param = {MinOfMax : true, minimize : true, }) {
        
        this.mainTarget.empty();

        
        this.mainTarget.append(`
        <div class="alpaka-folder_btn">
            ${(param.MinOfMax) ? '<div class="alpaka-hide-btn"><i class="bi bi-dash-lg"></i></div>' : ""}
            ${(param.minimize) ? '<div class="alpaka-bigOrSmall-btn"><i class="bi bi-files"></i></div>' : ""}
            <div class="alpaka-close-btn"><i class="bi bi-x-lg"></i></div>
        </div>
        <div class="alpaka-folder-header">
            <div class="alpaka-nav-buttons">
            <div class="alpaka-backBtn"><i class="bi bi-arrow-left"></i></div>
            <div class="alpaka-forwardBtn"><i class="bi bi-arrow-right"></i></div>
            </div>
            <input type="text" id="alpaka-folder_path" class="path" value="D:\\웹 개발" placeholder="폴더 경로 입력" />
        </div>
        <div class="alpaka-foloder-body" id="alpaka-folder"></div>
        `);

        if ($('#alpaka-folder_viewer').length === 0) {
            $('body').append(`
                <div id="alpaka-folder_viewer">
                <iframe id="previewFrame" style="border:1px solid #ccc; width:100%; height:100%;" src=""></iframe>
                </div>
            `);
        }
    }

    AppendFile(param = {MinOfMax : true, minimize : true, }){
        this.mainTarget.empty();

        this.mainTarget.append(`
            <div class="alpaka-folder_btn">
                ${(param.MinOfMax) ? '<div class="alpaka-hide-btn"><i class="bi bi-dash-lg"></i></div>' : ""}
                ${(param.minimize) ? '<div class="alpaka-bigOrSmall-btn"><i class="bi bi-files"></i></div>' : ""}
                <div class="alpaka-close-btn"><i class="bi bi-x-lg"></i></div>
            </div>
            <div class="alpaka-foloder-body" id="alpaka-folder"></div>
        `);
    }

    setupDraggableResizable() {
        this.mainTarget.css({ position:'absolute', top:'100px', left:'100px', width:'500px', height:'400px', boxSizing:'border-box' });

        this.mainTarget
        .resizable({ minWidth:300, minHeight:200, handles:"n, e, s, w, ne, nw, se, sw", helper:false })
        .draggable({ handle: ".alpaka-folder_btn" });

        this.mainTarget.on('mousedown' + this.ns, () => {
        const min = this.proccess?.idx ?? 0;
        AlpaProccess.screen_count = Math.max(...$('.alpaka-folder-window').map((_, el) => parseInt($(el).css('z-index') || 0)).get(), min);
        this.mainTarget.css('z-index', AlpaProccess.screen_count + 1);
        });
    }

    bindUI() {
        this.mainTarget.on('click' + this.ns, '.alpaka-close-btn', () => this.close());

        let prevPosition = { width:'100%', height:'100vh', left:0, top:0 };
        this.mainTarget.on('click' + this.ns, '.alpaka-bigOrSmall-btn', () => {
        if (this.mainTarget.hasClass('bigOrsmall')) {
            this.mainTarget.css(prevPosition);
        } else {
            prevPosition = {
            width: `${this.mainTarget[0].clientWidth}px`,
            height: `${this.mainTarget[0].clientHeight}px`,
            top: `${this.mainTarget[0].offsetTop}px`,
            left: `${this.mainTarget[0].offsetLeft}px`,
            };
            this.mainTarget.css({ width:'100%', height:'calc(100vh - 39px)', left:0, top:0 });
        }
        this.mainTarget.toggleClass('bigOrsmall');
        });

        this.mainTarget.on('click' + this.ns, '.alpaka-backBtn', () => {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.renderFolder(this.historyStack[this.historyIndex], false);
        }
        });

        this.mainTarget.on('click' + this.ns, '.alpaka-forwardBtn', () => {
        if (this.historyIndex < this.historyStack.length - 1) {
            this.historyIndex++;
            this.renderFolder(this.historyStack[this.historyIndex], false);
        }
        });

        this.mainTarget.on('keypress' + this.ns, '#alpaka-folder_path', (e) => {
            if (e.key === 'Enter') {
                const inputPath = this.$pathInput.val();
                this.renderFolder(inputPath, true);
            }
        });

        // 문서 레벨 이벤트도 네임스페이스!
        $(document).on('keydown' + this.ns, (e) => {
        if (e.key === 'Enter') {
            const $selected = $('.file-item.selected', this.mainTarget);
            if ($selected.length === 0) return;
            const folderName = $selected.find('.file-name').text();
            if ($selected.hasClass('folder')) {
                const newPath = this.proccess.path + '\\' + folderName;
                this.renderFolder(newPath, true);
            }
        }
        });
    }
    renderFolder(path, addToHistory = true) {
        this.proccess.path = path;
        
        if (addToHistory) {
            this.historyStack = this.historyStack.slice(0, this.historyIndex + 1);
            this.historyStack.push(path);
            this.historyIndex++;
        }
        this.updateNavButtons();
        this.$folder.empty();
        this.$pathInput.val(path);

        const folders = new Set();
        const fileList = [];
        const file = [];

        this.fileList.forEach(f => {
            if(f.idx == this.proccess.pk){
                file.push(f);
            }
            if (f.path === path || f.idx == this.proccess.pk) {
                fileList.push(f);
            } else if (f.path.startsWith(path + "\\")) {
                const subPath = f.path.substring(path.length + 1).split("\\")[0];
                if (subPath) folders.add(subPath);
            }
        });

        [...folders].forEach(folderName => {
            const $item = $('<div class="file-item folder"></div>');
            const $icon = $('<i class="bi bi-folder-fill" style="color: #f4b400;"></i>');
            const $name = $('<div class="file-name"></div>').text(folderName);
            $item.append($icon).append($name);
            $item.on("click", function () {
                $('.file-item', this.mainTarget).removeClass("selected");
                $(this).addClass("selected");
            }.bind(this));
            $item.on("dblclick", () => {
                const newPath = this.proccess.path + "\\" + folderName;
                this.renderFolder(newPath, true);
            });
            this.$folder.append($item);
        });

        fileList.forEach(file => {
            
            const $item = $('<div class="file-item"></div>');
            const $icon = $(AlpakaIcon.getIcon(file.ext || ""));
            const $name = $('<div class="file-name"></div>').text(file.name);
            const html = "";
            $item.append($icon).append($name);

            $item.on("click", function () {
                $('.file-item', this.mainTarget).removeClass("selected");
                $(this).addClass("selected");
                if (file.realPath) html = this.showFile(file.ext, file.realPath);
                //AlpaProccess.StartProccessFile(file);
            }.bind(this));

            $item.on("dblclick", () => {
                //if (file.realPath) html = this.showFile(file.ext, file.realPath);
                AlpaProccess.StartProccessFile(file);
            });
            this.$folder.append(html);
        });



        if (folders.size === 0 && fileList.length === 0) {
            this.$folder.html('<div style="padding:10px; color:red;">해당 경로를 찾을 수 없습니다.</div>');
        }
        
    }

    updateNavButtons() {
        this.mainTarget.find(".alpaka-backBtn").toggleClass('active', this.historyIndex > 0);
        this.mainTarget.find(".alpaka-forwardBtn").toggleClass('active', this.historyIndex < this.historyStack.length - 1);
    }


    showFile(ext, path) {
        var html = "";
        if ([".mp4", ".webm"].includes(ext.toLowerCase())) {
            html = `<video id="previewFrame" controls autoplay muted><source src="${path}" type="video/${ext.replace('.', '')}">비디오를 재생할 수 없습니다.</video>`;
        } else if (ext.toLowerCase() === '.pdf' || ext.toLowerCase() === '.html') {
            html = `<iframe id="previewFrame" src="${path}" style="width:100%; height:100%;" frameborder="0"></iframe>`;
        } else if ([".jpg", ".jpeg", ".png", ".gif"].includes(ext.toLowerCase())) {
            html = `<img id="previewFrame" src="${path}" style="max-width:100%; max-height:100%;" />`;
        } else {
            html = `<div id="previewFrame" style="padding: 20px;">해당 형식의 미리보기는 지원하지 않습니다.</div>`;
        }
        return html;
    }
}
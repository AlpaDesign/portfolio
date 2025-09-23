class AlpakaFolder {
    /**
     * @param {Array} fileList - 파일 및 폴더 정보 배열
     * @param {string|null} folderSelector - 폴더 DOM을 붙일 대상. 없으면 자동 생성
     */
    constructor(fileList, folderSelector = null) {
        this.fileList = fileList;
        this.folderSelector = folderSelector;
        this.external = !!folderSelector;

        if (this.external) {
            this.mainTarget = $(folderSelector);
            if (!this.mainTarget.length) {
                throw new Error(`folderSelector '${folderSelector}'에 해당하는 요소가 없습니다.`);
            }
        } else {
            this.mainTarget = $('<div class="alpaka-folder-window"></div>').css('z-index', -1);
            $('body').append(this.mainTarget);
        }

        this.$folder = null;
        this.$pathInput = null;
        this.$viewer = null;
        this.currentPath = "D:\\웹 개발";
        this.historyStack = [];
        this.historyIndex = -1;
        this.opened = false;
    }

    open(path = null, zIndex = 20) {
        if (this.opened) return;
        if (path) this.currentPath = path;

        this.mainTarget.css({
            zIndex: zIndex,
            display: 'block'
        });

        this.init();
        this.opened = true;
    }

    close() {
        if (!this.external) {
            this.mainTarget.remove();
        } else {
            this.mainTarget.hide();
        }
        this.opened = false;
    }

    init() {
        this.MadeHtmlUI();

        requestAnimationFrame(() => {
            this.setupDraggableResizable();
        });

        this.$pathInput = this.mainTarget.find("#alpaka-folder_path");
        this.$viewer = $("#alpaka-folder_viewer");
        this.$folder = this.mainTarget.find("#alpaka-folder");

        this.renderFolder(this.currentPath, true);
        this.bindUI();
    }

    MadeHtmlUI() {
        if (!this.mainTarget || typeof this.mainTarget.empty !== 'function') {
            throw new Error("mainTarget이 올바르지 않습니다. DOM이 초기화되지 않았습니다.");
        }

        this.mainTarget.empty();
        this.mainTarget.append(`
            <div class="alpaka-folder-header">
                <div class="alpaka-nav-buttons">
                    <div class="alpaka-backBtn"><i class="bi bi-arrow-left"></i></div>
                    <div class="alpaka-forwardBtn"><i class="bi bi-arrow-right"></i></div>
                </div>
                <input type="text" id="alpaka-folder_path" class="path" value="D:\\웹 개발" placeholder="폴더 경로 입력" />
                <div class="alpaka-close-btn"><i class="bi bi-x-lg"></i></div>
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

    setupDraggableResizable() {
        const $target = this.mainTarget;

        $target.css({
            position: 'absolute',
            top: '100px',
            left: '100px',
            width: '500px',
            height: '400px',
            boxSizing: 'border-box'
        });

        $target.resizable({
            handles: "se",
            helper: false
        }).draggable({
            handle: ".alpaka-folder-header"
        });

        $target.on("mousedown", () => {
            const current = parseInt($target.css('z-index') || 0);
            const max = Math.max(...$('.alpaka-folder-window').map((_, el) => parseInt($(el).css('z-index') || 0)).get(), current);
            $target.css('z-index', max + 1);
        });
    }

    bindUI() {
        this.mainTarget.on("click", ".alpaka-close-btn", () => this.close());

        this.mainTarget.on("click", ".alpaka-backBtn", () => {
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.renderFolder(this.historyStack[this.historyIndex], false);
            }
        });

        this.mainTarget.on("click", ".alpaka-forwardBtn", () => {
            if (this.historyIndex < this.historyStack.length - 1) {
                this.historyIndex++;
                this.renderFolder(this.historyStack[this.historyIndex], false);
            }
        });

        this.mainTarget.on("keypress", "#alpaka-folder_path", (e) => {
            if (e.key === "Enter") {
                const inputPath = this.$pathInput.val();
                this.renderFolder(inputPath, true);
            }
        });

        $(document).on("keydown", (e) => {
            if (e.key === "Enter") {
                const $selected = $(".file-item.selected", this.mainTarget);
                if ($selected.length === 0) return;
                const folderName = $selected.find(".file-name").text();
                if ($selected.hasClass("folder")) {
                    const newPath = this.currentPath + "\\" + folderName;
                    this.renderFolder(newPath, true);
                }
            }
        });
    }

    renderFolder(path, addToHistory = true) {
        this.currentPath = path;

        if (addToHistory) {
            this.historyStack = this.historyStack.slice(0, this.historyIndex + 1);
            this.historyStack.push(path);
            this.historyIndex++;
        }

        this.$folder.empty();
        this.$pathInput.val(path);

        const folders = new Set();
        const files = [];

        this.fileList.forEach(f => {
            if (f.path === path) {
                files.push(f);
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
                const newPath = this.currentPath + "\\" + folderName;
                this.renderFolder(newPath, true);
            });
            this.$folder.append($item);
        });

        files.forEach(file => {
            const $item = $('<div class="file-item"></div>');
            const $icon = $(this.getIcon(file.ext || ""));
            const $name = $('<div class="file-name"></div>').text(file.name);
            $item.append($icon).append($name);
            $item.on("click", function () {
                $('.file-item', this.mainTarget).removeClass("selected");
                $(this).addClass("selected");
                if (file.realPath) this.showPreview(file.ext, file.realPath);
            }.bind(this));
            $item.on("dblclick", () => {
                if (file.realPath) this.showPreview(file.ext, file.realPath);
            });
            this.$folder.append($item);
        });

        if (folders.size === 0 && files.length === 0) {
            this.$folder.html('<div style="padding:10px; color:red;">해당 경로를 찾을 수 없습니다.</div>');
        }
    }

    getIcon(type) {
        switch ((type || '').toLowerCase()) {
            case "folder": return '<i class="bi bi-folder-fill" style="color: #f4b400;"></i>';
            case ".mp4": case ".webm": return '<i class="bi bi-file-play-fill" style="color: #ea4335;"></i>';
            case ".pdf": return '<i class="bi bi-file-earmark-pdf" style="color: #d93025;"></i>';
            case ".jpg": case ".jpeg": case ".png": case ".gif": return '<i class="bi bi-file-image" style="color: #34a853;"></i>';
            default: return '<i class="bi bi-file-earmark" style="color: #777;"></i>';
        }
    }

    showPreview(ext, path) {
        if (!this.$viewer.length) return;
        if ([".mp4", ".webm"].includes(ext.toLowerCase())) {
            this.$viewer.html(`<video id="previewFrame" controls autoplay muted><source src="${path}" type="video/${ext.replace('.', '')}">비디오를 재생할 수 없습니다.</video>`);
        } else if (ext.toLowerCase() === '.pdf' || ext.toLowerCase() === '.html') {
            this.$viewer.html(`<iframe id="previewFrame" src="${path}" style="width:100%; height:100%;" frameborder="0"></iframe>`);
        } else if ([".jpg", ".jpeg", ".png", ".gif"].includes(ext.toLowerCase())) {
            this.$viewer.html(`<img id="previewFrame" src="${path}" style="max-width:100%; max-height:100%;" />`);
        } else {
            this.$viewer.html(`<div id="previewFrame" style="padding: 20px;">해당 형식의 미리보기는 지원하지 않습니다.</div>`);
        }
        this.$viewer.show();
    }
}

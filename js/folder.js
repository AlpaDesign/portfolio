class FileExplorer {
    /**
     * @param {Array} fileList - 파일 및 폴더 정보 배열
     * @param {string} folderSelector - 파일 항목이 렌더링될 DOM 요소 선택자 (예: '#folder')
     * @param {string} pathInputSelector - 현재 경로 입력창 선택자 (예: '#folder_path')
     * @param {string} viewerSelector - 파일 미리보기 표시 영역 선택자 (예: '#viewer')
     */
    constructor(fileList, folderSelector, pathInputSelector, viewerSelector) {
        this.fileList = fileList;
        this.$folder = $(folderSelector);
        this.$pathInput = $(pathInputSelector);
        this.$viewer = $(viewerSelector);
        this.currentPath = "D:\\웹 개발";
        this.historyStack = [];
        this.historyIndex = -1;
        this.closeBtn = "#closeBtn";
        this.prevBtn = "#backBtn";
        this.nextBtn = "#forwardBtn";
    }

    init() {
        this.renderFolder(this.currentPath, true);
        this.bindUI();
    }

    setPath(path) {
        this.currentPath = path;
        this.historyStack = [path];
        this.historyIndex = 0;
        this.renderFolder(path, false);
    }

    bindUI() {
        this.$pathInput.on("keypress", (e) => {
            if (e.key === "Enter") {
                const inputPath = this.$pathInput.val();
                this.renderFolder(inputPath, true);
            }
        });

        $(this.closeBtn).on('click', () => {
            $('.folder_container').removeClass("active");
        });

        $(this.prevBtn).on('click', () => {
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.renderFolder(this.historyStack[this.historyIndex], false);
            }
        });

        $(this.nextBtn).on('click', () => {
            if (this.historyIndex < this.historyStack.length - 1) {
                this.historyIndex++;
                this.renderFolder(this.historyStack[this.historyIndex], false);
            }
        });

        $(document).on("keydown", (e) => {
            if (e.key === "Enter") {
                const $selected = $(".file-item.selected");
                if ($selected.length === 0) return;

                const folderName = $selected.find(".file-name").text();
                const isFolder = $selected.hasClass("folder");

                if (isFolder) {
                    const newPath = this.currentPath + "\\" + folderName;
                    this.renderFolder(newPath, true);
                }
            }
        });
    }



    updateNavButtons() {
        $('#backBtn').toggleClass('active', this.historyIndex > 0);
        $('#forwardBtn').toggleClass('active', this.historyIndex < this.historyStack.length - 1);
    }

    renderFolder(path, addToHistory = true) {
        this.currentPath = path;

        if (addToHistory) {
            this.historyStack = this.historyStack.slice(0, this.historyIndex + 1);
            this.historyStack.push(path);
            this.historyIndex++;
        }

        this.updateNavButtons();
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
            const self = this;
            $item.on("click", function () {
                if ($(this).hasClass("selected")) {
                    const newPath = path + "\\" + folderName;
                    self.renderFolder(newPath, true);
                } else {
                    $('.file-item').removeClass("selected");
                    $(this).addClass("selected");
                }
            });

            $item.on("dblclick", () => {
                const newPath = this.currentPath + "\\" + folderName;
                this.renderFolder(newPath, true);
            });

            this.$folder.append($item);
        });

        files.forEach(file => {
            const extType = file.type === "folder" ? "folder" : (file.ext || "");
            const $item = $('<div class="file-item"></div>');
            const $icon = $(this.getIcon(extType));
            const $name = $('<div class="file-name"></div>').text(file.name);
            $item.append($icon).append($name);
            const self = this;      
            $item.on("click", function () {
                if ($(this).hasClass("selected")) {
                    if (file.realPath) {
                        self.showPreview(file.ext, file.realPath);
                        self.$viewer.addClass("active");
                    }
                } else {
                    $('.file-item').removeClass("selected");
                    $(this).addClass("selected");
                }
            });

            $item.on("dblclick", () => {
                if (file.realPath) {
                    this.showPreview(file.ext, file.realPath);
                    this.$viewer.addClass("active");
                }
            });

            this.$folder.append($item);
        });

        if (folders.size === 0 && files.length === 0) {
            this.$folder.html('<div style="padding:10px; color:red;">해당 경로를 찾을 수 없습니다.</div>');
        }
    }

    getIcon(type) {
        switch (type.toLowerCase()) {
            case "folder": return '<i class="bi bi-folder-fill" style="color: #f4b400;"></i>';
            case ".png":
            case ".jpg":
            case ".jpeg":
            case ".gif":
            case ".bmp":
            case ".webp":
            case ".svg": return '<i class="bi bi-file-image" style="color: #34a853;"></i>';
            case ".mp4":
            case ".mov":
            case ".avi":
            case ".mkv":
            case ".webm":
            case ".flv":
            case ".yotube":
            case ".wmv": return '<i class="bi bi-file-play-fill" style="color: #ea4335;"></i>';
            case ".mp3":
            case ".wav":
            case ".ogg":
            case ".flac":
            case ".m4a": return '<i class="bi bi-file-music" style="color: #4285f4;"></i>';
            case ".pdf": return '<i class="bi bi-file-earmark-pdf" style="color: #d93025;"></i>';
            case ".doc":
            case ".docx": return '<i class="bi bi-file-earmark-word" style="color: #2b579a;"></i>';
            case ".xls":
            case ".xlsx": return '<i class="bi bi-file-earmark-excel" style="color: #217346;"></i>';
            case ".ppt":
            case ".pptx": return '<i class="bi bi-file-earmark-ppt" style="color: #d24726;"></i>';
            case ".txt":
            case ".log": return '<i class="bi bi-file-earmark-text" style="color: #5f6368;"></i>';
            case ".html":
            case ".htm":
            case ".css":
            case ".js":
            case ".json":
            case ".xml":
            case ".c":
            case ".cpp":
            case ".cs":
            case ".java":
            case ".py":
            case ".ts":
            case ".tsx":
            case ".jsx":
            case ".php":
            case ".rb":
            case ".go":
            case ".rs": return '<i class="bi bi-file-code" style="color: #5f6368;"></i>';
            case ".zip":
            case ".rar":
            case ".7z":
            case ".tar":
            case ".gz": return '<i class="bi bi-file-earmark-zip" style="color: #a142f4;"></i>';
            default: return '<i class="bi bi-file-earmark" style="color: #777;"></i>';
        }
    }

    showPreview(ext, path) {
        switch (ext.toLowerCase()) {
            case ".mp4":
            case ".mov":
            case ".webm":
                this.$viewer.html(`<video id="previewFrame" controls autoplay muted">
          <source src="${path}" type="video/${ext.replace('.', '')}">
          비디오를 재생할 수 없습니다.
        </video>`);
                break;
            case ".yotube":
                this.$viewer.html(`<iframe id="youtube"  
        src="${path}" 
        frameborder="0" allowfullscreen>
</iframe>`);
                break;
            case ".pdf":
            case ".html":
                this.$viewer.html(`<iframe id="previewFrame" src="${path}" style="width:100%; height:100%;" frameborder="0"></iframe>`);
                break;
            case ".png":
            case ".jpg":
            case ".jpeg":
            case ".gif":
            case ".bmp":
            case ".webp":
                this.$viewer.html(`<img id="previewFrame" src="${path}" style="max-width:100%; max-height:100%;" />`);
                break;
            default:
                this.$viewer.html(`<div id="previewFrame" style="padding: 20px;">해당 형식의 미리보기는 지원하지 않습니다.</div>`);
                break;
        }
        this.$viewer.show();
    }
}

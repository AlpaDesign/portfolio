/**
     * AlpaProgress
     *   container: CSS 셀렉터 또는 DOM
     *   data: { title, Contents[], Percent, type? }[]
     *   options:
     *     - type: 'bar' | 'circle' | 'mixed' (기본 'bar')
     *     - showContents: boolean (기본 true)
     *     - accent: CSS color (기본 인디고)
     */
    class AlpaProgress{
      constructor(container, data, options={}){
        this.root = (typeof container === 'string') ? document.querySelector(container) : container;
        this.raw = Array.isArray(data) ? data : [];
        this.opts = Object.assign({
          type: 'bar',
          showContents: true,
          accent: null,
        }, options);
        if(!this.root) throw new Error('AlpaProgress: container를 찾을 수 없습니다.');

        if(this.opts.accent){
          this.root.style.setProperty('--ap-accent', this.opts.accent);
        }

        this._observer = null;
        this.render();
      }

      sanitizeItem(it){
        const title = String(it?.title ?? '').trim() || 'Untitled';
        let percent = Number(it?.Percent ?? 0);
        if(!Number.isFinite(percent)) percent = 0;
        percent = Math.max(0, Math.min(100, Math.round(percent)));
        const type = (it?.type === 'bar' || it?.type === 'circle') ? it.type : null;
        const contents = Array.isArray(it?.Contents) ? it.Contents.filter(Boolean).map(v=>String(v)) : [];
        return { title, percent, type, contents };
      }

      render(){
        // 정리된 데이터
        const items = this.raw.map(it=>this.sanitizeItem(it));
        // 루트 비우고 다시
        this.root.innerHTML = '';

        // 카드별 렌더
        items.forEach((it, idx)=>{
          const card = document.createElement('article');
          card.className = 'alpa-card';
          card.setAttribute('role', 'group');
          card.setAttribute('aria-labelledby', `ap-title-${idx}`);

          // 헤더
          const head = document.createElement('div');
          head.className = 'alpa-head';
          head.innerHTML = `
            <div class="alpa-name" id="ap-title-${idx}">${it.title}</div>
            <div class="alpa-pct-label" aria-hidden="true">${it.percent}%</div>
          `;
          card.appendChild(head);

          // 타입 결정: 항목 개별 타입 > 전역 옵션
          const resolvedType = it.type || this.opts.type;

          if(resolvedType === 'circle'){
            card.appendChild(this.renderCircle(it, idx));
          }else if(resolvedType === 'mixed'){
            // 혼합: 퍼센트 80 이상은 원형, 그 외 막대 (원하면 로직 수정 가능)
            (it.percent >= 80)
              ? card.appendChild(this.renderCircle(it, idx))
              : card.appendChild(this.renderBar(it, idx));
          }else{
            card.appendChild(this.renderBar(it, idx));
          }

          // 내용(접기/펼치기)
          card.appendChild(this.renderDetails(it, idx, this.opts.showContents));

          // 카드 추가
          this.root.appendChild(card);
        });

        // 인터섹션 옵저버로 애니메이션 트리거
        this.setupObserver();
      }

      renderBar(it, idx){
        const wrap = document.createElement('div');
        wrap.className = 'ap-bar';
        wrap.setAttribute('role', 'progressbar');
        wrap.setAttribute('aria-valuemin', '0');
        wrap.setAttribute('aria-valuemax', '100');
        wrap.setAttribute('aria-valuenow', String(it.percent));
        wrap.setAttribute('aria-label', `${it.title} 진행률`);
        wrap.style.setProperty('--ap-target', `${it.percent}%`);
        wrap.dataset.animate = 'off';

        const fill = document.createElement('div');
        fill.className = 'ap-fill';
        wrap.appendChild(fill);
        return wrap;
      }

      renderCircle(it, idx){
        const size = 112;
        const r = 46; // stroke 10 고려
        const c = 2 * Math.PI * r;
        const dash = (c * it.percent) / 100;

        const box = document.createElement('div');
        box.className = 'ap-circle';
        box.setAttribute('role', 'progressbar');
        box.setAttribute('aria-valuemin', '0');
        box.setAttribute('aria-valuemax', '100');
        box.setAttribute('aria-valuenow', String(it.percent));
        box.setAttribute('aria-label', `${it.title} 진행률`);
        box.dataset.animate = 'off';
        box.dataset.circumference = String(c);
        box.dataset.dash = String(dash);

        box.innerHTML = `
          <svg viewBox="0 0 ${size} ${size}" aria-hidden="true" focusable="false">
            <circle class="ap-bg" cx="${size/2}" cy="${size/2}" r="${r}" />
            <circle class="ap-ring" cx="${size/2}" cy="${size/2}" r="${r}" />
          </svg>
          <div class="ap-center">${it.percent}%</div>
        `;
        return box;
      }

      renderDetails(it, idx, open){
        const details = document.createElement('details');
        details.className = 'ap-details';
        if(open) details.setAttribute('open','');

        const summary = document.createElement('summary');
        summary.textContent = '상세 내용';
        details.appendChild(summary);

        const ul = document.createElement('ul');
        ul.className = 'ap-contents';
        if(it.contents.length === 0){
          const li = document.createElement('li');
          li.innerHTML = `<span class="ap-badge">비고</span> 등록된 항목이 없습니다.`;
          ul.appendChild(li);
        }else{
          it.contents.forEach(txt=>{
            const li = document.createElement('li');
            li.textContent = txt;
            ul.appendChild(li);
          });
        }
        details.appendChild(ul);
        return details;
      }

      setupObserver(){
        if(this._observer) { this._observer.disconnect(); this._observer = null; }
        const options = { root:null, rootMargin:'0px 0px -10% 0px', threshold: 0.2 };
        this._observer = new IntersectionObserver((entries)=>{
          entries.forEach(entry=>{
            if(entry.isIntersecting){
              const el = entry.target;
              el.dataset.animate = 'on';

              // 원형일 경우 stroke-dasharray 세팅
              if(el.classList.contains('ap-circle')){
                const ring = el.querySelector('.ap-ring');
                const c = Number(el.dataset.circumference);
                const d = Number(el.dataset.dash);
                ring.style.strokeDasharray = `${d} ${Math.max(0, c - d)}`;
              }

              this._observer.unobserve(el);
            }
          });
        }, options);

        // 관찰 대상: 막대/원형
        this.root.querySelectorAll('.ap-bar, .ap-circle').forEach(el=>this._observer.observe(el));
      }

      // 외부 API
      setType(type){ // 'bar' | 'circle' | 'mixed'
        this.opts.type = type;
        this.render();
      }
      showContents(v){ // boolean
        this.opts.showContents = !!v;
        this.render();
      }
    }
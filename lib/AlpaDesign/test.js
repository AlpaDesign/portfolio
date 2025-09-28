/** 내부 유틸 */
class Id {
  static _i = 1;
  static gen(prefix = "id") { return `${prefix}_${Id._i++}`; }
}

/** @typedef {"PC"|"MOBILE"|"RESPONSIVE"} DisplayType */
/** @typedef {"rect"|"rectRounded"|"circle"|"text"|"link"|"list"} ShapeType */
/** @typedef {"div"|"span"|"p"|"a"|"img"|"video"|"ul"|"li"} TagName */

class Position {
  constructor(x=0, y=0){ this.x=x; this.y=y; }
}
class Rect {
  constructor(width=0, height=0, x=0, y=0, rotation=0){
    this.x=x; this.y=y; this.width=width; this.height=height; this.rotation=rotation;
  }
}
class Padding {
  constructor(all=0, top=0, right=0, bottom=0, left=0){
    this.all=all; this.top=top; this.right=right; this.bottom=bottom; this.left=left;
  }
}

class Events {
  constructor(){
    this.onClick=null;
    this.onDblClick=null;
    this.onMouseDown=null;
    this.onMouseUp=null;
    this.onMouseMove=null;
    this.onMouseEnter=null;
    this.onMouseLeave=null;
    this.onKeyDown=null;
    this.onKeyUp=null;
    this.onChange=null;
    this.onInput=null;
    this.onDragStart=null;
    this.onDragEnd=null;
    this.onDrop=null;
  }
}

class Style {
  constructor(init={}){
    Object.assign(this, {
      display:"", position:"", zIndex:"",
      width:"", height:"", padding:"", margin:"",
      color:"", backgroundColor:"", backgroundImage:"", backgroundSize:"", backgroundPosition:"",
      border:"", borderRadius:"", boxShadow:"", opacity:"", overflow:"",
      fontSize:"", fontWeight:"", textAlign:"", lineHeight:"",
      transform:"",
    }, init);
  }
}

class Shape {
  /** @param {ShapeType} type @param {TagName} tag */
  constructor(type="rect", tag="div"){ this.use=true; this.type=type; this.tag=tag; }
}

class Effect {
  constructor(){
    this.use=true;
    this.fontSize={use:false,size:16,preset:[12,14,16,18,20,22,28,30]};
    this.fontWeight={use:false,weight:400,preset:[100,200,300,400,500,700,900]};
    this.colorBox={use:false,color:"#000000"};
    this.choice={use:false};
    this.rotate={use:false,preset:[90,-90,180]};
    this.image={use:false,ext:["png","jpg","jpeg","webp","svg"],fileSize:{size:300,unit:"MB"},url:""};
    this.video={use:false,ext:["mp4","webm","ogg"],fileSize:{size:300,unit:"MB"},url:""};
  }
}

class ElementNode {
  /**
   * @param {{name?:string, rect?:Rect, display?:DisplayType, padding?:Padding, events?:Events, style?:Style, shape?:Shape, effect?:Effect, parentId?:string}} opt
   */
  constructor(opt={}){
    this.id = Id.gen("el");
    this.name = opt.name || "";
    this.rect = opt.rect || new Rect();
    this.display = opt.display || "RESPONSIVE";
    this.padding = opt.padding || new Padding();
    this.events = opt.events || new Events();
    this.style = opt.style || new Style();
    this.shape = opt.shape || new Shape("rect","div");
    this.effect = opt.effect || new Effect();
    this.parentId = opt.parentId || null;
    this.children = [];
    this.meta = { locked:false, hidden:false, notes:"" };
  }
}

/** HTML/CSS 직렬화 도우미 */
class Serializer {
  static styleMap = {
    display:"display", position:"position", zIndex:"z-index",
    width:"width", height:"height", padding:"padding", margin:"margin",
    color:"color", backgroundColor:"background-color", backgroundImage:"background-image",
    backgroundSize:"background-size", backgroundPosition:"background-position",
    border:"border", borderRadius:"border-radius", boxShadow:"box-shadow",
    opacity:"opacity", overflow:"overflow", fontSize:"font-size", fontWeight:"font-weight",
    textAlign:"text-align", lineHeight:"line-height", transform:"transform",
  };

  /** @param {Style} style */
  static styleToCSS(style){
    const css=[];
    for(const k in Serializer.styleMap){
      const v = style[k];
      if(v!==undefined && v!==null && v!==""){
        css.push(`${Serializer.styleMap[k]}:${v}`);
      }
    }
    return css.join(";");
  }

  /** @param {Rect} rect */
  static rectToCSS(rect){
    const {x,y,width,height,rotation}=rect;
    const base = `left:${x}px;top:${y}px;width:${width}px;height:${height}px;position:absolute;`;
    const rot = rotation ? `transform:rotate(${rotation}deg);` : "";
    return base + rot;
  }

  /** @param {ElementNode} el @param {AlpaDesigner} proj */
  static elementToHTML(el, proj){
    const tag = el.shape.tag || "div";
    const inline = Serializer.rectToCSS(el.rect) + Serializer.styleToCSS(el.style);
    const childrenHTML = el.children.map(id => Serializer.elementToHTML(proj.elements[id], proj)).join("");

    if(tag==="img" && el.effect.image.use){
      return `<img id="${el.id}" alt="${el.name}" src="${el.effect.image.url}" style="${inline}" />`;
    }
    if(tag==="video" && el.effect.video.use){
      return `<video id="${el.id}" style="${inline}" src="${el.effect.video.url}" controls></video>`;
    }
    return `<${tag} id="${el.id}" style="${inline}">${childrenHTML}</${tag}>`;
  }
}

/** 메인: AlpaDesigner */
class AlpaDesigner {
  /**
   * @param {{projectName?:string, fileName?:string, canvas?:{width:number,height:number,background?:string}}} opt
   */
  constructor(opt={}){
    this.id = Id.gen("proj");
    this.projectName = opt.projectName || "";
    this.fileName = opt.fileName || "";
    this.canvas = Object.assign({width:1800,height:1000,background:"#ffffff"}, opt.canvas||{});

    // ROI 루트 생성
    const roi = new ElementNode({
      name:"rootROI",
      rect:new Rect(this.canvas.width, this.canvas.height, 0, 0, 0),
      display:"RESPONSIVE",
      style:new Style({position:"relative", overflow:"hidden"}),
      shape:new Shape("rect","div"),
    });

    this.component = { roiId: roi.id, layers: [roi.id] };
    this.elements = { [roi.id]: roi };
  }

    /** 빠른 생성: 사각형 */
  addRect({name="Rect", x=0, y=0, width=200, height=120, bg="#e5e7eb"} = {}) {
    return this.addElement({
      name,
      rect: new Rect(width, height, x, y, 0),
      shape: new Shape("rect", "div"),
      // display 를 block 으로 잡아두면 내보낼 때에도 자연스럽습니다.
      style: new Style({ display: "block", backgroundColor: bg }),
    });
  }


  /** 캔버스 크기/배경 변경 */
  setCanvasSize(w, h){ this.canvas.width=w; this.canvas.height=h; this.elements[this.component.roiId].rect.width=w; this.elements[this.component.roiId].rect.height=h; }
  setCanvasBackground(color){ this.canvas.background=color; }

  /** 요소 추가 (기본) */
  addElement(opt={}){
    const el = new ElementNode(Object.assign({ parentId: this.component.roiId }, opt));
    this.elements[el.id] = el;
    this.elements[el.parentId].children.push(el.id);
    return el;
  }

  /** 빠른 생성: 이미지 */
  addImage({name="Image", x=0,y=0,width=300,height=200,url=""}={}){
    return this.addElement({
      name,
      rect:new Rect(width,height,x,y,0),
      shape:new Shape("rect","img"),
      effect:Object.assign(new Effect(), {image:{use:true,url,ext:["jpg","png"],fileSize:{size:300,unit:"MB"}}}),
      style:new Style({display:"block"})
    });
  }

  /** 빠른 생성: 텍스트 */
  addText({name="Text", x=0,y=0,width=300,height=60, text="", fontSize="24px", fontWeight="700", color="#111"}={}){
    const el = this.addElement({
      name,
      rect:new Rect(width,height,x,y,0),
      shape:new Shape("text","p"),
      style:new Style({display:"block", fontSize, fontWeight, color})
    });
    // 텍스트 콘텐츠는 간단히 meta 사용(원하면 별도 content 필드 추가)
    el.meta.text = text;
    return el;
  }

  /** 트리/계층 조작 */
  setParent(childId, newParentId){
    const child = this.elements[childId];
    const oldParent = this.elements[child.parentId];
    if(!child || !this.elements[newParentId]) return false;
    // 부모 바꾸기
    oldParent.children = oldParent.children.filter(id => id!==childId);
    child.parentId = newParentId;
    this.elements[newParentId].children.push(childId);
    return true;
  }

  /** 삭제 */
  removeElement(id){
    const el = this.elements[id];
    if(!el || id===this.component.roiId) return false; // ROI 보호
    // 자식들부터 제거
    [...el.children].forEach(cid => this.removeElement(cid));
    // 부모에서 분리
    const parent = this.elements[el.parentId];
    parent.children = parent.children.filter(cid => cid!==id);
    delete this.elements[id];
    return true;
  }

  /** JSON 저장/복원 */
  exportJSON(){
    return JSON.stringify({
      id:this.id, projectName:this.projectName, fileName:this.fileName,
      canvas:this.canvas, component:this.component, elements:this.elements
    });
  }
  importJSON(jsonStr){
    const data = JSON.parse(jsonStr);
    Object.assign(this, {
      id:data.id, projectName:data.projectName, fileName:data.fileName,
      canvas:data.canvas, component:data.component, elements:data.elements
    });
  }

  /** HTML 내보내기 (ROI 내부만) */
  exportHTML(){
    const root = this.elements[this.component.roiId];
    const containerStyle = `position:relative;width:${root.rect.width}px;max-width:100%;height:auto;background:${this.canvas.background};`;
    const inner = root.children.map(id => Serializer.elementToHTML(this.elements[id], this)).join("");
    // 간단한 텍스트 치환: p 태그에 meta.text가 있으면 내부 텍스트 주입
    const withText = inner.replace(/(<p[^>]*id="(el_\d+)"[^>]*>)(<\/p>)/g, (m, open, eid, close)=>{
      const el = this.elements[eid]; const t = (el && el.meta && el.meta.text) ? el.meta.text : "";
      return `${open}${t}${close}`;
    });
    return `<div id="${root.id}" style="${containerStyle}">${withText}</div>`;
  }

  /** 캔버스 렌더(간단 버전: 사각형/회전/배경) */
  renderToCanvas(ctx){
    // 배경
    ctx.save();
    ctx.fillStyle = this.canvas.background || "#ffffff";
    ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
    ctx.restore();

    const draw = (el)=>{
      if(el.meta.hidden) return;
      const {x,y,width,height,rotation} = el.rect;

      const w = Math.max(1, width);
      const h = Math.max(1, height);

      ctx.save();
      ctx.translate(x + w/2, y + h/2);
      ctx.rotate((rotation||0) * Math.PI/180);
      ctx.translate(-w/2, -h/2);

      ctx.beginPath();
      ctx.rect(0,0,w,h);
      ctx.fillStyle = el.style.backgroundColor || "rgba(0,0,0,0)";
      ctx.fill();
      if(el.style.border){
        ctx.strokeStyle = "#000";
        ctx.stroke();
      }

      // 텍스트 간단 표시
      if(el.shape.tag==="p" && el.meta && el.meta.text){
        ctx.fillStyle = el.style.color || "#111";
        const fs = parseInt(el.style.fontSize||"16",10);
        ctx.font = `${el.style.fontWeight||"400"} ${isNaN(fs)?16:fs}px sans-serif`;
        ctx.textBaseline = "top";
        ctx.fillText(el.meta.text, 8, 8, width-16);
      }

      ctx.restore();

      el.children.forEach(id => draw(this.elements[id]));
    };

    const root = this.elements[this.component.roiId];
    root.children.forEach(id => draw(this.elements[id]));
  }
}

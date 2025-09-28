
var position = {
    x : 0,
    y : 0,
    left : 0,
    right : 0,
    top : 0,
    bottom : 0,
}

var ract = {
    width : 0,
    height : 0,
    position : new position()
}

var padding = {
    all : 0,
    left : 0,
    top : 0,
    right : 0,
    bottom : 0
}

var events = {
    // 마우스 이벤트
    onClick: () => {},
    onDblClick: () => {},
    onMouseDown: () => {},
    onMouseUp: () => {},
    onMouseMove: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    onMouseOver: () => {},
    onMouseOut: () => {},
    onContextMenu: () => {},

    // 키보드 이벤트
    onKeyDown: () => {},
    onKeyUp: () => {},
    onKeyPress: () => {},

    // 폼 이벤트
    onChange: () => {},
    onInput: () => {},
    onSubmit: () => {},
    onFocus: () => {},
    onBlur: () => {},

    // 드래그 & 드롭 이벤트
    onDrag: () => {},
    onDragStart: () => {},
    onDragEnd: () => {},
    onDragEnter: () => {},
    onDragOver: () => {},
    onDragLeave: () => {},
    onDrop: () => {},

    // 터치 이벤트
    onTouchStart: () => {},
    onTouchMove: () => {},
    onTouchEnd: () => {},
    onTouchCancel: () => {},

    // 윈도우/문서 이벤트
    onLoad: () => {},
    onUnload: () => {},
    onScroll: () => {},
    onResize: () => {},
};

var style = {
    /* ====== 레이아웃(Layout) ====== */
    display: "",
    position: "",
    top: "",
    right: "",
    bottom: "",
    left: "",
    zIndex: "",
    float: "",
    clear: "",
    visibility: "",
    overflow: "",
    overflowX: "",
    overflowY: "",

    /* ====== 플렉스(Flexbox) ====== */
    flex: "",
    flexBasis: "",
    flexDirection: "",
    flexFlow: "",
    flexGrow: "",
    flexShrink: "",
    alignContent: "",
    alignItems: "",
    alignSelf: "",
    justifyContent: "",

    /* ====== 그리드(Grid) ====== */
    grid: "",
    gridArea: "",
    gridAutoColumns: "",
    gridAutoFlow: "",
    gridAutoRows: "",
    gridColumn: "",
    gridColumnEnd: "",
    gridColumnGap: "",
    gridColumnStart: "",
    gridGap: "",
    gridRow: "",
    gridRowEnd: "",
    gridRowGap: "",
    gridRowStart: "",
    gridTemplate: "",
    gridTemplateAreas: "",
    gridTemplateColumns: "",
    gridTemplateRows: "",

    /* ====== 박스 모델(Box Model) ====== */
    width: "",
    minWidth: "",
    maxWidth: "",
    height: "",
    minHeight: "",
    maxHeight: "",
    margin: "",
    marginTop: "",
    marginRight: "",
    marginBottom: "",
    marginLeft: "",
    padding: "",
    paddingTop: "",
    paddingRight: "",
    paddingBottom: "",
    paddingLeft: "",
    border: "",
    borderTop: "",
    borderRight: "",
    borderBottom: "",
    borderLeft: "",
    borderColor: "",
    borderStyle: "",
    borderWidth: "",
    borderRadius: "",
    boxSizing: "",
    boxShadow: "",

    /* ====== 배경(Background) ====== */
    background: "",
    backgroundAttachment: "",
    backgroundClip: "",
    backgroundColor: "",
    backgroundImage: "",
    backgroundOrigin: "",
    backgroundPosition: "",
    backgroundRepeat: "",
    backgroundSize: "",

    /* ====== 글꼴(Font & Text) ====== */
    color: "",
    font: "",
    fontFamily: "",
    fontSize: "",
    fontStyle: "",
    fontVariant: "",
    fontWeight: "",
    lineHeight: "",
    letterSpacing: "",
    wordSpacing: "",
    whiteSpace: "",
    textAlign: "",
    textDecoration: "",
    textDecorationColor: "",
    textDecorationLine: "",
    textDecorationStyle: "",
    textIndent: "",
    textOverflow: "",
    textShadow: "",
    textTransform: "",
    direction: "",
    unicodeBidi: "",
    verticalAlign: "",

    /* ====== 리스트(List) ====== */
    listStyle: "",
    listStyleImage: "",
    listStylePosition: "",
    listStyleType: "",

    /* ====== 테이블(Table) ====== */
    borderCollapse: "",
    borderSpacing: "",
    captionSide: "",
    emptyCells: "",
    tableLayout: "",

    /* ====== 애니메이션(Animation) ====== */
    animation: "",
    animationDelay: "",
    animationDirection: "",
    animationDuration: "",
    animationFillMode: "",
    animationIterationCount: "",
    animationName: "",
    animationPlayState: "",
    animationTimingFunction: "",

    /* ====== 트랜지션(Transition) ====== */
    transition: "",
    transitionDelay: "",
    transitionDuration: "",
    transitionProperty: "",
    transitionTimingFunction: "",

    /* ====== 변형(Transform) ====== */
    transform: "",
    transformOrigin: "",
    transformStyle: "",
    perspective: "",
    perspectiveOrigin: "",
    backfaceVisibility: "",

    /* ====== 필터(Filter) ====== */
    filter: "",
    backdropFilter: "",

    /* ====== 클립 & 마스크(Clip & Mask) ====== */
    clip: "",
    clipPath: "",
    mask: "",
    maskImage: "",
    maskMode: "",
    maskPosition: "",
    maskRepeat: "",
    maskSize: "",

    /* ====== 멀티컬럼(Multi-column) ====== */
    columns: "",
    columnCount: "",
    columnFill: "",
    columnGap: "",
    columnRule: "",
    columnRuleColor: "",
    columnRuleStyle: "",
    columnRuleWidth: "",
    columnSpan: "",
    columnWidth: "",

    /* ====== 컨텐츠/기타(Content & Misc) ====== */
    content: "",
    cursor: "",
    opacity: "",
    pointerEvents: "",
    resize: "",
    userSelect: "",
    quotes: "",
    willChange: "",
};


var elements = {
    name : "", // 해당 태그 이름입니다.
    ract : ract, //해당영역 크기입니다.
    display : "", // PC, MOBILE, 반응형 타입을 지정합니다.
    padding : padding, // 전체영역 즉 body의 padding 값을 지정합니다.
    events : events, // 해당 영역 이벤트입니다.
    style : style,
    parent : new elements(),
    children : new elements()
}

var shape = {
    use : true,
    tag : "", // 태그 div, tag, li, a, 
}
var effect = {
    use : true,
}
var AlpaDesigner = {
    project_name : "", //프로젝트이름 : 현재 프로젝트 즉 홈페이지명이다.
    file_name : "", //파일이름 : 파일 이름이란 .ap 확장자의 파일이름이다.
    component : { // 해당 canvas에 들어가는 그림에 대한 정보입니다.
        roi : elements, // container 즉 영역을 지정합니다. 즉 브라우저 영역입니다.
        layer : elements, // Layer를 관리합니다. 즉 roi 안에 들어가는 element들 입니다.
    },
    tool : { // 그림그리기 툴입니다.
        shape :{ // 그릴수있는 모양입니다.
            ract : shape, // 네모 박스를 사용합니다.
            ract_circle : shape, // 네모 박스에 border-radius 5px을 default로 하지만 radius 값은 조절가능
            circle : shape, // 동그라미 박스를 사용합니다.
            text : shape, // 텍스트는 대부분 (p태그를 나 span을 사용합니다.)
            link : shape, // a 태그 기반 링크 입니다.
            list : shape, // li 태그 기반 리스트를 넣을수있습니다.
        },
        effect : {
            fontSize : {
                ...effect,
                size : 0,
                default : [12,14,15,16,17,18,20,22,28,30] // 사이즈를 직접 입력도 할수있지만 기본적인 사이지를 select box로 보여줄수있습니다.
            },
            fontWeight: { // 텍스트 굵기를 지정합니다.
                ...effect,
                weight : 0,
                default : [100,200,300,500,900]// 굵기를 직접 입력도 할수있지만 기본적인 굵기를 select box로 보여줄수있습니다.
            },
            colorBox:{
                ...effect,
                color : "", //선택된 색상 컬러입니다.
            },
            choice:{ //영역을 선택할수있습니다.
                ...effect,
            },
            rotate:{ //회전합니다.
                ...effect,
                default : [90,-90,180]
            },
            image: { //이미지를 넣는 영역입니다.
                ...effect,
                ext : [], // 허용되는 확장자 입니다.
                fileSize : {
                    size : 300, //파일 허용 사이즈
                    unit : "MB" //사이즈 단위
                },
                url : "", // 경로입니다.
            },
            video: { //영상을 넣습니다.
                ...effect,
                ext : [], // 허용되는 확장자 입니다.
                fileSize : {
                    size : 300, //파일 허용 사이즈
                    unit : "MB" //사이즈 단위
                },
                url : "", // 경로입니다.
            }

        },
    }

}
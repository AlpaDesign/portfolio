function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    const expires = "expires="+ date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function enterFullscreen() {
    let elem = document.documentElement; // 전체 문서
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { // Chrome, Safari, Opera
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}


$(function(){
var selectObj = {
    startX: 0,
    startY: 0,
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    selectItems: [],
    isDragging : false,
};








$("#password").on("keypress", function(e){
    if (e.key === "Enter") {
        if($(this).val() != "1234"){
            $(this).val("");
            return;
        }
        const encoded = btoa("success"); // "success" → Base64 인코딩
        setCookie("login", encoded, 1);  // 1일 유지
        //enterFullscreen();
        // /main으로 이동
        window.location.href = "/main";
    }
    
});

$("#main .window_ico").on("click", function(){
    
    $("#main .window_ico").removeClass("select");
    $(this).addClass("select");
});

$("#main").on("click",function(e){
    var target = e.target;
    if(!target.closest(".window_ico") && selectObj.selectItems.length > 0){
        //$("#main .window_ico").removeClass("select");
    }
});

$(window).on("contextmenu",function(e){
    e.preventDefault();
})

$(window).on("mouseout", function (e) {
    // e.relatedTarget이 null이면 브라우저 바깥으로 나간 것
    if (!e.relatedTarget && selectObj.isDragging) {
        selectObj.isDragging = false;
        $("#pointer_box").hide();

        // 선택도 초기화 (선택 안 하고 마우스 벗어났을 때)
        $(".window_ico").removeClass("select");
        selectObj.selectItems = [];
    }
});
$("#main").on("mousedown", function (e) {

    selectObj = {
        startX: 0,
        startY: 0,
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        selectItems: [],
        isDragging : false,
    };

    selectObj.isDragging = true;

    selectObj.startX = e.pageX;
    selectObj.startY = e.pageY;

    $("#pointer_box").css({
        top: e.pageY,
        left: e.pageX,
        width: 0,
        height: 0,
        display: "block"
    });

    
});

$("body").on("mousemove", function (e) {
    if (!selectObj.isDragging) return;

    const x = Math.min(e.pageX, selectObj.startX);
    const y = Math.min(e.pageY, selectObj.startY);
    const w = Math.abs(e.pageX - selectObj.startX);
    const h = Math.abs(e.pageY - selectObj.startY);

    selectObj.left = x;
    selectObj.top = y;
    selectObj.width = w;
    selectObj.height = h;

    $("#pointer_box").css({
        left: x,
        top: y,
        width: w,
        height: h
    });
});

$("#main, #pointer_box").on("mouseup", function (e) {
    selectObj.isDragging = false;
    $("#pointer_box").hide();

    selectObj.selectItems = [];

    const selLeft = selectObj.left;
    const selTop = selectObj.top;
    const selRight = selLeft + selectObj.width;
    const selBottom = selTop + selectObj.height;

    $(".window_ico").each(function () {
        const $el = $(this);
        const offset = $el.offset();
        const elLeft = offset.left;
        const elTop = offset.top;
        const elRight = elLeft + $el.outerWidth();
        const elBottom = elTop + $el.outerHeight();

        // 충돌 여부 판정 (겹치는 경우)
        const isOverlap = !(
            elRight < selLeft ||
            elLeft > selRight ||
            elBottom < selTop ||
            elTop > selBottom
        );

        if (isOverlap) {
            $el.addClass("select"); // 선택된 아이콘
            selectObj.selectItems.push($el);
        } else {
            $el.removeClass("select"); // 선택되지 않으면 제거
        }
    });
});
   
});
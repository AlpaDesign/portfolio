$(function(){
	var gnb=$("#gnb li a");
	var t=0;
	var w;
	var pageN=0;
	var pos=0;
	var n=0;
    var httpRequest;
    var files = "files/ppt.txt";

    var skill = [
        {
            title: "HTML",
            Contents: [
                "HTML5 DTD 문법 준수",
                "웹 접근성을 높인 Semantic Page 작성",
                "IR 기법을 이용한 스타일 작성",
                "반응형 웹 페이지 스타일 작성)",
                "모바일 페이지 스타일 작성"
            ],
            Percent : 99
        },
        {
            title: "CSS",
            Contents: [
                "HTML5 DTD 문법 준수",
                "웹 접근성을 높인 Semantic Page 작성",
                "IR 기법을 이용한 스타일 작성", ,
                "화려한 CSS3 Animation 구현",
                "반응형 웹 페이지 스타일 작성",
                "모바일 페이지 스타일 작성",
                "CSS 전처리 기능 프로그래밍(SASS)"
            ],
            Percent: 80
        },
        {
            title: "JS",
            Contents: [
                "React 및 TypeScript 사용가능",
                "Next js 를 이용한 프로젝트 활용 가능",
                "JavaScript 플러그인 활용 및 구현(jQuery)",
                "Parallax 웹 페이지 구현",
                "외부 API 구현(Google Map, Carousel)",
                "EcmaScript 6.0 기반 Native JavaScript 활용",
                "JAX를 이용한 데이터 응용",
                "모바일 페이지 스타일 작성",
            ],
            Percent: 90
        },
        {
            title: "React",
            Contents: [
                "React 및 TypeScript 사용가능",
                "Next js 를 이용한 프로젝트 활용 가능",
                "JavaScript 플러그인 활용 및 구현(jQuery)",
                "Parallax 웹 페이지 구현",
                "외부 API 구현(Google Map, Carousel)",
                "EcmaScript 6.0 기반 Native JavaScript 활용",
                "JAX를 이용한 데이터 응용",
                "모바일 페이지 스타일 작성",
            ],
            Percent: 80
        },
        {

            title: "JSP",
            Contents: [
                "Scriptlet(스크립트릿)을 이용한 java sever page 활용",
                "jsp로만 활용한 페이지 구성(MVC model1)",
                "Expression(표현식)을 활용하여 HTML 표시",
            ],
            Percent: 60
        },
        {
            title: "JAVA",
            Contents: [
                "JAVA 언어를 활용한 기본 응용소프트웨어 구현 능력 함양",
                "JAVA의 알고리즘 활용",
                "스프링 프레임워크, 이클립스, 아파치 개발 도구 활용",
                "SQL, 오라클을 기반으로 한 서버 구축 및 데이터 입출력 체크",
                "DataBase 기반으로 게시판 제작"
            ],
            Percent: 70
        },
        {
            title: "PHP",
            Contents: [
                "php 언어를 활용한 기본 응용소프트웨어 구현 능력 함양",
                "php로 간단한 쇼핑몰 제작가능",
                "아파치 서버 활용"
            ],
            Percent: 80
        },
        {

            title: "Oracle",
            Contents: [
                "DataBase 서버 구현과 API를 기반으로 하는 프로그램 개발 및 데이터 개발",
                "SQL, 오라클을 기반으로 한 서버 구축 및 데이터 입출력 체크",
                "DataBase 기반으로 정규화된 프로젝트 설계 가능",
                "DataBase 개념적 물리적 논리적설계 가능"
            ],
            Percent: 60
        },
        {

            title: "MYSQL",
            Contents: [
                "DataBase 서버 구현과 API를 기반으로 하는 프로그램 개발 및 데이터 개발",
                "SQL, 오라클을 기반으로 한 서버 구축 및 데이터 입출력 체크",
                "DataBase 기반으로 정규화된 프로젝트 설계 가능",
                "DataBase 개념적 물리적 논리적설계 가능"
            ],
            Percent: 70
        },
        {
            title: "Spring",
            Contents: [
                "Spring Boot를 활용",
                "MVC mode2를 활용한 페이지 구성",
                "JAVA 언어를 활용한 기본 응용소프트웨어 구현 능력 함양",
                "JAVA의 알고리즘 활용",
                "스프링 프레임워크, 이클립스, 아파치 개발 도구 활용",
                "SQL, 오라클을 기반으로 한 서버 구축 및 데이터 입출력 체크",
                "DataBase 기반으로 게시판 제작"
            ],
            Percent: 80
        },
        {
            title: "C#",
            Contents: [
                "WPF로 window 프로그램 제작 가능",
                ".NET FrameWork WindowsForm을 활용한 프로그램 제작 가능",
                "아두이노 코드 설계 프로그램 제작",
                "윈도우 스케줄러 관리 프로그램 제작",
                "그외 다수 라이브러리 패키지 제작"
            ],
            Percent: 80
        },
        {
            title: "C++",
            Contents: [
                "MFC 프로젝트 활용 가능",
                "POS 단말 프로그램 제작"
            ],
            Percent: 40
        },
        {
            title: "Python",
            Contents: [
                "간단한 스크립트 작성하여 빌드가능",
                "파이썬을 활용한 통신 프로그램 제작"
            ],
            Percent: 50
        },
    ]

    
    var to = 0;


    var load = (function () {

        var elem = $("#skillChart");
        for (let i = 0; i < skill.length; i++) {
            var html = `
                <div class="circlechart" data-percentage="${skill[i].Percent}">${skill[i].title}</div>
            `;
            elem.append(html);
        }
    })();


	$(window).on("scroll", drawProgressHandler);
	function drawProgressHandler(){
        to=$(window).scrollTop();
		// console.log("scroll event!!");
        
		if(to > $("#page2").offset().top){
            $('.circlechart').circlechart(); 
			// drawProgressBar(subject1, 80, "#aaa", "#ff0", 4);
			// drawProgressBar(subject2, 60, "#aaa", "#ff0", 4);

			$(window).off("scroll", drawProgressHandler);
		}
	}

    var video=document.getElementById("my_video");

    $("#page3 .icons-inner li").click(function(){
        var link = $(this).attr("play-code");
        
        $(".videoDim").fadeOut(0);
        $("#page3 .icons").fadeOut(0);
        $("#my_video").attr("src", link);
        $("#my_video").css({"visibility":"visible"});
        video.play();

    });

    $(".videoHomebtn").click(function(){
        $(".path-text span").text("클릭하여 홈으로");
        mainHome();
    });

    video.addEventListener("ended", function(){
        mainHome();
		video.pause();
		video.currentTime=0;
	});

    function mainHome(){
        $(".videoDim").addClass("ipad");
        $(".videoDim").fadeIn(300);
        $(".icons").fadeIn(300);
        $(".icons").addClass("ipad");
        $(".videoDim").removeClass("opa");
       
        $("#my_video").attr("src", "");
    }

	function gnbLine(){
		$("#gnb li , #mobile li").removeClass("active");
		$("#gnb li").eq(pageN).addClass("active");
		$("#mobile li").eq(pageN).addClass("active");

		let lineMove = Number(gnb.parent().eq(pageN).css("margin-left").replace("px", ""));
		$("#gnb .line").css({"left": (gnb.parent().eq(pageN).children().position().left + lineMove) +"px",
							 "width": (gnb.parent().eq(pageN).children()[0].clientWidth) + "px"
		});
		if(t > 0){
			$("#header .top").addClass("fixed");
			
		}else{
			$("#header .top").removeClass("fixed");
		}
	}

	$(window).resize(function(){
		t=$(window).scrollTop();
		w=$(window).width();
		gnbLine();
		if(w > 740){
			if($("#mobile").hasClass("on")){
				$(".dim").trigger("click");
			}
		}

        if(w < 500){
            $(".icons-inner li span").css({"display": "none"});
        } else {
            $(".icons-inner li span").css({"display": "block"});
        }
	});
    
    $(".pagination li").eq(n).addClass("active");
	$(window).trigger("resize");
    $(window).trigger("scroll");

	$(window).scroll(function(){
		t=$(window).scrollTop();
		if(t < $("#page2").offset().top-50){
			pageN=0;
		}
		else if(t < $("#page3").offset().top-50){
			pageN=1;
		}
		else if(t < $("#page4").offset().top-50){
			pageN=2;		
		}
		else{
			pageN=3;
		}
		gnbLine();
	});

	
	for(var i = 0; i < gnb.length; i++){
		let gnbIndex = gnb.eq(i);
		let lineMove = Number(gnbIndex.css("margin-left").replace("px", ""));
		
		$("#gnb li:nth-child(" + (i+1) + ")").mouseenter(function(){
			$("#gnb .line").css({"left": (gnbIndex.position().left + lineMove) +"px",
								 "width": (gnbIndex[0].clientWidth) + "px"
			});
			setTimeout(function(){
				if($("#gnb li").mouseleave(function(){
					gnbLine();
				}));
			}, 1);
		});
	}
	$("#gnb li, #mobile .list li").click(function(e){
		
		e.preventDefault();
		
		if($("html").is(":animated")) return;

		pageN = $(this).index()+1;
		
		if(pageN == 0){
			pos=0;
		}else{
			pos=$("#page"+pageN).offset().top+1;
		}
		
		$("html").animate({scrollTop : pos}, 300);
	});
    
	$("#header .menu_on").click(function(){
		$("#mobile").addClass("on");
		$(".dim").addClass("on");

		if($("#mobile").hasClass("on") == true){
			if($("#mobile .menu_close, .dim").click(function(){
				$("#mobile").removeClass("on");
				$(".dim").removeClass("on");
			}));
		}
	});
	
    function loadStateDate() {
        reqHttpData("files/소프트웨어-설계.html", onLoadHttpData);
        
    }

    function reqHttpData(url, callback) {
        if( httpRequest == null ) {
            httpRequest = getHttpRequest();
            if( httpRequest == null )
                return;
        }
        httpRequest.open("GET", url, true);
        httpRequest.onreadystatechange = callback;
        httpRequest.send(null);
    }

    function getHttpRequest() {
        var httpReq = null;
        try {
            var httpReq = new XMLHttpRequest();
        } catch(err) {
            httpReq = null;
        }
        return httpReq;
    }

    function onLoadHttpData() {
        if( httpRequest.readyState != 4 ) {
            return;
        }
        var fileData = httpRequest.responseText;
        //console.log(fileData);
        //$("#pptx").html(fileData);
    }
    
	var swiper = new Swiper('#page4 .swiper-container', {
		slidesPerView: 1,
		spaceBetween: 0,
		loop: true,
		centeredSlides: true,
		autoplay: {
			delay: 2500,
			disableOnInteraction: false,
		},
	});



    $(".circlechart").click(function () {

        const idx = $(".circlechart").index(this);

        for (let i = 0; i < skill.length; i++) {
            if (idx != i) continue;
            $("#modal_tbody").html(SkillContents(skill[i].Contents));
            $(".modal h3").text(skill[i].title);
        }
        
        $(".dim").addClass("on");
        $(".modal").addClass("on");
    });

    var SkillContents = (list) => {
        var html = "";
        for (let i = 0; i < list.length; i++) {
            html += `<tr>
                <td>${list[i]}</td>
            <tr>`
        }

        return html;
    }

    
   
    $("#page3 .content li dt").mouseenter(function(){
        
        var text = $(this).find("img").attr("alt");

        $(".view span.view_title").text(text);
        $(".view").addClass("active");
    });

    $("#page3 .content li dt").mouseleave(function(){
        $(".view").removeClass("active");
    });

    $("#page3 .content li dt").click(function(){
        //loadStateDate();
        var text = $(this).find("img").attr("alt");

        if(text == "기획 및 의도"){
            $("#pptx").attr("src", "files/기획의도.html");
        }else if(text == "요구사항 분석"){
            $("#pptx").attr("src", "files/요구사항분석.html");
        }else if(text == "데이터베이스 설계"){
            $("#pptx").attr("src", "files/데이터베이스-설계.html");
        }else if(text == "화면설계"){
            $("#pptx").attr("src", "files/화면설계.html");
        }else if(text == "소프트웨어 설계"){
            $("#pptx").attr("src", "files/소프트웨어-설계.html");
        }else if(text == "소스코드"){
            $("#pptx").attr("src", "files/소스코드.html");
        }else if(text == "테스트"){
            $("#pptx").attr("src", "files/테스트.html");
        }

            $(".view").addClass("top");
            $("body").addClass("fixed");

        
    });
    
    $(".view .close").click(function(){
        $(".view").removeClass("top");
        $("body").removeClass("fixed");
        $("#pptx").attr("src", "");
    });

    $(".modal .close").click(function(){
        $(".modal h3").text("");
        $("#modal_tbody").html("");
        $(".dim").removeClass("on");
        $(".modal").removeClass("on");
    });

    let pop1 = document.getElementById("pop1");
    
    pop1.addEventListener("click", function(ele){
        let targets = ele.target;
        if(!targets.closest(".modal_table_inner")){
            popHidden();
        }
    });

    function popHidden(){
        $(".modal h3").text("");
        $("#modal_tbody").html("");
        $(".dim").removeClass("on");
        $(".modal").removeClass("on");
    }
   
});
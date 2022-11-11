$(function(){
	var gnb=$("#gnb li a");
	var t=0;
	var w;
	var pageN=0;
	var pos=0;
	var n=0;
    var httpRequest;
    var files = "files/ppt.txt";
    
    var to=0;

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



    $(".circlechart").click(function(){
        var txt = $(this).find(".circle-chart__subline").text();
        if(txt == "HTML"){
            $("#modal_tbody").html(htmlText());
        } else if(txt == "CSS"){
            $("#modal_tbody").html(cssText());
        } else if(txt == "JS"){
            $("#modal_tbody").html(jsText());
        } else if(txt == "JSP"){
            $("#modal_tbody").html(jspText());
        } else if(txt == "JAVA"){
            $("#modal_tbody").html(javaText());
        } else if(txt == "PHP"){
            $("#modal_tbody").html(phpText());
        } else if(txt == "Oracle"){
            $("#modal_tbody").html(oracleText());
        } else if(txt == "Spring"){
            $("#modal_tbody").html(springText());
        } else {
            $("#modal_tbody").html("");
        }
        $(".modal h3").text(txt);
        $(".dim").addClass("on");
        $(".modal").addClass("on");
    });

    $(".modal .close").click(function(){
        $(".modal h3").text("");
        $("#modal_tbody").html("");
        $(".dim").removeClass("on");
        $(".modal").removeClass("on");
    });

    function htmlText(){
        var text = `
                    <tr>
                        <td>HTML5 DTD 문법 준수</td>
                    </tr>
                    <tr>
                        <td>웹 접근성을 높인 Semantic Page 작성</td>
                    </tr>
                    <tr>
                        <td>IR 기법을 이용한 스타일 작성</td>
                    </tr>
                    <tr>
                        <td>반응형 웹 페이지 스타일 작성)</td>
                    </tr>
                    <tr>
                        <td>모바일 페이지 스타일 작성</td>
                    </tr>
                    `;

        return text;
    }

    function cssText(){
        var text = `
                    <tr>
                        <td>HTML5 DTD 문법 준수</td>
                    </tr>
                    <tr>
                        <td>웹 접근성을 높인 Semantic Page 작성</td>
                    </tr>
                    <tr>
                        <td>IR 기법을 이용한 스타일 작성</td>
                    </tr>
                    <tr>
                        <td>화려한 CSS3 Animation 구현</td>
                    </tr>
                    <tr>
                        <td>반응형 웹 페이지 스타일 작성)</td>
                    </tr>
                    <tr>
                        <td>모바일 페이지 스타일 작성</td>
                    </tr>
                    <tr>
                        <td>CSS 전처리 기능 프로그래밍(SASS)</td>
                    </tr>
                    `;

        return text;
    }

    function jsText(){
        var text = `
                    <tr>
                        <td>JavaScript 플러그인 활용 및 구현(jQuery)</td>
                    </tr>
                    <tr>
                        <td>Parallax 웹 페이지 구현</td>
                    </tr>
                    <tr>
                        <td>외부 API 구현(Google Map, Carousel)</td>
                    </tr>
                    <tr>
                        <td>EcmaScript 6.0 기반 Native JavaScript 활용</td>
                    </tr>
                    <tr>
                        <td>AJAX를 이용한 데이터 응용</td>
                    </tr>
                    <tr>
                        <td>모바일 페이지 스타일 작성</td>
                    </tr>
                    <tr>
                        <td>CSS 전처리 기능 프로그래밍(SASS)</td>
                    </tr>
                    <tr>
                        <td>라이브러리 직접 제작</td>
                    </tr>
                    `;

        return text;
    }

    function jspText(){
        var text = `
                    <tr>
                        <td>Scriptlet(스크립트릿)을 이용한 java sever page 활용</td>
                    </tr>
                    <tr>
                        <td>jsp로만 활용한 페이지 구성(MVC model1)</td>
                    </tr>
                    <tr>
                        <td>Expression(표현식)을 활용하여 HTML 표시</td>
                    </tr>
                    `;

        return text;
    }
    function javaText(){
        var text = `
                    <tr>
                        <td>JAVA 언어를 활용한 기본 응용소프트웨어 구현 능력 함양</td>
                    </tr>
                    <tr>
                        <td>JAVA의 알고리즘 활용</td>
                    </tr>
                    <tr>
                        <td>스프링 프레임워크, 이클립스, 아파치 개발 도구 활용</td>
                    </tr>
                    <tr>
                        <td>SQL, 오라클을 기반으로 한 서버 구축 및 데이터 입출력 체크</td>
                    </tr>
                    <tr>
                        <td>DataBase 기반으로 게시판 제작</td>
                    </tr>
                    `;

        return text;
    }
    function phpText(){
        var text = `
                    <tr>
                        <td>php 언어를 활용한 기본 응용소프트웨어 구현 능력 함양</td>
                    </tr>
                    <tr>
                        <td>php로 간단한 쇼핑몰 제작가능</td>
                    </tr>
                    <tr>
                        <td>아파치 서버 활용</td>
                    </tr>
                    `;

        return text;
    }
    function oracleText(){
        var text = `
                    <tr>
                        <td>DataBase 서버 구현과 API를 기반으로 하는 프로그램 개발 및 데이터 개발</td>
                    </tr>
                    <tr>
                        <td>SQL, 오라클을 기반으로 한 서버 구축 및 데이터 입출력 체크</td>
                    </tr>
                    <tr>
                        <td>DataBase 기반으로 게시판 제작</td>
                    </tr>
                    <tr>
                        <td>DataBase 개념적 물리적 논리적설계 가능</td>
                    </tr>
                    
                    `;

        return text;
    }
    function springText(){
        var text = `
                    <tr>
                        <td>Spring Boot를 활용</td>
                    </tr>
                    <tr>
                        <td>MVC mode2를 활용한 페이지 구성</td>
                    </tr>
                    <tr>
                        <td>JAVA 언어를 활용한 기본 응용소프트웨어 구현 능력 함양</td>
                    </tr>
                    <tr>
                        <td>JAVA의 알고리즘 활용</td>
                    </tr>
                    <tr>
                        <td>스프링 프레임워크, 이클립스, 아파치 개발 도구 활용</td>
                    </tr>
                    <tr>
                        <td>SQL, 오라클을 기반으로 한 서버 구축 및 데이터 입출력 체크</td>
                    </tr>
                    <tr>
                        <td>DataBase 기반으로 게시판 제작</td>
                    </tr>
                    `;

        return text;
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
   
});
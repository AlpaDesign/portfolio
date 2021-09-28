$(function(){
	var gnb=$("#gnb li a");
	var t=0;
	var w;
	var pageN=0;
	var pos=0;
	var posu=0;
	var sliderLi=$("#page3 .page3_inner .my_slider .container .wrapper");
	var sliderpos=0;
	var sliderMove=100;
	var moving=false;
	var xDown;
	var yDown;
	var down=false;
	var dragn=0;
	var total = 4; //slide 갯수
	var n=0;
    var slider = $(".slide");
    var code = $(".skill_code-cover");
    var link_array="";
    var files;
    var ajax_file;
    var extension;
    var title;
    var httpRequest;
    var sliderLiMove = sliderLi.find("li").width();
    //var readStateData;
    sliderLi.find("li").first().addClass("active");
    codeviewIndex();
    function codeviewIndex(){
        for(var i=0; i<slider.length; i++){
            if($(".slider"+i).hasClass("active") == true){
                var Request;
                var StateData;
                link_array = $('.slide.slider'+i+' .box a').attr("href");
                files = link_array.split("/")[0] + "/file_view.txt";
                reqData(files, onLoadData);
                
                function reqData(url, callback) {
                    if( Request == null ) {
                        Request = getRequest();
                        if( Request == null )
                            return;
                    }
                    Request.open("GET", url, true);
                    Request.onreadystatechange = callback;
                    Request.send(null);
                }

                function getRequest() {
                    var httpReq = null;
                    try {
                        var httpReq = new XMLHttpRequest();
                    } catch(err) {
                        httpReq = null;
                    }
                    return httpReq;
                }

                function onLoadData() {
                    if( Request.readyState != 4 ) {
                        return;
                    }
                    var fileData = Request.responseText;
                    ajax_file = fileData.split("|");
                    for(var k=0; k < ajax_file.length; k++){
                    if(k >= ajax_file.length-2){
                        break;
                    }
                    var txt="";
                    $(".skill_code .main dd li a").click(function(e){
                        e.preventDefault();
                        txt=$(this).text();
                        $(".main dd").slideUp(300);
                        $(".main dt a").html("<span class='choi'><span>"+txt+"</span></span>"+"<span class='btn_prev'></span>");
                        $(".main dt a").removeClass("open");
                        $(".skill_code .top_menu ul li").eq(0).trigger("click");
                    });
                    if(k == 0){ //디스플레이 타입
                        var split_text = ajax_file[k].split("/");
                        $(".skill_code .main dt .choi").append("<span>"+split_text[0]+"</span>");
                        for(var f=0; f<split_text.length; f++){
                            $(".skill_code .main dd ul").append("<li><a href='#'>" + split_text[f] + "</a></li>");
                        }
                    } else if(k == 1){ //확장자
                        var split_text = ajax_file[k].split("/");
                        for(var f=0; f<split_text.length; f++){
                            $(".skill_code .top_menu ul").append("<li>"+split_text[f]+"</li>");
                        }
                    } else {
                            $(".skill_code .top_menu ul li").click(function(){
                                $(".skill_code .left_menu ul li").remove();
                                $(".skill_code .top_menu ul li").removeClass("active");
                                $(this).addClass("active");
                                if($(this).hasClass("active")==true){
                                    var oneText = ajax_file[2] + "/" + ajax_file[3] + "/" + ajax_file[4];
                                    var leftIn = [];
                                    oneText = oneText.split("/");
                                    for(var y=0; y<oneText.length; y++){
                                        if(oneText[y].split(".")[1] == $(this).text()){
                                            leftIn.push(oneText[y].split(".")[0]);
                                        }
                                    }
                                    for(var h=0; h<leftIn.length; h++){
                                        
                                        var html = "<li class="+h+">"+leftIn[h]+"</li>";
                                        $(".skill_code .left_menu ul").append(html);
                                        $(".skill_code .left_menu ul li").eq(0).addClass("active");
                                        $(".skill_code .left_menu ul li").each(function(i, e){
                                            if($(e).hasClass("active")){
                                                title = $(e).text();
                                            }
                                        });

                                        $(".skill_code .left_menu ul li").click(function(e){
                                            $(".skill_code .left_menu ul li").removeClass("active");
                                            $(this).addClass("active");
                                            title = $(this).text();
                                        });
                                    }
                                        extension = $(this).text();
                                        if($(this).text() == "js"){
                                            if($(".skill_code .main dt .choi").text() == "PC"){
                                                link_array = link_array.split("/")[0] + "/pc/js/" + title + "_" +extension+".txt";
                                                skillClick("/pc/js/");
                                            } else if($(".skill_code .main dt .choi").text() == "Mobile"){
                                                link_array = link_array.split("/")[0] + "/mobile/js/" + title + "_" +extension+".txt";
                                                skillClick("/mobile/js/");
                                            }else{
                                                link_array = link_array.split("/")[0] + "/js/" + title + "_" +extension+".txt";
                                                skillClick("/js/");
                                            }
                                        } else if($(this).text() == "css"){
                                            if($(".skill_code .main dt .choi").text() == "PC"){
                                                link_array = link_array.split("/")[0] + "/pc/css/" + title + "_" +extension+".txt";
                                                skillClick("/pc/css/");
                                            } else if($(".skill_code .main dt .choi").text() == "Mobile"){
                                                link_array = link_array.split("/")[0] + "/mobile/css/" + title + "_" +extension+".txt";
                                                skillClick("/mobile/css/");
                                            } else {
                                                link_array = link_array.split("/")[0] + "/css/" + title + "_" +extension+".txt";
                                                skillClick("/css/");
                                            }
                                        } else {
                                            if($(".skill_code .main dt .choi").text() == "PC"){
                                                link_array = link_array.split("/")[0] + "/pc/" + title + "_" +extension+".txt";
                                                skillClick("/pc/");
                                            }else if($(".skill_code .main dt .choi").text() == "Mobile"){
                                                link_array = link_array.split("/")[0] + "/mobile/" + title + "_" +extension+".txt";
                                                skillClick("/mobile/");
                                            } else {
                                                link_array = link_array.split("/")[0] + "/" + title + "_" +extension+".txt";
                                                skillClick("/");
                                            }
                                        }
                                        function skillClick(ex){
                                            $(".skill_code .left_menu ul li").click(function(e){
                                                title = $(this).text();
                                                link_array = link_array.split("/")[0] + ex + title + "_" +extension+".txt";
                                                loadStateDate()
                                            });
                                        }
                                    loadStateDate()
                                }
                            });
                            $(".skill_code .top_menu ul li").each(function(i, e){
                                $(".skill_code .top_menu ul li").eq(0).trigger("click");
                                $(".skill_code .left_menu ul li").eq(0).trigger("click");
                            });
                        }
                    }
                }
            }
        }
    }
    
    $(".skill_code .main dt a").click(function(e){
        e.preventDefault();
        $(this).toggleClass("open");
        $(this).parent().next().slideToggle(300);
    });
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
        var i= sliderLi.find("li").length;
        sliderLiMove = sliderLi.find("li").width();
        $("#page3 .page3_inner .my_slider .container .wrapper").css({width : sliderLiMove * i});
	});
    
    $(".pagination li").eq(n).addClass("active");
	$(window).trigger("resize");

	$(window).scroll(function(){
		t=$(window).scrollTop();
		if(t < $("#page2").offset().top){
			pageN=0;
		}
		else if(t < $("#page3").offset().top){
			pageN=1;
		}
		else if(t < $("#page4").offset().top){
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
	//console.log(sliderLi.parent().parent());
	sliderLi.find("li").mousedown(function(e){
		down=true;
		xDown=e.clientX;
		yDown=e.clientY;
		//console.log(xDown, yDown);
	});
	sliderLi.find("li").mouseup(function(){
		down=false;
		moving=false;
	});
	sliderLi.find("li").mouseleave(function(){
		down=false;
		moving=false;
	});
    
	sliderLi.find("li").mousemove(function(e){
		if(sliderLi.is(":animated"))return;
		if(down == false)return;
		if(moving == true)return;
		moving=true;
		var sliderFind = sliderLi.find("li");
		direction=sliderFunction(e, xDown, yDown);
        pos = sliderLiMove;
		if(direction == "right"){
			if(dragn > 0){
				dragn-=1;
			}else{
                dragn=total;
            }
			moveRight(dragn, pos);
		}
		else if(direction == "left"){
			if(dragn < total){
				dragn+=1;
            }else{
                dragn = 0;
            }
			moveLeft(dragn, pos);
		}
	});
    $(".slider_btn-inner .prev").click(function(){
        if(sliderLi.is(":animated"))return;
        if(dragn > 0){
            dragn-=1;
        }else{
            dragn=total;
        }
        moveRight(dragn, sliderLiMove); 
    });
    $(".slider_btn-inner .next").click(function(){
        if(sliderLi.is(":animated"))return;
        if(dragn < total){
            dragn+=1;
        }else{
            dragn=0;
        }
        moveLeft(dragn, sliderLiMove); 
    });
	function moveLeft(n, pos){
		sliderLi.animate({left: -pos},500, function(e){
            sliderLi.find("ul").append(sliderLi.find("li").first());
			sliderLi.css({left: 0});
            sliderLi.find("li").removeClass("active");
            sliderLi.find("li.slider"+n).addClass("active");
            pagination(n);
            codeviewIndex();
            $(".skill_code .top_menu ul li").remove();
            $(".skill_code .main .choi span").remove();
            $(".skill_code .main dd ul li").remove();
		});
	}
	function moveRight(n, pos){
		sliderLi.find("ul").prepend(sliderLi.find("li").last());
		sliderLi.css({left: -pos});
		sliderLi.animate({left: 0},500);
        sliderLi.find("li").removeClass("active");
        sliderLi.find("li.slider"+n).first().addClass("active");
        codeviewIndex();
        pagination(n);
        $(".skill_code .top_menu ul li").remove();
        $(".skill_code .main .choi span").remove();
        $(".skill_code .main dd ul li").remove();
	}
    function pagination(n){
        for(var i=0; i<total+1; i++);
        $(".pagination .number").text(n+1+"/"+i);
    }
    pagination(dragn);
    
	function sliderFunction(evt, xd, yd){
		var moveDirection="";
		var xUp=evt.clientX;
		var yUp=evt.clientY;
		var xDiff=xd-xUp;
		var yDiff=yd-yUp;

		if(Math.abs(xDiff) > Math.abs(yDiff)){
			if(xDiff > 0){
				moveDirection="left";
			}
			else{
				moveDirection="right";
			}
		}
		else{
			if(yDiff > 0){
				moveDirection="up"
			}
			else{
				moveDirection="down";
			}
		}
		return moveDirection;
	}
    function loadStateDate() {
        var adition = "project4/index.html";
        reqHttpData(link_array, onLoadHttpData);
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
        code.html(fileData);
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
});
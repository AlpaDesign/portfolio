$(function(){
	var total = 6;
	var posy=0;
	var moving=false;
	var down=false;
	var direction = "";
	var xDown;
	var yDown;
	var dragn=0;
	var wheelFlag=true;
	var timer;
	var distance;
	var resizeTimer;
	var touchTimer;
	var pos=0;
	var h;
	var pageN=0;
	var n=0;
	$(window).keydown(function(e){
		var keyClick=e.keyCode;
		
		if(keyClick==38){
			pageN=pageN-1;
		}
		else if(keyClick==40){
			pageN=pageN+1;
		}
		doLayout();
	});
	function touchFunction(){
		$(".touch_icon").css({"display": "none"});
	};

	function doLayout(){
		pos=pageN*h;
		$("html").stop().animate({scrollTop:pos}, 500, function(){
			if(pageN >= 1){
				$("#pc").addClass("fixed");
			}
			else{
				$("#pc").removeClass("fixed");
			}
			if(pageN == 2){ 
				clearInterval(touchTimer);
				$(".touch_icon").css({"display": "block"});
				touchTimer=setInterval(touchFunction, 6000);
			}else{
				$(".touch_icon").css({"display": "none"});
			}
			$(".controller li").removeClass("active");
			$(".controller li").eq(pageN).addClass("active");
			$("#page"+pageN).addClass("active");
		});
	}

	$(window).resize(function(){
		h=$(window).height();
		//console.log(pageN);
		clearInterval(touchTimer);
		clearTimeout(resizeTimer);

		resizeTimer=setTimeout(function(){
			pos=pageN*h;
			$("html").stop().animate({scrollTop:pos}, 1000);
		},50);

		touchTimer=setInterval(touchFunction, 6000);

		$("#page1 .page1_cover .left .content li").eq(n).addClass("active");
		$("#page1 .page1_cover .right .page1_content").eq(n).addClass("view");
		$("#page5_ab").addClass("back" + n);
		$("#page5_background").addClass("back" + n).hide();
		$("#page5_ab .page5_cover .page5_btn li").eq(1).addClass("active");
		$(".controller li").eq(pageN).addClass("active");

		doLayout();
	});

	$(window).trigger("resize");

	$(document).mousewheel(function(e, delta){ //mousewheel
		if($("html").is(":animated") || !wheelFlag) return; //scroll이 animate 중이라면 return

		if(delta > 0){
			if(pageN > 0){
				pageN=pageN-1;
			}
		}
		else{
			if(pageN < 7){
				pageN=pageN+1;
			}
		}
		$(".controller li").removeClass("active");
		$(".controller li").eq(pageN).addClass("active");
		doLayout();
	});

	$(".controller li").click(function(e){
		e.preventDefault();
		pageN=$(this).index();

		doLayout();
	});
	$("#page1 .page1_cover .left .content li").click(function(e){
		e.preventDefault();

		n=$(this).index();

		if($(this).hasClass("active") == false){
			$("#page1 .page1_cover .right .page1_content").removeClass("active").fadeOut(0);
			$("#page1 .page1_cover .right .page1_content").eq(n).addClass("active").fadeIn(300);
		}else{
			return;
		}
			$("#page1 .page1_cover .left .content li").removeClass("active");
			$("#page1 .page1_cover .left .content li").eq(n).addClass("active");
	});

	$("#pc").mouseenter(function(){
		$(".menu_height").addClass("height");
		$("#pc").addClass("height");
	});
	$("#pc").mouseleave(function(){
		$(".menu_height").removeClass("height");
		$("#pc").removeClass("height");
	});

	$("#slider .mouse .mouse_inner img").click(function(){
			if(pageN == 0){
				pageN=1;
				doLayout();
			}
	});
	
	$("#footer .footer_inner .top .box").click(function(e){
		e.preventDefault();
		pageN=0;
		doLayout();
	});

	$(".pc_inner .menu_bar").click(function(e){
		e.preventDefault();
		$(".tab_menu-cover").fadeIn(300);
		$("#tab_menu").fadeIn(300);
		wheelFlag=false;
	});
	$("#tab_menu .menubar-close").click(function(e){
		e.preventDefault();
		$(".tab_menu-cover").fadeOut(300);
		$("#tab_menu").fadeOut(300);
		wheelFlag=true;
	});

	$("#page_content, #page_content > ul > li a").mousedown(function(e){
		down=true;
		xDown=e.clientX;
		yDown=e.clientY;
			//console.log("mousedown");
	});
	$("#page_content, #page_content > ul > li a").mouseup(function(){
		down=false;
		moving=false;
	});
	$("#page_content, #page_content > ul > li a").mouseleave(function(){
		down=false;
		moving=false;
	});

	$("#page_content, #page_content > ul > li a").mousemove(function(e){
		if($("#page_content").is(":animated"))return;
		if(down == false)return;
		if(moving == true)return;
		moving=true;
		
		direction=swipeAPI(e, xDown, yDown);

		if(direction == "right"){
			if(n > 0){
				n=n-1;
			}else{
				return;
			}
		}
		else if(direction == "left"){
			if(n < total-1){
				n=n+1;
			}else{
				return;
			}
		}
		//console.log(nn);
		posy=81.996*(-1)*n;

		$("#page_content").animate({"left": posy +"%"},500,function(){
			if(n == 0){
				$(".page5_btn .left_btn").removeClass("active");
				$(".page5_btn .right_btn").addClass("active");
			}
			else if(n == (total-1)){
				$(".page5_btn .right_btn").removeClass("active");
				$(".page5_btn .left_btn").addClass("active");
				
			}
			else{
				$(".page5_btn .left_btn").addClass("active");
				$(".page5_btn .right_btn").addClass("active");
			}
		});

		$("#page5_background").attr({"class":"back"+n});
		$("#page5_background").fadeIn(1000, function(){
			$("#page5_ab").attr({"class": "back" +n});
			$("#page5_background").hide();
		});

	});
	var page5N=0;
	$("#page5_ab .page5_cover .page5_btn li").click(function(){
		if($("#page_content").is(":animated"))return;
		n= $(this).index();
		if(n == 1){
			n=n+1;
			if(n > 5){
				n=n-1;
			}
		}
		else if (n ==0){
			n=n-1;
			if(n < 0){
				n=n+1;
			}
		}
		posy=81.996*(-1)*n;
		$("#page_content").animate({"left": posy +"%"},500,function(){
			if(n == 0){
				$(".page5_btn .left_btn").removeClass("active");
				$(".page5_btn .right_btn").addClass("active");
			}
			else if(n == (total-1)){
				$(".page5_btn .right_btn").removeClass("active");
				$(".page5_btn .left_btn").addClass("active");
				
			}
			else{
				$(".page5_btn .left_btn").addClass("active");
				$(".page5_btn .right_btn").addClass("active");
			}
		});
		$("#page5_background").attr({"class":"back"+nn});
		$("#page5_background").fadeIn(1000, function(){
			$("#page5_ab").attr({"class": "back" +nn});
			$("#page5_background").hide();
		});
	});
function swipeAPI(evt, xd, yd){
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
	$(".eamil_content span.check_text").click(function(){
		if($(".eamil_content span.check_text").hasClass("on") ==false){
			$(".eamil_content span.check_text").addClass("on");
			$("input[type=checkbox]").prop("checked", true);
		}else{
			$(".eamil_content span.check_text").removeClass("on");
			$("input[type=checkbox]").prop("checked", false);
		}
	});

	//main slider(메인슬라이더)
	var swiper1 = new Swiper('#slider .swiper-container', {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      pagination: {
        el: '#slider .swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '#slider .swiper-button-next',
        prevEl: '#slider .swiper-button-prev',
      },
    });
// ***************Main***************
	var swiper2 = new Swiper('#page2_slider .swiper-container', {
      slidesPerView: 2,
      spaceBetween: 39,
      freeMode: true,
      pagination: {
        el: '#page2_slider .swiper-pagination',
        clickable: true,
      },	
    });

});
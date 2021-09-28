$(function(){
	var xDown;
	var yDown;
	var direction="";
	var dragn=0;
	var total=7;
	var scrollDragn = 0;
	var pos=0;
	var moving=false;
	var movings=false;
	var touchT= false;
	var distance;
	var touchTimer;
	var n=0;
	var pageN=0;
	var t=0;
	var h;
	var les = 0;

	function touchFunction(){
		$(".touch_icon").css({"display": "none"});
	};
	
	$(window).resize(function(){
		t=$(window).scrollTop();
		//console.log(pageN);
		clearInterval(touchTimer);

		touchTimer=setInterval(touchFunction, 6000);

		timer=setTimeout(function(){
			h=$(window).height();
			distance=$("#page_content > ul > li").width();
			pos=distance*(-1)*dragn;
			$("#page_content").animate({left:pos}, 200);
		}, 50);

		$("#page1 .page1_cover .left .content li").eq(n).addClass("active");
		$("#page1 .page1_cover .right .page1_content").eq(n).addClass("view");
		$("#page5_ab").addClass("back" + n);
		$("#page5_background").addClass("back" + n).hide();
		$("#page5_ab .page5_cover .page5_btn li").eq(1).addClass("active");
		$(".controller li").eq(scrollDragn).addClass("active");

		doLayout(scrollDragn);
	});
	$(window).trigger("resize");

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
	
	$("#footer .footer_inner .top .box").click(function(e){
		e.preventDefault();
		//pageN=0;
		$("html").animate({scrollTop:0}, 800);
		doLayout(scrollDragn);
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
	$(".eamil_content span.check_text").click(function(){
		if($(".eamil_content span.check_text").hasClass("on") ==false){
			$(".eamil_content span.check_text").addClass("on");
			$("input[type=checkbox]").prop("checked", true);
		}else{
			$(".eamil_content span.check_text").removeClass("on");
			$("input[type=checkbox]").prop("checked", false);
		}
	});
	function touchIcon(){
		if(touchT==true){
			touchTimer=setInterval(touchFunction, 0);
		}else{
			touchTimer=setInterval(touchFunction, 6000);
		}
	}
	$("#page_content").on("touchstart", function(e){
		var evt=e.originalEvent;
		xDown=evt.touches[0].clientX;
		yDown=evt.touches[0].clientY;
		 //console.log(xDown+" : "+yDown);
	});
	$(window).on("touchstart", function(e){
		var evt=e.originalEvent;
		xDown=evt.touches[0].clientX;
		yDown=evt.touches[0].clientY;
		 //console.log(xDown+" : "+yDown);
	});
	
	$("#page_content").on("touchmove", function(e){
		var evt=e.originalEvent;

		if($("#page_content").is(":animated")) return;

		if(moving == true) return;

		direction=swipeAPI(evt, xDown, yDown);
		//console.log("direction : "+direction);

		if(direction == "right"){
			if(dragn > 0){
				dragn-=1;
			}
			else{
				return;
			}
		}
		else if(direction == "left"){
			if(dragn < (total-2)){
				dragn+=1;
			}
			else{
				return;
			}
		}
		moving=true;
		//dragUI(dragn);
	});
	$(".page5_btn li").click(function(){
		if(moving == true) return;
		moving=true;

		if($(this).index() == 0){
			if(dragn > 0){
				dragn=dragn-1;
			}
		}
		else{
			if(dragn < (total-2)){
				dragn=dragn+1;
			}
		}
		dragUI(dragn);
	});
	$("#page_content").on("touchend", function(e){
		dragUI(dragn);
	});

	function dragUI(n){
		pos=distance*(-1)*n;

		$("#page_content").animate({left:pos}, 400, function(){
			if(n == 0){
				$(".page5_btn .left_btn").removeClass("active");
				$(".page5_btn .right_btn").addClass("active");
			}
			else if(n == (total-1)){
				$(".page5_btn .left_btn").addClass("active");
				$(".page5_btn .right_btn").removeClass("active");
			}
			else{
				$(".page5_btn .left_btn").addClass("active");
				$(".page5_btn .right_btn").addClass("active");
			}

			$("#page5_background").attr({class:"back"+n});

			$("#page5_background").fadeIn(600, function(){
				moving=false;
				$("#page5_ab").attr({class: "back" +n});
				$("#page5_background").hide();
			});
		});
	}
	$(window).on("touchmove", function(e){
		var evt=e.originalEvent;

		if($("html").is(":animated")) return;

		if(movings == true) return;

		direction=swipeAPI(evt, xDown, yDown);

		if(direction == "down"){
			if(scrollDragn > 0){
				scrollDragn -= 1;
			} else {
				return;
			}
		}
		else if(direction == "up"){
			if(scrollDragn < total){ 
				scrollDragn += 1;
			} else {
				return;
			}
		}
		movings =true;
		
	});
	$("html").on("touchend", function(e){
		doLayout(scrollDragn);
	});

	$(".controller li").click(function(e){
		e.preventDefault();
		if($("html").is(":animated")) return;
		if(movings == true) return;

		scrollDragn=$(this).index();
		
		doLayout(scrollDragn);

		
		return scrollDragn;
	});

	function doLayout(les){
		pos=les*h;
		console.log(les);
		if($("html").stop().animate({scrollTop:pos}, 500, function(){
			if(les < 10){
				$("#pc").addClass("fixed");
			}
			else{
				$("#pc").removeClass("fixed");
			}
			if(les == 2){ 
				clearInterval(touchTimer);
				$(".touch_icon").css({"display": "block"});
				touchTimer=setInterval(touchFunction, 6000);
				if($("#page2_slider").on("touchstart", function(){
					touchTimer=setInterval(touchFunction, 0);
				}));
				else if($("#page2_slider").on("touchend", function(){
					touchTimer=setInterval(touchFunction, 6000);
				}));
			}else{
				clearInterval(touchTimer);
				touchTimer=setInterval(touchFunction, 6000);
				$(".touch_icon").css({"display": "none"});
			}
			movings=false;
		}));
		$(".controller li").removeClass("active");
		$(".controller li").eq(les).addClass("active");
		$("#page"+les).addClass("active");
	}
	function swipeAPI(evt, xd, yd){
		var moveDirection="";
		var xUp=evt.touches[0].clientX;
		var yUp=evt.touches[0].clientY;
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
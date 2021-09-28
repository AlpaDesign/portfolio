$(function(){
	var t=0;
	var n=0;
	var pos=0;
	var timer=0;
	var pageGap=150;
	var sliderN=0;
	var p=0;
	var s=0;

	$(window).on("scroll", parallexFn);
	$(window).trigger("scroll", parallexFn);
	$("#pc li").eq(n).addClass("active");
	$(".slider .main > li").eq(sliderN).addClass("active");
	$(".slider .gauge_bar li").eq(sliderN).addClass("active");
	$(".slider .btn_1 ul li").eq(p).addClass("active");
	
	let sliderGauge = $(".slider .gauge_bar li"); 
	for(var s1=0; s1 < sliderGauge.length; s1++){ 
		let sliderGaugeIndex = sliderGauge.eq(s1);
		let Ballcontroll = Number(sliderGaugeIndex.css("margin-left").replace("px", ""));
		
		$(".slider .gauge_bar li:nth-child("+ (s1 + 1) +") > a").mouseenter(function(){
			$(".slider .gauge_bar .ball").css({"left": (sliderGaugeIndex.position().left + Ballcontroll + 20)});
		
		setTimeout(function(){
			$(".gauge_bar").addClass("on");
			if($(".slider .gauge_bar").mouseleave(function(){
				$(".gauge_bar").removeClass("on");
			}));
		}, 1);
		});
	}

	function parallexFn(){
		clearTimeout(timer);

		timer=setTimeout(function(){
			t=$(window).scrollTop();

			if(t > 699){
				$("#pc").addClass("fixed");
			}
			else{
				$("#pc").removeClass("fixed");
			}

			if(t < $(".page1").offset().top-pageGap){
				n=0;
			}
			else if(t < $(".page2").offset().top-pageGap){
				n=1;
			}
			else if(t < $(".page3").offset().top-pageGap){
				n=2;
			}
			else if(t < $(".page4").offset().top-pageGap){
				n=3;
			}
			else if(t <= $(".page5").offset().top-pageGap){
				n=4;

				if($(document).height() == $(window).height()+t){
					n=5;
				}
			}
			else{
				n=5;
			}

			if(n == 0){
				$("#header .slider").addClass("on"); // BUTTON
				if($(".controller").hasClass("color")) $(".controller").removeClass("color"); // 0
			}
			else{
				if(n != 5){
					if(!$(".controller").hasClass("color")) $(".controller").addClass("color"); // 1, 2, 3, 4
				}
				else{
					if($(".controller").hasClass("color")) $(".controller").removeClass("color"); // 5
				}

				$(".page"+n).addClass("on");
				$(".page"+n).addClass("on1");
			}
			$("#pc li").removeClass("active");
			$("#pc li").eq(n).addClass("active");
			$(".controller span").css({height : 36*n});

		}, 100);
	}
	$(".controller span").on("transitionend", function(){
		$(".controller li").removeClass("effect");
		$(".controller li").eq(n).addClass("effect");

		for(var i=0; i<=5; i++){
			if(i <= n){ // 2 : 0, 1, 2
				$(".controller li").eq(i).addClass("color");
			}
			else{
				// console.log("etc i : "+i); // 3, 4, 5
				$(".controller li").eq(i).removeClass("color");
			}
		}
	});

	var sliderTimer=setInterval(sliderFunction, 7000);

	function sliderFunction(){
		if(sliderN < 3){
			sliderN+=1;
		}
		else{
			sliderN=0;
		}
		$(".slider .main > li").removeClass("active");
		$(".slider .main > li").eq(sliderN).addClass("active");
		$(".slider .gauge_bar li").removeClass("active");
		$(".slider .gauge_bar li").eq(sliderN).addClass("active");
	}

	$(".controller li, #pc li, #mobile li").click(function(e){
		e.preventDefault();
		n=$(this).index();
		pos=$("#header, #content > *").eq(n).offset().top;
		$("html").animate({scrollTop:pos}, 800);

		if($(this).parent().parent().attr("id") == "mobile"){
			$("html").animate({scrollTop:pos}, 800, function(){
				$("#mobile .btn_close").trigger("click");
			});
		}
		else{
			$("html").animate({scrollTop:pos}, 800);
		}
	});
	$(".slider .gauge_bar li").click(function(e){
		e.preventDefault();
		clearInterval(sliderTimer); // Timer Pause

		sliderN=$(this).index(); // DO
		$(".slider .main > li").removeClass("active");
		$(".slider .main > li").eq(sliderN).addClass("active");
		$(".slider .gauge_bar li").removeClass("active");
		$(".slider .gauge_bar li").eq(sliderN).addClass("active");
		$(".slider .btn_1 ul li").eq(1).removeClass("active");
		$(".slider .btn_1 ul li").eq(0).addClass("active");

		sliderTimer=setInterval(sliderFunction, 7000); // Timer Play
	});

	$(".slider .btn_1 ul li").click(function(e){
		e.preventDefault();
		p=$(this).index();
		clearInterval(sliderTimer);
		$(".slider .btn_1 ul li").toggleClass("active");
		if(p == 0){
			clearInterval(sliderTimer);
			//console.log("test1");
		}
		else {
			sliderTimer=setInterval(sliderFunction, 7000);
			//console.log("test2");
		};
	});

	$("#pc .pc_inner .btn_on").click(function(e){
		e.preventDefault();
		$("#mobile").addClass("active");
		$("#mobile .btn_close").addClass("active");
		$(".dim").addClass("active");
		$("body").addClass("fixed");
	});
	$(".dim").click(function(){
		$("#mobile").removeClass("active");
		$("#mobile .btn_close").removeClass("active");
		$(".dim").removeClass("active");
		$("body").removeClass("fixed");
	});
	$("#mobile .btn_close").click(function(){
		$("#mobile").removeClass("active");
		$("#mobile .btn_close").removeClass("active");
		$(".dim").removeClass("active");
		$("body").removeClass("fixed");
	});
});
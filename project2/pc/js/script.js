$(function(){
	var $height;

	$(window).scroll(function() {
		$height=$(window).scrollTop();

		if($height > 90){
			$("#header .menu_zone").addClass("fixed");
		}
		else{
			$("#header .menu_zone").removeClass("fixed");
		}
	});
	var p=0;
	$(window).scroll(function(){
		p=$(window).scrollTop();
		if(p > $("#section .center").offset().top){
			/*$("#popup").removeClass("move2");*/
			$("#popup").addClass("move1");
		}
		else if(p < $("#section .center").offset().top){
			$("#popup").removeClass("move1");
			/*$("#popup").addClass("move2");*/
		}
	});
	$("#gnb > ul > li").mouseenter(function(){
		$(".color").addClass("active");
		$("#header .menu_zone").addClass("active");
	});
	$("#gnb > ul > li").mouseleave(function(){
		$(".color").removeClass("active");
		$("#header .menu_zone").removeClass("active");
	});

	/*slider*/
	var n=0;
	$(".bottom_btn li").eq(n).addClass("on");
	$(".slider li").eq(n).addClass("current");
	$(".bottom_btn li").click(function(){
		n=$(this).index();
		$(".bottom_btn li").removeClass("on");
		$(this).addClass("on");
		$(".slider li").removeClass("current");
		$(".slider li").eq(n).addClass("current");
	});
	$(".top_btn .left").click(function(){
		if(n >= 0){
			n=n-1;
		}
		else{
			n=2
		}
		$(".bottom_btn li").removeClass("on");
		$(".bottom_btn li").eq(n).addClass("on");
		$(".slider li").removeClass("current");
		$(".slider li").eq(n).addClass("current");
	});
	$(".top_btn .right").click(function(){
		if(n < 2){
			n=n+1;
		}
		else{
			n=0
		}
		$(".bottom_btn li").removeClass("on");
		$(".bottom_btn li").eq(n).addClass("on");
		$(".slider li").removeClass("current");
		$(".slider li").eq(n).addClass("current");
	});
	
	/*gnb focus*/
	$("#gnb > ul > li > a").focusin(function(){
		if($(this).parent().index()==0){
			$("#header .menu_zone").addClass("active");
		}
		$(this).parent().addClass("active");
	});
	$("#gnb li:last-child li:last-child a").focusout(function(){
		$("#header .menu_zone").removeClass("active");
	});
	$("#gnb ul ul li a").focusin(function(){
		$(this).parent().parent().parent().find("a").addClass("active");
		$(this).parent().parent().addClass("active");
	});
	$("#gnb ul ul li a").focusout(function(){
		$(this).parent().parent().parent().find("a").removeClass("active");
		$(this).parent().parent().removeClass("active");
	});
	
	/*banner focus*/
	
	$(".banners li a").focusin(function(){
		$(this).parent().addClass("trick");
		$(this).parent().find(".icon").addClass("trick");
		$(this).parent().find(".back").addClass("trick");
	});
	$(".banners li a").focusout(function(){
		$(this).parent().removeClass("trick");
		$(this).parent().find(".icon").removeClass("trick");
		$(this).parent().find(".back").removeClass("trick");
	});
});	
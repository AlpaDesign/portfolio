$(function(){
	//Swiper
	var swiper = new Swiper('#main_silder .swiper-container', {
      pagination: {
        el: '.swiper-pagination',
        type: 'fraction', 
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
	$("#header .menu_btn a").click(function(e){
		e.preventDefault();
		$("#mobile").toggleClass("active");
		$(".dim").toggleClass("active");
		$("body").toggleClass("fixed");
	});
	$("#mobile .mobile_btn a").click(function(e){
		e.preventDefault();
		$("#mobile").removeClass("active");
		$(".dim").removeClass("active");
		$("body").removeClass("fixed");
	});
	$(".dim").click(function(){
		$("#mobile").removeClass("active");
		$(".dim").removeClass("active");
		$("body").removeClass("fixed");
	});
	
	var n=0;
	$("#center .action li").eq(0).addClass("active");
	
	$("#center .action li").click(function(e){
		e.preventDefault();
		n=$(this).index();
		$("#center .action li").removeClass("active");
		$(this).addClass("active");
		
		if($("#center .action li").eq(1).hasClass("active")){
			$("#center .action_icon > ul > li > a").addClass("active");
			$("#center .action_icon li .icon").addClass("active");
		}
		else{
			$("#center .action_icon > ul > li > a").removeClass("active");
			$("#center .action_icon li .icon").removeClass("active");
		}
	});
	var swiper = new Swiper('#section .swiper-container', {
      slidesPerView: 1.5,
      spaceBetween: 20,
		pagination: {
			el: '.swiper-pagination',
			type: 'progressbar',
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
    });
});
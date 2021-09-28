$(function(){
	var swiper1 = new Swiper('#slider .swiper-container', {
		slidesPerView: 1,
		spaceBetween: 0,
		centeredSlides: true,
        autoplay: {
			delay: 5000,
			disableOnInteraction: false,
        },
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

	var swiper2 = new Swiper('#page2_slider .swiper-container', {
		slidesPerView: 1,
		spaceBetween: 0,
		loop: true,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
	});

	$("#header .top .menu_tab").click(function(){ // �޴� �������� Ŭ�������� �޴�ON
		$("#gnb").addClass("active");
		$("body").addClass("fixed");
	});

	$("#gnb .top .menu_tab").click(function(){ // �޴� ������ X�� Ŭ�������� �޴�OFF
		$("#gnb").removeClass("active");
		$("body").removeClass("fixed");
	});

	$("#gnb > ul > li").click(function(e){
		e.preventDefault();

		if($(this).hasClass("active") == false){
			$("#gnb > ul > li").removeClass("active");
			$(this).addClass("active");

			$("#gnb ul ul").slideUp(300);
			$(this).find("ul").slideDown(300);
		}
		else{
			$(this).removeClass("active");
			$(this).find("ul").slideUp(300);
		}
	});

	var n=0;
	
	$("#page3 .controller > ul > li").eq(n).addClass("active");
	$("#page3 .content_box > ul > li").eq(n).addClass("active");
	$("#page3 .controller > ul > li").eq(n).find("img").attr("src", "images/page3Icon0_on.png");

	$("#page3 .controller > ul > li").click(function(){
		
		n=$(this).index();

		if($("#page3 .controller > ul > li").hasClass("active")==true){
			$("#page3 .content_box > ul > li").removeClass("active").fadeOut(100);
			$("#page3 .content_box > ul > li").eq(n).addClass("active").fadeIn(300);
		}
		$("#page3 .controller > ul > li").removeClass("active");
		$(this).addClass("active");

		var imgSrc = $(this).find("img").attr("src");  //li �� �ִ� img src�Ӽ��� �ҷ��ɴϴ�.
		$(this).find("img").attr("src", imgSrc.replace("_off", "_on"));//src�� off�� on���� �ٲߴϴ�
		//console.log(imgSrc);

		$(this).siblings().each(function(i, elem) { // Ŭ���������� li�� ã���ϴ�
			var img = $(elem).find("img");
			//console.log(img);
			//console.log(elem);
			$(img).attr("src", $(img).attr("src").replace("_on", "_off"));//on�� �ִٸ� off 
		});
	});
});
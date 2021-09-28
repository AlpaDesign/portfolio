window.addEventListener("load", function(){
	var swiper1=new Swiper(".slider .swiper-container", {
		pagination: {
			el: ".slider .swiper-pagination",
			clickable: true,
		},
		navigation: {
			nextEl: ".slider .swiper-button-next",
			prevEl: ".slider .swiper-button-prev",
		},
		breakpoints: {
			1200: {
				slidesPerView: 3,
				spaceBetween: 50,
			},
			1600: {
				slidesPerView: 3,
				spaceBetween: 50,
			},
		},
	});

	var header=document.getElementById("header");
	var MenuHeight=header.children[2];
	//console.log(headerIndex);

	var GNB=document.getElementById("gnb");
	var gnbIndex=GNB.children;
	
	for (i=0;i<gnbIndex.length;i++ ){
		gnbIndex[i].addEventListener("mouseenter", function(){
			MenuHeight.classList.add("active");
		});
		gnbIndex[i].addEventListener("mouseleave", function(){
			MenuHeight.classList.remove("active");
		});
	}

});
$(function(){
	// console.log("isMobile : "+isMobile);
	var newNode=document.createElement("SCRIPT");
	var newNode1=document.createElement("LINK");

	if(isMobile){
		newNode.setAttribute("src", "js/MobileScript.js");
		newNode1.setAttribute("rel","stylesheet");
		newNode1.setAttribute("href","css/styleM.css");
		
		document.getElementsByTagName("head")[0].appendChild(newNode);
		document.getElementsByTagName("head")[0].appendChild(newNode1);
	}
	else{
		newNode1.setAttribute("rel","stylesheet");
		newNode1.setAttribute("href","css/stylePC.css");
		newNode.setAttribute("src", "js/pcScript.js");
		
		document.getElementsByTagName("head")[0].appendChild(newNode);
		document.getElementsByTagName("head")[0].appendChild(newNode1);
	}
});
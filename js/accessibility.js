$(function(){
	var agent = navigator.userAgent.toLowerCase();

	if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
		alert("현 포트폴리오는 Chrome에서만 지원합니다!!");
	}
	if (agent.indexOf("edge") != -1) {
		alert("현 포트폴리오는 Chrome에서만 지원합니다!!");
	}
	if (agent.indexOf("firefox") != -1) {
		alert("현 포트폴리오는 Chrome에서만 지원합니다!!");
	}
});
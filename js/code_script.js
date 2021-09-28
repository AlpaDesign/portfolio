$(function(){
    var Flag = false;
    var codeHtml;
    var code = $(".code_success");
    $(".code_box a").click(function(e){
        e.preventDefault();
        var textarea = $("textarea").val();
        var extension;
        $(".check_box input").each(function(i, e){
            if($(e).is(":checked") == true){
                extension = $(e).val();
            }
        });
        
        if($(".check_box input").is(":checked") == false){
            alert("확장자를 선택하세요!");
            Flag = false;
        } else {
            Flag = true;
        }
        if(Flag == true){
            $(".code_box").addClass("active");
            $(".code_view").addClass("active");
            codeHtml = $(".code_success").text(textarea);
            codeHtml = $(".code_success").html().split("\n");
            
            var innerText = "";
            for(var k=0; k<codeHtml.length; k++){
                innerText += "<pre class='code_text'>"+
                             "<span class='num'>"+
                             Number(k+1)+"</span>"+
                             "<span class='text'>"+ 
                             codeHtml[k]+"\n"+
                             "</span>"+
                             "</pre>";
            }
            code.html(innerText);
            for(var f=0; f<$('.code_text').length; f++){
                
                if($('.code_text').eq(f).children("span.text").text() == ""){
                    $('.code_text').eq(f).html("<span class='num'>"+Number(f+1)+"</span>"+ "<br>");
                }
            }
            for(var i=0; i<$('.code_text').length; i++){ //코드색상
                codeFunction(/".*?"/g, "orange", i);// 큰따옴표 안에 모든 내용은 <span class='orange'></span>태그로 감싼다
                codeFunction(/['].*?[']/g, "orange", i);
                
                if(extension=="css"){
                    codeFunction(/[.#a-z].*?[{]/g, "blue", i);
                    codeFunction(/[#.].*?,/g, "blue", i);
                    codeFunction(/\/[*].*?\//g, "gray", i);
                    codeFunction(/@.*?&nbsp/g, "puple", i);
                    codeFunction(/.*?:/g, "puple", i);
                    codeFunction(/#.*?;\n/g, "orange", i);
                    codeFunction(/&nbsp;[0-9].*?;\n/g, "green", i);
                    codeFunction(/&nbsp;[a-z].*?;\n/g, "orange", i);
                } else {
                    codeFunction(/&lt;.*?&gt;/g, "blue", i);// 태그(< >) 안에 모든 내용은 <span class='blue'></span>태그로 감싼다
                    codeFunction(/&lt;!--.*?--&gt;/g, "gray", i);// html 주석(<!-- -->) 안에 모든 내용은 <span class='gray'></span>태그로 감싼다
                    codeFunction(/\/\/.*?\n/g, "gray", i);
                    codeFunction(/\/[*].*?[*]\//g, "gray", i);
                    codeFunction2(i);
                    codeFunction(/var.*?=/g, "puple", i);
                    codeFunction(/function&nbsp.*?{/g, "puple", i);
                    codeFunction(/&lt;[?].*?[?]&gt;/g, "white", i);
                    //codeFunction(/[a-z].*?[(]/g, "blue", i);
                }
            }
            if(extension == "html"){
                codeETC(["name=", "charset=", "content=", "rel=", "href=", "src=", "id=", "&nbsp;class=", "alt=", "target=", "onclick=", "methode=","action="], "green");
                codeETC(["function&nbsp;", "var&nbsp;", "for", "let&nbsp;", "while", "if", "else&nbsp;if", "else", "include"], "blue");
            } else if(extension == "js"){
                codeETC(["name=", "charset=", "content=", "rel=", "href=", "src=", "id=", "&nbsp;class=", "alt=", "target=", "onclick=", "methode=","action=",".keydown",".keyCode", ".stop", ".animate",".eq",".removeClass", ".addClass",".css",".hide",".is",".trigger",".mousewheel", ".click",
                ".preventDefault",".index", ".hasClass", "mouseenter", "mouseleave","fadeIn","fadeOut", ".clientX", ".clientY", ".attr", ".scrollTop", ".height", ".resize", ".offset", ".on", ".scroll", ".focusin", ".focusout", ".parent", ".children", ".find"], "puple");
                
                codeETC(["function", "var", "for", "let&nbsp;", "while", "if(", "else&nbsp;if", "else"], "blue");
                codeETC(["this"], "blue");
                codeETC(["true", "false"], "orange");
                codeETC(["{","("], "white");
            } else if(extension == "css") {
                codeETC(["{", ",","hover"], "white");
            } else if(extension == "php"){
                codeETC(["name=", "charset=", "content=", "rel=", "href=", "src=", "id=", "&nbsp;class=", "alt=", "target=", "onclick=", "methode=","action="], "green");
                codeETC(["function&nbsp;", "var&nbsp;", "for", "let&nbsp;", "while", "if", "else&nbsp;if", "else", "include"], "blue");
                codeETC(["name=", "charset=", "content=", "rel=", "href=", "src=", "id=", "&nbsp;class=", "alt=", "target=", "onclick=", "methode=","action=",".keydown",".keyCode", ".stop", ".animate","eq",".removeClass", ".addClass",".css",".hide",".is",".trigger",".mousewheel", ".click",
                ".preventDefault",".index", ".hasClass", "mouseenter", "mouseleave","fadeIn","fadeOut", ".clientX", ".clientY", ".attr", ".scrollTop", ".height", ".resize", ".offset", ".on", ".scroll", ".focusin", ".focusout", ".parent", ".children", ".find"], "puple");
                
                codeETC(["function", "var", "for", "let&nbsp;", "while", "if(", "else&nbsp;if", "else"], "blue");
                codeETC(["this"], "blue");
                codeETC(["true", "false"], "orange");
                codeETC(["{","("], "white");
            }
            $("span.gray").children().each(function(i,e){
                $(e).attr("class","gray");
            });
            if(extension != "php"){
                $("span.orange").children().each(function(i,e){
                    $(e).attr("class","orange");
                });
            } else {
                $("span.orange").children().each(function(i,e){
                    if($(e).hasClass("gray")){
                        $(e).attr("class","orange");
                    }
                });
                $("span.gray").children().each(function(i,e){
                    $(e).attr("class","gray");
                });
                
            }
            if($(".search input").is(":checked") == true){
                var text = code.html();
                code.text(text);
                var idx = code.text().split("</pre>");
                var idxText = "";
                for(var k=0; k < idx.length-1; k++){
                    idxText +=  idx[k]+"</pre>"+"\n";
                }
                code.text(idxText); 
            }
        } else {
            return Flag;
        }
    });
    function codeETC(array, colorCode){
        var color = array; //태그안 내용
        for(var i = 0; i < color.length; i++){
            var codeColor = code.html().replaceAll(color[i], "<span class='"+colorCode+"'>"+color[i]+"</span>");
            code.html(codeColor);
        }
    }
    
    function codeFunction(tagText, color, n){ //코드 색상
        var string = $('.code_text').eq(n).children(".text").html();
        var tagColor = tagText;
        var tagCurrent;
        while(tagCurrent = tagColor.exec(string)){ 
           var action = $('.code_text').eq(n).children(".text").html().replaceAll(tagCurrent, "<span class='"+color+"'>"+tagCurrent+"</span>")
           $('.code_text').eq(n).children(".text").html(action);
        }
    }
    function codeFunction2(n){
        var string = code.html();
        var tagColor = /&lt;script&gt;.*?/g;
        var tagCurrent;
        if(tagColor.exec(string)){
            codeFunction(/\/\/.*?\n/g, "gray", n);
            codeFunction(/&nbsp;.*?=/g, "puple", n); // script 보라색
        }
    }
    $(".check_box input").click(function(){
       if($(".check_box input").is(":checked") == true){
           $(".check_box input").prop("checked", false);
       }
        $(this).prop("checked", true);
    });
    $(".reset a").click(function(e){
        e.preventDefault();
        $(".code_box").removeClass("active");
        $(".code_view").removeClass("active");
        $("textarea").val("");
    });
});
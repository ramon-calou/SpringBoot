var pagenumber = 0;
var temMais = true;
var loading = false;

$(document).ready(function () {
	$("#loader-img").hide();
	$("#fim-btn").hide();
})

//Implementando Infinite Scroll
$(window).scroll(function (){
	
	var scrollTop = $(this).scrollTop();
	var conteudo = $(document).height() - $(window).height();

	//console.log("scrollTop: " + scrollTop + 1 + "conteudo: " + conteudo);
	scrollTop = scrollTop + 0.20;
	if(scrollTop >= conteudo){
		if(temMais && !loading){
		 pagenumber ++;
		 setTimeout(function () {
				loadByScrollBar(pagenumber)
			 }, 200) 
	}
	}
})

function loadByScrollBar(pagenumber){
	
		$.ajax({
			method: "GET",
			url: "/promocao/list/loadmore",
			data: {
				page: pagenumber
			},
			beforeSend: function(){
				$("#loader-img").show();
				loading = true;
			},
			success: function ( response ){
				$(".row").fadeIn(250, function (){
					$(this).append(response)
				});
				if(response.length < 250){
					temMais = false;
				}
				loading = false;
			},
			complete: function (){
				$("#loader-img").hide();
				if(!temMais){
					$("#fim-btn").show();
				}
			}
		})
}

$(document).on("click", "button[id*='likes-btn-']",function(){
	var id = $(this).attr("id").split("-")[2];

$.ajax({
	method: "POST",
	url: "/promocao/like/" + id,
	success: function (response){
		$("#likes-count-"+id).text(response)
	},
	error: function (xhr){
		alert("Ops, algo deu errado: " + xhr.status + ", " + xhr.statusText);
	}
})

})


var pagenumber = 0;
var temMais = true;
var loading = false;
var totalOfertas = 0; // Controle reverse Ajax

$(document).ready(function () {
	$("#loader-img").hide();
	$("#fim-btn").hide();
	initDWR();
})

//Implementando Infinite Scroll
$(window).scroll(function (){
	
	var scrollTop = $(this).scrollTop();
	var conteudo = $(document).height() - $(window).height();
	scrollTop += 0.6;
	//console.log("scrollTop: " + scrollTop + "conteudo: " + conteudo);
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
	var site = $("#autocomplete-input").val();
	
		$.ajax({
			method: "GET",
			url: "/promocao/list/loadmore",
			data: {
				page: pagenumber,
				site: site
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

//Implementação dos Likes
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

//AutoComplete:
$("#autocomplete-input").autocomplete({
	source: function(req, res){
		$.ajax({
			method: "GET",
			url: "/promocao/site",
			data: {
				//Por que .term ?????
				termo: req.term
			},
			success: function (result){
				res(result);
			}
		});
	}
})

$("#autocomplete-submit").on("click", function (){
	var site = $("#autocomplete-input").val();
	$.ajax({
		method: "GET",
		url: "/promocao/site/list",
		data: {
			site: site
		},
		beforeSend: function (){
			pagenumber = 0;
			$("#fim-btn").hide();
			$(".row").fadeOut(400, function (){
				$(this).empty();
			});
		},
		success: function (response){
			$(".row").fadeIn(250, function (){
				$(this).append(response);
				
			});
			
		},
		error: function (xhr){
			alert("Ops, algo deu errado: " + xhr.status + xhr.statusText);
		}
			
	})
})

//Reverse Ajax

function initDWR(){
	
	dwr.engine.setActiveReverseAjax(true);
	dwr.engine.setErrorHandler(error);
	
	DWRAlertaPromocoes.initDWR();
	
	
}

function error (exception){
	console.log("DWR error: " + exception);
}

$("#btn-alert").on("click", function() {
	$.ajax({
		method : "GET",
		url : "/promocao/list/loadmore",
		data:{
			page: 0
		},
		beforeSend : function() {
			pagenumber = 0;
			totalOfertas = 0
			$("#fim-btn").hide();
			$("#loader-img").show();
			$("#btn-alert").hide();
			$(".row").fadeOut(400, function() {
				$(this).empty();
			});
		},
		success : function(response) {
			$("#loader-img").hide();
			$(".row").fadeIn(250, function() {
				$(this).append(response);

			});

		},
		error : function(xhr) {
			alert("Ops, algo deu errado: " + xhr.status + xhr.statusText);
		}
	})
})

function showButton(count){
	totalOfertas = totalOfertas + count;
	$("#btn-alert").show(function () {
		$(this).attr("style", "display: block.")
				.text("Veja " + totalOfertas + " nova(s) oferta(s)");
	});
}







$(document).ready(function() {

	moment.locale('pt-br');

	var table = $("#table-server").DataTable({
		processing : true,
		serverSide : true,
		responsive : true,
		lengthMenu : [ 10, 15, 20, 25 ],
		ajax : {
			url : "/promocao/datatables/server",
			data : "data"
		},
		columns : [ {
			data : 'id'
		}, {
			data : 'titulo'
		}, {
			data : 'site'
		}, {
			data : 'linkPromocao'
		}, {
			data : 'descricao'
		}, {
			data : 'linkImagem'
		}, {
			data : 'preco',
			render : $.fn.dataTable.render.number('.', ',', 2, 'R$')
		}, {
			data : 'likes'
		}, {
			data : 'dtCadastro',
			render : function(dtCadastro) {
				return moment(dtCadastro).format('LLL');
			}
		}, {
			data : 'categoria.titulo'
		} ],
		dom : 'Bfrtip',
		buttons : [ {
			text : 'Editar',
			attr : {
				id : 'btn-editar',
				type : 'button'
			},
			enabled : false
		}, {
			text : 'Excluir',
			attr : {
				id : 'btn-excluir',
				type : 'button'
			},
			enabled : false
		} ]

	});

	$("#table-server thead").on("click", 'tr', function() {
		table.buttons().disable();
	})

	$("#table-server tbody").on("click", 'tr', function() {
		if ($(this).hasClass('selected')) {
			$(this).removeClass('selected');
			table.buttons().disable();
		} else {
			$('tr.selected').removeClass('selected');
			$(this).addClass('selected')
			table.buttons().enable();
		}
	})

	$("#btn-editar").on("click", function() {
		if (isSelectedRow()) {

			var id = getPromoId();
			$.ajax({
				method : "GET",
				url : "/promocao/edit/" + id,
				beforeSend : function() {
					//Remove as mensagens de erro
					$("span").closest('.error-span').remove();
					
					//removendo as bordas vermelhas
					$(".is-invalid").removeClass("is-invalid");
					
					$("#modal-form").modal('show');
				},
				success : function(data) {
					$("#edt_id").val(data.id);
					$("#edt_site").text(data.site);
					$("#edt_titulo").val(data.titulo);
					$("#edt_descricao").val(data.descricao);
					$("#edt_preco").val(data.preco.toLocaleString('pt-BR', {
						minimunFractiondigits : 2,
						maximumFractionDigits : 2
					}));
					$("#edt_categoria").val(data.categoria.id);
					$("#edt_linkImagem").val(data.linkImagem);
					$("#edt_imagem").attr('src', data.linkImagem);
				},
				error : function() {
					alert("Deu Ruim");
				}
			});
		}
	});

	$("#btn-excluir").on("click", function() {
		if (isSelectedRow()) {
			$("#modal-delete").modal('show');
		}
	});

	$("#btn-del-modal").on('click', function() {
		var id = getPromoId();
		$.ajax({
			method : "GET",
			url : "/promocao/delete/" + id,
			success : function() {
				$("#modal-delete").modal('hide');
				table.ajax.reload();
			},
			error : function() {
				alert("Ocorreu um erro. Tente novamente mais tarde.")
			}
		})
	})

	$("#btn-edit-modal").on('click', function() {
		var promo = {};
		promo.descricao = $("#edt_descricao").val();
		promo.preco = $("#edt_preco").val();
		promo.titulo = $("#edt_titulo").val();
		promo.categoria = $("#edt_categoria").val();
		promo.linkImagem = $("#edt_linkImagem").val();
		promo.id = $("#edt_id").val();
		$.ajax({
			method : "POST",
			url : "/promocao/edit/",
			data : promo,
			beforeSend: function (){
				//Remove as mensagens de erro
				$("span").closest('.error-span').remove();
				
				//removendo as bordas vermelhas
				$(".is-invalid").removeClass("is-invalid");
			},
			success : function() {
				$("#modal-form").modal('hide');
				table.ajax.reload();
			},
			statusCode: {
				422: function (xhr){
					var errors = $.parseJSON(xhr.responseText);
					$.each(errors, function (key, val){
						$("#edt_" + key).addClass("is-invalid");
						$("#error-" + key)
							.addClass("invalid-feedback")
							.append("<span class='error-span'>" + val + "</span>")
					});
				}	
			}
		});
	});
	
	$("#edt_linkImagem").on('change', function (){
		var link = $(this).val();
		$("#edt_imagem").attr("src", link);	
	})

	function getPromoId() {
		return table.row(table.$('tr.selected')).data().id
	}

	function isSelectedRow() {
		var trow = table.row(table.$('tr.selected'));
		return trow.data() !== undefined;
	}
});
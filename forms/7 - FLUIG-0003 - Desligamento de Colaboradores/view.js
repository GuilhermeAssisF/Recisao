var atividade;

$(document).ready(function () {

	atividade = getWKNumState();

	Compartilhados.expandePainel(atividade);
	Compartilhados.destacaAprovacoes();
	Compartilhados.destacaParecer();
	Compartilhados.camposObrigatorio();

	if (atividade !== 11 && $("#cpReaberturaChamado").val() == "") {
		$("#divReabertura").hide();
	}
	var TpDemissao = $("#CodTpDesl").val();
	TpAvvsTpDem(TpDemissao);

	if (atividade == "1" || atividade == "0" || atividade == "41") {

		//Empresa e Dpto	
		$("#addEmpresa").click(function () {
			var zoomSecao = buscaCentroCusto();
			zoomSecao.Abrir();
			$("#DataDemissao").val("");
			$("#DataPagamento").val("");

		});
		//Colaborador
		$("#addNomCol").click(function () {
			var ZoomCol = ZoomBuscaCol();
			ZoomCol.Abrir();
		});
		//Tp Desligamento
		$("#addTpDesl").click(function () {
			var ZoomTPTDemissao = ZoomBuscaTPTDemissao();
			ZoomTPTDemissao.Abrir();
		});
		//Mt Desligamento
		$("#addMtDesl").click(function () {
			var ZoomMTVDemissao = ZoomBuscaMTVDemissao();
			ZoomMTVDemissao.Abrir();
		});
		criaDatepickers();



		//BUSCA DATA DEMISSAO
		$("#addDataDem").click(function () {
			var DIAS = "10";
			var DATA = document.getElementById("DataDemissao").value;
			var COLIGADA = document.getElementById("CodColigada").value;
			var CODSECAO = document.getElementById("CodCentroCC").value;
			if (COLIGADA == "" || CODSECAO == "") {
				window.parent.FLUIGC.message.alert({
					message: "Antes de selecionar a data de demissão,preencha com os dados do colaborador!",
					title: 'Erro',
					label: 'Ok'
				});
			} else {
				$("#DataDemissao").datepicker('show');
			}

		});

		//BUSCA DATA AVISO 
		$("#addDataAviso").click(function () {
			$("#DataAviso").datepicker('show');
		});
		//data pagamento
		$("#addDataPGTO").click(function () {
			$("#DataPagamento").datepicker('show');
		});

		$("#addDataFinalContrato").click(function () {
			$("#DataFinalContrato").datepicker('show');
		});

		$("#addDataInicioAvisoTrabalhado").click(function () {
			$("#DataInicioAvisoTrabalhado").datepicker('show');
		});

		$("#btnAddItem").click(function () {
			var indexRCM = wdkAddChild("tbItens");
			$("#cpQtdLinhas").val(indexRCM);
			//aviso das regras de RG
			FLUIGC.popover('.bs-docs-popover-hover', { trigger: 'hover', placement: 'auto' });
			$(".Valor").maskMoney();
		});
		//add processos de pagamento 
		$(document).on("click", ".buscaEvento", function (ev) {
			var $row = $(ev.target).closest('tr'),
				campos = $row.find('input'),
				Codevento = campos.get(0).id,
				DescrEvento = campos.get(1).id,
				ProvDescEvento = campos.get(2).id
			ZoomEventos(Codevento, DescrEvento, ProvDescEvento, $row);

		});

	}

	// Adicionar dentro do $(document).ready()
	$(document).on("change", "#cpTipoDesligamentoSelect", function () {
		var valorSelecionado = $(this).val();
		var textoSelecionado = $(this).find("option:selected").text();

		// 1. Chama a nova função de gerenciamento de visibilidade
		gerenciarCamposPorTipoDesligamento(valorSelecionado);

		// --- INÍCIO DA NOVA LÓGICA DE-PARA ---
		var codigoMotivo = null;

		// Mapeia o Tipo de Desligamento para o Código do Motivo
		switch (valorSelecionado) {
			case "2": // Demissão sem justa causa
				codigoMotivo = "05";
				break;
			case "4": // Pedido de demissao
				codigoMotivo = "4";
				break;
			case "T": // Termino de Contrato
				codigoMotivo = "3";
				break;
			case "1": // Justa Causa
				codigoMotivo = "01";
				break;
			case "8": // Falecimento
				codigoMotivo = "06";
				break;
			case "V": // Comum acordo
				codigoMotivo = "5";
				break;
			case "outros":
				codigoMotivo = null; // Habilita o campo
				break;
			default:
				codigoMotivo = null; // Nenhum selecionado, habilita/limpa
		}

		// Chama a nova função para preencher/limpar o motivo
		preencheMotivoAutomatico(codigoMotivo);
		// --- FIM DA NOVA LÓGICA DE-PARA ---

		if (valorSelecionado == "outros") {
			// 2. Mostra o campo de zoom
			$("#divTipoDesligamentoZoom").show();

			// 3. Limpa os campos ocultos
			$("#CodTpDesl, #TipoDesligamento, #TpAviso").val("");

			// 4. Oculta as opções de aviso do zoom (que serão reexibidas pela TpAvvsTpDem)
			$(".Indeniza, .Desconta").hide();

		} else {
			// 1. Garante que o campo de zoom esteja oculto
			$("#divTipoDesligamentoZoom").hide();

			// 2. Popula os campos ocultos com o valor do select
			$("#CodTpDesl").val(valorSelecionado);
			$("#TipoDesligamento").val(textoSelecionado);

			// 3. Re-executa a lógica de exibição do Tipo de Aviso (para o select de aviso)
			// Isso é importante caso você queira controlar o <select> "TpAviso" baseado no tipo "2" ou "V"
			TpAvvsTpDem(valorSelecionado);
		}
	});

	$(document).on("change", "#DescontaAvisoPrevio", function () {
		var tipoDesligamento = $("#cpTipoDesligamentoSelect").val();

		// Só aplica a regra de ocultar/mostrar se for "Pedido de Demissão"
		if (tipoDesligamento == "4") {
			if ($(this).is(":checked")) {
				$("#divAvisoTrabalhado").show();
				$("#addDataInicioAvisoTrabalhado button").prop("disabled", false);
				$("#DiasAvisoTrabalhado").prop("readonly", false);
			} else {
				$("#divAvisoTrabalhado").hide();
				$("#DataInicioAvisoTrabalhado, #DiasAvisoTrabalhado").val("");
				$("#addDataInicioAvisoTrabalhado button").prop("disabled", true);
			}
		}
	});

});

var criaDatepickers = function () {

	$("#DataAviso").datepicker({
		showOn: "button",
		showButtonPanel: "true",
		changeMonth: "true",
		changeYear: "true",
		showOtherMonths: "true",
		selectOtherMonths: "true",
		onSelect: function () {
			$(document).trigger('dataSelecionada');
		}
	});

	$("#DataDemissao").datepicker({
		showOn: "button",
		showButtonPanel: "true",
		changeMonth: "true",
		changeYear: "true",
		showOtherMonths: "true",
		selectOtherMonths: "true",
		onSelect: function () {
			$(document).trigger('dataSelecionada');
			adicionarDiasData()
		},
		minDate: 0
	});

	$("#DataPagamento").datepicker({
		showOn: "button",
		showButtonPanel: "true",
		changeMonth: "true",
		changeYear: "true",
		showOtherMonths: "true",
		selectOtherMonths: "true",
		onSelect: function () {
			$(document).trigger('dataSelecionada');
		},
		minDate: 0
	});

	$("#DataFinalContrato").datepicker({
		showOn: "button",
		showButtonPanel: "true",
		changeMonth: "true",
		changeYear: "true",
		showOtherMonths: "true",
		selectOtherMonths: "true",
		onSelect: function () {
			$(document).trigger('dataSelecionada');
		},
		minDate: 0 // Impede selecionar data passada
	});

	$("#DataInicioAvisoTrabalhado").datepicker({
		showOn: "button",
		showButtonPanel: "true",
		changeMonth: "true",
		changeYear: "true",
		showOtherMonths: "true",
		selectOtherMonths: "true",
		onSelect: function () {
			$(document).trigger('dataSelecionada');
		},
		minDate: 0 // Impede selecionar data passada
	});

	$("#DataInicioAvisoIndenizado").datepicker({
		showOn: "button",
		showButtonPanel: "true",
		changeMonth: "true",
		changeYear: "true",
		showOtherMonths: "true",
		selectOtherMonths: "true",
		onSelect: function () {
			$(document).trigger('dataSelecionada');
		},
		minDate: 0 // Impede selecionar data passada
	});

	// Esta função de clique para o botão do novo datepicker
	$("#addDataInicioAvisoIndenizado").click(function () {
		$("#DataInicioAvisoIndenizado").datepicker('show');
	});

}

function adicionarDiasData() {

	var DIAS = "9";
	var DATA = document.getElementById("DataDemissao").value;
	var COLIGADA = document.getElementById("CodColigada").value;
	var CODSECAO = document.getElementById("CodCentroCC").value;

	var fields = new Array(DIAS, DATA, COLIGADA, CODSECAO);
	var DATA = 0;
	try {

		var tabela = DatasetFactory.getDataset("DS_FLUIG_0051", fields, null, null);


		for (var i = 0; i < tabela.values.length; i++) {

			DATA = tabela.values[i].DATA.toString();

			$("#DataPagamento").val(DATA);
		}
	}

	catch (erro) {
		window.alert(erro);
	}

	//return valor;
	return 0;

}

var ZoomEventos = function (Codevento, DescrEvento, ProvDescEvento, $row) {
	var z = new Zoom();
	z.Id = "IDZoomColabRM";
	//z.FieldsName = new Array("cpCodObraOrig","cpCodEmpOrigem");
	z.DataSet = "DS_FLUIG_0037";
	z.Titulo = "Busca Colaborador";
	z.Colunas = [
		{ "title": "Código.", "name": "CODIGO" },
		{ "title": "Evento", "name": "DESCRICAO" },
		{ "title": "Provente ou Desconto", "name": "PROVDESCBASE" }
	];
	z.Retorno = function (retorno) {
		$("#" + Codevento).val(retorno[0]);
		$("#" + DescrEvento).val(retorno[1]);
		$("#" + ProvDescEvento).val(retorno[2]);
		$row.find('.infoColaborador, .campoSecao, .infoProdutoUAU, .campoColaborador').val('');

	};
	z.Abrir();
};

function fnCustomDelete(oElement) {
	if (atividade == "1" || atividade == "0" || atividade == "41") {
		fnWdkRemoveChild(oElement);

		var tableBody = document.getElementById("tbItens");
		var trashButtons = tableBody.getElementsByTagName("tr");
	}
}




function ZoomBuscaTPTDemissao() {

	var ZoomTPTDemissao = new Zoom();
	ZoomTPTDemissao.Id = "IDbuscaMTAdmissao";
	ZoomTPTDemissao.DataSet = "DS_FLUIG_0031";
	ZoomTPTDemissao.Titulo = "Buscar Tipo Demissao";
	ZoomTPTDemissao.Linhas = [];
	ZoomTPTDemissao.Renderizado = false;

	ZoomTPTDemissao.Colunas = [

		{ "title": "Codigo", "name": "CODCLIENTE" },
		{ "title": "Descricao.", "name": "DESCRICAO" }
	];

	ZoomTPTDemissao.Retorno = function (retorno) {
		$("#TipoDesligamento").val(retorno[1]);
		$("#CodTpDesl").val(retorno[0]);
		$("#TpAviso").val("");
		TpAvvsTpDem(retorno[0]);

		// Linha Adicionada: Garante que o select principal permaneça em "outros"
		$("#cpTipoDesligamentoSelect").val("outros");
	}

	return ZoomTPTDemissao;
}

function ZoomBuscaMTVDemissao() {

	var ZoomMTVDemissao = new Zoom();
	ZoomMTVDemissao.FieldsName = new Array("CodColigada");
	ZoomMTVDemissao.Id = "IDbuscaMTAdmissao";
	ZoomMTVDemissao.DataSet = "DS_FLUIG_0032";
	ZoomMTVDemissao.Titulo = "Buscar Motivo Demissao";
	ZoomMTVDemissao.Linhas = [];
	ZoomMTVDemissao.Renderizado = false;

	ZoomMTVDemissao.Colunas = [


		{ "title": "Codigo", "name": "CODCLIENTE" },
		{ "title": "Descricao.", "name": "DESCRICAO" }
	];

	ZoomMTVDemissao.Retorno = function (retorno) {

		$("#MotiDesligamento").val(retorno[1]);
		$("#CodMtDesl").val(retorno[0]);
	}

	return ZoomMTVDemissao;
}

var buscaCentroCusto = function () {

	var login = $("#cpLoginFluig").val();

	var zoomSecao = new Zoom();

	zoomSecao.FieldsName = ["login"];
	zoomSecao.Id = "IDZoomCentroCusto";
	zoomSecao.DataSet = "DS_FLUIG_0012";
	zoomSecao.Titulo = "Buscar Obra/Departamento";
	zoomSecao.setRawFilters("login", login);
	zoomSecao.Colunas = [

		{ "title": "Obra/Departamento", "name": "SECAO" },
		{ "title": "Cod.Secao", "name": "CODSECAO" },
		{ "title": "Cod.Coligada", "name": "CODCOLIGADA" },
		{ "title": "COD_GESTOR", "name": "COD_GESTOR", "display": false },
		{ "title": "NOME_GESTOR", "name": "NOME_GESTOR", "display": false },
		{ "title": "COD_DIRETOR", "name": "COD_DIRETOR", "display": false },
		{ "title": "NOME_DIRETOR", "name": "NOME_DIRETOR", "display": false },
		{ "title": "Empresa", "name": "EMPRESA", "display": false }
	];



	zoomSecao.Retorno = function (retorno) {

		$("#CentroCC").val(retorno[0]);
		$("#CodCentroCC").val(retorno[1]);
		$("#CodColigada").val(retorno[2]);
		$("#codGestor").val(retorno[3]);
		$("#Gestor").val(retorno[4]);
		$("#codDiretor").val(retorno[5]);
		$("#Empresa").val(retorno[7]);
		$("#txtSecOrig").val(retorno[0]);
		$("#CodCentroCC").val(retorno[1]);
		$("#txtCodSecaoOri").val(retorno[1]);

		$("#MatriculaCod").val("");

		$("#Estabilidade").val("");
		$("#divAvisoEstabilidade").hide();

		$("#TxtChapa").val("");
		$("#NomeColaborador").val("");
		$("#CargoCol").val("");
		$("#DatadaAdmissao").val("");
		$("#CodPessoa").val("");
		$("#TxtNomeCol").val("");
		$("#txtCodFuncao").val("");
		$("#CODSITUACAO").val("");
		$("#SituacaoColaborador").val("");
		$("#DtLimitFer").val("");
		$("#txtDtAdm").val("");
		$("#txtCodSindicato").val("");
		$("#txtMembCipaCod").val("");
		$("#CodTipoFunc").val("");
		$("#CodCategoria").val("");
		$("#txtSalOrigem").val("");
		$("#TEMPRAZOCONTR").val("");
		$("#FIMPRAZOCONTR").val("");
		$("#NROFICHAREG").val("");
		$("#CODRECEBIMENTO").val("");
		//$("#CodBanco").val("");
		//$("#BancoPagto").val("");
		$("#TipoFunc").val("");
		//$("#PIS").val("");

		// ########## INÍCIO LIMPEZA NOVOS CAMPOS ##########
		$("#ContratoComPrazo").prop('checked', false);
		$("#TipoContratoPrazo").val(retorno[24]); // <-- (Recebe o Tipo de Contrato)
		$("#DataFinalContrato").val(retorno[17]); // <-- (Recebe a Data Fim)
		$("#TemAvisoPrevioIndenizado").prop('checked', false);
		$("#DescontaAvisoPrevio").prop('checked', false);
		$("#AvisoPrevioMisto").prop('checked', false);
		$("#DataInicioAvisoTrabalhado").val("");
		$("#DiasAvisoTrabalhado").val("");
		$('input[name="TipoReducaoAviso"]').prop('checked', false);
		$('input[name="FormaReducaoAviso"]').prop('checked', false);
	}

	return zoomSecao;
};


function ZoomBuscaCol() {

	var ZoomCol = new Zoom();
	ZoomCol.FieldsName = new Array("CodCentroCC", "CodColigada");
	ZoomCol.Id = "IDZoomDadosColaborador";
	ZoomCol.DataSet = "DS_FLUIG_0026";
	ZoomCol.Titulo = "Buscar Colaborador";
	ZoomCol.Linhas = [];
	ZoomCol.Renderizado = false;

	ZoomCol.Colunas = [

		{ "title": "CHAPA", "name": "CHAPA" },//0
		{ "title": "NOME", "name": "NOME" },
		{ "title": "CARGO", "name": "CARGO" },//2
		{ "title": "DATAADMISSAO", "name": "DATAADMISSAO", display: false },
		{ "title": "UF_COLIGADA", "name": "UF_COLIGADA", display: false },//4
		{ "title": "CODFUNCAO", "name": "CODFUNCAO", display: false },
		{ "title": "CODSITUACAO", "name": "CODSITUACAO", display: false },//6
		{ "title": "CODSECAO", "name": "CODSECAO", display: false },
		{ "title": "FIMPRAZOCONTR", "name": "FIMPRAZOCONTR", display: false },//8
		{ "title": "CODPESSOA", "name": "CODPESSOA", display: false },
		{ "title": "SALARIO", "name": "SALARIO", display: false },//10
		{ "title": "DATALIMITEFER", "name": "DATALIMITEFER", display: false },
		{ "title": "CODSINDICATO", "name": "CODSINDICATO", display: false },//12
		{ "title": "MEMBROCIPA", "name": "MEMBROCIPA", display: false },
		{ "title": "CODTIPO", "name": "CODTIPO", display: false },//14
		{ "title": "CODCATEGORIA", "name": "CODCATEGORIA", display: false },
		{ "title": "TEMPRAZOCONTR", "name": "TEMPRAZOCONTR", display: false },//16
		{ "title": "FIMPRAZOCONTR", "name": "FIMPRAZOCONTR", display: false },
		{ "title": "NROFICHAREG", "name": "NROFICHAREG", display: false },//18
		{ "title": "CODRECEBIMENTO", "name": "CODRECEBIMENTO", display: false },
		{ "title": "CODBANCO", "name": "CODBANCO", display: false },//20
		{ "title": "BANCO", "name": "BANCO", display: false },
		{ "title": "TIPOFUNCIONARIO", "name": "TIPOFUNCIONARIO", display: false },//22 
		{ "title": "PISPASEP", "name": "PISPASEP", display: false },
		{ "title": "TIPOCONTRATOPRAZO", "name": "TIPOCONTRATOPRAZO", display: false } //24

	];



	ZoomCol.Retorno = function (retorno) {

		$("#MatriculaCod").val(retorno[0]);
		$("#TxtChapa").val(retorno[0]);
		$("#NomeColaborador").val(retorno[1]);
		$("#CargoCol").val(retorno[2]);
		$("#DatadaAdmissao").val(retorno[3]);
		$("#CodPessoa").val(retorno[9]);
		$("#TxtNomeCol").val(retorno[1]);
		$("#txtCodFuncao").val(retorno[5]);
		$("#CODSITUACAO").val(retorno[6]);
		$("#SituacaoColaborador").val(retorno[6]);
		$("#DtLimitFer").val(retorno[11]);
		$("#txtDtAdm").val(retorno[3]);
		$("#txtCodSindicato").val(retorno[12]);
		$("#txtMembCipaCod").val(retorno[13]);
		$("#CodTipoFunc").val(retorno[14]);
		$("#CodCategoria").val(retorno[15]);
		$("#txtSalOrigem").val(retorno[15]);

		// Campos ocultos (como antes)
		var temPrazoFlag = retorno[16]; // O valor 1 ou 0
		var dataFimContrato = retorno[17];
		$("#TEMPRAZOCONTR").val(temPrazoFlag);
		$("#FIMPRAZOCONTR").val(dataFimContrato);

		$("#NROFICHAREG").val(retorno[18]);
		$("#CODRECEBIMENTO").val(retorno[19]);
		//$("#CodBanco").val(retorno[20]);
		//$("#BancoPagto").val(retorno[21]);
		$("#TipoFunc").val(retorno[22]);
		//$("#PIS").val(retorno[23]);
		$("#txtTipoContratoPrazo").val(retorno[24]);

		// Novo campo de texto do contrato
		var tipoContratoTexto = retorno[24]; // O texto "Contrato de Experiência"

		// ########## INÍCIO DA NOVA LÓGICA DE PREENCHIMENTO ##########

		// 1. Popula o campo de TEXTO (readonly) com a coluna 24
		$("#TipoContratoPrazo").val(tipoContratoTexto);

		// 2. Popula a DATA FIM (readonly) com a coluna 17
		$("#DataFinalContrato").val(formatarDataISO(dataFimContrato));

		// 3. Controla o CHECKBOX com a coluna 16
		// (Ajuste a condição se o valor de "sim" for diferente de "S")
		if (temPrazoFlag != null && temPrazoFlag.toUpperCase() == "1") {
			$("#ContratoComPrazo").prop('checked', true);
		} else {
			$("#ContratoComPrazo").prop('checked', false);
		}

		// 4. TRAVA o checkbox, pois ele é automático
		$("#ContratoComPrazo").prop('disabled', true);

		$("#TemAvisoPrevioIndenizado").prop('checked', false);
		// ########## FIM DA NOVA LÓGICA ##########

		ESTABILIDADE();
	}

	return ZoomCol;
}


var TpAvvsTpDem = function (TipoDem) {
	//2,3,4,C,N,V - aviso indenizado
	//4 - desconta aviso previo
	if (TipoDem == "2" || TipoDem == "3" || TipoDem == "C" || TipoDem == "N" || TipoDem == "V") {
		$(".Indeniza").show();
		$(".Desconta").hide();
	} if (TipoDem == "4") {
		$(".Desconta").show();
		$(".Indeniza").show();
	} if ((TipoDem != "2" && TipoDem != "3" && TipoDem != "C" && TipoDem != "N" && TipoDem != "V" && TipoDem != "4") || TipoDem == "") {
		$(".Desconta").hide();
	}

}

var ESTABILIDADE = function () {

	var COLIGADA = document.getElementById("CodColigada").value;
	var MATRICULA = document.getElementById("MatriculaCod").value;
	var fields = new Array(COLIGADA, MATRICULA);

	try {
		var tabela = DatasetFactory.getDataset("DS_FLUIG_0038", fields, null, null);

		if (tabela.values.length > 0) {
			// Se o dataset retornar qualquer registro, o colaborador POSSUI estabilidade
			document.getElementById("Estabilidade").value = "POSSUI ESTABILIDADE";

			// --- LÓGICA ADICIONADA ---
			$("#divAvisoEstabilidade").show(); // Mostra o aviso

		} else {
			// Se o dataset não retornar nada, NÃO POSSUI estabilidade
			document.getElementById("Estabilidade").value = "NÃO POSSUI ESTABILIDADE";

			// --- LÓGICA ADICIONADA ---
			$("#divAvisoEstabilidade").hide(); // Esconde o aviso
		}
	}
	catch (erro) {
		// Em caso de erro, assume que não possui e esconde o aviso
		document.getElementById("Estabilidade").value = "NÃO POSSUI ESTABILIDADE";
		$("#divAvisoEstabilidade").hide();
	}

	return 0; // Mantém o retorno original da sua função
}

/**
 * Gerencia a exibição e os valores dos campos de aviso 
 * com base no Tipo de Desligamento selecionado.
 */
function gerenciarCamposPorTipoDesligamento(tipo) {
	console.log("Gerenciando campos para o tipo: " + tipo);

	// --- 1. Reseta/Oculta todos os blocos de aviso ---
	$("#divCamposAvisoOriginais").hide(); // Oculta o bloco de aviso original (para 'Outros')
	$("#linhaAvisoDinamica").hide();      // Oculta a nova linha dinâmica inteira

	// Oculta todos os componentes individuais dentro da linha dinâmica
	$("#divTemAvisoIndenizado, #divDescontaAviso, #divAvisoMisto").hide();
	$("#divDataInicioAvisoIndenizado, #divDataInicioAvisoTrabalhado").hide();
	$("#divDiasAvisoIndenizado, #divDiasAvisoTrabalhado").hide();
	$("#divAvisoProporcional").hide();

	// Limpa valores e estado dos checkboxes
	$("#TemAvisoPrevioIndenizado, #DescontaAvisoPrevio, #AvisoMisto")
		.prop("checked", false)
		.prop("disabled", false);

	// Limpa valores dos campos de data/dias
	$("#DataInicioAvisoIndenizado, #DiasAvisoIndenizado, #DataInicioAvisoTrabalhado, #DiasAvisoTrabalhado, #DiasAvisoProporcional").val("");

	// Limpa valores dos campos de aviso originais e HABILITA
	$("#TpAviso, #DataAviso").val("").prop("disabled", false);
	$("#addDataAviso button").prop("disabled", false);

	// Desabilita botões de data dos campos customizados
	$("#addDataInicioAvisoIndenizado button, #addDataInicioAvisoTrabalhado button").prop("disabled", true);


	// --- 2. Aplica as regras específicas ---

	if (tipo == "2" || tipo == "V") { // Demissão sem justa causa (2) ou Comum Acordo (V)
		console.log("Regra 2 ou V: Aviso Indenizado");

		$("#TpAviso").val("2"); // Seta valor oculto para integração

		// Mostra a linha dinâmica
		$("#linhaAvisoDinamica").show();

		// Mostra os 4 campos corretos na ordem
		$("#divTemAvisoIndenizado").show();
		$("#divDataInicioAvisoIndenizado").show();
		$("#divDiasAvisoIndenizado").show();
		$("#divAvisoProporcional").show();

		// Marca e desabilita o checkbox
		$("#TemAvisoPrevioIndenizado").prop("checked", true).prop("disabled", true);

		// Define o default de 30 dias e habilita campos
		$("#DiasAvisoIndenizado").val("30");
		$("#DataInicioAvisoIndenizado, #DiasAvisoIndenizado, #DiasAvisoProporcional").prop("readonly", false);
		$("#addDataInicioAvisoIndenizado button").prop("disabled", false); // Habilita o botão do calendário

	} else if (tipo == "4") { // Pedido de Demissão (4)
		console.log("Regra 4: Pedido de Demissão");

		$("#TpAviso").val("3"); // Seta valor oculto para integração

		// Mostra a linha dinâmica
		$("#linhaAvisoDinamica").show();

		// Mostra os 4 campos corretos na ordem
		$("#divDescontaAviso").show();
		$("#divDataInicioAvisoTrabalhado").show();
		$("#divDiasAvisoTrabalhado").show();
		$("#divAvisoProporcional").show();

		// Marca por default "Desconta Aviso Previo" (mas permite desmarcar)
		$("#DescontaAvisoPrevio").prop("checked", true).prop("disabled", false);

		// Habilita os campos de data e dias
		$("#DataInicioAvisoTrabalhado, #DiasAvisoTrabalhado, #DiasAvisoProporcional").prop("readonly", false);
		$("#addDataInicioAvisoTrabalhado button").prop("disabled", false); // Habilita o botão do calendário

	} else if (tipo == "1" || tipo == "8" || tipo == "T") { // Justa Causa (1), Falecimento (8), Termino de Contrato (T)
		console.log("Regra 1, 8 ou T: Sem Aviso");

		// Oculta a linha dinâmica (já está oculta pelo reset)
		// $("#linhaAvisoDinamica").hide();

		// Mostra o bloco de aviso original
		$("#divCamposAvisoOriginais").show();

		// Define "Não se Aplica" (código 5) e desabilita os campos
		$("#TpAviso").val("5").prop("disabled", true);
		$("#DataAviso").val("").prop("disabled", true);
		$("#addDataAviso button").prop("disabled", true); // Desabilita o botão do calendário

	} else if (tipo == "outros") {
		console.log("Regra: Outros");

		// Oculta a linha dinâmica (já está oculta pelo reset)
		// $("#linhaAvisoDinamica").hide();

		// Mostra os campos de aviso originais para o zoom
		$("#divCamposAvisoOriginais").show();
		$("#TpAviso").val(""); // Limpa o select

	} else {
		// Estado Padrão (Nenhum tipo selecionado)
		// Oculta tudo (já está oculto pelo reset)
		// $("#divCamposAvisoOriginais").hide();
		// $("#linhaAvisoDinamica").hide();
	}
}

/**
 * Formata uma data do formato ISO (YYYY-MM-DDTHH:MM:SS) para DD/MM/YYYY.
 * @param {string} dataISO A string de data no formato ISO.
 * @returns {string} A data formatada como DD/MM/YYYY ou uma string vazia.
 */
function formatarDataISO(dataISO) {
	if (!dataISO || dataISO == "") {
		return "";
	}

	try {
		// 1. Pega apenas a parte da data (YYYY-MM-DD)
		var dataParte = dataISO.split('T')[0];

		// 2. Quebra a data em partes
		var partes = dataParte.split('-');

		// 3. Monta no formato DD/MM/YYYY
		// partes[0] = YYYY, partes[1] = MM, partes[2] = DD
		if (partes.length === 3) {
			return partes[2] + '/' + partes[1] + '/' + partes[0];
		}

		return dataISO; // Retorna original se não estiver no formato esperado
	} catch (e) {
		console.error("Erro ao formatar data: ", dataISO, e);
		return dataISO; // Retorna original em caso de erro
	}
}

/**
 * Busca e preenche automaticamente o Motivo de Desligamento (DS_FLUIG_0032)
 * com base no código do motivo.
 * (Versão corrigida 3: Acessando colunas por nome de forma segura)
 */
function preencheMotivoAutomatico(codigoMotivo) {
    
    // 1. Se o código for nulo (como no caso "Outros" ou "Selecione..."),
    // limpa os campos e habilita o botão de zoom.
    if (codigoMotivo == null || codigoMotivo == "") {
        $("#CodMtDesl").val("");
        $("#MotiDesligamento").val("");
        $("#addMtDesl").prop("disabled", false); // Habilita o botão
        return;
    }

    try {
        // 2. Busca o dataset INTEIRO, sem filtros.
        var dataset = DatasetFactory.getDataset("DS_FLUIG_0032", null, null, null);

        if (dataset == null || dataset.values.length == 0) {
            throw new Error("O dataset DS_FLUIG_0032 está vazio ou não foi encontrado.");
        }

        // 3. Filtra o dataset manualmente em JavaScript
        var descricao = "";
        var encontrado = false;
        
        // Cria a versão com padding (ex: "05") manualmente
        var codigoPad = (codigoMotivo.length === 1) ? "0" + codigoMotivo : codigoMotivo;

        for (var i = 0; i < dataset.values.length; i++) {
            var row = dataset.values[i];
            
            // --- NOVA TÉCNICA DE LEITURA ---
            // Tenta ler a coluna "CODIGO" (padrão Fluig/JS)
            // Isso funciona mesmo que a coluna no dataset seja "codigo", "Codigo", etc.
            var codigoDataset = String(row["COCLIENTE"]).trim(); 
            
            // Compara o código do dataset com AMBAS as versões (ex: "5" ou "05")
            if (codigoDataset == codigoMotivo || codigoDataset == codigoPad) {
                // Lê a descrição usando a mesma técnica
                descricao = row["DESCRICAO"]; 
                encontrado = true;
                break; // Para o loop assim que encontrar
            }
        }

        if (encontrado) {
            // 4. Preenche os campos se encontrou
            $("#CodMtDesl").val(codigoMotivo); 
            $("#MotiDesligamento").val(descricao);
            $("#addMtDesl").prop("disabled", true); // Desabilita o botão
        } else {
            // 5. Se não encontrou no loop, avisa o usuário
            console.warn("Não foi possível encontrar a descrição para o Motivo de Desligamento com código: " + codigoMotivo);
            $("#CodMtDesl").val("");
            $("#MotiDesligamento").val("Código não encontrado. Selecione manualmente.");
            $("#addMtDesl").prop("disabled", false);
        }
    } catch (e) {
        console.error("Erro ao buscar motivo automático: " + e);
        $("#CodMtDesl").val("");
        $("#MotiDesligamento").val("Erro no dataset. Selecione manualmente.");
        $("#addMtDesl").prop("disabled", false);
    }
}
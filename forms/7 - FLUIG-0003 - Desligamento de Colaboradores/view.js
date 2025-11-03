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
		$("#TipoContratoPrazo").val("");
		$("#DataFinalContrato").val("");
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

		{ "title": "CHAPA", "name": "CHAPA" },
		{ "title": "NOME", "name": "NOME" },
		{ "title": "CARGO", "name": "CARGO" },
		{ "title": "DATAADMISSAO", "name": "DATAADMISSAO", display: false },
		{ "title": "UF_COLIGADA", "name": "UF_COLIGADA", display: false },
		{ "title": "CODFUNCAO", "name": "CODFUNCAO", display: false },
		{ "title": "CODSITUACAO", "name": "CODSITUACAO", display: false },
		{ "title": "CODSECAO", "name": "CODSECAO", display: false },
		{ "title": "FIMPRAZOCONTR", "name": "FIMPRAZOCONTR", display: false },
		{ "title": "CODPESSOA", "name": "CODPESSOA", display: false },
		{ "title": "SALARIO", "name": "SALARIO", display: false },
		{ "title": "DATALIMITEFER", "name": "DATALIMITEFER", display: false },
		{ "title": "CODSINDICATO", "name": "CODSINDICATO", display: false },
		{ "title": "MEMBROCIPA", "name": "MEMBROCIPA", display: false },
		{ "title": "CODTIPO", "name": "CODTIPO", display: false },
		{ "title": "CODCATEGORIA", "name": "CODCATEGORIA", display: false },
		{ "title": "TEMPRAZOCONTR", "name": "TEMPRAZOCONTR", display: false },
		{ "title": "FIMPRAZOCONTR", "name": "FIMPRAZOCONTR", display: false },
		{ "title": "NROFICHAREG", "name": "NROFICHAREG", display: false },
		{ "title": "CODRECEBIMENTO", "name": "CODRECEBIMENTO", display: false },
		{ "title": "CODBANCO", "name": "CODBANCO", display: false },
		{ "title": "BANCO", "name": "BANCO", display: false },
		{ "title": "TIPOFUNCIONARIO", "name": "TIPOFUNCIONARIO", display: false },
		{ "title": "PISPASEP", "name": "PISPASEP", display: false }

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
		$("#TEMPRAZOCONTR").val(retorno[16]);
		$("#FIMPRAZOCONTR").val(retorno[17]);
		$("#NROFICHAREG").val(retorno[18]);
		$("#CODRECEBIMENTO").val(retorno[19]);
		//$("#CodBanco").val(retorno[20]);
		//$("#BancoPagto").val(retorno[21]);
		$("#TipoFunc").val(retorno[22]);
		//$("#PIS").val(retorno[23]);
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

	var ESTABILIDADE = 0;

	try {
		var tabela = DatasetFactory.getDataset("DS_FLUIG_0038", fields, null, null);

		document.getElementById("Estabilidade").value = "NÃO POSSUI ESTABILIADE";

		for (var i = 0; i < tabela.values.length; i++) {
			ESTABILIDADE = tabela.values[i].ESTABILIDADE.toString();
			document.getElementById("Estabilidade").value = "POSSUI ESTABILIADE";
		}
	}

	catch (erro) {
	}

	//return DIAS;
	return 0;

}

/**
 * Gerencia a exibição e os valores dos campos de aviso 
 * com base no Tipo de Desligamento selecionado.
 */
function gerenciarCamposPorTipoDesligamento(tipo) {
	console.log("Gerenciando campos para o tipo: " + tipo);

	// --- 1. Reseta/Oculta todos os blocos de aviso ---
	// Oculta todos os 4 blocos filhos do container mestre
	$("#divCamposAvisoOriginais, #divCamposAvisoCheckboxes, #divAvisoIndenizadoCampos, #divAvisoTrabalhado").hide();

	// Mostra/Oculta os checkboxes individuais (eles estão dentro do divCamposAvisoCheckboxes)
	$("#divTemAvisoIndenizado, #divDescontaAviso, #divAvisoMisto").show(); // Mostra por padrão (o pai esconde)

	// Limpa valores e estado dos checkboxes
	$("#TemAvisoPrevioIndenizado, #DescontaAvisoPrevio, #AvisoMisto")
		.prop("checked", false)
		.prop("disabled", false);

	// Limpa valores dos campos de data/dias customizados
	$("#DataInicioAvisoIndenizado, #DiasAvisoIndenizado, #DataInicioAvisoTrabalhado, #DiasAvisoTrabalhado").val("");

	// Limpa valores dos campos de aviso originais e HABILITA (caso 'Outros' seja selecionado)
	$("#TpAviso, #DataAviso").val("").prop("disabled", false);
	$("#addDataAviso button").prop("disabled", false);

	// Desabilita botões de data dos campos customizados
	$("#addDataInicioAvisoIndenizado button, #addDataInicioAvisoTrabalhado button").prop("disabled", true);


	// --- 2. Aplica as regras específicas ---

	if (tipo == "2" || tipo == "V") { // Demissão sem justa causa (2) ou Comum Acordo (V)
		console.log("Regra 2 ou V: Aviso Indenizado");

		$("#TpAviso").val("2"); // Seta o valor para a integração (Aviso Indenizado)

		// Mostra os wrappers relevantes
		$("#divCamposAvisoCheckboxes, #divAvisoIndenizadoCampos").show();

		// Oculta as flags "Desconta" e "Misto"
		$("#divDescontaAviso, #divAvisoMisto").hide();
		$("#divTemAvisoIndenizado").show(); // Garante que este esteja visível

		// Marca e desabilita "Tem Aviso Prévio Indenizado"
		$("#TemAvisoPrevioIndenizado").prop("checked", true).prop("disabled", true);

		// Define o default de 30 dias e habilita campos
		$("#DiasAvisoIndenizado").val("30");
		$("#DataInicioAvisoIndenizado").prop("readonly", false);
		$("#DiasAvisoIndenizado").prop("readonly", false);
		$("#addDataInicioAvisoIndenizado button").prop("disabled", false);

	} else if (tipo == "4") { // Pedido de Demissão (4)
		console.log("Regra 4: Pedido de Demissão");

		$("#TpAviso").val("3"); // Seta o valor para a integração (Desconta Aviso)

		// Mostra os wrappers relevantes
		$("#divCamposAvisoCheckboxes, #divAvisoTrabalhado").show();

		// Oculta as flags "Indenizado" e "Misto"
		$("#divTemAvisoIndenizado, #divAvisoMisto").hide();
		$("#divDescontaAviso").show(); // Garante que este esteja visível

		// Marca por default "Desconta Aviso Previo" (mas permite desmarcar)
		$("#DescontaAvisoPrevio").prop("checked", true).prop("disabled", false);

		// Habilita os campos de data e dias do Aviso Trabalhado
		$("#DataInicioAvisoTrabalhado").prop("readonly", false);
		$("#DiasAvisoTrabalhado").prop("readonly", false);
		$("#addDataInicioAvisoTrabalhado button").prop("disabled", false);

	} else if (tipo == "1" || tipo == "8" || tipo == "T") { // Justa Causa (1), Falecimento (8), Termino de Contrato (T)
		console.log("Regra 1, 8 ou T: Sem Aviso");

		// Oculta blocos customizados
		$("#divCamposAvisoCheckboxes, #divAvisoIndenizadoCampos, #divAvisoTrabalhado").hide();

		// Mostra o bloco de aviso original
		$("#divCamposAvisoOriginais").show();

		// Define "Não se Aplica" (código 5) e desabilita os campos
		$("#TpAviso").val("5").prop("disabled", true);
		$("#DataAviso").val("").prop("disabled", true);
		$("#addDataAviso button").prop("disabled", true);

	} else if (tipo == "outros") {
		console.log("Regra: Outros");

		// Oculta blocos customizados
		$("#divCamposAvisoCheckboxes, #divAvisoIndenizadoCampos, #divAvisoTrabalhado").hide();

		// Mostra os campos de aviso originais para o zoom
		$("#divCamposAvisoOriginais").show();
		$("#TpAviso").val(""); // Limpa o select

	} else {
		// Estado Padrão (Nenhum tipo selecionado)
		// Oculta tudo
		$("#divCamposAvisoOriginais, #divCamposAvisoCheckboxes, #divAvisoIndenizadoCampos, #divAvisoTrabalhado").hide();
	}
}

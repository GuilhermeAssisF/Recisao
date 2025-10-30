/*
GESTOR - 7
DIRETOR - 8
CORREÇÃO - 41
ADMISSAO - 74
VALIDA KIT - 97
GERAR KIT - 89
*/
function displayFields(form, customHTML) {
	
	form.setShowDisabledFields(true);
	form.setHidePrintLink(true);
	/* Funcoes anexadas ao formulario no momento da redenrizacao da ficha*/
	customHTML.append("<script>function getWKNumState(){ return " + getValue("WKNumState") + "; }</script>");
	customHTML.append("<script>function getTodayDate(){ return " + new java.util.Date().getTime() + "; }</script>");
	customHTML.append("<script>function getFormMode(){ return '" + form.getFormMode() + "'; }</script>");
	customHTML.append("<script>function getUser(){ return '" + getValue("WKUser") + "'; }</script>");
	customHTML.append("<script>function getCompany(){ return " + getValue("WKCompany") + "; }</script>");
	
	var atividade = parseInt(getValue("WKNumState"));
	// Obtendo o usuario - data e numero da solicitacao
	
	
	if ((form.getFormMode() != "VIEW") && (atividade == 0 || atividade == 1)) {
		
		var hoje = new Date(),
		dia = hoje.getDate(),
		mes = hoje.getMonth() + 1;
	
		if (dia < 10) {
			dia = '0' + dia;
		}
		
		if (mes < 10) {
			mes = '0' + mes; 	
		}
	    
	    
	    form.setValue("cpDataAbertura",dia +  '/' + mes + '/' + hoje.getFullYear());
		
		var filterColaborador = new java.util.HashMap(),
			dadosColaborador,
			loginColaborador,
			DadosSolicitante;

		filterColaborador.put("colleaguePK.colleagueId", getValue("WKUser"));
		dadosColaborador = getDatasetValues('colleague', filterColaborador);
		loginColaborador = new Array(dadosColaborador.get(0).get("login"));
		
		DadosSolicitante = DatasetFactory.getDataset("DS_FLUIG_0006", loginColaborador, null, null);
	
		//DADOS DO SOLICITANTE
		form.setValue('cpLoginFluig', dadosColaborador.get(0).get("login"));
		form.setValue('cpNomeSolicitante', DadosSolicitante.getValue(0, "NOME"));
		form.setValue('cpMatriculaSolicitante', DadosSolicitante.getValue(0, "CHAPA"));
		form.setValue('cpEmailSolicitante', dadosColaborador.get(0).get("mail"));
		form.setValue('cpFuncaoSolicitante', DadosSolicitante.getValue(0, "CARGO"));
		form.setValue('cpEmpresaSolicitante', DadosSolicitante.getValue(0, "NOMEFANTASIA"));
		form.setValue('cpDepartamentoObraSolicitante', DadosSolicitante.getValue(0, "SECAO"));
		form.setValue('cpSolicitanteColigada', DadosSolicitante.getValue(0, "CODCOLIGADA"));
		form.setValue('cpEstadoSolicitante', DadosSolicitante.getValue(0, "UF_SECAO"));		
		//var banco = "Caixa Econômica Federal";
		//var CodBanco = "104";
		
		form.setValue('TxtCodSITRais', "1");
		form.setValue('TxtSITRais', "Ativ. normal c/ remun., lic. remun. c/ dir. integr.");
		form.setValue('TxtCodVINCRais', "1");
		form.setValue('TxtVINCRais', "Contr. trab., expr. OU tácito p/ prazo indet");
		 
	}
	if(atividade==7){
		filter = new java.util.HashMap();
		filter.put("colleaguePK.colleagueId", getValue("WKUser"));
		var colaborador = getDatasetValues('colleague', filter);
		form.setValue('cpRespGestor', colaborador.get(0).get("colleagueName"));
		
	}
	if(atividade==8){
		filter = new java.util.HashMap();
		filter.put("colleaguePK.colleagueId", getValue("WKUser"));
		var colaborador = getDatasetValues('colleague', filter);
		form.setValue('cpRespDiretor', colaborador.get(0).get("colleagueName"));
		  
	}
	if(atividade==74){
		filter = new java.util.HashMap();
		filter.put("colleaguePK.colleagueId", getValue("WKUser"));
		var colaborador = getDatasetValues('colleague', filter);
		form.setValue('cpRespRH', colaborador.get(0).get("colleagueName"));
		  
	}
	if(atividade==89){
		filter = new java.util.HashMap();
		filter.put("colleaguePK.colleagueId", getValue("WKUser"));
		var colaborador = getDatasetValues('colleague', filter);
		form.setValue('cpAnalistaBPO', colaborador.get(0).get("colleagueName"));
		  
	}
	if(atividade==97){
		filter = new java.util.HashMap();
		filter.put("colleaguePK.colleagueId", getValue("WKUser"));
		var colaborador = getDatasetValues('colleague', filter);
		form.setValue('cpRespKIT', colaborador.get(0).get("colleagueName"));
		  
	}
	//tratativa para problemas das datas
	var DataDemissao = form.getValue("DataDemissao");
	var DataAviso = form.getValue("DataAviso");
	var DatadaAdmissao = form.getValue("DatadaAdmissao");
	var cpDataAbertura = form.getValue("cpDataAbertura"); 
	var txtDtAdm = form.getValue("txtDtAdm"); 
	var DataPagamento = form.getValue("DataPagamento");
	var DataAviso = form.getValue("DataAviso");
	
	var formatoInput = new java.text.SimpleDateFormat("yyyy-MM-dd");
	var formatoOutput = new java.text.SimpleDateFormat("dd/MM/yyyy");
	
	if(DatadaAdmissao.search('-')>0){
		var DtmudancaForm = formatoInput.parse(DataDemissao);
		dtAtualFormatado = formatoOutput.format(DtmudancaForm);
		form.setValue('DataDemissao',dtAtualFormatado);
	}
	if(DataAviso.search('-')>0){
		var DtmudancaForm = formatoInput.parse(DataAviso);
		dtAtualFormatado = formatoOutput.format(DtmudancaForm);
		form.setValue('DataAviso',dtAtualFormatado);
	}
	if(DatadaAdmissao.search('-')>0){
		var DtmudancaForm = formatoInput.parse(DatadaAdmissao);
		dtAtualFormatado = formatoOutput.format(DtmudancaForm);
		form.setValue('DatadaAdmissao',dtAtualFormatado);
	}if(cpDataAbertura.search('-')>0){
		var DtmudancaForm = formatoInput.parse(cpDataAbertura);
		dtAtualFormatado = formatoOutput.format(DtmudancaForm);
		form.setValue('cpDataAbertura',dtAtualFormatado);
	}if(txtDtAdm.search('-')>0){
		var DtmudancaForm = formatoInput.parse(txtDtAdm);
		dtAtualFormatado = formatoOutput.format(DtmudancaForm);
		form.setValue('txtDtAdm',dtAtualFormatado);
	}if(DataPagamento.search('-')>0){
		var DtmudancaForm = formatoInput.parse(DataPagamento);
		dtAtualFormatado = formatoOutput.format(DtmudancaForm);
		form.setValue('DataPagamento',dtAtualFormatado);
	}if(DataAviso.search('-')>0){
		var DtmudancaForm = formatoInput.parse(DataAviso);
		dtAtualFormatado = formatoOutput.format(DtmudancaForm);
		form.setValue('DataAviso',dtAtualFormatado);
	}
	
	
	
} 
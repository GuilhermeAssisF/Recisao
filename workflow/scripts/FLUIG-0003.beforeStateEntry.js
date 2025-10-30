var INTEGRACAO = 110; //INTEGRA NA ATIVIDADE 24 DE apos o PROCESSAMENTO DE FERIAS

function beforeStateEntry(sequenceId){
	
	if(sequenceId==INTEGRACAO){
		DesligaColaboradores();
	}
}

function DesligaColaboradores(){
	
	var formatoInput = new java.text.SimpleDateFormat("dd/MM/yyyy");
	var formatoOutput = new java.text.SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss");
	
	var xml ='';
	
	var DataDemissao = hAPI.getCardValue("DataDemissao");
	var DataDemissaoForm = formatoInput.parse(DataDemissao);
	dtDataDemissao = formatoOutput.format(DataDemissaoForm);
	
	var DataAviso =  hAPI.getCardValue("DataAviso");
	if(DataAviso!=""){
	var DtAvisoForm = formatoInput.parse(DataAviso);
	dtDataAviso = formatoOutput.format(DtAvisoForm);
	}
	if(DataAviso==""){
	var DtAvisoForm = formatoInput.parse(DataDemissao); 
	dtDataAviso = formatoOutput.format(DtAvisoForm);
	}
	
		  	  
	var DataPagamento =  hAPI.getCardValue("DataPagamento");
	var DtaPagamentoForm = formatoInput.parse(DataPagamento);
	dtPagamento = formatoOutput.format(DtaPagamentoForm);
	
	
	
	var TxtChapa = hAPI.getCardValue("TxtChapa");
	var CodPessoa = hAPI.getCardValue("CodPessoa"); 
	var TxtNomeCol = hAPI.getCardValue("TxtNomeCol");
	var txtCodFuncao = hAPI.getCardValue("txtCodFuncao");
	var txtSalOrigem = hAPI.getCardValue("txtSalOrigem");
	var DtLimitFer = hAPI.getCardValue("DtLimitFer");
	var txtCodSecaoOri = hAPI.getCardValue("txtCodSecaoOri");
	var txtSecOrig = hAPI.getCardValue("txtSecOrig");
	
	var txtCodSindicato = hAPI.getCardValue("txtCodSindicato");
	var txtMembCipaCod = hAPI.getCardValue("txtMembCipaCod"); 
	var CodTipo = hAPI.getCardValue("CodTipoFunc"); 
	var CodCategoria = hAPI.getCardValue("CodCategoria");  
	var CodTpDesl = hAPI.getCardValue("CodTpDesl");
	var CodMtDesl = hAPI.getCardValue("CodMtDesl");
	var CodColigada = hAPI.getCardValue("CodColigada"); 
	var TEMPRAZOCONTR = hAPI.getCardValue("TEMPRAZOCONTR"); 
	var FIMPRAZOCONTR = hAPI.getCardValue("FIMPRAZOCONTR"); 
	var NROFICHAREG = hAPI.getCardValue("NROFICHAREG");  
	var CODRECEBIMENTO = hAPI.getCardValue("CODRECEBIMENTO");
	var TpAviso = hAPI.getCardValue("TpAviso");
	
	if(TpAviso=="1"){
		
		var CODSITUACAO = hAPI.getCardValue("CODSITUACAO");
		var CodSituacao;
		if(CODSITUACAO=="F") CodSituacao="F"
		if(CODSITUACAO!="F") CodSituacao="A"
	
		var xmlAviso='';

		
		xmlAviso +='<FopAvisoPrevio >';
		xmlAviso +='<PFUNC>';
		xmlAviso +='<CODCOLIGADA>'+CodColigada+'</CODCOLIGADA>';
		xmlAviso +='<CHAPA>'+TxtChapa+'</CHAPA>';
		xmlAviso +='<TIPODEMISSAO>'+CodTpDesl+'</TIPODEMISSAO>';
		xmlAviso +='<MOTIVODEMISSAO>'+CodMtDesl+'</MOTIVODEMISSAO>';
		xmlAviso +='<DTAVISOPREVIOTRAB>'+dtDataAviso+'</DTAVISOPREVIOTRAB>';
		xmlAviso +='<DTDEMISSAOPREVISTA>'+dtDataDemissao+'</DTDEMISSAOPREVISTA>';
		xmlAviso +=' <DTPAGTORESCISAO>'+dtPagamento+'</DTPAGTORESCISAO>';
		xmlAviso +='<CODSITUACAO>'+CodSituacao+'</CODSITUACAO>';
		xmlAviso +='<RESCISAOCALCULADA>false</RESCISAOCALCULADA>';
		xmlAviso +='<CARREGOUAVISOPREVIO>false</CARREGOUAVISOPREVIO>';
		xmlAviso +='<NOME>'+TxtNomeCol+'</NOME>';
		xmlAviso +='<TIPOAVISOPREVIO>1</TIPOAVISOPREVIO>';
		xmlAviso +='<TIPOREDUCAOAVISO>0</TIPOREDUCAOAVISO>	';
		xmlAviso +='<FORMAREDUCAOAVISO>0</FORMAREDUCAOAVISO>	';
		xmlAviso +='<MOTIVOAVISOPREVIOTRAB>03</MOTIVOAVISOPREVIOTRAB>';
		// xmlAviso +='<CODCATEGORIAESOCIAL>101</CODCATEGORIAESOCIAL>';
		xmlAviso +='<TEMLICENCARHU>true</TEMLICENCARHU>';
		xmlAviso +='</PFUNC>';
		xmlAviso +='</FopAvisoPrevio>';
		
		var CONNECT = DatasetFactory.getDataset("ds_connector", null, null, null);
		var USUARIO = CONNECT.getValue(0,"INTEGRADOR");
		var SENHA = CONNECT.getValue(0, "SENHA");
		var NOME_SERVICO = "WSDATASERVER";
		var CAMINHO_SERVICO = "com.totvs.WsDataServer";
		var servico = ServiceManager.getServiceInstance(NOME_SERVICO);
		var serviceHelper = servico.getBean();
		var instancia = servico.instantiate(CAMINHO_SERVICO);
		var ws = instancia.getRMIwsDataServer();
		var authenticatedService = serviceHelper.getBasicAuthenticatedClient(ws, "com.totvs.IwsDataServer", USUARIO, SENHA); 

		var xml = xmlAviso;
		log.info("@incluiPJ diz: XML: " + xml);

		try
		{
			var result = authenticatedService.saveRecordEmail('FopAvisoPrevioData', xml , 'CODCOLIGADA=1;CODSISTEMA=P',"suportesoter@consultoriainterativa.com.br");


			if ((result != null) && (result.indexOf("===") != -1))
			{
				var msgErro = result.substring(0, result.indexOf("==="));

				throw msgErro;

			}
			else
			{
			}
		}
		catch (e)
		{
			if (e == null)
			{
				e = "Erro desconhecido; verifique o log do AppServer";
			}

			var mensagemErro = "Erro na comunicação com o TOTVS TBC FUNC: " + e;
			log.error(mensagemErro + " ---> " + xml);

			throw mensagemErro;
		}
	
	
	}else{
	
		var CODSITUACAO = hAPI.getCardValue("CODSITUACAO");
		var CodSituacao;
		if(CODSITUACAO=="F") CodSituacao="F"
		if(CODSITUACAO!="F") CodSituacao="D"	
		
	    var DescontaAviso;
		if(TpAviso=="3")DescontaAviso="1"
		if(TpAviso!="3")DescontaAviso="0"
			
		var AvisIndenizado;
		if(TpAviso=="2")AvisIndenizado="1"
		if(TpAviso!="2")AvisIndenizado="0"
		
	var xmlFunc='';
	

	xmlFunc +='	<PFunc>	';
	xmlFunc +='	<CODCOLIGADA>'+CodColigada+'</CODCOLIGADA>	';
	xmlFunc +='	<CHAPA>'+TxtChapa+'</CHAPA>	';
	xmlFunc +='	<CODSITUACAO>'+CodSituacao+'</CODSITUACAO>	';
	xmlFunc +='	<SALDOFGTS>0.00</SALDOFGTS>	';
	xmlFunc +='	<TEMPRAZOCONTR>'+TEMPRAZOCONTR+'</TEMPRAZOCONTR>	';
	xmlFunc +='	<FIMPRAZOCONTR>'+FIMPRAZOCONTR+'</FIMPRAZOCONTR>	';
	xmlFunc +='	<DESCONTAAVISOPREVIO>'+DescontaAviso+'</DESCONTAAVISOPREVIO>	';
	xmlFunc +=' <DATADEMISSAO>'+dtDataDemissao+'</DATADEMISSAO>';
	xmlFunc +=' <TIPODEMISSAO>'+CodTpDesl+'</TIPODEMISSAO>';
	xmlFunc +=' <MOTIVODEMISSAO>'+CodMtDesl+'</MOTIVODEMISSAO>';
	xmlFunc +=' <DTDESLIGAMENTO>'+dtDataDemissao+'</DTDESLIGAMENTO>';
	xmlFunc +=' <DTULTIMOMOVIM>'+dtDataDemissao+'</DTULTIMOMOVIM>';
	xmlFunc +=' <DTPAGTORESCISAO>'+dtPagamento+'</DTPAGTORESCISAO>';
	xmlFunc +=' <CODSAQUEFGTS>01</CODSAQUEFGTS>';
    xmlFunc +=' <TEMAVISOPREVIO>'+AvisIndenizado+'</TEMAVISOPREVIO>';
    xmlFunc +=' <DTAVISOPREVIO>'+dtDataAviso+'</DTAVISOPREVIO> ';
	xmlFunc +='	<NOME>'+TxtNomeCol+'</NOME>	';
	xmlFunc +='	<CODPESSOA>'+CodPessoa+'</CODPESSOA>	';
	xmlFunc +='	<RESCISAOCALCULADA>1</RESCISAOCALCULADA>	';
	xmlFunc +='	<MEMBROCIPA>'+txtMembCipaCod+'</MEMBROCIPA>	';
	xmlFunc +='	<USASALCOMPOSTO>0</USASALCOMPOSTO>	';
	xmlFunc +='	<REGATUAL>1</REGATUAL>	';
	xmlFunc +=' <PERIODORESCISAO>4</PERIODORESCISAO>	';
	xmlFunc +='	<FGTSMESANTRECOLGRFP>0</FGTSMESANTRECOLGRFP>	';
	xmlFunc +='	<REPOEVAGA>N</REPOEVAGA>	';
	xmlFunc +='	<RESCISAOPRECISARECALC>0</RESCISAOPRECISARECALC>	';
	xmlFunc +='	<CODSECAO>'+txtCodSecaoOri+'</CODSECAO>	';
	xmlFunc +='	<CODCATEGORIA>'+CodCategoria+'</CODCATEGORIA>	';
	xmlFunc +='	<TIPOREDUCAOAVISO>0</TIPOREDUCAOAVISO>	';
	xmlFunc +='	<FORMAREDUCAOAVISO>0</FORMAREDUCAOAVISO>	';
	xmlFunc +='	<APMISTO>0</APMISTO>	';
	xmlFunc +='	<CARREGOUAVISOPREVIO>0</CARREGOUAVISOPREVIO>	';
	xmlFunc +='	<CODTIPO>'+CodTipo+'</CODTIPO>	';
	xmlFunc +='	<CODSINDICATO>'+txtCodSindicato+'</CODSINDICATO>	';
	xmlFunc +='	<CODRECEBIMENTO>'+CODRECEBIMENTO+'</CODRECEBIMENTO>	';
	xmlFunc +='	<NROFICHAREG>'+NROFICHAREG+'</NROFICHAREG>	';
	xmlFunc +='	<CODFUNCAO>'+txtCodFuncao+'</CODFUNCAO>	';
	//xmlFunc +='	<SALARIO>'+txtSalOrigem+'</SALARIO>	';
	//xmlFunc +='	<CODCATEGORIAESOCIAL>101</CODCATEGORIAESOCIAL>	';
	xmlFunc +='	<LANCASALDOFGTSRESCISAO>true</LANCASALDOFGTSRESCISAO>	';
	xmlFunc +='	<TEMATENDENTEATIVO>false</TEMATENDENTEATIVO>	';
	xmlFunc +='	<TEMPENDENCIALIVROS>false</TEMPENDENCIALIVROS>	';
	xmlFunc +='	<TEMLICENCARHU>true</TEMLICENCARHU>	';
	xmlFunc +='	<TEMLICENCAPATRIMONIO>true</TEMLICENCAPATRIMONIO>	';
	xmlFunc +='	</PFunc>	';
	
	
	var CONNECT = DatasetFactory.getDataset("ds_connector", null, null, null);
	var USUARIO = CONNECT.getValue(0,"INTEGRADOR");
	var SENHA = CONNECT.getValue(0, "SENHA");
	var NOME_SERVICO = "WSDATASERVER";
	var CAMINHO_SERVICO = "com.totvs.WsDataServer";
	var servico = ServiceManager.getServiceInstance(NOME_SERVICO);
	var serviceHelper = servico.getBean();
	var instancia = servico.instantiate(CAMINHO_SERVICO);
	var ws = instancia.getRMIwsDataServer();
	var authenticatedService = serviceHelper.getBasicAuthenticatedClient(ws, "com.totvs.IwsDataServer", USUARIO, SENHA); 

	var xml = xmlFunc;
	log.info("@incluiPJ diz: XML: " + xml);

	try
	{
		var result = authenticatedService.saveRecordEmail('FopRescisaoData', xml , 'CODCOLIGADA=1;CODSISTEMA=P',"suportesoter@consultoriainterativa.com.br");


		if ((result != null) && (result.indexOf("===") != -1))
		{
			var msgErro = result.substring(0, result.indexOf("==="));

			throw msgErro;

		}
		else
		{
		}
	}
	catch (e)
	{
		if (e == null)
		{
			e = "Erro desconhecido; verifique o log do AppServer";
		}

		var mensagemErro = "Erro na comunicação com o TOTVS TBC FUNC: " + e;
		log.error(mensagemErro + " ---> " + xml);

		throw mensagemErro;
	}
	}
	
}
function VerifHierarquia(){
	var codGestor = hAPI.getCardValue('codGestor');
	var codDiretor = hAPI.getCardValue('codDiretor');
	var Solicitante = hAPI.getCardValue('cpLoginFluig');
	var retorno;
	
	if(codDiretor==Solicitante){
		retorno=1;
	}else if(Solicitante==codGestor && codDiretor!=""){
		retorno=2;
	}else if(codDiretor==codGestor && codDiretor==""){
		retorno=1;
	}else{
		retorno=3;
	}
	return retorno;
}


function AprovaGestor(){
	var Aprovacao = hAPI.getCardValue('cpAprovacaoGestor');
	var codGestor = hAPI.getCardValue('codGestor');
	var codDiretor = hAPI.getCardValue('codDiretor');
	var retorno;
	if(AprovacaoGestor=="1"){
		if(codDiretor!=codGestor && codDiretor!=""){
			retorno=1;
		}
		else if(codDiretor==codGestor || codDiretor==""){
			retorno=2;
		}
	}else{
		retorno=3;
	}
	return retorno;
}

function AprovaDiretor(){
	var Aprovacao = hAPI.getCardValue('cpAprovacaoDiretor');
	var retorno;
	if(AprovacaoGestor=="1"){
		retorno=1;
	}else{
		retorno=2;
	}
	return retorno;
}

function AprovaRH(){
	var Aprovacao = hAPI.getCardValue('cpAprovacaoRH');
	var retorno;
	if(AprovacaoGestor=="1"){
		retorno=1;
	}else{
		retorno=2;
	}
	return retorno;
}

function AprovaKit(){
	var Aprovacao = hAPI.getCardValue('cpAprovacaoKit');
	var retorno;
	if(AprovacaoGestor=="1"){
		retorno=1;
	}else{
		retorno=2;
	}
	return retorno;
}
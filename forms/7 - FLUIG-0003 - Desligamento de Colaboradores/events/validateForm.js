/*

GESTOR - 7

DIRETOR - 8

CORREÇÃO - 41

ADMISSAO - 74

VALIDA KIT - 97

GERAR KIT - 89

*/

function validateForm(form) {

      var atividade = getValue("WKNumState");
      var funcao = form.getValue('cpFuncao');
      var acaoUsuario = getValue("WKCompletTask");
      var Errors = [];

      function validaAprovacao(aprovacao, parecer) {

            if (form.getValue(aprovacao) == 0) {

                  Errors.push('Aprovação não preenchida');
            }
            if (form.getValue(aprovacao) == 2 && form.getValue(parecer) == '') {

                  Errors.push('Parecer não prenchido');
            }
      }
      function validaVazio(campo, mensagem) {

            if (form.getValue(campo) == '') {

                  Errors.push(mensagem);
            }
      }
      function validaNotSelected(campo, mensagem) {

            if (form.getValue(campo) == '') {

                  Errors.push(mensagem);
            }
      }
      var getDtConvertida = function (campo) {

            var dtArray = String(form.getValue(campo)).split('/');

            return new Date(dtArray[2], dtArray[1] - 1, dtArray[0]);
      };

      var DataDemissao = form.getValue("DataDemissao");



      if (DataDemissao != "") {
            var d = DataDemissao.substring("0", "2");
            var m = DataDemissao.substring("4", "5");
            var y = DataDemissao.substring("6", "10");

            if (m < 10) m = '0' + m;
            if (d < 10) d = '0' + d;
            var Demissao = new Date(y + '/' + m + '/' + d);
      }

      var DataAviso = form.getValue("DataAviso");
      if (DataAviso != "") {
            var dA = DataAviso.substring("0", "2");
            var mA = DataAviso.substring("4", "5");
            var yA = DataAviso.substring("6", "10");

            if (mA < 10) mA = '0' + mA;
            if (dA < 10) dA = '0' + dA;
            var Aviso = new Date(yA + '/' + mA + '/' + dA);
      }

      validaVazio('Empresa', 'Empresa');
      validaVazio('CentroCC', 'Centro de Custo');
      validaVazio('NomeColaborador', 'Nome do Colaborador');
      validaVazio('DatadaAdmissao', 'Data Admissão');
      validaVazio('CargoCol', 'Cargo');
      validaVazio('MatriculaCod', 'Matrícula');
      validaVazio('Gestor', 'Gestor');
      validaVazio('MotiDesligamento', 'Motivo de Desligamento');
      validaVazio('DataDemissao', 'Data de Demissão');
      validaVazio('EPIEPC', 'Possui ficha EPI/EPC');
      validaVazio('DPCentral', 'Enviou ao DP Central');

      var tipoDesligamentoSelect = form.getValue("cpTipoDesligamentoSelect");

      if (tipoDesligamentoSelect == "") {
            Errors.push("O campo 'Tipo de Desligamento' é obrigatório.");

      } else if (tipoDesligamentoSelect == "outros") {
            // Se for "Outros", o campo de texto do zoom (TipoDesligamento) também se torna obrigatório
            if (form.getValue("TipoDesligamento") == "") {
                  Errors.push("Você selecionou 'Outros' para o Tipo de Desligamento. Por favor, utilize a busca para selecionar o tipo específico.");
            }
      }

      //gestor

      if ((atividade == 0 || atividade == 1 || atividade == 41) && (acaoUsuario == "true")) {

            // Valida se a Data de Desligamento é anterior à Data de Aviso
            if (Demissao != "" && Aviso != "") {
                  if (Demissao < Aviso) {

                        Errors.push('A Data de Desligamento não pode ser anterior a Data de Aviso.');
                  }
            }

            var tipoDesligamentoSelect = form.getValue("cpTipoDesligamentoSelect");

            // Valida o 'Tipo de Aviso' e 'Data de Aviso' originais APENAS se 'Outros' for selecionado
            if (tipoDesligamentoSelect == "outros") {

                  validaVazio('TpAviso', 'O campo "Tipo de Aviso" é obrigatório quando "Outros" é selecionado.');

                  if (form.getValue("TpAviso") != "5" && form.getValue("TpAviso") != "") {
                        validaVazio('DataAviso', 'O campo "Data do Aviso" é obrigatório para este Tipo de Aviso.');
                  }

            }

            // Valida os novos campos de Aviso (Indenizado ou Trabalhado)
            if (tipoDesligamentoSelect == "2" || tipoDesligamentoSelect == "V") {

                  // Verifica se a flag "Tem Aviso Prévio Indenizado" está marcada
                  if (form.getValue("TemAvisoPrevioIndenizado") == "on") {
                        // Valida campos Indenizados
                        validaVazio('DataInicioAvisoIndenizado', 'O campo Data de Início do Aviso Indenizado é obrigatório.');
                        validaVazio('DiasAvisoIndenizado', 'O campo Dias de Aviso Indenizado é obrigatório.');
                  } else {
                        // Valida campos Trabalhados
                        validaVazio('DataInicioAvisoTrabalhado', 'O campo Data Início Aviso Trabalhado é obrigatório.');
                        validaVazio('DiasAvisoTrabalhado', 'O campo Dias de Aviso Trabalhado é obrigatório.');
                  }
            }

            // Valida Pedido de Demissão (4)
            if (tipoDesligamentoSelect == "4") {
                  // Verifica se o checkbox "DescontaAvisoPrevio" está marcado
                  if (form.getValue("DescontaAvisoPrevio") == "on") {
                        // Valida o campo "DiasAvisoIndenizado"
                        validaVazio('DiasAvisoIndenizado', 'O campo "Dias de Aviso Indenizado" é obrigatório pois "Desconta Aviso Prévio" está marcado.');
                  }
            }

      }
      if (atividade == 7 && (acaoUsuario == "true")) { //GESTOR IMEDIATO

            validaAprovacao('cpAprovacaoGestor', 'cpParecercol');



      } else if (atividade == 8 && (acaoUsuario == "true")) { //GESTOR IMEDIATO EM ATRASO

            validaAprovacao('cpAprovacaoDiretor', 'cpParecerAprovaDiretor');



      } else if (atividade == 74 && (acaoUsuario == "true")) { //VALIDAR O KIT

            validaAprovacao('cpAprovacaoRH', 'cpParecerAprovaRH');

      }

      else if (atividade == 97 && (acaoUsuario == "true")) { //VALIDAR O KIT

            validaAprovacao('cpAprovacaoKit', 'cpParecerAprovaKit');



      } else if (atividade == 41 && (acaoUsuario == "true")) { //VALIDAR O KIT

            validaAprovacao('cpReaberturaChamado', 'cpParecerReabertura');



      }



      if (Errors.length) {

            throw Errors[0];

      }









}


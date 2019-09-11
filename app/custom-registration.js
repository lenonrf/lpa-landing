	

	$(document).ready(function(){
		
		$("#form-cep").mask("99999-999");
		$("#form-birthdate").mask("99/99/9999");
	

		$('#contact-form').submit(function(event) {

			if(!cad_validateData()){
				return false;
			}

			cad_send();	
		    event.preventDefault();
		}); 


		// ------------------------------------------------------------


		var cad_send = function(){

			var data =  cad_getDataForm();
			$('#form-button').attr("disabled", true);

			$.post('http://loucosporamostras.com/api/user', cad_getDataForm())
				.done(function( data ) {
					
					var url = 'http://loucosporamostras.com/flow-init-page?user='+data.email;
					//ga('send', 'pageview', url);
				
					window.location.href = url;
				})
				.always(function() {

					var url = 'flow.html?user='+data.email;
					//ga('send', 'pageview', url);
				
					window.location.href = url;

					$('#form-button').attr("disabled", false);
				 });
		};


		var cad_getDataForm = function() {
			
			var data = {

				name: $('#form-name').val().trim(),
				email: $('#form-email').val().trim(),
				gender: $("#cad_form input[type='radio']:checked").val(),
				birthDate: $('#form-birthdate').val().trim(),
				address :{
					zipcode: $('#form-cep').val().trim()
				}
			};

			return data;
		};


		var cad_validateData = function(){

			var data = cad_getDataForm();
			var regexEmail = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			var regexName = /^[a-zA-z ,.'-]+$/i
			var regexCep = /^[0-9]{5}-[0-9]{3}$/;
			var regexBirthdate = /^\d\d?\/\d\d?\/\d\d\d\d$/;

			/*console.log(data, regexName.test(String(data.name)), 
				regexEmail.test(String(data.email)),
				regexBirthdate.test(String(data.birthDate)),
				regexCep.test(String(data.address.zipcode)));*/

			if(!regexName.test(String(data.name))){
				alert("Preencha o nome completo");
				return false;
			}

			if(!regexEmail.test(String(data.email))){
				alert("Corrija o email");
				return false;
			}

			if(!regexBirthdate.test(String(data.birthDate))){
				alert("Corrija a Data de Nascimento");
				return false;
			}

			if(!regexCep.test(String(data.address.zipcode))){
				alert("Corrija o CEP");
				return false;
			}

			return true;
		};


		var cad_showSuscessMessage = function(){

			$("#cad_content").css("background-color","rgb(121, 247, 166)");
			$('#cad_form').hide();
		    $("#cad_title").html("<span>Olá <b>"+$('#form-name').val().split(' ').slice(0, 1)+"</b>, bem vindo e parabéns !!!<span>");

		    $('#cad_message').show();
		    $("#cad_message").html("<span>Confira seu email <b>"+$('#form-email').val()+"</b> e ative seu cadastro, assim você podera receber sua amostra.</span>");
		};


	});
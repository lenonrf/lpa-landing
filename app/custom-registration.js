	

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

			cad_sendSurvey(data);

			$('#form-button').attr("disabled", true);
			data.birthDate = '';

			$.post('http://loucosporamostras.com/api/user', cad_getDataForm())
				.done(function( data ) {})
				.always(function() {

					var url = 'flow.html?user='+data.email;
					window.location.href = url;

					$('#form-button').attr("disabled", false);
				 });

				ga('send', 'event', 'cadastro', 'sucesso');
								
		};


		var cad_sendSurvey = function(data){

			var url = 'http://loucosporamostras.com/api/survey_adzpm?name={nome}&email={email}&gender={sexo}&dob={nascimento}&zipcode={cep}';

			var birthDateSurvey = data.birthDate.replace(new RegExp('/', 'g'), '-');

			url = url.replace('{nome}', data.name)
				.replace('{sexo}', (data.gender == 'H') ? 'M' : 'F')
				.replace('{email}', data.email)
				.replace('{nascimento}', birthDateSurvey)
				.replace('{cep}', data.address.zipcode)
				.replace(new RegExp(' ', 'g'), '%20');

			$.get(url, function(data) {
				console.log('RETURN', data);
    			ga('send', 'event', 'cadastro', 'survey', url);

    		});
		}


		var cad_getDataForm = function() {

			var birthDate = $('#form-birthdate').val().trim();
			var gender = $('input[name=cad_sexo]:checked').val();
			
			var data = {

				name: $('#form-name').val().trim(),
				email: $('#form-email').val().trim(),
				gender: gender,
				birthDate: birthDate,
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

			console.log(data, regexName.test(String(data.name)), 
				regexEmail.test(String(data.email)),
				regexBirthdate.test(String(data.birthDate)),
				regexCep.test(String(data.address.zipcode)));

			if(!regexName.test(String(data.name))){
				alert("Preencha o nome completo");
				return false;
			}

			if(!regexEmail.test(String(data.email))){
				alert("Corrija o email");
				return false;
			}

			//if(!regexBirthdate.test(String(data.birthDate))){
			//	alert("Corrija a Data de Nascimento");
			//	return false;
			//}

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

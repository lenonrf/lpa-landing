var flowDataRaw = {};
var flowDataItem = {
    index: 0
};


$(document).ready(function() {

    $.get('http://loucosporamostras.com/api/user/email/' + getUrlParameter('user'), function(data) {
        $('#flowTitle').html('Olá <span style="color: #58a4b0">' + data.name.split(' ').slice(0, 1) + '</span>, obrigado pelo seu cadastro, estamos quase lá !!! Para finalizar queremos mostrar algumas oportunidade que acreditamos que você vai gostar.');
    });



    $('#okButton').click(function() {

        ga('send', 'event', 'flow', 'init', getUrlParameter('user'));

        $.get('http://loucosporamostras.com/api/myhall?affcode=lpa&user=' + getUrlParameter('user'), function(data) {

            flowDataRaw = data.questionHall;
            console.log('data', data);
            console.log('flowDataRaw', flowDataRaw);
            setFlowDataItem(0);

            $('#amostrasPic').hide();
            $('#amostrasContent').show();
            $('#barFlow').show();
            $('body').css('background-color', '#e2e5e9');
            $('#header-logo').css('background-color', '#FFF');

            flow_loadBar(getFlowPercentage());

        });
    });



    $(document).on('click', 'input[name=answerRadio]:radio', function() {

        if (flowDataItem.answerList[this.value].action.type == 'delivery') {

            $('#botaoContinuar').attr("disabled", true);


                console.log('check 1', (!flowDataRaw[flowDataItem.index + 1]));
			    if (!flowDataRaw[flowDataItem.index + 1]) {

			       	ga('send', 'event', 'flow', 'finish', getUrlParameter('user'));
			       	window.location.replace('http://blog.loucosporamostras.com/category/amostras-gratis');
			       	return null;
			    
			    }else{

			    	$('#amostrasContent').animate({
                		opacity: '1'
		            }, 0).animate({
		                opacity: '0.01'
		            }, 1500, function() {

		                console.log(flowDataItem);
		                window.open(flowDataItem.targetBlankUrl, '_blank');
		                setFlowDataItem(flowDataItem.index+1);

		            }).animate({
		                opacity: '1'
		            }, 500);
			    }
        }

        $('#botaoContinuar').attr("disabled", false);
        $("#botaoContinuar").attr('class', 'btn-primary');

    });



    $('#botaoContinuar').click(function() {

        if (!flowDataRaw[flowDataItem.index + 1]) {

            ga('send', 'event', 'flow', 'finish', getUrlParameter('user'));
            window.location.replace('http://blog.loucosporamostras.com/category/amostras-gratis');
            return null;
        
        }else{

			$('#amostrasContent').animate({
	            opacity: '1'
	        }, 0).animate({
	            opacity: '0.01'
	        }, 2500, function() {

	            setFlowDataItem(flowDataItem.index+1);
	            $('#botaoContinuar').attr("disabled", true);
	            $("#botaoContinuar").attr('class', 'btn');

	        }).animate({
	            opacity: '1'
	        }, 500);
        }
        
    });




    function setFlowDataItem(index) {

        if (!flowDataRaw) {
            return null;
        }

        flowDataItem = {

            index: index,

            title: flowDataRaw[index].mainQuestion.title,
            description: flowDataRaw[index].mainQuestion.description,
            answerList: flowDataRaw[index].mainQuestion.answerList,
            image: flowDataRaw[index].delivery.largeImage,
            targetBlankUrl: flowDataRaw[index].delivery.targetBlankUrl
        };

        $('#flowDataTitle').html(flowDataItem.title);
        $('#flowDataDescription').html(flowDataItem.description);
        $("#flowImage").attr("src", flowDataItem.image);
        $('#flowDataAnswerList').html('');

        var colorBackground = '';
        var colorText = '';
        var targetBlank = '';

        var radiosItems = '';

        $.each(flowDataItem.answerList, function(index, item) {

            colorBackground = (item.action.type == 'delivery') ? '#87ad1a' : '#d0d5db';
            colorText = (item.action.type == 'delivery') ? '#FFF' : '';

            radiosItems += '<div id="answerListMain"><label style="display:block; cursor: pointer; background: ' + colorBackground + '; color: ' + colorText + '; padding: 10px; margin-bottom: 20px;"><input type="radio" name="answerRadio" id="answerRadio_' + index + '" value="' + index + '">&nbsp;&nbsp;<b>' + item.answer + '</b></label></div>';
        });

        $('#flowDataAnswerList').append(radiosItems);
        flow_loadBar(getFlowPercentage());
    }



    function getFlowPercentage() {
        return (((flowDataItem.index + 1) * 100) / flowDataRaw.length).toFixed();
    }



    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    }


    function flow_setPercentageBar(percetage) {
        $('#barFlow').html('<div class="tipWrap"><span class="tip"></span></div><span class="fill" data-percentage="' + percetage + '"></span>');
    }


    function flow_loadBar(percetage) {

        flow_setPercentageBar(percetage);

        $('#barFlow').barfiller({

            barColor: '#58a4b0',
            tooltip: true,
            duration: 300,
            animateOnResize: false,
            symbol: "%"

        });
    }
});
//= require jquery
//= require jquery_ujs
//= require bootstrap-sprockets
//= require metronome-booth
//= require_self
$(document).ready(function(){

	$('#keyboard').each(function(){
		keyboard = $(this).width();
		keys = keyboard / 10;
		$(this).find('.keys .key').width(keys);
	});

/*
	var rc = $('#rc')[0];
	var rp = $('#rp')[0];
	var gc = $('#gc')[0];
	var gp = $('#gp')[0];
	var bc = $('#bc')[0];
	var bp = $('#bp')[0];
*/
	var yc = $('#yc')[0];
	var yp = $('#yp')[0];
	var wc = $('#wc')[0];
	var wp = $('#wp')[0];

	audio = $('#audio')[0];
	audio.addEventListener('canplaythrough', function(){
		$('#record').removeClass('disabled');
		$('#play').removeClass('disabled');
	}, false);
	audio.addEventListener('timeupdate', function(){
		$('.progress-bar').css('width', (audio.currentTime / audio.duration) * 100 + '%');
	}, false);
	audio.addEventListener('ended', function(){
		play();
		$('#submit').removeClass('disabled');
//		console.log(JSON.stringify(notes));
	}, false);

	$('#record').click(function(){
		$('#record').addClass('disabled');
		$('#stop').removeClass('disabled');
		$('#submit').addClass('disabled');
		notes = [];
		play();
	});
	$('#stop').click(function(){
		$('#stop').addClass('disabled');
		if(!jQuery.isEmptyObject(notes)){
			$('#play').removeClass('disabled');
			$('#submit').removeClass('disabled');
		}
		play();
	});
	$('#play').click(function(){
		$('#record').addClass('disabled');
		$('#stop').removeClass('disabled');
		$('#play').addClass('disabled');
		$('#submit').addClass('disabled');
		play();
	});

	audioContext = new AudioContext();
	timerWorker = new Worker('/metronomeworker.js');
	timerWorker.onmessage = function(e){
		if(e.data == 'tick')
			scheduler();
	};
	timerWorker.postMessage({
		'interval': lookahead
	});
	
	//modals
	function centerModals(){
		$('.modal').each(function(i){
			var $clone = $(this).clone().css('display', 'block').appendTo('body');
			var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
			top = top > 0 ? top : 0;
			$clone.remove();
			$(this).find('.modal-content').css("margin-top", top);
		});
	}
	$('.modal').on('show.bs.modal', centerModals);
	$(window).on('resize', centerModals);
	//modals

	$('#user').modal('show');
	$('#user form').on('ajax:success', function(e, data, status, xhr){
		console.log(xhr.responseText);
	});

	$('#audio').on('ended', function(){
		$('#done').modal('show');
	});
	$('#submit, #submitModal').click(function(){
		$.ajax({
			type: 'post',
			url: '/entries',
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify({ 'notes': notes}),
			success: function(data){
				$('#done').modal('hide');
				$('#kill').modal('show');
			}
		});
	});
	$('#kill').on('hidden.bs.modal', function(){
		$('#user').modal('show');
	});

});

$(document).keypress(function(e){
	if(isPlaying){
		e.preventDefault();
		notes.push({
			note: note,
			key: e.which
		});
		trigger(e.which);
//		console.log('note: ' + note + ', key: ' + e.which);
	}
});
$(document).keyup(function(e){
	if(isPlaying){
		e.preventDefault();
		if(e.which == 89 || e.which == 85 || e.which == 73 || e.which == 79 || e.which == 80){
			notes.push({
				note: note,
				key: e.which
			});
			trigger(e.which);
//			console.log('note: ' + note + ', key: ' + e.which);
		}
	}
});

function trigger(key){
//	console.log(key);
	switch(key){
		//red
		case 113://pan
			$('#yp').removeClass();
			$('#yp').addClass('red');
			$('#yp').show();
			$('#screen').children('video').not('#yp').hide();
			break;
		case 97://circle
			$('#yc').removeClass();
			$('#yc').addClass('red');
			$('#yc').show();
			$('#screen').children('video').not('#yc').hide();
			break;
		//green
		case 119://pan
			$('#yp').removeClass();
			$('#yp').addClass('green');
			$('#yp').show();
			$('#screen').children('video').not('#yp').hide();
			break;
		case 115://circle
			$('#yc').removeClass();
			$('#yc').addClass('green');
			$('#yc').show();
			$('#screen').children('video').not('#yc').hide();
			break;
		//blue
		case 101://pan
			$('#yp').removeClass();
			$('#yp').addClass('blue');
			$('#yp').show();
			$('#screen').children('video').not('#yp').hide();
			break;
		case 100://circle
			$('#yc').removeClass();
			$('#yc').addClass('blue');
			$('#yc').show();
			$('#screen').children('video').not('#yc').hide();
			break;
		//yellow
		case 114://pan
			$('#yp').removeClass();
			$('#yp').show();
			$('#screen').children('video').not('#yp').hide();
			break;
		case 102://circle
			$('#yc').removeClass();
			$('#yc').show();
			$('#screen').children('video').not('#yc').hide();
			break;
		//white
		case 116://pan
			$('#wp').show();
			$('#screen').children('video').not('#wp').hide();
			break;
		case 103://circle
			$('#wc').show();
			$('#screen').children('video').not('#wc').hide();
			break;
		case 121://off
			$('#blank').show();
			break;
		case 89://on
			$('#blank').hide();
			break;
		case 117://blind1on
			$('#b1').stop().fadeTo(10, 1);
			break;
		case 85://blind1off
			$('#b1').stop().fadeTo(500, 0);
			break;
		case 105://blind2on
			$('#b2').stop().fadeTo(10, 1);
			break;
		case 73://blind2off
			$('#b2').stop().fadeTo(500, 0);
			break;
		case 111://strobeOn
			$('#s1').stop().fadeTo(10, 1);
// 			strobeOn();
			break;
		case 79://strobeOff
			$('#s1').stop().fadeTo(10, 0);
// 			strobeOff();
			break;
		case 112://pause
			yc.pause();
			yp.pause();
			wc.pause();
			wp.pause();
			break;
		case 80://play
			yc.play();
			yp.play();
			wc.play();
			wp.play();
			break;
		default:
	}
}

function triggerBACKUP(key){
//	console.log(key);
	switch(key){
		//red
		case 113://pan
			$('#rp').css('z-index', '1');
			$('#screen').children('video').not('#rp').css('z-index', '-1');
			break;
		case 97://circle
			$('#rc').css('z-index', '1');
			$('#screen').children('video').not('#rc').css('z-index', '-1');
			break;
		//green
		case 119://pan
			$('#gp').css('z-index', '1');
			$('#screen').children('video').not('#gp').css('z-index', '-1');
			break;
		case 115://circle
			$('#gc').css('z-index', '1');
			$('#screen').children('video').not('#gc').css('z-index', '-1');
			break;
		//blue
		case 101://pan
			$('#bp').css('z-index', '1');
			$('#screen').children('video').not('#bp').css('z-index', '-1');
			break;
		case 100://circle
			$('#bc').css('z-index', '1');
			$('#screen').children('video').not('#bc').css('z-index', '-1');
			break;
		//yellow
		case 114://pan
			$('#yp').css('z-index', '1');
			$('#screen').children('video').not('#yp').css('z-index', '-1');
			break;
		case 102://circle
			$('#yc').css('z-index', '1');
			$('#screen').children('video').not('#yc').css('z-index', '-1');
			break;
		//white
		case 116://pan
			$('#wp').css('z-index', '1');
			$('#screen').children('video').not('#wp').css('z-index', '-1');
			break;
		case 103://circle
			$('#wc').css('z-index', '1');
			$('#screen').children('video').not('#wc').css('z-index', '-1');
			break;
		case 121://off
			$('#blank').css('z-index', 2);
			break;
		case 89://on
			$('#blank').css('z-index', 0);
			break;
		case 117://blind1on
			$('#b1').stop().fadeTo(10, 1);
			break;
		case 85://blind1off
			$('#b1').stop().fadeTo(500, 0);
			break;
		case 105://blind2on
			$('#b2').stop().fadeTo(10, 1);
			break;
		case 73://blind2off
			$('#b2').stop().fadeTo(500, 0);
			break;
		case 111://strobeOn
			$('#s1').stop().fadeTo(10, 1);
// 			strobeOn();
			break;
		case 79://strobeOff
			$('#s1').stop().fadeTo(10, 0);
// 			strobeOff();
			break;
		case 112://pause
			rc.pause();
			rp.pause();
			gc.pause();
			gp.pause();
			bc.pause();
			bp.pause();
			yc.pause();
			yp.pause();
			wc.pause();
			wp.pause();
			break;
		case 80://play
			rc.play();
			rp.play();
			gc.play();
			gp.play();
			bc.play();
			bp.play();
			yc.play();
			yp.play();
			wc.play();
			wp.play();
			break;
		default:
	}
}

//	STROBE
var strobe;
function strobeOn(){
	strobe = setInterval(function(){
		$('#s1').show(0).delay(250).hide(0);
	}, 500);
}
function strobeOff(){
	clearInterval(strobe);
	$('#s1').stop(true, true).hide(0);
}
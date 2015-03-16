//= require jquery
//= require jquery_ujs
//= require bootstrap-sprockets
//= require browser
//= require AudioContextMonkeyPatch
//= require metronome
//= require mediagroup
//= require_self

if($('#screen').length){
	var rc = $('#rc')[0];
	var rp = $('#rp')[0];
	var gc = $('#gc')[0];
	var gp = $('#gp')[0];
	var bc = $('#bc')[0];
	var bp = $('#bp')[0];
	var yc = $('#yc')[0];
	var yp = $('#yp')[0];
	var wc = $('#wc')[0];
	var wp = $('#wp')[0];
}

$(document).ready(function(){

	$('#keyboard').each(function(){
		keyboard = $(this).width();
		keys = keyboard / 10;
		$(this).find('.keys .key').width(keys);
	});

	if($('#screen').length){

		//browser
		console.log($.browser.name);
		if($.browser.name == 'safari'){
			alert('Sorry, this game is not compatible with Safari. Please use Chrome or Firefox to play.');
			window.location.replace('/');
		}
		//browser
	
		$('#screen').height(($('#screen').width() / 16) * 9);

		//$.synchronizeVideos(0, 'rc', 'rp', 'gc', 'gp', 'bc', 'bp', 'yc', 'yp', 'wc', 'wp');

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
			console.log(JSON.stringify(notes));
		}, false);
	
		$('#record').click(function(){
			$('#record').addClass('disabled');
			$('#stop').removeClass('disabled');
			$('#submit').addClass('disabled');
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
		$('#submit').click(function(){
			$.ajax({
				type: 'post',
				url: '/entries',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify({ 'notes': notes}),
				success: function(data){
					console.log(data);
					window.location = '/entries/' + data.id;
				}
			});
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
	
	}

	if($('#record').length){
		$(document).keypress(function(e){
			if(isPlaying){
				e.preventDefault();
				notes.push({
					note: note,
					key: e.which
				});
				trigger(e.which);
				console.log('note: ' + note + ', key: ' + e.which);
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
					console.log('note: ' + note + ', key: ' + e.which);
				}
			}
		});
	}

	$('.share').click(function(){
		var w = 560;
		var h = 560;
		var t = (screen.height / 2) - (h / 2);
		var l = (screen.width / 2) - (w / 2);
		var url = $(this).data('url');
		window.open(url, 'share', 'width='+w+', height='+h+', top='+t+', left='+l+', chrome=no, location=no, menubar=no, personalbar=no, resizable=no, scrollbars=no, status=no, toolbar=no');
	});

});

function trigger(key){
	console.log(key);
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
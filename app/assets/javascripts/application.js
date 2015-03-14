//= require jquery
//= require jquery_ujs
//= require bootstrap-sprockets
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

/*
$(document).on('sjs:allPlayersReady', function(event){
	$('#record').removeClass('disabled');
	$('#play').removeClass('disabled');
	console.log('sync');
});
*/

$(document).ready(function(){

	if($('#screen').length){
	
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
		case 114://pan
			$('#rp').css('z-index', '0');
			$('#screen').children('video').not('#rp').css('z-index', '-1');
			break;
		case 82://circle
			$('#rc').css('z-index', '0');
			$('#screen').children('video').not('#rc').css('z-index', '-1');
			break;
		//green
		case 103://pan
			$('#gp').css('z-index', '0');
			$('#screen').children('video').not('#gp').css('z-index', '-1');
			break;
		case 71://circle
			$('#gc').css('z-index', '0');
			$('#screen').children('video').not('#gc').css('z-index', '-1');
			break;
		//blue
		case 98://pan
			$('#bp').css('z-index', '0');
			$('#screen').children('video').not('#bp').css('z-index', '-1');
			break;
		case 66://circle
			$('#bc').css('z-index', '0');
			$('#screen').children('video').not('#bc').css('z-index', '-1');
			break;
		//yellow
		case 121://pan
			$('#yp').css('z-index', '0');
			$('#screen').children('video').not('#yp').css('z-index', '-1');
			break;
		case 89://circle
			$('#yc').css('z-index', '0');
			$('#screen').children('video').not('#yc').css('z-index', '-1');
			break;
		//white
		case 119://pan
			$('#wp').css('z-index', '0');
			$('#screen').children('video').not('#wp').css('z-index', '-1');
			break;
		case 87://circle
			$('#wc').css('z-index', '0');
			$('#screen').children('video').not('#wc').css('z-index', '-1');
			break;
		case 32://blind
			$('#blind-button').addClass('active');
			$('#blind').stop().fadeTo(10, 1);
			// $('#blind').fadeIn();
			break;
		case 83://strobe
			$('#strobe-button').addClass('active');
			// strobeOn();
			$('#strobe').show();
			break;
		default:
	}
}
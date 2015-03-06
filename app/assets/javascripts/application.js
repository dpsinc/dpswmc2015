//= require jquery
//= require jquery_ujs
//= require bootstrap-sprockets
//= require AudioContextMonkeyPatch
//= require metronome
//= require synchronize-min
//= require mediagroup
//= require_self

if($('#screen')){
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

$(document).on('sjs:allPlayersReady', function(event){
	$('#record').removeClass('disabled');
	$('#play').removeClass('disabled');
	console.log('sync');
});

$(document).ready(function(){

	if($('#screen')){
	
		$('#screen').height(($('#screen').width() / 16) * 9);

		$.synchronizeVideos(0, 'rc', 'rp', 'gc', 'gp', 'bc', 'bp', 'yc', 'yp', 'wc', 'wp');

		audio = $('#audio')[0];
		audio.addEventListener('canplaythrough', function(){
			$('#record').removeClass('disabled');
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
			$('#record').addClass('btn-default');
			$('#record').removeClass('btn-danger');
			$('#record').text('Stop');
			//$('#submit').addClass('disabled');
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
		$('#play').click(function(){
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
			$('#rp').show();
			$('#screen').children('video').not('#rp').hide();
			break;
		case 82://circle
			$('#rc').show();
			$('#screen').children('video').not('#rc').hide();
			break;
		//green
		case 103://pan
			$('#gp').show();
			$('#screen').children('video').not('#gp').hide();
			break;
		case 71://circle
			$('#gc').show();
			$('#screen').children('video').not('#gc').hide();
			break;
		//blue
		case 98://pan
			$('#bp').show();
			$('#screen').children('video').not('#bp').hide();
			break;
		case 66://circle
			$('#bc').show();
			$('#screen').children('video').not('#bc').hide();
			break;
		//yellow
		case 121://pan
			$('#yp').show();
			$('#screen').children('video').not('#yp').hide();
			break;
		case 89://circle
			$('#yc').show();
			$('#screen').children('video').not('#yc').hide();
			break;
		//white
		case 119://pan
			$('#wp').show();
			$('#screen').children('video').not('#wp').hide();
			break;
		case 87://circle
			$('#wc').show();
			$('#screen').children('video').not('#wc').hide();
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
//= require jquery
//= require jquery_ujs
//= require bootstrap-sprockets
//= require AudioContextMonkeyPatch
//= require metronome
//= require soundmanager2
//= require PxLoader
//= require PxLoaderImage
//= require PxLoaderSound
//= require PxLoaderVideo
//= require_self

if($('#screen')){
	var w = $('#white')[0];
	var r = $('#red')[0];
	var g = $('#green')[0];
	var b = $('#blue')[0];
	var y = $('#yellow')[0];
}

$(document).ready(function(){

	if($('#screen')){
	
		$('#screen').height(($('#screen').width() / 16) * 9);

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

	$('.share').click(function(){
		var w = 560;
		var h = 560;
		var t = (screen.height / 2) - (h / 2);
		var l = (screen.width / 2) - (w / 2);
		var url = $(this).data('url');
		window.open(url, 'share', 'width='+w+', height='+h+', top='+t+', left='+l+', chrome=no, location=no, menubar=no, personalbar=no, resizable=no, scrollbars=no, status=no, toolbar=no');
	});

});

if($('#record').length){
	$(document).keydown(function(e){
		if(isPlaying){
			e.preventDefault();
			notes.push({
				note: note,
				key: e.which
			});
			trigger(e.which);
			//console.log('note: ' + note + ', key: ' + e.which);
		}
	});
}

function trigger(key){
	console.log(key);
	switch(key){
		case 87://white
			$('#screen').children('video').hide();
			$('#white').show();
			break;
		case 82://red
			$('#screen').children('video').hide();
			$('#red').show();
			break;
		case 71://green
			$('#screen').children('video').hide();
			$('#green').show();
			break;
		case 66://blue
			$('#screen').children('video').hide();
			$('#blue').show();
			break;
		case 89://yellow
			$('#screen').children('video').hide();
			$('#yellow').show();
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
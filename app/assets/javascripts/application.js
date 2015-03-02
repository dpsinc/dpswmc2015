//= require jquery
//= require jquery_ujs
//= require bootstrap-sprockets
//= require_tree .

var w = $('#white')[0];
var r = $('#red')[0];
var g = $('#green')[0];
var b = $('#blue')[0];
var y = $('#yellow')[0];

$(document).ready(function(){

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
		console.log(JSON.stringify(notes));
	}, false);

	$('#record').click(function(){
		$(this).addClass('btn-default');
		$(this).removeClass('btn-danger');
		$(this).text('Stop');
		play();
	});

	audioContext = new AudioContext();

	timerWorker = new Worker('/assets/metronomeworker.js');
	timerWorker.onmessage = function(e){
		if(e.data == 'tick')
			scheduler();
	};
	timerWorker.postMessage({
		'interval': lookahead
	});

});

$(document).keydown(function(e){

	e.preventDefault();

	notes.push({
		note: note,
		key: e.which
	});
	console.log('note: ' + note + ', key: ' + e.which);

	switch(e.which){
		case 87://white
			$('#preview').children('video').hide();
			$('#white').show();
			break;
		case 82://red
			$('#preview').children('video').hide();
			$('#red').show();
			break;
		case 71://green
			$('#preview').children('video').hide();
			$('#green').show();
			break;
		case 66://blue
			$('#preview').children('video').hide();
			$('#blue').show();
			break;
		case 89://yellow
			$('#preview').children('video').hide();
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

});

function trigger(key){
	console.log(key);
}
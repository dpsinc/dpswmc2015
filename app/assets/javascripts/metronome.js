var audioContext = null;
var isPlaying = false;      // Are we currently playing?
var startTime;              // The start time of the entire sequence.
var current16thNote;        // What note is currently last scheduled?
var tempo = 120.0;          // tempo (in beats per minute)
var lookahead = 25.0;       // How frequently to call scheduling function (in milliseconds)
var scheduleAheadTime = 0.1;// How far ahead to schedule audio (sec). This is calculated from lookahead, and overlaps with next interval (in case the timer is late)
var nextNoteTime = 0.0;     // when the next note is due.
var noteResolution = 0;     // 0 == 16th, 1 == 8th, 2 == quarter note
var noteLength = 0.00;      // length of "beep" (in seconds)
var canvas					// the canvas element
var canvasContext;          // canvasContext is the canvas' context 2D
var last16thNoteDrawn = -1; // the last "box" we drew on the screen
var notesInQueue = [];      // the notes that have been put into the web audio, and may or may not have played yet. {note, time}
var timerWorker = null;     // The Web Worker used to fire timer messages
var audio;
var video;
var note = 0;
var notes = [];

//

window.requestAnimFrame = (function(){
	return 
		window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame || 
		window.oRequestAnimationFrame || 
		window.msRequestAnimationFrame || 
    function(callback){
		window.setTimeout(callback, 1000 / 60);
	};
})();

function nextNote(){
	var secondsPerBeat = 60.0 / tempo;
	nextNoteTime += 0.25 * secondsPerBeat;
	note++;
	current16thNote++;
	if(current16thNote == 16){
		current16thNote = 0;
    }
    notes.map(function(n){
		if(n.note == note){
			trigger(n.key);
		}
	});
	//console.log(current16thNote);
}

function scheduleNote(beatNumber, time){
	notesInQueue.push({
	    note: beatNumber, 
	    time: time
	});
}

function scheduler(){
	while(nextNoteTime < audioContext.currentTime + scheduleAheadTime){
		scheduleNote(current16thNote, nextNoteTime);
		nextNote();
	}
}

function play(){
	isPlaying = !isPlaying;
	if(isPlaying){
		note = 0;
		current16thNote = 0;
		nextNoteTime = audioContext.currentTime;
		timerWorker.postMessage('start');
		audio.play();
		w.play();
		r.play();
		g.play();
		b.play();
		y.play();
		return 'Stop';
	}else{
		timerWorker.postMessage('stop');
		audio.pause();
		audio.currentTime = 0;
		w.pause();
		w.currentTime = 0;
		r.pause();
		r.currentTime = 0;
		g.pause();
		g.currentTime = 0;
		b.pause();
		b.currentTime = 0;
		y.pause();
		y.currentTime = 0;
		$('#screen').children('video').hide();
		$('#record').addClass('btn-danger');
		$('#record').removeClass('btn-default');
		$('#record').text('Record');
		return 'play';
	}
}
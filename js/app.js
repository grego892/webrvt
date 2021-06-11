let counter=0, count = 0, timer=0, stoptime = true, meterExists = false;

const loadButton = document.getElementById("loadButton");
const vtButton = document.getElementById("vtButton");
const stopButton = document.getElementById("stopButton");
const playButton = document.getElementById('playAllButton')
const testIntroAudio = new Audio('./audio/intros/INTRO.wav');
const testOutroAudio = new Audio('./audio/outros/OUTRO.wav');
const vtrackcut1 = document.getElementById('vtrack-cut1')

let myMeterElement = document.getElementById('audio-meter');



loadButton.addEventListener("click", loadVt);
vtButton.addEventListener("click", clickUpdates);
stopButton.addEventListener("click", stopButtonPressed);
playButton.addEventListener('click', playAll);

let currentTime = setInterval(() => {
    time()
},1000);

function loadVt() {
    if (meterExists) {
        location.reload();
    }
    waveCut1.load('./audio/outros/OUTRO.wav');
    waveCut2.load('./audio/intros/INTRO.wav');
    waveCut1.clearMarkers()
    waveVt.clearMarkers()
    count = 0;
    vtButton.disabled = false;
    playButton.disabled = false;
}

function clickUpdates() {
        switch(count) {
            case 0:
            // function click 1 here
                vtButtonStatus = "record";
                vtButton.innerHTML = "RECORD";
                vtButton.style.backgroundImage = 'linear-gradient(rgb(255, 0, 0), rgb(210, 0, 0))';
                waveCut1.play();
                stopButton.disabled = false;
                playButton.disabled = true;
            break;
            case 1:
            // function click 2 here
                vtButtonStatus = "play2";
                vtButton.innerHTML = "PLAY<br>CUT 2";
                vtButton.style.backgroundImage = 'linear-gradient(#43ff43, #018501)';
                stopButton.disabled = false;
                vtRecord();
            break;
            case 2:
            // function click 3 here
                cut2Play()
                stopButton.disabled = false;
            break;
            default:
            break;    
        }
        count = count<2?count+1:3;
}

//  VT RECORD/
function vtRecord() {
	var constraints = { audio: true, video:false }
	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		audioContext = new AudioContext();
		gumStream = stream;
		input = audioContext.createMediaStreamSource(stream);
		rec = new Recorder(input,{numChannels:1});
        startTimer();
		rec.record();
		// Audio Input Meter
		let meterNode = webAudioPeakMeter.createMeterNode(input, audioContext)
		webAudioPeakMeter.createMeter(myMeterElement, meterNode, {});
		meterExists = true;
        waveCut1currentTime = waveCut1.getCurrentTime()
        waveCut1.addMarker({
            id: 'cut1Marker',
            time: waveCut1currentTime
        });
	}).catch(function(err) {
		console.log(err)
	});
}

function cut2Play() {
    waveCut2.play();
    stopTimer();
}

function stopButtonPressed() {
	if (rec) {
        rec.stop();
        gumStream.getAudioTracks()[0].stop();
        rec.exportWAV(waveVtaudio);
        rec.clear();
        }
    waveCut1.stop();
    waveCut2.stop();
    waveVt.stop();
    stopTimer();
    playButton.disabled = false;
    waveVtcurrentTime = timer;
    testOutroAudio.currentTime = 0;
    vtButtonStatus = "vt";
    vtButton.innerHTML = "VOICE<br/>TRACK";
    vtButton.style.background = 'linear-gradient(#43ff43, #018501)';
    waveVt.addMarker({
        id: 'vtMarker',
        time: waveVtcurrentTime
        });
}

let waveVtaudio = function(blob) {
    URL = window.URL;
    const audioUrl = URL.createObjectURL(blob);
    waveVtaudio = new Audio(audioUrl);
    waveVt.load(waveVtaudio);
    return waveVtaudio;
}

function playAll(play) {
    
	waveCut1.play();
    setTimeout(() => { waveVt.play(); }, waveCut1currentTime*1000);
    setTimeout(() => { waveCut2.play(); }, (waveVtcurrentTime*1000)+(waveCut1currentTime*1000));
    playButton.disabled = false;
}

const waveCut1 = WaveSurfer.create({
    container: '#vtrack-cut1',
    waveColor: '#00FF00',
    progressColor: '#0000FF',
    height: 50,
    normalize: true,
    hideScrollbar: true,
    responsive: false,
    plugins: [
        WaveSurfer.markers.create({
        markers: []
        })
    ]
});

const waveVt = WaveSurfer.create({
    container: '#vtrack-vt',
    waveColor: '#FFFF00',
    progressColor: '#FFA500',
    height: 50,
    hideScrollbar: true,
    responsive: true,
    plugins: [
        WaveSurfer.markers.create({
        markers: []
        })
    ]
});


const waveCut2 = WaveSurfer.create({
    container: '#vtrack-cut2',
    waveColor: '#00FF00',
    progressColor: '#0000FF',
    height: 50,
    normalize: true,
    hideScrollbar: true,
    responsive: false
});

function time() {
    let date = new Date();
    let time = date.toLocaleTimeString();
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let day = date.toLocaleDateString('en-US');

    let d = new Date();
    let mm = d.getMonth() + 1;
    let dd = d.getDate();
    let yy = d.getFullYear();

    document.getElementById("currentTime").innerHTML = time;
    document.getElementById('currentDay').innerHTML = day;
    document.getElementById('logName').innerHTML = `Log Name: KBIU-FM-DA-${mm}-${dd}-${yy}`;
    document.getElementById('airDate').innerHTML = `Air Date: ${date.toLocaleDateString('en-US')}`;
}


function startTimer() {
  if (stoptime == true) {
      stoptime = false;
      timerCycle();
    }
}

function stopTimer() {
  if (stoptime == false) {
    stoptime = true;
    timer = counter*.01;
  }
}

function timerCycle() {
    if (stoptime == false) {
    counter = counter + 1;
    setTimeout("timerCycle()", 10);
  }
}
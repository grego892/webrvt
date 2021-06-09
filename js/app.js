URL = window.URL;
var gumStream, rec, input, createDownloadLink, waveCut1currentTime, waveVtcurrentTime, counter, x;
let meterExists = false;
var AudioContext = window.AudioContext;

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
playButton.addEventListener('click', playRecording);

let currentTime = setInterval(() => {
    time()
},1000);

function loadVt() {
    waveCut1.load('./audio/outros/OUTRO.wav');
    waveCut2.load('./audio/intros/INTRO.wav');
    waveVt.empty()
}

let count = 0;
function clickUpdates() {
        switch(count) {
            case 0:
            // function click 1 here
                console.log("vtButtonClicked");
                vtButtonStatus = "record";
                vtButton.innerHTML = "RECORD";
                vtButton.style.backgroundImage = 'linear-gradient(rgb(255, 0, 0), rgb(210, 0, 0))';
                waveCut1.play();
            break;
            case 1:
            // function click 2 here
                console.log("recordButtonClicked");
                vtButtonStatus = "play2";
                vtButton.innerHTML = "PLAY<br>CUT 2";
                vtButton.style.backgroundImage = 'linear-gradient(#43ff43, #018501)';
                vtRecord();
            break;
            case 2:
            // function click 3 here
                console.log("playCut2ButtonClicked");
                cut2Play()
            break;
            default:
            break;    
        }
        count = count<2?count+1:3;
}

//  VT RECORD/
function vtRecord() {
	console.log("recordButton clicked");
	var constraints = { audio: true, video:false }
	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		console.log("getUserMedia() success");
		audioContext = new AudioContext();
		gumStream = stream;
		input = audioContext.createMediaStreamSource(stream);
		rec = new Recorder(input,{numChannels:1});
        startTimer();
		rec.record();
		
		let myMeterElement = document.getElementById('audio-meter');
		let meterNode = webAudioPeakMeter.createMeterNode(input, audioContext)
		webAudioPeakMeter.createMeter(myMeterElement, meterNode, {});
		meterExists = true;
        const waveCut1currentTime = waveCut1.getCurrentTime()
        console.log(waveCut1currentTime);
        waveCut1.addMarker({
            time: waveCut1currentTime
        });
	}).catch(function(err) {
		console.log(err)
	});
}

function cut2Play() {
    waveCut2.play();
    stopTimer();
    console.log(counter);
}

function stopButtonPressed() {
	console.log("stopButton clicked");
	rec.stop();
	gumStream.getAudioTracks()[0].stop();
	rec.exportWAV(waveVtaudio);
    waveCut1.stop();
    waveCut2.stop();
    waveVt.stop();
    stopTimer();
    console.log("counter = : " + timer)
    waveVtcurrentTime = timer;
    testOutroAudio.currentTime = 0;
    vtButtonStatus = "vt";
    vtButton.innerHTML = "VOICE<br/>TRACK";
    vtButton.style.background = 'linear-gradient(#43ff43, #018501)';
    waveVt.addMarker({
        time: waveVtcurrentTime
        });
}

let waveVtaudio = function(blob) {
    console.log('waveVtaudio function')
    // const audioBlob = new Blob(audioChunks);
    const audioUrl = URL.createObjectURL(blob);
    waveVtaudio = new Audio(audioUrl);
    waveVt.load(waveVtaudio)
    return waveVtaudio;
}

function playRecording(play) {
	console.log('Play button pressed')
	waveCut1.play();
    waveVt.play();
    waveCut2.play();
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

var counter = 0;
var timer = 0;
var stoptime = true;
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
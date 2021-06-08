URL = window.URL;
var gumStream, rec, input, createDownloadLink;
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
                waveCut2.play()
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
		rec.record();
		
		let myMeterElement = document.getElementById('audio-meter');
		let meterNode = webAudioPeakMeter.createMeterNode(input, audioContext)
		webAudioPeakMeter.createMeter(myMeterElement, meterNode, {});
		meterExists = true;
	}).catch(function(err) {
		console.log(err)
	});
}

function stopButtonPressed() {
	console.log("stopButton clicked");
	rec.stop();
	gumStream.getAudioTracks()[0].stop();
	rec.exportWAV(waveVtaudio);
    waveCut1.stop()
    waveCut2.stop()
    waveVt.stop()
    testOutroAudio.currentTime = 0;
    vtButtonStatus = "vt";
    vtButton.innerHTML = "VOICE<br/>TRACK";
    vtButton.style.background = 'linear-gradient(#43ff43, #018501)';
    count=0;
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
	waveVt.play();
    waveCut1.play();
    waveCut2.play();
}

const waveCut1 = WaveSurfer.create({
    container: '#vtrack-cut1',
    waveColor: '#00FF00',
    progressColor: '#0000FF',
    height: 50,
    normalize: true,
    hideScrollbar: true,
    responsive: true
});

const waveVt = WaveSurfer.create({
    container: '#vtrack-vt',
    waveColor: '#FFFF00',
    progressColor: '#FFA500',
    height: 50,
    hideScrollbar: true,
    responsive: true
});

const waveCut2 = WaveSurfer.create({
    container: '#vtrack-cut2',
    waveColor: '#00FF00',
    progressColor: '#0000FF',
    height: 50,
    normalize: true,
    hideScrollbar: true,
    
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

const vtButton = document.getElementById("vtButton");
const stopButton = document.getElementById("stopButton");
const playButton = document.getElementById('playAllButton')
const testOutroAudio = new Audio('./audio/outros/OUTRO.wav');
let count = 0;

vtButton.addEventListener("click", clickUpdates);
stopButton.addEventListener("click", stopButtonPressed);
playButton.addEventListener('click', () => {
    audio.play();
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

setInterval(function() {
    time();
},1000);

function clickUpdates() {
        switch(count) {
            case 0:
            // function click 1 here
                console.log("vtButtonClicked");
                vtButtonStatus = "record";
                vtButton.innerHTML = "RECORD";
                vtButton.style.backgroundImage = 'linear-gradient(rgb(255, 0, 0), rgb(210, 0, 0))';
                playVtAudio();
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
                
            break;
            default:
            break;    
        }
        count = count<2?count+1:3;
}

function playVtAudio() {
    testOutroAudio.play();
}

let myMeterElement = document.getElementById('audio-meter');
let audioCtx = new window.AudioContext();

//  VT RECORD/
const recordAudio = () =>
new Promise(async resolve => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    let audioChunks = [];
 
    /** meter */
    let sourceNode = audioCtx.createMediaStreamSource(stream);
    let meterNode = webAudioPeakMeter.createMeterNode(sourceNode, audioCtx);
    webAudioPeakMeter.createMeter(myMeterElement, meterNode, {});
    audioCtx.resume();
    /** meter */

    mediaRecorder.addEventListener('dataavailable', event => {
    audioChunks.push(event.data);
    });

    const start = () => {
    audioChunks = [];
    mediaRecorder.start();
    };

    const stop = () =>
    new Promise(resolve => {
        mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        const play = () => audio.play();
        resolve({ audioChunks, audioBlob, audioUrl, play });
        });
        if (mediaRecorder.state === 'recording') {mediaRecorder.stop()};
        var track = stream.getTracks()[0];
        track.stop();
    });

    resolve({ start, stop });
});

let recorder;
let audio;

async function vtRecord() {
    if (!recorder) {
        recorder = await recordAudio();
}
recorder.start();
};

async function stopButtonPressed() {
    console.log("STOP BUTTON PRESSED")
    audio = await recorder.stop();
    testOutroAudio.pause();
    testOutroAudio.currentTime = 0;
    vtButtonStatus = "vt";
    vtButton.innerHTML = "VOICE<br/>TRACK";
    vtButton.style.background = 'linear-gradient(#43ff43, #018501)';
    count=0;
};


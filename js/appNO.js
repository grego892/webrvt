let testOutroAudio = new Audio('./audio/outros/OUTRO.wav');
let recorder;
let audio;
let count = 0; //this is clickUpdates count...need to rename

const vtButton = document.getElementById("vtButton");
const stopButton = document.getElementById("stopButton");
const playButton = document.getElementById('playAllButton')
const myMeterElement = document.getElementById('audio-meter');
const audioCtx = new window.AudioContext();

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
    },1000
);

function clickUpdates() {
    switch(count) {
        case 0:
            console.log("vtButtonClicked");
            vtButtonStatus = "record";
            vtButton.innerHTML = "RECORD";
            vtButton.style.backgroundImage = 'linear-gradient(rgb(255, 0, 0), rgb(210, 0, 0))';
            playVtCut1();
        break;
        case 1:
            console.log("recordButtonClicked");
            vtButtonStatus = "play2";
            vtButton.innerHTML = "PLAY<br>CUT 2";
            vtButton.style.backgroundImage = 'linear-gradient(#43ff43, #018501)';
            vtRecord();
        break;
        case 2:
            console.log("playCut2ButtonClicked");
            playCut2();
        break;
        default:
        break;    
    }
    count = count<2?count+1:3;
}

function playVtCut1() {
    testOutroAudio.play();
}

async function vtRecord() {
    if (!recorder) {
            recorder = await recordAudio();
    }
    recorder.start();
    };

 function playCut2() {
 }
    
//  VT RECORD/
const recordAudio = () =>
    new Promise(async resolve => {


        const stream = navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        let audioChunks = [];
    
        /** meter */
        let sourceNode = audioCtx.createMediaStreamSource(stream);
        let meterNode = webAudioPeakMeter.createMeterNode(sourceNode, audioCtx);
        webAudioPeakMeter.createMeter(myMeterElement, meterNode, {});
        audioCtx.resume();
        console.log('preparedddd')
        


        /** meter */



        const start = () => {
            audioChunks = [];
            mediaRecorder.addEventListener('dataavailable', event => {
            mediaRecorder.start();

            audioChunks.push(event.data);
        });
        };

        const stop = () => {
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
        };
    

        resolve({ prepareAudio, start, stop });
    });

async function prepareTheAudio(){
    prepare = await recorder.prepareAudio()
}




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
let testOutroAudio = new Audio('./audio/outros/OUTRO.wav');


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


// Let's try a record button
let reset = false
const vtButton = document.getElementById("vtButton");
const stopButton = document.getElementById("stopButton");
vtButton.addEventListener("click", clickUpdates(reset));
stopButton.addEventListener("click",() => {
    stopButtonPressed();
}
);



function clickUpdates() {
    let count = 0;
    let next = function() {
        if (reset === true) {count = 0}
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
            break;
            case 2:
            // function click 3 here
                console.log("playCut2ButtonClicked");
                vtButton.innerHTML = "VOICE<br/>TRACK";
            break;
            default:
            // function click 1 here
            console.log("All clicks are done.");
            break;    
        }
        count = count<3?count+1:3;
    }
    return next;
}

// Stop button


function stopButtonPressed() {
    testOutroAudio.pause();
    testOutroAudio.currentTime = 0;
    vtButtonStatus = "vt";
    vtButton.innerHTML = "VOICE<br/>TRACK";
    vtButton.style.background = 'linear-gradient(#43ff43, #018501)';
    reset=true;
    return reset;
};

// VT Section

function playVtAudio() {
    testOutroAudio.play();
}


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

let vtButtonStatus = "vt";
let vtButton = document.getElementById("vtButton");
vtButton.addEventListener("click", function(){
    if (vtButtonStatus === "vt") {
        vtButtonStatus = "record";
        vtButton.innerHTML = "RECORD";
        vtButton.style.backgroundImage = 'linear-gradient(rgb(255, 0, 0), rgb(210, 0, 0))';
    } else if (vtButtonStatus === "record") {
        vtButtonStatus = "play2";
        vtButton.innerHTML = "PLAY<br>CUT 2";
        vtButton.style.backgroundImage = 'linear-gradient(#43ff43, #018501)';
    } else {
        vtButtonStatus = "vt";
        vtButton.innerHTML = "VOICE<br/>TRACK";
    }
 });

// Stop button
let stopButton = document.getElementById("stopButton");
stopButton.addEventListener("click", function(){
    vtButtonStatus = "vt";
    vtButton.innerHTML = "VOICE<br/>TRACK";
    vtButton.style.background = 'linear-gradient(#43ff43, #018501)';
});
      const recordAudio = () =>
        new Promise(async resolve => {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const mediaRecorder = new MediaRecorder(stream);
          let audioChunks = [];

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

              mediaRecorder.stop();
            });

          resolve({ start, stop });
        });

      const sleep = time => new Promise(resolve => setTimeout(resolve, time));

      const recordButton = document.querySelector('.recordButton');
      const stopButton = document.querySelector('.stopButton');
      const playButton = document.querySelector('.PlayButton');

      let recorder;
      let audio;

      recordButton.addEventListener('click', async () => {
        if (!recorder) {
          recorder = await recordAudio();
        }
        recorder.start();
      });

      stopButton.addEventListener('click', async () => {
        audio = await recorder.stop();
      });

      playButton.addEventListener('click', () => {
        audio.play();
      });



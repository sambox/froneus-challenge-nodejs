const fs = require('fs').promises;
const express = require('express');
const app = express();
const port = 3000;
const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient();
const pathBase = '/transcriptor/api/';

app.get(pathBase + 'transcribe', (req, res) => {
    console.info("GET request to api/transcribe");
    transcribe().then(transcription => {
        res.status(200).send({ message: transcription });
    })
})

const transcribe = async () => {

    const fileName = './resources/audio_prueba.mp3';
    const file = await fs.readFile(fileName);
    const audioBytes = file.toString('base64');

    const audio = {
        content: audioBytes,
    };
    const config = {
        encoding: 'MP3',
        sampleRateHertz: 16000,
        languageCode: 'es-AR',
    };
    const request = {
        audio: audio,
        config: config,
    };

    const [response] = await client.recognize(request);
    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
    return transcription;
}

app.listen(port, () => console.info('NodeJs Server started n listening on port ' + port))

module.exports = {
    app
}
import { useState, useEffect, useRef } from 'react';
import axios from 'axios'

/* This is basically to convert whatever the user says into text to send transcript to AI  */

const fetchNextQuestion = async (transcript) => {
    try {
        const res = await axios.post('https://localhost:5000/api/ask/ai',
            { transcript },
            {
                headers: {
                    Authorization: `Bearer ${yourToken}`
                }
            }

        )

    }
    catch (err) {
        console.error('AI fetch error', err)
        return "Sorry couldn't generate a follow up"
    }
}
const VoiceToText = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef(null);


    /* Checking for browser support (Firefox and Safari don't support speech recognition using webSpeech API) */
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert('Speech recognition not supported in this browser');
            return;
        }

        /* Recogniser ki details fill in karna  */
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        /* ONly cares about the final result and not the inbetween words */
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            /* [0][0] because the transcript would have multiple alternatives(guesses of what the user may have spoken) but we would pick only the top one */
            const text = event.results[0][0].transcript;
            setTranscript(text);
            console.log("Transcribed Text:", text);
        };

        recognition.onerror = (event) => {
            console.error("Recognition error:", event.error);
        };

        recognitionRef.current = recognition;
    }, []);

    const startListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };



    return (
        <div className="p-4">
            <h2 className="font-bold text-lg mb-2">🎤 Voice to Text</h2>
            <div className="mb-2">
                <button onClick={startListening} disabled={isListening} className="bg-green-500 px-4 py-2 text-white rounded mr-2">
                    Start
                </button>
                <button onClick={stopListening} disabled={!isListening} className="bg-red-500 px-4 py-2 text-white rounded">
                    Stop
                </button>
            </div>
            <div className="bg-gray-100 p-3 rounded border border-gray-300 min-h-[60px]">
                {transcript || 'Speak something...'}
            </div>
        </div>
    );
};

export default VoiceToText;

import { useState, useEffect, useRef } from 'react';

const VoiceToText = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef(null);


    /*  */
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert('Speech recognition not supported in this browser');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
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

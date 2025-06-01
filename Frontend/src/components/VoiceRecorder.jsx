import { useState, useEffect, useRef } from 'react';

const VoiceRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const [isSupported, setIsSupported] = useState(true);

    /* As webspeech api doesn't run on safari/iphone devices */
    useEffect(() => {   
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setIsSupported(false);
            console.warn("Voice recording not supported on this device/browser.");
        }
    }, []);

    const startRecording = async () => {
        /* navigator.mediaDevices is basically mic permission */
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        /* MediaRecorder=Recording on */
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder
        const chunks = []
        mediaRecorder.ondataavailable = (event) => {
            chunks.push(event.data)
        }
        /* blob is basically a data type that is used to store video/image recordings from the browser which are not stored yet  */
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(chunks, { type: 'audio/wav' })
            setAudioBlob(audioBlob)
        }

        mediaRecorder.start()
        setIsRecording(true)
        console.log("Starting recording...")
    }

    const stopRecording = () => {
        mediaRecorderRef.current.stop()
        setIsRecording(false)
        console.log("Stopping recording...")
    }
    if (!isSupported) {
        return <p>Your device does not support voice recording. Please use a supported browser like Chrome.</p>;
    }
    return (
        <>
            <button onClick={startRecording}>Start Recording</button>
            <button onClick={stopRecording}>Stop Recording</button>
            {audioBlob && (
                <audio controls src={URL.createObjectURL(audioBlob)} />
            )}

        </>
    )

}
export default VoiceRecorder;
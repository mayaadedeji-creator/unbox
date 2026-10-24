import { useEffect, useRef, useState } from 'react';

const MAX_SECONDS = 60;

const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export default function VoiceMemoEditor({ value, onChange }) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState('');
  const recorderRef = useRef(null);
  const timerRef = useRef(null);

  // If the modal closes mid-recording, release the microphone and throw the take away.
  useEffect(
    () => () => {
      clearInterval(timerRef.current);
      const recorder = recorderRef.current;
      if (recorder && recorder.state === 'recording') {
        recorder.onstop = null;
        recorder.stop();
        recorder.stream.getTracks().forEach((t) => t.stop());
      }
    },
    []
  );

  const start = async () => {
    setError('');
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setError("This browser can't record audio.");
      return;
    }

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError('Microphone access was blocked. Allow it in your browser to record.');
      return;
    }

    const recorder = new MediaRecorder(stream);
    const chunks = [];
    const startedAt = Date.now();

    recorder.ondataavailable = (e) => {
      if (e.data.size) chunks.push(e.data);
    };
    recorder.onstop = () => {
      clearInterval(timerRef.current);
      stream.getTracks().forEach((t) => t.stop());
      setRecording(false);
      const duration = Math.round((Date.now() - startedAt) / 1000);
      const reader = new FileReader();
      reader.onload = () => onChange({ audio: reader.result, duration });
      reader.readAsDataURL(new Blob(chunks, { type: recorder.mimeType }));
    };

    recorderRef.current = recorder;
    recorder.start();
    setSeconds(0);
    setRecording(true);
    timerRef.current = setInterval(() => {
      const s = Math.floor((Date.now() - startedAt) / 1000);
      setSeconds(s);
      if (s >= MAX_SECONDS) recorder.stop();
    }, 250);
  };

  const stop = () => recorderRef.current?.stop();

  return (
    <div className="feature-stack voice-memo">
      {recording ? (
        <>
          <div className="voice-timer">
            <span className="voice-dot" /> {formatTime(seconds)} / {formatTime(MAX_SECONDS)}
          </div>
          <button type="button" className="voice-button is-recording" onClick={stop}>
            ■ Stop
          </button>
        </>
      ) : (
        <>
          {value.audio && <audio controls src={value.audio} className="voice-player" />}
          <button type="button" className="voice-button" onClick={start}>
            ● {value.audio ? 'Record again' : 'Start recording'}
          </button>
          <span className="feature-hint">Up to {MAX_SECONDS} seconds.</span>
        </>
      )}
      {error && <span className="feature-error">{error}</span>}
    </div>
  );
}

import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

function App() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Twoja przeglądarka nie wspiera rozpoznawania mowy.</span>;
  }

  const startListening = () => {
    if (listening) return; // ignoruj jeśli już słucha

    console.log("START");
    SpeechRecognition.startListening({
      continuous: true,
      language: "pl-PL",
    });
  };

  const stopListening = () => {
    if (!listening) return; // ignoruj jeśli już nie słucha

    console.log("STOP");
    SpeechRecognition.stopListening();

    //  AUTOZAPIS DO PLIKU TXT PO STOP
    saveToFile();
  };

  const saveToFile = () => {
    if (!transcript || transcript.trim() === "") {
      alert("Brak tekstu do zapisania.");
      return;
    }

    const blob = new Blob([transcript], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "mowa.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Rozpoznawanie mowy w React</h1>

      <p>Status: {listening ? " słucham..." : "nie słucham"}</p>

      <button onClick={startListening} disabled={listening} style={{ marginRight: "0.5rem" }}>
        Start (PL)
      </button>

      <button onClick={stopListening} disabled={!listening} style={{ marginRight: "0.5rem" }}>
        Stop
      </button>

      <button onClick={resetTranscript}>Wyczyść tekst</button>

      <h2>Tekst z mikrofonu:</h2>
      <textarea
        value={transcript}
        readOnly
        rows={8}
        cols={60}
        style={{ marginTop: "1rem", padding: "0.5rem" }}
      />
    </div>
  );
}

export default App;

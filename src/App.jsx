import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

function App() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  console.log("browserSupportsSpeechRecognition:", browserSupportsSpeechRecognition);
  console.log("listening:", listening);
  console.log("transcript:", transcript);

  if (!browserSupportsSpeechRecognition) {
    return <span>Twoja przeglądarka nie wspiera rozpoznawania mowy.</span>;
  }

  const startListening = () => {
    console.log("Kliknięto START");
    try {
      SpeechRecognition.startListening({
        continuous: true,
        language: "pl-PL",
      });
    } catch (e) {
      console.error("Błąd przy startListening:", e);
    }
  };

  const stopListening = () => {
    console.log("Kliknięto STOP");
    SpeechRecognition.stopListening();

    // 🔥 PO STOP – ZAPIS DO PLIKU TXT
    if (!transcript || transcript.trim() === "") {
      console.log("Brak tekstu do zapisania.");
      return;
    }

    const blob = new Blob([transcript], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "mowa.txt"; // nazwa pliku
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Rozpoznawanie mowy</h1>

      <p>Status: {listening ? " słucham..." : " nie słucham"}</p>
      <p>Wsparcie przeglądarki: {browserSupportsSpeechRecognition ? "TAK" : "NIE"}</p>

      <button onClick={startListening} style={{ marginRight: "0.5rem" }}>
        Start (PL)
      </button>
      <button onClick={stopListening} style={{ marginRight: "0.5rem" }}>
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

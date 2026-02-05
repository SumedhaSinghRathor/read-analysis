import Display from "./charts/Display";
import { ReadProvider } from "./context/readContext";

function App() {
  return (
    <ReadProvider>
      <Display />
    </ReadProvider>
  );
}

export default App;

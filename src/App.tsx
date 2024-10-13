import { useState } from "react";
import Alert from "./components/Alert";
import Button from "./components/Button";

function App() {
  const [alertVisible, setAlertVisibility] = useState(false);

  return (
    <div>
      {alertVisible && (
        <Alert onClose={() => setAlertVisibility(false)}>
          <span>
            <strong>Holy guacamole!</strong> You should check in on some of
            those fields below.
          </span>
        </Alert>
      )}
      <Button color="primary" onClick={() => setAlertVisibility(true)}>
        Show Alert
      </Button>
    </div>
  );
}

export default App;

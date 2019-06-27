import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import { propOr } from "ramda";

import "./styles.css";

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [sheetId, setSheetId] = useState("");
  const [copied, setCopied] = useState(true);
  const outputRef = useRef(null);

  const processInput = () => {
    const getRows = propOr([], "rows");
    const rowIds = getRows(JSON.parse(input)).map(x => x.id);

    const result = {
      rowIds,
      to: {
        sheetId
      }
    };

    setOutput(JSON.stringify(result));
  };

  const copyOutput = () => {
    outputRef.current.select();
    document.execCommand("copy");
    setCopied(true);

    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="App">
      <h1>Smartsheet data-mover postman-generator</h1>
      <label htmlFor="sheet-id">Destination Sheet ID:</label>
      <input
        id="sheet-id"
        value={sheetId}
        onChange={e => setSheetId(e.target.value)}
        type="text"
      />
      <p>Run a report in postman and copy the response to this box:</p>
      <textarea
        id="postman-response"
        value={input}
        onChange={e => setInput(e.target.value)}
      />

      <p>
        <button onClick={processInput}>Create Output</button>
      </p>
      {true && (
        <div className="output">
          <p>Post this back to smartsheet at /sheets/sheetId/rows/move</p>
          <textarea
            value={output}
            className="report_result_box"
            onClick={copyOutput}
            id="postman-response"
            ref={outputRef}
          />
          <p className={"notice" + (copied ? " active" : "")}>
            Copied to clipboard
          </p>
          <p>
            Click inside the textarea to automatically copy the result to your
            clipboard
          </p>
        </div>
      )}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

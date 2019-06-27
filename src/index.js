import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import { propOr } from "ramda";

import "./styles.css";

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState({ rowIds: [], to: { sheetId: "" } });
  const [sheetId, setSheetId] = useState("");
  const [copied, setCopied] = useState(false);
  const outputRef = useRef(null);

  const processInput = (sheetId, input) => {
    setInput(input);
    setSheetId(sheetId);
    const getRows = propOr([], "rows");
    const rowIds = getRows(input ? JSON.parse(input) : "").map(x => x.id);

    const result = {
      rowIds,
      to: {
        sheetId
      }
    };

    setOutput(result);
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
        onChange={e => processInput(e.target.value, input)}
        type="text"
      />
      <p>Run a report in postman and copy the response to this box:</p>
      <textarea
        id="postman-response"
        value={input}
        onChange={e => processInput(sheetId, e.target.value)}
      />
      <div className="output">
        <p>Post this back to smartsheet at /sheets/sheetId/rows/move</p>
        <textarea
          value={JSON.stringify(output)}
          className="report_result_box"
          onClick={copyOutput}
          onChange={e => setOutput(e.target.value)}
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
        {output.rowIds.length > 0 && sheetId && (
          <p>
            This operation will move <strong>{output.rowIds.length}</strong>{" "}
            rows to <strong>{sheetId}</strong>
          </p>
        )}
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

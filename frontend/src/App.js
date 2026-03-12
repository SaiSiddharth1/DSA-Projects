import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Controls from "./components/Controls";
import TreeCanvas from "./components/TreeCanvas";
import {
  insertNode,
  deleteNode,
  preorder,
  inorder,
  postorder,
  treeHeight,
  applyRotation,
} from "./avl";

function App() {
  const [root, setRoot] = useState(null);
  const [history, setHistory] = useState([null]);
  const [histIndex, setHistIndex] = useState(0);
  const [lastSearch, setLastSearch] = useState(null);
  const [highlight, setHighlight] = useState(null);
  const [balanceEvent, setBalanceEvent] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [speed, setSpeed] = useState(800); // ms between rotation steps


  const animateSteps = (startRoot, finalRoot, steps) => {
    if (!steps || steps.length === 0) {
      applyFinal(finalRoot);
      return;
    }
    setAnimating(true);
    let curr = startRoot;
    let idx = 0;
    const interval = setInterval(() => {
      if (idx >= steps.length) {
        clearInterval(interval);
        applyFinal(finalRoot);
        setAnimating(false);
        return;
      }
      const step = steps[idx++];
      setBalanceEvent(`rotation ${step.type} at node ${step.value}`);
      curr = applyRotation(curr, step.value, step.type);
      setRoot(curr);
      setHighlight(step.value);
    }, speed);
  };

  const applyFinal = (finalRoot) => {
    setRoot(finalRoot);
    // update history
    const newHist = history.slice(0, histIndex + 1);
    newHist.push(finalRoot);
    setHistory(newHist);
    setHistIndex(newHist.length - 1);
  };

  const handleInsert = (value) => {
    if (animating) return;
    setBalanceEvent(null);
    const before = root;
    const steps = [];
    const newRoot = insertNode(root, value, (msg) => setBalanceEvent(msg), steps);
    animateSteps(before, newRoot, steps);
    setHighlight(value);
  };
  const handleDelete = (value) => {
    if (animating) return;
    setBalanceEvent(null);
    const before = root;
    const steps = [];
    const newRoot = deleteNode(root, value, (msg) => setBalanceEvent(msg), steps);
    animateSteps(before, newRoot, steps);
    setHighlight(value);
  };
  const handleSearch = (value) => {
    // simple search
    const found = searchNode(root, value);
    setLastSearch(found);
    setHighlight(found ? value : null);
    alert(found ? "Value found in tree" : "Value not found");
  };

  const searchNode = (node, value) => {
    if (!node) return false;
    if (value === node.value) return true;
    if (value < node.value) return searchNode(node.left, value);
    return searchNode(node.right, value);
  };

  const handleUndo = () => {
    if (animating || histIndex <= 0) return;
    const newIndex = histIndex - 1;
    setHistIndex(newIndex);
    setRoot(history[newIndex]);
  };

  const handleRedo = () => {
    if (animating || histIndex >= history.length - 1) return;
    const newIndex = histIndex + 1;
    setHistIndex(newIndex);
    setRoot(history[newIndex]);
  };

  const handleSpeedChange = (s) => {
    setSpeed(Number(s));
  };

  const traversal = {
    pre: preorder(root, []),
    in: inorder(root, []),
    post: postorder(root, []),
  };

  const height = treeHeight(root);

  // clear highlight after a short delay so it flashes
  useEffect(() => {
    if (highlight != null) {
      const t = setTimeout(() => setHighlight(null), 1200);
      return () => clearTimeout(t);
    }
  }, [highlight]);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "linear-gradient(180deg, #000, #222)" }}>
      <Navbar />
      <div style={{ flex: 1, display: "flex" }}>
        {/* left operations panel */}
        <div
          style={{
            width: "25%",
            borderRight: "1px solid #444",
            overflowY: "auto",
            background: "linear-gradient(180deg, #222, #111)",
            color: "#eee",
          }}
        >
          <Controls
            onInsert={handleInsert}
            onDelete={handleDelete}
            onSearch={handleSearch}
            traversal={traversal}
            height={height}
            searchResult={lastSearch}
            balanceEvent={balanceEvent}
            disabled={animating}
            onUndo={handleUndo}
            onRedo={handleRedo}
            undoDisabled={histIndex <= 0 || animating}
            redoDisabled={histIndex >= history.length - 1 || animating}
            speed={speed}
            onSpeedChange={handleSpeedChange}
          />
        </div>
        {/* right visualization panel */}
        <div
          style={{
            width: "70%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(180deg, #111, #000)",
          }}
        >
          <TreeCanvas root={root} highlight={highlight} />
        </div>
      </div>
    </div>
  );
}
export default App;
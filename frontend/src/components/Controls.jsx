import { useState } from "react";

function Controls({ onInsert, onDelete, onSearch, traversal, height, searchResult, balanceEvent, disabled, onUndo, onRedo, undoDisabled, redoDisabled, speed, onSpeedChange }) {
    const [value, setValue] = useState("");

    const handleInsert = () => {
        if (value === "") return;
        onInsert(Number(value));
        setValue("");
    };
    const handleDelete = () => {
        if (value === "") return;
        onDelete(Number(value));
        setValue("");
    };
    const handleSearch = () => {
        if (value === "") return;
        onSearch(Number(value));
    };

    return (
        <div
            style={
                { margin: "20px", display: "flex", flexDirection: "column", alignItems: "center" }
            }
        >
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "stretch", marginBottom: "10px" }}>
                <input
                    className="input"
                    type="number"
                    placeholder="Enter value"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    disabled={disabled}
                />
                <button onClick={handleInsert} disabled={disabled}>Insert</button>
                <button onClick={handleDelete} disabled={disabled}>Delete</button>
                <button onClick={handleSearch} disabled={disabled}>Search</button>
                <button onClick={onUndo} disabled={undoDisabled}>Undo</button>
                <button onClick={onRedo} disabled={redoDisabled}>Redo</button>
                <label>
                    Speed: <input type="range" min="100" max="5000" step="100" value={speed} onChange={(e) => onSpeedChange(e.target.value)} disabled={disabled} /> {speed}ms
                </label>
            </div>
            <div style={{ marginTop: "10px", textAlign: "center" }}>
                <div>Height: {height}</div>
                <div>Preorder: {traversal.pre.join(", ")}</div>
                <div>Inorder: {traversal.in.join(", ")}</div>
                <div>Postorder: {traversal.post.join(", ")}</div>
                {searchResult !== null && (
                    <div style={{ marginTop: "8px" }}>
                        Search: {searchResult ? "Found" : "Not found"}
                    </div>
                )}
                {balanceEvent && (
                    <div style={{ marginTop: "8px", color: "#b00" }}>
                        {balanceEvent}
                    </div>
                )}
                {disabled && (
                    <div style={{ marginTop: "8px", color: "#007" }}>
                        Animating rotations...
                    </div>
                )}
            </div>
        </div>
    );
}
export default Controls;

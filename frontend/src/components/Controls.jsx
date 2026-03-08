import { useState } from "react";

function Controls() {
    const [value, setValue] = useState("");
    return (
        <div
            style={
                { margin: "20px", display: "flex", justifyContent: "center", gap: "10px" }
            }
        >
            <input
                type="Number"
                placeholder="Enter value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <buttoon>Insert</buttoon>
            <buttoon>Delete</buttoon>
            <buttoon>Search</buttoon>
        </div>
    );
}
export default Controls;

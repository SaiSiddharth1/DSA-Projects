import React from "react";
import { balanceFactor } from "../avl";

// compute positions for each node for SVG rendering
function computePositions(node, depth = 0, indexRef = { value: 0 }, nodes = [], parent = null) {
    if (!node) return;
    computePositions(node.left, depth + 1, indexRef, nodes, node);
    const x = indexRef.value * 60 + 40; // horizontal spacing + margin
    const y = depth * 80 + 40; // vertical spacing + margin
    const bf = balanceFactor(node);
    nodes.push({ node, x, y, parent, bf });
    indexRef.value++;
    computePositions(node.right, depth + 1, indexRef, nodes, node);
    return nodes;
}

function TreeCanvas({ root, highlight }) {
    if (!root) {
        return (
            <div style={{ margin: "20px", textAlign: "center" }}>Tree is empty</div>
        );
    }

    const nodes = computePositions(root);
    const coordMap = new Map(nodes.map(n => [n.node, { x: n.x, y: n.y }]));
    const width = Math.max(500, nodes.reduce((m, n) => Math.max(m, n.x), 0) + 60);
    const height = Math.max(300, nodes.reduce((m, n) => Math.max(m, n.y), 0) + 60);

    return (
        <svg
            width={width}
            height={height}
            style={{ margin: "20px", background: "transparent" }}
        >
            {/* lines */}
            {nodes.map((n, idx) => {
                if (!n.parent) return null;
                const p = coordMap.get(n.parent);
                return (
                    <line
                        key={"line" + idx}
                        x1={p.x}
                        y1={p.y}
                        x2={n.x}
                        y2={n.y}
                        stroke="#333"
                        strokeWidth={2}
                        style={{ transition: "all 0.5s" }}
                    />
                );
            })}
            {/* nodes */}
            {nodes.map((n, idx) => {
                const isHighlighted = highlight === n.node.value;
                return (
                    <g key={"node" + idx} style={{ transition: "all 0.5s" }}>
                        <circle
                            cx={n.x}
                            cy={n.y}
                            r={20}
                            fill={isHighlighted ? "#ffe6e6" : "white"}
                            stroke={isHighlighted ? "red" : "#333"}
                            strokeWidth={isHighlighted ? 3 : 2}
                        />
                        <text
                            x={n.x}
                            y={n.y - 22}
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="bold"
                            fill="#555"
                            pointerEvents="none"
                        >
                            bf={n.bf}
                        </text>
                        <text
                            x={n.x}
                            y={n.y + 4}
                            textAnchor="middle"
                            fontSize="12"
                            pointerEvents="none"
                        >
                            {n.node.value}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}
export default TreeCanvas;
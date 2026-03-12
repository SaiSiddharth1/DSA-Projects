# AVL Tree Visualizer

A visual representation of AVL Tree operations.

## Tech Stack
- React JS (Frontend)
- Java Spring Boot (Backend)

## Features
- Insert node
- Delete node
- Display tree height
- Preorder, inorder and postorder traversals
- Direct diagonal parent‑child connectors in the visualization (SVG-based)
- Animated rotation steps: each balancing rotation is shown step‑by‑step with nodes moving and messages
- Adjustable animation speed via a slider (100–5000 ms)
- Undo/redo buttons allow stepping backwards and forwards through past tree states
- UI split into two panels (30% operations on left, 70% visualization on right)
- Textual messages when a node becomes unbalanced (especially on the right) and which rotation corrects it
- Dark gradient theme throughout and visualization panel without an outer box
- AVL rotations visualization
- Tree balancing animation

## Author
Sai Siddharth Kalavala

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
(which is a Spring Boot application) build using Maven:
```bash
cd backend
mvn spring-boot:run
```

Once both services are running you can open http://localhost:3000 in your browser to interact with the AVL tree visualizer.
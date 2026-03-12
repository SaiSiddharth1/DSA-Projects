// Simple AVL tree implementation with immutable insert/delete

export class AVLNode {
    constructor(value, left = null, right = null, height = 1) {
        this.value = value;
        this.left = left;
        this.right = right;
        this.height = height;
    }
}

function height(node) {
    return node ? node.height : 0;
}

function updateHeight(node) {
    if (!node) return 0;
    node.height = 1 + Math.max(height(node.left), height(node.right));
    return node.height;
}

export function balanceFactor(node) {
    if (!node) return 0;
    return height(node.left) - height(node.right);
}

function rotateRight(y) {
    const x = y.left;
    const T2 = x.right;

    // Perform rotation
    const newY = new AVLNode(y.value, T2, y.right);
    const newX = new AVLNode(x.value, x.left, newY);

    updateHeight(newY);
    updateHeight(newX);
    return newX;
}

function rotateLeft(x) {
    const y = x.right;
    const T2 = y.left;

    const newX = new AVLNode(x.value, x.left, T2);
    const newY = new AVLNode(y.value, newX, y.right);

    updateHeight(newX);
    updateHeight(newY);
    return newY;
}

function balance(node, onBalance, steps) {
    if (!node) return node;
    updateHeight(node);
    const bf = balanceFactor(node);

    // Left heavy
    if (bf > 1) {
        if (balanceFactor(node.left) < 0) {
            // LR case
            onBalance?.(`node ${node.value} unbalanced left-right; performing LR rotation`);
            steps?.push({ type: "LR", value: node.value });
            const newLeft = rotateLeft(node.left);
            node = new AVLNode(node.value, newLeft, node.right);
        } else {
            // LL case
            onBalance?.(`node ${node.value} unbalanced left-left; performing right rotation`);
            steps?.push({ type: "LL", value: node.value });
        }
        return rotateRight(node);
    }

    // Right heavy
    if (bf < -1) {
        onBalance?.(`node ${node.value} unbalanced on right side (bf=${bf})`);
        if (balanceFactor(node.right) > 0) {
            // RL case
            onBalance?.(`node ${node.value} requires RL rotation`);
            steps?.push({ type: "RL", value: node.value });
            const newRight = rotateRight(node.right);
            node = new AVLNode(node.value, node.left, newRight);
        } else {
            // RR case
            onBalance?.(`node ${node.value} performing left rotation`);
            steps?.push({ type: "RR", value: node.value });
        }
        return rotateLeft(node);
    }

    return node;
}

export function insertNode(node, value, onBalance, steps) {
    if (!node) return new AVLNode(value);
    if (value < node.value) {
        const newLeft = insertNode(node.left, value, onBalance, steps);
        node = new AVLNode(node.value, newLeft, node.right);
    } else if (value > node.value) {
        const newRight = insertNode(node.right, value, onBalance, steps);
        node = new AVLNode(node.value, node.left, newRight);
    } else {
        // duplicates not allowed
        return node;
    }
    return balance(node, onBalance, steps);
}

function minNode(node) {
    let current = node;
    while (current.left) current = current.left;
    return current;
}

export function deleteNode(node, value, onBalance, steps) {
    if (!node) return null;
    if (value < node.value) {
        const newLeft = deleteNode(node.left, value, onBalance, steps);
        node = new AVLNode(node.value, newLeft, node.right);
    } else if (value > node.value) {
        const newRight = deleteNode(node.right, value, onBalance, steps);
        node = new AVLNode(node.value, node.left, newRight);
    } else {
        // found the node
        if (!node.left) return node.right;
        if (!node.right) return node.left;
        // two children
        const successor = minNode(node.right);
        const newRight = deleteNode(node.right, successor.value, onBalance, steps);
        node = new AVLNode(successor.value, node.left, newRight);
    }
    return balance(node, onBalance, steps);
}

export function preorder(node, arr = []) {
    if (!node) return arr;
    arr.push(node.value);
    preorder(node.left, arr);
    preorder(node.right, arr);
    return arr;
}

export function inorder(node, arr = []) {
    if (!node) return arr;
    inorder(node.left, arr);
    arr.push(node.value);
    inorder(node.right, arr);
    return arr;
}

export function postorder(node, arr = []) {
    if (!node) return arr;
    postorder(node.left, arr);
    postorder(node.right, arr);
    arr.push(node.value);
    return arr;
}

export function treeHeight(node) {
    return height(node);
}

// helper allowing outside code to perform a single rotation step at a target value
export function applyRotation(root, targetValue, type) {
    if (!root) return null;
    // traverse and rebuild path
    if (targetValue < root.value) {
        const newLeft = applyRotation(root.left, targetValue, type);
        if (newLeft === root.left) return root;
        return new AVLNode(root.value, newLeft, root.right, root.height);
    } else if (targetValue > root.value) {
        const newRight = applyRotation(root.right, targetValue, type);
        if (newRight === root.right) return root;
        return new AVLNode(root.value, root.left, newRight, root.height);
    } else {
        // perform the requested rotation on this subtree, but guard against missing children
        switch (type) {
            case "LL":
                if (!root.left) return root;
                return rotateRight(root);
            case "RR":
                if (!root.right) return root;
                return rotateLeft(root);
            case "LR": {
                if (!root.left) return root;
                // left subtree must have a right child for LR rotation
                if (!root.left.right) return root;
                const nl = rotateLeft(root.left);
                const tmp = new AVLNode(root.value, nl, root.right);
                return rotateRight(tmp);
            }
            case "RL": {
                if (!root.right) return root;
                if (!root.right.left) return root;
                const nr = rotateRight(root.right);
                const tmp = new AVLNode(root.value, root.left, nr);
                return rotateLeft(tmp);
            }
            default:
                return root;
        }
    }
}

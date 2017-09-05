import { pickRandom } from "./utils";

export class Graph<T> {
    edges: Edge<T>[];
    nodes: Node<T>[];

    nodeMap: { [key: string]: Node<T> }
    edgeMap: { [key: string]: Edge<T> }

    constructor() {
        this.edges = [];
        this.nodes = [];
        this.nodeMap = {};
        this.edgeMap = {};
    }

    createNode(value: T, ...connectingNodes: Node<T>[]) {
        const n = new Node(value);
        this.addNode(n);
        connectingNodes.forEach(connectingNode => {
            if (connectingNode) {
                this.connect(connectingNode, n);
            }
        });
        return n;
    }

    connect(node1: Node<T>, node2: Node<T>) {
        const e = new Edge(node1, node2);
        this.addEdge(e);
        node1.edges.push(e);
        node2.edges.push(e);
        return e;
    }

    addNode(node: Node<T>) {
        this.nodes.push(node);
        this.nodeMap[node.id] = node;
    }

    addEdge(edge: Edge<T>) {
        this.edges.push(edge);
        this.edgeMap[edge.id] = edge;
    }
}

export class Node<T> {
    edges: Edge<T>[];
    value: T;
    id: string;

    private static sequenceId = 0;

    constructor(value: T, id: string = Node.generateId()) {
        this.value = value;
        this.id = id;
        this.edges = [];
    }

    static generateId(): string {
        return "Node" + Node.sequenceId++;
    }
}

export class Edge<T> {
    fromNode: Node<T>
    toNode: Node<T>
    id: string;

    private static sequentialId: number = 0;

    constructor(fromNode: Node<T>, toNode: Node<T>, id?: string) {
        this.fromNode = fromNode;
        this.toNode = toNode;
        this.id = id || Edge.generateId(fromNode, toNode);
    }

    private static generateId(n1: Node<any>, n2: Node<any>) {
        return `${Edge.sequentialId}|${n1.id}|${n2.id}`;
    }
}

export function createGrowingGraph() {
    const g = new Graph<XYS>();

    setInterval(() => {
        const connection = pickRandom(g.nodes);
        g.createNode({
            X: Math.random() * 640,
            Y: Math.random() * 480,
            S: Math.random() * 10
        }, connection);
    }, 599);

    return g;
}

export interface XYS {
    X: number;
    Y: number;
    S: number;
}
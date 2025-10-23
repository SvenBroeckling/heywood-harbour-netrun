
export enum NodeType {
  ENTRYPOINT = "Entry Point",
  PASSWORD = "Password",
  CONTROL_NODE = "Control Node",
  FILE = "File",
  BLACK_ICE = "Black ICE",
  BRANCH = "Branch Point"
}

export interface NodeData {
  id: number;
  level: number;
  gridX: number;
  gridY: number;
  type: NodeType;
  label: string;
  description: string;
  content: string;
  dv: number | null;
  connections: number[];
  revealed: boolean;
}

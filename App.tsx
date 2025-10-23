import React, { useState, useMemo } from 'react';
import { NET_ARCHITECTURE_DATA } from './constants';
import { type NodeData } from './types';
import NetNode from './components/NetNode';
import NodeDetail from './components/NodeDetail';
import { LogoIcon } from './components/Icons';

const App: React.FC = () => {
  const [architecture, setArchitecture] = useState<Record<number, NodeData>>(NET_ARCHITECTURE_DATA);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(1);

  const revealedNodeIds = useMemo(() => {
    // FIX: Add explicit type to `n` to resolve errors from `Object.values` returning `unknown[]`.
    return new Set(Object.values(architecture).filter((n: NodeData) => n.revealed).map((n: NodeData) => n.id));
  }, [architecture]);

  const handleNodeClick = (id: number) => {
    const node = architecture[id];
    if (!node) return;

    // A node is accessible if it's connected to any already revealed node.
    const isAccessible = node.connections.some(connId => revealedNodeIds.has(connId));

    if (isAccessible && !node.revealed) {
      setArchitecture(prev => ({
        ...prev,
        [id]: { ...prev[id], revealed: true },
      }));
    }
    setSelectedNodeId(id);
  };

  const selectedNode = selectedNodeId ? architecture[selectedNodeId] : null;

  const nodes = Object.values(architecture);

  return (
    <div className="h-screen w-screen bg-[#0d0d0d] text-cyan-400 flex flex-col">
      <header className="p-4 border-b-2 border-cyan-500/30 text-center relative flex items-center justify-center gap-4">
        <LogoIcon className="w-10 h-10 md:w-12 md:h-12 text-cyan-500" />
        <div>
          <h1 className="text-2xl md:text-4xl font-bold uppercase tracking-[0.2em] glitch" data-text="HEYWOOD HARBOUR">HEYWOOD HARBOUR</h1>
          <p className="text-xs md:text-sm text-cyan-600">Heywood Harbour Management Corp NET Architecture // DV 12</p>
        </div>
      </header>
      <main className="flex-grow flex flex-col md:flex-row overflow-hidden">
        <div className="flex-grow relative h-full w-full">
           <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {/* FIX: Add explicit type to `node` to resolve errors from `Object.values` returning `unknown[]`. */}
            {nodes.map((node: NodeData) =>
              node.connections.map(connId => {
                const targetNode = architecture[connId];
                if (!targetNode || node.id > connId) return null; // Avoid duplicate lines
                
                const isPathRevealed = node.revealed && targetNode.revealed;

                return (
                  <line
                    key={`${node.id}-${connId}`}
                    x1={`${node.gridX * 10}%`}
                    y1={`${node.gridY * 10}%`}
                    x2={`${targetNode.gridX * 10}%`}
                    y2={`${targetNode.gridY * 10}%`}
                    stroke={isPathRevealed ? "rgba(0, 255, 255, 0.7)" : "rgba(0, 139, 139, 0.2)"}
                    strokeWidth="2"
                    className="transition-all duration-500"
                  />
                );
              })
            )}
          </svg>
          {/* FIX: Add explicit type to `node` to resolve errors from `Object.values` returning `unknown[]`. */}
          {nodes.map((node: NodeData) => {
            const isAccessible = node.revealed || node.connections.some(connId => revealedNodeIds.has(connId));
            return (
              <NetNode
                key={node.id}
                node={node}
                onClick={handleNodeClick}
                isSelected={selectedNodeId === node.id}
                isAccessible={isAccessible}
              />
            );
          })}
        </div>
        <NodeDetail node={selectedNode} />
      </main>
    </div>
  );
};

export default App;


import React, { useState, useMemo, useRef, useLayoutEffect } from 'react';
import { NET_ARCHITECTURE_DATA } from './constants';
import { type NodeData } from './types';
import NetNode from './components/NetNode';
import NodeDetail from './components/NodeDetail';
import Controls from './components/Controls';
import { LogoIcon } from './components/Icons';

const initialArchitecture = (): Record<number, NodeData> => {
  const deepClone: Record<number, NodeData> = JSON.parse(JSON.stringify(NET_ARCHITECTURE_DATA));
  for (const node of Object.values(deepClone)) {
    node.revealed = node.id === 1;
  }
  return deepClone;
};

const App: React.FC = () => {
  const [architecture, setArchitecture] = useState<Record<number, NodeData>>(initialArchitecture);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(1);
  const [visibleNodeIds, setVisibleNodeIds] = useState<Set<number>>(new Set([1]));

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const centerOnNode = (nodeId: number | null) => {
    if (!containerRef.current || nodeId === null) return;
    
    const nodeToCenter = architecture[nodeId];
    if (!nodeToCenter) return;

    const container = containerRef.current;
    const { offsetWidth, offsetHeight } = container;
    
    if (offsetWidth === 0 || offsetHeight === 0) return;

    // Pannable area is 150% of the container
    const pannableWidth = offsetWidth * 1.5;
    const pannableHeight = offsetHeight * 1.5;

    // Node's center position in world coordinates (the pannable area)
    const nodeWorldX = pannableWidth * (nodeToCenter.gridX / 25); // 4/100 = 1/25
    const nodeWorldY = pannableHeight * (nodeToCenter.gridY / 25);
    
    // The transform functions are applied from right to left: scale then translate.
    // We want: (nodeWorldX * zoom) + newPanX = offsetWidth / 2
    // So: newPanX = (offsetWidth / 2) - (nodeWorldX * zoom)
    const newPanX = (offsetWidth / 2) - (nodeWorldX * zoom);
    const newPanY = (offsetHeight / 2) - (nodeWorldY * zoom);

    setPan({ x: newPanX, y: newPanY });
  };

  useLayoutEffect(() => {
    // This effect centers the view on the entrypoint node when the app loads.
    if (containerRef.current) {
        const container = containerRef.current;
        const { offsetWidth, offsetHeight } = container;

        // Guard against the container not having dimensions yet, which can happen on initial render.
        if (offsetWidth === 0 || offsetHeight === 0) {
            return;
        }

        const entryNode = NET_ARCHITECTURE_DATA[1];
        if (!entryNode) return;

        const initialZoom = 1;
        const pannableWidth = offsetWidth * 1.5;
        const pannableHeight = offsetHeight * 1.5;

        // Node's position in world space
        const nodeWorldX = pannableWidth * (entryNode.gridX / 25); // 4/100
        const nodeWorldY = pannableHeight * (entryNode.gridY / 25);

        // Calculate pan required to center the node at zoom 1
        const initialPanX = (offsetWidth / 2) - (nodeWorldX * initialZoom);
        const initialPanY = (offsetHeight / 2) - (nodeWorldY * initialZoom);

        setPan({ x: initialPanX, y: initialPanY });
    }
  }, []); // Run only once on mount

  const revealedNodeIds = useMemo(() => {
    return new Set(Object.values(architecture).filter((n: NodeData) => n.revealed).map((n: NodeData) => n.id));
  }, [architecture]);

  const handlePathfinderClick = () => {
    const newlyVisible = new Set<number>();
    const nodesAtDepth1 = new Set<number>();

    // Find all nodes 1 hop away from any revealed node
    revealedNodeIds.forEach(revealedId => {
      const node = architecture[revealedId];
      node?.connections.forEach(connId => {
        if (!revealedNodeIds.has(connId)) {
          nodesAtDepth1.add(connId);
        }
      });
    });

    const nodesAtDepth2 = new Set<number>();
    // Find all nodes 2 hops away (from depth 1 nodes)
    nodesAtDepth1.forEach(id1 => {
      const node = architecture[id1];
      node?.connections.forEach(connId => {
        if (!revealedNodeIds.has(connId)) {
          nodesAtDepth2.add(connId);
        }
      });
    });

    // Combine and check which ones are not already visible
    const allNewNodes = new Set([...nodesAtDepth1, ...nodesAtDepth2]);
    allNewNodes.forEach(id => {
      if (!visibleNodeIds.has(id)) {
        newlyVisible.add(id);
      }
    });

    if (newlyVisible.size > 0) {
      setVisibleNodeIds(prev => new Set([...prev, ...newlyVisible]));
    }
  };
  
  const handleNodeClick = (id: number) => {
    const node = architecture[id];
    if (!node || !visibleNodeIds.has(id)) return;

    const isHackable = node.connections.some(connId => revealedNodeIds.has(connId));
    
    if (isHackable && !node.revealed) {
      setArchitecture(prev => ({
        ...prev,
        [id]: { ...prev[id], revealed: true },
      }));
      // Auto-reveal adjacent nodes
      const newlyVisible = new Set<number>();
      node.connections.forEach(connId => {
        if (!visibleNodeIds.has(connId)) {
          newlyVisible.add(connId);
        }
      });
      if (newlyVisible.size > 0) {
        setVisibleNodeIds(prev => new Set([...prev, ...newlyVisible]));
      }
    }
    setSelectedNodeId(id);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 2) return; // Right-click to pan
    e.preventDefault();
    panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    setIsPanning(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    e.preventDefault();
    setPan({
      x: e.clientX - panStartRef.current.x,
      y: e.clientY - panStartRef.current.y,
    });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (e.button !== 2 && isPanning) return;
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    const minZoom = 0.5;
    const maxZoom = 2.5;
    const zoomSpeed = 0.1;
    
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate mouse position in world space before zoom
    const worldX = (mouseX - pan.x) / zoom;
    const worldY = (mouseY - pan.y) / zoom;
    
    const delta = e.deltaY < 0 ? 1 : -1;
    const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom + delta * zoomSpeed));
    
    if (newZoom === zoom) return;

    // Calculate new pan to keep mouse position in the same place
    const newPanX = mouseX - worldX * newZoom;
    const newPanY = mouseY - worldY * newZoom;

    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  };


  const selectedNode = selectedNodeId ? architecture[selectedNodeId] : null;
  // FIX: Explicitly typing the `node` parameter as `NodeData` resolves a type inference issue where it was being treated as `unknown`.
  const nodesToRender = Object.values(architecture).filter((node: NodeData) => visibleNodeIds.has(node.id));

  return (
    <div className="h-screen w-screen bg-[#0d0d0d] text-cyan-400 flex flex-col">
      <header className="p-4 border-b-2 border-cyan-500/30 text-center relative flex items-center justify-center gap-4">
        <LogoIcon className="w-10 h-10 md:w-12 md:h-12 text-cyan-500" />
        <div>
          <h1 className="text-2xl md:text-4xl font-bold uppercase tracking-[0.2em] glitch" data-text="HEYWOOD HARBOUR">HEYWOOD HARBOUR</h1>
          <p className="text-xs md:text-sm text-cyan-600">TARGET: MS Maladia // ETA: 20:00h</p>
        </div>
      </header>
      <main className="flex-grow flex flex-col md:flex-row overflow-hidden">
        <div 
          ref={containerRef}
          className="flex-grow relative h-full w-full overflow-hidden cursor-grab"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onContextMenu={(e) => e.preventDefault()}
          onWheel={handleWheel}
        >
          <div
            className="absolute top-0 left-0"
            style={{
              width: '150%',
              height: '150%',
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
              cursor: isPanning ? 'grabbing' : 'grab',
            }}
          >
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {nodesToRender.map((node: NodeData) =>
                node.connections.map(connId => {
                  const targetNode = architecture[connId];
                  if (!targetNode || !visibleNodeIds.has(connId) || node.id > connId) return null; 
                  
                  const isPathRevealed = node.revealed || targetNode.revealed;

                  return (
                    <line
                      key={`${node.id}-${connId}`}
                      x1={`${node.gridX * 4}%`}
                      y1={`${node.gridY * 4}%`}
                      x2={`${targetNode.gridX * 4}%`}
                      y2={`${targetNode.gridY * 4}%`}
                      stroke={isPathRevealed ? "rgba(0, 255, 255, 0.7)" : "rgba(0, 139, 139, 0.2)"}
                      strokeWidth="2"
                      className="transition-all duration-500"
                    />
                  );
                })
              )}
            </svg>
            {nodesToRender.map((node: NodeData) => {
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
        </div>
        <NodeDetail node={selectedNode} onCenterNode={() => centerOnNode(selectedNodeId)} />
      </main>
      <Controls onPathfinderClick={handlePathfinderClick} />
    </div>
  );
};

export default App;

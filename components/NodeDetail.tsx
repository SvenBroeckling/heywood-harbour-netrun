
import React from 'react';
import { type NodeData, NodeType } from '../types';
import { NodeIcon } from './Icons';

interface NodeDetailProps {
  node: NodeData | null;
}

const NodeDetail: React.FC<NodeDetailProps> = ({ node }) => {
  if (!node) {
    return (
      <div className="w-full md:w-1/3 lg:w-1/4 p-4 border-l-2 border-cyan-500/30 text-cyan-400 bg-black/30 h-full overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-cyan-300">SYSTEM INFO</h2>
        <p className="text-cyan-500">No node selected. Click a node on the architecture map to view details.</p>
      </div>
    );
  }

  const colorClasses: Record<NodeType, string> = {
    [NodeType.ENTRYPOINT]: 'text-green-400 border-green-400',
    [NodeType.PASSWORD]: 'text-yellow-400 border-yellow-400',
    [NodeType.CONTROL_NODE]: 'text-blue-400 border-blue-400',
    [NodeType.FILE]: 'text-purple-400 border-purple-400',
    [NodeType.BLACK_ICE]: 'text-red-500 border-red-500',
    [NodeType.BRANCH]: 'text-cyan-400 border-cyan-400',
  };

  const bgColorClasses: Record<NodeType, string> = {
    [NodeType.ENTRYPOINT]: 'bg-green-900/50',
    [NodeType.PASSWORD]: 'bg-yellow-900/50',
    [NodeType.CONTROL_NODE]: 'bg-blue-900/50',
    [NodeType.FILE]: 'bg-purple-900/50',
    [NodeType.BLACK_ICE]: 'bg-red-900/50',
    [NodeType.BRANCH]: 'bg-cyan-900/50',
  };

  return (
    <div className="w-full md:w-1/3 lg:w-1/4 p-4 border-l-2 border-cyan-500/30 bg-black/30 h-full overflow-y-auto flex flex-col text-sm md:text-base">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-cyan-300 tracking-widest">NODE ANALYSIS</h2>
      
      <div className={`p-4 border ${colorClasses[node.type]} ${bgColorClasses[node.type]} mb-4`}>
        <div className="flex items-center mb-2">
          <NodeIcon type={node.type} className="w-6 h-6 mr-3" />
          <h3 className="text-lg font-bold uppercase tracking-wider">{node.label}</h3>
        </div>
        <p className="text-sm opacity-80">{node.description}</p>
      </div>

      <div className="flex-grow space-y-4 text-cyan-300">
        <div>
          <p className="font-bold text-cyan-500 uppercase">TYPE:</p>
          <p className={`${colorClasses[node.type]} font-semibold`}>{node.type}</p>
        </div>
        <div>
          <p className="font-bold text-cyan-500 uppercase">LEVEL:</p>
          <p>{node.level}</p>
        </div>
        {node.dv && (
          <div>
            <p className="font-bold text-cyan-500 uppercase">DIFFICULTY VALUE (DV):</p>
            <p className="text-yellow-400 font-bold text-lg">{node.dv}</p>
          </div>
        )}
        <div>
          <p className="font-bold text-cyan-500 uppercase">CONTENT:</p>
          <p className="opacity-90 leading-relaxed">{node.content}</p>
        </div>
      </div>
      <div className="mt-auto pt-4 text-xs text-cyan-700">
        <p>// END NODE STREAM</p>
      </div>
    </div>
  );
};

export default NodeDetail;

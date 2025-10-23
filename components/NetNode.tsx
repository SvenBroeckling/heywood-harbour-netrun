import React from 'react';
import { type NodeData, NodeType } from '../types';
import { NodeIcon } from './Icons';

interface NetNodeProps {
  node: NodeData;
  onClick: (id: number) => void;
  isSelected: boolean;
  isAccessible: boolean;
}

const NetNode: React.FC<NetNodeProps> = ({ node, onClick, isSelected, isAccessible }) => {
  const colorClasses: Record<NodeType, string> = {
    [NodeType.ENTRYPOINT]: 'border-green-500 text-green-500 hover:bg-green-500/20',
    [NodeType.PASSWORD]: 'border-yellow-500 text-yellow-500 hover:bg-yellow-500/20',
    [NodeType.CONTROL_NODE]: 'border-blue-500 text-blue-500 hover:bg-blue-500/20',
    [NodeType.FILE]: 'border-purple-500 text-purple-500 hover:bg-purple-500/20',
    [NodeType.BLACK_ICE]: 'border-red-500 text-red-500 hover:bg-red-500/20',
    [NodeType.BRANCH]: 'border-cyan-500 text-cyan-500 hover:bg-cyan-500/20',
  };

  const selectedClass = isSelected ? 'bg-cyan-500/30 ring-2 ring-cyan-400' : '';
  const accessibleClass = isAccessible ? 'cursor-pointer' : 'cursor-not-allowed';
  const revealedClass = node.revealed ? colorClasses[node.type] : 'border-cyan-900 text-cyan-900 hover:border-cyan-600 hover:text-cyan-600';

  const baseClasses = "absolute w-20 h-20 md:w-24 md:h-24 flex flex-col items-center justify-center p-1 border-2 transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm";

  return (
    <div
      className={`${baseClasses} ${revealedClass} ${selectedClass} ${accessibleClass}`}
      style={{
        left: `${node.gridX * 4}%`,
        top: `${node.gridY * 4}%`,
      }}
      onClick={() => isAccessible && onClick(node.id)}
    >
      <NodeIcon type={node.revealed ? node.type : NodeType.BRANCH} className="w-6 h-6 md:w-8 md:h-8 mb-1" />
      <span className="text-xs text-center leading-tight">
        {node.revealed ? node.label : `LVL ${node.level}`}
      </span>
    </div>
  );
};

export default NetNode;

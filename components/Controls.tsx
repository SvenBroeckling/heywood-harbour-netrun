import React from 'react';

interface ControlsProps {
  onPathfinderClick: () => void;
}

const Controls: React.FC<ControlsProps> = ({ onPathfinderClick }) => {
  return (
    <div className="p-2 border-t-2 border-cyan-500/30 bg-black/50 flex items-center justify-center">
      <button
        onClick={onPathfinderClick}
        className="px-4 py-2 bg-cyan-700/50 border-2 border-cyan-500 text-cyan-300 font-bold uppercase tracking-widest hover:bg-cyan-600/70 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
      >
        Run Pathfinder
      </button>
    </div>
  );
};

export default Controls;

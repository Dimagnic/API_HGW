import React, { useRef, useEffect, useState, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

const ReferralNetworkVisualization = () => {
  const fgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef(null);
  const isMobile = useIsMobile();
  const [hoverNode, setHoverNode] = useState(null);

  // Generate synthetic network data
  const data = useMemo(() => {
    const nodes = [
      { id: '1', name: 'Maya Chen (You)', rank: 'Diamond', val: 20, color: '#06b6d4', group: 1, sales: '$128k' },
      { id: '2', name: 'Raj Patel', rank: 'Platinum', val: 15, color: '#0d9488', group: 2, sales: '$87k' },
      { id: '3', name: 'Lucia Torres', rank: 'Gold', val: 12, color: '#d97706', group: 2, sales: '$64k' },
      { id: '4', name: 'Kwame Asante', rank: 'Silver', val: 10, color: '#94a3b8', group: 2, sales: '$42k' },
      { id: '5', name: 'Anika B.', rank: 'Bronze', val: 8, color: '#b45309', group: 3, sales: '$12k' },
      { id: '6', name: 'Chen Wei', rank: 'Silver', val: 10, color: '#94a3b8', group: 3, sales: '$38k' },
      { id: '7', name: 'Sofia M.', rank: 'Bronze', val: 8, color: '#b45309', group: 3, sales: '$9k' },
      { id: '8', name: 'David K.', rank: 'Gold', val: 12, color: '#d97706', group: 3, sales: '$55k' },
      { id: '9', name: 'Emma L.', rank: 'Bronze', val: 8, color: '#b45309', group: 4, sales: '$5k' },
      { id: '10', name: 'James W.', rank: 'Silver', val: 10, color: '#94a3b8', group: 4, sales: '$28k' },
    ];
    
    const links = [
      { source: '1', target: '2', value: 3 },
      { source: '1', target: '3', value: 3 },
      { source: '1', target: '4', value: 2 },
      { source: '2', target: '5', value: 1 },
      { source: '2', target: '6', value: 2 },
      { source: '3', target: '7', value: 1 },
      { source: '3', target: '8', value: 2 },
      { source: '8', target: '9', value: 1 },
      { source: '4', target: '10', value: 1 },
    ];
    return { nodes, links };
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Zoom to fit on load
  useEffect(() => {
    if (fgRef.current) {
      setTimeout(() => {
        fgRef.current.zoomToFit(400, 50);
      }, 500);
    }
  }, []);

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden glass-card border border-border/40" ref={containerRef}>
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none z-0" />
      
      {/* Stats Overlay */}
      <div className="absolute top-6 left-6 z-10 space-y-2 pointer-events-none">
        <h3 className="text-xl font-bold gradient-text">Network Graph</h3>
        <p className="text-sm text-muted-foreground bg-background/60 backdrop-blur-md px-3 py-1 rounded-full w-fit">
          Showing {data.nodes.length} members
        </p>
      </div>

      {/* Graph */}
      <div className="absolute inset-0 z-0">
        <ForceGraph2D
          ref={fgRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={data}
          nodeLabel="name"
          nodeColor={node => hoverNode === node ? '#fff' : node.color}
          nodeRelSize={6}
          linkColor={() => 'rgba(6, 182, 212, 0.2)'}
          linkWidth={link => link.value}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={1.5}
          linkDirectionalParticleSpeed={0.005}
          onNodeHover={node => setHoverNode(node)}
          d3VelocityDecay={0.3}
          backgroundColor="transparent"
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.name;
            const fontSize = 12/globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); 

            ctx.beginPath();
            ctx.arc(node.x, node.y, node.val * 0.5, 0, 2 * Math.PI, false);
            ctx.fillStyle = node === hoverNode ? '#ffffff' : node.color;
            ctx.fill();
            
            // Add glow
            ctx.shadowColor = node.color;
            ctx.shadowBlur = 15;

            if (node === hoverNode || globalScale > 1.5) {
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
              ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y + node.val * 0.5 + 2, bckgDimensions[0], bckgDimensions[1]);
              
              ctx.fillStyle = '#fff';
              ctx.fillText(label, node.x, node.y + node.val * 0.5 + 2 + fontSize/2);
            }
          }}
        />
      </div>

      {/* Hover Info Card */}
      {hoverNode && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute bottom-6 right-6 z-10"
        >
          <Card className="glass-card border-border/50 p-4 w-64 shadow-2xl backdrop-blur-xl bg-secondary/80">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-background"
                style={{ backgroundColor: hoverNode.color }}
              >
                {hoverNode.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{hoverNode.name}</h4>
                <Badge variant="outline" style={{ color: hoverNode.color, borderColor: hoverNode.color }}>
                  {hoverNode.rank}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-background/40 p-2 rounded-lg">
                <span className="text-muted-foreground text-xs block">Level</span>
                <span className="font-medium">Tier {hoverNode.group}</span>
              </div>
              <div className="bg-background/40 p-2 rounded-lg">
                <span className="text-muted-foreground text-xs block">Sales</span>
                <span className="font-medium">{hoverNode.sales}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Legend */}
      <div className="absolute bottom-6 left-6 z-10 bg-background/60 backdrop-blur-md p-3 rounded-xl border border-border/40 text-xs hidden md:block">
        <p className="font-semibold mb-2">Rank Legend</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#06b6d4]"></span> Diamond</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#0d9488]"></span> Platinum</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#d97706]"></span> Gold</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#94a3b8]"></span> Silver</div>
        </div>
      </div>
    </div>
  );
};

export default ReferralNetworkVisualization;
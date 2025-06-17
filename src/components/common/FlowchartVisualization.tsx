import React, { useCallback, useMemo, useRef, CSSProperties, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  ControlButton,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  MarkerType,
  BackgroundVariant,
  Panel,
  Position,
  Handle,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import dagre from 'dagre';

// Define the WorkflowData interface based on the API response
export interface WorkflowData {
  nodes?: WorkflowNode[];
  edges?: WorkflowEdge[];
  optimizableSteps?: string[] | OptimizableStep[];
  // Backend response format properties
  steps?: {
    id: string;
    label: string;
  }[];
  dependencies?: {
    from: string;
    to: string;
  }[];
  optimizable_steps?: {
    id: string;
    reason: string;
  }[];
}

export interface WorkflowNode {
  id: string;
  label: string;
  type?: string;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface OptimizableStep {
  id: string;
  reason: string;
}

// Interface for the sample data structure from the backend
interface FlowchartData {
  dependencies: {
    from: string;
    to: string;
  }[];
  steps: {
    id: string;
    label: string;
  }[];
  optimizable_steps: {
    id: string;
    reason: string;
  }[];
}

interface FlowchartVisualizationProps {
  workflow: WorkflowData;
}

// Custom node styles with glassmorphic design
const nodeStyles: Record<string, CSSProperties> = {
  default: {
    background: 'rgba(43, 47, 66, 0.8)',
    border: '1.5px solid #484F6F',
    borderRadius: '8px',
    padding: '12px',
    color: 'white',
    fontSize: '13px',
    fontFamily: "'Inter', sans-serif",
    minWidth: '120px',
    textAlign: 'center' as const,
    boxShadow: '2px 2px 7px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
  },
  optimizable: {
    background: 'rgba(234, 56, 76, 0.15)',
    border: '2px solid #ea384c',
    borderRadius: '8px',
    padding: '12px',
    color: 'white',
    fontSize: '13px',
    fontFamily: "'Inter', sans-serif",
    minWidth: '120px',
    textAlign: 'center' as const,
    boxShadow: '2px 2px 7px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
  }
};

// Custom Node Component
const CustomNode = ({ data, selected }: { data: any; selected: boolean }) => {
  const isOptimizable = data.isOptimizable;
  
  return (
    <div
      style={{
        ...nodeStyles[isOptimizable ? 'optimizable' : 'default'],
        opacity: selected ? 1 : (isOptimizable ? 1 : 0.9),
      }}
      title={isOptimizable ? `Optimization: ${data.optimizationReason}` : data.label}
    >
      {/* Hidden handles - not visible but needed for connections */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: 0, pointerEvents: 'none' }}
      />
      
      {data.type && data.type !== 'default' && (
        <div
          style={{
            background: '#9b87f5',
            borderRadius: '4px',
            padding: '2px 8px',
            fontSize: '10px',
            marginBottom: '5px',
            display: 'inline-block',
          }}
        >
          {data.type}
        </div>
      )}
      <div>{data.label}</div>
      
      {/* Hidden handles - not visible but needed for connections */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ opacity: 0, pointerEvents: 'none' }}
      />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

// Layout function using Dagre
const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  const nodeWidth = 150;
  const nodeHeight = 80;
  
  dagreGraph.setGraph({ 
    rankdir: direction,
    ranksep: 40,
    nodesep: 30,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    // Remove these as they're already set in node creation
    // node.targetPosition = Position.Top;
    // node.sourcePosition = Position.Bottom;
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
  });

  return { nodes, edges };
};

const FlowchartVisualization: React.FC<FlowchartVisualizationProps> = ({ workflow }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      reactFlowWrapper.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Convert the API data to React Flow format
  const convertWorkflowToReactFlow = useCallback((workflow: WorkflowData) => {
    console.log('=== FlowchartVisualization Debug ===');
    console.log('Input workflow data:', workflow);
    
    let nodeArray: Node[] = [];
    let edgeArray: Edge[] = [];
    
    // Convert nodes array to React Flow node data
    if (workflow.steps && Array.isArray(workflow.steps)) {
      console.log('Converting steps to nodes:', workflow.steps);
      nodeArray = workflow.steps.map(step => ({
        id: step.id,
        type: 'custom',
        position: { x: 0, y: 0 }, // Will be set by layout
        data: {
          label: step.label,
          type: 'default',
          isOptimizable: false,
          optimizationReason: ''
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      }));
    } else {
      console.log('No valid steps array found in workflow data');
    }
    
    // Mark optimizable nodes
    if (workflow.optimizable_steps && Array.isArray(workflow.optimizable_steps)) {
      console.log('Processing optimizable steps:', workflow.optimizable_steps);
      nodeArray.forEach(node => {
        const optimizableStep = workflow.optimizable_steps?.find(step => step.id === node.id);
        if (optimizableStep) {
          node.data.isOptimizable = true;
          node.data.optimizationReason = optimizableStep.reason;
        }
      });
    }
    
    // Convert edges to React Flow edge data
    if (workflow.dependencies && Array.isArray(workflow.dependencies)) {
      console.log('Converting dependencies to edges:', workflow.dependencies);
      edgeArray = workflow.dependencies.map((dep, index) => ({
        id: `edge-${index}`,
        source: dep.from,
        target: dep.to,
        type: 'default',
        style: { 
          strokeWidth: 2,
          stroke: '#8E9196'
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#8E9196',
        },
      }));
    } else {
      console.log('No valid dependencies array found in workflow data');
    }

    // Update edge colors based on optimizable nodes
    edgeArray.forEach(edge => {
      const sourceNode = nodeArray.find(n => n.id === edge.source);
      const targetNode = nodeArray.find(n => n.id === edge.target);
      
      if (sourceNode?.data.isOptimizable || targetNode?.data.isOptimizable) {
        edge.style = {
          ...edge.style,
          stroke: '#ea384c'
        };
        edge.markerEnd = {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#ea384c',
        };
      }
    });
    
    console.log('Final converted nodes:', nodeArray);
    console.log('Final converted edges:', edgeArray);
    
    return { nodeArray, edgeArray };
  }, []);

  // Convert workflow data and apply layout
  const { initialNodes, initialEdges } = useMemo(() => {
    if (!workflow) {
      console.log('No workflow data provided to FlowchartVisualization');
      return { initialNodes: [], initialEdges: [] };
    }
    
    const { nodeArray, edgeArray } = convertWorkflowToReactFlow(workflow);
    const { nodes, edges } = getLayoutedElements(nodeArray, edgeArray);
    
    console.log('Final layouted nodes:', nodes);
    console.log('Final layouted edges:', edges);
    
    return { initialNodes: nodes, initialEdges: edges };
  }, [workflow, convertWorkflowToReactFlow]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const CustomControls = useCallback(() => {
    return (
      <Controls 
        showInteractive={false}
        position="bottom-left"
        fitViewOptions={{ padding: 0.2 }}
        className="!bg-white !border-red-500 [&>button]:!w-6 [&>button]:!h-6 [&>button]:!bg-[#ea384c] [&>button]:!border-red-500 [&>button]:!rounded [&>button]:!text-white [&>button]:!m-1 [&>button]:!cursor-pointer [&>button]:!flex [&>button]:!justify-center [&>button]:!items-center [&>button]:!transition-all [&>button]:!duration-200 [&>button]:hover:!bg-[#ff4d63] [&>button]:hover:!scale-105"
      >
        <ControlButton
          onClick={toggleFullscreen}
          className="custom-control-button"
        >
          {isFullscreen ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
          )}
        </ControlButton>
      </Controls>
    );
  }, [isFullscreen, toggleFullscreen]);

  if (!workflow) {
    console.log('No workflow data in FlowchartVisualization render');
    return null;
  }
  
  return (
    <div 
      ref={reactFlowWrapper}
      className="w-full h-full"
      style={{ position: 'relative' }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        style={{ backgroundColor: 'transparent' }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        draggable={false}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        preventScrolling={false}
        proOptions={{ hideAttribution: true }}
      >
        <CustomControls />
        <MiniMap 
          style={{
            background: 'rgba(43, 47, 66, 0.8)',
            border: '1px solid #484F6F',
            borderRadius: '8px',
            backdropFilter: 'blur(8px)',
            width: 100,
            height: 100,
          }}
          nodeColor={(node) => {
            return node.data.isOptimizable ? '#ea384c' : '#484F6F';
          }}
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1}
          color="rgba(255, 255, 255, 0.1)"
        />
      </ReactFlow>
    </div>
  );
};

export default FlowchartVisualization;

import React, { useEffect, useRef } from 'react';
import * as go from 'gojs';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Expand } from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

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

const FlowchartVisualization: React.FC<FlowchartVisualizationProps> = ({ workflow }) => {
  const diagramRef = useRef<HTMLDivElement>(null);
  const diagramInstance = useRef<go.Diagram | null>(null);

  // Convert the API data to a standardized format for GoJS
  const convertWorkflowToGoJSModel = (workflow: WorkflowData) => {
    // Check if we have a standard workflow or need to adapt from the backend format
    let nodeArray: go.ObjectData[] = [];
    let linkArray: go.ObjectData[] = [];
    
    // Convert nodes array to GoJS node data
    if (Array.isArray(workflow.nodes)) {
      nodeArray = workflow.nodes.map(node => ({
        key: node.id,
        text: node.label,
        type: node.type || 'default',
        isOptimizable: false,
        optimizationReason: ''
      }));
    } else if (workflow.hasOwnProperty('steps')) {
      // Handle the backend format
      const backendData = workflow as unknown as { 
        steps: FlowchartData['steps'], 
        dependencies: FlowchartData['dependencies'], 
        optimizable_steps: FlowchartData['optimizable_steps'] 
      };
      
      nodeArray = backendData.steps.map(step => ({
        key: step.id,
        text: step.label,
        type: 'default',
        isOptimizable: false,
        optimizationReason: ''
      }));
    }
    
    // Mark optimizable nodes
    if (Array.isArray(workflow.optimizableSteps)) {
      // Handle different optimizable steps formats
      if (typeof workflow.optimizableSteps[0] === 'string') {
        // Simple string array format
        const optimizableIds = workflow.optimizableSteps as string[];
        nodeArray.forEach(node => {
          if (optimizableIds.includes(node.key as string)) {
            node.isOptimizable = true;
            node.optimizationReason = "This step can be optimized";
          }
        });
      } else {
        // Detailed object format with reasons
        const optimizableSteps = workflow.optimizableSteps as OptimizableStep[];
        nodeArray.forEach(node => {
          const optimizableStep = optimizableSteps.find(step => step.id === node.key);
          if (optimizableStep) {
            node.isOptimizable = true;
            node.optimizationReason = optimizableStep.reason;
          }
        });
      }
    } else if (workflow.hasOwnProperty('optimizable_steps')) {
      // Handle the backend format
      const backendData = workflow as unknown as { optimizable_steps: FlowchartData['optimizable_steps'] };
      nodeArray.forEach(node => {
        const optimizableStep = backendData.optimizable_steps.find(step => step.id === node.key);
        if (optimizableStep) {
          node.isOptimizable = true;
          node.optimizationReason = optimizableStep.reason;
        }
      });
    }
    
    // Convert edges to GoJS link data
    if (Array.isArray(workflow.edges)) {
      linkArray = workflow.edges.map(edge => ({
        from: edge.source,
        to: edge.target,
        text: edge.label || ''
      }));
    } else if (workflow.hasOwnProperty('dependencies')) {
      // Handle the backend format
      const backendData = workflow as unknown as { dependencies: FlowchartData['dependencies'] };
      linkArray = backendData.dependencies.map(dep => ({
        from: dep.from,
        to: dep.to,
        text: ''
      }));
    }
    
    return { nodeArray, linkArray };
  };

  // Initialize and render the diagram
  useEffect(() => {
    if (!workflow || !diagramRef.current) return;

    // Create a new diagram
    const $ = go.GraphObject.make;
    const diagram = new go.Diagram(diagramRef.current, {
      "undoManager.isEnabled": true,
      layout: $(go.LayeredDigraphLayout, {
        direction: 90,
        layerSpacing: 40,
        columnSpacing: 30,
        setsPortSpots: false
      }),
      "animationManager.isEnabled": true,
      "animationManager.initialAnimationStyle": go.AnimationManager.None,
      model: new go.GraphLinksModel({
        linkKeyProperty: 'id'
      })
    });

    // Define node template
    diagram.nodeTemplate = $(go.Node, "Auto",
      {
        selectionAdorned: false,
        resizable: false,
        layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
        // Apply a shadow effect with JavaScript DOM API instead of GoJS Shadow
        shadowVisible: true,
        shadowOffset: new go.Point(2, 2),
        shadowBlur: 7,
        shadowColor: "rgba(0, 0, 0, 0.2)",
        // Add tooltip
        toolTip: $(go.Adornment, "Auto",
          $(go.Shape, { fill: "#2A2F42", stroke: "#676B79" }),
          $(go.TextBlock, 
            { 
              margin: 8, 
              font: "11px 'Inter', sans-serif",
              stroke: "white",
              wrap: go.TextBlock.WrapFit,
              alignment: go.Spot.Center
            },
            new go.Binding("text", "", data => {
              return data.isOptimizable ? 
                `Optimization: ${data.optimizationReason}` : 
                data.text;
            })
          )
        )
      },
      new go.Binding("opacity", "isOptimizable", opt => opt ? 1 : 0.9),
      // Node shape
      $(go.Shape, "RoundedRectangle", 
        { 
          fill: "rgba(43, 47, 66, 0.8)", 
          stroke: "#484F6F",
          strokeWidth: 1.5,
          spot1: go.Spot.TopLeft, 
          spot2: go.Spot.BottomRight,
          parameter1: 8
        },
        // Conditional styling for optimizable nodes
        new go.Binding("fill", "isOptimizable", opt => opt ? "rgba(234, 56, 76, 0.15)" : "rgba(43, 47, 66, 0.8)"),
        new go.Binding("stroke", "isOptimizable", opt => opt ? "#ea384c" : "#484F6F"),
        new go.Binding("strokeWidth", "isOptimizable", opt => opt ? 2 : 1.5)
      ),
      // Node content
      $(go.Panel, "Vertical",
        {
          margin: 12,
          alignment: go.Spot.Center
        },
        // Type badge
        $(go.Panel, "Auto",
          { visible: false },
          new go.Binding("visible", "type", t => t !== "default"),
          $(go.Shape, "RoundedRectangle", 
            { 
              fill: "#9b87f5", 
              stroke: null,
              height: 20,
              width: 80,
              alignment: go.Spot.Center
            }
          ),
          $(go.TextBlock, 
            {
              alignment: go.Spot.Center,
              stroke: "white",
              font: "10px 'Inter', sans-serif"
            },
            new go.Binding("text", "type")
          )
        ),
        // Main label
        $(go.TextBlock, 
          {
            margin: new go.Margin(5, 0, 0, 0),
            alignment: go.Spot.Center,
            stroke: "white",
            font: "13px 'Inter', sans-serif",
            maxSize: new go.Size(150, NaN),
            wrap: go.TextBlock.WrapFit,
            textAlign: "center"
          },
          new go.Binding("text")
        )
      )
    );

    // Define link template
    diagram.linkTemplate = $(go.Link,
      {
        curve: go.Link.Bezier,
        reshapable: false,
        relinkableFrom: false,
        relinkableTo: false,
        toEndSegmentLength: 30,
        fromEndSegmentLength: 30
      },
      // Link path
      $(go.Shape, 
        { 
          strokeWidth: 2, 
          stroke: "#8E9196" 
        },
        new go.Binding("stroke", "", function(link) {
          // Check if either the source or target node is optimizable
          const diagram = link.part.diagram;
          if (!diagram) return "#8E9196";
          
          const sourceNode = link.fromNode;
          const targetNode = link.toNode;
          
          if (!sourceNode || !targetNode) return "#8E9196";
          
          if (sourceNode.data.isOptimizable || targetNode.data.isOptimizable) {
            return "#ea384c";
          }
          
          return "#8E9196";
        }).ofObject()
      ),
      // Arrowhead
      $(go.Shape, 
        { 
          toArrow: "Triangle", 
          stroke: "#8E9196", 
          fill: "#8E9196",
          scale: 1.2
        },
        new go.Binding("stroke", "", function(link) {
          // Match the arrow color to the path color
          const diagram = link.part.diagram;
          if (!diagram) return "#8E9196";
          
          const sourceNode = link.fromNode;
          const targetNode = link.toNode;
          
          if (!sourceNode || !targetNode) return "#8E9196";
          
          if (sourceNode.data.isOptimizable || targetNode.data.isOptimizable) {
            return "#ea384c";
          }
          
          return "#8E9196";
        }).ofObject(),
        new go.Binding("fill", "", function(link) {
          // Match the arrow fill to the path color
          const diagram = link.part.diagram;
          if (!diagram) return "#8E9196";
          
          const sourceNode = link.fromNode;
          const targetNode = link.toNode;
          
          if (!sourceNode || !targetNode) return "#8E9196";
          
          if (sourceNode.data.isOptimizable || targetNode.data.isOptimizable) {
            return "#ea384c";
          }
          
          return "#8E9196";
        }).ofObject()
      ),
      // Link label
      $(go.TextBlock, 
        { 
          segmentOffset: new go.Point(0, -10),
          font: "10px 'Inter', sans-serif",
          stroke: "white",
          background: "rgba(30, 34, 47, 0.7)",
          // Replace padding with margin which is supported by GoJS TextBlock
          margin: 2
        },
        new go.Binding("text", "text")
      )
    );

    // Set model data
    const { nodeArray, linkArray } = convertWorkflowToGoJSModel(workflow);
    diagram.model = new go.GraphLinksModel({
      nodeDataArray: nodeArray,
      linkDataArray: linkArray
    });

    // Save the diagram instance for later use
    diagramInstance.current = diagram;

    // Initial layout and fit to view
    diagram.layoutDiagram(true);
    diagram.contentAlignment = go.Spot.Center;
    diagram.commandHandler.zoomToFit();
    diagram.contentAlignment = go.Spot.Center;

    // Clean up on unmount
    return () => {
      diagram.div = null;
    };
  }, [workflow]);

  // Handle diagram download
  const handleDownload = () => {
    if (!diagramInstance.current) return;
    
    const diagram = diagramInstance.current;
    
    // Create a canvas from the diagram
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to diagram bounds
    const bounds = diagram.documentBounds;
    const scale = 2; // Higher quality
    canvas.width = bounds.width * scale;
    canvas.height = bounds.height * scale;
    
    // Draw diagram to canvas with better quality
    const svgOptions: go.SvgRendererOptions = {
      document: document,
      scale: scale,
      background: diagram.div ? diagram.div.style.backgroundColor : "rgba(0,0,0,0)",
    };
    
    // Fixed: TypeScript error with SVGElement by using proper type handling
    try {
      const svg = diagram.makeSvg(svgOptions);
      
      // Convert SVG to a data URL
      const serializer = new XMLSerializer();
      const svgStr = serializer.serializeToString(svg);
      const svgBlob = new Blob([svgStr], {type: "image/svg+xml;charset=utf-8"});
      const url = URL.createObjectURL(svgBlob);
      
      // Create image from SVG
      const img = new Image();
      img.onload = function() {
        // Draw the image on the canvas
        if (ctx) {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          
          // Convert to PNG and download
          const imgURI = canvas.toDataURL("image/png");
          const a = document.createElement("a");
          a.download = "flowchart.png";
          a.href = imgURI;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          // Clean up
          URL.revokeObjectURL(url);
        }
      };
      img.src = url;
    } catch (error) {
      console.error("Failed to generate SVG:", error);
    }
  };

  // Handle fullscreen mode
  const handleFullscreen = () => {
    if (!diagramRef.current) return;
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      diagramRef.current.requestFullscreen();
    }
  };

  if (!workflow) return null;
  
  return (
    <Card className="mb-6 overflow-hidden border border-border bg-card/50">
      <CardContent className="p-0">
        <div className="relative">
          {/* Controls overlay */}
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary" size="sm" onClick={handleDownload} className="h-8 px-2">
                    <Download size={16} className="mr-1" />
                    <span className="text-xs">Export</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">Download as PNG</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary" size="sm" onClick={handleFullscreen} className="h-8 px-2">
                    <Expand size={16} className="mr-1" />
                    <span className="text-xs">Fullscreen</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">View in fullscreen</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* GoJS diagram container */}
          <div 
            ref={diagramRef} 
            style={{ 
              height: 400, 
              width: '100%',
              backgroundColor: 'transparent'
            }} 
            className="gojs-diagram"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FlowchartVisualization;

/* eslint-disable react/jsx-key */
import React, { useCallback, useMemo, useState } from "react";

import ReactFlow, { 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, // similar to useState in React
  useEdgesState, 
  addEdge,
  BackgroundVariant,
  applyNodeChanges,
  MarkerType,
  ConnectionMode
} from 'reactflow';

import 'reactflow/dist/style.css';
import { type } from "os";

import TextUpdaterNode from '@/app/components/nodes/TextUpdaterNode';

type NodeObj = {
  id: string, 
  position: PositionObj,
  data: LabelObj,
  style?: StyleObj,
  parentNode?: string, 
  extent?: string,
  type?: string,
  hidden?: boolean,
}

type PositionObj = {
  x: number, 
  y: number
}

type LabelObj = {
  label: string,
  arguments?: string[],
  type?: string,
  queryField?: boolean,
}

type StyleObj = {
  width: number,
  height: number
}


const initialNodes: any[] = [ // TODO: type
  { id: 'query', position: { x: 500, y: 0 }, data: { label: 'Root Query' } },
  { id: 'types', position: { x: 750, y: 200 }, data: { label: 'Types'}},
  { id: 'fields', position: { x: 250, y: 200 }, data: { label: 'Fields'}},
]

let xIndexForFields = 400;
let yIndexForFields = 300;

let xIndexForTypes = 750;
let yIndexForTypes= 300;



const initialEdges: any[] = [
  {
  source: 'query', 
  target: 'types',
  type: 'floating',
  markerEnd: { type: MarkerType.ArrowClosed },
},
  {
  source: 'query', 
  target: 'fields',
  type: 'floating',
  markerEnd: { type: MarkerType.ArrowClosed },
}
]; // TODO: type
console.log('this is our nodes', initialNodes)

export function DisplayData(props: any) { // TODO: type
  // {props.data.err && alert('Please enter a valid endpoint')}
  // {!props.data.schema && "No data, please enter an endpoint above."}
  // {props.data.schema && Object.keys(props.data.schema).map((key, index) => {
  // return (

  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // handle hiding and unhiding nodes on click
  const [hiddenNodes, setHiddenNodes] = useState(new Set());
  
  const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);


  
  const onNodeClick = (event: any, node: any) => {
    // if the node that was clicked is a field on Query type
    if (node.data.queryField) {
      // set id of node that should be hidden/unhidden
      const unHide = node.data.label + '-' + node.data.type;
   
      //hide/unhide node with type of the field that was clicked
      const newHiddenNodes = new Set(
        JSON.parse(
          JSON.stringify(
            Array.from(hiddenNodes)
          )
        )
      );
      hiddenNodes.has(unHide) ? newHiddenNodes.delete(unHide) : newHiddenNodes.add(unHide);
      setHiddenNodes(newHiddenNodes);
    }

    // console.log('click node', node);
    // alert(`should display node for type ${node.data.type}`)

    // send clicked node data to query generator
    props.setClickField({type: node.parentNode, field: node.data.label})
  }

  const onNodesChange = useCallback(
    (changes:any) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes]
  )
  
  //background variant
  const [ variant, setVariant ] = useState('dots');

 
  const schema = props.data.schema;
  if (!schema) {
    return null; // or render an error message, loading state, or fallback UI
  }

// iterate through our type elements and set each label to the type

// render a node for each field in the query type
  const schemaFields = schema.fields
  // let nodeState = [...initialNodes];
  let counter = 0;
  let numOfNodes = 0;
  initialNodes.length === 3 && schemaFields.map((field: any, i: any) => {
    let newNode: NodeObj = {
      id: field.name,
      position: { x: xIndexForFields, y: yIndexForFields }, 
      data: {
        queryField: true, // to read from onclick function
        label: field.name,
        arguments: [...field.reqArgs],
        type: field.type // added this in order to link with it's type and fields on click
      },
      // type: "output",
    };
    
    // push them to the initial nodes array (is it better to use a hook)
    initialNodes.push(newNode);
    // nodeState.push(newNode);
    numOfNodes++;

    // set the x and y positions:
    if (numOfNodes % 6 === 0 && numOfNodes !== 0) {
      counter ++;
      xIndexForFields -= 300; // Decrement x value for a new column
      yIndexForFields = 300; // Reset y value for a new column
    } else {
      yIndexForFields += 50; // Increment y value for the next row in the same column
    }
    // create a new edge to connect each type to the root query
    const newEdgeForFields = {
      source: 'fields',
      target: field.name,
      type: 'floating',
      markerEnd: {
        type: MarkerType.ArrowClosed
      }
    };

    // push the edges to the initial edges array (is it better to use a hook here?)
    initialEdges.push(newEdgeForFields);



    //render types and their fields
    const newTypeOfFieldNode: NodeObj = {
      id: field.name + '-' + field.type,
      position: {
        x: xIndexForTypes,
        y: yIndexForTypes,
      },
      data: {
        label: field.type
      },
      style: {
        width: 200,
        height: 400,
      },
    }

    const newTypeOfFieldEdge = {
      source: field.name,
      target: field.name + '-' + field.type,
      type: 'floating',
      markerEnd: {
        type: MarkerType.ArrowClosed
      }
    };
    console.log('new edge:', newTypeOfFieldEdge);

    initialNodes.push(newTypeOfFieldNode);
    initialEdges.push(newTypeOfFieldEdge);

    xIndexForTypes +=215
  });

  // render types and their fields
  // xIndexForTypes = 750;
  // yIndexForTypes= 300;
  // const schemaTypes = schema.types
  // if(numOfNodes + 3 === initialNodes.length) {
  //   for (let key in schemaTypes){

  //   let newTypeNode: NodeObj = { 
  //     id: key,
  //     position: { x: xIndexForTypes, y: yIndexForTypes }, 
  //     data: { label: key, arguments: [] },
  //     style: {
  //       width: 200,
  //       height: 400 
  //     }, 
  //     // hidden: true, // hidden at first, unhidden when a field from the query type with the matching type is clicked
  //   }

  //   xIndexForTypes += 215
  //   let newTypeEdge = {
  //     source: 'types',
  //     target: key,
  //     type: 'floating',
  //     markerEnd: {
  //       type: MarkerType.ArrowClosed
  //     }
  //   };

  //   initialNodes.push(newTypeNode);
  //   // nodeState.push(newTypeNode)
  //   initialEdges.push(newTypeEdge);

    
  //   let fieldInTypeYValue: number = 40;
  //   let fieldInTypeXValue: number = 25

  //   for (let el of schemaTypes[key]){
  //     console.log(el)
  //     let newTypeFieldNode: NodeObj = {
  //       id: el + '_field' + key + '_parent',
  //       position: {x: fieldInTypeXValue, y: fieldInTypeYValue},
  //       data: { label: el, arguments: [] }, // add required arguments here
  //       parentNode: key,
  //       extent: 'parent',
  //       // hidden: true, // hidden at first, unhidden when a field from the query type with the matching type is clicked
  //     }
  //     fieldInTypeYValue += 50
      

  //     initialNodes.push(newTypeFieldNode)
  //     // nodeState.push(newTypeNode)
  //     console.log(initialNodes)
  //   }
  //   // setNodes(nodeState)
  // }}

  // fit view on load
  // const onLoad= (instance:any) => setTimeout(() => instance.fitView(), 0);
  return (
    <>
        <div className="ml-4">
              {/* <div key={index}>
                <h3>{type}:</h3> */}

                <ul>
                    <div className="w-full h-[722px] border-2 border-blue-950 rounded-lg shadow p-2 mb-5 dark:border-white">
                    <ReactFlow
                      // onLoad={onLoad}
                      nodes={nodes}
                      edges={edges}
                      onNodesChange={onNodesChange}
                      onEdgesChange={onEdgesChange}
                      //onConnect={onConnect}
                      //
                      onNodeClick={onNodeClick}
                      fitView

                      nodeTypes={nodeTypes}
                    >
                      <Controls className="dark:bg-slate-300"/>
                      <MiniMap className="dark:bg-slate-300"/>
                      {/* removed the TS error here that was caused by the variant */}
                      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                    </ReactFlow>
                  </div>
                </ul>
              </div>
      {/* </></div> */}
    </>
  );
}
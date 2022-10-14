const rootDiv = document.createElement('div')
rootDiv.id = 'root'
document.body.appendChild(rootDiv)

import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import './boxes.css'



function AudioParamBox(props) {
    const [editMode, setEditMode] = useState(false)
    const name = props.name
    const value = props.value
    return <div className="wa-audio-param" name={name}>
        <span onClick={() => props.audioParamClicked(name)}>~{name}</span> <span>{value.toString().slice(0, 8)} </span>
    </div>
}
function InputBox(props) {
    const num = props.num
    return <div className="wa-audio-input" name={num}>
        <p onClick={() => props.inputClicked(num)}>~{num}</p>
    </div>
}
function OutputBox(props) {
    const num = props.num
    return <div className="wa-audio-output" name={num}>
        <p onClick={() => props.outputClicked(num)}>{num}~</p>
    </div>
}

function AudioNodeOscillatorBox(props) {

    const [left, top] = props.position.map(x => x + 'px')
    const node = props.node

    const [type, setType] = useState("sine")
    const types = ["sine", "square", "sawtooth", "triangle"]
    const audioNodeName = "oscillator"
    const typeList = types.map((type) =>
        <option key={type}> {type}</option>
    );

    const audioParamClicked = name => props.audioParamClicked({ id: props.id, audioParam: name })
    const outputClicked = num => props.outputClicked({ id: props.id, num })

    return (
        <div className="wa-audio-node movable" id={props.id} style={{ left, top }}>
            <h1>{audioNodeName}</h1>
            <select>{typeList}</select>
            <AudioParamBox audioParamClicked={audioParamClicked} name="detune" value={node.audioParams.detune}></AudioParamBox>
            <AudioParamBox audioParamClicked={audioParamClicked} name="frequency" value={node.audioParams.frequency}></AudioParamBox>
            <OutputBox outputClicked={outputClicked} num="1"></OutputBox>
        </div>
    )
}

function AudioNodeGainBox(props) {
    const [left, top] = props.position.map(x => x + 'px')

    const audioParamClicked = name => props.audioParamClicked({ id: props.id, audioParam: name })
    const inputClicked = num => props.inputClicked({ id: props.id, num })
    const outputClicked = num => props.outputClicked({ id: props.id, num })

    const audioNodeName = "gain"
    return (
        <div className="wa-audio-node movable" id={props.id} style={{ left, top }}>
            <h1>{audioNodeName}</h1>
            <InputBox inputClicked={inputClicked} num="1"></InputBox>
            <AudioParamBox audioParamClicked={audioParamClicked} name="gain" value={props.node.audioParams.gain}></AudioParamBox>
            <OutputBox outputClicked={outputClicked} num="1"></OutputBox>
        </div>
    )
}
function AudioNodeDelayBox(props) {
    const [left, top] = props.position.map(x => x + 'px')

    const audioParamClicked = name => props.audioParamClicked({ id: props.id, audioParam: name })
    const outputClicked = num => props.outputClicked({ id: props.id, num })
    const inputClicked = num => props.inputClicked({ id: props.id, num })

    const audioNodeName = "delay"
    return (
        <div className="wa-audio-node movable" id={props.id} style={{ left, top }}>
            <h1>{audioNodeName}</h1>
            <InputBox inputClicked={inputClicked} num="1"></InputBox>
            <AudioParamBox audioParamClicked={audioParamClicked} name="delayTime" value={props.node.audioParams.delayTime}></AudioParamBox>
            <OutputBox outputClicked={outputClicked} num="1"></OutputBox>
        </div>
    )
}
function AudioNodeBiquadFilterBox(props) {
    const [left, top] = props.position.map(x => x + 'px')

    const audioParamClicked = name => props.audioParamClicked({ id: props.id, audioParam: name })
    const inputClicked = num => props.inputClicked({ id: props.id, num })
    const outputClicked = num => props.outputClicked({ id: props.id, num })

    const audioNodeName = "biquad"
    return (
        <div className="wa-audio-node movable" id={props.id} style={{ left, top }}>
            <h1>{audioNodeName}</h1>
            <InputBox inputClicked={inputClicked} num="1"></InputBox>
            <AudioParamBox audioParamClicked={audioParamClicked} name="frequency" value={props.node.audioParams.frequency}></AudioParamBox>
            <AudioParamBox audioParamClicked={audioParamClicked} name="detune" value={props.node.audioParams.detune}></AudioParamBox>
            <AudioParamBox audioParamClicked={audioParamClicked} name="Q" value={props.node.audioParams.Q}></AudioParamBox>
            <AudioParamBox audioParamClicked={audioParamClicked} name="gain" value={props.node.audioParams.gain}></AudioParamBox>
            <OutputBox outputClicked={outputClicked} num="1"></OutputBox>
        </div>
    )
}
function AudioNodeDynamicsCompressorBox(props) {
    const [left, top] = props.position.map(x => x + 'px')

    const inputClicked = num => props.inputClicked({ id: props.id, num })
    const outputClicked = num => props.outputClicked({ id: props.id, num })

    const audioParamClicked = name => props.audioParamClicked({ id: props.id, audioParam: name })
    const audioNodeName = "compressor"
    return (
        <div className="wa-audio-node movable" id={props.id} style={{ left, top }}>
            <h1>{audioNodeName}</h1>
            <InputBox inputClicked={inputClicked} num="1"></InputBox>
            <AudioParamBox audioParamClicked={audioParamClicked} name="threshold" value={props.node.audioParams.threshold}></AudioParamBox>
            <AudioParamBox audioParamClicked={audioParamClicked} name="knee" value={props.node.audioParams.knee}></AudioParamBox>
            <AudioParamBox audioParamClicked={audioParamClicked} name="ratio" value={props.node.audioParams.ratio}></AudioParamBox>
            <AudioParamBox audioParamClicked={audioParamClicked} name="attack" value={props.node.audioParams.attack}></AudioParamBox>
            <AudioParamBox audioParamClicked={audioParamClicked} name="release" value={props.node.audioParams.release} ></AudioParamBox>
            <OutputBox outputClicked={outputClicked} num="1"></OutputBox>
        </div>
    )
}
function AudioNodeConstantSourceBox(props) {
    const [left, top] = props.position.map(x => x + 'px')

    const audioParamClicked = name => props.audioParamClicked({ id: props.id, audioParam: name })
    const outputClicked = num => props.outputClicked({ id: props.id, num })

    const audioNodeName = "constant"
    return (
        <div className="wa-audio-node movable" id={props.id} style={{ left, top }}>
            <h1>{audioNodeName}</h1>
            <AudioParamBox audioParamClicked={audioParamClicked} name="offset" value={props.node.audioParams.offset}></AudioParamBox>
            <OutputBox outputClicked={outputClicked} num="1"></OutputBox>
        </div>
    )
}
function AudioNodePannerBox(props) {
    const [left, top] = props.position.map(x => x + 'px')

    const inputClicked = num => props.inputClicked({ id: props.id, num })
    const outputClicked = num => props.outputClicked({ id: props.id, num })

    const audioParamClicked = name => props.audioParamClicked({ id: props.id, audioParam: name })
    const audioNodeName = "panner"
    return (
        <div className="wa-audio-node movable" id={props.id} style={{ left, top }}>
            <h1>{audioNodeName}</h1>
            <InputBox inputClicked={inputClicked} num="1"></InputBox>
            <AudioParamBox audioParamClicked={audioParamClicked} name="positionX" value={props.node.audioParams.positionX}></AudioParamBox>
            <AudioParamBox audioParamClicked={audioParamClicked} name="positionY" value={props.node.audioParams.positionY}></AudioParamBox>
            <AudioParamBox audioParamClicked={audioParamClicked} name="positionZ" value={props.node.audioParams.positionZ}></AudioParamBox>
            <AudioParamBox audioParamClicked={audioParamClicked} name="orientationX" value={props.node.audioParams.orientationX}></AudioParamBox>
            <AudioParamBox audioParamClicked={audioParamClicked} name="orientationY" value={props.node.audioParams.orientationY}></AudioParamBox>
            <AudioParamBox audioParamClicked={audioParamClicked} name="orientationZ" value={props.node.audioParams.orientationZ}></AudioParamBox>
            <OutputBox outputClicked={outputClicked} num="1"></OutputBox>
        </div>
    )
}
function AudioNodeDestinationBox(props) {
    const [left, top] = props.position.map(x => x + 'px')

    const audioParamClicked = name => props.audioParamClicked({ id: props.id, audioParam: name })
    const inputClicked = num => props.inputClicked({ id: props.id, num })
    const outputClicked = num => props.outputClicked({ id: props.id, num })

    const audioNodeName = "destination"
    return (
        <div className="wa-audio-node movable" id={props.id} style={{ left, top }}>
            <h1>{audioNodeName}</h1>
            <InputBox inputClicked={inputClicked} num="1"></InputBox>
        </div>
    )
}
/*
function AudioNodeGainBox(props) {
    const [left, top] = props.position.map(x => x + 'px')

    const audioParamClicked = name => props.audioParamClicked({ id: props.id, audioParam: name })
    const inputClicked = num => props.inputClicked({ id: props.id, num })
    const outputClicked = num => props.outputClicked({ id: props.id, num })

    const audioNodeName = "gain"
    return (
        <div className="wa-audio-node movable" id={props.id} style={{ left, top }}>
            <h1>{audioNodeName}</h1>
            <InputBox inputClicked={inputClicked} num="1"></InputBox>
            <AudioParamBox audioParamClicked={audioParamClicked} name="gain" value={props.node.audioParams.gain}></AudioParamBox>
            <OutputBox outputClicked={outputClicked} num="1"></OutputBox>
        </div>
    )
}*/

function AudioNodeAnalyserBox(props) {
    const [left, top] = props.position.map(x => x + 'px')

    const audioParamClicked = name => props.audioParamClicked({ id: props.id, audioParam: name })
    const inputClicked = num => props.inputClicked({ id: props.id, num })
    const outputClicked = num => props.outputClicked({ id: props.id, num })

    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const analyserNode = props.liveNode
        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const loopState = rafLoop((dt, t) => {
            updateView(ctx, analyserNode, dataArray)
        })
        return () => {
            loopState.halt = true
        }
    })

    const audioNodeName = "analyser"
    return (
        <div className="wa-audio-node movable" id={props.id} style={{ left, top }}>
            <h1>{audioNodeName}</h1>
            <InputBox inputClicked={inputClicked} num="1"></InputBox>
            <canvas ref={canvasRef} width="100" height="100" />
            <OutputBox outputClicked={outputClicked} num="1"></OutputBox>
        </div>
    )
}

import { Bus } from './lib/bus.js'

export const refreshUIBus = new Bus()

import { addOrRemoveConnection } from './import.js';
import { rafLoop } from './lib/loop';
import { updateView } from './audiolib/graphicAnalyzer';

const ConnectionManager = (synth) => {

    console.log('create con man')


    let lastInput = undefined
    let lastOutput = undefined
    const maybeCreate = () => {
        console.log('create with', { lastInput, lastOutput, synth })

        const r = addOrRemoveConnection(synth, lastOutput, lastInput)
        if (r) {
            lastInput = undefined
            lastOutput = undefined
        }
    }
    const inputClick = (v) => {
        lastInput = v
        maybeCreate()
    }
    const outputClick = (v) => {
        lastOutput = v
        maybeCreate()
    }
    return {
        inputClick,
        outputClick
    }
}

function Synth() {

    const [descriptionNodes, setDescriptionNodes] = useState([])
    const [liveNodes, setLiveNodes] = useState([])
    const [positions, setPositions] = useState({})
    const [synthState, setSynthState] = useState()
    const [connectionManager, setConnectionManager] = useState()

    useEffect(() => {
        function onSynthChange(value) {
            //console.log('synth updated', value)
            setDescriptionNodes(value.description.nodes)
            setPositions(value.description.positions)
            setSynthState(value.state)
            setConnectionManager(ConnectionManager(value))
            setLiveNodes(value.nodes)
        }
        refreshUIBus.addListener(onSynthChange)
        return function cleanup() {
            refreshUIBus.removeListener(onSynthChange)
        }
    })

    const audioParamClicked = (v) => {
        console.log('you clac ap ', v)
        connectionManager?.inputClick(v)
    }
    const inputClicked = (v) => {
        console.log('you clac input', v)
        connectionManager?.inputClick(v)
    }
    const outputClicked = v => {
        console.log('you clac output', v)
        connectionManager?.outputClick(v)
    }

    const boxes = descriptionNodes?.map((node) => {
        const id = node.id
        const position = positions[id]
        if (node.type === 'Oscillator') {
            return <AudioNodeOscillatorBox outputClicked={outputClicked} inputClicked={inputClicked} audioParamClicked={audioParamClicked} key={id} id={id} position={position} node={node} />
        } else if (node.type === 'Delay') {
            return <AudioNodeDelayBox outputClicked={outputClicked} inputClicked={inputClicked} audioParamClicked={audioParamClicked} key={id} id={id} position={position} node={node} />
        } else if (node.type === 'Destination') {
            return <AudioNodeDestinationBox outputClicked={outputClicked} inputClicked={inputClicked} audioParamClicked={audioParamClicked} key={id} id={id} position={position} node={node} />
        } else if (node.type === 'BiquadFilter') {
            return <AudioNodeBiquadFilterBox outputClicked={outputClicked} inputClicked={inputClicked} audioParamClicked={audioParamClicked} key={id} id={id} position={position} node={node} />
        } else if (node.type === 'DynamicsCompressor') {
            return <AudioNodeDynamicsCompressorBox outputClicked={outputClicked} inputClicked={inputClicked} audioParamClicked={audioParamClicked} key={id} id={id} position={position} node={node} />
        } else if (node.type === 'ConstantSource') {
            return <AudioNodeConstantSourceBox outputClicked={outputClicked} inputClicked={inputClicked} audioParamClicked={audioParamClicked} key={id} id={id} position={position} node={node} />
        } else if (node.type === 'Panner') {
            return <AudioNodePannerBox outputClicked={outputClicked} inputClicked={inputClicked} audioParamClicked={audioParamClicked} key={id} id={id} position={position} node={node} />
        } else if (node.type === 'Gain') {
            return <AudioNodeGainBox outputClicked={outputClicked} inputClicked={inputClicked} audioParamClicked={audioParamClicked} key={id} id={id} position={position} node={node} />
        } else if (node.type === 'Analyser') {
            return <AudioNodeAnalyserBox liveNode={liveNodes[id]} outputClicked={outputClicked} inputClicked={inputClicked} key={id} id={id} position={position} node={node} />
        }
    })

    /*    const description = synth.description
        updater.onupdate = () => {
    
        }
      */
    return (

        <>
            <pre>{synthState}</pre>
            {boxes}
        </>
        // { synth ? (<AudioNodeOscillatorBox />) : (<AudioNodeDelayBox />) }
    )
    /*.description?.nodes.forEach( node =>
    <AudioNodeOscillatorBox/>
*/
    //<><AudioNodeOscillatorBox /><AudioNodeDelayBox /><AudioNodeGainBox /><AudioNodeBiquadFilterBox /><AudioNodeDynamicsCompressorBox /><AudioNodeDynamicsConstantSourceBox /><AudioNodePannerBox /><AudioNodeDestinationBox /></>
    //  )
}
const root = createRoot(document.getElementById('root'));
root.render(<Synth />)

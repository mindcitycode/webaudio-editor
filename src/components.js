const rootDiv = document.createElement('div')
rootDiv.id = 'root'
document.body.appendChild(rootDiv)

import React, { useState, useEffect, useRef, useReducer } from 'react';
import { createRoot } from 'react-dom/client';
import { Bus } from './lib/bus.js'
import './boxes.css'


function AudioParamBox(props) {
    const name = props.name
    const value = props.value
    const changedAudioParam = (e) => {
        const value = parseFloat(e.target.value)
        if (!isNaN(value)) {
            props.changedAudioParam({ audioParamName: name, audioParamValue: value })
        } 1
    }
    return <div className="wa-audio-param" name={name}>
        <span onClick={() => props.audioParamClicked(name)}>~{name}</span> <input onChange={changedAudioParam} defaultValue={value.toString().slice(0, 8)} />
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

    const clicked = () => props.setSelectedBox(props.id)
    const audioParamClicked = name => props.audioParamClicked({ id: props.id, audioParam: name })
    const outputClicked = num => props.outputClicked({ id: props.id, num })
    const changedAudioParam = pv => props.changedAudioParam({ ...pv, id: props.id })
    const changedStandardParam = standardParamName => e => props.changedStandardParam({ id: props.id, standardParamName, value: e.target.value })
    return (
        <div onClick={clicked} className={"wa-audio-node movable " + selectedClass(props)} id={props.id} style={{ left, top }}>
            <h1>{audioNodeName}</h1>
            <select onChange={changedStandardParam('type')} value={node.props.type}   >{typeList}</select>
            <AudioParamBox changedAudioParam={changedAudioParam} audioParamClicked={audioParamClicked} name="detune" value={node.audioParams.detune}></AudioParamBox>
            <AudioParamBox changedAudioParam={changedAudioParam} audioParamClicked={audioParamClicked} name="frequency" value={node.audioParams.frequency}></AudioParamBox>
            <OutputBox outputClicked={outputClicked} num="1"></OutputBox>
        </div>
    )
}

function AudioNodeGainBox(props) {
    const [left, top] = props.position.map(x => x + 'px')

    const audioParamClicked = name => props.audioParamClicked({ id: props.id, audioParam: name })
    const inputClicked = num => props.inputClicked({ id: props.id, num })
    const outputClicked = num => props.outputClicked({ id: props.id, num })
    const clicked = () => props.setSelectedBox(props.id)
    const changedAudioParam = pv => props.changedAudioParam({ ...pv, id: props.id })

    const audioNodeName = "gain"
    return (
        <div onClick={clicked} className={"wa-audio-node movable " + selectedClass(props)} id={props.id} style={{ left, top }}>
            <h1>{audioNodeName}</h1>
            <InputBox inputClicked={inputClicked} num="1"></InputBox>
            <AudioParamBox changedAudioParam={changedAudioParam} audioParamClicked={audioParamClicked} name="gain" value={props.node.audioParams.gain}></AudioParamBox>
            <OutputBox outputClicked={outputClicked} num="1"></OutputBox>
        </div>
    )
}
function AudioNodeDelayBox(props) {
    const [left, top] = props.position.map(x => x + 'px')

    const audioParamClicked = name => props.audioParamClicked({ id: props.id, audioParam: name })
    const outputClicked = num => props.outputClicked({ id: props.id, num })
    const inputClicked = num => props.inputClicked({ id: props.id, num })
    const clicked = () => props.setSelectedBox(props.id)
    const changedAudioParam = pv => props.changedAudioParam({ ...pv, id: props.id })

    const audioNodeName = "delay"
    return (
        <div onClick={clicked} className={"wa-audio-node movable " + selectedClass(props)} id={props.id} style={{ left, top }}>
            <h1>{audioNodeName}</h1>
            <InputBox inputClicked={inputClicked} num="1"></InputBox>
            <AudioParamBox changedAudioParam={changedAudioParam} audioParamClicked={audioParamClicked} name="delayTime" value={props.node.audioParams.delayTime}></AudioParamBox>
            <OutputBox outputClicked={outputClicked} num="1"></OutputBox>
        </div>
    )
}
function AudioNodeBiquadFilterBox(props) {
    const [left, top] = props.position.map(x => x + 'px')

    const audioParamClicked = name => props.audioParamClicked({ id: props.id, audioParam: name })
    const inputClicked = num => props.inputClicked({ id: props.id, num })
    const outputClicked = num => props.outputClicked({ id: props.id, num })
    const clicked = () => props.setSelectedBox(props.id)
    const changedAudioParam = pv => props.changedAudioParam({ ...pv, id: props.id })

    const audioNodeName = "biquad"
    return (
        <div onClick={clicked} className={"wa-audio-node movable " + selectedClass(props)} id={props.id} style={{ left, top }}>
            <h1>{audioNodeName}</h1>
            <InputBox inputClicked={inputClicked} num="1"></InputBox>
            <AudioParamBox changedAudioParam={changedAudioParam} audioParamClicked={audioParamClicked} name="frequency" value={props.node.audioParams.frequency}></AudioParamBox>
            <AudioParamBox changedAudioParam={changedAudioParam} audioParamClicked={audioParamClicked} name="detune" value={props.node.audioParams.detune}></AudioParamBox>
            <AudioParamBox changedAudioParam={changedAudioParam} audioParamClicked={audioParamClicked} name="Q" value={props.node.audioParams.Q}></AudioParamBox>
            <AudioParamBox changedAudioParam={changedAudioParam} audioParamClicked={audioParamClicked} name="gain" value={props.node.audioParams.gain}></AudioParamBox>
            <OutputBox outputClicked={outputClicked} num="1"></OutputBox>
        </div>
    )
}
function AudioNodeDynamicsCompressorBox(props) {
    const [left, top] = props.position.map(x => x + 'px')

    const inputClicked = num => props.inputClicked({ id: props.id, num })
    const outputClicked = num => props.outputClicked({ id: props.id, num })

    const clicked = () => props.setSelectedBox(props.id)
    const audioParamClicked = name => props.audioParamClicked({ id: props.id, audioParam: name })
    const changedAudioParam = pv => props.changedAudioParam({ ...pv, id: props.id })
    const audioNodeName = "compressor"
    return (
        <div onClick={clicked} className={"wa-audio-node movable " + selectedClass(props)} id={props.id} style={{ left, top }}>
            <h1>{audioNodeName}</h1>
            <InputBox inputClicked={inputClicked} num="1"></InputBox>
            <AudioParamBox changedAudioParam={changedAudioParam} audioParamClicked={audioParamClicked} name="threshold" value={props.node.audioParams.threshold}></AudioParamBox>
            <AudioParamBox changedAudioParam={changedAudioParam} audioParamClicked={audioParamClicked} name="knee" value={props.node.audioParams.knee}></AudioParamBox>
            <AudioParamBox changedAudioParam={changedAudioParam} audioParamClicked={audioParamClicked} name="ratio" value={props.node.audioParams.ratio}></AudioParamBox>
            <AudioParamBox changedAudioParam={changedAudioParam} audioParamClicked={audioParamClicked} name="attack" value={props.node.audioParams.attack}></AudioParamBox>
            <AudioParamBox changedAudioParam={changedAudioParam} audioParamClicked={audioParamClicked} name="release" value={props.node.audioParams.release} ></AudioParamBox>
            <OutputBox outputClicked={outputClicked} num="1"></OutputBox>
        </div>
    )
}
function AudioNodeConstantSourceBox(props) {
    const [left, top] = props.position.map(x => x + 'px')

    const audioParamClicked = name => props.audioParamClicked({ id: props.id, audioParam: name })
    const outputClicked = num => props.outputClicked({ id: props.id, num })
    const clicked = () => props.setSelectedBox(props.id)
    const changedAudioParam = pv => props.changedAudioParam({ ...pv, id: props.id })

    const audioNodeName = "constant"
    return (
        <div onClick={clicked} className={"wa-audio-node movable " + selectedClass(props)} id={props.id} style={{ left, top }}>
            <h1>{audioNodeName}</h1>
            <AudioParamBox changedAudioParam={changedAudioParam} audioParamClicked={audioParamClicked} name="offset" value={props.node.audioParams.offset}></AudioParamBox>
            <OutputBox outputClicked={outputClicked} num="1"></OutputBox>
        </div>
    )
}
function AudioNodePannerBox(props) {
    const [left, top] = props.position.map(x => x + 'px')

    const inputClicked = num => props.inputClicked({ id: props.id, num })
    const outputClicked = num => props.outputClicked({ id: props.id, num })
    const clicked = () => props.setSelectedBox(props.id)

    const audioParamClicked = name => props.audioParamClicked({ id: props.id, audioParam: name })
    const changedAudioParam = pv => props.changedAudioParam({ ...pv, id: props.id })
    const audioNodeName = "panner"
    return (
        <div onClick={clicked} className={"wa-audio-node movable " + selectedClass(props)} id={props.id} style={{ left, top }}>
            <h1>{audioNodeName}</h1>
            <InputBox inputClicked={inputClicked} num="1"></InputBox>
            <AudioParamBox changedAudioParam={changedAudioParam} audioParamClicked={audioParamClicked} name="positionX" value={props.node.audioParams.positionX}></AudioParamBox>
            <AudioParamBox changedAudioParam={changedAudioParam} audioParamClicked={audioParamClicked} name="positionY" value={props.node.audioParams.positionY}></AudioParamBox>
            <AudioParamBox changedAudioParam={changedAudioParam} audioParamClicked={audioParamClicked} name="positionZ" value={props.node.audioParams.positionZ}></AudioParamBox>
            <AudioParamBox changedAudioParam={changedAudioParam} audioParamClicked={audioParamClicked} name="orientationX" value={props.node.audioParams.orientationX}></AudioParamBox>
            <AudioParamBox changedAudioParam={changedAudioParam} audioParamClicked={audioParamClicked} name="orientationY" value={props.node.audioParams.orientationY}></AudioParamBox>
            <AudioParamBox changedAudioParam={changedAudioParam} audioParamClicked={audioParamClicked} name="orientationZ" value={props.node.audioParams.orientationZ}></AudioParamBox>
            <OutputBox outputClicked={outputClicked} num="1"></OutputBox>
        </div>
    )
}
function AudioNodeDestinationBox(props) {
    const [left, top] = props.position.map(x => x + 'px')

    const audioParamClicked = name => props.audioParamClicked({ id: props.id, audioParam: name })
    const inputClicked = num => props.inputClicked({ id: props.id, num })
    const outputClicked = num => props.outputClicked({ id: props.id, num })
    const clicked = () => { } // props.setSelectedBox(props.id) CANNOT REMOVE
    const changedAudioParam = pv => props.changedAudioParam({ ...pv, id: props.id })

    const audioNodeName = "destination"
    return (
        <div onClick={clicked} className={"wa-audio-node movable " + selectedClass(props)} id={props.id} style={{ left, top }}>
            <h1>{audioNodeName}</h1>
            <InputBox inputClicked={inputClicked} num="1"></InputBox>
        </div>
    )
}
const selectedClass = props => props.isSelected ? "wa-audio-node-selected" : ""

function AudioNodeAnalyserBox(props) {
    const [left, top] = props.position.map(x => x + 'px')

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
    const clicked = () => props.setSelectedBox(props.id)
    const audioNodeName = "analyser"
    return (
        <div onClick={clicked} className={"wa-audio-node movable " + selectedClass(props)} id={props.id} style={{ left, top }}>
            <h1>{audioNodeName}</h1>
            <InputBox inputClicked={inputClicked} num="1"></InputBox>
            <canvas ref={canvasRef} width="100" height="100" />
            <OutputBox outputClicked={outputClicked} num="1"></OutputBox>
        </div>
    )
}


export const refreshUIBus = new Bus()


const AddBox = props => {
    const available = [
        'Oscillator',
        'Delay',
        'Destination',
        'BiquadFilter',
        'DynamicsCompressor',
        'ConstantSource',
        'Panner',
        'Gain',
        'Analyser',
    ]
    const create = type => () => props.createAudioNode(type)
    const buttons = available.map(type => <button key={type} onClick={create(type)}>{type} </button>)
    return <div className='create-toolbar'>{buttons}</div>
}

import { addOrRemoveConnection, loadAudioNode, removeAudioNodeConnections } from './import.js';
import { rafLoop } from './lib/loop';
import { updateView } from './audiolib/graphicAnalyzer';
import { getScrollPosition } from './lib/dom.js';

const ConnectionManager = (synth) => {

    let lastInput = undefined
    let lastOutput = undefined
    const maybeCreate = () => {
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
    const removeAudioNode = id => {
        removeAudioNodeConnections(synth, id)
    }
    const getConnections = () => {
        return synth.description.connections
    }
    return {
        inputClick,
        outputClick,
        removeAudioNode,
        getConnections
    }
}


const SaveBox = (props) => {
    return <div className='file-toolbar'>
        <button className='save-to-clipboard-button' onClick={props.copyToClipBoard}>
            copy to clipboard
        </button>
    </div>
}

function Synth() {

    const [descriptionNodes, setDescriptionNodes] = useState([])
    const [liveNodes, setLiveNodes] = useState([])
    const [positions, setPositions] = useState({})
    const [synthState, setSynthState] = useState()
    const [connectionManager, setConnectionManager] = useState()
    const [selectedBoxId, setSelectedBoxId] = useState()
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    useEffect(() => {
        const onSynthChange = (synth) => {
            //console.log('synth updated', value)
            setDescriptionNodes(synth.description.nodes)
            setPositions(synth.description.positions)
            setSynthState(synth.state)
            setConnectionManager(ConnectionManager(synth))
            setLiveNodes(synth.nodes)
        }
        const onkeypress = e => {
            if (e.repeat) return
            if (e.code === 'Delete') {
                const descriptionNodeIndex = descriptionNodes.findIndex(descriptionNode => descriptionNode.id === selectedBoxId)
                if (descriptionNodeIndex >= 0) {

                    // remove from description nodes
                    descriptionNodes.splice(descriptionNodeIndex, 1)
                    setDescriptionNodes(descriptionNodes)

                    // remove from description connections
                    connectionManager.removeAudioNode(selectedBoxId)

                    // remove live node
                    const liveNode = liveNodes[selectedBoxId]
                    if (liveNode.stop) liveNode.stop()
                    liveNode.disconnect()
                    forceUpdate()
                }
            }
        }
        document.body.addEventListener('keydown', onkeypress)
        refreshUIBus.addListener(onSynthChange)

        return function cleanup() {
            refreshUIBus.removeListener(onSynthChange)
            document.body.removeEventListener('keydown', onkeypress)
        }

    })

    const audioParamClicked = v => connectionManager?.inputClick(v)
    const inputClicked = v => connectionManager?.inputClick(v)
    const outputClicked = v => connectionManager?.outputClick(v)

    const setSelectedBox = id => {
        if (selectedBoxId === id) {
            setSelectedBoxId(undefined)
        } else {
            setSelectedBoxId(id)
        }

    }
    const changedAudioParam = cap => {

        // set live audionode param
        const liveNode = liveNodes[cap.id]
        liveNode[cap.audioParamName].value = parseFloat(cap.audioParamValue)

        // set description
        const descriptionNodeIndex = descriptionNodes.findIndex(dn => dn.id === cap.id)
        if (descriptionNodeIndex >= 0) {
            descriptionNodes[descriptionNodeIndex].audioParams[cap.audioParamName] = cap.audioParamValue
        }

    }
    const createAudioNode = type => {
        const descriptionNode = { id: Math.random(), type }
        descriptionNodes.push(descriptionNode)
        setDescriptionNodes(descriptionNodes)
        const scrollPosition = getScrollPosition()
        positions[descriptionNode.id] = [scrollPosition.x + 150, scrollPosition.y + 50]
        loadAudioNode(liveNodes, descriptionNode)
        forceUpdate()
    }
    const copyToClipBoard = async () => {

        // collect positions
        const positions = {}
        descriptionNodes.map(descriptionNode => descriptionNode.id).forEach(id => {
            // method1
            const domNode = document.getElementById(id)
            const rect = domNode.getBoundingClientRect()
            const scroll = getScrollPosition()
            const rectx = rect.x + scroll.x
            const recty = rect.y + scroll.y

            positions[id.toString()] = [rectx, recty]
            // method2
            /*
            const x = parseFloat(domNode.style.left)
            const y = parseFloat(domNode.style.top)
            return [x,y]
            */
        })
        const savable = {
            nodes: descriptionNodes,
            connections: connectionManager.getConnections(),
            positions: positions
        }
        console.log('C', savable.connections)
        const done = await navigator.clipboard.writeText(JSON.stringify(savable))
    }
    const changedStandardParam = p => {
        const { id, standardParamName, value } = p
        // description 
        const descriptionNode = descriptionNodes.find(descriptionNode => descriptionNode.id === id)
        if (descriptionNode) descriptionNode.props[standardParamName] = value
        // live node
        const liveNode = liveNodes[id]
        if (liveNode) liveNode[standardParamName] = value

        console.log('changed standard', p)
    }
    const boxes = descriptionNodes?.map((node) => {
        const id = node.id
        const position = positions[id]
        const isSelected = selectedBoxId === id
        if (node.type === 'Oscillator') {
            return <AudioNodeOscillatorBox changedStandardParam={changedStandardParam} changedAudioParam={changedAudioParam} isSelected={isSelected} setSelectedBox={setSelectedBox} outputClicked={outputClicked} inputClicked={inputClicked} audioParamClicked={audioParamClicked} key={id} id={id} position={position} node={node} />
        } else if (node.type === 'Delay') {
            return <AudioNodeDelayBox changedAudioParam={changedAudioParam} isSelected={isSelected} setSelectedBox={setSelectedBox} outputClicked={outputClicked} inputClicked={inputClicked} audioParamClicked={audioParamClicked} key={id} id={id} position={position} node={node} />
        } else if (node.type === 'Destination') {
            return <AudioNodeDestinationBox changedAudioParam={changedAudioParam} isSelected={isSelected} setSelectedBox={setSelectedBox} outputClicked={outputClicked} inputClicked={inputClicked} audioParamClicked={audioParamClicked} key={id} id={id} position={position} node={node} />
        } else if (node.type === 'BiquadFilter') {
            return <AudioNodeBiquadFilterBox changedAudioParam={changedAudioParam} isSelected={isSelected} setSelectedBox={setSelectedBox} outputClicked={outputClicked} inputClicked={inputClicked} audioParamClicked={audioParamClicked} key={id} id={id} position={position} node={node} />
        } else if (node.type === 'DynamicsCompressor') {
            return <AudioNodeDynamicsCompressorBox changedAudioParam={changedAudioParam} isSelected={isSelected} setSelectedBox={setSelectedBox} outputClicked={outputClicked} inputClicked={inputClicked} audioParamClicked={audioParamClicked} key={id} id={id} position={position} node={node} />
        } else if (node.type === 'ConstantSource') {
            return <AudioNodeConstantSourceBox changedAudioParam={changedAudioParam} isSelected={isSelected} setSelectedBox={setSelectedBox} outputClicked={outputClicked} inputClicked={inputClicked} audioParamClicked={audioParamClicked} key={id} id={id} position={position} node={node} />
        } else if (node.type === 'Panner') {
            return <AudioNodePannerBox changedAudioParam={changedAudioParam} isSelected={isSelected} setSelectedBox={setSelectedBox} outputClicked={outputClicked} inputClicked={inputClicked} audioParamClicked={audioParamClicked} key={id} id={id} position={position} node={node} />
        } else if (node.type === 'Gain') {
            return <AudioNodeGainBox changedAudioParam={changedAudioParam} isSelected={isSelected} setSelectedBox={setSelectedBox} outputClicked={outputClicked} inputClicked={inputClicked} audioParamClicked={audioParamClicked} key={id} id={id} position={position} node={node} />
        } else if (node.type === 'Analyser') {
            return <AudioNodeAnalyserBox changedAudioParam={changedAudioParam} isSelected={isSelected} setSelectedBox={setSelectedBox} liveNode={liveNodes[id]} outputClicked={outputClicked} inputClicked={inputClicked} key={id} id={id} position={position} node={node} />
        }
    })

    return (

        <>
            <AddBox createAudioNode={createAudioNode} />
            <SaveBox copyToClipBoard={copyToClipBoard} />
            <pre>{synthState}</pre>
            {boxes}

        </>
        // { synth ? (<AudioNodeOscillatorBox />) : (<AudioNodeDelayBox />) }
    )
}
const root = createRoot(document.getElementById('root'));
root.render(<Synth />)

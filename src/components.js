const rootDiv = document.createElement('div')
rootDiv.id = 'root'
document.body.appendChild(rootDiv)

import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './boxes.css'
function AudioParamBox(props) {
    const [editMode, setEditMode] = useState(false)
    const name = props.name
    const value = props.value
    const editionClick = () => {
        setEditMode(!editMode)
    }
    const editionEnter = (e) => {
        if (e.key === 'Enter') {
            setEditMode(false)
        }
    }
//    <input type="text" onKeyDown={editionEnter} ></input>
    return <div className="wa-audio-param" name={name}>
        <p onClick={editionClick}>~{name} {value} {Math.random().toString()}</p>
    </div>
}
function InputBox(props) {
    const num = props.num
    return <div className="wa-audio-input" name={num}>
        <p>~{num}</p>
    </div>
}
function OutputBox(props) {
    const num = props.num
    return <div className="wa-audio-output" name={num}>
        <p>{num}~</p>
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
    return (
        <div className="wa-audio-node movable" id={props.id} style={{ left, top }}>
            <h1>{audioNodeName}</h1>
            <select>{typeList}</select>
            <AudioParamBox name="detune"></AudioParamBox>
            <AudioParamBox name="frequency" value={node.audioParams.frequency}></AudioParamBox>
            <OutputBox num="1"></OutputBox>
        </div>
    )
}

function AudioNodeGainBox(props) {
    const [left, top] = props.position.map(x => x + 'px')

    const audioNodeName = "gain"
    return (
        <div className="wa-audio-node movable" id={props.id} style={{ left, top }}>
            <h1>{audioNodeName}</h1>
            <InputBox num="1"></InputBox>
            <AudioParamBox name="gain"></AudioParamBox>
            <OutputBox num="1"></OutputBox>
        </div>
    )
}
function AudioNodeDelayBox(props) {
    const [left, top] = props.position.map(x => x + 'px')

    const audioNodeName = "delay"
    return (
        <div className="wa-audio-node movable" id={props.id} style={{ left, top }}>
            <h1>{audioNodeName}</h1>
            <InputBox num="1"></InputBox>
            <AudioParamBox name="delayTime"></AudioParamBox>
            <OutputBox num="1"></OutputBox>
        </div>
    )
}
function AudioNodeBiquadFilterBox(props) {
    const [left, top] = props.position.map(x => x + 'px')

    const audioNodeName = "biquad"
    return (
        <div className="wa-audio-node movable" id={props.id} style={{ left, top }}>
            <h1>{audioNodeName}</h1>
            <InputBox num="1"></InputBox>
            <AudioParamBox name="frequency"></AudioParamBox>
            <AudioParamBox name="detune"></AudioParamBox>
            <AudioParamBox name="Q"></AudioParamBox>
            <AudioParamBox name="gain"></AudioParamBox>
            <OutputBox num="1"></OutputBox>
        </div>
    )
}
function AudioNodeDynamicsCompressorBox(props) {
    const [left, top] = props.position.map(x => x + 'px')

    const audioNodeName = "compressor"
    return (
        <div className="wa-audio-node movable" id={props.id} style={{ left, top }}>
            <h1>{audioNodeName}</h1>
            <InputBox num="1"></InputBox>
            <AudioParamBox name="threshold"></AudioParamBox>
            <AudioParamBox name="knee"></AudioParamBox>
            <AudioParamBox name="ratio"></AudioParamBox>
            <AudioParamBox name="attack"></AudioParamBox>
            <AudioParamBox name="release"></AudioParamBox>
            <OutputBox num="1"></OutputBox>
        </div>
    )
}
function AudioNodeDynamicsConstantSourceBox(props) {
    const [left, top] = props.position.map(x => x + 'px')

    const audioNodeName = "constant"
    return (
        <div className="wa-audio-node movable" id={props.id} style={{ left, top }}>
            <h1>{audioNodeName}</h1>
            <AudioParamBox name="offset"></AudioParamBox>
            <OutputBox num="1"></OutputBox>
        </div>
    )
}
function AudioNodePannerBox(props) {
    const [left, top] = props.position.map(x => x + 'px')

    const audioNodeName = "panner"
    return (
        <div className="wa-audio-node movable" id={props.id} style={{ left, top }}>
            <h1>{audioNodeName}</h1>
            <InputBox num="1"></InputBox>
            <AudioParamBox name="positionx"></AudioParamBox>
            <AudioParamBox name="positiony"></AudioParamBox>
            <AudioParamBox name="positionz"></AudioParamBox>
            <AudioParamBox name="orientationx"></AudioParamBox>
            <AudioParamBox name="orientationy"></AudioParamBox>
            <AudioParamBox name="orientationz"></AudioParamBox>
            <OutputBox num="1"></OutputBox>
        </div>
    )
}
function AudioNodeDestinationBox(props) {
    const [left, top] = props.position.map(x => x + 'px')

    const audioNodeName = "destination"
    return (
        <div className="wa-audio-node movable" id={props.id} style={{ left, top }}>
            <h1>{audioNodeName}</h1>
            <InputBox num="1"></InputBox>
        </div>
    )
}

const listeners = []
export const refreshUI = msg => listeners.forEach(f => f(msg))
const addListener = f => listeners.push(f)
const removeListener = f => listeners.splice(listeners.indexOf(f), 1)

function Synth() {

    const [descriptionNodes,setDescriptionNodes] = useState([])
    const [positions,setPositions] = useState({})
    const [synthState,setSynthState] = useState()

    useEffect(() => {
        function onSynthChange(value) {
            console.log('synth updated', value)
            setDescriptionNodes(value.description.nodes)
            setPositions(value.description.positions)
            setSynthState(value.state)
        }
        addListener(onSynthChange)
        return function cleanup() {
            removeListener(onSynthChange)
        }
    })

    const boxes = descriptionNodes?.map((node) => {
        const id  = node.id
        const position = positions[id]
        if (node.type === 'Oscillator') {
            return <AudioNodeOscillatorBox key={id} id={id} position={position} node={node} />
        } else if (node.type === 'Delay') {
            return <AudioNodeDelayBox key={id} id={id} position={position} />
        } else if (node.type === 'Destination') {
            return <AudioNodeDestinationBox key={id} id={id} position={position} />
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

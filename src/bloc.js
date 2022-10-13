// buffersource
// constant source
// analyser
// gain
// delay
// biquad
// dynamicsCOmpressor
// oscillator

const rootDiv = document.createElement('div')
rootDiv.id = 'root'
document.body.appendChild(rootDiv)

import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './boxes.css'
function AudioParamBox(props) {
    const name = props.name
    return <div className="wa-audio-param">
        <p>~{name}</p>
    </div>
}
function InputBox(props) {
    const num = props.num
    return <div className="wa-audio-input">
        <p>~{num}</p>
    </div>
}
function OutputBox(props) {
    const num = props.num
    return <div className="wa-audio-output">
        <p>{num}~</p>
    </div>
}

function mover() {

    let state = 'free'
    let audioNode = undefined

    const mousedown = (e) => {
        if (state === 'free') {
            let { target } = e
            while (true) {
                if (!target)
                    break;
                if (target && target?.classList?.contains("wa-audio-node")) {
                    audioNode = target
                    state = 'moving'
                    break;
                }
                target = target.parentNode
            }
        }
    }

    const mouseup = (e) => {
        if (state === 'moving') {
            state = 'free'
        }
    }
    const mousemove = (e) => {
        if (state === 'moving') {
            const { movementX, movementY } = e
            var rect = audioNode.getBoundingClientRect();
            const x = rect.left + movementX
            const y = rect.top + movementY
            audioNode.style.left = `${x}px`
            audioNode.style.top = `${y}px`
        }
    }
    document.addEventListener('mousedown', mousedown)
    document.addEventListener('mousemove', mousemove)
    document.addEventListener('mouseup', mouseup)
}
mover()


function AudioNodeOscillatorBox() {
    const [type, setType] = useState("sine")
    const types = ["sine", "square", "sawtooth", "triangle"]
    const audioNodeName = "oscillator"
    const typeList = types.map((type) =>
        <option key={type}> {type}</option>
    );
    return (
        <div className="wa-audio-node">
            <h1>{audioNodeName}</h1>
            <select>{typeList}</select>
            <AudioParamBox name="detune"></AudioParamBox>
            <AudioParamBox name="frequency"></AudioParamBox>
            <OutputBox num="1"></OutputBox>
        </div>
    )
}

function AudioNodeGainBox() {
    const audioNodeName = "gain"
    return (
        <div className="wa-audio-node">
            <h1>{audioNodeName}</h1>
            <InputBox num="1"></InputBox>
            <AudioParamBox name="gain"></AudioParamBox>
            <OutputBox num="1"></OutputBox>
        </div>
    )
}
function AudioNodeDelayBox() {
    const audioNodeName = "delay"
    return (
        <div className="wa-audio-node">
            <h1>{audioNodeName}</h1>
            <InputBox num="1"></InputBox>
            <AudioParamBox name="delayTime"></AudioParamBox>
            <OutputBox num="1"></OutputBox>
        </div>
    )
}
function AudioNodeBiquadFilterBox() {
    const audioNodeName = "BiquadFilter"
    return (
        <div className="wa-audio-node">
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
function AudioNodeDynamicsCompressorBox() {
    const audioNodeName = "DynamicsComp"
    return (
        <div className="wa-audio-node">
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
function AudioNodeDynamicsConstantSourceBox() {
    const audioNodeName = "Constant"
    return (
        <div className="wa-audio-node">
            <h1>{audioNodeName}</h1>
            <AudioParamBox name="offset"></AudioParamBox>
            <OutputBox num="1"></OutputBox>
        </div>
    )
}
function AudioNodePannerBox() {
    const audioNodeName = "Panner"
    return (
        <div className="wa-audio-node">
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


const root = createRoot(document.getElementById('root'));
root.render(<><AudioNodeOscillatorBox /><AudioNodeDelayBox /><AudioNodeGainBox /><AudioNodeBiquadFilterBox /><AudioNodeDynamicsCompressorBox /><AudioNodeDynamicsConstantSourceBox /><AudioNodePannerBox/></>);

export const Bloc = (createFn, audioNode) => {

    const $div = document.createElement('div')
    document.body.append($div)

    const $name = document.createElement('h1')
    $div.append($name)
    $name.textContent = createFn

    // console.log(createFn, audioNode)
    const { numberOfInputs, numberOfOutputs } = audioNode
    const $inout = document.createElement('h1')
    $div.append($inout)
    $inout.textContent = ['in', numberOfInputs, 'out', numberOfOutputs].join(" ")

    for (var audioNodePropName in audioNode) {
        const audioNodePropType = typeof audioNode[audioNodePropName]
        const audioNodePropConstructor = audioNode[audioNodePropName]?.constructor?.name
        if (audioNodePropConstructor === 'AudioParam') {
            const $inout = document.createElement('p')
            $div.append($inout)
            $inout.textContent = audioNodePropName


        }
    }

}
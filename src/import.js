import { getAudioNodeAudioParamNames } from "./inspect"
//const json0 = `{"nodes":[{"id":"0","type":"Oscillator","props":{"type":"sine"},"audioParams":{"frequency":1,"detune":0}},{"id":"1","type":"Oscillator","props":{"type":"sine"},"audioParams":{"frequency":301,"detune":0}},{"id":"2","type":"Delay","audioparams":{"delayTime":{"value":100}},"audioParams":{"delayTime":0}},{"id":"3","type":"Destination","audioParams":{}},{"id":"4","type":"BiquadFilter","audioParams":{"frequency":350,"detune":0,"Q":1,"gain":0}},{"id":"5","type":"DynamicsCompressor","audioParams":{"threshold":-24,"knee":30,"ratio":12,"attack":0.003000000026077032,"release":0.25}},{"id":"6","type":"ConstantSource","audioParams":{"offset":1}},{"id":"7","type":"Panner","audioParams":{"positionX":0,"positionY":0,"positionZ":0,"orientationX":1,"orientationY":0,"orientationZ":0}},{"id":"8","type":"Gain","audioParams":{"gain":0}},{"id":"9","type":"Analyser","props":{"fftsize":1024},"audioParams":{}},{"id":0.18588669028603766,"type":"Oscillator","audioParams":{"frequency":440,"detune":0}},{"id":0.8306788815611394,"type":"Delay","audioParams":{"delayTime":0}},{"id":0.2319616418614543,"type":"Analyser","audioParams":{}}],"connections":[[{"id":"1"},{"id":"8"}],[{"id":"2"},{"id":"3"}],[{"id":"0"},{"id":"8","audioParam":"gain"}],[{"id":"8"},{"id":"9"}],[{"id":"9"},{"id":"3"}],[{"id":0.18588669028603766,"num":"1"},{"id":0.8306788815611394,"num":"1"}],[{"id":0.8306788815611394,"num":"1"},{"id":0.2319616418614543,"num":"1"}]],"positions":{"0":[50,100],"1":[200,40],"2":[400,200],"3":[600,300],"4":[10,200],"5":[200,200],"6":[200,400],"7":[100,500],"8":[400,100],"9":[600,100],"0.18588669028603766":[329,361],"0.8306788815611394":[466,378],"0.2319616418614543":[412,450]}}`
//export const defaultSynthDescription = JSON.parse(json0)
export const defaultSynthDescription = {
    nodes: [
        { id: '0', type: 'Oscillator', props: { type: 'sine' }, audioParams: { frequency: 1 } },
        { id: '1', type: 'Oscillator', props: { type: 'square' }, audioParams: { frequency: 301 } },
        { id: '2', type: 'Delay', audioparams: { delayTime: { value: 100 } } },
        { id: '3', type: 'Destination' },
        { id: '4', type: 'BiquadFilter' },
        { id: '5', type: 'DynamicsCompressor' },
        { id: '6', type: 'ConstantSource' },
        { id: '7', type: 'Panner' },
        { id: '8', type: 'Gain', audioParams: { gain: 0 } },
        { id: '9', type: 'Analyser', props: { fftsize: 256 * 4 } }
    ],
    connections: [
        [{ id: '1' }, { id: '8' }],
        [{ id: '2' }, { id: '3' }],
        [{ id: '0' }, { id: '8', audioParam: 'gain' }],
        [{ id: '8' }, { id: '9' }],
        [{ id: '9' }, { id: '3' }],
    ],
    positions: {
        '0': [50, 100],
        '1': [200, 40],
        '2': [400, 200],
        '3': [600, 300],
        '4': [10, 200],
        '5': [200, 200],
        '6': [200, 400],
        '7': [100, 500],
        '8': [400, 100],
        '9': [600, 100],
    }
}
//console.log({defaultSynthDescription})

export const removeAudioNode = (ac, synth, nodeId) => {

    const { description, nodes } = synth

    // live
    const node = nodes[nodeId]
    if (node) {
        if (node.stop) node.stop()
        delete nodes[nodeId]
    }

    // description
    delete description.nodes[nodeId]
    description.connections = description.connections.filter(([[from, to]]) => {
        if ((from.id === nodeId) || (to.id === nodeId)) {

            nodes[from.id].disconnect(nodes[to.id])

            return false
        }
        return true
    })


}
///////////////// NOoooooooooooo!
let AC
export const loadAudioNode = (liveNodes, nodeDescription) => {
    ///////////////// NOoooooooooooo!
    const ac = AC
    const { type, id, props } = nodeDescription

    if (nodeDescription.audioParams === undefined) nodeDescription.audioParams = {}
    const { audioParams } = nodeDescription

    let node
    if (type === 'Destination') {
        node = ac.destination
    } else {
        const fn = `create${type}`
        node = ac[fn]()

        if (props) {
            for (let [name, value] of Object.entries(props)) {
                node[name] = value
            }
        } else {
            nodeDescription.props = {}
        }
        getAudioNodeAudioParamNames(node).forEach(apName => {
            if (audioParams[apName] !== undefined) {
                node[apName].value = audioParams[apName]
            } else {
                audioParams[apName] = node[apName].defaultValue
            }
        })
    }
    if (node.start) node.start()
    liveNodes[id] = node

}
export const loadAudioSynth = (ac, description) => {
    ///////////////// NOoooooooooooo!
    AC = ac
    const nodes = {}
    description.nodes.forEach((nodeDescription, nodeIndex) => {
        const { type, id, props } = nodeDescription
        if (nodeDescription.audioParams === undefined) nodeDescription.audioParams = {}
        const { audioParams } = nodeDescription

        let node
        if (type === 'Destination') {
            node = ac.destination
        } else {
            const fn = `create${type}`
            node = ac[fn]()

            if (props) {
                for (let [name, value] of Object.entries(props)) {
                    node[name] = value
                }
            }
            getAudioNodeAudioParamNames(node).forEach(apName => {
                if (audioParams[apName] !== undefined) {
                    node[apName].value = audioParams[apName]
                } else {
                    audioParams[apName] = node[apName].defaultValue
                }
            })
        }
        nodes[id] = node
    })

    description.connections.forEach(([from, to]) => {
        makeAudioConnection(nodes, from, to)
    })

    const synth = { description, nodes, state: 'ready' }
    console.log(synth)
    return synth
}

const findConnectionIndex = (connections, from, to) => connections.findIndex(existing => {
    return (existing[0].id === from.id)
        && (existing[1].id === to.id)
        && (existing[1].audioParam === to.audioParam)
})
export const addOrRemoveConnection = (synth, lastOutput, lastInput) => {
    if (lastInput && lastOutput && (lastInput.id !== lastOutput.id)) {
        const existingIndex = findConnectionIndex(synth.description.connections, lastOutput, lastInput)
        if (existingIndex >= 0) {
            // remove
            synth.description.connections.splice(existingIndex, 1)
            removeAudioConnection(synth.nodes, lastOutput, lastInput)
            return 'removed'
        } else {
            // add
            synth.description.connections.push([lastOutput, lastInput])
            makeAudioConnection(synth.nodes, lastOutput, lastInput)
            return 'added'
        }
    }
    return undefined
}

export const makeAudioConnection = (nodes, from, to) => {
    const fromId = from.id
    const toId = to.id
    if (to.audioParam) {
        nodes[fromId].connect(nodes[toId][to.audioParam])
    } else {
        nodes[fromId].connect(nodes[toId])
    }
}
export const removeAudioConnection = (nodes, from, to) => {
    const fromId = from.id
    const toId = to.id
    if (to.audioParam) {
        nodes[fromId].disconnect(nodes[toId][to.audioParam])
    } else {
        nodes[fromId].disconnect(nodes[toId])
    }

}
export const removeAudioNodeConnections = (synth, id) => {
    synth.description.connections = synth.description.connections.filter(([from, to]) => {
        return ((from.id !== id) && (to.id !== id))
    })
}
export const startAudioSynth = (synth) => {
    for (let [id, node] of Object.entries(synth.nodes)) {
        if (node.start) node.start()
    }
    synth.state = 'running'
}
export const stopAudioSynth = (synth) => {
    for (let [id, node] of Object.entries(synth.nodes)) {
        if (node.stop) node.stop()
    }
    synth.state = 'finished'
}
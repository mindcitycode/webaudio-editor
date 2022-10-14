import { getAudioNodeAudioParamNames } from "./inspect"

export const defaultSynthDescription = {
    nodes: [
        { id: '0', type: 'Oscillator', props: { type: 'sine' }, audioParams: { frequency: 300 } },
        { id: '1', type: 'Oscillator', props: { type: 'sine' }, audioParams: { frequency: 301 } },
        { id: '2', type: 'Delay', audioparams: { delayTime: { value: 100 } } },
        { id: '3', type: 'Destination' },
        { id: '4', type: 'BiquadFilter' },
        { id: '5', type: 'DynamicsCompressor' },
        { id: '6', type: 'ConstantSource' },
        { id: '7', type: 'Panner' },
        { id: '8', type: 'Gain' },

    ],
    connections: [
        [{ id: '0' }, { id: '1', audioParam: 'detune' }],
        [{ id: '1' }, { id: '2' }],
        [{ id: '2' }, { id: '3' }],
    ],
    positions: {
        '0': [10, 40],
        '1': [200, 100],
        '2': [400, 200],
        '3': [600, 300],
        '4': [10, 200],
        '5': [200, 200],
        '6': [200, 400],
        '7': [100, 500],
        '8': [300, 500],
    }
}

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

export const loadAudioSynth = (ac, description) => {
    /*
        // add default values in description
        getAudioNodeAudioParamNames(node).forEach(apName => {
            console.log(apName)
            const defaultValue = node[apName].defaultValue
            if ((audioParams === undefined) || (audioParams[apName] === undefined)) {
                description.nodes[nodeIndex].audioParams[apName] = defaultValue
            }
        })
    })
    */
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
        makeAudioConnection(nodes,from,to)
        /*
        const fromId = from.id
        const toId = to.id
        if (to.audioParam) {
            nodes[fromId].connect(nodes[toId][to.audioParam])
        } else {
            nodes[fromId].connect(nodes[toId])
        }*/
    })

    const synth = { description, nodes, state: 'ready' }
    console.log(synth)
    return synth
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
export const removeAudioConnection = (nodes,from,to) => {
    const fromId = from.id
    const toId = to.id
    if (to.audioParam) {
        nodes[fromId].disconnect(nodes[toId][to.audioParam])
    } else {
        nodes[fromId].disconnect(nodes[toId])
    }

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
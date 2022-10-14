export const defaultSynthDescription = {
    nodes: [
        { id: '0', type: 'Oscillator', props: { type: 'sine' }, audioParams: { frequency: 300 } },
        { id: '1', type: 'Oscillator', props: { type: 'sine' }, audioParams: { frequency: 301 } },
        { id: '2', type: 'Delay', audioparams: { delayTime: { value: 100 } } },
        { id: '3', type: 'Destination' }
    ],
    connections: [
        [{ id: '0' }, { id: '1', audioParam: 'detune' }],
        [{ id: '1' }, { id: '2' }],
        [{ id: '2' }, { id: '3' }],
    ],
    positions: {
        '0': [10, 10],
        '1': [200, 100],
        '2': [400, 200],
        '3': [600, 300],
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

    const nodes = {}
    description.nodes.forEach(({ type, id, props, audioParams }) => {
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
            if (audioParams) {
                for (let [name, value] of Object.entries(audioParams)) {
                    node[name].value = value
                }
            }
        }
        nodes[id] = node
    })

    description.connections.forEach(([from, to]) => {
        const fromId = from.id
        const toId = to.id
        if (to.audioParam) {
            nodes[fromId].connect(nodes[toId][to.audioParam])
        } else {
            nodes[fromId].connect(nodes[toId])
        }
    })

    console.log(nodes)
    return { description, nodes, state: 'ready' }
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
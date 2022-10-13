export const defaultSynthDescription = {
    nodes: [
        { id: '0', type: 'Oscillator', props: { type: 'sine' }, audioParams: { frequency: 300 } },
        { id: '1', type: 'Oscillator', props: { type: 'sine' }, audioParams: { frequency: 301 } },
        { id: '2', type: 'Delay', audioparams: { delayTime: { value: 100 } } },
        { id: '3', type: 'Destination' }
    ],
    connections: [
        ['0', '3'],
        ['1', '2'],
        ['2', '3'],
    ],
    positions: {
        '0': [10, 10],
        '1': [200, 200],
        '2': [400, 400],
        '3': [500, 500],
    }
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

    description.connections.forEach(([fromId, toId]) => {
        nodes[fromId].connect(nodes[toId])
    })

    console.log(nodes)
    return { description, nodes, state : 'ready' }
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
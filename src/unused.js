
const unused = async () => {
    const ac = await waitAudioContext()
    //OneAudioWorket(ac)
    //   TwoAudioWorket(ac)
    // console.log(ac)
    const blackList = ['createMediaElementSource', 'createMediaStreamSource', 'createMediaStreamTrackSource', 'createBuffer', 'createIIRFilter', 'createPeriodicWave']

    const parsed = {}
    for (var createFn in ac) {
        if (createFn.startsWith('create')) {
            parsed[createFn] = { unfit: [] }

            if (blackList.includes(createFn))
                continue;

            const audioNode = ac[createFn]()
            const $bloc = Bloc(createFn, audioNode)
            //parsed[createFn] = {}
            for (var audioNodePropName in audioNode) {
                const audioNodePropType = typeof audioNode[audioNodePropName]
                const audioNodePropConstructor = audioNode[audioNodePropName]?.constructor?.name

                let k = audioNodePropConstructor
                if (k) {
                    if (parsed[createFn][k] === undefined) {
                        parsed[createFn][k] = {}
                    }
                    parsed[createFn][k][audioNodePropName] = 1

                } else {
                    parsed[createFn].unfit.push(audioNodePropName)
                }

                //            console.log(audioNodePropName, audioNodePropType, audioNodePropConstructor)
                //console.log(audioNodePropName, typeof audioNode[audioNodePropName], audioNode[audioNodePropName].constructor.name)
            }
        }

    }
    // console.log(parsed)
    // document.body.innerHTML = JSON.stringify(parsed)
}


import { getAudioNodeAudioParamNames } from './inspect.js'
export const Bloc = (createFn, audioNode) => {
}
/*
export const Bloc = (createFn, audioNode) => {

    {
        const aps = getAudioNodeAudioParamNames(audioNode)
        aps.forEach(apName => {
            const ap = audioNode[apName]
            console.log(apName, ap)
        })
        console.log('aps', aps)
    }

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
*/


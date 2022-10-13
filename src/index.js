//import 'litegraph.js/src/litegraph.css'
import { waitAudioContext } from './lib/waitAudioContext'

import { Bloc } from './bloc.js'



import './components.js'
const go = async () => {

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
go()
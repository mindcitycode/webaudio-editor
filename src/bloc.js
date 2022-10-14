import { getScrollPosition } from './dom.js'

function mover() {

    let state = 'free'
    let audioNode = undefined

    const getMovableParent = (target) => {
        while (true) {
            if (!target)
                break;
            if (target.classList?.contains("movable")) {
                return target
            }
            target = target.parentNode
        }
        return target
    }

    const mousedown = (e) => {
        if (state === 'free') {
            const p = getMovableParent(e.target)
            if (p) {
                audioNode = p
                state = 'moving'
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
            //if (audioNode === undefined) mouseup()

            const { movementX, movementY } = e
            var rect = audioNode.getBoundingClientRect();
            const scroll = getScrollPosition()

            const x = Math.max(0,rect.left + movementX + scroll.x)
            const y = Math.max(0,rect.top + movementY + scroll.y)
            
            audioNode.style.left = `${x}px`
            audioNode.style.top = `${y}px`
        }
    }
    document.addEventListener('mousedown', mousedown)
    document.addEventListener('mousemove', mousemove)
    document.addEventListener('mouseup', mouseup)
}
mover()


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


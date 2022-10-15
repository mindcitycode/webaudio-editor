import { getScrollPosition } from './lib/dom.js'

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
import { rafLoop } from './lib/loop.js'
import {getScrollPosition} from './dom.js'

export const ConnectionCanvas = ( getLinks ) => {
    const canvas = document.createElement('canvas')
    canvas.classList.add('link')
    document.body.append(canvas)
    const ctx = canvas.getContext('2d')

    const resize = () => {
        if ((canvas.width !== window.innerWidth) || (canvas.height !== window.innerHeight)) {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
    }

    rafLoop((delta, time) => {
        resize()
        const topleft = getScrollPosition()
        canvas.style.left = `${topleft.x}px`
        canvas.style.top = `${topleft.y}px`
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        getLinks().forEach(({ from, to }) => {
            ctx.strokeStyle = 'black'
            ctx.beginPath()
            ctx.moveTo(from.x, from.y)
            const sw = to.x - from.x
            ctx.bezierCurveTo(
                from.x + sw, from.y,
                to.x - sw, to.y,
                to.x, to.y,
            )
            ctx.stroke()
        })
    })
}


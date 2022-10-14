export const rafLoop = f => {
    let state = { halt: true }
    const frame = () => {
        const time = performance.now()
        const dt = time - lastTime
        f(dt / 1000, time / 1000)
        lastTime = time
        if (!state.halt) requestAnimationFrame(frame)
    }
    let lastTime = performance.now()
    requestAnimationFrame(frame)
    return state
}
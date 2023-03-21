// ————————————————————————————————————————————————————————————————————————————————
// 
// ————————————————————————————————————————————————————————————————————————————————
const audio = new Audio()

// ————————————————————————————————————————————————————————————————————————————————
// Listen for messages from the extension
// ————————————————————————————————————————————————————————————————————————————————
chrome.runtime.onMessage.addListener(msg => {
    if ('play' in msg) playAudio(msg.play)
    else if ('pause' in msg) pauseAudio()
})

// Play sound with access to DOM APIs
function playAudio({ source, volume }) {
    // const audio = new Audio(source)
    if (!audio.paused) audio.pause() 
    audio.src = source
    audio.volume = volume
    audio.play()
}

// ————————————————————————————————————————————————————————————————————————————————
// 
// ————————————————————————————————————————————————————————————————————————————————
function pauseAudio() {
    audio.pause()
}
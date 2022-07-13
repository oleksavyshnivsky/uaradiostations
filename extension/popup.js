// ————————————————————————————————————————————————————————————————————————————————
// popup.html також використовує common.js
// ————————————————————————————————————————————————————————————————————————————————

// Показати список станцій із зірками нагорі
showStationList('popup')

document.getElementById('btn-options').onclick = e => {
	chrome.runtime.openOptionsPage()
}

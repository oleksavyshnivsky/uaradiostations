// ————————————————————————————————————————————————————————————————————————————————
// popup.html також використовує common.js
// ————————————————————————————————————————————————————————————————————————————————
// ————————————————————————————————————————————————————————————————————————————————
// Показ списку станцій
// ————————————————————————————————————————————————————————————————————————————————
function showStationList() {
	// stations_wrapper.innerHTML = ''
	chrome.storage.local.get(['stations'], function(result) {
		STATIONS = result.stations

		STATIONS.forEach(station => {
			var station_wrapper = document.importNode(tpl, true)
			station_wrapper.querySelector('[data-station-id]').dataset.stationId = station.url
			station_wrapper.querySelector('[data-station-title]').innerText = station.title
			station_wrapper.querySelector('[data-station-title]').title = station.title
			station_wrapper.querySelector('[data-station-title]').onclick = doPlayAction
			station_wrapper.querySelector('[data-station-url]').dataset.stationUrl = station.url
			station_wrapper.querySelector('[data-station-url]').onclick = doPlayAction
			station_wrapper.querySelector('[data-station-website]').href = station.website
			station_wrapper.querySelector('[data-station-fav]').dataset.stationFav = station.fav
			stations_wrapper.appendChild(station_wrapper)
		})

		// Оновлення статусу програвання
		updateNowPlaying()
	})
}

// ————————————————————————————————————————————————————————————————————————————————
// Показати список станцій із Вибраними нагорі
// ————————————————————————————————————————————————————————————————————————————————
showStationList()

// ————————————————————————————————————————————————————————————————————————————————
// Перехід на Налаштування
// ————————————————————————————————————————————————————————————————————————————————
document.getElementById('btn-options').onclick = e => {
	chrome.runtime.openOptionsPage()
}

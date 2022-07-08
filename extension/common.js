// ————————————————————————————————————————————————————————————————————————————————
// Спільні дії для popup.js і options.js
// ————————————————————————————————————————————————————————————————————————————————

// Ідентифікатор планового закриття сповіщення
var timeout_id

// Закриття сповіщення
function hideMsgbox() {
	Array.from(document.getElementsByClassName('show')).forEach(
		el => el.classList.remove('show', 'success', 'error')
	)
}

// Мова інтерфейсу — виставлення текстівок при завантаженні popup/options
Array.from(document.querySelectorAll('[data-i18n]')).forEach(el => {
	el.innerText = chrome.i18n.getMessage(el.dataset.i18n)
})


// ————————————————————————————————————————————————————————————————————————————————
// Періодичне оновлення списку станцій з онлайн-джерела
// ————————————————————————————————————————————————————————————————————————————————
chrome.storage.local.get(['lastupdate'], async function(result) {
	var now = Math.round(new Date().getTime() / 1000)

	if (!result.lastupdate || now - result.lastupdate >= 3600) {
	// if (!result.lastupdate || now - result.lastupdate >= 1) {
		let response = await fetch('https://ovyshnivsky.pp.ua/uaradiostations/active.json')
		if (response.ok) {
			// get the response body (the method explained below)
			let STATIONS = await response.json()

			chrome.storage.local.set({stations: STATIONS, lastupdate: now}, function() {
				// console.log('Value is set to ' + STATIONS);
			})

			updateStationList()
			updateStationStatus()
		} else {
			alert("HTTP-Error: " + response.status)
		}
	}
})


// ————————————————————————————————————————————————————————————————————————————————
// ДОПОМІЖНІ ФУНКЦІЇ
// ————————————————————————————————————————————————————————————————————————————————
const stations_wrapper = document.getElementById('stations-wrapper')
const tpl = document.getElementById('tpl-station').content.querySelector('div')

function updateStationList() {
	stations_wrapper.innerHTML = ''
	chrome.storage.local.get(['stations'], function(result) {
		result.stations.forEach(station => {
			var station_wrapper = document.importNode(tpl, true)
			station_wrapper.querySelector('[data-station-title]').innerText = station.title
			station_wrapper.querySelector('[data-station-url]').dataset.stationUrl = station.url
			station_wrapper.querySelector('[data-station-url]').onclick = e => {
				e.stopPropagation()

				document.querySelectorAll('button[class*="bi-stop-circle"').forEach(el => {
					el.classList.remove('bi-stop-circle', 'text-danger')
					el.classList.add('bi-play-circle-fill', 'text-success')
				})
				
				chrome.extension.sendRequest({
					url: e.target.dataset.stationUrl,
				}, function(response) {
					// console.log(response)
					if (response.status) {
						e.target.classList.add('bi-stop-circle', 'text-danger')
						e.target.classList.remove('bi-play-circle-fill', 'text-success')
					} else {
						e.target.classList.add('bi-play-circle-fill', 'text-success')
						e.target.classList.remove('bi-stop-circle', 'text-danger')
					}
				})
			}
			stations_wrapper.appendChild(station_wrapper)
		})
	})
}


function updateStationStatus() {
	chrome.extension.sendRequest({
		url: '',
	}, function(response) {
		// console.log(response)
		document.querySelectorAll('button.bi-stop-circle:not([data-station-url="'+response.url+'"])').forEach(el => {
			el.classList.remove('bi-stop-circle', 'text-danger')
			el.classList.add('bi-play-circle-fill', 'text-success')
		})
		if (response.status) {
			document.querySelectorAll('button[data-station-url="'+response.url+'"]').forEach(el => {
				el.classList.remove('bi-play-circle-fill', 'text-success')
				el.classList.add('bi-stop-circle', 'text-danger')
			})
		}
	})
}

updateStationList()
updateStationStatus()

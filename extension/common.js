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

Array.from(document.querySelectorAll('[data-i18n-title]')).forEach(el => {
	el.title = chrome.i18n.getMessage(el.dataset.i18nTitle)
})


// ————————————————————————————————————————————————————————————————————————————————
// Оновлення списку станцій з онлайн-джерела
// ————————————————————————————————————————————————————————————————————————————————
async function fetchODEStationList() {
	let response = await fetch('https://oleksavyshnivsky.github.io/uaradiostations/defaultstations.json')
	if (response.ok) {
		let STATIONS_DOWNLOADED = await response.json()
		document.getElementById('userdata').value = JSON.stringify(STATIONS_DOWNLOADED)
	}
}

// ————————————————————————————————————————————————————————————————————————————————
// Оновлення списку станцій з текстового поля
// ————————————————————————————————————————————————————————————————————————————————
function updateStationList() {
	var now = Math.round(new Date().getTime() / 1000)

	try {
		let STATIONS = JSON.parse(document.getElementById('userdata').value)
		chrome.storage.local.set({stations: STATIONS, lastupdate: now}, function() {
			// console.log('Value is set to ' + STATIONS);
		})
		showStationList()
		update_wrapper.style.display = 'none'
	} catch (error) {
		alert(chrome.i18n.getMessage('notajson'))
	}
}


// chrome.storage.local.get(['lastupdate'], async function(result) {
// 	var now = Math.round(new Date().getTime() / 1000)

// 	if (!result.lastupdate || now - result.lastupdate >= 3600) {
// 	// if (!result.lastupdate || now - result.lastupdate >= 1) {
// 	}
// })


// ————————————————————————————————————————————————————————————————————————————————
// ДОПОМІЖНІ ФУНКЦІЇ
// ————————————————————————————————————————————————————————————————————————————————
const nowplaying_wrapper = document.getElementById('nowplaying-wrapper')
const nowplaying_button = document.getElementById('nowplaying-button')
const nowplaying_title = document.getElementById('nowplaying-title')
const nowplaying_website = document.getElementById('nowplaying-website')
const stations_wrapper = document.getElementById('stations-wrapper')
const update_wrapper = document.getElementById('update-wrapper')
const tpl = document.getElementById('tpl-station').content.querySelector('div')
let STATIONS = []

nowplaying_button.onclick = doPlayAction
nowplaying_title.onclick = doPlayAction

// ————————————————————————————————————————————————————————————————————————————————
// Стилі кнопки програвання
// 	el — цільова кнопка
// 	status — статус програвання (bool)
// ————————————————————————————————————————————————————————————————————————————————
function updateClasses(el, status) {
	if (status) {
		el.classList.remove('bi-play-circle-fill', 'text-success')
		el.classList.add('bi-stop-circle-fill', 'text-danger')
	} else {
		el.classList.remove('bi-stop-circle-fill', 'text-danger')
		el.classList.add('bi-play-circle-fill', 'text-success')
	}
}

// ————————————————————————————————————————————————————————————————————————————————
// Вмикання/вимикання програвання
// ————————————————————————————————————————————————————————————————————————————————
function doPlayAction(e) {
	var wrapper = e.target.closest('[data-station-i]')
	var station_i = wrapper.dataset.stationI
	var station = STATIONS[station_i]

	nowplaying_wrapper.dataset.stationI = station_i
	nowplaying_button.dataset.stationUrl = station.url
	nowplaying_title.title = nowplaying_title.innerText = station.title
	nowplaying_website.href = station.website

	document.querySelectorAll('.bi-stop-circle-fill').forEach(el => updateClasses(el, 0))

	chrome.extension.sendRequest({
		url: station.url,
	}, function(response) {
		if (response.status) {
			document.querySelectorAll('[data-station-i="'+station_i+'"] button').forEach(
				el => updateClasses(el, 1)
			)
		}
	})
}

// ————————————————————————————————————————————————————————————————————————————————
// Показ списку станцій
// ————————————————————————————————————————————————————————————————————————————————
function showStationList() {
	stations_wrapper.innerHTML = ''
	chrome.storage.local.get(['stations'], function(result) {
		STATIONS = result.stations
		STATIONS.forEach((station, station_i) => {
			var station_wrapper = document.importNode(tpl, true)
			station_wrapper.querySelector('[data-station-i]').dataset.stationI = station_i
			station_wrapper.querySelector('[data-station-title]').innerText = station.title
			station_wrapper.querySelector('[data-station-title]').title = station.title
			station_wrapper.querySelector('[data-station-title]').onclick = doPlayAction
			station_wrapper.querySelector('[data-station-url]').dataset.stationUrl = station.url
			station_wrapper.querySelector('[data-station-url]').onclick = doPlayAction
			station_wrapper.querySelector('[data-station-website]').href = station.website
			stations_wrapper.appendChild(station_wrapper)
		})
		document.getElementById('userdata').value = JSON.stringify(STATIONS)
		// Оновлення статусу програвання
		chrome.extension.sendRequest({
			url: '',
		}, function(response) {
			if (response.status) {
				STATIONS.every((station, station_i) => {
					if (station.url === response.url) {
						nowplaying_wrapper.dataset.stationI = station_i
						nowplaying_button.dataset.stationUrl = station.url
						nowplaying_title.title = nowplaying_title.innerText = station.title
						nowplaying_website.href = station.website
						
						document.querySelectorAll('[data-station-i="'+station_i+'"] button').forEach(
							el => updateClasses(el, 1)
						)

						return false
					} else return true
					return 
				})
			}
		})
	})
}


// ————————————————————————————————————————————————————————————————————————————————
// Керування оновленням списку станцій
// ————————————————————————————————————————————————————————————————————————————————
function toggleEditor() {
	update_wrapper.style.display = update_wrapper.style.display === '' ? 'none' : ''
	if (update_wrapper.style.display === '') update_wrapper.scrollIntoView()
}
document.querySelectorAll('.btn-toggle-editor').forEach(el => {
	el.onclick = toggleEditor
})

document.getElementById('btn-update-stations').onclick = updateStationList

document.getElementById('btn-fetch-standard').onclick = fetchODEStationList

// ————————————————————————————————————————————————————————————————————————————————
// СТАРТОВІ ДІЇ
// ————————————————————————————————————————————————————————————————————————————————
showStationList()

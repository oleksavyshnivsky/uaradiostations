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
// Оновлення списку станцій з онлайн-джерела
// ————————————————————————————————————————————————————————————————————————————————
async function fetchODEStationList() {
	let response = await fetch('https://ovyshnivsky.pp.ua/uaradiostations/active.json')
	if (response.ok) {
		let STATIONS = await response.json()
		document.getElementById('userdata').value = JSON.stringify(STATIONS)
	}

	// if (response.ok) {
	// 	let STATIONS = await response.json()
	// 	var now = Math.round(new Date().getTime() / 1000)
	// 	chrome.storage.local.set({stations: STATIONS, lastupdate: now}, function() {
	// 		// console.log('Value is set to ' + STATIONS);
	// 	})
	// 	showStationList()
	// 	updateStationPlayStatus()
	// 	update_wrapper.style.display = 'none'
	// } else {
	// 	alert("HTTP-Error: " + response.status)
	// }
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
		updateStationPlayStatus()
		update_wrapper.style.display = 'none'
	} catch (error) {
		alert('Введений текст не є правильним JSON-масивом')
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
const stations_wrapper = document.getElementById('stations-wrapper')
const update_wrapper = document.getElementById('update-wrapper')
const tpl = document.getElementById('tpl-station').content.querySelector('div')

// ————————————————————————————————————————————————————————————————————————————————
// Стилі кнопки програвання
// 	el — цільова кнопка
// 	status — статус програвання (bool)
// ————————————————————————————————————————————————————————————————————————————————
function updateClasses(el, status) {
	if (status) {
		el.classList.remove('bi-play-circle-fill', 'text-success')
		el.classList.add('bi-stop-circle', 'text-danger')
	} else {
		el.classList.remove('bi-stop-circle', 'text-danger')
		el.classList.add('bi-play-circle-fill', 'text-success')
	}
}

// ————————————————————————————————————————————————————————————————————————————————
// Вмикання/вимикання програвання
// ————————————————————————————————————————————————————————————————————————————————
function doPlayAction(e) {
	var el = document.querySelector('.bi-stop-circle')
	if (el) updateClasses(el, 0)

	chrome.extension.sendRequest({
		url: e.target.dataset.stationUrl,
	}, function(response) {
		updateClasses(e.target, response.status) 
	})
}

// ————————————————————————————————————————————————————————————————————————————————
// Показ списку станцій
// ————————————————————————————————————————————————————————————————————————————————
function showStationList() {
	stations_wrapper.innerHTML = ''
	chrome.storage.local.get(['stations'], function(result) {
		result.stations.forEach(station => {
			var station_wrapper = document.importNode(tpl, true)
			station_wrapper.querySelector('[data-station-title]').innerText = station.title
			station_wrapper.querySelector('[data-station-url]').dataset.stationUrl = station.url
			station_wrapper.querySelector('[data-station-url]').onclick = doPlayAction
			stations_wrapper.appendChild(station_wrapper)
			// -
			station_wrapper.querySelector('span').onclick = e => {
				station_wrapper.querySelector('[data-station-url]').click()
			}
			// -
		})
		document.getElementById('userdata').value = JSON.stringify(result.stations)
	})
}

// ————————————————————————————————————————————————————————————————————————————————
// Оновлення статусу програвання
// ————————————————————————————————————————————————————————————————————————————————
function updateStationPlayStatus() {
	var el = document.querySelector('.bi-stop-circle')
	if (el) updateClasses(el, 0)

	chrome.extension.sendRequest({
		url: '',
	}, function(response) {
		if (response.status) {
			var el = document.querySelector('button[data-station-url="'+response.url+'"]')
			if (el) updateClasses(el, 1)
		}
	})
}


// ————————————————————————————————————————————————————————————————————————————————
// Керування оновленням списку станцій
// ————————————————————————————————————————————————————————————————————————————————
function toggleEditor() {
	update_wrapper.style.display = update_wrapper.style.display === '' ? 'none' : ''
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
updateStationPlayStatus()

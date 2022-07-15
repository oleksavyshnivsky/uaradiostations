// ————————————————————————————————————————————————————————————————————————————————
// Спільні дії для popup.js і options.js
// ————————————————————————————————————————————————————————————————————————————————

const nowplaying_wrapper = document.getElementById('nowplaying-wrapper')
const nowplaying_button = document.getElementById('nowplaying-button')
const nowplaying_title = document.getElementById('nowplaying-title')
const nowplaying_website = document.getElementById('nowplaying-website')
const stations_wrapper = document.getElementById('stations-wrapper')
const update_wrapper = document.getElementById('update-wrapper')
const tpl = document.getElementById('tpl-station').content.querySelector('div')
let STATIONS = []

// ———————————————————————————————————————————————————————————————————————————————— 
// Мова інтерфейсу — виставлення текстівок при завантаженні popup/options
// ————————————————————————————————————————————————————————————————————————————————
Array.from(document.querySelectorAll('[data-i18n]')).forEach(el => {
	el.innerText = chrome.i18n.getMessage(el.dataset.i18n)
})

Array.from(document.querySelectorAll('[data-i18n-title]')).forEach(el => {
	el.title = chrome.i18n.getMessage(el.dataset.i18nTitle)
})

Array.from(document.querySelectorAll('template')).forEach(tpl => {
	Array.from(tpl.content.querySelectorAll('[data-i18n]')).forEach(el => {
		el.innerText = chrome.i18n.getMessage(el.dataset.i18n)
	})

	Array.from(tpl.content.querySelectorAll('[data-i18n-title]')).forEach(el => {
		el.title = chrome.i18n.getMessage(el.dataset.i18nTitle)
	})	
})

// ————————————————————————————————————————————————————————————————————————————————
// Оновлення списку станцій з текстового поля
// ————————————————————————————————————————————————————————————————————————————————
function updateStationList() {
	try {
		let STATIONS = JSON.parse(document.getElementById('userdata').value)
		saveStationListInLS()
		showStationList()
		update_wrapper.style.display = 'none'
	} catch (error) {
		alert(chrome.i18n.getMessage('notajson'))
	}
}


// ————————————————————————————————————————————————————————————————————————————————
// ДОПОМІЖНІ ФУНКЦІЇ
// ————————————————————————————————————————————————————————————————————————————————


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
	var url = wrapper.querySelector('[data-station-url]').dataset.stationUrl
	if (url) {
		STATIONS.forEach((station, station_i) => {
			if (station.url === url) {
				nowplaying_wrapper.dataset.stationI = station_i
				nowplaying_button.dataset.stationUrl = station.url
				nowplaying_title.title = nowplaying_title.innerText = station.title
				nowplaying_website.href = station.website

				document.querySelectorAll('.bi-stop-circle-fill').forEach(el => updateClasses(el, 0))

				chrome.extension.sendRequest({
					url: station.url,
				}, function(response) {
					if (response.status) {
						document.querySelectorAll('[data-station-i="'+station_i+'"] [data-station-url]').forEach(
							el => updateClasses(el, 1)
						)
					}
				})
			}
			return station.url !== url
		})
	}
}


// ————————————————————————————————————————————————————————————————————————————————
// Оновлення статусу програвання
// ————————————————————————————————————————————————————————————————————————————————
function updateNowPlaying() {
	document.querySelectorAll('.bi-stop-circle-fill').forEach(
		el => updateClasses(el.closest('[data-station-url]'), 0)
	)

	chrome.extension.sendRequest({
		url: '',
	}, function(response) {
		STATIONS.every((station, station_i) => {
			if (station.url === response.url) {
				nowplaying_wrapper.dataset.stationI = station_i
				nowplaying_button.dataset.stationUrl = station.url
				nowplaying_title.title = nowplaying_title.innerText = station.title
				nowplaying_website.href = station.website
				
				document.querySelectorAll('[data-station-i="'+station_i+'"] [data-station-url]').forEach(
					el => updateClasses(el, response.status)
				)

				return false
			} else return true
			return 
		})
	})
}

// ————————————————————————————————————————————————————————————————————————————————
// Керування оновленням списку станцій
// ————————————————————————————————————————————————————————————————————————————————
// function toggleEditor() {
// 	update_wrapper.style.display = update_wrapper.style.display === '' ? 'none' : ''
// 	if (update_wrapper.style.display === '') {
// 		document.getElementById('userdata').value = JSON.stringify(STATIONS)
// 		update_wrapper.scrollIntoView()
// 	}
// }
// document.querySelectorAll('.btn-toggle-editor').forEach(el => {
// 	el.onclick = toggleEditor
// })


// ————————————————————————————————————————————————————————————————————————————————
// СТАРТОВІ ДІЇ
// ————————————————————————————————————————————————————————————————————————————————
// Див. popup.js / options.js
nowplaying_button.onclick = doPlayAction
nowplaying_title.onclick = doPlayAction

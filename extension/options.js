// ————————————————————————————————————————————————————————————————————————————————
// options.html також використовує common.js
// ————————————————————————————————————————————————————————————————————————————————
const form_editor = document.getElementById('form-editor')
let FILTERS = []

// ————————————————————————————————————————————————————————————————————————————————
// Збереження списку станцій у локальному сховищі
// ————————————————————————————————————————————————————————————————————————————————
function saveStationListInLS() {
	STATIONS.forEach(station => {
		if (typeof station.fav === 'undefined') station.fav = false
	})
	// Сортування за обраністю й абеткою
	STATIONS.sort((a, b) => {
		if (a.fav === b.fav) {
			return a.title.localeCompare(b.title)
		} else {
			return (a.fav < b.fav) ? 1 : -1
		}
	})
	chrome.storage.local.set({stations: STATIONS}, function() {})
}

// ————————————————————————————————————————————————————————————————————————————————
// Оновлення списку станцій з онлайн-джерела
// ————————————————————————————————————————————————————————————————————————————————
async function fetchStandardStationList() {
	let response = await fetch('https://oleksavyshnivsky.github.io/uaradiostations/defaultstations.json')
	if (response.ok) {
		let STATIONS_DOWNLOADED = await response.json()
		STATIONS_DOWNLOADED.forEach(station => {
			// Для кожної скачаної станції — перевірити, чи така уже є локально
			// Перевірка на наявність — за URL трансляції
			var exists = false
			STATIONS.every(mystation => {
				if (mystation.url === station.url) exists = true
				return !exists
			})
			// 
			if (!exists) STATIONS.push(station)
		})
		// Збереження у локальному сховищі
		saveStationListInLS()
		showStationList()
		//
		alert(chrome.i18n.getMessage('done'))
	}
}

// ————————————————————————————————————————————————————————————————————————————————
// Оновлення списку фільтрів
// ————————————————————————————————————————————————————————————————————————————————
function fetchFilters() {
	var now = new Date()
	chrome.storage.local.get(['filters', 'fdatetime'], async function(result) {
		var fdatetime = new Date(Number(fdatetime))
		FILTERS = result.filters
		if (now - fdatetime >= 86400000) {
			let response = await fetch('https://oleksavyshnivsky.github.io/uaradiostations/defaultfilters.json')
			if (response.ok) {
				let FILTERS_DOWNLOADED = await response.json()
				FILTERS = new Set([...result.filters, ...FILTERS_DOWNLOADED])
				chrome.storage.local.set({filters: FILTERS, fdatetime: now.getTime()}, function() {})
			}
		}
	})
}

// ————————————————————————————————————————————————————————————————————————————————
// Зміна статусу "Вибране"
// ————————————————————————————————————————————————————————————————————————————————
function setFavourite(e) {
	var wrapper = e.target.closest('[data-station-id]')
	var url = wrapper.dataset.stationId
	STATIONS.every(station => {
		if (station.url === url) {
			station.fav = !station.fav
			var el_i = wrapper.querySelector('[data-station-fav] i')
			if (station.fav) {
				el_i.classList.add('bi-heart-fill')
				el_i.classList.remove('bi-heart')
			} else {
				el_i.classList.add('bi-heart')
				el_i.classList.remove('bi-heart-fill')
			}
			saveStationListInLS()
		}
		return station.url !== url
	})
}

// ————————————————————————————————————————————————————————————————————————————————
// Показ списку станцій
// ————————————————————————————————————————————————————————————————————————————————
function showStationList() {
	chrome.storage.local.get(['stations'], function(result) {
		STATIONS = result.stations

		stations_wrapper.innerHTML = ''

		STATIONS.forEach(station => {
			var station_wrapper = document.importNode(tpl, true)
			station_wrapper.querySelector('[data-station-id]').dataset.stationId = station.url
			station_wrapper.querySelector('[data-station-title]').innerText = station.title
			station_wrapper.querySelector('[data-station-title]').title = station.title
			station_wrapper.querySelector('[data-station-title]').onclick = doPlayAction
			station_wrapper.querySelector('[data-station-url]').dataset.stationUrl = station.url
			station_wrapper.querySelector('[data-station-url]').onclick = doPlayAction
			station_wrapper.querySelector('[data-station-website]').href = station.website
				
			var el_fav = station_wrapper.querySelector('[data-station-fav]')
			if (station.fav)
				el_fav.querySelector('i').classList.add('bi-heart-fill')
			else
				el_fav.querySelector('i').classList.add('bi-heart')
			el_fav.onclick = setFavourite

			station_wrapper.querySelector('[data-station-edit]').onclick = showStationEditor
			station_wrapper.querySelector('[data-station-delete]').onclick = deleteStation


			stations_wrapper.appendChild(station_wrapper)
		})

		// Оновлення статусу програвання
		updateNowPlaying()
	})
}

// ————————————————————————————————————————————————————————————————————————————————
// Видалення станції
// ————————————————————————————————————————————————————————————————————————————————
function deleteStation(e) {
	if (confirm(chrome.i18n.getMessage('confirm_delete'))) {
		var url = e.target.closest('[data-station-id]').dataset.stationId
		for (var i = 0; i < STATIONS.length; i++) {
			if (url === STATIONS[i].url) {
				var station = STATIONS.splice(i, 1)[0]
				saveStationListInLS()
				showStationList()

				// Прибрати з редактора
				if (station.url === document.getElementById('editor-oldurl').value) {
					form_editor.reset()
					form_editor.classList.remove('show')
				}

				// Прибрати з програвача
				chrome.runtime.sendMessage({
					url: '',
				}, function(response) {
					if (station.url === response.url) {
						if (response.status) {
							chrome.runtime.sendMessage({
								url: station.url,
							})
						}
						nowplaying_wrapper.dataset.stationI = ''
						nowplaying_button.dataset.stationUrl = ''
						nowplaying_title.title = nowplaying_title.innerText = ''
						nowplaying_website.href = ''
					}
				})
			} // if (url === STATIONS[i].url) {
		} // for (var i = 0, i < STATIONS.length, i++) {
	}
}


// ————————————————————————————————————————————————————————————————————————————————
// Збереження станції
// ————————————————————————————————————————————————————————————————————————————————
function saveStation() {
	var station_oldurl = document.getElementById('editor-oldurl').value

	var newStation = {
		url: document.getElementById('editor-url').value,
		title: document.getElementById('editor-title').value,
		website: document.getElementById('editor-website').value,
	}

	// Перевірка URL на допустимість
	for (var f = 0; f < FILTERS.length; f++) {
		var filter = new RegExp('.+' + FILTERS[f] + '.*', 'gi')
		if (newStation.url.match(filter) || newStation.website.match(filter)) {
			alert(chrome.i18n.getMessage('url_not_allowed'))
			return
		}
	}	

	// Перевірка на дублювання URL трансляції і назви
	var err = false
	STATIONS.every(station => {
		if (station.url === station_oldurl) return true

		if (station.url === newStation.url)
			err = chrome.i18n.getMessage('stream_url_already_exists')
		else if (station.title === newStation.title)
			err = chrome.i18n.getMessage('title_already_exists')

		return !err
	})

	if (err !== false) {
		alert(err)
		return
	}

	if (station_oldurl) {
		STATIONS.every(station => {
			if (station.url === station_oldurl) {
				station.url = newStation.url
				station.title = newStation.title
				station.website = newStation.website
			}
			return station.url !== station_oldurl
		})

		// // Виправлення у програвачі
		// if (newStation.url !== station_oldurl) {
		// 	chrome.extension.sendRequest({
		// 		url: '',
		// 	}, function(response) {
		// 		if (station_oldurl === response.url) {
		// 			chrome.extension.sendRequest({
		// 				url: newStation.url,
		// 			})
		// 			nowplaying_wrapper.dataset.stationI = ''
		// 			nowplaying_button.dataset.stationUrl = newStation.url
		// 			nowplaying_title.title = nowplaying_title.innerText = newStation.title
		// 			nowplaying_website.href = newStation.website
		// 		}
		// 	})
		// }
	} else {
		newStation.fav = false
		STATIONS.push(newStation)
	}

	saveStationListInLS()
	showStationList()

	form_editor.reset()
	form_editor.classList.remove('show')
}


// ————————————————————————————————————————————————————————————————————————————————
// Показ редактора станції
// ————————————————————————————————————————————————————————————————————————————————
function showStationEditorNew() {
	form_editor.reset()
	form_editor.classList.add('show')
	form_editor.scrollIntoView({block: 'nearest'})
	document.getElementById('editor-title').focus()
}
function showStationEditor(e) {
	var url = e.target.closest('[data-station-id]').dataset.stationId
	var newStation = {
		url: '',
		title: '',
		website: ''
	}
	STATIONS.every(station => {
		if (station.url === url) newStation = station
		return station.url !== url
	})

	document.getElementById('editor-oldurl').value = url
	document.getElementById('editor-url').value = newStation.url
	document.getElementById('editor-title').value = newStation.title
	document.getElementById('editor-website').value = newStation.website

	form_editor.classList.add('show')
	form_editor.scrollIntoView({block: 'nearest'})
	document.getElementById('editor-title').focus()
}

// ————————————————————————————————————————————————————————————————————————————————
// 
// ————————————————————————————————————————————————————————————————————————————————
document.getElementById('btn-fetch-standard').onclick = fetchStandardStationList
form_editor.onsubmit = e => {
	e.preventDefault()
	saveStation()
}
document.getElementById('btn-reset').onclick = e => {
	form_editor.classList.remove('show')
	form_editor.reset()
}
document.getElementById('btn-update-stations').onclick = updateStationList
document.getElementById('btn-new').onclick = showStationEditorNew

// ————————————————————————————————————————————————————————————————————————————————
// СТАРТОВІ ЗАВДАННЯ
// ————————————————————————————————————————————————————————————————————————————————
showStationList()
fetchFilters()

// Оновлювати показ при поверненні на закладку
window.onfocus = updateNowPlaying

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
// ДОСТУПНІ СТАНЦІЇ
// ————————————————————————————————————————————————————————————————————————————————
let STATIONS = [
	{
		name: 'Хіт FM',
		url: 'https://online.hitfm.ua/HitFM',
	},
	{
		name: 'Ретро FM',
		url: 'https://cast.radiogroup.com.ua/retro',
	},
]

// ————————————————————————————————————————————————————————————————————————————————
// ДОПОМІЖНІ ФУНКЦІЇ
// ————————————————————————————————————————————————————————————————————————————————



const stations_wrapper = document.getElementById('stations-wrapper')
const tpl = document.getElementById('tpl-station').content.querySelector('div')

STATIONS.forEach(station => {
	var station_wrapper = document.importNode(tpl, true)
	station_wrapper.querySelector('[data-station-title]').innerText = station.name
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
			console.log(response)
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

chrome.extension.sendRequest({
	url: '',
}, function(response) {
	// console.log(response)
	if (response.status) {
		document.querySelectorAll('button[data-station-url="'+response.url+'"').forEach(el => {
			el.classList.remove('bi-play-circle-fill', 'text-success')
			el.classList.add('bi-stop-circle', 'text-danger')
		})
	}
})
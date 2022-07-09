const AUDIO = new Audio()

// ————————————————————————————————————————————————————————————————————————————————
// Користувач надсилає URL request.url
// - Якщо request.url відсутній: 
//		- повернути URL активної станції і статус програвання
// - Якщо request.url такий самий, як URL активної станції: 
// 		- припинити програвання
// - Якщо request.url не такий, як URL активної станції:
//		- змінити активну станцію
// 		- почати програвання
// ————————————————————————————————————————————————————————————————————————————————
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if (!request.url) {
		sendResponse({url: AUDIO.src, status: !AUDIO.paused})
		return
	}

	if (AUDIO.src === request.url) {
		if (AUDIO.paused)
			AUDIO.play()
		else
			AUDIO.pause()
	} else {
		AUDIO.src = request.url
		AUDIO.play()
	}

	sendResponse({url: AUDIO.src, status: !AUDIO.paused})
})


// ————————————————————————————————————————————————————————————————————————————————
// СТАРТОВІ ДІЇ
// ————————————————————————————————————————————————————————————————————————————————

// ————————————————————————————————————————————————————————————————————————————————
// Початковий набір станцій, що доступний при першому відкритті після встановлення
// ————————————————————————————————————————————————————————————————————————————————
chrome.storage.local.get(['stations'], function(result) {
	if (!result.stations) {
		let STATIONS = [
			{
				title: 'Хіт FM',
				url: 'https://online.hitfm.ua/HitFM',
			},
			{
				title: 'Ретро FM',
				url: 'https://cast.radiogroup.com.ua/retro',
			},
		]

		chrome.storage.local.set({stations: STATIONS}, function() {
			// console.log('Value is set to ' + STATIONS);
		})
	}
})


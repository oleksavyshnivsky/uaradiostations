let audio = new Audio()
let status = 0

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
		sendResponse({url: audio.src, status: status})
		return
	}

	if (audio.src !== request.url)
		status = 1
	else
		status = 1 - status

	audio.src = request.url

	if (status)
		audio.play()
	else
		audio.pause()

	sendResponse({url: audio.src, status: status})
})


// ————————————————————————————————————————————————————————————————————————————————
// СТАРТОВІ ДІЙ
// ————————————————————————————————————————————————————————————————————————————————

// ————————————————————————————————————————————————————————————————————————————————
// 2 станції доступні на початку
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
			console.log('Value is set to ' + STATIONS);
		})
	}
})


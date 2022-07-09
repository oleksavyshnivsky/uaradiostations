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

	if (AUDIO.paused) {
		chrome.browserAction.setBadgeText( { text: '' } )
	} else {
		chrome.browserAction.setBadgeText( { text: '❚❚' } )
		// chrome.browserAction.setBadgeBackgroundColor({color: [255,0,0,0]});
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
		let STATIONS =	
[{"title":"1-\u0439 \u043a\u0430\u043d\u0430\u043b \u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u043e\u0433\u043e \u0420\u0430\u0434\u0456\u043e","url":"http:\/\/91.218.213.49:8000\/ur1-mp3"},{"title":"\u0410\u0432\u0442\u043e \u0420\u0430\u0434\u0456\u043e","url":"https:\/\/cast.radiogroup.com.ua\/avtoradio"},{"title":"\u0410\u0440\u043c\u0456\u044f FM","url":"https:\/\/icecast.armyfm.com.ua:8443\/ArmyFM"},{"title":"\u0404\u0432\u0440\u043e\u043f\u0430 \u041f\u043b\u044e\u0441 (\u041a\u0438\u0457\u0432)","url":"https:\/\/s5.radioforge.com:7908\/live"},{"title":"\u041b\u044c\u0432\u0456\u0432\u0441\u044c\u043a\u0430 \u0445\u0432\u0438\u043b\u044f","url":"https:\/\/onair.lviv.fm:8443\/lviv32.fm"},{"title":"\u041c\u0435\u043b\u043e\u0434\u0456\u044f FM","url":"https:\/\/online.melodiafm.ua\/MelodiaFM_HD"},{"title":"\u041c\u0435\u043b\u043e\u0434\u0456\u044f FM (International)","url":"https:\/\/online.melodiafm.ua\/MelodiaFM_Int_HD"},{"title":"\u041d\u0430\u0448\u0435 \u0420\u0430\u0434\u0456\u043e","url":"https:\/\/online.nasheradio.ua\/NasheRadio_HD"},{"title":"\u041d\u0430\u0448\u0435 \u0420\u0430\u0434\u0456\u043e (Ukr Top-100)","url":"https:\/\/online.nasheradio.ua\/NasheRadio_Ukr_HD"},{"title":"\u0420\u0430\u0434\u0456\u043e \u0411\u0430\u0439\u0440\u0430\u043a\u0442\u0430\u0440","url":"https:\/\/online.radiobayraktar.com.ua\/RadioBayraktar_HD"},{"title":"\u0420\u0430\u0434\u0456\u043e \u0443\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0438\u0445 \u0434\u043e\u0440\u0456\u0433 (\u041f'\u044f\u0442\u043d\u0438\u0446\u044f)","url":"https:\/\/cast.radiogroup.com.ua\/radiopyatnica320"},{"title":"\u0420\u0435\u0442\u0440\u043e FM","url":"https:\/\/cast.radiogroup.com.ua\/retro"},{"title":"\u0425\u0456\u0442 FM","url":"https:\/\/online.hitfm.ua\/HitFM"},{"title":"\u0425\u0456\u0442 FM \u041d\u0430\u0439\u0431\u0456\u043b\u044c\u0448\u0456 \u0445\u0456\u0442\u0438","url":"https:\/\/online.hitfm.ua\/HitFM_Best"},{"title":"\u0425\u0456\u0442 FM \u0421\u0443\u0447\u0430\u0441\u043d\u0456 \u0445\u0456\u0442\u0438","url":"https:\/\/online.hitfm.ua\/HitFM_Top"},{"title":"\u0425\u0456\u0442 FM \u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0456 \u0445\u0456\u0442\u0438","url":"https:\/\/online.hitfm.ua\/HitFM_Ukr"}]

		// [
		// 	{
		// 		title: 'Хіт FM',
		// 		url: 'https://online.hitfm.ua/HitFM',
		// 	},
		// 	{
		// 		title: 'Ретро FM',
		// 		url: 'https://cast.radiogroup.com.ua/retro',
		// 	},
		// ]

		chrome.storage.local.set({stations: STATIONS}, function() {
			// console.log('Value is set to ' + STATIONS);
		})
	}
})


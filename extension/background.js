let PLAY_STATUS = false
let STATION_URL = false

// ————————————————————————————————————————————————————————————————————————————————
// https://stackoverflow.com/questions/67437180/play-audio-from-background-script-in-chrome-extention-manifest-v3
// ————————————————————————————————————————————————————————————————————————————————

/**
 * Plays audio files from extension service workers
 * @param {string} source - path of the audio file
 * @param {number} volume - volume of the playback
 */
async function playSound(source = 'default.wav', volume = 1) {
    await createOffscreen()
    await chrome.runtime.sendMessage({ play: { source, volume } })
}

async function pauseSound() {
    await createOffscreen()
    await chrome.runtime.sendMessage({ pause: true })
}

// Create the offscreen document if it doesn't already exist
async function createOffscreen() {
    if (await chrome.offscreen.hasDocument()) return;
    await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['AUDIO_PLAYBACK'],
        justification: 'background radio' // details for using the API
    })
}


// ————————————————————————————————————————————————————————————————————————————————
// 
// ————————————————————————————————————————————————————————————————————————————————
chrome.runtime.onInstalled.addListener(({ reason, version }) => {
	if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
		showReadme();
	}
})

chrome.action.onClicked.addListener((tab) => {
	showReadme()
})

function showReadme(info, tab) {
	const url = chrome.runtime.getURL('readme.html')
	chrome.tabs.create({ url })
}


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
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (!request.url) {
		sendResponse({url: STATION_URL, status: PLAY_STATUS})
		return
	}

	if (STATION_URL === request.url) {
		if (PLAY_STATUS)
			pauseSound()
		else
			playSound(STATION_URL)
		PLAY_STATUS = !PLAY_STATUS
	} else {
		STATION_URL = request.url
		playSound(STATION_URL)
		PLAY_STATUS = true
	}

	if (!PLAY_STATUS) {
		chrome.action.setBadgeText( { text: '' } )
	} else {
		chrome.action.setBadgeText( { text: '♪' } )
		chrome.action.setBadgeBackgroundColor({color: [255,255,255,255]});
	}

	sendResponse({url: STATION_URL, status: PLAY_STATUS})
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
[{"title":"1-\u0439 \u043a\u0430\u043d\u0430\u043b \u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u043e\u0433\u043e \u0420\u0430\u0434\u0456\u043e","url":"http:\/\/91.218.213.49:8000\/ur1-mp3","website":"http:\/\/www.nrcu.gov.ua\/uk\/schedule\/play-live.html?channelID=1"},{"title":"2-\u0439 \u043a\u0430\u043d\u0430\u043b \u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u043e\u0433\u043e \u0440\u0430\u0434\u0456\u043e (\u041f\u0440\u043e\u043c\u0456\u043d\u044c)","url":"http:\/\/radio.ukr.radio:8000\/ur2-mp3-m","website":"https:\/\/promin.fm\/"},{"title":"Classic Radio","url":"https:\/\/online.classicradio.com.ua\/ClassicRadio_HD","website":"https:\/\/play.tavr.media\/classicradio\/"},{"title":"FM \u0413\u0430\u043b\u0438\u0447\u0438\u043d\u0430","url":"https:\/\/stream320.galychyna.fm\/WebSite","website":"http:\/\/www.efir.galychyna.fm\/"},{"title":"Radio ROKS","url":"https:\/\/online.radioroks.ua\/RadioROKS_HD","website":"https:\/\/play.tavr.media\/radioroks\/"},{"title":"Radio ROKS Classic Rock","url":"https:\/\/online.radioroks.ua\/RadioROKS_ClassicRock_HD","website":"https:\/\/play.tavr.media\/radioroks\/classicrock\/"},{"title":"Radio ROKS Hard'n'Heavy","url":"https:\/\/online.radioroks.ua\/RadioROKS_HardnHeavy_HD","website":"https:\/\/play.tavr.media\/radioroks\/hardnheavy\/"},{"title":"Radio ROKS \u041d\u043e\u0432\u0438\u0439 \u0420\u043e\u043a","url":"https:\/\/online.radioroks.ua\/RadioROKS_NewRock_HD","website":"https:\/\/play.tavr.media\/radioroks\/newrock\/"},{"title":"Radio ROKS \u0420\u043e\u043a-\u0411\u0430\u043b\u0430\u0434\u0438","url":"https:\/\/online.radioroks.ua\/RadioROKS_Ballads_HD","website":"https:\/\/play.tavr.media\/radioroks\/ballads\/"},{"title":"Radio ROKS \u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0438\u0439 \u0440\u043e\u043a","url":"https:\/\/online.radioroks.ua\/RadioROKS_Ukr_HD","website":"https:\/\/play.tavr.media\/radioroks\/ukr\/"},{"title":"\u0410\u0432\u0442\u043e \u0420\u0430\u0434\u0456\u043e","url":"https:\/\/cast.radiogroup.com.ua\/avtoradio","website":"https:\/\/radioclub.ua\/radio\/avtoradio"},{"title":"\u0410\u0440\u043c\u0456\u044f FM","url":"https:\/\/icecast.armyfm.com.ua:8443\/ArmyFM","website":"https:\/\/www.armyfm.com.ua\/"},{"title":"\u0404\u0432\u0440\u043e\u043f\u0430 \u041f\u043b\u044e\u0441 (\u041a\u0438\u0457\u0432)","url":"https:\/\/s5.radioforge.com:7908\/live","website":"https:\/\/europaplus.kiev.ua\/"},{"title":"\u041b\u044c\u0432\u0456\u0432\u0441\u044c\u043a\u0430 \u0445\u0432\u0438\u043b\u044f","url":"https:\/\/onair.lviv.fm:8443\/lviv32.fm","website":"https:\/\/lviv.fm\/"},{"title":"\u041c\u0435\u043b\u043e\u0434\u0456\u044f FM","url":"https:\/\/online.melodiafm.ua\/MelodiaFM_HD","website":"https:\/\/play.tavr.media\/melodiafm\/"},{"title":"\u041c\u0435\u043b\u043e\u0434\u0456\u044f FM (International)","url":"https:\/\/online.melodiafm.ua\/MelodiaFM_Int_HD","website":"https:\/\/play.tavr.media\/melodiafm\/int\/"},{"title":"\u041d\u0430\u0448\u0435 \u0420\u0430\u0434\u0456\u043e","url":"https:\/\/online.nasheradio.ua\/NasheRadio_HD","website":"https:\/\/www.nasheradio.ua\/"},{"title":"\u041d\u0430\u0448\u0435 \u0420\u0430\u0434\u0456\u043e (Ukr Top-100)","url":"https:\/\/online.nasheradio.ua\/NasheRadio_Ukr_HD","website":"https:\/\/play.tavr.media\/nasheradio\/ukr\/"},{"title":"\u041f\u0435\u0440\u0435\u0446\u044c FM","url":"https:\/\/radio.urg.ua\/radio-stilnoe","website":"https:\/\/perec.fm\/"},{"title":"\u0420\u0430\u0434\u0456\u043e Kiss FM","url":"https:\/\/online.kissfm.ua\/KissFM_HD","website":"https:\/\/play.tavr.media\/kissfm\/"},{"title":"\u0420\u0430\u0434\u0456\u043e Kiss FM (\u0443\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u043e\u044e)","url":"https:\/\/online.kissfm.ua\/KissFM_Ukr_HD","website":"https:\/\/play.tavr.media\/kissfm\/ukr\/"},{"title":"\u0420\u0430\u0434\u0456\u043e Relax","url":"https:\/\/online.radiorelax.ua\/RadioRelax_HD","website":"https:\/\/play.tavr.media\/radiorelax\/"},{"title":"\u0420\u0430\u0434\u0456\u043e Relax (\u0443\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u043e\u044e)","url":"https:\/\/online.radiorelax.ua\/RadioRelax_Ukr_HD","website":"https:\/\/play.tavr.media\/radiorelax\/ukr\/"},{"title":"\u0420\u0430\u0434\u0456\u043e \u0411\u0430\u0439\u0440\u0430\u043a\u0442\u0430\u0440","url":"https:\/\/online.radiobayraktar.com.ua\/RadioBayraktar_HD","website":"https:\/\/www.radiobayraktar.com.ua\/"},{"title":"\u0420\u0430\u0434\u0456\u043e \u0443\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0438\u0445 \u0434\u043e\u0440\u0456\u0433 (\u041f'\u044f\u0442\u043d\u0438\u0446\u044f)","url":"https:\/\/cast.radiogroup.com.ua\/radiopyatnica320","website":"https:\/\/radiopyatnica.com.ua\/"},{"title":"\u0420\u0435\u0442\u0440\u043e FM","url":"https:\/\/cast.radiogroup.com.ua\/retro","website":"https:\/\/radioclub.ua\/radio\/retro-fm"},{"title":"\u0425\u0456\u0442 FM","url":"https:\/\/online.hitfm.ua\/HitFM","website":"https:\/\/play.tavr.media\/hitfm\/"},{"title":"\u0425\u0456\u0442 FM \u041d\u0430\u0439\u0431\u0456\u043b\u044c\u0448\u0456 \u0445\u0456\u0442\u0438","url":"https:\/\/online.hitfm.ua\/HitFM_Best","website":"https:\/\/play.tavr.media\/hitfm\/best\/"},{"title":"\u0425\u0456\u0442 FM \u0421\u0443\u0447\u0430\u0441\u043d\u0456 \u0445\u0456\u0442\u0438","url":"https:\/\/online.hitfm.ua\/HitFM_Top","website":"https:\/\/play.tavr.media\/hitfm\/top\/"},{"title":"\u0425\u0456\u0442 FM \u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0456 \u0445\u0456\u0442\u0438","url":"https:\/\/online.hitfm.ua\/HitFM_Ukr","website":"https:\/\/play.tavr.media\/hitfm\/ukr\/"}]

		// [
		// 	{
		// 		title: 'Хіт FM',
		// 		url: 'https://online.hitfm.ua/HitFM',
		// 		website: 'https://hitfm.ua/',
		// 	},
		// 	{
		// 		title: 'Ретро FM',
		// 		url: 'https://cast.radiogroup.com.ua/retro',
		// 		website: 'https://example.com/',
		// 	},
		// ]

		STATIONS.forEach(station => station.fav = false)

		chrome.storage.local.set({stations: STATIONS}, function() {
			// console.log('Value is set to ' + STATIONS);
		})
	}
})

// ————————————————————————————————————————————————————————————————————————————————
// Початковий набір фільтрів
// ————————————————————————————————————————————————————————————————————————————————
chrome.storage.local.get(['filters'], function(result) {
	if (!result.filters) {
		var fdatetime = new Date()
		let FILTERS = ['\\.ru/', '\\.su/']

		chrome.storage.local.set({filters: FILTERS}, function() {})
	}
})

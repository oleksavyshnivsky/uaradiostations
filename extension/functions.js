// ————————————————————————————————————————————————————————————————————————————————
// AJAX-запит
// ————————————————————————————————————————————————————————————————————————————————
const getPage = url => {
	return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest()
		xhr.open('GET', url)
		xhr.onload = function() {
			if (xhr.status === 200) {
				var parser = new DOMParser()
				var htmlDoc = parser.parseFromString(xhr.responseText, 'text/html')
				resolve({url: new URL(url), doc: htmlDoc})
				// resolve(xhr.responseText)
			} else {
				alert('Request failed.  Returned status of ' + xhr.status)
			}
		}
		xhr.send()
	})
}

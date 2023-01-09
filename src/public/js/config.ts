
if (process.env.NODE_ENV === 'production') {
	module.exports = {
		serviceUrl: 'https://shlk.cc',
		displayServiceUrl: 'shlk.cc',
		mode: 'website'
	}
} else {
	module.exports = {
		serviceUrl: window.location.origin,
		displayServiceUrl: new String(window.location.origin).replace(/^https?:\/\//ig, ''),
		mode: 'website'
	}
}
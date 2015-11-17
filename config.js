module.exports = {
	port: process.env['PORT'] || 3000,
	handbackHost: 'localhost',
	sevenDigitalConsumerKey: process.env['SEVEN_DIGITAL_CONSUMER_KEY'],
	sevenDigitalConsumerSecret: process.env['SEVEN_DIGITAL_CONSUMER_SECRET'],
	spotifyClientId: process.env['SPOTIFY_CLIENT_ID'],
	spotifyClientSecret: process.env['SPOTIFY_CLIENT_SECRET']
}

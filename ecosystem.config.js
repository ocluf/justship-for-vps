module.exports = {
	apps: [
		{
			name: 'just-ship-for-vps',
			script: './build/index.js'
		}
	],
	node_args: '--env-file=.env'
};

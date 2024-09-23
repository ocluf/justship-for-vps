module.exports = {
	apps: [
		{
			name: 'just-ship-for-vps',
			script: './build/index.js'
		}
	],
	node_args: '--env-file=.env',
	deploy: {
		production: {
			user: 'TODO_FILL_IN', // e.g root
			host: 'TODO_FILL_IN', // e.g 195.201.128.5
			ref: 'TODO_FILL_IN', // e.g origin/main
			repo: 'TODO_FILL_IN', // e.g https://github.com/ocluf/justship-for-vps.git
			path: 'TODO_FILL_IN', // e.g /root/projects/justship-for-vps
			'post-deploy':
				'pnpm install && pnpm run build && pm2 reload ecosystem.config.cjs --env production'
		}
	}
};

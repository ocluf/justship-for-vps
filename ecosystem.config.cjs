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
			user: 'root',
			host: '195.201.128.2',
			ref: 'origin/main',
			repo: 'https://github.com/ocluf/justship-for-vps.git',
			path: '/root/projects/test',
			'post-deploy': 'pnpm install && pm2 reload ecosystem.config.js --env production'
		}
	}
};

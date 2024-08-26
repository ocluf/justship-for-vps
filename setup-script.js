import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

/**
 * @param {string} question
 */
async function askQuestion(question) {
	return new Promise((resolve) => {
		rl.question(question, (answer) => {
			resolve(answer.toLowerCase());
		});
	});
}

async function setupProject() {
	console.log('Welcome to the project setup script!');

	// Authentication choice
	const addAuth = await askQuestion('Do you want to add authentication? (yes/no): ');

	// Payments choice
	const addPayments = await askQuestion('Do you want to add payments? (yes/no): ');

	// Hosting choice
	const hostingChoice = await askQuestion('Where do you want to host? (vercel/vps): ');

	// Process choices
	if (addAuth === 'yes' || addAuth === 'y') {
		console.log('Setting up authentication...');
		// Add authentication setup logic here
	} else {
		console.log('Removing authentication-related files and adapting the project...');
		// Remove authentication-related files
		const authFilesToRemove = [
			'src/hooks.server.ts',
			'src/lib/server/auth.ts',
			'src/lib/server/database/signin.model.ts',
			'src/lib/server/database/user.model.ts',
			'src/routes/(app)/+layout.server.ts'
		];

		// Remove the entire src/routes/(login) directory
		const loginDirPath = path.join(process.cwd(), 'src', 'routes', '(login)');
		if (fs.existsSync(loginDirPath)) {
			fs.rmSync(loginDirPath, { recursive: true, force: true });
			console.log('Removed: src/routes/(login) directory');
		}

		// Add src/routes/(login) to the list of files to remove
		authFilesToRemove.push('src/routes/(login)');

		authFilesToRemove.forEach((file) => {
			const filePath = path.join(process.cwd(), file);
			if (fs.existsSync(filePath)) {
				fs.unlinkSync(filePath);
				console.log(`Removed: ${file}`);
			}
		});

		// Adapt NavMenu.tsx to remove auth-related components
		const navMenuPath = path.join(process.cwd(), 'components/NavMenu.tsx');
		if (fs.existsSync(navMenuPath)) {
			let navMenuContent = fs.readFileSync(navMenuPath, 'utf8');
			navMenuContent = navMenuContent.replace(/import.*SignInButton.*\n/, '');
			navMenuContent = navMenuContent.replace(/import.*SignOutButton.*\n/, '');
			navMenuContent = navMenuContent.replace(/<SignInButton.*\/>\n/, '');
			navMenuContent = navMenuContent.replace(/<SignOutButton.*\/>\n/, '');
			fs.writeFileSync(navMenuPath, navMenuContent);
			console.log('Adapted: components/NavMenu.tsx');
		}
	}

	if (addPayments === 'yes' || addPayments === 'y') {
		console.log('Setting up payments...');
		// Add payments setup logic here
	}

	if (hostingChoice === 'vercel') {
		console.log('Setting up for Vercel hosting...');
		// Add Vercel-specific setup here
	} else if (hostingChoice === 'vps') {
		console.log('Setting up for VPS hosting with PM2...');
		// Add VPS with PM2 setup here
		const ecosystemConfig = `
module.exports = {
  apps: [
    {
      name: 'just-ship-for-vps',
      script: './build/index.js'
    }
  ],
  node_args: '--env-file=.env'
};
`;
		fs.writeFileSync(path.join(process.cwd(), 'ecosystem.config.js'), ecosystemConfig);
	}

	console.log('Setup complete!');
	rl.close();
}

setupProject();

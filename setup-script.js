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
		const loginDirPath = path.join(__dirname, 'src', 'routes', '(login)');
		if (fs.existsSync(loginDirPath)) {
			fs.rmSync(loginDirPath, { recursive: true, force: true });
			console.log('Removed: src/routes/(login) directory');
		}

		// Remove content of src/lib/server/database/schema.ts
		const schemaPath = path.join(__dirname, 'src', 'lib', 'server', 'database', 'schema.ts');
		if (fs.existsSync(schemaPath)) {
			fs.writeFileSync(schemaPath, '// Database schema file');
			console.log('Cleared content of: src/lib/server/database/schema.ts');
		}

		// Add src/routes/(login) to the list of files to remove
		authFilesToRemove.push('src/routes/(login)');

		authFilesToRemove.forEach((file) => {
			const filePath = path.join(__dirname, file);
			if (fs.existsSync(filePath)) {
				fs.unlinkSync(filePath);
				console.log(`Removed: ${file}`);
			}
		});

		// Remove authentication-related variables from .env.example
		const envExamplePath = path.join(__dirname, '.env.example');
		if (fs.existsSync(envExamplePath)) {
			let envContent = fs.readFileSync(envExamplePath, 'utf8');
			envContent = envContent.replace(/^SIGNIN_IP_RATELIMIT=.*\n?/m, '');
			envContent = envContent.replace(/^GOOGLE_CLIENT_ID=.*\n?/m, '');
			envContent = envContent.replace(/^GOOGLE_CLIENT_SECRET=.*\n?/m, '');
			fs.writeFileSync(envExamplePath, envContent);
			console.log('Removed authentication-related variables from .env.example');
		}
	}
	if (addPayments === 'yes' || addPayments === 'y') {
		console.log('Setting up payments...');
		// Add payments setup logic here
	} else {
		console.log('Removing payment-related files...');
		const stripeDirPath = path.join(__dirname, 'src', 'routes', 'stripe');
		if (fs.existsSync(stripeDirPath)) {
			fs.rmSync(stripeDirPath, { recursive: true, force: true });
			console.log('Removed: src/routes/stripe directory');
		}

		// Remove payment-related variables from .env.example
		const envExamplePath = path.join(__dirname, '.env.example');
		if (fs.existsSync(envExamplePath)) {
			let envContent = fs.readFileSync(envExamplePath, 'utf8');
			envContent = envContent.replace(/^STRIPE_SECRET_KEY=.*\n?/m, '');
			envContent = envContent.replace(/^STRIPE_WEBHOOK_SECRET=.*\n?/m, '');
			fs.writeFileSync(envExamplePath, envContent);
			console.log('Removed payment-related variables from .env.example');
		}
	}
	if (hostingChoice === 'vercel') {
		console.log('Setting up for Vercel hosting...');
		// Add Vercel-specific setup here
	} else if (hostingChoice === 'vps') {
		console.log('Setting up for VPS hosting with PM2...');
		// Remove vercel.json
		const vercelJsonPath = path.join(__dirname, 'vercel.json');
		if (fs.existsSync(vercelJsonPath)) {
			fs.unlinkSync(vercelJsonPath);
			console.log('Removed: vercel.json');
		}
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
		fs.writeFileSync(path.join(__dirname, 'ecosystem.config.js'), ecosystemConfig);
	}

	console.log('Setup complete!');
	rl.close();

	// Remove the script itself
	fs.unlinkSync(__filename);
	console.log('Removed setup script.');
}

setupProject();

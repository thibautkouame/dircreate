#!/usr/bin/env node
import inquirer from 'inquirer';
import { execa } from 'execa';
import { existsSync } from 'fs';
import chalk from 'chalk';
import clear from 'clear';

const fail = (msg) => { console.error(chalk.red(msg)); process.exit(1); };

const quit = () => {
    console.log(chalk.red('\nProcess finished. See you soon!'));
    process.exit(0);
};

const ensureCmd = async (cmd) => {
    try { await execa(cmd, ['--version'], { stdio: 'ignore' }); return true; }
    catch { return false; }
};

const RECIPES = [
    {
        id: 'next',
        label: 'Next.js',
        cmd: (name, extra) => ['npx', ['create-next-app@latest', name, ...extra]],
    },
    {
        id: 'expo',
        label: 'Expo (React Native)',
        cmd: (name, extra) => ['npx', ['create-expo-app@latest', name, ...extra]],
    },
    {
        id: 'vite',
        label: 'Vite (+ React/TS prompt)',
        cmd: (name, extra) => ['npx', ['create-vite@latest', name, ...extra]],
    },
    {
        id: 'nest',
        label: 'NestJS',
        cmd: (name, extra) => ['npx', ['@nestjs/cli@latest', 'new', name, ...extra]],
    },
    {
        id: 'laravel',
        label: 'Laravel (PHP)',
        precheck: 'composer',
        cmd: (name, extra) => ['composer', ['create-project', 'laravel/laravel', name, ...extra]],
    },
];

const welcomeMessage = () => {
    clear();
    console.log(chalk.green.bold('Welcome to DIRCREATE CLI ✨ !\n'));
    console.log(chalk.cyan('Create projects easily with a single command.\n'));
    // console.log(chalk.yellow('Available options:\n'));
    // RECIPES.forEach((recipe, index) => {
    //     console.log(chalk.cyan(`  ${index + 1}. ${recipe.label}`));
    // });
    // console.log(chalk.cyan('  0. Quit\n'));
};

const run = async () => {
    welcomeMessage();

    try {
        const { recipeId } = await inquirer.prompt([
            {
                type: 'list',
                name: 'recipeId',
                message: 'Choose the project type :',
                choices: [
                    ...RECIPES.map((r, index) => ({ name: `${index + 1}. ${r.label}`, value: r.id })),
                    new inquirer.Separator(),
                    { name: 'Press Ctrl + C to quit', value: 'quit' }
                ],
            },
        ]);

        if (recipeId === 'quit') quit();

        const recipe = RECIPES.find((r) => r.id === recipeId);
        if (!recipe) fail('Recipe not found.');

        const { name } = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Project folder name :',
                validate: (v) => {
                    if (v === 'q') return true;
                    if (!v) return 'Project folder name is required';
                    if (existsSync(v)) return 'This folder already exists';
                    return true;
                },
            },
        ]);

        if (name === 'q') quit();

        const { extraRaw } = await inquirer.prompt([
            {
                type: 'input',
                name: 'extraRaw',
                message: 'Additional options to pass to the generator ? (ex: --use-npm --ts) :',
                default: '',
            },
        ]);

        if (extraRaw === 'q') quit();

        const extra = extraRaw.trim() ? extraRaw.trim().split(/\s+/) : [];

        if (recipe.precheck) {
            const ok = await ensureCmd(recipe.precheck);
            if (!ok) fail(`Missing prerequisites: ${recipe.precheck}. Install it and try again.`);
        }

        const [cmd, args] = recipe.cmd(name, extra);
        console.log(chalk.cyan(`→ ${cmd} ${args.join(' ')}`));

        const child = execa(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' });
        child.on('exit', (code) => process.exit(code ?? 0));
        child.on('error', (e) => fail(e.message));
    } catch (error) {
        if (error.name === 'ExitPromptError' || error.message.includes('SIGINT')) {
            quit();
        } else {
            fail(`An error occurred: ${error.message}`);
        }
    }
};

// Exit with 'q' or 'Ctrl+C'
process.on('SIGINT', () => {
    quit();
});

run();

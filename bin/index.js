#!/usr/bin/env node
import inquirer from 'inquirer';
import { execa } from 'execa';
import { existsSync } from 'fs';
import chalk from 'chalk';
import clear from 'clear';
import { VERSION } from '../lib/version.js';
import { CONSTS } from '../lib/const.js';

// Show version
if (process.argv.includes(CONSTS.VERSION_TAG) || process.argv.includes(CONSTS.VERSION_SHORT)) {
    console.log(VERSION);
    process.exit(0);
}

// Fail function
const fail = (msg) => { console.error(chalk.red(msg)); process.exit(1); };

// Quit function
const quit = () => {
    console.log(chalk.red('\nProcess finished. See you soon!'));
    process.exit(0);
};

// Ensure command function
const ensureCmd = async (cmd) => {
    try { await execa(cmd, ['--version'], { stdio: 'ignore' }); return true; }
    catch { return false; }
};

// Recipes
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

// Welcome message
const welcomeMessage = () => {
    clear();
    console.log(chalk.green.bold('Welcome to ALLCMDS CLI ✨ !\n'));
    console.log(chalk.cyan('Create projects easily with a single command.\n'));
};

// Run function
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
                    { name: CONSTS.QUIT_MESSAGE, value: 'quit' }
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
        console.log(chalk.cyan(`→ ${cmd} ${args.join(':')}`));

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

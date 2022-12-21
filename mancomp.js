#!/usr/bin/env node
/* eslint-disable */
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const outputDir = 'src/public';
const lessDir = 'src/public/css';

const command = process.argv[2] || null;
const type = process.argv[3] || null;
const name = process.argv[4] || null;

if(
	command == 'a' && (
		type == 'app' || 
		type == 'component'
	) &&
	name != ''
) {
	const newDir = path.join(__dirname, outputDir, type+'s/'+name);
	fs.mkdirSync(newDir);
	fs.writeFileSync(path.join(newDir, 'index.tsx'), '');
	fs.writeFileSync(path.join(newDir, `${name}.less`), `@import '${path.relative(newDir,lessDir)}/_constants.less';`);
	console.log(`
Created new component in ${newDir}
	`)
} else if (
	command == 'r' && (
		type == 'app' || 
		type == 'component'
	) &&
	name != ''
) {
	const findDir = path.join(__dirname, outputDir, type+'s/'+name);
	if(fs.existsSync(findDir)) {
		var result = fs.rmSync(findDir, { recursive: true, force: true });
		console.log(`\nDeleted component in ${findDir}`);
	} else {
		console.log(`Component not found`);
	}
} else {
	console.log(`
To create component and generate less import file use:
	./mancomp.js a [type: app or component] [name]

To remove component and generate less import file use:
	./mancomp.js r [type: app or component] [name]

Type is a subfolder in your public directory
	`);
}




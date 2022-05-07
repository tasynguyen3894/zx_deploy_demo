const fs = require('fs');  
const branchDeploy = 'master';
const buildFolder = 'dist';
const temporalyFolder = 'temp';
const remoteHost = (await $`git config --get remote.origin.url`).stdout.trim();

fs.existsSync(temporalyFolder) && await $`rm ${temporalyFolder} -rf`;

await $`git clone ${remoteHost} ${temporalyFolder}`;
cd(`./${temporalyFolder}`) && await $`git checkout ${branchDeploy}`
cd('..');

await $`rm -rf ./${temporalyFolder}/*`;
await $`cp -a ./${buildFolder}/. ./${temporalyFolder}/`;
cd(`./${temporalyFolder}`);
if ((await $`git ls-files --others -d -m`).stdout.trim()) {
  await $`git add .`;
  await $`git commit -m "deploy"`;
  await $`git push origin ${branchDeploy}`;
}
await $`rm ${temporalyFolder} -rf`;
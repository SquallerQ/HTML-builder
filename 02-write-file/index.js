const fs = require('fs');
const path = require('path');
const { stdout, stdin, exit } = process;

const createNewFile = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Hi! Write your message here:\n');

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    endProcess();
  } else {
    createNewFile.write(data);
  }
});

process.on('SIGINT', endProcess);

function endProcess() {
  stdout.write('Process Ended\n');
  exit();
}

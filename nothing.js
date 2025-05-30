const input = require('fs').readFileSync('/dev/stdin', 'utf8');
const N = parseInt(input.trim(), 10);

for (let i = N; i >= 0; i--) {
  console.log(i);
}
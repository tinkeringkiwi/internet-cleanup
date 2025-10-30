function sha256(str) {
	// Use SubtleCrypto if available, fallback to a simple hash for demo
	if (window.crypto && window.crypto.subtle) {
		const encoder = new TextEncoder();
		return window.crypto.subtle.digest('SHA-256', encoder.encode(str)).then(buf => {
			return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
		});
	}
}

document.getElementById('start').addEventListener('click', async () => {
	const difficulty = parseInt(document.getElementById('difficulty').value, 10);
	const input = document.getElementById('input').value;
	const zeros = '0'.repeat(difficulty);
	const resultDiv = document.getElementById('result');
	const workDiv = document.getElementById('work');
	resultDiv.textContent = 'Benchmark running...';
	workDiv.textContent = '';
	let times = [];
	let nonces = [];
	let hashes = [];
	let iterationsArr = [];
	for (let run = 0; run < 100; run++) {
		let nonce = Math.floor(Math.random() * 1e10);
		let hash = '';
		let iterations = 0;
		let startTime = performance.now();
		while (true) {
			hash = await sha256(input + nonce);
			iterations++;
			if (hash.startsWith(zeros)) {
				break;
			}
			if (iterations % 10000 === 0) {
				workDiv.textContent = `Run ${run+1}/10\nCurrent nonce: ${nonce}\nCurrent hash: ${hash}`;
				await new Promise(r => setTimeout(r, 1)); // Yield to UI
			}
			nonce++;
		}
		let endTime = performance.now();
		times.push(endTime - startTime);
		nonces.push(nonce);
		hashes.push(hash);
		iterationsArr.push(iterations);
		workDiv.textContent += `\nRun ${run+1} finished: Nonce=${nonce}, Time=${(endTime-startTime).toFixed(2)} ms, Iterations=${iterations}`;
	}
	const avg = times.reduce((a,b) => a+b, 0) / times.length;
	resultDiv.textContent = `Average time: ${avg.toFixed(2)} ms over 10 runs.`;
	workDiv.textContent += `\n\nAll runs:\n` + times.map((t,i) => `Run ${i+1}: Nonce=${nonces[i]}, Hash=${hashes[i]}, Time=${t.toFixed(2)} ms, Iterations=${iterationsArr[i]}`).join('\n');
});

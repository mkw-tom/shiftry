const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // O/I/L/0/1 除外

export function generateStoreCode(): string {
	const seg = [4, 4, 4]; // XXXX-XXXX-XXXX
	const parts: string[] = [];
	for (const len of seg) {
		let s = "";
		for (let i = 0; i < len; i++) {
			s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
		}
		parts.push(s);
	}
	return parts.join("-");
}

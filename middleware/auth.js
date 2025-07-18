module.exports = {
	genSalt, hash256, sign, decode
}

const dotenv = require("dotenv");
dotenv.config();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const JWTSecret = process.env.JWT_SECRET;

function genSalt() {
	return crypto.randomBytes(32);
}

function hash256(password, salt) {
	const pepper = Buffer.from(process.env.PEPPER, "hex");
	let hashes = []
	let hash = Buffer.from(password);
	let hash2 = Buffer.from("");
	let hash3 = Buffer.from("");

	for (let i = 0; i < 256; i++) {
		hash2 = crypto.createHash("sha256").update(hash).update(salt).digest();
		hash3 = crypto.createHash("sha3-256").update(hash).update(salt).digest();
		if ((pepper[Math.floor(i >>> 4)] & (1 << (i % 16))) ^ (salt[Math.floor(i >>> 4)] & (1 << (i % 16)))) {
			hash = hash2;
			hashes.push(hash3);
		} else {
			hash = hash3;
			hashes.push(hash2);
		}
	}

	let checksum = 0;
	let checksum2 = 0;
	let checksum3 = 0;

	for (let i = 0; i < hashes.length; i++) {
		hash2 = crypto.createHash("sha256").update(hashes[i]).update(salt).digest();
		hash3 = crypto.createHash("sha3-256").update(hash).update(salt).digest();

		if ((pepper[Math.floor(i >>> 4)] & (1 << (i % 16))) ^ (salt[Math.floor(i >>> 4)] & (1 << (i % 16)))) {
			for (let j = 0; j < 32; j++) {
				checksum2 += hash2[j];
			}
			checksum = checksum2 % 256;
		} else {
			for (let j = 0; j < 32; j++) {
				checksum3 += hash2[j];
			}
			checksum = checksum3 % 256;
		}

		hash2 = crypto.createHash("sha256").update(hashes[i]).update(hashes[checksum]).update(salt).digest();
		hash3 = crypto.createHash("sha3-256").update(hashes[i]).update(hashes[checksum]).update(salt).digest();

		if ((pepper[Math.floor(i >>> 4)] & (1 << (i % 16))) ^ (salt[Math.floor(i >>> 4)] & (1 << (i % 16)))) {
			hashes[checksum] = hash2;
		} else {
			hashes[checksum] = hash3;
		}
	}
	hash = Buffer.alloc(32);
	for (let i = 0; i < hashes.length; i++) {
		for (let j = 0; j < 32; j++) {
			hash[j] += hashes[i][j];
		}
	}
	return Buffer.concat([hash, salt]).toString("hex").toUpperCase();
}

function sign(data) {
	return jwt.sign(data, JWTSecret);
}

function decode(JWT) {
	return jwt.verify(JWT, JWTSecret);
}
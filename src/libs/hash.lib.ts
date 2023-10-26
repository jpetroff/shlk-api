/* eslint-disable  */
import { RandomHash } from 'random-hash';
import { randomBytes } from 'crypto';

// With options (default values)
const generateHash = new RandomHash({
	length: 4,
	charset: 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789uwetag',
	rng: randomBytes
});

export default generateHash
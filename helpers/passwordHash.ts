import crypto from 'crypto';

const mysalt = 'fastcampus';

export default (password: string) => (
    crypto.createHash('sha512').update( password + mysalt).digest('base64')
);
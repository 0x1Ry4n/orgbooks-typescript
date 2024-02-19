import bcrypt from "bcrypt";

type HashType = {
    hashedString: string;
    passwordSalt: string;
};

type CompareHashType = {
    plainText: string;
    hash: string;
};

const generateHash = (password: string, salt?: string): Promise<HashType> => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<HashType>(async (resolve, reject) => {
        try {
            const hashSalt = salt || (await bcrypt.genSalt(16));

            const generatedHash = bcrypt.hashSync(password, hashSalt);

            resolve({
                hashedString: generatedHash,
                passwordSalt: hashSalt,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const compareHash = async ({ plainText, hash }: CompareHashType) => {
    const isValidHash = await bcrypt.compare(plainText, hash);

    return isValidHash;
};

export { generateHash, compareHash };

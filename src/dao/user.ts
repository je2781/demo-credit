import {dbConnection} from '../db/server';
import {v4 as idGenerator} from 'uuid';

interface createUserProps{
    fullName: string;
    email: string;
    wallet: number;
    password: string;
}

type User = {
    fullName: string;
    email: string;
    wallet: number;
    password: string;
}

export const createUser = async (data: createUserProps): Promise<string> => {
    const [id] = await dbConnection()('users').insert({
        id: idGenerator(),
        email: data.email,
        password: data.password,
        full_name: data.fullName,
        wallet: data.wallet
    }).returning('id');

    return id;
}

export const findUser = async (input: {email: string}): Promise<User> => {
    const user = await dbConnection()('users').where('email', input.email).first();

    return user;
}

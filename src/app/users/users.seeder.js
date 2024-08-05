import bcrypt from 'bcrypt';

import { Users_Model } from './users.model.js';

export class Users_Seeder {
	static insertAdmin = async () => {
		//
		try {
			const adminExists = await Users_Model.findOne({ where: { username: 'admin' } });

			if (!adminExists) {
				const hashedPassword = await bcrypt.hash(process.env.TABLE_USERS_ADMIN_PASS, 10);

				await Users_Model.create({
					username: 'admin',
					password: hashedPassword,
					role: 'admin',
				});

				console.log('Admin User Created');
			}
		} catch (error) {
			console.log('Can Not Create Admin User');
		}
	};
}

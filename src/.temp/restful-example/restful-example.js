// Model | Resource | Entity = user

const CRUD = {
	//
	getAll: {
		method: 'GET',
		url: '/users',
	},
	get: {
		method: 'GET',
		url: '/users/:id',
	},
	delete: {
		method: 'DELETE',
		url: '/users/:id',
	},
	add: {
		method: 'POST',
		url: '/users',
	},
	edit: {
		method: 'PUT',
		url: 'users/:id',
	},
	update: {
		method: 'PATCH',
		url: 'users/:id',
	},
};

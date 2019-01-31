module.exports = {
	getPosts: (req, res, next) => {
		req.app
			.get('db')
			.query('select * from nested_posts order by time desc')
			.then((response) => {
				res.status(200).send(response);
			})
			.catch((err) => res.status(500).send(err));
	},
	getReply: (req, res, next) => {
		req.app
			.get('db')
			.query(`select * from nested_reply where respond_id=${req.params.id}`)
			.then((response) => {
				res.status(200).send(response);
			})
			.catch((err) => res.status(500).send(err));
	},
	newPost: (req, res, next) => {
		if (req.body.username === '') {
			let guestPost = Object.assign(
				{},
				{ user_id: 1 },
				{ post: req.body.post },
				{ respond_id: req.body.respond_id }
			);

			req.app
				.get('db')
				.nested_message.insert(guestPost)
				.then((response) => {
					res.status(200).send(response);
				});
		} else {
			req.app
				.get('db')
				.nested_user.where('email=$1 AND username=$2', [
					req.body.email,
					req.body.username
				])
				.then((response) => {
					if (response[0] !== undefined) {
						let userPost = Object.assign(
							{},
							{ user_id: response[0].id },
							{ post: req.body.post },
							{ respond_id: req.body.respond_id }
						);
						req.app
							.get('db')
							.nested_message.insert(userPost)
							.then((result) => res.status(200).send(result));
					} else {
						req.app
							.get('db')
							.query(
								`insert into nested_user (email,username) values ('${
									req.body.email
								}','${req.body.username}')`
							)
							.then(() => {
								req.app
									.get('db')
									.nested_user.where('email=$1 AND username=$2', [
										req.body.email,
										req.body.username
									])
									.then((response) => {
										req.app
											.get('db')
											.nested_message.insert(
												Object.assign(
													{},
													{ user_id: response[0].id },
													{ post: req.body.post },
													{ respond_id: req.body.respond_id }
												)
											)
											.then((result) => res.status(200).send(result));
									});
							});
					}
				});
		}
	},
	isLiked: (req, res, next) => {
		req.app
			.get('db')
			.query(
				`select * from nested_like where user_id=${
					req.params.user
				} and post_id=${req.params.id}`
			)
			.then((response) => res.status(200).send(response))
			.catch((err) => res.status(500).send(err));
	},
	addLike: (req, res, next) => {},
	deleteLike: (req, res, next) => {}
};

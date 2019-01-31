import React, { Component } from 'react';
import Message from './Message';
import QuickPost from './QuickPost';
import axios from 'axios';

class Page extends Component {
	constructor() {
		super();
		this.state = {
			posts: [],
			username: '',
			email: ''
		};
	}
	componentDidMount() {
		this.getPosts();
	}

	getPosts = () => {
		axios
			.get('/api/posts')
			.then((response) => this.setState({ posts: response.data }));
	};
	handleChange = (e, name) => {
		this.setState({ [name]: e.target.value });
	};

	render() {
		let messages = this.state.posts.map((message) => (
			<Message
				getPosts={this.getPosts}
				key={message.post_id}
				reply={message}
				email={this.state.email}
				username={this.state.username}
			/>
		));
		return (
			<div className='page'>
				<div className='comment-box'>
					<div className='comment-head'>
						<h6 className='comment-name'>
							username:{' '}
							<input
								value={this.state.username}
								type='text'
								onChange={(e) => this.handleChange(e, 'username')}
							/>
						</h6>
						<h6 className='comment-name'>
							email:{' '}
							<input
								value={this.state.email}
								type='text'
								onChange={(e) => this.handleChange(e, 'email')}
							/>
						</h6>
						<span>login by filling out these fields</span>
					</div>
					<div className='comment-foot'>
						<QuickPost
							respond_id={null}
							email={this.state.email}
							username={this.state.username}
							getPosts={this.getPosts}
							startReply={() => this.setState({ email: this.state.email })}
						/>
					</div>
				</div>
				<div className='comments-container'>{messages}</div>
			</div>
		);
	}
}

export default Page;

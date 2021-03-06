import React, { Component } from 'react';
import axios from 'axios';

class QuickPost extends Component {
	constructor(props) {
		super(props);
		this.state = {
			post: ''
		};
	}
	handleChange = (e, name) => {
		this.setState({ [name]: e.target.value });
	};

	clearState = () => {
		this.setState({ post: '' }, () => {
			this.props.getPosts();
		});
		this.props.startReply();
	};

	newPost = () => {
		let postInfo = Object.assign(
			{},
			{ post: this.state.post },
			{ email: this.props.email },
			{ username: this.props.username }
		);
		if (this.state.post !== '') {
			axios.post('/api/post', postInfo).then(() => this.clearState());
		}
	};

	render() {
		return (
			<div className='comment-foot'>
				<textarea
					value={this.state.post}
					type='text'
					onChange={(e) => this.handleChange(e, 'post')}
				/>
				<button onClick={() => this.newPost()} className='post-button'>
					post
				</button>
			</div>
		);
	}
}

export default QuickPost;

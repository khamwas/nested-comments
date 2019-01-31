import React, { Component } from 'react';
import Reply from './Reply';
import QuickPost from './QuickReply';
import axios from 'axios';
import Moment from 'react-moment';

const svgStyle = {
	width: '24px',
	height: '24px'
};

class Message extends Component {
	constructor(props) {
		super(props);
		this.state = {
			replies: [],
			likes: 0,
			isLiked: false,
			reply: false
		};
	}
	getReplies = () => {
		axios
			.get(`/api/reply/${this.props.reply.post_id}`)
			.then((response) => this.setState({ replies: response.data }));
	};
	componentDidMount() {
		this.getReplies();
		this.like();
	}
	startReply = () => {
		this.setState({ reply: !this.state.reply });
	};
	likeNumber = () => {};
	like = () => {
		axios
			.get(
				`/api/isliked/${this.props.reply.post_id}/${this.props.reply.user_id}`
			)
			.then((response) => {
				if (response.data[0] !== undefined) {
					this.setState({ isLiked: true });
				}
			});
	};

	render() {
		let replies = this.state.replies.map((reply) => (
			<Reply
				key={reply.post_id}
				reply={reply}
				getPosts={this.props.getPosts}
				email={this.props.email}
				username={this.props.username}
			/>
		));
		return (
			<div className='comment-box'>
				<div className='comment-head'>
					<h6 className='comment-name by-author'>
						{this.props.reply.username}
					</h6>
					<span>
						<Moment format={'MMM-D-LT'}>{this.props.reply.time}</Moment>
					</span>
				</div>
				<div className='comment-content'>
					{this.props.reply.post}{' '}
					<div className='comment-head'>
						{this.state.reply && (
							<QuickPost
								respond_id={this.props.reply.post_id}
								email={this.props.email}
								username={this.props.username}
								getPosts={this.props.getPosts}
								getReplies={this.getReplies}
								startReply={this.startReply}
							/>
						)}{' '}
						<h4 className='comment-name'>
							{this.state.replies.length} comments
						</h4>
						<h4 className='comment-name'>{this.state.likes} likes</h4>
						<i onClick={() => this.startReply()} className='fa fa-reply'>
							<svg style={svgStyle} viewBox='0 0 24 24'>
								<path
									fill='#000000'
									d='M10,9V5L3,12L10,19V14.9C15,14.9 18.5,16.5 21,20C20,15 17,10 10,9Z'
								/>
							</svg>
						</i>
						<i className='fa fa-heart'>
							<svg style={svgStyle} viewBox='0 0 24 24'>
								<path
									fill='#000000'
									d='M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z'
								/>
							</svg>
						</i>
					</div>
				</div>
				{/* <!--Nested Comments insert here --> */}
				{replies}
			</div>
		);
	}
}

export default Message;

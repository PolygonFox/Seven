import React from 'react';
import { Link } from 'react-router';

import './navigation.scss';

class Navigation extends React.Component {
	render() {
		return (
			<nav className="navigation">
				<ul>
					<li><Link to="/">Home</Link></li>
					<li><Link to="/shop">Shop</Link></li>
					<li><Link to="/about">About</Link></li>
					<li><Link to="/notfound">NotFound</Link></li>
				</ul>
			</nav>
		)
	}
}

export default Navigation;
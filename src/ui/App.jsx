import React from 'react';

import Navigation from './navigation/Navigation.jsx';

class App extends React.Component {
	render() {
		return (
			<div>
				<Navigation />
				<div className="content">
					{this.props.children}
				</div>
			</div>
		)
	}
}

export default App;
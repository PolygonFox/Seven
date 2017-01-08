import React from 'react';


import './shop.scss';

class Shop extends React.Component {

	constructor(props) {
		super(props);
		this.state = { products: [] };
	}

	componentDidMount() {

		this.getProductsFromApiASync();
	}

	getProductsFromApiASync() {
		var _this = this;
		return fetch('/api/test')
			.then((response) => response.json())
			.then((responseJSON) => {
				_this.setState({
					products: responseJSON.entries
				})
			})
			.catch((error) => {
				console.error(error);
			});
	}

	render() {
		return (
			<div className="shop">
				<h1>Shop</h1>
				<div className="entries">
						{Array.apply(null, this.state.products).map(function(item, i){

							return (
								<div className="entry" key={item.id}>
									<label>{item.name}</label>
									<p>
										{item.description}<br/>
										{item.price}
									</p>
								</div>
							)

						})}
				</div>
			</div>
		)
	}
}

export default Shop;
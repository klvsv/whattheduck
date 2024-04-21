import React from "react";

interface Product {
	id: string;
	name: string;
	description: string;
	images: string[];
	default_price: {
		unit_amount: number;
		currency: string;
	} | null;
}

interface ProductListProps {
	products: Product[];
	isLoading: boolean;
	error: string | null;
}

const ProductList: React.FC<ProductListProps> = ({ products, isLoading, error }) => {
	return (
		<div className="store-page">
			<h2>Our Products</h2>
			{isLoading && <p>Loading...</p>}
			{error && <p className="error-message">{error}</p>}
			<div className="product-grid">
				{products.map((product) => (
					<div
						className="product-card"
						key={product.id}
					>
						<h3>{product.name}</h3>
						{product.images && (
							<img
								src={product.images[0]}
								alt={product.name}
							/>
						)}
						<p>{product.description}</p>
						<p>${product.default_price ? (product.default_price.unit_amount / 100).toLocaleString(undefined, { style: "currency", currency: product.default_price.currency }) : "Price unavailable"}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default ProductList;

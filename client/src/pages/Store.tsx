import React, { useState, useEffect } from "react";
import ProductList from "../components/ProductList";
import api from "../utils/api";

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

const Store: React.FC = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchProducts = async () => {
			setIsLoading(true);
			try {
				const response = await api.get("/products");
				setProducts(response.data);
			} catch (err) {
				setError("Failed to fetch products");
			} finally {
				setIsLoading(false);
			}
		};
		fetchProducts();
	}, []);

	return (
		<div>
			<ProductList
				products={products}
				isLoading={isLoading}
				error={error}
			/>
		</div>
	);
};

export default Store;

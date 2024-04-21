import React, { useState } from "react";
import axios from "axios";

const Login: React.FC = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[event.target.name]: event.target.value,
		});
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitting(true);
		setError("");

		try {
			const response = await axios.post("http://localhost:3001/auth/login", formData);

			console.log("Login Response:", response);
			console.log("Customer Id from response:", response.data.customerId);

			localStorage.setItem("customerId", response.data.customerId);

			console.log("Value stored in localStorage:", localStorage.getItem("customerId"));
			console.log("Login Response:", response);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data.error || "Login failed");
			} else {
				console.error("Unexpected error:", err);
				setError("An unexpected error occurred");
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div>
			<h2>Login </h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="email">Email:</label>
					<input
						type="email"
						id="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						required
					/>
				</div>
				<button
					type="submit"
					disabled={isSubmitting}
				>
					{isSubmitting ? "Logging In.." : "Login"}
				</button>
			</form>
			{error && <p className="error-message">{error}</p>}
		</div>
	);
};

export default Login;

import React, { useState } from "react";
import axios from "axios";
import "../styles/Registration.css";

interface RegistrationData {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

const Registration: React.FC = () => {
	const [formData, setFormData] = useState<RegistrationData>({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [isRegistrationSuccessful, setIsRegistrationSuccessful] = useState(false);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[event.target.name]: event.target.value,
		});

		if (event.target.name === "password" || event.target.name === "confirmPassword") {
			setPasswordError("");
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitting(true);
		setError("");
		setPasswordError("");

		if (formData.password !== formData.confirmPassword) {
			setPasswordError("Passwords do not match");
			setIsSubmitting(false);
			return;
		}

		try {
			const response = await axios.post("http://localhost:3001/auth/register", formData);
			console.log("Registration Response:", response);

			setFormData({ name: "", email: "", password: "", confirmPassword: "" });
			setIsRegistrationSuccessful(true);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data.error || "Registration failed");
			} else {
				console.error("Unexpected error:", err);
				setError("An unexpected error occurred");
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const resetForm = () => {
		setFormData({ name: "", email: "", password: "", confirmPassword: "" });
		setIsRegistrationSuccessful(false);
	};

	return (
		<>
			<div>
				<h2>Register as a new customer 😸</h2>
				<form onSubmit={handleSubmit}>
					<div className="registerForm">
						<label htmlFor="name">Name:</label>
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
						/>

						<label htmlFor="email">Email:</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
						/>

						<label htmlFor="password">Password:</label>
						<input
							type="password"
							id="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							required
						/>

						<label htmlFor="confirmPassword">Confirm Password:</label>
						<input
							type="password"
							id="confirmPassword"
							name="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleChange}
							required
						/>
					</div>
					<button
						className="registerButton"
						type="submit"
						disabled={isSubmitting}
					>
						{isSubmitting ? "Creating user.." : "Register"}
					</button>
				</form>
			</div>
			{isRegistrationSuccessful && (
				<div className="success-message">
					<p>
						Your user was created. Please <a href="/login">Login</a> to continue 🥳
					</p>
				</div>
			)}

			{error && <p className="error-message">{error}</p>}
			{passwordError && <p className="error-message">{passwordError}</p>}
		</>
	);
};

export default Registration;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import Store from "./pages/Store";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={<h2>WhatTheDuck</h2>}
				/>
				<Route
					path="/register"
					element={<RegisterPage />}
				/>
				<Route
					path="/login"
					element={<LoginPage />}
				/>
				<Route
					path="/store"
					element={<Store />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;

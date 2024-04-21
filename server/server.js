const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const authRoutes = require("./routes/auth");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(
	cookieSession({
		name: "session",
		keys: ["832urhihHKpiup9X890d!893ij"],
		expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
	})
);
app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

// Routes
app.use("/auth", authRoutes);

// Error Handling
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Internal Server Error");
});

// Start the server
app.listen(port, () => {
	console.log(`Server listening on port ${port} 💛`);
});

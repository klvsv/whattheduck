const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const fs = require("fs");

const SALT_ROUNDS = 10;

function authMiddleware(req, res, next) {
	console.log("Incoming session in middleware:", req.session);
	if (!req.session || !req.session.customerId) {
		return res.status(401).json({ error: "Unauthorized" });
	}
	next();
}

function formatProductData(stripeProduct) {
	return {
		id: stripeProduct.id,
		name: stripeProduct.name,
		description: stripeProduct.description,
		images: stripeProduct.images[0] || "",
		price: stripeProduct.default_price ? stripeProduct.default_price.unit_amount / 100 : 0,
	};
}

// ------------------ Register user -------------------
router.post("/register", async (req, res) => {
	const { name, email, password } = req.body;

	try {
		// Read existing users
		const customersData = fs.readFileSync("customers.json");
		const customers = JSON.parse(customersData);

		// Check if username or email already exists
		const existingUser = customers.find((c) => c.name === name || c.email === email);
		if (existingUser) {
			return res.status(400).json({ error: "Username or email already exists" });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);

		const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

		// Create Stripe customer
		const stripeCustomer = await stripe.customers.create({
			name,
			email,
		});

		// Save new customer
		const newCustomer = {
			name,
			email,
			hashedPassword: hashedPassword,
			stripeCustomerId: stripeCustomer.id,
		};
		customers.push(newCustomer);
		fs.writeFileSync("customers.json", JSON.stringify(customers));

		res.status(201).json({ message: "Customer created" });
	} catch (err) {
		console.error("Registration error:", err);
		res.status(500).json({ error: "Something went wrong" });
	}
});

// ------------------- Login ---------------------
router.post("/login", async (req, res) => {
	try {
		const customersData = fs.readFileSync("customers.json");
		const customers = JSON.parse(customersData);

		const customer = customers.find((c) => c.email === req.body.email);
		if (!customer) {
			return res.status(401).json({ error: "Invalid email or password" });
		}

		const isPasswordValid = await bcrypt.compare(req.body.password, customer.hashedPassword);
		if (!isPasswordValid) {
			return res.status(401).json({ error: "Invalid email or password" });
		}
		console.log("customerId before setting in session:", customer.stripeCustomerId);

		req.session.customerId = customer.stripeCustomerId;
		console.log("Session after setting customerId:", req.session);
	} catch (err) {
		console.error("Login error:", err);
		res.status(500).json({ error: "Something went wrong" });
	}
});

// ------------------- Fetch products ---------------------
router.get("/store", authMiddleware, async (req, res) => {
	try {
		const products = await stripe.products.list({
			expand: ["data.default_price"],
		});

		const formattedProducts = products.data.map(formatProductData);

		res.json(formattedProducts);
	} catch (err) {
		console.error("Error fetching products:", err);
		res.status(500).json({ error: "Something went wrong" });
	}
});

module.exports = router;

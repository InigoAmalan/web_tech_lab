
const express = require("express");
const { MongoClient } = require("mongodb");
const path = require("path");

const app = express();
const PORT = 5000;

const MONGO_URL = "mongodb://127.0.0.1:27017";
const DATABASE_NAME = "RegistrationDB";
const COLLECTION_NAME = "users";

const client = new MongoClient(MONGO_URL);

app.use(express.urlencoded({ extended: true }));

// Display the registration form
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "home.html"));
});

// Handle form submission and save data
app.post("/server", async (req, res) => {
    try {
        const {
            name,
            password,
            age,
            mobile,
            email,
            gender,
            state,
            skills
        } = req.body;

        if (
            !name ||
            !password ||
            !age ||
            !mobile ||
            !email ||
            !gender ||
            !state ||
            !skills
        ) {
            return res.status(400).send(
                "Please fill in all the required fields."
            );
        }

        const collection = client
            .db(DATABASE_NAME)
            .collection(COLLECTION_NAME);

        await collection.insertOne({
            name,
            password,
            age: Number(age),
            mobile,
            email,
            gender,
            state,
            skills: Array.isArray(skills) ? skills : [skills],
            createdAt: new Date()
        });

        res.redirect("/server");
    } catch (error) {
        console.error("Error saving registration:", error);
        res.status(500).send("Error saving registration data.");
    }
});

// Display registered users in a table
app.get("/server", async (req, res) => {
    try {
        const collection = client
            .db(DATABASE_NAME)
            .collection(COLLECTION_NAME);

        const users = await collection
            .find({})
            .project({ password: 0 })
            .sort({ _id: -1 })
            .toArray();

        const escapeHTML = (value) =>
            String(value ?? "").replace(/[&<>"']/g, (char) => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            })[char]);

        const rows = users.map((user) => `
            <tr>
                <td>${escapeHTML(user.name)}</td>
                <td>${escapeHTML(user.age)}</td>
                <td>${escapeHTML(user.mobile)}</td>
                <td>${escapeHTML(user.email)}</td>
                <td>${escapeHTML(user.gender)}</td>
                <td>${escapeHTML(user.state)}</td>
                <td>${escapeHTML(
                    Array.isArray(user.skills)
                        ? user.skills.join(", ")
                        : user.skills
                )}</td>
            </tr>
        `).join("");

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0">
                <title>Registered Users</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 30px;
                        background: #f4f6f9;
                    }
                    h1 {
                        text-align: center;
                        color: #243b55;
                    }
                    .table-container {
                        overflow-x: auto;
                        background: white;
                        padding: 15px;
                        border-radius: 10px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 12px;
                        text-align: left;
                    }
                    th {
                        background: #243b55;
                        color: white;
                    }
                    tr:nth-child(even) {
                        background: #f2f2f2;
                    }
                    a {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 10px 16px;
                        background: #243b55;
                        color: white;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                </style>
            </head>
            <body>
                <h1>Registered Users</h1>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Mobile</th>
                                <th>Email</th>
                                <th>Gender</th>
                                <th>State</th>
                                <th>Skills</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows || `
                                <tr>
                                    <td colspan="7">
                                        No registrations found.
                                    </td>
                                </tr>
                            `}
                        </tbody>
                    </table>
                </div>
                <a href="/">Register Another User</a>
            </body>
            </html>
        `);
    } catch (error) {
        console.error("Error retrieving registrations:", error);
        res.status(500).send("Error retrieving registration data.");
    }
});

// Connect to MongoDB and start the server
async function startServer() {
    try {
        await client.connect();

        console.log("MongoDB Connected Successfully");

        app.listen(PORT, "127.0.0.1", () => {
            console.log(
                `Server running at http://127.0.0.1:${PORT}`
            );
        });
    } catch (error) {
        console.error("Could not start the application:", error);
        process.exitCode = 1;
    }
}

startServer();

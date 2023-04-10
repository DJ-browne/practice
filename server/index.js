const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// middieware
app.use(cors());
app.use(express.json()); // req.body

// Routes

// create a todo
app.post("/todos", async (req, res) => {
    try {
        console.log(req.body);
        const { description } = req.body;
        const newTodo = await pool.query(
            "insert into todo (description) values($1) returning *",
            [description]
        );
        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// get all vending items

app.get("/vending_items", async (req, res) => {
    try {
        const allItems = await pool.query(
            "select * from vending_machine_items order by id ASC"
        );
        res.json(allItems.rows);
    } catch (err) {
        console.error(err.message);
    }
});
// get all todos

app.get("/users", async (req, res) => {
    try {
        const allUsers = await pool.query(
            "select * from users order by id ASC"
        );
        res.json(allUsers.rows);
    } catch (err) {
        console.error(err.message);
    }
});


app.patch("/users/:id", async (req, res) => {
    const { id } = req.params;
    const purchasePrice = req.body.purchasePrice;
    try {

        const user = await pool.query(
            "select * from users WHERE id = $1",
            [id]
        );

        console.log(JSON.stringify(user.rows[0]), 'user')

        const usersCurrentBalance = user.rows[0].balance;
        
        const updatedBalance = usersCurrentBalance - purchasePrice;

        const updateUser = await pool.query(
            "update users set balance = $1 WHERE id = $2",
            [updatedBalance, id]
        );
        res.json(updateUser.rows[0]);

    } catch (err) {
        console.error(err.message);
    }
});

// get a todo

app.get("/todos/:id", async (req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params;
        const todo = await pool.query(
            "select * from todo where todo_id = $1,", [id]
        );
        res.json(todo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});
// update a todo

app.put("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const updateTodo = await pool.query(
            "update todo set description = $1 where todo_id = $2",
            [description, id]
        );

        res.json("Todo was updated!");
    } catch (err) {
        console.error(err.message);
    }
});
// delete a todo

app.delete("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTodo = await pool.query(
            "delete from todo where todo_id = $1",
            [id]
        );
        res.json("Todo was deleted!");
    } catch (err) {
        console.error(err.message);
    }
});


app.listen(5000, () => {
    console.log("working on port 5000");
});


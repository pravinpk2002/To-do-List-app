const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');  
const app = express();


app.use(cors());  

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const pool = new Pool({
    user: 'postgres',         
    host: 'localhost',        
    database: 'todolist',     
    password: 'root',         
    port: 5432,               
});


app.get('/tasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/tasks', async (req, res) => {
    const { task } = req.body;
    try {
        const result = await pool.query('INSERT INTO tasks (task) VALUES ($1) RETURNING *', [task]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { is_checked } = req.body;
    try {
        const result = await pool.query(
            'UPDATE tasks SET is_checked = $1 WHERE id = $2 RETURNING *',
            [is_checked, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.send(`Task with ID ${id} deleted`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

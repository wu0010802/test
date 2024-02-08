const { request, response } = require('express');
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'yilunwu',
  host: 'localhost',
  database: 'fitness',
  password: 'password',
  port: 5432,
})

const get_users_info = (request, response) => {
  pool.query('SELECT * FROM user_info ORDER BY user_id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows);
  });
}

const get_users_info_by_name = (request, response) => {
  const name = request.params.name;

  pool.query('SELECT * FROM user_info WHERE name = $1', [name], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const post_user_info = (request, response, next) => {
  const { name, height, weight, year, gender } = request.body;
  // const bmi = weight / (height / 100) ** 2;
  const now = new Date();

  pool.query('INSERT INTO user_info (name, weight, height, year, gender, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [name, height, weight, year, gender, now], (error, results) => {
      if (error) {
        next(error);
      } else {
        response.status(201).send(`User added with ID: ${results.rows[0].user_id}`);
      }
    });
};

const update_user_info = (request, response, next) => {
  const name = request.params.name;
  const { weight, height, year, gender } = request.body;
  // const bmi = weight / (height / 100) ** 2;
  const now = new Date();
  pool.query('UPDATE user_info SET weight = $2,gender=$5 ,height = $3, year = $4 WHERE name = $1 RETURNING *', [name, weight, height, year, gender], (error, results) => {
    if (error) {
      next(error);
    }
    if (results.rows.length > 0) {

      response.status(200).json(results.rows[0]);
    } else {

      response.status(404).send(`User not found with name: ${name}`);
    }
  });
}
const deleteUser = (request, response) => {
  const name = request.params.name;

  pool.query('DELETE FROM user_info WHERE name = $1', [name], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${name}`)
  })
}

module.exports = {
  post_user_info,
  get_users_info,
  get_users_info_by_name,
  update_user_info,
  deleteUser,
}
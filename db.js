const mysql = require("mysql2");
const dotenv = require('dotenv');
let instance=null;
dotenv.config();


// Validate environment variables
const requiredEnvVars = ["HOST", "DB_PORT", "DB_USER", "PASSWORD", "DATABASE"];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Error: Missing required environment variable ${envVar}`);
        process.exit(1); // Exit the process if a required variable is missing
    }
}

// Create a connection to the database
const con = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

// Connect to the database
con.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err.message);
        return;
    }
    console.log("Connected to the database!");
});

class Db{
    static getDbInstance(){
        return instance?instance:new Db();
    }

    async getAllData()
    {
        try{
            const responce=await new Promise((resolve,reject)=>{
                const query ="SELECT * FROM names;";
                con.query(query,(err,results)=>{
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })
            return responce
        }
        catch(error){
            console.log(error);

        }

    }

    async addName(name) {
        try {
            const dateAdded = new Date();
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO names (name, date_added) VALUES (?,?);";
    
                con.query(query, [name, dateAdded], (err, result) => {
                    if (err) {
                        console.error("Query error:", err.message);
                        reject(new Error(err.message));
                        return;
                    }
                    console.log("Query result:", result); // Log result structure
                    resolve(result?.insertId || null); // Handle missing insertId
                });
            });
            return {
                id: insertId,
                name: name,
                dateAdded: dateAdded
            };
        } catch (error) {
            console.error("Error in addName:", error.message);
        }
    }
    async deleteById(id)
    {
        try{
            id =parseInt(id,10);
            const responce=await new Promise((resolve,reject)=>{
                const query="DELETE FROM names WHERE id=?";
                con.query(query,[id],(err,result)=>{
                    if (err) reject(new Error(err.message));
                    resolve(result.affectRows);
                })
            });
            return responce===1?true:false;

        }
        catch(error){
            console.log(error)
            return false;

        }

    }
    async updateById(id,name)
    {
        try{
            id =parseInt(id,10);
            const responce=await new Promise((resolve,reject)=>{
                const query="UPDATE names SET name=? where id=?";
                con.query(query,[name,id],(err,result)=>{
                    if (err) reject(new Error(err.message));
                    resolve(result.affectRows);
                })
            });
            return responce===1?true:false;

        }
        catch(error){
            console.log(error)
            return false;

        }

    }
    async searchByName(name)
    {
        try{
            const responce=await new Promise((resolve,reject)=>{
                const query="SELECT * FROM names WHERE NAME=?";
                con.query(query,[name],(err,result)=>{
                    if (err) reject(new Error(err.message))
                        resolve(result)
                })
           
            })
            return responce

        }
        catch(error){
            console.log(error)

        }

    }

}
module.exports=Db;

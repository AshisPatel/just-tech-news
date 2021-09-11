const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// Create our User model 

class User extends Model {}

//  Define table columns and configuration

User.init(
    {
        // Table column definitions go here
        // define an id column
        id: {
            // use the special Sequelize DataTypes object to provide what type of data it is
            type: DataTypes.INTEGER,
            // this is the equivalent of SQL's 'NOT NULL' option
            allowNull: false,
            // instruct that this is the primary key
            primaryKey: true,
            //  turn on auto increment
            autoIncrement: true
        },
        // define a username column
        username: {
            
            type: DataTypes.STRING,
            allowNull: false
        },
        // define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // There cannot be duplicate emails in this table
            unique: true,
            // if allowNull is set to false, we can run our data through a validator before creating table data
            validate: {
                isEmail: true
            }
            
        },
        // define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // This means the password must be at least four characters long
                len: [4]
            }
        }
    },
    {
        // Table configuration options go here

        // Pass in our imported sequelize connection (direct connection to our db)
        sequelize,
        // don't automtically create createdAt/updatedAt timestamp fields
        timestamps: false,
        //  don't pluralize name of the database table
        freezeTableName: true,
        //  user underscores instead of comal-casing
        underscored: true,
        // make it so our model name stays lowercase in the database
        modelName: 'user'
    }
);

module.exports = User; 
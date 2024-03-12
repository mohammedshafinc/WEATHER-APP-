const Users = require('../models/userRegistration');

const bcrypt = require('bcrypt');

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLEnumType,
} = require('graphql');

// Project Type
const UserType = new GraphQLObjectType({
    name: 'user',
    fields: () => ({
        id: { type: GraphQLID },
        fullName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
    }),
});



const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        UserGet: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return Users.find();
                
            },
        },
        UserLogin: {
            type: UserType,
            args: { email: { type: GraphQLString } },
            resolve(parent, args) {
                return User.findOne({email: args.email});
                // return 10
            },
        },
    },
});


// Mutations
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                fullName: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                return Users.findOne({ email: args.email })
                .then (existingUser => {
                    if (existingUser) {
                        throw new Error('User with the same email already exists.');
                    } else {
                        const newUser = new Users(args);
                        
        
                        return newUser.save()
                            .then(savedUser => {
                                return savedUser;
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }
                })
                .catch(error => {
                    throw error
                });
            },
        },
        loginuser: {
            type: UserType,
            args: {
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                console.log(args.email);
                console.log(args.password);
            
                return Users.findOne({ email: args.email })
                    .then(async (user) => {
                        if (!user) {
                            throw new Error('User not found. Please signup.');
                        }
            
                        // Compare passwords securely
                        const isPasswordValid = await comparePasswords(args.password, user.password);
                        if (!isPasswordValid) {
                            throw new Error('Invalid password.');
                        }
                        console.log('user logged');
                        console.log('user',user); // User authenticated, return user data (exclude password)
                        return user; 
                    })
                    .catch(error => {
                        throw error;
                    });
            }
            
        },
    },
});

async function comparePasswords(plainTextPassword, hashedPassword) {
    try {
        const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        // Handle errors appropriately, e.g., log the error and return false
        console.error('Error comparing passwords:', error);
        return false;
    }
}
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
});
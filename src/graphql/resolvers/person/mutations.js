/* eslint-disable indent */
/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const { toLower } = require('lodash');
const cloudinary = require('cloudinary');

const User = require('../../../models/user');

const { getArgumentInput } = require('../../../helpers/workWithObjects');
const { personPersmissions, setShortName } = require('../../../helpers/setByDefault');
const { sendPassword } = require('../../../helpers/sendEmail');
const generatePassword = require('../../../helpers/others/generatePassword');
const isAuth = require('../../../middleware/is-auth');

module.exports.PersonMutations = {
    createPerson: async(_, { person }, { req }) => {
        const {
            email,
            first_name,
            last_name,
            current_positions: { position_name, function: { name: functionName } },
        } = getArgumentInput(person); // necessary args for creating person
        const lowerEmail = toLower(email).replace(/\s/g, '');
        const chechUser = await User.findOne({ lowerEmail });
        const currentUser = await User.findById(isAuth(req));
        if (!currentUser.is_admin) {
            throw new Error("You're not allowed to do this action!");
        }
        if (chechUser) {
            throw new Error('Email already exist!'); // check if user exist
        }
        const password = generatePassword();
        const hashedpassword = await bcrypt.hash(password, 10);

        if (!first_name || !last_name || !position_name || !lowerEmail) { throw new Error('All fields are necessary'); }

        const fullName = `${first_name} ${last_name}`;

        const user = await User.create({
            ...getArgumentInput(person), // map through the person object and push the arguments to User model
            email: lowerEmail,
            password: hashedpassword,
            full_name: fullName,
            first_name,
            last_name,
        });
        personPersmissions(user, position_name, functionName); // set person permissions
        const getUser = await User.findById(user.id).populate('manager');
        const personProfile = {
            gender: user.gender,
            current_positions: user.current_positions.position_name,
            product: user.current_positions.function.function_short_name &&
                user.current_positions.function.function_short_name.substring(1),
            function: user.current_positions.function.function_short_name,
            team_responsible: getUser.manager ? getUser.manager.full_name : 'none',
        };

        user.person_profile = {
            ...personProfile,
        };

        user.cover_photo.url = `https://cdn-expa.aiesec.org/gis-img/missing_profile_${first_name.charAt(0).toLowerCase()}.svg`;
        user.save(); // save manual modifications

        sendPassword(email, user.full_name, password);
        return user;
    },

    generatePersonPassword: async(_, args) => {
        const allUsers = await User.find();
        for (let i = 0; i < allUsers.length; i++) {
            const password = generatePassword();
            const hashedpassword = await bcrypt.hash(password, 10);
            allUsers[i].password = hashedpassword;
            allUsers[i].save();
            sendPassword(allUsers[i].email, allUsers[i].full_name, password);
        }

        return allUsers;
    },

    updatePerson: async(_, { id, person }) => {
        const {
            first_name,
            last_name,
            current_positions: { position_name, function: { name } },
            manager,
        } = getArgumentInput(person);
        const user = await User.findById(id);
        const lowerEmail = toLower(getArgumentInput(person).email).replace(/\s/g, '');
        const setPosition = (pos) => (position_name === 'alumni' ||
            position_name === 'local committee president' ?
            '' :
            pos);

        User.findByIdAndUpdate(
            id, {
                $set: {
                    ...getArgumentInput(person),
                    email: lowerEmail,
                    full_name: `${first_name.toLowerCase()} ${last_name && last_name.toLowerCase()}`,
                    is_eb: (position_name === 'vice president' || position_name === 'local committee president'),
                    is_lcp: (position_name === 'local committee president'),
                    is_alumni: (position_name === 'alumni'),
                    is_tl: (position_name === 'team leader'),
                    is_member: (position_name === 'team member'),
                    is_manager: (position_name === 'manager'),
                    current_positions: {
                        position_name,
                        function: {
                            name: setPosition(name),
                            function_short_name: setPosition(setShortName(name)),
                        },
                    },
                    manager,
                    person_profile: {
                        gender: user.gender,
                        product: setPosition(setShortName(name).substring(1)),
                        function: setPosition(setShortName(name)),
                        team_responsible: setPosition(manager),
                        current_positions: position_name,
                    },
                },
            }, { new: true },
        ).exec(async(err) => {
            if (err) throw new Error(err);
            return user;
        });
    },

    deletePerson: async(_, { id }) => {
        const deletedPerson = await User.findById(id);

        if (deletedPerson.is_deleted) {
            throw new Error('Person does not exist');
        }

        deletedPerson.is_deleted = true;
        deletedPerson.email = generatePassword();
        deletedPerson.full_name = generatePassword();
        deletedPerson.save();

        if (deletedPerson.cover_photo.public_id) {
            await cloudinary.uploader.destroy(deletedPerson.cover_photo.public_id, async(result) => result);
        }

        return deletedPerson;
    },

    deleteMultiplePeople: async(_, { ids }) => {
        await User.deleteMany({
                _id: {
                    $in: ids,
                },
            },
            (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(result);
                }
            });
        return User.find({});
    },
};
import {User} from "../models/user.model.js";
import {faker} from "@faker-js/faker";

const createUsers = async (numUsers) => {
  try{
    const usersPromise = [];
    for(let i = 0; i < numUsers; i++){
      const tempUser = User.create({
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        password: "password",
        bio: faker.lorem.sentence(15),
        email: faker.internet.email(),
        dob: faker.date.past(),
        avatar: {
          url: `https://api.dicebear.com/8.x/open-peeps/svg?seed=${faker.person.firstName()}&backgroundType=gradientLinear&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`,
          public_id: faker.string.uuid(),
        },
      });
      console.log(tempUser.name);
      usersPromise.push(tempUser);
    }
    await Promise.all(usersPromise);
    console.log(`${numUsers} Users created`);
    process.exit(0);
  }catch(error){
    console.log(error);
    process.exit(1);
  }
};

export {createUsers};
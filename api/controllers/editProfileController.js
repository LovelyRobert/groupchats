const User = require("../models/users");
const History = require("../models/history");
const Room = require("../models/rooms");
const fs = require("fs");

//Handle errors
const handleEditErrors = (err) => {
  let errors = {
    nickname: "",
    description: "",
  };

  if (err.message.toLowerCase().includes("validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    }); //to get an array of the values of the err.errors object and extract each one with destructuring to get only properties and place each one of them in an array
  }
  return errors;
};

//Controllers

module.exports.editProfile_post = async (req, res) => {
  const { nickname, description } = req.body;
  const path = `./public/users/${req.decodedToken.id}`;
  try {
    let user = await User.findOneAndUpdate(
      {
        _id: req.decodedToken.id,
      },
      {
        nickname,
        description,
      },
      {
        runValidators: true,
      }
    );
    const histories = await History.find({
      messages: { $elemMatch: { userId: req.decodedToken.id } },
    });
    const rooms = await Room.find({
      banned_users: { $elemMatch: { _id: req.decodedToken.id } },
    });
    //create the user folder
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
    //Update database
    histories.forEach(async (el) => {
      await History.updateOne(
        { _id: el._id },
        {
          "messages.$[elem].nickname": nickname,
        },
        {
          arrayFilters: [{ "elem.userId": req.decodedToken.id }],
        }
      );
    });
    //If a cover is uploaded
    if (req.file) {
      let fileExtension =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];
      let oldName = `avatar-temp.${fileExtension}`;
      let newName = `${req.decodedToken.id}-avatar.${fileExtension}`;
      ///1-remove old file(in case of different extension)
      let existed = fs.readdirSync(path).filter((el) => {
        return el.includes(`${req.decodedToken.id}-avatar`);
      });

      if (existed.length) {
        let exixstedName = existed.join("");
        fs.unlinkSync(`${path}/${exixstedName}`);
      }
      //2-Rename temp new file
      fs.renameSync(`${path}/${oldName}`, `${path}/${newName}`);
      //3-Database update
      await user.updateOne({
        profile_img: `${process.env.CLIENT_URL}/users/${req.decodedToken.id}/${newName}`,
      });
      histories.forEach(async (el) => {
        await History.updateOne(
          { _id: el._id },
          {
            "messages.$[elem].profileImg": `${process.env.CLIENT_URL}/users/${req.decodedToken.id}/${newName}`,
          },
          {
            arrayFilters: [{ "elem.userId": req.decodedToken.id }],
          }
        );
      });
    }
    //If cover is removed without update
    if (req.body.avatarRemoved == "true") {
      //1-Remove old file
      let existed = fs.readdirSync(path).filter((el) => {
        return el.includes(`${req.decodedToken.id}-avatar`);
      });

      if (existed.length) {
        let exixstedName = existed.join("");
        fs.unlinkSync(`${path}/${exixstedName}`);
      }
      //2-Database update
      await User.findOneAndUpdate(
        {
          _id: req.decodedToken.id,
        },
        {
          profile_img: `${process.env.CLIENT_URL}/profiledefault.jpg`,
        }
      );
      histories.forEach(async (el) => {
        await History.updateOne(
          { _id: el._id },
          {
            "messages.$[elem].profileImg": `${process.env.CLIENT_URL}/profiledefault.jpg`,
          },
          {
            arrayFilters: [{ "elem.userId": req.decodedToken.id }],
          }
        );
      });
    }
    res.status(201).json("Your account was successfully updated!");
  } catch (err) {
    //If there is validation error and user uploaded a file
    if (req.file) {
      let fileExtension =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];
      let oldName = `avatar-temp.${fileExtension}`;
      if (fs.existsSync(`${path}/${oldName}`)) {
        fs.unlinkSync(`${path}/${oldName}`);
      }
    }
    //Error handling
    const errors = handleEditErrors(err);
    res.status(401).json({ errors });
  }
};

module.exports.editInfo_post = async (req, res) => {
  const { first_name, last_name, country, address, city, state } = req.body;
  try {
    await User.findOneAndUpdate(
      {
        _id: req.decodedToken.id,
      },
      {
        first_name,
        last_name,
        country,
        address,
        city,
        state,
      },
      {
        runValidators: true,
      }
    );
    res.status(201).json("Your account was successfully updated!");
  } catch (err) {
    const errors = handleEditErrors(err);
    res.status(401).json({ errors });
  }
};

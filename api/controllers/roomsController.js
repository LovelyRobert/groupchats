const Room = require("../models/rooms");
const History = require("../models/history");
const User = require("../models/users");
const mongoose = require("mongoose");
const fs = require("fs");
const fsPromises = require("fs").promises;

//Handle errors
const handleErrors = (err) => {
  let errors = {
    title: "",
    description: "",
    category: "",
    language: "",
    rooms: "",
  };

  //Title duplication Errors
  if (err.code === 11000) {
    errors.title = "This room's title is already used...";
  }

  //Max rooms error
  if (err.message == "Max reached") {
    errors.rooms =
      "You have already reached the maximum rooms allowed per user.";
  }

  //Validation errors
  if (err.message.toLowerCase().includes("validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    }); //to get an array of the values of the err.errors object and extract each one with destructuring to get only properties and place each one of them in an array
  }

  return errors;
};

//Controllers

module.exports.createRoom_post = async (req, res) => {
  const { title, description, category, language } = req.body;
  const oldPath = `./public/users/${req.decodedToken.id}/rooms/${title}`;
  try {
    const user = await User.findById(req.decodedToken.id);
    if (user.rooms.length >= 4) {
      throw { message: "Max reached" };
    } else {
      const room = await Room.create({
        title,
        description,
        category,
        language,
        created_by: req.decodedToken.id,
      });
      const newPath = `./public/users/${
        req.decodedToken.id
      }/rooms/${room._id.toString()}`;
      //1-Create the new path for the new room
      if (!fs.existsSync(newPath)) {
        fs.mkdirSync(newPath, { recursive: true });
      }
      //In case use uploaded a cover
      if (req.file) {
        const fileExtension =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        //2-Change the name of folders and files
        const oldName = `${req.decodedToken.id}-${title}.${fileExtension}`;
        const newName = `${
          req.decodedToken.id
        }-${room._id.toString()}-banner.${fileExtension}`;
        fs.renameSync(`${oldPath}/${oldName}`, `${newPath}/${newName}`);
        ///3-Remove old folder made by multer
        if (fs.existsSync(oldPath)) {
          await fsPromises.rm(oldPath, { recursive: true });
        }
        ///4-Assign file to database
        await room.updateOne({
          img: `${process.env.CLIENT_URL}/users/${
            req.decodedToken.id
          }/rooms/${room._id.toString()}/${newName}`,
        });
      }
      let historyPromise = History.create({ room_id: room._id.toString() });
      let userPromise = user.updateOne({
        $push: { rooms: room._id.toString() },
      });
      await Promise.all([historyPromise, userPromise]);
      res.status(201).json("Room created successfully!");
    }
  } catch (err) {
    //In case user uploaded a file, remove the temp path made by multer with files
    if (title.length) {
      if (req.file) {
        if (fs.existsSync(oldPath)) {
          await fsPromises.rm(oldPath, { recursive: true });
        }
      }
    }
    //Error handling
    const errors = handleErrors(err);
    res.status(401).json({ errors });
  }
};

module.exports.editRoom_post = async (req, res) => {
  const { title, description, category, language } = req.body;
  const { roomId } = req.params;
  const oldPath = `./public/users/${req.decodedToken.id}/rooms/${title}`;
  let ObjectId = mongoose.Types.ObjectId;
  if (ObjectId.isValid(roomId)) {
    const room = await Room.findById(roomId);
    if (room && room.created_by == req.decodedToken.id) {
      try {
        await room.updateOne(
          {
            title,
            description,
            category,
            language,
          },
          {
            runValidators: true,
          }
        );
        const newPath = `./public/users/${
          req.decodedToken.id
        }/rooms/${room._id.toString()}`;
        //If a cover is uploaded
        if (req.file) {
          const fileExtension =
            req.file.originalname.split(".")[
              req.file.originalname.split(".").length - 1
            ];
          ///1-remove old file(in case of different extension)
          let existed = fs.readdirSync(newPath).filter((el) => {
            return el.includes(
              `${req.decodedToken.id}-${room._id.toString()}-banner`
            );
          });

          if (existed.length) {
            let exixstedName = existed.join("");
            fs.unlinkSync(`${newPath}/${exixstedName}`);
          }
          ///2-Change the name of files
          const oldName = `${req.decodedToken.id}-${title}.${fileExtension}`;
          const newName = `${
            req.decodedToken.id
          }-${room._id.toString()}-banner.${fileExtension}`;
          fs.renameSync(`${oldPath}/${oldName}`, `${newPath}/${newName}`);
          ///3-Remove old folder made by multer
          if (fs.existsSync(oldPath)) {
            await fsPromises.rm(oldPath, { recursive: true });
          }
          //4-Assign file to database
          await room.updateOne({
            img: `${process.env.CLIENT_URL}/users/${
              req.decodedToken.id
            }/rooms/${room._id.toString()}/${newName}`,
          });
        }
        //If cover removed from front-end
        if (req.body.coverRemoved == "true") {
          ///1-remove old file
          let existed = fs.readdirSync(newPath).filter((el) => {
            return el.includes("banner");
          });

          if (existed.length) {
            let exixstedName = existed.join("");
            fs.unlinkSync(`${newPath}/${exixstedName}`);
          }
          //2-update database
          await room.updateOne({
            img: `${process.env.CLIENT_URL}/default-banner.jpg`,
          });
        }
        res.status(201).json("Room updated successfully!");
      } catch (err) {
        //If there is validation error and user uploaded a file
        if (title.length) {
          if (req.file) {
            if (fs.existsSync(oldPath)) {
              await fsPromises.rm(oldPath, { recursive: true });
            }
          }
        }
        //Handle validation errors
        const errors = handleErrors(err);
        res.status(401).json({ errors });
      }
    } else {
      res.status(401).json("Non authorized :)");
    }
  } else {
    res.status(401).json("Bad request.");
  }
};

module.exports.fetchRooms_get = async (req, res) => {
  try {
    const Rooms = await Room.find(req.query);
    res.status(201).json(Rooms);
  } catch (err) {
    res.status(401).json("Something went wrong...");
  }
};

module.exports.fetchSingleRoom_get = async (req, res) => {
  const { roomId } = req.params;
  let ObjectId = mongoose.Types.ObjectId;
  if (ObjectId.isValid(roomId)) {
    try {
      const room = await Room.findById(roomId);
      if (room) {
        res.status(201).json(room);
      } else {
        res.status(404).json({});
      }
    } catch (err) {
      res.status(401).json("Something went wrong...");
    }
  } else {
    res.status(404).json("Bad request.");
  }
};

module.exports.removeSingleRoom_get = async (req, res) => {
  const { roomId } = req.params;
  const path = `./public/users/${req.decodedToken.id}/rooms/${roomId}`;
  let ObjectId = mongoose.Types.ObjectId;
  if (ObjectId.isValid(roomId)) {
    const room = await Room.findById(roomId);
    if (room.created_by == req.decodedToken.id) {
      try {
        //1-update databse
        let roomPromise = await Room.deleteOne({ _id: roomId });
        let creatorPromise = User.findByIdAndUpdate(req.decodedToken.id, {
          $pull: { rooms: roomId },
        });
        let usersPromise = User.updateMany(
          { banned_from: { $elemMatch: { $eq: roomId } } },
          {
            $pull: { banned_from: roomId },
          }
        );
        let favouritePromise = User.updateMany(
          { favourites: { $elemMatch: { $eq: roomId } } },
          {
            $pull: { favourites: roomId },
          }
        );
        let historyPromise = History.deleteOne({ room_id: roomId });
        //2-remove room files async
        let removePromise = fsPromises.rm(path, { recursive: true });
        await Promise.all([
          roomPromise,
          creatorPromise,
          usersPromise,
          historyPromise,
          favouritePromise,
          removePromise,
        ]);
        res.status(200).json();
      } catch (err) {
        res.status(401).json("Something went wrong...");
      }
    } else {
      res.status(401).json("Non authorized :)");
    }
  } else {
    res.status(401).json("Bad request.");
  }
};

const bcrypt = require("bcrypt");

module.exports = {
  Mutation: {
    addColumn: async (root, args, { models }) => {
      const column = await models.Column(args).save();
      return column;
    },
    addCard: async (root, { id, cardInput: args }, { models }) => {
      const card = await models.Card(args).save();
      const column = await models.Column.findOneAndUpdate(
        { _id: id },
        { $push: { cards: card } }
      );
      if (!column) {
        return false;
      }
      return true;
    },
    removeColumn: async (root, { id }, { models }) => {
      const column = await models.Column.findById({ _id: id });
      if (!column) {
        return false;
      }
      if (column.cards && column.cards.length > 0) {
        await models.Card.deleteMany({
          _id: { $in: column.cards }
        });
      }
      await models.Column.deleteOne({ _id: id });
      return true;
    },
    removeCard: async (root, { columnId, cardId }, { models }) => {
      const column = await models.Column.findOneAndUpdate(
        { _id: columnId },
        { $pull: { cards: cardId } }
      );
      if (!column) {
        return false;
      }
      models.Card.deleteOne({ _id: cardId }, (err, result) => {
        if (err) {
          console.error(err);
          return false;
        }
      });
      return true;
    },
    signup: async (root, { email, name, password }, { req, models }) => {
      const isUserExist = await models.User.findOne({ email });
      if (isUserExist) {
        throw new Error("Another user with same email is exist");
      }
      const user = await models
        .User({
          email,
          name,
          password: await bcrypt.hash(password, 12)
        })
        .save();
      console.log(user);
      delete user._doc.password;
      req.session.user = {
        ...user._doc
      };
      return user;
    },
    login: async (root, { email, password }, { req, models }) => {
      const isUserExist = await models.User.findOne({ email });
      if (!isUserExist) {
        throw new Error("Not found user with same email");
      }
      console.log(isUserExist);
      delete isUserExist._doc.password;
      req.session.user = {
        ...isUserExist._doc
      };
      return isUserExist;
    },
    logout: async (root, args, { req, models }) => {
      await req.session.destroy();
      return true;
    }
  }
};

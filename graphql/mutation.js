const bcrypt = require('bcryptjs');

module.exports = {
  Mutation: {
    reorderColumn: async (
      root,
      { boardID, columnID, source, destination },
      { req, models }
    ) => {
      const { user } = req.session;
      if (!user) {
        return {
          success: false,
          message: 'User not logged in',
        };
      }

      await models.Board.findOneAndUpdate(
        { _id: boardID },
        { $pull: { columns: columnID } }
      );
      await models.Board.findOneAndUpdate(
        { _id: boardID },
        {
          $push: {
            columns: {
              $each: [columnID],
              $position: destination,
            },
          },
        }
      );

      // await models.Column.findOneAndUpdate(
      //   { board: boardID, position: destination },
      //   { position: source }
      // );
      // await models.Column.findOneAndUpdate(
      //   { _id: columnID },
      //   { position: destination }
      // );
      return {
        success: true,
        message: 'Column was reordered',
      };
    },
    reorderCard: async (
      root,
      {
        cardID,
        sourceColumnID,
        destinationColumnID,
        sourcePosition,
        destinationPosition,
      },
      { req, models }
    ) => {
      const { user } = req.session;
      if (!user) {
        return {
          success: false,
          message: 'User not logged in',
        };
      }
      await models.Column.findOneAndUpdate(
        { _id: sourceColumnID },
        { $pull: { cards: cardID } }
      );
      await models.Column.findOneAndUpdate(
        { _id: destinationColumnID },
        {
          $push: {
            cards: {
              $each: [cardID],
              $position: destinationPosition,
            },
          },
        }
      );

      return {
        success: true,
        message: 'Card was reordered',
      };
    },
    addColumn: async (root, { boardID, title }, { req, models }) => {
      const { user } = req.session;
      if (!user) {
        return {
          success: false,
          message: 'User not logged in',
        };
      }
      const existedBoard = await models.Board.findById({ _id: boardID });
      const position = existedBoard.columns.length;
      const column = await models
        .Column({ title, board: boardID, owner: user._id, position })
        .save();
      const board = await models.Board.findOneAndUpdate(
        { _id: boardID },
        { $push: { columns: column } }
      );
      if (!board) {
        return {
          success: false,
          message: 'No boards find by ID',
        };
      }
      return {
        success: true,
        message: 'Column was added',
      };
    },
    addCard: async (
      root,
      { boardID, columnID, cardInput: args },
      { req, models }
    ) => {
      const { user } = req.session;
      if (!user) {
        return {
          success: false,
          message: 'User not logged in',
        };
      }
      const existedColumn = await models.Column.findById({ _id: columnID });
      const position = existedColumn.cards.length;
      const card = await models
        .Card({ board: boardID, column: columnID, title: args.title, position })
        .save();
      const column = await models.Column.findOneAndUpdate(
        { _id: columnID },
        { $push: { cards: card } }
      );
      if (!column) {
        return {
          success: false,
          message: 'No column find by ID',
        };
      }
      return {
        success: true,
        message: 'Card was added',
      };
    },
    removeBoard: async (root, { boardID }, { req, models }) => {
      const { user } = req.session;
      if (!user) {
        return {
          success: false,
          message: 'User not logged in',
        };
      }
      const board = await models.Board.findById({ _id: boardID });
      if (!board) {
        return {
          success: false,
          message: 'No boards find by ID',
        };
      }
      await models.Card.deleteMany({
        board: boardID,
      });

      await models.Column.deleteMany({
        board: boardID,
      });
      board.delete();

      return {
        success: true,
        message: 'Board was removed',
      };
    },
    removeColumn: async (root, { boardID, columnID }, { models }) => {
      const board = await models.Board.findOneAndUpdate(
        { _id: boardID },
        { $pull: { columns: columnID } }
      );
      if (!board) {
        return {
          success: false,
          message: 'No boards find by ID',
        };
      }
      const column = await models.Column.findById({ _id: columnID });
      if (!column) {
        return {
          success: false,
          message: 'No columns find by ID',
        };
      }
      await models.Card.deleteMany({
        column: columnID,
      });
      await models.Column.deleteOne({ _id: columnID });
      return {
        success: true,
        message: 'Column was removed',
      };
    },
    removeCard: async (root, { columnId, cardId }, { models }) => {
      const column = await models.Column.findOneAndUpdate(
        { _id: columnId },
        { $pull: { cards: cardId } }
      );
      if (!column) {
        return {
          success: false,
          message: 'No columns find by ID',
        };
      }
      models.Card.deleteOne({ _id: cardId }, (err, result) => {
        if (err) {
          console.error(err);
          return false;
        }
      });
      return {
        success: true,
        message: 'Card was removed',
      };
    },
    addBoard: async (root, { title }, { req, models }) => {
      const { user } = req.session;
      if (!user) {
        return {
          success: false,
          message: 'User not logged in',
        };
      }
      const board = await models.Board({ title, owner: user._id }).save();
      if (!board) {
        return {
          success: false,
          message: 'No boards find by ID',
        };
      }
      return {
        success: true,
        message: 'Board was added',
      };
    },
    signup: async (root, { email, name, password }, { req, models }) => {
      const isUserExist = await models.User.findOne({ email });
      if (isUserExist) {
        throw new Error('Another user with same email is exist');
      }
      const user = await models
        .User({
          email: email.trim(),
          name: name.trim(),
          password: await bcrypt.hash(password.trim(), 12),
        })
        .save();
      console.log(user);
      delete user._doc.password;
      req.session.user = {
        ...user._doc,
      };
      return {
        success: true,
        message: 'User was registered',
        user,
      };
    },
    login: async (root, { email, password }, { req, models }) => {
      const userExist = await models.User.findOne({ email });
      if (!userExist) {
        throw new Error('Incorrect email or password');
      }
      const isValid = await bcrypt.compare(password, userExist.password);
      if (!isValid) {
        throw new Error('Incorrect email or password');
      }
      delete userExist._doc.password;
      req.session.user = {
        ...userExist._doc,
      };
      return {
        success: true,
        message: 'User was logged in',
        user: userExist,
      };
    },
    logout: async (root, args, { req, res, models }) => {
      await req.session.destroy();
      await res.clearCookie('kanbanid');
      return true;
    },
  },
};

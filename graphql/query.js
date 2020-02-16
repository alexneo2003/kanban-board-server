module.exports = {
  Query: {
    boards: async (root, args, { req, models }) => {
      const { user } = req.session;
      if (!user) {
        return null;
      }
      return await models.Board.find({ owner: user._id }).populate({
        path: "columns"
      });
    },
    boardById: async (root, args, { req, models }) => {
      const { user } = req.session;
      if (!user) {
        return null;
      }
      const board = await models.Board.find({
        _id: args.id,
        owner: user._id
      });
      return board[0];
    },
    columns: async (root, { boardID }, { req, models }) => {
      const { user } = req.session;
      const board = await models.Board.findById({ _id: boardID });
      if (!board) {
        return null;
      }
      return await models.Column.find({
        board: boardID,
        owner: user._id
      })
        .populate({
          path: "cards"
        })
        .sort({ position: 1 });
    },
    me: async (root, args, { req, models }) => {
      const { user } = req.session;
      if (user === undefined) {
        return null;
      }
      const currentUser = await models.User.findOne({ _id: user._id }).select({
        pass: 0
      });
      return currentUser;
    }
  }
};

module.exports = {
  Query: {
    getBoards: async (root, args, { req, models }) => {
      const { user } = req.session;
      if (user === undefined) {
        return {
          success: false,
          message: 'User not logged in',
          boards: null,
        };
      }
      const boards = await models.Board.find({ owner: user._id })
        .populate({
          path: 'columns',
        })
        .populate({ path: 'columns', populate: { path: 'cards' } });
      return {
        success: true,
        message: 'Boards received',
        boards,
      };
    },
    getBoardById: async (root, args, { req, models }) => {
      const { user } = req.session;
      if (user === undefined) {
        return {
          success: false,
          message: 'User not logged in',
          user: null,
        };
      }
      const board = await models.Board.findOne({
        _id: args.id,
        owner: user._id,
      });
      return {
        success: true,
        message: 'Board received',
        board,
      };
    },
    getColumns: async (root, { boardID }, { req, models }) => {
      const { user } = req.session;
      if (user === undefined) {
        return {
          success: false,
          message: 'User not logged in',
        };
      }
      const board = await models.Board.findOne({
        _id: boardID,
        owner: user._id,
      }).populate({
        path: 'columns',
        populate: { path: 'cards' },
      });
      if (!board) {
        return {
          success: false,
          message: 'No boards find by ID',
        };
      }
      // const columns = await models.Column.find({
      //   board: boardID,
      //   owner: user._id,
      // }).populate({
      //   path: 'cards',
      // });
      // .sort({ position: 1 });
      return {
        success: true,
        message: 'Columns received',
        columns: board.columns,
      };
    },
    me: async (root, args, { req, models }) => {
      const { user } = req.session;
      if (user === undefined) {
        return {
          success: false,
          message: 'User not logged in',
          user: null,
        };
      }
      const currentUser = await models.User.findOne({ _id: user._id }).select({
        pass: 0,
      });
      return {
        success: true,
        message: 'User received',
        user: currentUser,
      };
    },
  },
};

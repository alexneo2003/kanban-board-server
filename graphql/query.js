module.exports = {
  Query: {
    columns: async (root, args, { models }) => {
      const columns = await models.Column.find({}).populate({ path: "cards" });
      return columns;
    },
    me: async (root, args, { req, models }) => {
      const { user } = req.session;
      console.log("session", req.session);
      console.log("user", user);
      if (!user) {
        return false;
      }
      const currentUser = await models.User.findOne({ _id: user._id }).select({
        pass: 0
      });
      return currentUser;
    }
  }
};

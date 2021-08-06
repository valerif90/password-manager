import Password from "../models/PasswordModel.js";

export const addPassword = async (req, res) => {
  const password = req.body;
  const userId = req.token.id;

  try {
    const passwordList = await Password.findOne({ userId });
    if (!passwordList) {
      const response = await Password.create({ userId, passwords: password });
      res.status(200).json({ newPasswordObj: response });
    } else {
      try {
        const newPasswordObj = { $push: { passwords: password } };
        const response = await Password.findOneAndUpdate(
          { userId },
          newPasswordObj,
          { new: true }
        );
        res.status(200).json({ newPasswordObj: response });
      } catch (error) {
        res.status(401).json({ error });
      }
    }
  } catch (error) {
    res.status(401).json({ error });
  }
};

export const fetchPasswords = async (req, res) => {
  const userId = req.token.id;

  try {
    const response = await Password.findOne({ userId });
    if (response)
      return res.status(200).json({ passwords: response.passwords });
    res.status(200).json({ password: response });
  } catch (error) {
    res.status(401).json({ error });
    console.log(error);
  }
};

export const updatePassword = async (req, res) => {
  const userId = req.token.id;
  const { id, title, username, password } = req.body;
  console.log(id);
  try {
    const response = await Password.findOneAndUpdate(
      { "passwords._id": id },
      {
        $set: {
          "passwords.$.title": title,
          "passwords.$.username": username,
          "passwords.$.password": password,
        },
      }
    );
    console.log(response);
    res.status(200).send("Updated sucessfully");
  } catch (error) {
    console.log(error);
  }
};

export const deletePassword = async (req, res) => {
  const { _id } = req.body;
  const userId = req.token.id;
  console.log(_id);
  try {
    const response = await Password.findOneAndUpdate(
      { userId },
      { $pull: { passwords: { _id } } },
      { new: true }
    );
    res
      .status(200)
      .json({ success: "Record deleted successfully", data: response });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error });
  }
};

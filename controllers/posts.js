import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */

export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;

    const user = await User.findById(userId);

    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {
        // "someid" : true // --> structure of likes
      },

      comments: [],
    });

    await newPost.save(); // post saved in db !

    // grab all the posts, to be returned to frontend
    // to update all the posts on the frontend !
    const post = await Post.find();

    res.status(201).json(post);
  } catch (err) {
    console.log(err.message, ", Failed to Create Post");
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    console.log(err.message, ", Failed to getFeedPosts");
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const post = await Post.find({ userId });

    res.status(200).json(post);
  } catch (err) {
    console.log(err.message, ", Failed to getUserPosts");
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params; // id of the post, not user !
    const { userId } = req.body;

    const post = await Post.findById(id); // local variable on server

    const isLiked = post.likes.get(userId);

    // like-unlike feature
    // does not update in the database
    if (isLiked) {
      post.likes.delete(userId); // remove user from likes !
    } else {
      post.likes.set(userId, true); // add user to likes !
    }

    // this updates the post in the database, 
    // why new ? -> return new post after updates !
    const updatedPost = await Post.findByIdAndUpdate(id, {
      likes: post.likes,
    }, { new : true});

    res.status(200).json(updatedPost);

  } catch (err) {
    console.log(err.message, ", Failed to UpdateLikePost");
    res.status(404).json({ message: err.message });
  }
};

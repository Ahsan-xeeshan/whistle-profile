/* eslint-disable no-unused-vars */
import EmojiPicker from "emoji-picker-react";
import { getDatabase, push, ref, set } from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  ref as sref,
  uploadBytes,
} from "firebase/storage";
import { useState } from "react";
import { MdEmojiEmotions, MdPhoto } from "react-icons/md";
import { useSelector } from "react-redux";

const UpdatePost = () => {
  const db = getDatabase();
  const data = useSelector((state) => state.user.userInfo);
  const storage = getStorage();
  const [addPost, setAddPost] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const handlePost = (e) => {
    setAddPost(e.target.value);
  };
  const handleSubmitPost = () => {
    if (addPost != "") {
      set(push(ref(db, "posts/")), {
        post: addPost,
        postedById: data.uid,
        date: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }- ${new Date().getDate()}, ${new Date().getHours()}:${new Date().getMinutes()}`,
      });
    }

    setAddPost("");
  };
  const handleEmoji = (emoji) => {
    setAddPost(addPost + emoji.emoji);
  };
  const handleImage = (e) => {
    let upFile = e.target.files[0];
    const storageRef = sref(storage, "some-child");

    uploadBytes(storageRef, upFile).then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
        set(push(ref(db, "posts/")), {
          img: downloadURL,
          postedById: data.uid,
          date: `${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }- ${new Date().getDate()}, ${new Date().getHours()}:${new Date().getMinutes()}`,
        });
      });
    });
  };

  return (
    <div>
      <div className="w-[950px] pt-8 ml-[330px] relative pb-8 border-b border-blue-950">
        <input
          onChange={handlePost}
          value={addPost}
          type="text"
          className="w-full h-[100px] rounded-lg font-rob text-[26px] bg-white px-5 py-1"
          placeholder="What is happening?"
        />
        <div className="pt-5 flex justify-end">
          <button
            onClick={handleSubmitPost}
            className="mr-6 font-bold font-rob text-lg py-2 px-7 bg-sky-500 text-white rounded-full hover:bg-sky-700 transition-all duration-500"
          >
            Post
          </button>
          <div className="absolute flex left-[50px] bottom-[50px]">
            <label>
              <input onChange={handleImage} type="file" className="hidden" />
              <MdPhoto className="text-blue-950 text-2xl cursor-pointer" />
            </label>

            <div className="ml-4 relative">
              {showEmoji && (
                <div className="absolute bottom-[60px] right-[55px]">
                  <EmojiPicker onEmojiClick={(emoji) => handleEmoji(emoji)} />
                </div>
              )}
              <label>
                <MdEmojiEmotions
                  onClick={(e) => setShowEmoji(!showEmoji)}
                  className="text-blue-950 text-2xl cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePost;

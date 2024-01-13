/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
import { getDatabase, onValue, ref } from "firebase/database";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Posts = () => {
  const db = getDatabase();
  const data = useSelector((state) => state.user.userInfo);
  const [showPost, setShowPost] = useState([]);
  useEffect(() => {
    const postRef = ref(db, "posts/");
    onValue(postRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.unshift({ ...item.val(), key: item.key });
      });
      setShowPost(arr);
    });
  }, []);
  return (
    <div>
      <div className="w-[950px] ml-[330px] py-20">
        {showPost.map((item) =>
          item.postedById == data.uid ? (
            item.img ? (
              <div className="w-full py-5 bg-white rounded-2xl p-4 mb-[50px]">
                <div className="flex pl-3 pt-3">
                  <div className="mr-5">
                    <img
                      src={data.photoURL}
                      alt=""
                      className="w-[40px] h-[40px] rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-rob font-medium">{data.displayName}</h4>
                    <p className="font-rob">
                      {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                    </p>
                  </div>
                </div>
                <div className="px-8 py-5">
                  <img src={item.img} alt="" className="w-full" />
                </div>
              </div>
            ) : (
              <div className="w-full py-5 bg-white rounded-2xl p-4 mb-[50px]">
                <div className="flex pl-3 pt-3">
                  <div className="mr-5">
                    <img
                      src={data.photoURL}
                      alt=""
                      className="w-[40px] h-[40px] rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-rob font-medium">{data.displayName}</h4>
                    <p className="font-rob">
                      {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                    </p>
                  </div>
                </div>
                <div className="px-8 py-5">
                  <h3 className="text-[38px] font-semibold">{item.post}</h3>
                </div>
              </div>
            )
          ) : (
            <div></div>
          )
        )}
      </div>
    </div>
  );
};

export default Posts;

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { IoIosLogOut } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CoverModal from "../../Components/CoverModal";
import Posts from "../../Components/Posts";
import ProfileModal from "../../Components/ProfileModal";
import UpdatePost from "../../Components/UpdatePost";
import { userLoginInfo } from "../../Slice/UserSlice";
const Profile = () => {
  const auth = getAuth();
  console.log(auth);

  const data = useSelector((state) => state.user.userInfo);
  const navigate = useNavigate();
  const [verify, setVerify] = useState(false);
  const dispatch = useDispatch();

  onAuthStateChanged(auth, (user) => {
    console.log(user);
    if (user.emailVerified) {
      setVerify(true);
      dispatch(userLoginInfo(user));
      localStorage.setItem("userInfo", JSON.stringify(user));
    }
  });

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((error) => {
        console.log(error.code);
      });
  };

  useEffect(() => {
    if (!data) {
      navigate("/");
    }
  });

  return (
    <div>
      {verify ? (
        <div className="bg-gray-200">
          <div className="flex items-center mx-36 justify-between py-6 sticky drop-shadow-2xl mb-1">
            <div>
              <h2 className="font-pacific text-3xl font-extrabold text-blue-950">
                GOSSIP WORLD
              </h2>
            </div>
            <div className="flex items-center justify-between">
              <div className="mr-5">
                <img
                  src={data.photoURL}
                  alt=""
                  className="w-[40px] h-[40px] rounded-full"
                />
              </div>
              <h3 className="text-2xl font-semibold font-pops">
                {data.displayName}
              </h3>

              <div
                className="flex items-center justify-between ml-5 cursor-pointer"
                onClick={handleSignOut}
              >
                <div>
                  <IoIosLogOut className="text-3xl" />
                </div>
                <div>
                  <p className="font-pops text-2xl text-blue-950 ml-1">
                    Sign Out
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[1640px] mx-auto">
            <div className="h-[400px] w-full  relative bg-coverphoto bg-cover bg-no-repeat">
              <CoverModal />
              <ProfileModal />
            </div>
            <div className="pt-8 ml-[330px]">
              <h3 className="text-3xl font-robs font-bold">
                {data.displayName}
              </h3>
              <p className="font-pops font-medium text-lg">{data.email}</p>
            </div>
            <UpdatePost />
            <Posts />
          </div>
        </div>
      ) : (
        <div className="h-screen w-screen bg-sky-500 p-5">
          <h3 className="text-[64px] font-pops text-white">
            Please Verify Your Email...
          </h3>
          <button className="text-2xl font-pops text-white hover:underline">
            <Link to={"/"}>Back to log in page</Link>
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;

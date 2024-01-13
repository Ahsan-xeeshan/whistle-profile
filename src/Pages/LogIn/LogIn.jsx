/* eslint-disable no-useless-escape */
/* eslint-disable react/no-unescaped-entities */
import {
  GoogleAuthProvider,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { userLoginInfo } from "../../Slice/UserSlice";
import Google from "../../assets/google.png";

const LogIn = () => {
  const auth = getAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");
  const [showValues, setShowValues] = useState(false);
  const googleProvider = new GoogleAuthProvider();

  let emailInput = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
  let passwordInput =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleShowValue = () => {
    setShowValues(!showValues);
  };

  const handleSubmit = () => {
    if (!email) {
      setEmailError("Email is required");
    } else if (!emailInput.test(email)) {
      setEmailError("Enter a valid email address");
    }

    if (!password) {
      setPasswordError("Password is required");
    } else if (!passwordInput.test(password)) {
      setPasswordError("Must be valid password");
      setPwdMsg(
        "#Password should be between 8 to 15 characters which contain at least one lowercase letter[a-z], one uppercase letter[A-Z], one numeric digit[0-9], and one special character[!,@,#,$,%,^,&,*]"
      );
    }
    if (
      email &&
      password &&
      emailInput.test(email) &&
      passwordInput.test(password)
    ) {
      signInWithEmailAndPassword(auth, email, password)
        .then((user) => {
          toast.success("Login successful.");
          console.log(user.user);
          dispatch(userLoginInfo(user.user));
          localStorage.setItem("userInfo", JSON.stringify(user.user));
          setEmail("");
          setPassword("");
          setTimeout(() => {
            navigate("/profile");
          }, 5000);
        })
        .catch((error) => {
          const errorCode = error.code;
          console.log(errorCode);
          if (errorCode.includes("auth/invalid-login-credentials")) {
            toast.error("Please input correct email or password");
          }
        });
    }
  };

  const handleGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((user) => {
        console.log(user.user);
        toast.success("Registration Successful");
        setTimeout(() => {
          navigate("/profile");
        }, 3000);
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
      });
  };
  return (
    <div className="m-0 p-0 box-border h-screen bg-login bg-cover bg-no-repeat ">
      <div className="py-6 ">
        <div className="w-[700px] h-[850px] bg-white mx-auto px-[45px] py-[100px] text-center">
          <h3 className="font-rob text-3xl font-bold">Login to your account</h3>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <div className="mt-[65px] relative">
            <input
              type="email"
              onChange={handleEmail}
              value={email}
              placeholder="Your Email Address...."
              className="py-[26px] pl-[25px] w-[500px] border-b border-[#11175d3b] outline-none font-rob text-xl text-theme font-semibold italic"
            />
            {emailError && (
              <p className="absolute left-28 bg-red-500 text-white w-96 py-2 px-1 mt-2">
                {emailError}
              </p>
            )}
          </div>

          <div className="mt-[60px] relative">
            <input
              type={showValues ? "text" : "password"}
              onChange={handlePassword}
              value={password}
              placeholder="Enter Your Password...."
              className="py-[26px] pl-[25px] w-[500px] border-b border-[#11175d3b] outline-none font-rob text-xl text-theme font-semibold italic"
            />
            <div
              onClick={handleShowValue}
              className="text-[#11175d3b] cursor-pointer text-lg absolute right-[80px] top-[32px]"
            >
              {!showValues ? <AiFillEyeInvisible /> : <AiFillEye />}
            </div>
            {passwordError && (
              <p className="absolute left-28 bg-red-500 text-white w-96 py-2 px-1 mt-2">
                {passwordError}
              </p>
            )}
            {pwdMsg && (
              <p className="text-green-600 absolute top-[285px] left-0 w-full">
                {pwdMsg}
              </p>
            )}
          </div>
          <div className="mt-[71px]">
            <button
              onClick={handleSubmit}
              className="bg-blue-400  px-[70px] py-[20px] text-white font-nun font-xl font-semibold rounded-full transition-all duration-500 hover:bg-[#318296] w-80"
            >
              Sign In
            </button>
            <div
              className="flex pt-[35px] justify-center items-center cursor-pointer"
              onClick={handleGoogle}
            >
              <div>
                <p className="font-pops text-[22px] font-medium">Log in with</p>
              </div>
              <div className=" ml-2">
                <img src={Google} alt="" />
              </div>
            </div>
            <p className=" pt-[35px] font-pops text-theme text-[13px]">
              Don't have an account ?{" "}
              <span className="font-bold text-[#EA6C00] cursor-pointer">
                <Link to="/registration">Sign Up</Link>
              </span>
            </p>
            <p className=" pt-[35px] font-pops text-theme text-center text-[13px] pl-[9px] font-bold">
              <Link to="/forgetPassword">Forgot Password?</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;

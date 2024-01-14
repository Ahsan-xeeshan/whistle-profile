/* eslint-disable no-useless-escape */
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Registration = () => {
  const auth = getAuth();
  const db = getDatabase();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");
  const [showValues, setShowValues] = useState(false);

  let emailInput = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
  let passwordInput =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };
  const handleFullName = (e) => {
    setFullName(e.target.value);
    setFullNameError("");
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
    if (!fullName) {
      setFullNameError("Fullname is required");
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
      fullName &&
      password &&
      emailInput.test(email) &&
      passwordInput.test(password)
    ) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((user) => {
          updateProfile(auth.currentUser, {
            displayName: fullName,
            photoURL: "./src/assets/defPro.png",
          })
            .then(() => {
              toast.success(
                "Registration successful. Please verify your email."
              );
              console.log(user);
              setEmail("");
              setFullName("");
              setPassword("");
              sendEmailVerification(auth.currentUser);
              setTimeout(() => {
                navigate("/");
              }, 5000);
            })
            .then(() => {
              console.log(user, "user reg");
              set(ref(db, "users/" + user.user.uid), {
                username: user.user.displayName,
                email: user.user.email,
                photo: user.user.photoURL,
              });
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          console.log(errorCode);
          if (errorCode.includes("auth/email-already-in-use")) {
            setEmailError("This Email is already exist");
          }
        });
    }
  };

  return (
    <div className="m-0 p-0 box-border h-screen bg-registration bg-cover bg-no-repeat text-center" style={{background:'./src/assets/registration.jpg'}>
      <div className="py-6">
        <div className="w-[700px] h-[850px] bg-white mx-auto px-[45px] py-[100px]">
          <h3 className="font-rob text-3xl font-bold">
            Do A Quick Registration!
          </h3>
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
              placeholder="Email Address...."
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
              type="text"
              onChange={handleFullName}
              value={fullName}
              placeholder="Full Name...."
              className="py-[26px] pl-[25px] w-[500px] border-b border-[#11175d3b] outline-none font-rob text-xl text-theme font-semibold italic"
            />
            {fullNameError && (
              <p className="absolute left-28 bg-red-500 text-white w-96 py-2 px-1 mt-2">
                {fullNameError}
              </p>
            )}
          </div>
          <div className="mt-[60px] relative">
            <input
              type={showValues ? "text" : "password"}
              onChange={handlePassword}
              value={password}
              placeholder="Enter a password...."
              className=" py-[26px] pl-[25px] w-[500px] border-b border-[#11175d3b] outline-none font-rob text-xl text-theme font-semibold italic"
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
          <div className="mt-[80px]">
            <button
              onClick={handleSubmit}
              className="bg-blue-400  px-[70px] py-[20px] text-white font-nun font-xl font-semibold rounded-full transition-all duration-500 hover:bg-[#318296] w-80"
            >
              Sign Up
            </button>
            <p className=" pt-[35px] font-open text-theme text-[13px] text-center">
              Already have an account ?{" "}
              <span className="font-bold text-[#EA6C00] cursor-pointer">
                <Link to="/"> Sign In</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;

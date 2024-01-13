/* eslint-disable no-useless-escape */
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const ForgetPassword = () => {
  let emailInput = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const auth = getAuth();

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };
  const handleForgotPassword = () => {
    if (!email) {
      setEmailError("Email is required!");
    } else if (!emailInput.test(email)) {
      setEmailError("Email is Invalid");
    }
    if (email && emailInput.test(email)) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          toast.info("A mail is sent to your mail for reseting password ");
        })
        .catch((error) => {
          const errorCode = error.code;
          console.log(errorCode);
        });
    }
  };
  return (
    <div className="h-screen w-full bg-[#98e757cb] flex items-center justify-center">
      <div className="bg-white p-[100px]">
        <ToastContainer
          position="top-right"
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
        <h2 className="font-nun text-4xl font-bold">Forget Password?</h2>
        <div className="mt-[60px]">
          <p className="font-open pl-1 text-[14px] font-semibold text-[#11175d52]">
            Email Address <span className="text-red-500">***</span>
          </p>
          <input
            type="email"
            placeholder="Youraddress@email.com"
            onChange={handleEmail}
            value={email}
            className="py-[17px] pl-1 w-96 border-b border-[#11175d3b] outline-none  text-xl font-open text-theme font-semibold"
          />

          {emailError && (
            <p className="bg-red-500 text-white w-96 py-2 px-1 mt-2">
              {emailError}
            </p>
          )}
        </div>
        <div className="flex gap-5">
          <button
            onClick={handleForgotPassword}
            className="hover:bg-[#509c11cb] mt-[51px] px-[22px] py-[13px] hover:text-white text-[#509c11cb]  font-nun text-xl rounded-[9px] font-semibold  transition-all duration-500 w-56 bg-transparent border border-[#509c11cb]"
          >
            Submit
          </button>
          <button className="hover:bg-[#509c11cb] mt-[51px] px-[22px] py-[13px] hover:text-white text-[#509c11cb]  font-nun text-xl rounded-[9px] font-semibold  transition-all duration-500 w-56 bg-transparent border border-[#509c11cb]">
            <Link to="/">Back To Home</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;

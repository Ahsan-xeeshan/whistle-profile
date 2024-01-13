/* eslint-disable no-unused-vars */
import "cropperjs/dist/cropper.css";
import { getAuth, updateProfile } from "firebase/auth";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
import { createRef, useState } from "react";
import { Cropper } from "react-cropper";
import { FaCamera } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Modal } from "react-responsive-modal";

const ProfileModal = () => {
  const data = useSelector((state) => state.user.userInfo);
  console.log(data);
  const auth = getAuth();
  const [image, setImage] = useState("");
  const [cropData, setCropData] = useState("");
  const cropperRef = createRef();
  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const onProfilePicChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
      const storage = getStorage();
      const storageRef = ref(storage, "profilePhoto/" + auth.currentUser.uid);

      const message = cropperRef.current?.cropper
        .getCroppedCanvas()
        .toDataURL();
      uploadString(storageRef, message, "data_url").then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          console.log("File available at", downloadURL);
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          }).then(() => {
            setOpen(false);
            setImage("");
            setCropData("");
          });
        });
      });
    }
  };

  return (
    <div>
      <div className="absolute left-[40px] bottom-[-130px]">
        <div className="w-64 h-64 rounded-full border-[5px] border-white">
          <img
            src={data.photoURL}
            alt=""
            className="w-full h-full rounded-full"
          />
        </div>
      </div>
      <div className="absolute left-[250px] bottom-[-90px]">
        <div
          className="w-[35px] h-[35px] rounded-full bg-slate-300 flex justify-center items-center"
          onClick={onOpenModal}
        >
          <FaCamera className="text-xl cursor-pointer" />
        </div>
      </div>
      <Modal open={open} onClose={onCloseModal} center>
        <div className="w-[620px]  px-[35px]">
          <h3 className="text-2xl font-pops font-bold mb-5">
            Upload your profile photo
          </h3>
          {image ? (
            <div className="w-[100px] h-[100px] rounded-full mx-auto overflow-hidden">
              <div className="img-preview w-full h-full rounded-full" />
            </div>
          ) : (
            <div className="w-[100px] h-[100px] rounded-full mx-auto">
              <img src={data.photoURL} alt="" className="rounded-full" />
            </div>
          )}
          <input type="file" onChange={onProfilePicChange} className="mb-5" />

          {image && (
            <Cropper
              ref={cropperRef}
              style={{ height: 400, width: "100%" }}
              zoomTo={0.5}
              initialAspectRatio={1}
              preview=".img-preview"
              src={image}
              viewMode={1}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
              guides={true}
            />
          )}
          <div className="mt-5">
            <button
              onClick={getCropData}
              className="py-2 px-4 bg-blue-600 rounded-xl hover:bg-blue-800 text-white text-xl font-pops transition-all duration-500"
            >
              Upload
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileModal;

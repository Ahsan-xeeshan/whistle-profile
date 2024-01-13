/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import "cropperjs/dist/cropper.css";
import { getAuth } from "firebase/auth";
import { ref as dref, getDatabase, onValue, set } from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
import { createRef, useEffect, useState } from "react";
import { Cropper } from "react-cropper";
import { FaCamera } from "react-icons/fa6";
import { Modal } from "react-responsive-modal";

const CoverModal = () => {
  const db = getDatabase();
  const auth = getAuth();

  const [image, setImage] = useState("");
  const [coverPhoto, setCoverPhoto] = useState([]);
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
      const storageCoverRef = ref(
        storage,
        "coverPhoto/" + auth.currentUser.uid
      );

      const message2 = cropperRef.current?.cropper
        .getCroppedCanvas()
        .toDataURL();
      uploadString(storageCoverRef, message2, "data_url").then((snapshot) => {
        getDownloadURL(storageCoverRef)
          .then((downloadCoverURL) => {
            console.log(downloadCoverURL);
            set(dref(db, "coverPhoto/" + auth.currentUser.uid), {
              cover: downloadCoverURL,
            });
          })
          .then(() => {
            setOpen(false);
            setImage("");
            setCropData("");
          });
      });
    }
  };

  useEffect(() => {
    const coverRef = dref(db, "coverPhoto/");
    onValue(coverRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), key: item.key });
      });
      setCoverPhoto(arr);
    });
  }, []);

  console.log(coverPhoto);

  return (
    <div>
      <div>
        {coverPhoto.map((item) =>
          item.key == auth.currentUser.uid ? (
            <img
              src={item.cover}
              alt=""
              className="w-full h-[400px] rounded-[8px]"
            />
          ) : (
            <div></div>
          )
        )}
      </div>
      <div className="absolute right-[10px] bottom-[20px] cursor-pointer">
        <div className="flex items-center justify-end bg-white py-1 px-2 rounded-lg">
          <div className="text-2xl">
            <FaCamera />
          </div>
          <div className="ml-[8px]">
            <p
              className="text-2xl  font-semibold font-pops"
              onClick={onOpenModal}
            >
              Edit cover photo
            </p>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={onCloseModal}
        center
        classNames={{
          modal: "customModal",
        }}
      >
        <div className="w-[1300px]  px-[35px]">
          <h3 className="text-2xl font-pops font-bold mb-5">
            Upload your cover photo
          </h3>
          {image ? (
            <div className="w-[900px] h-[300px] mx-auto overflow-hidden">
              <div className="img-preview w-full h-full mx-auto" />
            </div>
          ) : (
            <div className="w-[900px] h-[300px] rounded-lg mx-auto bg-coverphoto bg-no-repeat bg-cover">
              {coverPhoto.map((item) =>
                item.key == auth.currentUser.uid ? (
                  <img
                    src={item.cover}
                    alt=""
                    className="w-full h-full rounded-lg"
                  />
                ) : (
                  <div></div>
                )
              )}
            </div>
          )}
          <input type="file" onChange={onProfilePicChange} className="mb-5" />

          {image && (
            <Cropper
              ref={cropperRef}
              style={{ height: 400, width: 1100 }}
              zoomTo={0.5}
              initialAspectRatio={1}
              preview=".img-preview"
              src={image}
              viewMode={1}
              minCropBoxHeight={100}
              minCropBoxWidth={100}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
              guides={true}
              className="mx-auto"
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

export default CoverModal;

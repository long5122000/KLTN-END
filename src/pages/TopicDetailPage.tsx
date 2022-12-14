import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../components/button/Button";
import Footer from "../components/footer/Footer";
import Input from "../components/input/Input";
import Label from "../components/label/Label";
import { Swiper, SwiperSlide } from "swiper/react";
import parse from "html-react-parser";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { toast } from "react-toastify";
// import required modules
import { Pagination, Navigation } from "swiper";
import Heading from "../layout/Heading";
import { useSearchParams } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebase-app/firebase-config";
import { useAuth } from "../context/auth-context";
const TopicDetailPage = () => {
  const { userInfo } = useAuth();
  console.log(userInfo);

  const { control, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues: {},
  });
  const [params] = useSearchParams();
  const topicId: any = params.get("id");
  const [user, setUser] = useState();
  const [data, setData] = useState([]);
  useEffect(() => {
    const colRef = collection(db, "Users");
    const q = query(colRef, where("email", "==", userInfo.email));
    onSnapshot(q, (snapshot) => {
      const result: any = [];
      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
        });
      });
      setUser(result);
    });
  }, []);
  console.log(user);

  useEffect(() => {
    async function fetchData() {
      if (!topicId) return;
      const colRef = doc(db, "Topics", topicId);
      const docData = await getDoc(colRef);
      if (docData) setData(docData.data());
    }
    fetchData();
  }, [topicId]);
  console.log("data", data);

  const handleRegisterTopic = async () => {
    console.log("he");

    try {
      await addDoc(collection(db, "RegisterTopic"), {
        name: userInfo.fullname,
        email: userInfo.email,
        date: userInfo.date,
        userId: user[0].id,
        class: userInfo.class,
        authEmail: data.authEmail,
        status: "1",
        quantity: 1,
        totalQuantity: data.totalQuantity,
        cv: userInfo.cv,
        category: userInfo.category,
        topicName: data.name,
        topicId: topicId,
        msv: userInfo.msv,
        phone: userInfo.phone,
        createdAt: serverTimestamp(),
        nameLecturer: data.authName,
        namePlan: data.plan,
        nameSection: data.authSection,
        mgv: data.mgv,
      });
      toast.success(`Đã gửi đăng đăng ký đề tài:  ${data.name} successfully!`);
    } catch (error) {
      console.log(error);
      toast.error(
        "Đăng ký đề tài lỗi! Vui lòng kiểm tra lại thông tin cá nhân"
      );
      console.log(error);
    }
  };

  return (
    <div>
      <Heading>Đề tài :{data?.name}</Heading>

      <div className="container bg-[#f7ecec] p-6 mt-5 rounded-lg">
        <div className="flex mt-10 gap-x-5 border-b-2 border-gray-400 py-3">
          <h3 className="text-xl">Giảng viên hướng dẫn:</h3>
          <p className="text-xl">{data.authName}</p>
        </div>
        <div className="flex  gap-x-5 border-b-2 border-gray-400  py-3">
          <h3 className="text-xl">Trạng thái:</h3>
          {data.totalQuantity <= 0 ? (
            <p className="text-xl">Đã hết</p>
          ) : (
            <p className="text-xl">Hiện còn</p>
          )}
        </div>
        <div className="flex  gap-x-5 border-b-2 border-gray-400 py-3">
          <h3 className="text-xl">Số lượng sinh viên:</h3>
          <p className="text-xl">{data.totalQuantity}</p>
        </div>
        <div className="  gap-x-5 border-b-2 border-gray-400 py-3">
          <h3 className="text-xl">Mô tả:</h3>
          <p className="text-xl">{parse(data?.desc || "")}</p>
        </div>
        <div className="flex justify-center pt-14">
          {data.totalQuantity > 0 &&
          data?.category === userInfo?.category &&
          userInfo.status === "1" &&
          !userInfo.topicId ? (
            <Button
              kind="primary"
              type="submit"
              onClick={handleRegisterTopic}
              className="w-[250px]"
            >
              Đăng ký
            </Button>
          ) : (
            <Button
              kind="primary"
              type="submit"
              disabled
              onClick={handleRegisterTopic}
              className="w-[250px] bg-blue-400"
            >
              Đăng ký
            </Button>
          )}
        </div>
      </div>

      {/* <div className="container my-10">
        <h3 className="text-2xl pt-3">Đề tài liên quan</h3>
        <div className=" flex gap-x-5 relationship">
          <Swiper
            slidesPerView={3}
            spaceBetween={30}
            slidesPerGroup={3}
            loop={true}
            loopFillGroupWithBlank={true}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper relationship-swiper"
          >
            <SwiperSlide>
              {" "}
              <div className="bg-[#e5e5e5] rounded-lg p-3">
                <h3 className="text-xl">Xay dung website 3</h3>
                <p className="text-gray-500 text-sm py-3">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Maiores, at, veritatis officia doloribus aut deserunt illo,
                  velit repellat laboriosam nesciunt quis vel id corrupti
                  quaerat? Voluptate voluptas temporibus ullam beatae!
                </p>
                <span className="text-sm">Luong Duc Long</span>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="bg-[#e5e5e5] rounded-lg p-3">
                <h3 className="text-xl">Xay dung website 3</h3>
                <p className="text-gray-500 text-sm py-3">
                  parse('<h1>single</h1>'); Lorem ipsum dolor sit amet
                  consectetur adipisicing elit. Maiores, at, veritatis officia
                  doloribus aut deserunt illo, velit repellat laboriosam
                  nesciunt quis vel id corrupti quaerat? Voluptate voluptas
                  temporibus ullam beatae!
                </p>
                <span className="text-sm">Luong Duc Long</span>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              {" "}
              <div className="bg-[#e5e5e5] rounded-lg p-3">
                <h3 className="text-xl">Xay dung website 3</h3>
                <p className="text-gray-500 text-sm py-3">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Maiores, at, veritatis officia doloribus aut deserunt illo,
                  velit repellat laboriosam nesciunt quis vel id corrupti
                  quaerat? Voluptate voluptas temporibus ullam beatae!
                </p>
                <span className="text-sm">Luong Duc Long</span>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div> */}
      <Footer></Footer>
    </div>
  );
};

export default TopicDetailPage;

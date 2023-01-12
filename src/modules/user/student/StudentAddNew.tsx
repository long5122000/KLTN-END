import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import useFirebaseImage from "../../../hooks/useFirebaseImage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import { auth, db } from "../../../firebase-app/firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Button from "../../../components/button/Button";
import ImageUpload from "../../../components/image/ImageUpload";
import Field from "../../../components/field/Field";
import Label from "../../../components/label/Label";
import Input from "../../../components/input/Input";
import Radio from "../../../components/radio/radio";
import DatePicker from "react-date-picker";
import dayjs from "dayjs";
const StudentAddNew = () => {
  const [startDate, setStartDate] = useState(new Date());
  const schema = yup.object({
    fullname: yup.string().required("Vui lòng nhập họ và tên"),
    email: yup
      .string()
      .email("Thông tin đăng nhập phải là dạng Email")
      .required("Vui lòng nhập email"),
    password: yup.string().required("Vui lòng nhập mật khẩu"),
    class: yup.string().required("Vui lòng nhập họ và tên"),
    date: yup.date().typeError("Date is required"),
  });
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { isValid, isSubmitting, errors },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      avatar: "",
      class: "",
      date: new Date(),
      status: "1",
      gender: "1",
      role: "1",
      createdAt: new Date(),
    },
  });
  const {
    image,
    handleResetUpload,
    progress,
    handleSelectImage,
    handleDeleteImage,
  } = useFirebaseImage(setValue, getValues);
  interface values {
    email?: string;
    password?: string;
    fullname?: string;
    class?: string;
    date: Date;
    gender: string;
    status?: string;
    role?: string;
    avatar?: string;
  }

  const handleCreateUser = async (values: values): Promise<void> => {
    console.log(values);

    if (!isValid) return;
    try {
      await createUserWithEmailAndPassword(
        auth,
        values?.email ?? "",
        values?.password ?? ""
      );
      await addDoc(collection(db, "Users"), {
        fullname: values.fullname,
        email: values.email,
        password: values.password,
        class: values.class,
        gender: values.gender,
        date: new Date(startDate).toLocaleDateString(),
        avatar: image,
        status: values.status,
        role: "1",
        createdAt: serverTimestamp(),
      });
      toast.success(`Tạo mới người dùng: ${values.email} thành công!`);
      reset({
        fullname: "",
        email: "",
        password: "",
        avatar: "",
        status: "1",
        role: "1",
        class: "",
        gender: "1",
        date: new Date(),
        createdAt: new Date(),
      });
      handleResetUpload();
    } catch (error: any) {
      if (error.code == "auth/email-already-in-use") {
        toast.error("Địa chỉ email này đã được sử dụng");
      } else {
        toast.error("Không thể tạo mới người dùng");
      }
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
  };
  const watchStatus = watch("status");
  const watchGender = watch("gender");
  return (
    <div className="pb-10 bg-white rounded-2xl">
      <div className="container flex justify-end">
        <Button
          kind="quaternary"
          href="/manage/AddNewUserExcel"
          className=" min-h-[56px]  my-3"
        >
          Nhập bằng Excel
        </Button>
      </div>

      <form onSubmit={handleSubmit(handleCreateUser)}>
        <div className="w-[200px] h-[200px] mx-auto rounded-full mb-10 mt-5">
          <ImageUpload
            name=""
            className="!rounded-full h-full"
            onChange={handleSelectImage}
            handleDeleteImage={handleDeleteImage}
            progress={progress}
            image={image}
          ></ImageUpload>
        </div>
        <div className="form-layout container">
          <Field>
            <Label>Họ và tên</Label>
            <Input
              name="fullname"
              placeholder="Enter your fullname"
              control={control}
            ></Input>
            <p className="text-[#de3131] text-sm">{errors.fullname?.message}</p>
          </Field>
          <Field>
            <Label>Email</Label>
            <Input
              name="email"
              placeholder="Enter your email"
              control={control}
              type="email"
            ></Input>
            <p className="text-[#de3131] text-sm">{errors.email?.message}</p>
          </Field>
        </div>
        <div className="form-layout container">
          <Field>
            <Label>Mật khẩu</Label>
            <Input
              name="password"
              placeholder="Enter your password"
              control={control}
              type="password"
            ></Input>
            <p className="text-[#de3131] text-sm">{errors.password?.message}</p>
          </Field>
          <Field>
            <Label>Giới tính</Label>
            <div className="flex flex-wrap gap-x-5">
              <Radio
                name="gender"
                control={control}
                checked={watchGender === "1"}
                value={"1"}
              >
                Nam
              </Radio>
              <Radio
                name="gender"
                control={control}
                checked={watchGender === "2"}
                value={"2"}
              >
                Nữ
              </Radio>
            </div>
          </Field>
        </div>
        <div className="form-layout container">
          <Field>
            <Label>Trạng thái</Label>
            <div className="flex flex-wrap gap-x-5">
              <Radio
                name="status"
                control={control}
                checked={watchStatus === "1"}
                value={"1"}
              >
                Hoạt động
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={watchStatus === "2"}
                value={"2"}
              >
                Chưa giải quyết
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={watchStatus === "3"}
                value={"3"}
              >
                Bị cấm
              </Radio>
            </div>
          </Field>
          <Field>
            <Label>Lớp</Label>
            <Input
              name="class"
              placeholder="Enter your class"
              control={control}
            ></Input>
            <p className="text-[#de3131] text-sm">{errors.class?.message}</p>
          </Field>
        </div>
        <div className="form-layout container">
          <Field>
            <Label>Ngày sinh</Label>
            {/* <Input
              name="date"
              placeholder="Enter your date"
              control={control}
              type="date"
            ></Input> */}
            <DatePicker
              onChange={setStartDate}
              value={startDate}
              format="dd-MM-yyyy"
            />
            <p className="text-[#de3131] text-sm">{errors.date?.message}</p>
          </Field>
        </div>
        <Button
          kind="primary"
          type="submit"
          className="mx-auto w-[200px]"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Add new user
        </Button>
      </form>
    </div>
  );
};

export default StudentAddNew;

import { collection, getDocs, query, where } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import Pdf from "react-to-pdf";
import Table from "../../components/table/Table";
import { db } from "../../firebase-app/firebase-config";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import Button from "../../components/button/Button";
const DetailList = () => {
  const ref = React.createRef();

  const [planList, setPlanList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  useEffect(() => {
    async function getData() {
      const colRef = collection(db, "Plans");
      const q = query(colRef, where("status", "==", true));
      const querySnapshot = await getDocs(q);
      let result: any = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setPlanList(result);
    }
    getData();
  }, []);
  useEffect(() => {
    async function getData() {
      const colRef = collection(db, "Users");
      const q = query(colRef, where("role", "==", "1"));
      const querySnapshot = await getDocs(q);
      let result: any = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setStudentList(result);
    }
    getData();
  }, []);
  let stt = 1;
  const renderUserItem = (user: any) => (
    <tr key={user.id}>
      <td className="p-2">{stt++}</td>
      <td className="p-2">{user?.fullname}</td>
      <td className="p-2"> {user?.msv}</td>
      <td className="p-2" title={user?.class}>
        {user?.class}
      </td>
      <td className="p-1 whitespace-normal w-[150px]" title={user?.nameTopic}>
        {user?.nameTopic}
      </td>
      <td className="p-2">{user?.nameLecturer}</td>
      <td className="p-2">{user?.mgv}</td>
      <td className="p-2 ">{user?.nameSection}</td>
      <td className="p-2 whitespace-normal">{user?.internshipFacility}</td>
    </tr>
  );
  return (
    <div>
      <Pdf targetRef={ref} filename="code-example.pdf" scale={0.7}>
        {({ toPdf }) => (
          <Button
            kind="primary"
            type="submit"
            className="mx-auto w-[250px]"
            onClick={toPdf}
          >
            Xu???t file pdf
          </Button>
        )}
      </Pdf>
      <div ref={ref}>
        <div className="flex justify-around">
          <div>
            <h3 className="text-center">H???C VI???N N??NG NGHI???P VI???T NAM</h3>
            <p className="text-center font-bold">KHOA C??NG NGH??? TH??NG TIN</p>
          </div>
          <div>
            <h3 className="text-center font-bold">
              C???NG H??A X?? H???I CH??? NGH??A VI???T NAM
            </h3>
            <p className="text-center text-sm font-bold">
              ?????c l???p - T??? do - H???nh ph??c
            </p>
          </div>
        </div>
        <h3 className="text-center pt-10 font-bold">
          DANH S??CH SINH VI??N ????NG K?? ????? T??I {planList[0]?.name}
        </h3>
        <table>
          <thead>
            <tr>
              <th className="p-2">STT</th>
              <th className="p-2">T??n </th>
              <th className="p-2">M?? SV </th>
              <th className="p-2">L???p</th>
              <th className="p-2">T??n ????? t??i</th>
              <th className="p-2">Gv h?????ng d???n</th>
              <th className="p-2">M?? GV</th>
              <th className="p-2">B??? m??n qu???n l?? </th>
              <th className="p-2">C?? s??? th???c t???p</th>
            </tr>
          </thead>
          <tbody>
            {studentList.length > 0 && studentList.map(renderUserItem)}
          </tbody>
        </table>
        {/* <Table>
          <thead className="!tw-w-[100px]">
            <tr>
              <th>STT</th>
              <th>T??n </th>
              <th>M?? SV </th>
              <th>L???p</th>
              <th>T??n ????? t??i</th>
              <th>Gi???ng vi??n h?????ng d???n</th>
              <th>M?? GV</th>
              <th>B??? m??n qu???n l?? </th>
              <th>C?? s??? th???c t???p</th>
            </tr>
          </thead>
          <tbody>
            {studentList.length > 0 && studentList.map(renderUserItem)}
          </tbody>
        </Table> */}
      </div>
    </div>
  );
};

export default DetailList;

import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Table from "../../../components/table/Table";
import { useAuth } from "../../../context/auth-context";
import { db } from "../../../firebase-app/firebase-config";
import ModalImage from "react-modal-image";
const InternshipAssessmentLecturerView = () => {
  const [params] = useSearchParams();
  const { userInfo } = useAuth();
  const ConfirmationId: any = params.get("id");
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [appointmentList, setAppointmentList] = useState([]);
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    const colRef = collection(db, "InternshipAssessmentList");
    const q = query(colRef, where("idCom", "==", ConfirmationId));
    onSnapshot(q, (snapshot) => {
      const result: any = [];
      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setAppointmentList(result);
    });
  }, []);
  useEffect(() => {
    const colRef = collection(db, "Users");
    const q = query(colRef, where("authEmail", "==", userInfo.email));
    onSnapshot(q, (snapshot) => {
      const result: any = [];
      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setUserList(result);
    });
  }, []);
  console.log(userList);

  const openImageViewer = useCallback((index) => {
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };
  const renderAppointItem = (user: any) => (
    <tr key={user.id}>
      <td title={user.msv}>{user.msv}</td>
      <td>{user?.fullname}</td>
      <td>
        <ModalImage small={user.image} large={user.image} />
      </td>
    </tr>
  );
  const renderUserItem = (user: any) => (
    <tr key={user.id}>
      <td title={user.msv}>{user.msv}</td>
      <td>{user?.fullname}</td>
      <td>{user?.class}</td>
    </tr>
  );
  return (
    <div className="container flex justify-around gap-x-5">
      <div className="pt-5">
        <h2 className="text-xl font-bold">Danh s??ch ???? n???p</h2>
        <div>
          <Table>
            <thead>
              <tr>
                <th>M?? sinh vi??n </th>
                <th>T??n </th>

                <th>T??i li???u</th>
              </tr>
            </thead>
            <tbody>
              {appointmentList.length > 0 &&
                appointmentList.map(renderAppointItem)}
            </tbody>
          </Table>
        </div>
      </div>
      <div className="pt-5">
        <h2 className="text-xl font-bold">Danh s??ch sinh vi??n</h2>
        <div>
          <Table>
            <thead>
              <tr>
                <th>M?? sinh vi??n </th>
                <th>T??n </th>
                <th>L???p</th>
              </tr>
            </thead>
            <tbody>{userList.length > 0 && userList.map(renderUserItem)}</tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default InternshipAssessmentLecturerView;

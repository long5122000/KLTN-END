import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ActionDelete from "../../../components/actions/ActionDelete";
import ActionEdit from "../../../components/actions/ActionEdit";
import ActionView from "../../../components/actions/ActionView";
import Button from "../../../components/button/Button";
import LabelStatus from "../../../components/label/LabelStatus";
import Table from "../../../components/table/Table";
import { useAuth } from "../../../context/auth-context";
import { db } from "../../../firebase-app/firebase-config";

const InternshipOutlineList = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const [appointmentList, setAppointmentList] = useState([]);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const openImageViewer = useCallback((index) => {
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };

  useEffect(() => {
    const colRef = collection(db, "InternshipOutlines");
    const q = query(colRef, where("emailLectured", "==", userInfo.email));
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

  const handleDeledeConfirmation = async (item: any) => {
    // if (userInfo?.Role !== userRole.ADMIN) {
    //   Swal.fire("Failed", "You have no right to do this action", "warning");
    //   return;
    // }
    const colRef = doc(db, "InternshipOutlines", item.id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        await deleteDoc(colRef);
        toast.success("X??a cu???c h???n th??nh c??ng ");
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };
  const renderPlanItem = (topic: any) => (
    <tr key={topic.id}>
      <td title={topic.id}>{topic.id.slice(0, 5) + "..."}</td>
      <td>{topic?.name}</td>
      {/* <td>{topic?.msv}</td>
      <td>{topic?.fullname}</td> */}
      <td>
        {new Date(topic?.createdAt?.seconds * 1000).toLocaleDateString("vi-VI")}
      </td>
      <td>
        {topic?.endDate?.seconds * 1000 - Date.now() > 0
          ? "??ang di???n ra"
          : " ???? k???t th??c"}
      </td>
      {/* <td>
        <ModalImage small={topic.image} large={topic.image} />
      </td> */}
      {/* <td>{renderUserStatus(topic?.status)}</td> */}
      <td>
        <div className="flex items-center gap-x-3 text-gray-500">
          <ActionView
            onClick={() =>
              navigate(`/InternshipOutlineLecturerView?id=${topic.id}`)
            }
          ></ActionView>

          {/* <ActionEdit
            onClick={() => {
              navigate(`/BaseConfirmationLecturerEdit?id=${topic.id}`);
            }}
          ></ActionEdit> */}

          <ActionDelete
            onClick={() => handleDeledeConfirmation(topic)}
          ></ActionDelete>
        </div>
      </td>
    </tr>
  );
  return (
    <div className="container">
      <div className="flex justify-end my-5 ">
        <Button className="" kind="primary" href="/InternshipOutlineAddNew">
          T???o m???i cu???c h???n
        </Button>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>T??n cu???c h???n </th>
            {/* <th>M?? sinh vi??n </th>
            <th>T??n sinh vi??n </th> */}
            <th>Ng??y t???o</th>
            <th>Tr???ng th??i </th>
            {/* <th>Image</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointmentList.length > 0 && appointmentList.map(renderPlanItem)}
        </tbody>
      </Table>
    </div>
  );
};

export default InternshipOutlineList;

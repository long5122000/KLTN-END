import React from "react";
import { useDropdown } from "../../context/dropdown-context";

const Option = (props: any) => {
  const { onClick } = props;
  const { setShow } = useDropdown();
  const handleClick = () => {
    onClick && onClick();
    setShow(false);
  };
  return (
    <div
      className="py-4 px-5 cursor-pointer flex items-center justify-between hover:text-primary transition-all text-sm"
      onClick={handleClick}
    >
      {props.children}
    </div>
  );
};

export default Option;

import { NavLink } from "@remix-run/react";
import style from "./StepIndicator.module.css";

export default function StepIndicator({
  isUpload,
  isValidated,
  isStorage,
}: {
  isUpload: boolean;
  isValidated: boolean;
  isStorage: boolean;
}) {
  return (
    <nav id={style["step-indicator"]}>
      <NavStep stepNo="01" title="UPLOAD" isUpload={isUpload} href="/" />
      <NavStep
        stepNo="02"
        title="VALIDATE"
        isUpload={isValidated}
        href="/validate"
      />
      <NavStep
        stepNo="03"
        title="STORAGE"
        isUpload={isStorage}
        href="/storage"
      />
      <NavStep stepNo="04" title="DEPLOY" isUpload={false} href="/deploy" />
    </nav>
  );
}

const NavStep = ({
  stepNo,
  title,
  isUpload,
  href,
}: {
  stepNo: string;
  title: string;
  isUpload: boolean;
  href: string;
}) => {
  const activeStyle = "step-active";
  const inactiveStyle = "step-inactive";

  return (
    <div className="h-full flex-grow">
      <NavLink to={href}>
        {({ isActive }) => (
          <div
            className={`flex h-full items-center gap-4 rounded-md border p-3 ${
              isActive ? "border-[--clr-primary-light]" : "border-transparent"
            }`}
          >
            <div className="tooltip-container">
              <div
                className={`${style["indicator"]} ${
                  isUpload === true ? style["indicator-check"] : ""
                }`}
              >
                <span className="tooltip-text">
                  {isUpload === true ? "Done" : "Not Done"}
                </span>
              </div>
            </div>
            <div className={style["label-container"]}>
              <span className="text-left text-[--clr-primary-light-x]">
                {stepNo}
              </span>
              <span
                className={`step-label ${
                  isActive ? activeStyle : inactiveStyle
                }`}
              >
                {title}
              </span>
            </div>
          </div>
        )}
      </NavLink>
    </div>
  );
};

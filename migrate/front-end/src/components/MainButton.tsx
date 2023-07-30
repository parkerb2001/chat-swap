import styled from "styled-components";
import {
  MAIN_COLOR,
  MAIN_COLOR_ON_HOVER,
  MAIN_TEXT_COLOR,
} from "../constants/colors";
import { Button } from "react-bootstrap";

export default function MainButton(props: {
  text?: string;
  width?: string;
  className?: string;
  disabled?: boolean;
  children?: JSX.Element;
  onClick: Function;
}) {
  const StyledMainButton = styled(Button)`
    &:hover {
      background-color: ${MAIN_COLOR_ON_HOVER} !important;
      border-color: ${MAIN_COLOR_ON_HOVER};
    }
    &:active {
      background-color: ${MAIN_COLOR} !important;
      border-color: ${MAIN_COLOR_ON_HOVER} !important;
    }
    &:disabled {
      border: 0;
    }
    width: ${props.width};
    /* border-radius: 15px; */
    background-color: ${MAIN_COLOR} !important;
    color: ${MAIN_TEXT_COLOR};
    border-color: ${MAIN_COLOR};
  `;
  return (
    <StyledMainButton
      className={props.className}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.text}
      {props.children}
    </StyledMainButton>
  );
}
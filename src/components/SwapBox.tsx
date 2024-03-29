import styled from "styled-components";
import { INPUT_COLOR } from "../constants/colors";
import MainButton from "./MainButton";
import { Form, InputGroup } from "react-bootstrap";
import { token } from "../constants/types";
import TokenModal from "./TokenModal";
import { BaseSyntheticEvent, useEffect, useState } from "react";

export default function SwapBox(props: {
  buttonText: string;
  icon: string;
  tokens: token[];
  setSelectedToken: Function;
  setTokenAmount: Function;
  tokenPrice: Number;
}) {
  const [modalShown, setModalShown] = useState({ show: false });
  const [amountInput, setAmountInput] = useState("");
  const [pricePlaceholder, setPricePlaceholder] = useState("");

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      props.setTokenAmount(Number.parseFloat(amountInput));
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [amountInput, props]);

  useEffect(() => {
    if (props.tokenPrice) {
      setAmountInput("");
      setPricePlaceholder(props.tokenPrice.toString());
    } else {
      setPricePlaceholder("");
    }
  }, [props.tokenPrice]);

  return (
    <InputWrapper size="sm" borderRadius="30px">
      <TokenModal
        setSelectedToken={props.setSelectedToken}
        shown={modalShown}
        tokens={props.tokens}
      />
      <StyledButton
        onClick={() => setModalShown({ show: true })}
        width="30%"
        fontSize="80%"
      >
        {props.icon ? <Icon src={props.icon} alt="" /> : null}
        {props.buttonText}
      </StyledButton>
      <SwapForm
        width={"90px"}
        onChange={(event: BaseSyntheticEvent) => {
          const re = /^[0-9.\b]+$/;
          if (event.target.value === "" || re.test(event.target.value))
            setAmountInput(event.target.value);
        }}
        placeholder={pricePlaceholder}
        value={amountInput}
      />
    </InputWrapper>
  );
}

const InputWrapper = styled(InputGroup)`
  width: 90%;
`;

const SwapForm = styled(Form.Control)`
  background-color: ${INPUT_COLOR};
  border-color: ${INPUT_COLOR};
  form {
    overflow: hidden;
  }
  input {
    float: right;
    clear: both;
  }
`;

const StyledButton = styled(MainButton)`
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  font-size: 12px !important;
`;

const Icon = styled.img`
  width: 20px;
`;

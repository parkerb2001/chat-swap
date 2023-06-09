import styled from "styled-components";
import { INPUT_COLOR, MAIN_COMPONENT_COLOR, MAIN_TEXT_COLOR } from "../colors";
import SwapBox from "./SwapBox";
import MainButton from "./Button";
import { useEffect, useState } from "react";
import { token } from "../types";

export default function TradingBox(props: {
  className?: string;
  tokenListURL: string;
}) {
  const [tokens, setTokens] = useState([] as token[]);

  useEffect(() => {
    fetch(props.tokenListURL)
      .then((result) => {
        return result.json();
      })
      .then((data: { tokens: token[] }) => {
        setTokens(
          data.tokens.filter((token) => {
            return token.chainId === 1;
          })
        );
      });
  }, [props.tokenListURL]);

  return (
    <Wrapper className={props.className + " rounded-3"}>
      <SwapBoxes>
        <SwapBox buttonText="BUY TOKEN" tokens={tokens} />
        <SwapBox buttonText="SELL TOKEN" tokens={tokens} />
      </SwapBoxes>
      <GasWrapper>
        <Gas className="rounded-2">
          <p>GAS</p>
          <p style={{ color: MAIN_TEXT_COLOR }}>1000</p>
        </Gas>
      </GasWrapper>
      <SwapWrapper>
        <MainButton
          onClick={() => null}
          className="rounded-3"
          width="30%"
          text="SWAP"
        />
      </SwapWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 30vw;
  height: 22vw;
  background-color: ${MAIN_COMPONENT_COLOR};
  display: flex;
  flex-direction: column;
`;
const SwapBoxes = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding-top: 5%;
`;
const GasWrapper = styled.div`
  display: flex;
  height: 10%;
  flex-direction: row-reverse;
`;
const Gas = styled.span`
  width: 30%;
  height: 100%;
  background-color: ${INPUT_COLOR};
  margin-right: 5%;
  display: flex;
  justify-content: space-between;
  padding: 5px;
`;
const SwapWrapper = styled.div`
  height: 30%;
  align-items: center;
  display: flex;
  justify-content: space-around;
`;
import { SyntheticEvent, useEffect, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { token } from "../types";
import { Form, InputGroup, ListGroup, ListGroupItem } from "react-bootstrap";
import styled from "styled-components";
import {
  INPUT_COLOR,
  MAIN_COLOR,
  MAIN_COLOR_ON_HOVER,
  MAIN_COMPONENT_COLOR,
  MAIN_TEXT_COLOR,
} from "../colors";
import { Token } from "@mui/icons-material";

export default function TokenModal(props: {
  shown: { show: boolean };
  tokens: token[];
}) {
  const [tokens, setTokens] = useState(props.tokens);
  useEffect(() => {
    setTokens(props.tokens);
  }, [props.tokens]);

  const handleClose = () => setShow({ show: false });

  const [show, setShow] = useState(props.shown);
  useEffect(() => {
    setShow(props.shown);
  }, [props.shown]);

  function TokenList(props: { searchValue: string; tokens: token[] }) {
    const searchedTokens = tokens.filter(
      (token) => token.name.search(new RegExp(searchValue, "i")) !== -1
    );

    const tokenElements = searchedTokens.map((token) => (
      <Item action={true} onClick={handleClose}>
        {token.name}
      </Item>
    ));
    return <List>{tokenElements}</List>;
  }

  const [searchValue, setSearchValue] = useState("");

  function onSearchChange(event: any) {
    setSearchValue(event.target.value);
  }

  return (
    <StyledModal show={show.show} onHide={handleClose}>
      <Header closeButton={true}>
        <Modal.Title>TOKENS</Modal.Title>
        <InputGroup>
          <Search onChange={onSearchChange} placeHolder="Search"></Search>
        </InputGroup>
      </Header>
      <Body>
        <TokenList searchValue={searchValue} tokens={tokens} />
      </Body>
    </StyledModal>
  );
}

const Body = styled(Modal.Body)`
  overflow-y: auto !important;
  max-height: 500px;
`;

const Item = styled(ListGroupItem)`
  color: ${MAIN_TEXT_COLOR};
  background-color: ${MAIN_COMPONENT_COLOR};
  border-color: ${INPUT_COLOR};
  &:hover {
    color: white;
    background-color: ${MAIN_COLOR_ON_HOVER};
  }
  &:active {
    background-color: ${MAIN_COLOR};
  }
  .list-group-item[aria-expanded="true"] {
    background-color: black !important;
    border-color: #aed248;
  }
`;

const Header = styled(Modal.Header)`
  color: ${MAIN_TEXT_COLOR};
  border-color: ${INPUT_COLOR};
`;

const List = styled(ListGroup)`
  background-color: ${MAIN_COMPONENT_COLOR};
`;

const Search = styled(Form.Control)`
  background-color: ${INPUT_COLOR};
  border: none;
  margin-left: 10px;
`;

const StyledModal = styled(Modal)`
  .modal-content {
    background-color: ${MAIN_COLOR};
  }
`;
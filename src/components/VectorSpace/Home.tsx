/* eslint-disable no-restricted-globals */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { Cookies } from "js-cookie";
import {
  Header,
  Grid,
  Form,
  Input,
  Popup,
  Button,
  Message,
  Loader,
  Label,
  Image,
  Modal,
  Icon
} from "semantic-ui-react";
import Select from 'react-select'
import SweetAlert from "sweetalert-react";
import "bootstrap/dist/css/bootstrap.css";
import axios from "axios";
// import axios from '../axios';
import "semantic-ui-css/semantic.min.css";
import routes from "../../constants/routes.json";
// import { updateDocs, clearDocs } from '../actions/docPostingList';
// import docPostingList from '../reducers/docPostingList';

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
// axios.defaults.adapter = require('axios/lib/adapters/http');
type Props = {
  updateDocs: () => void;
  clearDocs: () => void;
  docs: [];
};
export default function Home(props: Props) {
  const { updateDocs, clearDocs } = props;

  const GoogleColors = ["#4285F4", "#DB4437", "#F4B400", "#0F9D58"];
  const [dataFetched, setDataFetched] = useState(false);
  const [planets, setPlanets] = useState({});
  const [query, setQuery] = useState("");
  const [cookie, setCookie] = useState("");
  const [queryTypes, setQueryTypes] = useState([]);
  const [alpha, setalpha] = useState(0.0005);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [alert, setAlert] = useState({ status: false, title: "", text: "" });
  const [docs, setDocs] = useState([]);
  const [queryFetched, setQueryFetchStatus] = useState(false);
  const [LocalPostingList, setLocalPostingList] = useState([]);
  const [firstPage, setFirstPage] = useState(0);
  const [serverDown, setServerDown] = useState(false);
  const [resultyType, setResultType] = useState("set");
  const [vsmFunctions, setVsmFunctions] = useState([]);
  const [choiceFunctions, setChoiceFunctions] = useState([]);
  const [modalState, setModalState] = useState(false);
  const [newTf, setNewTf] = useState('');
  const [newIDF, setNewIDF] = useState('');

  const getNewAlpha = value => {
    setalpha(value);
  };
  const postStartIndexer = () => {
    const formd = new FormData();
    formd.append("csrfmiddlewaretoken", cookie);
    formd.append("code", "start");
    formd.append("tf_func", newTf === '' ? 'natural' : newTf );
    formd.append("idf_func", newIDF === '' ? 'idf' : newIDF);
    formd.append("norm_func", "none");

    const res = axios
      .post("/vsm/indexer/", formd, {
        withCredentials: true
      })
      .then(response => {
        console.log(response);
        setAlert({
          status: true,
          title: "Indexing Complete",
          text: "Documents Have Been Indexed"
        });
        return response;
      })
      .catch(e => console.error(e));
  };
  const postQuery = () => {
    const formd = new FormData();
    console.log(cookie);

    if (alpha < 0) {
      setAlert({
        status: true,
        title: "Incorrect Alpha",
        text: "Please Select a proper cutoff"
      });
      return;
    }
    formd.append("csrfmiddlewaretoken", cookie);
    formd.append("query", query);
    formd.append("alpha", alpha.toString());
    const res = axios
      .post("/vsm/query/", formd, {
        withCredentials: true
      })
      .then(response => {
        console.log(response);

        // if (response.data.type === 'set') {
        //   setResultType('set');
        //   setDocs(response.data.docs);
        //   setFirstPage(response.data.docs[0]);
        //   return response;
        // }
        setResultType(response.data.type);
        setFirstPage(response.data.docs[0][0]);

        console.log(response.data.docs[0].map((doc: any[]) => doc[0]));
        // @ts-ignore
        setLocalPostingList({
          docIds: response.data.docs.map((doc: any[]) => doc[0]),
          PList: response.data.result
        });

        // @ts-ignore
        setDocs(response.data.docs);
        // @ts-ignore
        updateDocs({
          docIds: Object.keys(response.data.result),
          PList: response.data.result
        });

        return response;
      })
      .then(response => {
        setQueryFetchStatus(true);
        return response;
      })
      .catch(err => {
        console.log(err);
        setAlert({ status: true, title: err, text: err.response.data.message });
      });
  };

  const fetchData = () => {
    if (dataFetched === false) {
      axios
        .get("/vsm/indexer")
        .then(response => {
          setVsmFunctions(response.data.data);
          // setDataFetched(true);
          return response;
        })
        .catch(err => {
          setServerDown(true);
        });
      axios
        .get("/vsm/query")
        .then(response => {
          setChoiceFunctions(response.data.data);
          setDataFetched(true);
          return response;
        })
        .catch(err => {
          setServerDown(true);
        });

      axios
        .get("/authentication/get_csrf/")
        .then(response => {
          console.log(response.data.csrfToken);

          Cookies.set("csrftoken", response.data.csrfToken);
          return response;
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
  useEffect(() => {
    console.log(query);

    fetchData();
  });
  

  return (
    <>
      <Row style={{ marginTop: "20px" }}>
        <Col md={{ size: 2, offset: 2 }}>
          <Label>
            {process.env.NODE_ENV === "development"
              ? " Mode : DEV MODE"
              : "Mode: PROD MODE"}
          </Label>
        </Col>
        <Col md={{ size: 3, offset: 5 }}>
          <Modal   open={modalState} size={"small"} trigger={<Button onClick={()=>setModalState(true)}>Re-Index Documents</Button>}>
          
            
            <Modal.Header>Select VSM Configuration <div onClick={()=>setModalState(false)} style={{float:'right'}}><Icon name='remove' color={'black'} /></div></Modal.Header>
            <Modal.Content> 
            <Header>
              Current Configuration :
              </Header>
              <Modal.Description>
                
                  <h5  style={{color:'black'}}>
                  Date Time Indexed : {vsmFunctions['id']}
                  </h5>
                  <h5  style={{color:'black'}}>
                  Tf Function :  {vsmFunctions['tf_func']}
                  </h5>
                  <h5  style={{color:'black'}}>
                  Idf Function :  {vsmFunctions['idf_func']}
                  </h5>
                
              </Modal.Description>
            </Modal.Content>
            <Header>
              New Configuration :
              </Header>
            <Modal.Content>
              {dataFetched ? (
                <>
                  <Modal.Description>
                    <Header>Select Tf Function : Default is normal</Header>
                    <Select
                      style={{color:'black'}}
                      placeholder="Select TF Function"
                      options={choiceFunctions["tf"].map(cf => {
                        return { key: cf[0], label: cf[0], value: cf[0], color:'black' };
                      })}
                      
                      onChange={(event)=>console.log(setNewTf(event.value))}
                    />
                    
                  </Modal.Description>
                  <br></br>
                  <Modal.Description>
                    <Header>Select IDF Function : Default is idf i.e log(N/Df)</Header>
                    <Select
                      onChange={(event)=>console.log(setNewIDF(event.value))}
                      placeholder="Select IDF Function"
                      options={choiceFunctions["idf"].map(cf => {
                        return { key: cf[0], label: cf[0], value: cf[0], color:'black' };
                      })}
                    />
                    
                  </Modal.Description>
                  <br></br>
                  <Popup
                    position="bottom center"
                    trigger={
                      <Button onClick={() => {postStartIndexer(); setModalState(false)}}>
                        Confirm
                      </Button>
                    }
                  >
                    <Popup.Content>This takes a few seconds.</Popup.Content>
                  </Popup>
                </>
              ) : null}
            </Modal.Content>
          </Modal>
        </Col>
      </Row>
      <div
        style={{
          alignContent: "center",
          textAlign: "center",
          verticalAlign: "middle",
          marginTop: "120px",
          marginBottom: "20px"
        }}
      >
        <h1 style={{ fontSize: 65 }}>
          {"Information Retrieval".split("").map((letter, index) => (
            <span
              key={letter + index}
              style={{ color: GoogleColors[index % 4] }}
            >
              {letter}
            </span>
          ))}
        </h1>
        <h1>Assignment # 2 - VSM</h1>
      </div>
      <Container p="100px" l="10px">
        {serverDown ? (
          <div>
            <Message color="red">Server Down</Message>
            <div style={{ float: "right" }}>
              <Button
                onClick={() => {
                  fetchData();
                }}
              >
                Try Server Again
              </Button>
            </div>
          </div>
        ) : null}
        <Row>
          <Col sm="12" md={{ size: 6, offset: 3 }}>
            <Popup
              position="bottom center"
              trigger={
                <Input
                  loading={loadingStatus}
                  style={{ width: "100%" }}
                  placeholder="Enter Your Query Here"
                  onChange={event => setQuery(event.target.value)}
                />
              }
            >
              <Popup.Header>Example Queries: </Popup.Header>
              <Popup.Content>
                <li>- no patience for injustice</li>
                <li>- muslims</li>
                <li>- developments praised</li>
                <li>- Hillary Clinton </li>
              </Popup.Content>
            </Popup>
          </Col>
        </Row>
        <br />
        <Row>
          <Col md={{ offset: 3 }} />
          {/* {queryTypes.map(ty => {
            return (
              <>
                <Col sm="12" md={{ size: 2 }}>
                  <Form.Radio
                    inline
                    key={ty}
                    label={ty[0]}
                    checked={alpha === ty[0]}
                    onChange={event => setalpha(ty[0])}
                  />
                </Col>
              </>
            );
          })} */}
          <Col md={{ size: 2, offset: 2 }}>
            <Popup
              position="bottom center"
              trigger={
                <Input
                  loading={loadingStatus}
                  style={{ width: "100%" }}
                  placeholder="alpha"
                  value={alpha}
                  onChange={event => getNewAlpha(event.target.value)}
                />
              }
            >
              <Popup.Header>Alpha Cutoff: </Popup.Header>
              <Popup.Content>Default is 0.0005</Popup.Content>
            </Popup>
          </Col>
        </Row>
        <br />
        <Row>
          <Col md={{ size: 2, offset: 5 }}>
            <Form.Button style={{ width: "100%" }} onClick={postQuery}>
              Submit
            </Form.Button>
          </Col>
        </Row>
        <br />
        {!queryFetched ? null : (
          <Message>
            <Message.Header>Query Present in Documents</Message.Header>
            <div style={{ display: "inline-block", flex: "center" }}>
              {docs.map((doc, index) => {
                return (
                  <p style={{ display: "block", flex: "center" }} key={doc[0]}>
                    {`${index + 1}) docId : ${doc[0]}, 'Cosine Similarity : ${
                      doc[1]
                    } '`}
                  </p>
                );
              })}
            </div>
            {resultyType === "set" ? null : (
              <Link to={`${routes.FILE}/${firstPage}`}>
                <Button>View Query In Documents</Button>
              </Link>
            )}
          </Message>
        )}
      </Container>
      <SweetAlert
        show={alert.status}
        title={alert.title}
        text={alert.text}
        onConfirm={() => setAlert({ status: false, title: "", text: "" })}
      />
    </>
  );
}
// export default Home;

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
  Icon,
  Menu,
  TextArea ,
  Checkbox
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
  const [K, setK] = useState(3);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [alert, setAlert] = useState({ status: false, title: "", text: "" });
  const [docs, setDocs] = useState([]);
  const [queryFetched, setQueryFetchStatus] = useState(false);
  const [LocalPostingList, setLocalPostingList] = useState([]);
  const [firstPage, setFirstPage] = useState(0);
  const [serverDown, setServerDown] = useState(false);
  const [resultyType, setResultType] = useState("set");
  const [modelProperties, setmodelProperties] = useState([]);
  const [choiceFunctions, setChoiceFunctions] = useState([]);
  const [modalState, setModalState] = useState(false);
  const [newTrainSize, setnewTrainSize] = useState(0.8);
  const [newTestSize, setnewTestSize] = useState(0.2);
  const [distanceFormula, setnewDistance] = useState('');
  const [labelDisplay, setLabel] = useState('');
  const [reIndex, setnewReIndex] = useState();

  const getNewK = value => {
    setK(value);
  };
  const MODEL_NAME = 'KNN';
  const DATASET_NAME = 'bbcsport';

  const postStartIndexer = () => {
    const formd = new FormData();
    formd.append("csrfmiddlewaretoken", cookie);
    formd.append("dataset", DATASET_NAME);
    formd.append("train_size",  String(newTrainSize) );
    formd.append("test_size",String(newTestSize));
    formd.append("k", String(K));
    formd.append('distance_formula',distanceFormula)
    formd.append('re_index', reIndex);

    const res = axios
      .post(`/classification/model/${MODEL_NAME}`, formd, {
        withCredentials: true
      })
      .then(response => {
        console.log(response);
        setAlert({
          status: true,
          title: "Document Indexing and Model Training Complete",
          text: "Documents Have Been Index"
        });
        return response;
      })
      .catch(e => console.error(e));
  };
  const postQuery = () => {
    const formd = new FormData();
    console.log(cookie);

    if (K < 0) {
      setAlert({
        status: true,
        title: "Incorrect k",
        text: "Please Select a proper cutoff"
      });
      return;
    }
    formd.append("csrfmiddlewaretoken", cookie);
    formd.append("query", query);
    formd.append("k", K.toString());
    formd.append("dataset", DATASET_NAME);
    const res = axios
      .post(`/classification/predict/${MODEL_NAME}`, formd, {
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
        setLabel(response.data.result[0]);
        // setFirstPage(response.data.docs[0][0]);

        // console.log(response.data.docs[0].map((doc: any[]) => doc[0]));
        // @ts-ignore
        // setLocalPostingList({
        //   docIds: response.data.docs.map((doc: any[]) => doc[0]),
        //   PList: response.data.result
        // });

        // // @ts-ignore
        // setDocs(response.data.docs);
        // // @ts-ignore
        // updateDocs({
        //   docIds: Object.keys(response.data.result),
        //   PList: response.data.result
        // });

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
        .get(`/classification/model/${MODEL_NAME}`)
        .then(response => {
          setmodelProperties(response.data.data);
          // setDataFetched(true);
          return response;
        })
        .catch(err => {
          setServerDown(true);
        });
      axios
        .get(`/classification/predict/${MODEL_NAME}`)
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
    <Menu stackable inverted pointing secondary>
        <Menu.Item>
          K173654
        </Menu.Item>

        {/* <Menu.Item
          name='KMeans'
          active={false}
          onClick={()=> window.location.href = '/#/KMean'}
        >
          KMeans Clustering
        </Menu.Item> */}

        <Menu.Item
          name='KNN'
          active={true}
          
          onClick={()=> window.location.href = '/#/KNN'}
        >
          K-Nearest Neighbor
        </Menu.Item>
        
        
      </Menu>

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
          
            
            <Modal.Header>Select KNN Configuration <div onClick={()=>setModalState(false)} style={{float:'right'}}><Icon name='remove' color={'black'} /></div></Modal.Header>
            <Modal.Content> 
            <Header>
              Current Configuration :
              </Header>
              <Modal.Description>
              <h5  style={{color:'black'}}>
                  Accuracy :  {modelProperties['accuracy']}
                  </h5>
                  <h5  style={{color:'black'}}>
                  Date Time Indexed : {modelProperties['id']}
                  </h5>
                  <h5  style={{color:'black'}}>
                  Train Size :  {modelProperties['train_size']}
                  </h5>
                  <h5  style={{color:'black'}}>
                  Test Size :  {modelProperties['test_size']}
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
                    <div style={{display:'inline-flex', alignSelf:'center'}}>
                    <Header style={{ alignSelf:'center'}}>Select Train Percentage: Default is 0.8</Header>
                    <br/>
                    <Input
                      style={{color:'black'}}
                      placeholder="Select Train Percentage"
                      value={0.8}
                      // options={choiceFunctions["tf"].map(cf => {
                      //   return { key: cf[0], label: cf[0], value: cf[0], color:'black' };
                      // })}
                      
                      onChange={(event)=>console.log(setnewTrainSize(Number(event.target.value)))}
                      
                    />
                    </div>
                    <div style={{display:'inline-flex', alignSelf:'center'}}>
                    <Header  style={{ alignSelf:'center'}}>Select Test Percentage: Default is 0.2</Header>
                    <br/>
                    <Input
                      onChange={(event)=>console.log(setnewTestSize(Number(event.target.value)))}
                      placeholder="Select Test Percentage"
                      value = {0.2}
                      // options={choiceFunctions["idf"].map(cf => {
                      //   return { key: cf[0], label: cf[0], value: cf[0], color:'black' };
                      // })}
                    />
                    </div>
                    
                  </Modal.Description>
                  
                  <br></br>
                  <Modal.Description>
                    <Header>Select Distance Formula</Header>
                    <Select
                      onChange={(event)=>console.log(setnewDistance((event.value)))}
                      // onChange={(event)=>console.log((event.value))}
                      placeholder="Select Distance Formula"
                      options={choiceFunctions["distance_formula"].map(cf => {
                        return { key: cf[0], label: cf[0], value: cf[0], color:'black' };
                      })}
                    />
                    
                  </Modal.Description>
                  <br></br>
                  <Modal.Description>
                    <Header>Re-Index Vector Space Model</Header>
                    <Checkbox
                      onChange={(event, {checked})=>console.log(setnewReIndex(checked))}
                      
                      
                      // options={choiceFunctions["idf"].map(cf => {
                      //   return { key: cf[0], label: cf[0], value: cf[0], color:'black' };
                      // })}
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
                    <Popup.Content>This takes a few Minutes.</Popup.Content>
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
        <h1>Assignment # 3 - KNN</h1>
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
       {
          labelDisplay !== '' ?  <Row>
          <Col md={{ size: 2, offset: 5 }}>
            <Form.Button style={{ width: "100%" }} >
             {labelDisplay}
            </Form.Button>
          </Col>
        </Row>: null
  

   }
<br/>

        <Row >
          <Col sm="12" md={{ size: 10, offset: 1 }}>
            <Popup
              position="bottom center"
              trigger={
                <Input
                
                  loading={loadingStatus}
                  style={{ width: "100%", height:'120px'}}
                  placeholder="Enter Your Text Here"
                  onChange={event => setQuery(event.target.value)}
                />
              }
            >
              <Popup.Header>Example Output Classes: </Popup.Header>
              <Popup.Content>
                <li>- Athletics</li>
                <li>- Rugby</li>
                <li>- Football</li>
                <li>- Cricket </li>
                <li>- Tennis </li>
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
                  placeholder="k"
                  value={K}
                  onChange={event => getNewK(event.target.value)}
                />
              }
            >
              <Popup.Header>K Neighnors: </Popup.Header>
              <Popup.Content>Default is 3</Popup.Content>
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
        {/* {!queryFetched ? null : (
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
        )} */}
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

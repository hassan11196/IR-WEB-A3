/* eslint-disable no-restricted-globals */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import {Cookies }from 'js-cookie';
import {
  Header,
  Grid,
  Form,
  Input,
  Popup,
  Button,
  Message,
  Loader,
  Label
} from 'semantic-ui-react';
import SweetAlert from 'sweetalert-react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
// import axios from '../axios';
import 'semantic-ui-css/semantic.min.css';
import routes from '../../constants/routes.json';
// import { updateDocs, clearDocs } from '../actions/docPostingList';
// import docPostingList from '../reducers/docPostingList';


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
// axios.defaults.adapter = require('axios/lib/adapters/http');
type Props = {
  updateDocs: () => void;
  clearDocs: () => void;
  docs: [];
};
export default function Home(props: Props) {
  const { updateDocs, clearDocs } = props;

  const GoogleColors = ['#4285F4', '#DB4437', '#F4B400', '#0F9D58'];
  const [dataFetched, setDataFetched] = useState(false);
  const [planets, setPlanets] = useState({});
  const [query, setQuery] = useState('');
  const [cookie, setCookie] = useState('');
  const [queryTypes, setQueryTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [alert, setAlert] = useState({ status: false, title: '', text: '' });
  const [docs, setDocs] = useState([]);
  const [queryFetched, setQueryFetchStatus] = useState(false);
  const [LocalPostingList, setLocalPostingList] = useState([]);
  const [firstPage, setFirstPage] = useState(0);
  const [serverDown, setServerDown] = useState(false);
  const [resultyType, setResultType] = useState('set');

  const postStartIndexer = () => {
    const formd = new FormData();
    formd.append('csrfmiddlewaretoken', cookie);
    formd.append('code', 'start');
    const res = axios.post('/iindex/indexer/', formd, {
      withCredentials: true
    })
      .then(response => {
        console.log(response);
        setAlert({
          status: true,
          title: 'Indexing Complete',
          text: 'Documents Have Been Indexed'
        });
        return response;
      })
      .catch((e)=>console.error(e));
  };
  const postQuery = () => {
    const formd = new FormData();
    console.log(cookie);
    
    if (selectedType === '') {
      setAlert({
        status: true,
        title: 'Empty Query Type',
        text: 'Please Select a Query Type'
      });
      return;
    }
    formd.append('csrfmiddlewaretoken', cookie);
    formd.append('query', query);
    formd.append('query_type', selectedType);
    const res = axios.post('/iindex/query/', formd, {
      withCredentials: true
    })
      .then(response => {
        console.log(response);

        if (response.data.type === 'set') {
          setResultType('set');
          setDocs(response.data.docs);
          setFirstPage(response.data.docs[0]);
          return response;
        }
        setResultType(response.data.type);
        setFirstPage(response.data.docs[0]);
        // @ts-ignore
        setLocalPostingList({
          docIds: Object.keys(response.data.result),
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
      axios.get('/iindex/query')
        .then(response => {
          setQueryTypes(response.data.options);
          setDataFetched(true);
          return response;
        })
        .catch(err => {
          setServerDown(true);
        });

      axios.get('/authentication/get_csrf/')
        .then(response => {
          console.log(response.data.csrfToken);
          
          Cookies.set('csrftoken',response.data.csrfToken, );
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
    <Row style={{ marginTop: '20px' }}>
        <Col md={{ size: 2, offset: 2 }}>
          <Label>
            {process.env.NODE_ENV === 'development'
              ? ' Mode : DEV MODE'
              : 'Mode: PROD MODE'}
          </Label>
        </Col>
        <Col md={{ size: 3, offset: 5 }}>
        <Popup
            position="bottom center"
            
            trigger={(
              <Button onClick={() => postStartIndexer()}>
                Re-Index Documents
              </Button>
       
              )}
          >
            <Popup.Content>This takes a few seconds.</Popup.Content>
          </Popup>
        </Col>
      </Row>
      <div
        style={{
          alignContent: 'center',
          textAlign: 'center',
          verticalAlign: 'middle',
          marginTop: '120px',
          marginBottom: '20px'
        }}
      >
        <h1 style={{ fontSize: 65 }}>
          {'Information Retrieval'.split('').map((letter, index) => (
            <span
              key={letter + index}
              style={{ color: GoogleColors[index % 4] }}
            >
              {letter}
            </span>
          ))}
        </h1>
        <h1>Assignment # 1</h1>
      </div>
      <Container p="100px" l="10px">
        {serverDown ? (
          <div>
            <Message color="red">Server Down</Message>
            <div style={{ float: 'right' }}>
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
              
              trigger={(
                <Input
                  loading={loadingStatus}
                  style={{ width: '100%' }}
                  placeholder="Enter Your Query Here"
                  onChange={event => setQuery(event.target.value)}
                />
                
              )}
            >
              <Popup.Header>Example Queries: </Popup.Header>
              <Popup.Content>
                <li>- actions AND wanted</li>
                <li>- biggest AND ( near OR box )</li>
                <li>- keep out /2</li>
                <li>- Hillary Clinton </li>
              </Popup.Content>
            </Popup>
          </Col>
        </Row>
        <br />
        <Row>
          <Col md={{ offset: 3 }} />
          {queryTypes.map(ty => {
            return (
              <>
                <Col sm="12" md={{ size: 2 }}>
                  <Form.Radio
                    inline
                    key={ty}
                    label={ty[0]}
                    checked={selectedType === ty[0]}
                    onChange={event => setSelectedType(ty[0])}
                  />
                </Col>
              </>
            );
          })}
        </Row>
        <br />
        <Row>
          <Col md={{ size: 2, offset: 5 }}>
            <Form.Button style={{ width: '100%' }} onClick={postQuery}>
              Submit
            </Form.Button>
          </Col>
        </Row>
        <br />
        {!queryFetched ? null : (
          <Message>
            <Message.Header>Query Present in Documents</Message.Header>
            <div style={{ display: 'inline-block', flex: 'center' }}>
              {docs.map(doc => {
                return (
                  <p style={{ display: 'inline-block', flex: 'center' }} key={doc}>
                    {`${doc}, `}
                  </p>
                );
              })}
            </div>
            {resultyType === 'set' ? null : (
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
        onConfirm={() => setAlert({ status: false, title: '', text: '' })}
      />
    </>
  );
}
// export default Home;

/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
// @ts-ignore
import { Container, Row, Col } from 'reactstrap';
// @ts-ignore
import {
  Header,
  Grid,
  Form,
  Input,
  Popup,
  Button,
  Message,
  Segment
} from 'semantic-ui-react';
// @ts-ignore
import SweetAlert from 'sweetalert-react';

import 'bootstrap/dist/css/bootstrap.css';
// @ts-ignore
import {Cookies} from 'js-cookie';
import { connect } from 'http2';
import { isArray } from 'util';
import axios from 'axios';
// import axios from '../axios';
import 'semantic-ui-css/semantic.min.css';

import routes from '../constants/routes.json';

// const { session } = require('electron').remote;

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
// axios.defaults.adapter = require('axios/lib/adapters/http');

type Props = {
  updateDocs: () => void;
  clearDocs: () => void;
  docsPostingList: object;
  docs:any;
  history: any;
};
const FileDisplay = (props: Props) => {
  const { updateDocs, clearDocs, history } = props;

  const { docId } = useParams();
  const GoogleColors = ['#4285F4', '#DB4437', '#F4B400', '#0F9D58'];
  const [alert, setAlert] = useState({ status: false, title: '', text: '' });
  const [docs, setDocs] = useState('');
  const [pagePostingList, setPPL] = useState([]);
  const [renderedText, setRenderedText] = useState(null);
  const [linesToShow, setlinesToShow] = useState([]);
  const [nextPage, setNextPage] = useState(0);
  const [reRender, setReRender] = useState(false);

  const getOccurances = line => {
    const occurrances = [];

    pagePostingList.forEach(loc => {
      let oc = '...';
      let location;
      if (isArray(loc)) {
        // eslint-disable-next-line prefer-destructuring
        location = loc[0];
      } else {
        location = loc;
      }
      let diff = location.col - 30;
      if (location.col - 30 <= 0) {
        diff = location.col;
      }
      for (
        let index = diff;
        index < line.length && index < location.col + 30;
        index += 1
      ) {
        oc += line[index];
      }
      occurrances.push(`${oc}...`);
    });
    return occurrances;
  };

  useEffect(() => {
    // setPPL(docsPostingList[docId]);
    // pagePostingList =
    axios.get(`static/speech_${docId}.txt`)
      .then(response => {
        setDocs(response.data);
        const text = response.data.split('\n')[1];
        console.log(text);

        setPPL(props.docs.PList[docId]);
        console.log(pagePostingList);
        if (pagePostingList === []) return null;
        console.log(getOccurances(text));
        setlinesToShow(getOccurances(text));

        if (props.docs.docIds.length <= props.docs.docIds.indexOf(docId) + 1) {
          setNextPage(props.docs.docIds[0]);
        } else {
          setNextPage(props.docs.docIds[props.docs.docIds.indexOf(docId) + 1]);
        }

        console.log(linesToShow);
        // console.log(history);
        // const lines = text.split('').reduce(getLines, []);
        // setlinesToShow(lines);
        // console.log(lines);
        return response.data;
      })
      .catch(er => {
        console.log(er);
        setAlert({ status: true, title: '', text: er.message });
      });
  }, [pagePostingList, docs, reRender]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // eslint-disable-next-line react/display-name
  const displayText = () => {
    if (renderedText !== null) {
      return renderedText;
    }
    return <h1>Fetching Files</h1>;
  };
  return (
    <>
      <Container>
        <div
          style={{
            alignContent: 'center',
            textAlign: 'center',
            verticalAlign: 'middle',
            marginTop: '10px',
            marginBottom: '20px'
          }}
        >
          <h1 style={{ fontSize: 65 }}>
            <Link to={routes.HOME}>
              {'Information Retrieval'.split('').map((letter, index) => (
                <span
                  key={letter + index}
                  style={{ color: GoogleColors[index % 4] }}
                >
                  {letter}
                </span>
              ))}
            </Link>
          </h1>
          <h1>{`Doc # ${docId}`}</h1>
        </div>

        <Segment.Group>
          {/* {props.docs === [] ||
          props.docs === undefined ||
          props.docs === null ? (
            [docs.split('\n')[0]].map((line, index) => {
              return (
                <Segment key={line[5] + index}>
                  <div style={{ display: 'inline' }}>
                    {line.split(' ').map((letter, ind) => {
                      return (
                        // <span key={letter + ind} style={{ color: 'black' }}>
                        <p
                          key={letter[0] + ind}
                          style={{ color: 'black', display: 'inline' }}
                        >
                          {`${letter} `}
                        </p>
                        // </span>
                      );
                    })}
                  </div>
                </Segment>
              );
            })
          ) : (
            <h1>Invalid Document</h1>
          )} */}
          <Segment>
            <span>
              {!(
                linesToShow === [] ||
                linesToShow === undefined ||
                linesToShow === null
              ) ? (
                <Button onClick={() => history.goBack()}>Back</Button>
              ) : null}
              {!(
                linesToShow === [] ||
                linesToShow === undefined ||
                linesToShow === null
              ) ? (
                <Link
                  style={{
                    float: 'right',
                    display: 'inline-block'
                  }}
                  to={`${routes.FILE}/${nextPage}`}
                >
                  <Button onClick={() => setReRender(!reRender)}>Next</Button>
                </Link>
              ) : null}
            </span>
          </Segment>
          {!(
            linesToShow === [] ||
            linesToShow === undefined ||
            linesToShow === null
          ) ? (
            linesToShow.map((line, index) => {
              return (
                <Segment key={line[5] + index}>
                  <div style={{ display: 'inline' }}>
                    <p
                      key={line[0] + index}
                      style={{
                        backgroundColor: 'yellow',

                        color: 'black'
                      }}
                    >
                      {line}
                    </p>
                  </div>
                </Segment>
              );
            })
          ) : (
            <h1>Invalid Posting</h1>
          )}
          
        </Segment.Group>
      </Container>
      <SweetAlert
        show={alert.status}
        title={alert.title}
        text={alert.text}
        onConfirm={() => setAlert({ status: false, title: '', text: '' })}
      />
    </>
  );
};
export default FileDisplay;

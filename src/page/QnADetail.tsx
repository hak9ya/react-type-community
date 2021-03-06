import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Mobile, Tablet, PC } from '../MediaQuery';
import axios from 'axios';
import '../qnadetail.css';
import { qnaBoardType, qnaReplyType } from 'types';
import moment from 'moment';

const QnADetail = () => {
  // 옵셔널 체이닝
  // var a = undefined;
  // if (boardData !== null && boardData !== undefined) {
  //   a = boardData.QNA_WRITER;
  // }
  const [boardData, setBoardData] = useState<qnaBoardType>();
  const [replyData, setReplyData] = useState<qnaReplyType[]>([]);
  const [replyCnt, setReplyCnt] = useState(0);
  const [isLogin, setIsLogin] = useState(false);
  const [isContents, setIsContents] = useState('');
  const [viewCnt, setViewCnt] = useState(0);

  const qnaNo = useParams();
  const userId = localStorage.getItem('user_info');

  const onChangeContents = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsContents(e.target.value);
  };

  useEffect(() => {
    if (localStorage.getItem('user_info') === null) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }

    axios
      .all([
        axios.post('/apis/qnadetail', qnaNo),
        axios.post('/apis/qnareply', qnaNo),
        axios.post('/apis/qnaViewCnt', qnaNo),
      ])
      .then(
        axios.spread((res1, res2, res3) => {
          setBoardData(res1.data);
          setReplyData(res2.data);
          setReplyCnt(res2.data.length);
          setViewCnt(res3.data);
        }),
      )
      .catch((err) => console.log(err));
  }, [qnaNo]);

  const qnaReplyList = replyData.map((qnaReplyList, index) => (
    <li key={index} className="p_answer_main">
      <div className="p_reply_writer">
        <span>{qnaReplyList.QNA_REPLY_WRITER}</span>
        <span>
          {moment(qnaReplyList.QNA_REPLY_DATE).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      </div>
      <div className="p_answer_contents">{qnaReplyList.QNA_REPLY_CONTENTS}</div>
    </li>
  ));

  const param = {
    replyBoardNo: qnaNo.qnaNo,
    replyWriter: userId,
    replyContents: isContents,
  };

  const onClickReplyInsert = () => {
    axios
      .post('/apis/replyInsert', param)
      .then((response) => {
        console.log(response);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  console.log(boardData?.QNA_DATE, typeof boardData);

  return (
    <>
      <PC>
        <div className="p_detail_board">
          <div className="p_detail_panel_top">
            <span>Q & A</span>
            <span>
              <Link to="/qna/write">새 글쓰기</Link>
            </span>
          </div>
          <div className="p_detail_board_sub">
            <div className="p_detail_panel1">
              <div className="p_detail_wd">
                <span>작성자 : {boardData?.QNA_WRITER}</span>
                <span>
                  작성시간 :{' '}
                  {moment(boardData?.QNA_DATE).format('YYYY-MM-DD HH:mm:ss')}
                </span>
              </div>
              <div>
                <span>조회 수 : {viewCnt} </span>
              </div>
            </div>
            <div className="p_detail_panel2">
              <div className="p_detail_nt">
                <span>글 번호 : {boardData?.QNA_NO}</span>
                <span>제목 : {boardData?.QNA_TITLE}</span>
              </div>
            </div>
            <div className="p_detail_panel3">
              <div>
                <div>내용 : {boardData?.QNA_CONTENTS}</div>
              </div>
            </div>
          </div>
          <div className="p_detail_answer">
            <ul>
              <li className="p_answer_title">답변 {replyCnt}</li>
              {qnaReplyList}
              <li className="p_answer_main">
                <div className="p_reply_writer">
                  {isLogin ? (
                    <div className="p_reply_space">
                      <textarea
                        className="p_textarea"
                        onChange={onChangeContents}
                        value={isContents}
                      ></textarea>
                      <button
                        type="button"
                        className="p_custom_btn_small btn_primary"
                        onClick={onClickReplyInsert}
                      >
                        <span>등록</span>
                      </button>
                    </div>
                  ) : (
                    <span className="p_reply_login">
                      <Link to="/login" className="p_reply_login_color">
                        로그인
                      </Link>
                      을 하시면 답변을 등록할 수 있습니다.
                    </span>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </PC>
      {/* <Tablet>
        <div className="p_detail_board">
          <div className="p_detail_panel_top">
            <span>Q & A</span>
            <span>
              <button>새 글 쓰기</button>
            </span>
          </div>
          <div className="p_detail_board_sub">
            <div className="p_detail_panel1">
              <div className="p_detail_wd">
                <span>작성자 : {boardData.QNA_WRITER}</span>
                <span>작성시간 : {boardData.QNA_DATE}</span>
              </div>
              <div>
                <span>조회 수 : {boardData.QNA_VIEW}</span>
              </div>
            </div>
            <div className="p_detail_panel2">
              <div className="p_detail_nt">
                <span>글 번호 : {boardData.QNA_NO}</span>
                <span>제목 : {boardData.QNA_TITLE}</span>
              </div>
            </div>
            <div className="p_detail_panel3">
              <div>
                <div>내용 : {boardData.QNA_CONTENTS}</div>
              </div>
            </div>
          </div>
          <div className="p_detail_answer">
            <ul>
              <li className="p_answer_title">답변 {replyCnt}</li>
              {qnaReplyList}
            </ul>
          </div>
        </div>
      </Tablet>
      <Mobile>
        <div className="p_detail_board">
          <div className="p_detail_panel_top">
            <span>Q & A</span>
            <span>
              <button>새 글 쓰기</button>
            </span>
          </div>
          <div className="p_detail_board_sub">
            <div className="p_detail_panel1">
              <div className="p_detail_wd">
                <span>작성자 : {boardData.QNA_WRITER}</span>
                <span>작성시간 : {boardData.QNA_DATE}</span>
              </div>
              <div>
                <span>조회 수 : {boardData.QNA_VIEW}</span>
              </div>
            </div>
            <div className="p_detail_panel2">
              <div className="p_detail_nt">
                <span>글 번호 : {boardData.QNA_NO}</span>
                <span>제목 : {boardData.QNA_TITLE}</span>
              </div>
            </div>
            <div className="p_detail_panel3">
              <div>
                <div>내용 : {boardData.QNA_CONTENTS}</div>
              </div>
            </div>
          </div>
          <div className="p_detail_answer">
            <ul>
              <li className="p_answer_title">답변 {replyCnt}</li>
              {qnaReplyList}
            </ul>
          </div>
        </div>
      </Mobile> */}
    </>
  );
};

export default QnADetail;

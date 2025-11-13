import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 아이디,비밀번호에 대한 state 관리 기능 구현
  // useState를 사용해 아이디와 비밀번호 값을 저장할 state를 만듬
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  //input 값 변경될 때마다 state를 업데이트하는 함수
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // 폼 제출(=로그인 버튼 클릭) 시 실행 함수
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼 제출시 페이지 새로고침 동작을 막음

    // id와 pw 빈 값인지 확인
    if (!id || !password) {
      alert('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    // 로그인 처리 로직. 현재는 그냥 콘솔출력만함.
    console.log('로그인 시도:', { id, password });
    alert(`${id}님, 환영합니다!`);
    
    // 로그인 성공 후 채팅 페이지로 이동
    navigate('/chat');
  };

  return (
    // 페이지 중앙에 위치하는 로그인 폼
    <div className="login-container">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div>
          {/* Input 컴포넌트 사용*/}
          <Input
            type="text"
            value={id}
            onChange={handleIdChange}
            placeholder="아이디(이메일)"
          />
        </div>
        <div>
          {/* Input 컴포넌트 사용 type="password" */}
          <Input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="비밀번호"
          />
        </div>
        {/* Button 컴포넌트 사용 */}
        <Button type="submit">로그인</Button>
      </form>
    </div>
  );
};

export default LoginPage;
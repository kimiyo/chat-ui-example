# Chat UI Component

이 프로젝트는 다른 웹 프로젝트에서 쉽게 재사용할 수 있도록 설계된, 외부 라이브러리 의존성이 없는 순수 JavaScript 채팅 UI 컴포넌트입니다.

## 주요 특징

- **순수 JavaScript 구현**: 외부 라이브러리나 프레임워크 없이 단일 `chat-ui.js` 파일로 동작합니다.
- **클래스 기반 모듈**: `ChatUI` 클래스로 모든 기능이 캡슐화되어 있어 다른 프로젝트에서 쉽게 가져와 사용할 수 있습니다.
- **간단한 연동**: HTML 파일에 스크립트를 추가하고 간단한 코드로 채팅 UI를 생성할 수 있습니다.
- **커스텀 이벤트**: 메시지 전송과 같은 사용자 상호작용에 대한 이벤트를 제공합니다.

---

## 🚀 사용자를 위한 가이드 (For Users/Integrators)

`chat-ui.js`를 프로젝트에 통합하는 방법입니다.

### 1. 스크립트 추가

HTML 파일에 `chat-ui.js` 파일을 포함합니다.

```html
<script src="chat-ui.js"></script>
```

### 2. ChatUI 인스턴스 생성

채팅 UI를 표시할 컨테이너 요소(`<div>`)를 지정하고 `ChatUI` 클래스를 초기화합니다.

```javascript
// HTML에 <div id="chat-container"></div>가 있다고 가정
const chatContainer = document.getElementById('chat-container');

// ChatUI 인스턴스 생성
const chatUI = new ChatUI({
  container: chatContainer,
  // 추가 옵션 설정 가능
});

// 이벤트 리스너 등록 (예: 사용자가 메시지를 보냈을 때)
chatUI.on('sendMessage', (message) => {
  console.log('보낸 메시지:', message.text);
  // 여기에 챗봇 응답 로직을 추가할 수 있습니다.
});
```

### 3. 메시지 객체 스키마

`addMessage()` 메서드를 사용하여 채팅창에 메시지를 추가할 때 사용하는 객체 형식입니다.

```javascript
{
  role: 'user' | 'bot',       // 메시지 주체 ('user' 또는 'bot')
  type: 'text' | 'image',     // 메시지 유형
  text?: string,              // 표시될 텍스트 (type: 'text')
  images?: Array<{ src: string, alt?: string }>,  // 표시될 이미지 (type: 'image')
  timestamp?: string          // 'YYYY-MM-DD HH:MM:SS' 형식의 타임스탬프
}
```

---

## 🛠️ 개발자를 위한 가이드 (For Developers)

이 프로젝트에 기여하거나 코드를 수정하려는 개발자를 위한 안내입니다.

### 1. 기술 요구사항

- **구현**: 모든 로직은 `chat-ui.js` 파일 내의 `ChatUI` JavaScript 클래스로 구현됩니다.
- **독립성**: 외부 라이브러리, 프레임워크, 빌드 도구를 사용하지 않습니다.
- **파일 구조**: `chat-ui.js` (핵심 로직)와 `index.html` (데모 및 테스트) 두 파일로 구성됩니다.

### 2. 테스트 방법

- **수동 테스트**: `index.html` 파일을 브라우저에서 직접 열어 UI의 모든 기능을 테스트할 수 있습니다. 이 파일에는 각 기능을 검증하기 위한 버튼과 스크립트가 포함되어 있습니다.
- **테스트 환경**: 최신 버전의 Chrome, Firefox, Edge, Safari 브라우저에서 데스크톱, 태블릿, 모바일 해상도를 기준으로 테스트합니다.

### 3. 향후 확장 계획 (Out of Scope for v1)

다음 기능들은 향후 버전에서 구현될 수 있습니다.

- 다크 모드/라이트 모드 토글
- 마크다운 렌더링
- 타이핑 인디케이터
- 파일 첨부 및 음성 메시지
- 읽음/안 읽음 표시

### 4. 참고 문서

- `PRD.md`: 제품 요구사항 명세서
- `index.html`: 데모 및 수동 테스트 페이지

# SSD-Back-End

### 로컬 실행

.env 파일 만들고 실행

```
PORT=3001
NODE_ENV=dev
COOKIE_SECRET=secret
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=1234
DB_NAME=mydb
MAP_API_KEY=YOUR_GOOGLE_MAP_API_KEY
AI_SERVER_URL=http://localhost:8000
```

### 도커 실행

```
docker compose up
```

### API 명세서

---

**🚨 Local Server URL (Server Host) 🚨**

```
http://127.0.0.1:3001
```

**🌸 Overview**

| HTTP METHOD | End Point | Description | 구현 여부 |
| --- | --- | --- | --- |
| GET | /user | 회원 정보 조회 | O |
| PATCH | /user | 회원정보 수정 | O |
| DELETE | /user | 회원삭제 | O |
| GET | /auth/login | 로그인 | O |
| GET | /auth/logout | 로그아웃 | O |
| POST | /auth/register | 회원가입 | O |
| GET | /sport | 스포츠 강좌 이용권 정보 조회 | O |
| GET | /sport/detail/:sport_id | 스포츠 강좌 이용권 정보 상세 조회 | O |
| GET | /sport/ai | AI 추천 운동 가져오기 | O |
| POST | /sport/ai | AI 설문 조사  | O |
| GET | /class | 내가 등록한 스포츠 강좌 조회 | O |
| POST | /class/:class_id | 스포츠 강좌 등록 | O |
| DELETE | /class/:class_id | 스포츠 강좌 등록  취소 | O |
| GET | /clsss/bookmark | 스포츠 강좌 즐겨찾기 조회 | O |
| POST | /class/bookmark/:class_id | 스포츠 강좌 즐겨찾기 등록 | O |
| DELETE | /class/bookmark/:class_id | 스포츠 강좌 즐겨찾기 취소 | O |

---

### 회원 정보 가져오기 (GET /user)

**📌 Server Response**

✅ Success

```json
{
	"user_id": 1,
  "email": "test@naver.com",
  "rating": "프리미엄",
  "name": "테스트",
  "age": 15,
  "gender": "M",
  "height": 160,
  "weight": 50,
  "school": "@@중학교",
  "phone": "010-0000-0000",
  "balance": 100000,
	"latitude": "37.5125402000",
	"longitude": "127.1024458000"
}
```

❌ Error

```json
{
  "status": 400,
  "error": "유저가 존재하지 않습니다"
}
```

### 회원정보 수정 (PATCH /user)

**📌 Request Body**

```json
{
  "weight": 60
}
```

**📌 Server Response**

✅ Success

```json
{
  "status": 200,
  "message": "성공"
}
```

❌ Error

```json
{
  "status": 400,
  "error": "유저 정보가 잘못 입력 되었습니다"
}
```

### 회원 삭제 (DELETE /user)

**📌 Server Response**

✅ Success

```json
{
  "status": 200,
  "message": "성공"
}
```

❌ Error

```json
{
  "status": 400,
  "error": "유저 정보가 잘못 입력 되었습니다"
}
```

---

### 로그인 (GET /auth/login)

**📌 Request Body**

```json
{
  "email": "test@naver.com",
  "password": "1234"
}
```

**📌 Server Response**

✅ Success

```json
{
  "status": 200,
  "message": "로그인 성공"
}
```

❌ Error

```json
{
  "status": 400,
  "error": "로그인 실패"
}
```

### 로그아웃 (GET /auth/logout)

**📌 Server Response**

✅ Success

```json
{
  "status": 200,
  "message": "성공"
}
```

❌ Error

```json
{
  "status": 400,
  "error": "로그인되어 있지 않습니다"
}
```

### 회원가입 (POST /auth/register)

| 컬럼 한글명 | 컬럼 영문명 | 데이터 타입 | 필수여부 | 데이터 예시 |
| --- | --- | --- | --- | --- |
| 이메일 | email | string | Y | test@naver.com |
| 비밀번호 | password | string | Y | password |
| 등급 | rating | string | Y | 일반 | 프리미엄 |
| 이름 | name | string | Y | 테스트 |
| 나이 | age | number | Y | 15 |
| 성별 | gender | string | Y | M | F | N |
| 키 | height | number | Y | 160 |
| 몸무게 | weight | number | Y | 50 |
| 학교 이름 | school | string | Y | ##중학교 |
| 전화번호 | phone | string | Y | 010-0000-0000 |
| 관심 운동 | exercies | [string] | N | [”축구”, “수영”] |

**📌 Request Body**

```json
{
  "email": "test@naver.com",
  "password": "password",
  "rating": "프리미엄",
  "name": "테스트",
  "age": 15,
  "gender": "M",
  "height": 160,
  "weight": 50,
  "school": "광운중학교",
  "phone": "010-0000-0000",
  "experience": "Y",
  "exercies": ["축구", "수영"]
}
```

**📌 Server Response**

✅ Success

```json
{
  "status": 200,
  "message": "회원가입 성공"
}
```

❌ Error

```json
{
  "status": 400,
  "error": "유저 정보가 잘못 입력 되었습니다" | "Google Map API 에러"
}
```

---

### 스포츠 강좌 이용권 정보 가져오기 (GET /sport)

| 컬럼 한글명 | 컬럼 영문명 | 데이터 타입 | 필수여부 | 데이터 예시 | 설명 |
| --- | --- | --- | --- | --- | --- |
| 페이지 | page | number | Y | 1 | 1 페이지당 10개씩 조회 |
| 운동 | exercises | [string] | N | 수영, 배드민턴 | 운동 데이터 필터링 |
| 거리 | distance | number | N | 1.2 | 기본값 5km |
| 시간대 | time | string | N | 오전 | 오전, 오후로 필터링 |

**📌 Request Body**

```json
{
  "page": 1,
  "exercises": ["수영", "배드민턴"],
  "distance": 5,
  "time": "오전" 
}
```

**📌 Server Response**

✅ Success

```json
{
  "status": 200,
  "sports": [
	  {
		  "sport_id": 1,
		  "exercise": "수영",
		  "facility_name": "강남스포츠문화센터수영장",
		  "address": "서울특별시 강남구 밤고개로1길 52 (수서동)",
		  "distance": 2
		  "time": "09:30~10:20"
	  },
	  {
		  "sport_id": 2,
		  "exercise": "배드민턴",
		  "facility_name": "강북웰빙스포츠센터",
		  "address": "서울특별시 강북구 오현로31길 51 (번동)",
		  "distance": 3
		  "time": "09:30~10:20",
	  },
	  ...
  ]
}
```

❌ Error

```json
{
  "status": 400,
  "error": "스포츠 강좌가 존재하지 않습니다"
}
```

### 특정 스포츠 강좌 이용권 정보 상세 조회 (GET /sport/detail/:sport_id)

필터링 예시

| 컬럼 한글명 | 컬럼 영문명 | 데이터 타입 | 필수여부 | 데이터 예시 | 설명 |
| --- | --- | --- | --- | --- | --- |
| 페이지 | page | number | Y | 1 | 1 페이지당 10개씩 조회 |
| 수강료 | price | number | N | 36000 |  |
| 요일 | day | [string] | N | 화, 목 |  |

**📌 Request Body**

```json
{
	"page": 1
  "price": 36000
  "day": ["화", "목"] 
}
```

**📌 Server Response**

✅ Success

```json
{
	"status": 200,
	"sports": [
	  {
	  	"class_id": 1,
		  "facility_name": "강남스포츠문화센터수영장",
		  "facility_type": "수영장",
		  "address": "서울특별시 강남구 밤고개로1길 52 (수서동)",
		  "program_name": "주말그룹레슨A",
		  "exercise": "수영",
		  "begin": "20241101",
		  "end": "20241130",
		  "day": "토",
		  "time": "09:30~10:20",
		  "recruit_cnt": 5,
		  "price": 60000
	  },
	  {
		  "class_id": 2,
		  "facility_name": "강남스포츠문화센터수영장",
		  "facility_type": "수영장",
		  "address": "서울특별시 강남구 밤고개로1길 52 (수서동)",
		  "program_name": "주말그룹레슨B",
		  "exercise": "수영",
		  "begin": "20241101",
		  "end": "20241130",
		  "day": "토",
		  "time": "10:30~11:20",
		  "recruit_cnt": 5,
		  "price": 60000
	  },
	  {
		  "class_id": 3,
		  "facility_name": "강남스포츠문화센터수영장",
		  "facility_type": "수영장",
		  "address": "서울특별시 강남구 밤고개로1길 52 (수서동)",
		  "program_name": "주말그룹레슨C",
		  "exercise": "수영",
		  "begin": "20241101",
		  "end": "20241130",
		  "day": "토",
		  "time": "11:30~12:20",
		  "recruit_cnt": 5,
		  "price": 60000
	  },
	  ...
  ]
}
```

❌ Error

```json
{
  "status": 400,
  "error": "스포츠 강좌가 존재하지 않습니다"
}
```

### AI  추천 운동 조회 (GET /sport/ai)

**📌 Server Response**

✅ Success

```json
{
  "status": 200,
  "exercies": ["철인반", "순환운동", "체조", "장애인스포츠"]
}
```

❌ Error

```json
{
  "status": 400,
  "error": "AI 설문조사 실패"
}
```

### AI 설문조사 전송 (POST /sport/ai)

| 컬럼 한글명 | 컬럼 영문명 | 데이터 타입 | 필수여부 | 데이터 예시 |
| --- | --- | --- | --- | --- |
| 운동 선호도 | preference | number | Y | 10 |
| 운동 강도 | intense | number | Y | 5 |
| 운동 주당 빈도(정기성) | frequency | number | Y | 5 |
| 운동 친구 유무 | friend | number | Y | 10 |
| 운동 목표 | goal | number | Y | 10 |
| 운동 방식 | method | number | Y | 10 |
| 활동성 | activity | number | Y | 5 |
| 실내 vs 실외 | place | number | Y | 10 |
| 운동 시간대 | time | number | Y | 5 |
| 운동 종류 | type | number | Y | 10 |

**📌 Request Body**

```json
{
	"preference": 10,
	"intense": 5,
	"frequency": 5,
	"friend": 10,
	"goal": 10,
	"method": 10,
	"activity": 5,
	"place": 10,
	"time": 5,
	"type": 10
}
```

**📌 Server Response**

✅ Success

```json
{
  "status": 201,
  "message": "AI 설문조사 전송 성공"
}
```

❌ Error

```json
{
  "status": 400,
  "error": "AI 설문조사 전송 실패"
}
```

---

### 내가 등록한 스포츠 강좌 조회 (GET /class)

**📌 Server Response**

✅ Success

```json
{
  "status": 200,
  "class_id": [1, 6, 23]
}
```

❌ Error

```json
{
  "status": 400,
  "error": "스포츠 강좌 조회 실패"
}
```

### 스포츠 강좌 등록 (POST /class/:class_id)

**📌 Server Response**

✅ Success

```json
{
  "status": 201,
  "message": "스포츠 강좌 등록 성공"
}
```

❌ Error

```json
{
  "status": 400,
  "error": "스포츠 강좌 등록 실패"
}
```

### 스포츠 강좌 취소 (DELETE /class/:class_id)

**📌 Server Response**

✅ Success

```json
{
  "status": 200,
  "message": "스포츠 강좌 취소성공"
}
```

❌ Error

```json
{
  "status": 400,
  "error": "스포츠 강좌 취소 실패"
}
```

### 스포츠 강좌 즐겨찾기 조회 (POST /class/bookmark)

**📌 Server Response**

✅ Success

```json
{
  "status": 201,
  "class_id": [1, 4, 6]
}
```

❌ Error

```json
{
  "status": 400,
  "error": "즐겨찾기 조회 실패"
}
```

### 스포츠 강좌 즐겨찾기 등록 (POST /class/bookmark/:class_id)

**📌 Server Response**

✅ Success

```json
{
  "status": 201,
  "message": "즐겨찾기 등록 성공"
}
```

❌ Error

```json
{
  "status": 400,
  "error": "즐겨찾기 등록 실패"
}
```

### 스포츠 강좌 즐겨찾기 취소 (DELETE /class/bookmark/:class_id)

**📌 Server Response**

✅ Success

```json
{
  "status": 200,
  "message": "즐겨찾기 취소 성공"
}
```

❌ Error

```json
{
  "status": 400,
  "error": "즐겨찾기 취소 실패"
}
```

---

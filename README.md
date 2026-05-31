# Satya Tech Academy - Student Learning Platform

Full stack academy management starter project with:

- React + Vite frontend
- Tailwind CSS professional UI
- Spring Boot backend
- JWT authentication
- Student and Admin role-based access
- MySQL database
- Course enrollment
- Manual UPI/QR/Bank transfer payment proof upload
- Admin payment verification
- Certificate request and approval
- Certificate preview/download
- Serial number verification
- Home page chatbot

## Manual Payment Flow

Student selects course -> clicks enroll -> payment section opens -> pays by UPI/QR/Bank Transfer -> enters Transaction ID -> uploads screenshot -> saved as PAYMENT_PENDING -> Admin checks payment -> Admin approves/rejects.

## Run Backend

```bash
cd backend
mvn clean spring-boot:run
```

Before running, update `backend/src/main/resources/application.properties`:

```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.mail.password=YOUR_GMAIL_APP_PASSWORD
```

Default admin login:

```text
email: electricalstudyworld@gmail.com
password: admin12345
```

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

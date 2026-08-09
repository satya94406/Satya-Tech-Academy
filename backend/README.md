# Backend - Satya Certificate System

## Run
```bash
cd backend
mvn spring-boot:run
```

Default admin:
- Email: support@satya-tech-academy.com
- Password: admin12345

## Gmail SMTP
Set Gmail App Password before running:
```bash
export MAIL_USERNAME=support@satya-tech-academy.com
export MAIL_PASSWORD=your_gmail_app_password
```
If SMTP is not set, emails are printed in terminal as MOCK EMAIL.

## MySQL
Default DB is H2 for easy running. For MySQL, edit `src/main/resources/application.properties` and uncomment MySQL block.

# TestForMandiri
Asessment, Test.

Requirements:
1. Visual Studio 2022
2. .Net Core 8.0.6

Features:
1. Backend - Minimal API (RESTful)
2. FrontEnd - Razor Page
3. Dockerize ready
4. In-Memory Database for testing-only

Auto-create database saat running aplikasi, menggunakan in-memory database (tidak perlu install database), untuk mengubah ke MSSQL Server database dapat diubah di aplikasi Backend, file program.cs. Sedangkan untuk Connectionstring nya di aplikasi Backend, file appsettings.json.

2 buah aplikasi yang di running yaitu 
- Backend, Default url: http://localhost:5063, API doc url: http://localhost:5063/swagger
- Frontend, Default url: http://localhost:5144

Untuk mengubah default port applikasi masing-masing, dapat diubah di folder Properties, file launchsetting.json. Jika port default aplikasi Backend diubah, ubah juga di aplikasi Frontend, file appsettings.json agar aplikasi Frontend call API (backened) ke port yang telah diubah.

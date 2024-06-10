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

Auto-create database saat running aplikasi, menggunakan in-memory database (tidak perlu install database), untuk mengubah ke MSSQL Server database dapat diubah di aplikasi Backend, file program.cs

2 buah aplikasi yang di running yaitu 
- Backend,
    a. Default url: http://localhost:5063
    b. API doc url: http://localhost:5063/swagger
- Frontend,
    a. default url: http://localhost:5144

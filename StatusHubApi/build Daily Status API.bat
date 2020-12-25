g:
cd G:\DailyStatusSystem\DailyStatusApi
call mvn clean install -DskipTests
cd target
call java -jar StatusHub-1.0-SNAPSHOT.jar
pause
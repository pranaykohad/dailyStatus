d:
cd D:\PersonnalSpringBoot\DailyStatus\dailyStatus\dailyStatusApi
call mvn clean install -DskipTests
cd target
call java -jar dailyStatusApi-0.0.1-SNAPSHOT.jar
pause
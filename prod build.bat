cd StatusHubUi
call ng build --prod

cd ..\StatusHubApi
call mvn clean
call mvn install -DskipTests

pause;
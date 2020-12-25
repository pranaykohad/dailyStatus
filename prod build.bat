g:

cd G:\DailyStatusSystem New\StatusHubUi

call ng build --prod

cd dist\StatusHub 

call xcopy *  ..\..\..\StatusHubApi\src\main\resources\static /E /R

cd ..\..\..\StatusHubApi

call mvn clean

call mvn install

pause;
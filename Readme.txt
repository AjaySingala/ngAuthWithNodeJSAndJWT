JWT Server (NodeJS):
cd jwt-server

npm init -y

npm install --E cors@2.8.5 nodemon@1.18.10 bcryptjs@2.4.3 sqlite3@4.0.6 njwt@1.0.0 express@4.16.4 body-parser@1.18.3 express-bearer-token@2.2.0

npm start

JWT Client (Angular):
ng new jwt-client --routing --style=css  

npm install -E foundation-sites@6.5.3 ngx-foundation@1.0.8

cd jwt-client
npm install foundation-sites --save
npm i ngx-foundation --save
ng generate service server
ng generate service auth
ng generate component register
ng generate component login
ng generate component profile
ng serve -o

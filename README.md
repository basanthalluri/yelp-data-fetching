Yelp Fusion
The Yelp Fusion API provides access to the industry leading Yelp content and data. The Yelp Fusion Developer Portal includes tools & documentation for building with the Yelp Fusion API, and cool partner integration examples to inspire developers.
After Cloning the project.
 

1. Genererate the yelp fusion api key  and paste it in config file.
    EX: Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.
2. Add your Database Name in db.js
3. Open terminal and change the current directory to project folder path (using  cd "projectfolder/path")
4. Run "npm install" in terminal, this Complete's Downloading the node modules
5. Now run the server with "node server.js"
6. Afer intilization of server, now you can test API's using the postman with localhost:5005/saveVenuData(url) port number 
7. Open postman, add "url" in the params, pass the Request as "POST"  and "Content-Type":"application/x-www-form-urlencoded" in the Header's
8. Now you can pass the venu(Ex: "Restaurents","bar","Playgrounds") details  in the Body.
9. After saving venu, you run the YelpData API using localhost:5005/YelpData(url) and  by passing Location in the Body
10. Now you can check all the bussiness details in monogodb

const express=require('express');
const https=require('https')
const bodyParser = require("body-parser");
const { json } = require('body-parser');
let ejs = require('ejs');
 
const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs')
const date= new Date;
const hours=date.getHours();

app.get('/',(req,res)=>{
    res.render('weather-after',{weather:"", temperature:"x",city:"city-name",id:'',time:hours, unit:"C"})
})
app.get('/about',(req,res)=>{
    res.render('about')
})
app.get('/contacts',(req,res)=>{
    res.render('contacts')
})



app.post('/',(req,res)=>{
    const cityName = req.body.cityName;
    var query = cityName; 
    var unit = "metric";
    var apiKey = "c6b6e70da0b0f83929a03cb591306c9c";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units="+unit;
    
    
    https.get(url,(response)=>{
        response.on("data",(data)=>{
                var weatherReport = JSON.parse(data);
                if(weatherReport.cod===404){
                    console.log(weatherReport.message);
                    res.render('error',{message:weatherReport.message});
                }else if(weatherReport.cod===200){
                    const temp = weatherReport.main.temp;
                    const weather = weatherReport.weather[0].main;
                    const weatherID = weatherReport.weather[0].id;
                    res.render('weather-after', {weather:weather, temperature:temp, city:weatherReport.name, id:weatherID, time:hours, unit:"C"});
                }else{
                    console.log(weatherReport.message);
                    res.render('error',{message:weatherReport.message});
                }
            
        })
        
    })
})


app.listen(80,()=>{
    console.log("listening at port 80"); 
})
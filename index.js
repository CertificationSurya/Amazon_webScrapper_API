// loading env variable
require('dotenv').config();

const express = require("express");
const request = require("request-promise");
const path = require("path")

//initializing app
const app = express() 

const PORT = process.env.PORT || 8000;


// dynamic URLgenerater function
const generateScrapperUrl = (apiKey)=>`http://api.scraperapi.com?api_key=${apiKey}&autoparse=true`



// Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option.
app.use(express.json());

// creating Routers
app.get("/",(req,res)=>{
    // Sending raw strings
    // res.send("Welcome to Amazon Scrapper<h3>Note That you gotta pass your api key in url.E.g: /product/productIdVar?api_key={your api key here}</h3>")

    // sending Html Files
    const htmlFilePath = path.join(__dirname, "index.html");
  res.sendFile(htmlFilePath);
})

// Get Product Details
app.get('/products/:productId', async(req, res)=>{
    const {productId} = req.params;
    
    // req.query will be received by web through URl where user gotta put "api_key=${their key}" 
    const {api_key} = req.query;

    try{
        const response = await request(`${generateScrapperUrl(api_key)}&url=https://www.amazon.com/dp/${productId}`)
        
        
        res.json(JSON.parse(response))
    }
    catch(error){
        res.json(error);
    }
})

// Get Product Review
app.get('/products/:productId/reviews', async(req, res)=>{
    const {productId} = req.params;
    const {api_key} = req.query;
    try{
        const response = await request(`${generateScrapperUrl(api_key)}&url=https://www.amazon.com/product-reviews/${productId}`)
        
        res.json(JSON.parse(response))

    }
    catch(error){
        res.json(error);
    }
})


// Get Product Offers
app.get('/products/:productId/offers', async(req, res)=>{
    const {productId} = req.params;
    const {api_key} = req.query;
    try{
        const response = await request(`${generateScrapperUrl(api_key)}&url=https://www.amazon.com/gp/offer-listing/${productId}`)
        
        res.json(JSON.parse(response))

    }
    catch(error){
        res.json(error);
    }
})


// Get Search Results
app.get('/search/q=:searchQuery', async(req, res)=>{
    const {searchQuery} = req.params;
    const {api_key} = req.query;



    try{
        const response = await request(`${generateScrapperUrl(api_key)}&url=https://www.amazon.com/s?k=${searchQuery}`)
        
        res.json(JSON.parse(response))

    }
    catch(error){
        res.json(error);
    }
})

// listen to the Port (server start), execute callback
app.listen(PORT,()=> console.log("server has started on port : ",PORT))
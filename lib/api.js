
import fetch from 'node-fetch';
import { default as request } from "request";
import { default as fs } from "fs";
//import { default as dotenv } from "dotenv";
//dotenv.config({ path: '../.env' });
import 'dotenv/config' 
import { setTimeout } from 'timers/promises';
console.log(process.env.STRAPIPW) 

class HTTPResponseError extends Error {
    constructor(response, ...args) {
        super(`HTTP Error Response: ${response.status} ${response.statusText}`, ...args);
        this.response = response;
    }
} 
const checkStatus = response => {
    if (response.ok) {
        // response.status >= 200 && response.status < 300
        return response;
    } else {
        throw new HTTPResponseError(response);
    }
}
export async function fetchHTML(query) {

    console.log(`fetchHTML(${query})`)
      const response = await fetch(`${query}`)
      
    try {
        checkStatus(response);
    }
    catch (error) {
        console.error(error);
        const errorBody = await error.response.text();
        console.error(`Error body: ${errorBody}`);
    }
    const body = await response.text();
    return body
    
}
export async function getToken() {
    var result = await setTimeout(15000, 'resolved')
    console.log(`${process.env.STRAPIURL}auth/local`)
    let data = {
        identifier: process.env.STRAPIUN,
        password: process.env.STRAPIPW
      }
    const response = await fetch(`${process.env.STRAPIURL}api/auth/local/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body:
        JSON.stringify(data)
    })
    try {
        checkStatus(response);
    }
    catch (error) {
        console.error(error);
        const errorBody = await error.response.text();
        console.error(`Error body: ${errorBody}`);
    }

        const body = await response.json()
        return body.jwt
    
  
}
export async function putData(token, data,endpoint) {
    const result = await setTimeout(15000, 'resolved')

    const myJSON = JSON.stringify(data);
    const obj = {"data" : data}
    const response = await fetch(`${process.env.STRAPIURL}api/${endpoint}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
        body:JSON.stringify(obj)
    })
    try {
        checkStatus(response);
    }
    catch (error) {
        console.error(error);
        const errorBody = await error.response.text();
        console.error(`Error body: ${errorBody}`);
    }
       
        const body = await response.json()
       return body.jwt
    
}
export async function postData(token, data,endpoint) {
    const result = await setTimeout(15000, 'resolved')
    console.log(`${process.env.STRAPIURL}api/${endpoint}`)
    const myJSON = JSON.stringify(data);
    const obj = {"data" : data}
    const response = await fetch(`${process.env.STRAPIURL}api/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
        body:JSON.stringify(obj)
    })
    try {
        checkStatus(response);
    }
    catch (error) {
        console.error(error);
        const errorBody = await error.response.text();
        console.error(`Error body: ${errorBody}`);
    }
       
        const body = await response.json()
       return body.jwt
    
}   
export async function putImage(headers,data,endpoint) {
    const result = await setTimeout(15000, 'resolved')

    console.log(`${process.env.STRAPIURL}api/${endpoint}`)
    const response = await fetch(`${process.env.STRAPIURL}api/${endpoint}`, {
        method: 'POST',
        headers: headers,
        body:data
    })
    try {
        checkStatus(response);
    }
    catch (error) {
        console.error(error);
        const errorBody = await error.response.text();
        console.error(`Error body: ${errorBody}`);
    }
   // console.log(response)       
        const body = await response.json()
        return body
    
}
export async function download (uri, filename, callback){
    console.log(process.env.DOWNLOADSDIRECTORY)
    request.head(uri, function(err, res, body){    
        request(uri).pipe(fs.createWriteStream(`${process.env.DOWNLOADSDIRECTORY}${filename}`))
        .on('close', callback);
    });
    return(`${process.env.DOWNLOADSDIRECTORY}${filename}`)
  };
  
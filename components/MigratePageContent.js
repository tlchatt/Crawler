import {fetchHTML,getToken,putData,postData,putImage,download} from '../lib/api.js'
import { parse } from 'node-html-parser';
import { default as FormData } from "form-data";
import { default as fs } from "fs";
export const MigratePageContent = async (targetDomain,URLList)=>{
    
   
    for (const element of URLList) {
        if (element == targetDomain){
            console.log('begin crawl and push homepage')
            let page = await crawlContentHomepage(element)
            let pushContentResultHomePage = await pushContentHomePage(page)
            console.log(pushContentResultHomePage)
        }
        else{
            console.log('begin crawl and push other page')
            let page = await crawlContentPage(element,targetDomain)
            let pushContentResultPage = await pushContenPage(page)
            console.log(pushContentResultPage)
        }
    }
    return true
}
async function crawlContentHomepage(url){
    
    /**
     * Pulls all content Images
     * Gets data-bg attribure for hero images
     * 
     */
    var HomePage = { // leaving out HeroImage
        Content:'',
        MetaTitle:'',
        Description:''
    }
    let urlContent = await fetchHTML(url)
    const root = parse(urlContent);
    let header = root.querySelector('header')
    header.remove()
    let footer = root.querySelector('footer')
    footer.remove()
  
    var domNodes = root.querySelectorAll('*')
    console.log(domNodes.length)
    let index= 0
    for (const element of domNodes) {
        index += 1;
       
        if('style' in element.attributes){
            //need catch style="bg-image here"
        }
        if('data-bg' in element.attributes){
           let fileURL = await uploadImages(element.attributes['data-bg'])
           let newTag = `<div class="background-Image" style="background-image:url(${fileURL})";><p>Background Image Was Here</p> </div>`
           HomePage.Content += newTag
        }
        if(element.tagName == 'TITLE'){
            HomePage.MetaTitle += element.innerHTML
            //       console.log(`TITLE ${element.innerHTML}`)
        }
        if(element.tagName == 'META'){
            if('name' in element.attributes){
                if(element.attributes['name'] === 'description'){
                    HomePage.Description += element.attributes['content']
                    //  console.log(`Meta Description ${element.attributes['content']}`)
                }
         
            }
        }
        if(element.tagName == 'IMG'){
          
            if(element.attributes['src']){
                console.log(`src ${index}`)
                let fileURL = await uploadImages(element.attributes['src'])
                element.attributes['src'] = fileURL
                HomePage.Content += element.outerHTML
                continue;
            }
            if(element.attributes['data-src'] && element.attributes['data-src'] !=''){
                console.log(`Data-src ${index}`)
                let fileURL = await uploadImages(element.attributes['data-src'])
                console.log(`fileURL ${fileURL}  ${index}`)
                element.setAttribute('src',fileURL)
                element.setAttribute('data-src','')

                console.log(`element .attribures ${element.attributes['data-src']}  ${index}`)
                HomePage.Content += element.outerHTML
                continue;
            }
           
                console.log(`Ground Control To Major Tom ${index}`)
                console.log(element.attributes)
                console.log(element.attributes['src'])
                console.log(element)
            
            
       
        }
        if(element.tagName == 'H1'){
            HomePage.Content += element.outerHTML
        //      console.log(`H1 ${index}`)
        }
        if(element.tagName == 'H2'){
            HomePage.Content += element.outerHTML
        //     console.log(`H2 ${index}`)
        }
        if(element.tagName == 'H3'){
            HomePage.Content += element.outerHTML
        //     console.log(`H3 ${index}`)
        }
        if(element.tagName == 'H4'){
            HomePage.Content += element.outerHTML
         //     console.log(`H4 ${index}`)
        }
        if(element.tagName == 'H5'){
            HomePage.Content += element.outerHTML
        //    console.log(`H5 ${index}`)
        }
        if(element.tagName == 'H6'){
            HomePage.Content += element.outerHTML
         //   console.log(`H6 ${index}`)
        }
        if(element.tagName == 'P'){
            HomePage.Content += element.outerHTML
         //   console.log(`P ${index}`)
        }
        if(element.tagName == 'SPAN'){
            HomePage.Content += element.outerHTML
         //   console.log(`SPAN ${index}`)
        }
        if(element.tagName == 'A'){
            HomePage.Content += element.outerHTML
         //   console.log(`A ${index}`)
        }
        if(element.tagName == 'UL'){
            HomePage.Content += element.outerHTML
         //   console.log(`UL ${index}`)
        }
        if(element.tagName == 'OL'){
            HomePage.Content += element.outerHTML
          //  console.log(`OL ${index}`)
        }
    }

    return HomePage

}
async function crawlContentPage(url,targetDomain){
    
    let urlString = url.replace(targetDomain, "/");
    console.log(`urlString ${urlString}`)
        /**
         * Pulls all content Images
         * Gets data-bg attribure for hero images
         * 
         */
        var Page = { // leaving out HeroImage
            Content:'',
            MetaTitle:'',
            Description:'',
            Url:urlString
        }
        let urlContent = await fetchHTML(url)
        const root = parse(urlContent);
        let header = root.querySelector('header')
        header.remove()
        let footer = root.querySelector('footer')
        footer.remove()
    
        var domNodes = root.querySelectorAll('*')
        console.log(domNodes.length)
        let index= 0
        for (const element of domNodes) {
            index += 1;
        
            if('style' in element.attributes){
                //need catch style="bg-image here"
            }
            if('data-bg' in element.attributes){
            let fileURL = await uploadImages(element.attributes['data-bg'])
            let newTag = `<div class="background-Image" style="background-image:url(${fileURL})";><p>Background Image Was Here</p> </div>`
            Page.Content += newTag
            }
            if(element.tagName == 'TITLE'){
                Page.MetaTitle += element.innerHTML
                //       console.log(`TITLE ${element.innerHTML}`)
            }
            if(element.tagName == 'META'){
                if('name' in element.attributes){
                    if(element.attributes['name'] === 'description'){
                        Page.Description += element.attributes['content']
                        //  console.log(`Meta Description ${element.attributes['content']}`)
                    }
            
                }
            }
            if(element.tagName == 'IMG'){
            
                if(element.attributes['src']){
                    console.log(`src ${index}`)
                    console.log(`element  src ${element}`)
                    let fileURL = await uploadImages(element.attributes['src'])
                    element.attributes['src'] = fileURL
                    Page.Content += element.outerHTML
                    continue;
                }
                if(element.attributes['data-src'] && element.attributes['data-src'] !=''){
                    console.log(`Data-src ${index}`)
                    let fileURL = await uploadImages(element.attributes['data-src'])
                    console.log(`fileURL ${fileURL}  ${index}`)
                    element.setAttribute('src',fileURL)
                    element.setAttribute('data-src','')

                    console.log(`element .attribures ${element.attributes['data-src']}  ${index}`)
                    Page.Content += element.outerHTML
                    continue;
                }
            
                    console.log(`Ground Control To Major Tom ${index}`)
                    console.log(element.attributes)
                    console.log(element.attributes['src'])
                    console.log(element)
                
                
        
            }
            if(element.tagName == 'H1'){
                Page.Content += element.outerHTML
            //      console.log(`H1 ${index}`)
            }
            if(element.tagName == 'H2'){
                Page.Content += element.outerHTML
            //     console.log(`H2 ${index}`)
            }
            if(element.tagName == 'H3'){
                Page.Content += element.outerHTML
            //     console.log(`H3 ${index}`)
            }
            if(element.tagName == 'H4'){
                Page.Content += element.outerHTML
            //     console.log(`H4 ${index}`)
            }
            if(element.tagName == 'H5'){
                Page.Content += element.outerHTML
            //    console.log(`H5 ${index}`)
            }
            if(element.tagName == 'H6'){
                Page.Content += element.outerHTML
            //   console.log(`H6 ${index}`)
            }
            if(element.tagName == 'P'){
                Page.Content += element.outerHTML
            //   console.log(`P ${index}`)
            }
            if(element.tagName == 'SPAN'){
                Page.Content += element.outerHTML
            //   console.log(`SPAN ${index}`)
            }
            if(element.tagName == 'A'){
                Page.Content += element.outerHTML
            //   console.log(`A ${index}`)
            }
            if(element.tagName == 'UL'){
                Page.Content += element.outerHTML
            //   console.log(`UL ${index}`)
            }
            if(element.tagName == 'OL'){
                Page.Content += element.outerHTML
            //  console.log(`OL ${index}`)
            }
        }

        return Page

}
async function pushContentHomePage(data){

    let token = await getToken()
    let putDataResult = await putData(token, data, 'home-page')

    /**
     * Push Content Object to Homepae
     * 
     */ 
  
   return putDataResult

}
async function pushContenPage(data){

    let token = await getToken()
    let putDataResult = await postData(token, data, 'pages')

    /**
     * Push Content Object to Homepae
     * 
     */ 
  
    //return ?

}
async function uploadImages(imageURL){  

    let token = await getToken()
        var fileName = imageURL.split('/').reverse()[0]
        console.log('begin  Download'); // true
        let downloadReturn= await download(imageURL, fileName, function(){
            //console.log('Closed')
        });
        console.log('downloadReturn complete'); // true
        
        var fd = new FormData();
        fd.append('files', fs.createReadStream(downloadReturn));
        //fd.append("ref", 'shopifyuser');
        //fd.append("refId", internalID);
        //fd.append('field', 'SalesTaxExemptionCertificate')
        const headers = fd.getHeaders()
        headers['Authorization'] = 'Bearer ' + token
        console.log('begin  Upload'); // true   
        let putImageResult = await putImage(headers, fd, 'upload')
        console.log('Upload complete'); // true
        return (putImageResult[0].url)


}


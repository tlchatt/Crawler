import { parse } from 'node-html-parser';
import convert  from 'xml-js' 
import {fetchHTML} from '../lib/api.js'
import {getBaseDomain, getBaseDomainVariant} from '../lib/helpers.js'


export const EnumerateURLList = async (targetDomain,targetSitemap) =>{
    console.log(`EnumerateURLList(${targetDomain},${targetSitemap})`)
    //console.log(targetDomain,targetSitemap)

    var URLList = {}

    let baseURLHrefs = await crawlHrefs(targetDomain)
    console.log(`baseURLHrefs length ${baseURLHrefs.length}`)

    let baseURLList = await formatHrefs(targetDomain,baseURLHrefs)
        //console.log(`baseURLList length ${baseURLList.length}`)

    let siteMapURLHrefs = await getSitemapURLList(targetSitemap)
        //console.log(`siteMapURLHrefs length ${siteMapURLHrefs.length}`)

    let siteMapURLList = await formatHrefs(targetDomain,siteMapURLHrefs)
   // console.log(`siteMapURLList length ${siteMapURLList.length}`)

    URLList = [...new Set([...baseURLList,...siteMapURLList])];
        //console.log(`URLList length Prior to Exapnd ${URLList.length}`)

    let expandedHrefs = await expandListFromURLList(URLList)
    //console.log(`expandedHrefs length ${expandedHrefs.length}`)

    
    let expandedURLList = await formatHrefs(targetDomain,expandedHrefs)
    //console.log(`expandedURLList length ${expandedURLList.length}`)

    URLList = [...new Set([...URLList,...expandedURLList])];
    //console.log(`URLList length  ${URLList.length}`)

 return(URLList)
}
async function crawlHrefs(url){
    /**
     * Pulls all href portion of links only returns array
     */
    let hrefs = []
    let urlContent = await fetchHTML(url)
    const root = parse(urlContent);
    var links = root.querySelectorAll('a')
    links.forEach(element => hrefs.push(element.getAttribute('href')))   
    return hrefs
}
async function formatHrefs(domain,baseURLHrefs){
 
    /**Next problem need correct site url not just base url so this will work for subpages */
    /**
     * Check hrefs, return array of all local including all https non https www and non www (in case of malformated links)
     * Does not return any links which cant be crawled like .pdf .js .jpg
     */

    var basedomain = await getBaseDomain(domain)
    var basedomainVariant = await getBaseDomainVariant(domain)
    let urls = baseURLHrefs.reduce(function(result,element){

        if (element == '/'){
            //console.log(`formatHref Rejecting 1 ${element}`)
             return result
        }
        if(element.includes('mailto:') || element.includes('tel:')){
           // console.log(`formatHref Rejecting 2 ${element}`)
            return result
        }
        if(element.includes(basedomain)){ //keep urls with base domain regardless of scheme or subdomain
            //console.log(`formatHref Keeping ${element}`)
            
            result.push(element)
            return result
        }
        if(element.includes('http') || element.includes('www') || element.includes('.') ){//remove external domains. 
           // console.log(`formatHref Rejecting 3 ${element}`)
            return result
        }
        if (element.indexOf('/') === 0){
            //console.log(`formatHref Keeping 2${basedomainVariant}${element}`)
            let pushValue = `${basedomainVariant}${element}`
             result.push(pushValue)
             return result
        }
        if (element.includes('#') ){
            return result
           
        }
        console.log(`UNHANDLED EXCEPTION with ${element}`)
        return result
    }, []);
    /**
     *  if(basedomainVariant.split('.').length == element.split('.').length){ // checks for no file extension like .js .pdf
                console.log(`formatHref urls.reduce rejecting ${element}`)
                return
            }
    */
  
    return urls
}
async function getSitemapURLList(url){  
    /**
     * pulls list of loc from sitemap, typically these are formated as desired
     */
    let urls = []
    let urlContent = await fetchHTML(url)
    var result1 = convert.xml2js(urlContent, {compact: true, spaces: 4});
    result1.urlset.url.forEach(element => urls.push(element.loc._text))
    return urls

}
async function expandListFromURLList (URLList){

    for (const element of URLList) {
        let list = await crawlHrefs(element)
        URLList = [...new Set([...list,...URLList])];

    }
    return (URLList)
}
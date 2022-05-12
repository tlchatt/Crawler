export async function getBaseDomain(url) {
    var url = url.replace('http://', '').replace('https://', '') 
    while (url.split('/').length > 1) { //removes all url params
        url = url.split("/").shift(); //always want the first
    }
    if (url.split('.').length - 1 > 1){ //handles the removal of any subdomain including www. 
        url = url.split('.')
        url.shift()
        url= url.join('.')
    
    }    
    return(url)
}
export async function getBaseDomainVariant(url) {
    let scheme = ''
    let subdomain = ''
    if (url.includes('https://')) scheme = 'https://'
    if (url.includes('http://')) scheme = 'http://'
    if (url.includes('www')) subdomain = 'www.'
    
    var url = url.replace('http://', '').replace('https://', '') 
    while (url.split('/').length > 1) { //removes all url params
        url = url.split("/").shift(); //always want the first
    }
    if (url.split('.').length - 1 > 1){ //handles the removal of any subdomain including www. 
        url = url.split('.')
        url.shift()
        url= url.join('.')
    
    }    
    return(`${scheme}${subdomain}${url}`)
}

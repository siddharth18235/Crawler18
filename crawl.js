const {JSDOM}=require('jsdom')
async function crawlPage(baseURL,currentURL,pages)
{
  console.log(`actively crawling: ${currentURL}`)
  const baseURLObj=new URL(baseURL)
  const currentURLObj=new URL(currentURL)

  if(baseURLObj.hostname!== currentURLObj.hostname)
  {
    return pages
  }
  const normalizedCurrnetURL=normalizeURL(currentURL)
  if(pages[normalizedCurrnetURL]>0)
  {
    pages[normalizedCurrnetURL]++
    return pages
  }
  pages[normalizedCurrnetURL]=1
  try{
  const resp=await fetch(currentURL)

  
  if(resp.status>399)
  {
    console.log(`error in status code : ${resp.status}on page: ${currentURL}`)
    return pages
  }
  const contentType=resp.headers.get("content-type")
   if(!contentType.includes("text/html"))
   {
    console.log(`non html response,content type: ${contentType},on page ${currentURL}`)
    return pages
   }
   
  const htmlbody=await resp.text()
  const nextURLs=getURLsFromHTML(htmlbody,baseURL)
  for(const nextURL of nextURLs)
  {
    pages= await crawlPage(baseURL,nextURL,pages)
  }
  }catch(err){
    console.log(`error in fetch: ${err.message} on page ${currentURL}` )

  }
  return pages

}
function getURLsFromHTML(htmlBody,baseURL)
{
    const urls = []
    const dom = new JSDOM(htmlBody) 
    const linkElements=dom.window.document.querySelectorAll('a')
    
    for(const linkElement of linkElements)
    {   
        if(linkElement.href.slice(0,1)==='/')
    {
        urls.push(`${baseURL}${linkElement.href}`)
        // try{
        //     const urlObj=new URL(`${baseURL}${linkElement.href}`)
        //     urls.push(urlobj.href)
        // }catch(err){
        //     console.log(`error with relative url: ${err.message}`)
        // }

    }
    else
    {
        urls.push(linkElement.href);

        //absolute
        // try{
        //     const urlObj=new URL(linkElement.href)
        //     urls.push(urlobj.href)
        // }catch(err){
        //     console.log(`error with absolute url: ${err.message}`)
        // }
        
    }
        
    }
    return urls
}
function normalizeURL(urlString)
{
    const urlobj= new URL(urlString)
    const hostPath=`${urlobj.hostname}${urlobj.pathname}`
    if(hostPath.length>0 && hostPath.slice(-1)==='/')
    {
        return hostPath.slice(0,-1)
    }
    return hostPath
}
module.exports={   
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}
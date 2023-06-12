const {normalizeURL,getURLsFromHTML}=require('./crawl.js')
const {test, expect}=require('@jest/globals')
test('normalizeURL strip protocol',()=>{
    const input ='https://blog.boot.dev/path'
    const actual= normalizeURL(input)
    const expected ='blog.boot.dev/path'
    expect(actual).toEqual(expected)

})
test('normalizeURL strip trailing',()=>{
    const input ='https://blog.boot.dev/path/'
    const actual= normalizeURL(input)
    const expected ='blog.boot.dev/path'
    expect(actual).toEqual(expected)

})
test('normalizeURL capitals',()=>{
    const input ='https://BLOG.boot.dev/path'
    const actual= normalizeURL(input)
    const expected ='blog.boot.dev/path'
    expect(actual).toEqual(expected)

})
test('normalizeURL strip http',()=>{
    const input ='http://blog.boot.dev/path'
    const actual= normalizeURL(input)
    const expected ='blog.boot.dev/path'
    expect(actual).toEqual(expected)

})
test('getURLsFromHTML absolute',()=>{
    const inputHTMLBody=`<html>
    <body>
    <a href="http://blog.boot.dev/path/">
    Boot.dev Blog
    </a>
    </body>
    </html>`
    const inputBaseURL="http://blog.boot.dev/path/";
    const actual= getURLsFromHTML(inputHTMLBody,inputBaseURL)
    const expected =["http://blog.boot.dev/path/"]
    expect(actual).toEqual(expected)

})
test('getURLsFromHTML relative',()=>{
    const inputHTMLBody=`<html>
    <body>
    <a href="/path/">
    Boot.dev Blog
    </a>
    </body>
    </html>`
    const inputBaseURL="http://blog.boot.dev";
    const actual= getURLsFromHTML(inputHTMLBody,inputBaseURL)
    const expected =["http://blog.boot.dev/path/"]
    expect(actual).toEqual(expected)

})
test('getURLsFromHTML both', () => {
    const inputURL = 'https://blog.boot.dev'
    const inputBody = '<html><body><a href="/path/one"><span>Boot.dev></span></a><a href="https://other.com/path/one"><span>Boot.dev></span></a></body></html>'
    const actual = getURLsFromHTML(inputBody, inputURL)
    const expected = [ 'https://blog.boot.dev/path/one', 'https://other.com/path/one' ]
    expect(actual).toEqual(expected)
  })
//   test('getURLsFromHTML invalid',()=>{
//     const inputHTMLBody=`<html>
//     <body>
//     <a href="invalid">
//     invalid URL
//     </a>
//     </body>
//     </html>`
//     const inputBaseURL="http://blog.boot.dev";
//     const actual= getURLsFromHTML(inputHTMLBody,inputBaseURL)
//     const expected =[]
//     expect(actual).toEqual(expected)

// })


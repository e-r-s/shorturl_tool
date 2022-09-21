 import {Builder, Browser, By, Key, until} from 'selenium-webdriver';
 
import * as chrome from 'selenium-webdriver/chrome.js';

 import fs from 'fs';
import fetch from 'node-fetch';
import jsdom from 'jsdom';
import robot from 'robotjs';

const { JSDOM } = jsdom;



 
robot.moveMouse(100, 100);

// robot.keyToggle('command','down');
robot.keyTap('S', 'command');
// robot.keyTap("enter");
 
  
var LoadPage  = async function(url){
 
    let builder = await new Builder();
    
    builder.forBrowser(Browser.CHROME);
     let options =  new  chrome.Options(); // builder.getChromeOptions();
    
     //console.log(builder.);
    options.setUserPreferences({ "download.default_directory": '/Users/ersinceylan/projects/shorturl_assignement/tools/', 'download.prompt_for_download': false });

   builder.setChromeOptions(options);
    let driver = await  builder.build();

    
    // let driver = await new Builder()
    //     .forBrowser(Browser.CHROME)
    //     .setChromeOptions(new chrome.Options().setUserPreferences(
    //         { "download.default_directory": './' }
    //     )).build();


    // let options = new chrome.Options(driver);
    // options.setUserPreferences({ "download.default_directory": './' });
    // builder.setChromeOptions(options);

    try {
        await driver.get(url);
        await driver.sleep(1000);  

        robot.keyTap('s', 'command'); 
        await driver.sleep(2000); 
        robot.keyTap('/');  
        await driver.sleep(2000); 
        robot.typeString('Users/ersinceylan/projects/shorturl_assignement/tools/test/'); 
        await driver.sleep(2000); 
        robot.keyTap("enter");
        await driver.sleep(2000);  
        robot.typeString(new Date().getTime()); 
        await driver.sleep(2000);  
        robot.keyTap("enter"); 
        await driver.sleep(2000); 

        // driver.actions({ bridge: true })
        // .keyDown(Key.COMMAND).sendKeys("s").keyUp(Key.COMMAND).perform();

        // await driver.actions({ bridge: true })
        // .sendKeys('{CTRL}s{CTRL}').perform();
        // await driver.actions({ bridge: true })
        //  .sendKeys([Key.COMMAND, Key.SPACE]).perform();

        // await driver.actions({ bridge: true })
        // .keyDown(Key.CONTROL) 
        // .sendKeys('s') 
        // .keyUp(Key.CONTROL)
        // .perform();
 
       //  fs.writeFileSync('source2.html', source); 
        
        // await Screenshot(driver); 
         await driver.sleep(2000);
       
      } finally {
         //await driver.quit();
      }
}
 


async function Screenshot(driver) {
    var now = (Date.now()/1e3)|0 ;

    var totalHeight = await driver.executeScript('return document.body.offsetHeight');
    var windowHeight = await driver.executeScript('return window.outerHeight');
  
    for (var i = 0; i <= (totalHeight/windowHeight); i++) {
      await driver.executeScript(`window.scrollTo(0, window.outerHeight*${i})`);
     
      await driver.takeScreenshot().then(data =>  {
        fs.writeFile(`./`+`home-${i}-${now}.png`, data.replace(/^data:image\/png;base64,/,''), 'base64', err => {
          if(err) throw err
        });
      });

    }
   
  }



  var IMAGEStoPDF= function (id, images, pdfFileName, cb){
    var pdfFolder= './pdfs/' + id + '_' + nanoid().replace(new RegExp('-','g'),'_') +'/';
    fs.mkdir(pdfFolder, { recursive: true }, function(err) {
        var cmd = 'convert '+images.join(' ')+' -quality 100 '+pdfFolder+ pdfFileName;
        var procs = exec(cmd);
        procs.on('exit', function(e) {
            cb({  id:id, pdf:pdfFolder+ pdfFileName, images:images  });
        });
    }); 
}

  
  async function LoadMeta(url, fileName) {

   
      
  const readMetaContent =  ({parentElement, property, name, type}) =>{
    var selector = "";
    if(property){
      selector= 'property="'+property+'"';
    }
    if(name){
      selector= 'name="'+name+'"';
    }
    if(type){
      selector= 'type="'+type+'"';
    }
    var el = parentElement.querySelector('meta['+selector+']');
    if(el){
        return el.getAttribute('content');
    }
    return null;

  }

  const readLinkContent =  ({parentElement, rel}) =>{
    var selector = "";
    if(rel){
      selector= 'rel="'+rel+'"';
    }
     
    var el = parentElement.querySelector('link['+selector+']');
    if(el){
        return el.getAttribute('href');
    }
    return null;

  } 

  //   api.getHtml(url).then((data)=>{
  //     var div = document.createElement('div');
  //     div.innerHTML = data;
     
      
  //     console.log(pageData);

        const response = await fetch(url);
        
        
        const body = await response.text();
        
        fs.writeFileSync('source2.html', body); 

        const dom = new JSDOM(body); 

        var headHtml  = dom.window.document.head.innerHTML;
        var parentElement = dom.window.document.head;

         
        var metaContent = {
            title: readMetaContent({parentElement:parentElement, name:'title'}),
            description: readMetaContent({parentElement:parentElement, name:'description'}),
            author: readMetaContent({parentElement:parentElement, name:'author'}),

            link_image:readLinkContent({parentElement:parentElement, rel:'image_src'}), 
            link_apple_icon:readLinkContent({parentElement:parentElement, rel:'apple-touch-icon'}), 

            og_locale: readMetaContent({parentElement:parentElement, property:'og:locale'}),
            og_type: readMetaContent({parentElement:parentElement, property:'og:type'}),
            og_url: readMetaContent({parentElement:parentElement, property:'og:url'}),
            og_title: readMetaContent({parentElement:parentElement, property:'og:title'}),
            og_description: readMetaContent({parentElement:parentElement, property:'og:description'}),
            og_site_name: readMetaContent({parentElement:parentElement, property:'og:site_name'}),
            og_image: readMetaContent({parentElement:parentElement, property:'og:image'}),
  
            twitter_card: readMetaContent({parentElement:parentElement, name:'twitter:card'}),
            twitter_domain: readMetaContent({parentElement:parentElement, name:'twitter:domain'}),
            twitter_title: readMetaContent({parentElement:parentElement, name:'twitter:title'}),
            twitter_description: readMetaContent({parentElement:parentElement, name:'twitter:description'}),
            twitter_image: readMetaContent({parentElement:parentElement, name:'twitter:image:src'}),
            
            hostname: readMetaContent({parentElement:parentElement, name:'hostname'}),
            
            article_publisher: readMetaContent({parentElement:parentElement, property:'article:publisher'}),
            article_modified_time: readMetaContent({parentElement:parentElement, property:'article:modified_time'}),
            article_published_time: readMetaContent({parentElement:parentElement, property:'article:published_time'}) 
        };
  
        var pageData={ 
            title: metaContent.title || metaContent.og_title || metaContent.twitter_title || m.window.document.head.querySelector('title').innerHTML,
            description: metaContent.description || metaContent.og_description || metaContent.twitter_description,
            image: metaContent.og_image || metaContent.link_image || metaContent.link_apple_icon, 
            author: metaContent.author || metaContent.article_publisher || metaContent.og_site_name,
            lastModified: response.headers.get('last-modified') || metaContent.article_modified_time, 
            publishTime: metaContent.article_published_time || response.headers.get('last-modified') || metaContent.article_modified_time, 
            siteName: metaContent.og_site_name || metaContent.hostname,
            url:url,
            metaContent
        };

        var headerContent = '';
        var allElements = parentElement.querySelectorAll('*');
        allElements.forEach(el=>{ 
            if(el.tagName.toLowerCase()=='script' || el.tagName.toLowerCase()=='noscript'){

            }
            else{
                headerContent+= el.outerHTML;
            }
        })
        pageData.remadeContent =  '<html><head>'+headerContent+'</head><body><h1>'+pageData.title+'</h1><img src="'+pageData.image+'" title="'+pageData.title+'" />'+pageData.description+'<a href="'+url+'" title="'+pageData.title+'">'+url+'</a></body></html>';

        console.log(pageData);

        fs.writeFile(`./`+fileName+`.html`, pageData.remadeContent, err => {
            if(err) throw err
          });
        
        

  }
//  LoadMeta('https://ieeexplore.ieee.org/document/1663693', 'aaa');

LoadPage('https://ieeexplore.ieee.org/document/1663693');

//LoadPage('https://stackoverflow.com/questions/3422262/how-can-i-take-a-screenshot-with-selenium-webdriver');


// every 10sec
// get
// url
// email
// mobile
// add timestamp as paramter
// server location (eu, asia, us)
// fail call url (if fail sends request to this url)
// 
// 

//